<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UserSession;
use Symfony\Component\HttpFoundation\Response;

class UpdateUserSessionActivity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only process for authenticated users with valid token
        if (Auth::guard('sanctum')->check() && $request->user()) {
            try {
                $currentToken = $request->user()->currentAccessToken();
                
                if ($currentToken) {
                    // Update last_activity for current session
                    UserSession::where('user_id', $request->user()->id)
                        ->where('token_id', $currentToken->id)
                        ->update(['last_activity' => now()]);
                }
            } catch (\Exception $e) {
                // Silently fail to not interrupt the request
                \Log::warning('Failed to update session activity: ' . $e->getMessage());
            }
        }

        return $next($request);
    }
}
