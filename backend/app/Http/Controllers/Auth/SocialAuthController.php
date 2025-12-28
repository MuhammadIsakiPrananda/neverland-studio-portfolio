<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            // Find or create user
            $user = User::where('email', $googleUser->email)->first();

            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                    'email_verified_at' => now(),
                    'password' => Hash::make(Str::random(16)),
                ]);
            } else {
                // Update Google ID if not set
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->id,
                        'avatar' => $googleUser->avatar ?? $user->avatar,
                    ]);
                }
            }

            // Login user
            Auth::login($user);

            // Create token for API
            $token = $user->createToken('auth-token')->plainTextToken;

            // Redirect to frontend with token
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect("$frontendUrl/auth/callback?token=$token&provider=google");
        } catch (\Exception $e) {
            \Log::error('Google OAuth Error: ' . $e->getMessage());

            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect("$frontendUrl/login?error=oauth_failed&provider=google");
        }
    }

    /**
     * Redirect to GitHub OAuth
     */
    public function redirectToGitHub()
    {
        return Socialite::driver('github')->redirect();
    }

    /**
     * Handle GitHub OAuth callback
     */
    public function handleGitHubCallback()
    {
        try {
            $githubUser = Socialite::driver('github')->user();

            // GitHub users can hide email, handle this case
            $email = $githubUser->email;
            if (!$email) {
                // Use GitHub username as fallback
                $email = $githubUser->nickname . '@github.user';
            }

            // Find or create user
            $user = User::where('email', $email)->first();

            if (!$user) {
                $user = User::create([
                    'name' => $githubUser->name ?? $githubUser->nickname,
                    'email' => $email,
                    'github_id' => $githubUser->id,
                    'avatar' => $githubUser->avatar,
                    'email_verified_at' => now(),
                    'password' => Hash::make(Str::random(16)),
                ]);
            } else {
                // Update GitHub ID if not set
                if (!$user->github_id) {
                    $user->update([
                        'github_id' => $githubUser->id,
                        'avatar' => $githubUser->avatar ?? $user->avatar,
                    ]);
                }
            }

            // Login user
            Auth::login($user);

            // Create token for API
            $token = $user->createToken('auth-token')->plainTextToken;

            // Redirect to frontend with token
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect("$frontendUrl/auth/callback?token=$token&provider=github");
        } catch (\Exception $e) {
            \Log::error('GitHub OAuth Error: ' . $e->getMessage());

            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect("$frontendUrl/login?error=oauth_failed&provider=github");
        }
    }
}
