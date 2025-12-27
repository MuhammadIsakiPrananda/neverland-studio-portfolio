<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\LoginHistory;
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
}
