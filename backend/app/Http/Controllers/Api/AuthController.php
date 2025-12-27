<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\LoginHistory;
use App\Models\UserSession;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:users',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Create user
            $user = User::create([
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'avatar' => generateDefaultAvatar($request->name),
            ]);

            // Create authentication token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Return success response
            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'username' => $user->username,
                        'email' => $user->email,
                        'avatar' => $user->avatar,
                        'created_at' => $user->created_at,
                    ],
                    'token' => $token,
                ]
            ], 201);
        } catch (\Exception $e) {
            Log::error('Registration error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Login user
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'email' => 'required|string',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Try to find user by email or username
            $loginField = $request->email;
            $user = User::where('email', $loginField)
                ->orWhere('username', $loginField)
                ->first();

            // Check if user exists and password is correct
            if (!$user || !Hash::check($request->password, $user->password)) {
                // Log failed attempt (with error handling)
                try {
                    if ($request->email) {
                        LoginHistory::create([
                            'user_id' => $user ? $user->id : null,
                            'email' => $request->email,
                            'ip_address' => $request->ip(),
                            'user_agent' => $request->userAgent(),
                            'browser' => $this->getBrowser($request->userAgent()),
                            'platform' => $this->getPlatform($request->userAgent()),
                            'status' => 'failed',
                            'failure_reason' => 'Invalid credentials',
                        ]);
                        
                        // Log to Activity Log
                        if ($user) {
                            ActivityLogService::logLogin($user, 'failed', 'Invalid credentials');
                        }
                    }
                } catch (\Exception $e) {
                    // Log the error but don't fail the login attempt
                    Log::warning('Failed to log login history: ' . $e->getMessage());
                }

                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Create authentication token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Log successful login (with error handling)
            try {
                LoginHistory::create([
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'browser' => $this->getBrowser($request->userAgent()),
                    'platform' => $this->getPlatform($request->userAgent()),
                    'status' => 'success',
                ]);
                
                // Log to Activity Log
                ActivityLogService::logLogin($user, 'success');
            } catch (\Exception $e) {
                // Log the error but don't fail the login
                Log::warning('Failed to log login history: ' . $e->getMessage());
            }

            // Create or update session (with error handling)
            try {
                $tokenParts = explode('|', $token);
                $tokenHash = isset($tokenParts[1]) ? hash('sha256', $tokenParts[1]) : hash('sha256', $token);

                UserSession::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'ip_address' => $request->ip(),
                    ],
                    [
                        'token_id' => $tokenHash,
                        'user_agent' => $request->userAgent(),
                        'device_name' => $request->input('device_name', 'Unknown'),
                        'browser' => $this->getBrowser($request->userAgent()),
                        'platform' => $this->getPlatform($request->userAgent()),
                        'last_activity' => now(),
                    ]
                );
            } catch (\Exception $e) {
                // Log the error but don't fail the login
                Log::warning('Failed to create user session: ' . $e->getMessage());
            }

            // Return success response
            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'username' => $user->username,
                        'email' => $user->email,
                        'avatar' => $user->avatar,
                    ],
                    'token' => $token,
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Login failed. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Logout user
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            $currentToken = $user->currentAccessToken();

            if (!$currentToken) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active token found'
                ], 400);
            }

            // Delete session
            UserSession::where('user_id', $user->id)
                ->where('token_id', $currentToken->id)
                ->delete();

            // Delete token
            $currentToken->delete();
            
            // Log to Activity Log
            ActivityLogService::logLogout($user);

            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Logout error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Logout failed. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get authenticated user
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function user(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'username' => $user->username,
                        'email' => $user->email,
                        'avatar' => $user->avatar,
                        'created_at' => $user->created_at,
                    ]
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Get user error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user information.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Send password reset link
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function forgotPassword(Request $request)
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|exists:users,email',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Send password reset link
            $status = Password::sendResetLink(
                $request->only('email')
            );

            if ($status === Password::RESET_LINK_SENT) {
                return response()->json([
                    'success' => true,
                    'message' => 'Password reset link sent to your email',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'Unable to send reset link',
            ], 500);
        } catch (\Exception $e) {
            Log::error('Forgot password error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send password reset link.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Reset password
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetPassword(Request $request)
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'token' => 'required',
                'email' => 'required|email|exists:users,email',
                'password' => 'required|string|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Reset password
            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user, $password) {
                    $user->forceFill([
                        'password' => Hash::make($password)
                    ])->save();
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                return response()->json([
                    'success' => true,
                    'message' => 'Password reset successfully',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired reset token',
            ], 400);
        } catch (\Exception $e) {
            Log::error('Reset password error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to reset password.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
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
        if (preg_match('/MSIE/i', $userAgent)) return 'Internet Explorer';
        if (preg_match('/Firefox/i', $userAgent)) return 'Firefox';
        if (preg_match('/Chrome/i', $userAgent)) return 'Chrome';
        if (preg_match('/Safari/i', $userAgent)) return 'Safari';
        if (preg_match('/Opera/i', $userAgent)) return 'Opera';
        if (preg_match('/Edge/i', $userAgent)) return 'Edge';
        return 'Unknown';
    }

    /**
     * Helper to extract platform/OS from user agent
     * 
     * @param string $userAgent
     * @return string
     */
    private function getPlatform($userAgent)
    {
        if (preg_match('/windows/i', $userAgent)) return 'Windows';
        if (preg_match('/android/i', $userAgent)) return 'Android';
        if (preg_match('/linux/i', $userAgent)) return 'Linux';
        if (preg_match('/macintosh|mac os x/i', $userAgent)) return 'macOS';
        if (preg_match('/iphone/i', $userAgent)) return 'iPhone';
        if (preg_match('/ipad/i', $userAgent)) return 'iPad';
        return 'Unknown';
    }
}
