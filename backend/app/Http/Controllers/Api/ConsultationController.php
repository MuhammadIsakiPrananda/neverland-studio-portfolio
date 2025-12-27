<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ConsultationController extends Controller
{
    /**
     * Store a new consultation request
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
                'company' => 'nullable|string|max:255',
                'solution_title' => 'required|string|max:255',
                'project_type' => 'nullable|string|max:100',
                'message' => 'nullable|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Create consultation
            $consultation = Consultation::create([
                'full_name' => $request->full_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'company' => $request->company,
                'solution_title' => $request->solution_title,
                'project_type' => $request->project_type,
                'message' => $request->message,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status' => 'pending',
            ]);

            // Log for notification
            Log::info('New consultation request', [
                'consultation_id' => $consultation->id,
                'solution' => $consultation->solution_title,
                'name' => $consultation->full_name,
                'email' => $consultation->email,
                'company' => $consultation->company,
            ]);
            
            // Log to Activity Log (without auth user - public consultation form)
            ActivityLogService::logCreate(null, 'consultation', "New consultation: {$consultation->full_name} for {$consultation->solution_title}", [
                'consultation_id' => $consultation->id,
                'company' => $consultation->company,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Consultation request submitted successfully! We will contact you soon.',
                'data' => [
                    'id' => $consultation->id,
                    'solution' => $consultation->solution_title,
                    'created_at' => $consultation->created_at,
                ]
            ], 201);
        } catch (\Exception $e) {
            Log::error('Consultation submission error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit consultation request. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get all consultations (admin only)
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 15);
            $status = $request->input('status');

            $query = Consultation::query()->orderBy('created_at', 'desc');

            if ($status) {
                $query->where('status', $status);
            }

            $consultations = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $consultations
            ], 200);
        } catch (\Exception $e) {
            Log::error('Get consultations error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve consultations.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Update consultation status (admin only)
     * 
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:pending,contacted,in_progress,completed,cancelled',
                'admin_notes' => 'nullable|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $consultation = Consultation::findOrFail($id);
            $oldStatus = $consultation->status;
            $consultation->update($validator->validated());
            
            // Log to Activity Log
            ActivityLogService::logUpdate(
                auth()->user(),
                'consultation',
                "Consultation status updated: {$consultation->full_name} - {$consultation->solution_title}",
                [
                    'consultation_id' => $consultation->id,
                    'old_status' => $oldStatus,
                    'new_status' => $consultation->status,
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Consultation status updated successfully',
                'data' => $consultation
            ], 200);
        } catch (\Exception $e) {
            Log::error('Update consultation status error: ' . $e->getMessage(), [
                'consultation_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update consultation status.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
