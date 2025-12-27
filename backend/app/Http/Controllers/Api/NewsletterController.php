<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class NewsletterController extends Controller
{
    /**
     * Subscribe to newsletter
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function subscribe(Request $request)
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if already subscribed
            $existing = Newsletter::where('email', $request->email)->first();

            if ($existing) {
                if ($existing->is_active) {
                    return response()->json([
                        'success' => false,
                        'message' => 'This email is already subscribed to our newsletter.',
                    ], 422);
                } else {
                    // Re-subscribe
                    $existing->update([
                        'is_active' => true,
                        'subscribed_at' => now(),
                        'unsubscribed_at' => null,
                        'ip_address' => $request->ip(),
                        'user_agent' => $request->userAgent(),
                    ]);

                    Log::info('Newsletter re-subscription', [
                        'email' => $existing->email,
                    ]);
                    
                    // Log to Activity Log (without auth user - public newsletter form)
                    ActivityLogService::logCustom(
                        null,
                        'newsletter',
                        're-subscribe',
                        "Newsletter re-subscription: {$existing->email}",
                        'success'
                    );

                    return response()->json([
                        'success' => true,
                        'message' => 'Welcome back! You have been re-subscribed to our newsletter.',
                        'data' => [
                            'email' => $existing->email,
                            'subscribed_at' => $existing->subscribed_at,
                        ]
                    ], 200);
                }
            }

            // Create new subscription
            $newsletter = Newsletter::create([
                'email' => $request->email,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'is_active' => true,
                'subscribed_at' => now(),
            ]);

            // Log for notification
            Log::info('New newsletter subscription', [
                'email' => $newsletter->email,
            ]);
            
            // Log to Activity Log (without auth user - public newsletter form)
            ActivityLogService::logCreate(null, 'newsletter', "New newsletter subscription: {$newsletter->email}");

            return response()->json([
                'success' => true,
                'message' => 'Thank you for subscribing! You will receive our latest updates.',
                'data' => [
                    'email' => $newsletter->email,
                    'subscribed_at' => $newsletter->subscribed_at,
                ]
            ], 201);
        } catch (\Exception $e) {
            Log::error('Newsletter subscription error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to subscribe. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Unsubscribe from newsletter
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function unsubscribe(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $newsletter = Newsletter::where('email', $request->email)->first();

            if (!$newsletter || !$newsletter->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email not found in our newsletter list.',
                ], 404);
            }

            $newsletter->update([
                'is_active' => false,
                'unsubscribed_at' => now(),
            ]);

            Log::info('Newsletter unsubscription', [
                'email' => $newsletter->email,
            ]);
            
            // Log to Activity Log (without auth user - public unsubscribe)
            ActivityLogService::logCustom(
                null,
                'newsletter',
                'unsubscribe',
                "Newsletter unsubscribed: {$newsletter->email}",
                'success'
            );

            return response()->json([
                'success' => true,
                'message' => 'You have been unsubscribed from our newsletter.',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Newsletter unsubscription error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to unsubscribe. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get all newsletter subscribers (admin only)
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 15);
            $isActive = $request->input('is_active');

            $query = Newsletter::query()->orderBy('created_at', 'desc');

            if ($isActive !== null) {
                $query->where('is_active', $isActive);
            }

            $newsletters = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $newsletters
            ], 200);
        } catch (\Exception $e) {
            Log::error('Get newsletter subscribers error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve subscribers.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
