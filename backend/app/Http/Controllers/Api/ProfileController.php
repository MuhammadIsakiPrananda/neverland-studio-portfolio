<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    /**
     * Get user profile
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProfile(Request $request)
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
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'job_title' => $user->job_title,
                    'company' => $user->company,
                    'bio' => $user->bio,
                    'location' => $user->location,
                    'website' => $user->website,
                    'linkedin' => $user->linkedin,
                    'twitter' => $user->twitter,
                    'github' => $user->github,
                    'instagram' => $user->instagram,
                    'birth_date' => $user->birth_date,
                    'gender' => $user->gender,
                    'avatar' => $user->avatar,
                    'preferences' => $user->preferences,
                    // Security info
                    'two_factor_enabled' => $user->two_factor_enabled,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Get profile error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve profile.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Update user profile
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|max:255|unique:users,email,' . $request->user()->id,
                'phone' => 'nullable|string|max:20',
                'job_title' => 'nullable|string|max:255',
                'company' => 'nullable|string|max:255',
                'bio' => 'nullable|string|max:1000',
                'location' => 'nullable|string|max:255',
                'website' => 'nullable|url|max:255',
                'linkedin' => 'nullable|string|max:255',
                'twitter' => 'nullable|string|max:255',
                'github' => 'nullable|string|max:255',
                'instagram' => 'nullable|string|max:255',
                'birth_date' => 'nullable|date|before:today',
                'gender' => 'nullable|in:male,female,other,prefer-not-to-say',
                'avatar' => 'nullable|string',
                'preferences' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = $request->user();
            
            // Get validated data
            $data = $validator->validated();
            
            // Log incoming avatar data for debugging
            if (isset($data['avatar'])) {
                Log::info('Avatar update attempt', [
                    'user_id' => $user->id,
                    'avatar_length' => strlen($data['avatar']),
                    'avatar_prefix' => substr($data['avatar'], 0, 50)
                ]);
            }
            
            // Validate avatar format if present
            if (isset($data['avatar']) && !empty($data['avatar'])) {
                if (!preg_match('/^data:image\/(jpeg|jpg|png|webp|gif);base64,/', $data['avatar'])) {
                    Log::warning('Invalid avatar format', [
                        'user_id' => $user->id,
                        'avatar_prefix' => substr($data['avatar'], 0, 100)
                    ]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid avatar format. Please upload a valid image.'
                    ], 422);
                }
            }
            
            // Update user with validated data
            $user->update($data);
            
            // Verify avatar was saved
            if (isset($data['avatar'])) {
                $user->refresh();
                Log::info('Avatar saved verification', [
                    'user_id' => $user->id,
                    'avatar_saved' => !empty($user->avatar),
                    'saved_avatar_length' => $user->avatar ? strlen($user->avatar) : 0
                ]);
            }
            
            Log::info('Profile updated successfully', [
                'user_id' => $user->id,
                'updated_fields' => array_keys($data)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'job_title' => $user->job_title,
                        'company' => $user->company,
                        'bio' => $user->bio,
                        'location' => $user->location,
                        'website' => $user->website,
                        'linkedin' => $user->linkedin,
                        'twitter' => $user->twitter,
                        'github' => $user->github,
                        'instagram' => $user->instagram,
                        'birth_date' => $user->birth_date?->format('Y-m-d'),
                        'gender' => $user->gender,
                        'avatar' => $user->avatar,
                        'preferences' => $user->preferences ?? [],
                    ]
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Update profile error: ' . $e->getMessage(), [
                'user_id' => $request->user()->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Upload/Update avatar
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadAvatar(Request $request)
    {
        try {
            // Validate avatar input
            $validator = Validator::make($request->all(), [
                'avatar' => 'required|string', // base64 string
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $avatarData = $request->avatar;
            
            // Validate base64 format (should start with data:image/)
            if (!preg_match('/^data:image\/(jpeg|jpg|png|webp);base64,/', $avatarData)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid image format. Please upload JPG, PNG, or WebP image.'
                ], 422);
            }

            // Check base64 size (approximate max 10MB encoded)
            $base64Size = strlen($avatarData);
            $maxSize = 10 * 1024 * 1024; // 10MB
            
            if ($base64Size > $maxSize) {
                return response()->json([
                    'success' => false,
                    'message' => 'Image size too large. Please reduce image size.'
                ], 422);
            }

            // Update user avatar
            $user = $request->user();
            $user->avatar = $avatarData;
            $user->save();

            Log::info('Avatar updated successfully', [
                'user_id' => $user->id,
                'avatar_size' => $base64Size
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Avatar updated successfully',
                'data' => [
                    'avatar' => $user->avatar
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Upload avatar error: ' . $e->getMessage(), [
                'user_id' => $request->user()->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload avatar.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
