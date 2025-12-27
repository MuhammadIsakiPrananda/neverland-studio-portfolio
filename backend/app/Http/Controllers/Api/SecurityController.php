<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoginHistory;
use App\Models\UserSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use PragmaRX\Google2FA\Google2FA;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

class SecurityController extends Controller
{
    /**
     * Change user password
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = $request->user();

            // Verify current password
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect',
                ], 422);
            }

            // Update password
            $user->password = Hash::make($request->new_password);
            $user->save();

            // Revoke all other tokens except current
            $currentTokenId = $request->user()->currentAccessToken()->id;
            $user->tokens()->where('id', '!=', $currentTokenId)->delete();

            // Delete all other sessions
            UserSession::where('user_id', $user->id)
                ->where('token_id', '!=', $currentTokenId)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully. All other sessions have been logged out.',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Change password error: ' . $e->getMessage(), [
                'user_id' => $request->user()->id ?? null,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to change password.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Enable 2FA - Generate secret and QR code
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function enable2FA(Request $request)
    {
        try {
            $user = $request->user();

            if ($user->two_factor_enabled) {
                return response()->json([
                    'success' => false,
                    'message' => '2FA is already enabled',
                ], 422);
            }

            $google2fa = new Google2FA();
            $secret = $google2fa->generateSecretKey();

            // Store temporarily (will be confirmed after verification)
            $user->two_factor_secret = encrypt($secret);
            $user->save();

            // Generate QR Code with custom app name
            $qrCodeUrl = $google2fa->getQRCodeUrl(
                'Neverland Studio',
                $user->email,
                $secret
            );

            $renderer = new ImageRenderer(
                new RendererStyle(200),
                new SvgImageBackEnd()
            );
            $writer = new Writer($renderer);
            $qrCodeSvg = $writer->writeString($qrCodeUrl);

            // Generate recovery codes
            $recoveryCodes = [];
            for ($i = 0; $i < 8; $i++) {
                $recoveryCodes[] = strtoupper(bin2hex(random_bytes(4)));
            }
            $user->two_factor_recovery_codes = encrypt(json_encode($recoveryCodes));
            $user->save();

            return response()->json([
                'success' => true,
                'message' => '2FA setup initiated. Please scan the QR code and verify.',
                'data' => [
                    'secret' => $secret,
                    'qr_code_svg' => base64_encode($qrCodeSvg),
                    'recovery_codes' => $recoveryCodes,
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Enable 2FA error: ' . $e->getMessage(), [
                'user_id' => $request->user()->id ?? null,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to enable 2FA.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Verify and activate 2FA
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function verify2FA(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'code' => 'required|string|size:6',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = $request->user();

            if (!$user->two_factor_secret) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please enable 2FA first',
                ], 422);
            }

            $google2fa = new Google2FA();
            $secret = decrypt($user->two_factor_secret);

            $valid = $google2fa->verifyKey($secret, $request->code);

            if (!$valid) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid verification code',
                ], 422);
            }

            // Activate 2FA
            $user->two_factor_enabled = true;
            $user->two_factor_verified_at = now();
            $user->save();

            return response()->json([
                'success' => true,
                'message' => '2FA has been successfully enabled',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Verify 2FA error: ' . $e->getMessage(), [
                'user_id' => $request->user()->id ?? null,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to verify 2FA.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Disable 2FA
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function disable2FA(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = $request->user();

            // Verify password
            if (!Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Password is incorrect',
                ], 422);
            }

            // Disable 2FA
            $user->two_factor_enabled = false;
            $user->two_factor_secret = null;
            $user->two_factor_recovery_codes = null;
            $user->two_factor_verified_at = null;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => '2FA has been disabled',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Disable 2FA error: ' . $e->getMessage(), [
                'user_id' => $request->user()->id ?? null,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to disable 2FA.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get login history
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLoginHistory(Request $request)
    {
        try {
            $user = $request->user();
            $limit = $request->input('limit', 20);

            $history = LoginHistory::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'history' => $history->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'ip_address' => $item->ip_address,
                            'browser' => $item->browser,
                            'platform' => $item->platform,
                            'location' => $item->location,
                            'status' => $item->status,
                            'failure_reason' => $item->failure_reason,
                            'created_at' => $item->created_at,
                        ];
                    })
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Get login history error: ' . $e->getMessage(), [
                'user_id' => $request->user()->id ?? null,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve login history.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get active sessions
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getActiveSessions(Request $request)
    {
        try {
            $user = $request->user();
            $currentTokenId = $request->user()->currentAccessToken()->id;

            $sessions = UserSession::where('user_id', $user->id)
                ->orderBy('last_activity', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'sessions' => $sessions->map(function ($session) use ($currentTokenId) {
                        return [
                            'id' => $session->id,
                            'token_id' => $session->token_id,
                            'device_name' => $session->device_name,
                            'browser' => $session->browser,
                            'platform' => $session->platform,
                            'ip_address' => $session->ip_address,
                            'location' => $session->location,
                            'last_activity' => $session->last_activity,
                            'is_current' => $session->token_id == $currentTokenId,
                        ];
                    })
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Get active sessions error: ' . $e->getMessage(), [
                'user_id' => $request->user()->id ?? null,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve active sessions.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Revoke a specific session
     * 
     * @param Request $request
     * @param int $sessionId
     * @return \Illuminate\Http\JsonResponse
     */
    public function revokeSession(Request $request, $sessionId)
    {
        try {
            $user = $request->user();
            $currentTokenId = $request->user()->currentAccessToken()->id;

            $session = UserSession::where('user_id', $user->id)
                ->where('id', $sessionId)
                ->first();

            if (!$session) {
                return response()->json([
                    'success' => false,
                    'message' => 'Session not found',
                ], 404);
            }

            // Don't allow revoking current session
            if ($session->token_id == $currentTokenId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot revoke current session. Use logout instead.',
                ], 422);
            }

            // Revoke token
            $user->tokens()->where('id', $session->token_id)->delete();

            // Delete session
            $session->delete();

            return response()->json([
                'success' => true,
                'message' => 'Session revoked successfully',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Revoke session error: ' . $e->getMessage(), [
                'user_id' => $request->user()->id ?? null,
                'session_id' => $sessionId,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to revoke session.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
