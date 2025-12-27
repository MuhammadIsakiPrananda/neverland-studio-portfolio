<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    /**
     * Store a new contact message
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'subject' => 'required|string|max:255',
                'message' => 'required|string|max:5000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Create contact
            $contact = Contact::create([
                'name' => $request->name,
                'email' => $request->email,
                'subject' => $request->subject,
                'message' => $request->message,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status' => 'new',
            ]);

            // Log for notification
            Log::info('New contact message received', [
                'contact_id' => $contact->id,
                'name' => $contact->name,
                'email' => $contact->email,
            ]);
            
            // Log to Activity Log (without auth user - public contact form)
            ActivityLogService::logCreate(null, 'contact', "New contact: {$contact->name} ({$contact->email})", [
                'contact_id' => $contact->id,
                'subject' => $contact->subject,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Thank you for your message! We will get back to you soon.',
                'data' => [
                    'id' => $contact->id,
                    'created_at' => $contact->created_at,
                ]
            ], 201);
        } catch (\Exception $e) {
            Log::error('Contact form submission error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send message. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get all contacts (admin only)
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 15);
            $status = $request->input('status');

            $query = Contact::query()->orderBy('created_at', 'desc');

            if ($status) {
                $query->where('status', $status);
            }

            $contacts = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $contacts
            ], 200);
        } catch (\Exception $e) {
            Log::error('Get contacts error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve contacts.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Update contact status (admin only)
     * 
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:new,read,replied,archived',
                'admin_notes' => 'nullable|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $contact = Contact::findOrFail($id);
            $oldStatus = $contact->status;
            $contact->update($validator->validated());
            
            // Log to Activity Log
            ActivityLogService::logUpdate(
                auth()->user(),
                'contact',
                "Contact status updated: {$contact->name}",
                [
                    'contact_id' => $contact->id,
                    'old_status' => $oldStatus,
                    'new_status' => $contact->status,
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Contact status updated successfully',
                'data' => $contact
            ], 200);
        } catch (\Exception $e) {
            Log::error('Update contact status error: ' . $e->getMessage(), [
                'contact_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update contact status.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Delete a contact message (admin only)
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $contact = Contact::findOrFail($id);
            $contactName = $contact->name;
            $contactEmail = $contact->email;
            $contact->delete();

            Log::info('Contact deleted', [
                'contact_id' => $id,
                'name' => $contactName,
                'email' => $contactEmail,
            ]);
            
            // Log to Activity Log
            ActivityLogService::logDelete(
                auth()->user(),
                'contact',
                "Contact deleted: {$contactName} ({$contactEmail})",
                ['contact_id' => $id]
            );

            return response()->json([
                'success' => true,
                'message' => 'Contact deleted successfully'
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Contact not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Delete contact error: ' . $e->getMessage(), [
                'contact_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete contact.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
