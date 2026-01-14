<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\LoginHistory;
use App\Models\UserSession;
use App\Services\GeoLocationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect to social provider
     * 
     * @param string $provider
     * @return \Illuminate\Http\JsonResponse
     */
    public function redirect($provider)
    {
        try {
            $this->validateProvider($provider);
            
            $redirectUrl = Socialite::driver($provider)->stateless()->redirect()->getTargetUrl();
            
            return response()->json([
                'success' => true,
                'redirect_url' => $redirectUrl
            ]);
        } catch (\Exception $e) {
            Log::error("Social auth redirect error ({$provider}): " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to initialize social authentication',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Handle callback from social provider
     * 
     * @param string $provider
     * @return \Illuminate\Http\Response
     */
    public function callback(Request $request, $provider)
    {
        try {
            $this->validateProvider($provider);
            
            // Check for OAuth error
            if ($request->has('error')) {
                $errorMessage = $request->get('error_description', 'Authentication was cancelled');
                Log::warning("OAuth error ({$provider}): " . $errorMessage);
                
                // Redirect to frontend with error
                return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/auth/callback?error=' . urlencode($errorMessage));
            }
            
            // Get user from provider
            $socialUser = Socialite::driver($provider)->stateless()->user();
            
            // Find or create user
            $user = $this->findOrCreateUser($socialUser, $provider);
            
            // Create token
            $token = $user->createToken('auth_token')->plainTextToken;
            
            // Log the login
            $this->logLogin($user, $request);
            
            // Create user session (same as regular login)
            try {
                $createdToken = $user->tokens()->latest()->first();
                
                if ($createdToken) {
                    $ipAddress = $this->getRealIpAddress($request);
                    
                    UserSession::create([
                        'user_id' => $user->id,
                        'token_id' => $createdToken->id,
                        'ip_address' => $ipAddress,
                        'user_agent' => $request->userAgent(),
                        'device_name' => 'OAuth Login via ' . ucfirst($provider),
                        'browser' => $this->getBrowser($request->userAgent()),
                        'platform' => $this->getPlatform($request->userAgent()),
                        'location' => $this->getLocationFromIP($ipAddress),
                        'last_activity' => now(),
                    ]);
                    
                    Log::info('OAuth session created successfully', [
                        'user_id' => $user->id,
                        'provider' => $provider,
                        'token_id' => $createdToken->id,
                    ]);
                }
            } catch (\Exception $e) {
                Log::warning('Failed to create OAuth session: ' . $e->getMessage());
            }
            
            // Redirect to frontend with token and user data
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            $redirectUrl = $frontendUrl . '/auth/callback?' . http_build_query([
                'success' => 'true',
                'token' => $token,
                'user' => json_encode([
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'avatar' => $user->avatar,
                    'role' => $user->role,
                    'provider' => $provider,
                ])
            ]);
            
            return redirect($redirectUrl);
            
        } catch (\Exception $e) {
            Log::error("Social auth callback error ({$provider}): " . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            
            // Redirect to frontend with error
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect($frontendUrl . '/auth/callback?error=' . urlencode('Authentication failed: ' . $e->getMessage()));
        }
    }

    /**
     * Find or create user from social provider data
     * 
     * @param \Laravel\Socialite\Contracts\User $socialUser
     * @param string $provider
     * @return User
     */
    private function findOrCreateUser($socialUser, $provider)
    {
        // Try to find user by provider ID
        $user = User::where('provider', $provider)
                    ->where('provider_id', $socialUser->getId())
                    ->first();
        
        if ($user) {
            // Update existing user info
            $user->update([
                'name' => $socialUser->getName() ?? $user->name,
                'avatar' => $socialUser->getAvatar() ?? $user->avatar,
                'provider_token' => $socialUser->token,
                'provider_refresh_token' => $socialUser->refreshToken ?? null,
            ]);
            
            return $user;
        }
        
        // Try to find user by email
        $user = User::where('email', $socialUser->getEmail())->first();
        
        if ($user) {
            // Link existing account to social provider
            $user->update([
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
                'provider_token' => $socialUser->token,
                'provider_refresh_token' => $socialUser->refreshToken ?? null,
                'avatar' => $socialUser->getAvatar() ?? $user->avatar,
                'email_verified_at' => $user->email_verified_at ?? now(), // Verify email if coming from social
            ]);
            
            return $user;
        }
        
        // Create new user
        $username = $this->generateUniqueUsername($socialUser);
        
        $user = User::create([
            'name' => $socialUser->getName() ?? 'User',
            'username' => $username,
            'email' => $socialUser->getEmail(),
            'password' => Hash::make(uniqid()), // Random password for social users
            'avatar' => $socialUser->getAvatar() ?? generateDefaultAvatar($socialUser->getName() ?? 'User'),
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
            'provider_token' => $socialUser->token,
            'provider_refresh_token' => $socialUser->refreshToken ?? null,
            'email_verified_at' => now(), // Social logins are pre-verified
            'role' => 'user', // Default role
        ]);
        
        return $user;
    }

    /**
     * Generate unique username from social user data
     * 
     * @param \Laravel\Socialite\Contracts\User $socialUser
     * @return string
     */
    private function generateUniqueUsername($socialUser)
    {
        // Try email username first
        $baseUsername = explode('@', $socialUser->getEmail())[0];
        $baseUsername = preg_replace('/[^a-zA-Z0-9_]/', '', $baseUsername);
        
        if (empty($baseUsername)) {
            $baseUsername = 'user';
        }
        
        $username = $baseUsername;
        $counter = 1;
        
        // Ensure uniqueness
        while (User::where('username', $username)->exists()) {
            $username = $baseUsername . $counter;
            $counter++;
        }
        
        return $username;
    }

    /**
     * Log user login
     * 
     * @param User $user
     * @param Request $request
     * @return void
     */
    private function logLogin($user, $request)
    {
        try {
            LoginHistory::create([
                'user_id' => $user->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status' => 'success',
                'login_method' => 'social_auth',
            ]);
        } catch (\Exception $e) {
            Log::warning('Failed to log social login: ' . $e->getMessage());
        }
    }

    /**
     * Validate provider
     * 
     * @param string $provider
     * @throws \Exception
     */
    private function validateProvider($provider)
    {
        $allowedProviders = ['google', 'github'];
        
        if (!in_array($provider, $allowedProviders)) {
            throw new \Exception("Provider {$provider} is not supported");
        }
    }

    /**
     * Helper to extract browser from user agent
     * 
     * @param string $userAgent
     * @return string
     */
    private function getBrowser($userAgent)
    {
        if (!$userAgent) return 'Unknown Browser';
        
        // Check for specific browsers in order (most specific first)
        if (preg_match('/Edg\//i', $userAgent)) return 'Microsoft Edge';
        if (preg_match('/OPR\//i', $userAgent) || preg_match('/Opera/i', $userAgent)) return 'Opera';
        if (preg_match('/Chrome/i', $userAgent) && !preg_match('/Edg/i', $userAgent)) return 'Google Chrome';
        if (preg_match('/Safari/i', $userAgent) && !preg_match('/Chrome/i', $userAgent)) return 'Safari';
        if (preg_match('/Firefox/i', $userAgent)) return 'Mozilla Firefox';
        if (preg_match('/MSIE/i', $userAgent) || preg_match('/Trident/i', $userAgent)) return 'Internet Explorer';
        return 'Unknown Browser';
    }

    /**
     * Helper to extract platform/OS from user agent
     * 
     * @param string $userAgent
     * @return string
     */
    private function getPlatform($userAgent)
    {
        if (!$userAgent) return 'Unknown OS';
        
        // Check for specific OS in order
        if (preg_match('/windows nt 10/i', $userAgent)) return 'Windows 10/11';
        if (preg_match('/windows nt 6.3/i', $userAgent)) return 'Windows 8.1';
        if (preg_match('/windows nt 6.2/i', $userAgent)) return 'Windows 8';
        if (preg_match('/windows nt 6.1/i', $userAgent)) return 'Windows 7';
        if (preg_match('/windows/i', $userAgent)) return 'Windows';
        if (preg_match('/android/i', $userAgent)) return 'Android';
        if (preg_match('/iphone/i', $userAgent)) return 'iPhone';
        if (preg_match('/ipad/i', $userAgent)) return 'iPad';
        if (preg_match('/macintosh|mac os x/i', $userAgent)) return 'macOS';
        if (preg_match('/linux/i', $userAgent)) return 'Linux';
        return 'Unknown OS';
    }

    /**
     * Get real IP address (considering proxy/load balancer)
     * 
     * @param Request $request
     * @return string
     */
    private function getRealIpAddress($request)
    {
        // Check for IP from common proxy headers
        $headers = [
            'HTTP_CF_CONNECTING_IP',     // Cloudflare
            'HTTP_X_REAL_IP',             // Nginx proxy
            'HTTP_X_FORWARDED_FOR',       // Standard proxy header
            'HTTP_CLIENT_IP',             // Some proxies
            'REMOTE_ADDR'                 // Direct connection
        ];

        foreach ($headers as $header) {
            if ($request->server($header)) {
                $ip = $request->server($header);
                
                // X-Forwarded-For can contain multiple IPs
                if (strpos($ip, ',') !== false) {
                    $ips = explode(',', $ip);
                    $ip = trim($ips[0]);
                }
                
                // Validate IP
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $ip;
                }
            }
        }

        // Fallback to request IP
        return $request->ip();
    }

    /**
     * Get location from IP address using GeoIP service
     * 
     * @param string $ip
     * @return string
     */
    private function getLocationFromIP($ip)
    {
        return GeoLocationService::getLocation($ip);
    }
}
