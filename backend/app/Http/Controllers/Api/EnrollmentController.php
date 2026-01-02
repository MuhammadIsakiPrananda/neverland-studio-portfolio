<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class EnrollmentController extends Controller
{
    /**
     * Store a new course enrollment
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'full_name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'course_id' => 'required|string|max:100',
                'course_title' => 'required|string|max:255',
                'preferred_day' => 'nullable|string|max:50',
                'preferred_time' => 'nullable|string|max:50',
                'message' => 'nullable|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Create enrollment
            $enrollment = Enrollment::create([
                'full_name' => $request->full_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'course_id' => $request->course_id,
                'course_title' => $request->course_title,
                'preferred_day' => $request->preferred_day,
                'preferred_time' => $request->preferred_time,
                'message' => $request->message,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status' => 'pending',
            ]);

            // Log for notification
            Log::info('New course enrollment', [
                'enrollment_id' => $enrollment->id,
                'course' => $enrollment->course_title,
                'name' => $enrollment->full_name,
                'email' => $enrollment->email,
            ]);
            
            // Log to Activity Log (without auth user - public enrollment form)
            ActivityLogService::logCreate(null, 'enrollment', "New enrollment: {$enrollment->full_name} for {$enrollment->course_title}", [
                'enrollment_id' => $enrollment->id,
                'course_id' => $enrollment->course_id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Enrollment submitted successfully! We will contact you soon.',
                'data' => [
                    'id' => $enrollment->id,
                    'course' => $enrollment->course_title,
                    'created_at' => $enrollment->created_at,
                ]
            ], 201);
        } catch (\Exception $e) {
            Log::error('Enrollment submission error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit enrollment. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get all enrollments (admin only)
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $status = $request->input('status');
            $courseId = $request->input('course_id');
            $getAll = $request->has('all') || $request->input('all') === 'true';

            $query = Enrollment::query()->orderBy('created_at', 'desc');

            if ($status) {
                $query->where('status', $status);
            }

            if ($courseId) {
                $query->where('course_id', $courseId);
            }

            // For realtime updates, return all items without pagination
            if ($getAll) {
                $enrollments = $query->get();
                
                return response()->json([
                    'success' => true,
                    'data' => $enrollments
                ], 200);
            }

            // Return paginated for normal requests
            $perPage = $request->input('per_page', 15);
            $enrollments = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $enrollments
            ], 200);
        } catch (\Exception $e) {
            Log::error('Get enrollments error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve enrollments.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Update enrollment status (admin only)
     * 
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:pending,approved,rejected,confirmed,completed,cancelled',
                'admin_notes' => 'nullable|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $enrollment = Enrollment::findOrFail($id);
            $oldStatus = $enrollment->status;
            $enrollment->update($validator->validated());
            
            // Log to Activity Log
            ActivityLogService::logUpdate(
                auth()->user(),
                'enrollment',
                "Enrollment status updated: {$enrollment->full_name} - {$enrollment->course_title}",
                [
                    'enrollment_id' => $enrollment->id,
                    'old_status' => $oldStatus,
                    'new_status' => $enrollment->status,
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Enrollment status updated successfully',
                'data' => $enrollment
            ], 200);
        } catch (\Exception $e) {
            Log::error('Update enrollment status error: ' . $e->getMessage(), [
                'enrollment_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update enrollment status.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Delete enrollment (admin only)
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $enrollment = Enrollment::findOrFail($id);
            
            // Store enrollment data before deletion for activity log
            $enrollmentData = [
                'full_name' => $enrollment->full_name,
                'email' => $enrollment->email,
                'course_title' => $enrollment->course_title,
                'status' => $enrollment->status,
            ];
            
            $enrollment->delete();
            
            // Log to Activity Log
            ActivityLogService::logDelete(
                auth()->user(),
                'enrollment',
                "Enrollment deleted: {$enrollmentData['full_name']} - {$enrollmentData['course_title']}",
                [
                    'enrollment_id' => $id,
                    'deleted_data' => $enrollmentData,
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Enrollment deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Delete enrollment error: ' . $e->getMessage(), [
                'enrollment_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete enrollment.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
