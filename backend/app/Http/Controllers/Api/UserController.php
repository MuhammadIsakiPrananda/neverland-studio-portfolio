<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Get all users with pagination, search, and filters
     */
    public function index(Request $request)
    {
        try {
            $query = User::query();

            // Search by name or email
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Filter by role
            if ($request->has('role')) {
                $query->where('role', $request->input('role'));
            }

            // Filter by status (if you have a status field)
            if ($request->has('status')) {
                $query->where('status', $request->input('status'));
            }

            // Sort
            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginate
            $perPage = $request->input('per_page', 15);
            $users = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $users->items(),
                'pagination' => [
                    'total' => $users->total(),
                    'per_page' => $users->perPage(),
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'from' => $users->firstItem(),
                    'to' => $users->lastItem(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create new user
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'username' => 'nullable|string|max:255|unique:users',
                'email' => 'required|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'phone' => 'nullable|string|max:20',
                'bio' => 'nullable|string',
                'location' => 'nullable|string|max:255',
                'status' => 'nullable|in:active,inactive,suspended,pending',
            ]);

            // Auto-generate username if not provided
            if (empty($validated['username'])) {
                $validated['username'] = strtolower(str_replace(' ', '', $validated['name'])) . rand(100, 999);
            }

            // Hash password
            $validated['password'] = Hash::make($validated['password']);

            // Create user
            $user = User::create($validated);
            
            // Log to Activity Log
            ActivityLogService::logCreate(
                auth()->user(),
                'user',
                "User created: {$user->name} ({$user->email})",
                ['user_id' => $user->id, 'username' => $user->username]
            );

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get single user details
     */
    public function show($id)
    {
        try {
            $user = User::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $user,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }
    }

    /**
     * Update user information
     */
    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            // Remove email_verified_at from validation if present (we'll handle it separately)
            $dataToValidate = $request->except('email_verified_at');

            $validated = Validator::make($dataToValidate, [
                'name' => 'sometimes|string|max:255',
                'email' => [
                    'sometimes',
                    'email',
                    'max:255',
                    Rule::unique('users')->ignore($user->id),
                ],
                'phone' => 'nullable|string|max:20',
                'bio' => 'nullable|string',
                'location' => 'nullable|string|max:255',
                'website' => 'nullable|url|max:255',
                'job_title' => 'nullable|string|max:255',
                'company' => 'nullable|string|max:255',
                'birth_date' => 'nullable|date',
                'gender' => 'nullable|in:male,female,other',
                'status' => 'nullable|in:active,inactive,suspended,pending',
            ])->validate();

            // Handle email_verified_at separately
            if ($request->has('email_verified_at')) {
                $emailVerified = $request->input('email_verified_at');
                // If truthy (not null, not false, not empty string), set to now, else null
                $validated['email_verified_at'] = $emailVerified ? now() : null;
            }

            $user->update($validated);
            
            // Log to Activity Log
            ActivityLogService::logUpdate(
                auth()->user(),
                'user',
                "User updated: {$user->name}",
                ['user_id' => $user->id, 'updated_fields' => array_keys($validated)]
            );

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user->fresh(),
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete user
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);

            // Prevent deleting yourself
            if ($user->id === auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot delete your own account',
                ], 403);
            }

            // CRITICAL: Revoke all tokens for this user
            // This will force immediate logout on main website
            $user->tokens()->delete();

            $userName = $user->name;
            $userEmail = $user->email;
            $user->delete();
            
            // Log to Activity Log
            ActivityLogService::logDelete(
                auth()->user(),
                'user',
                "User deleted: {$userName} ({$userEmail})",
                ['user_id' => $id]
            );

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Restore deleted user
     */
    public function restore($id)
    {
        try {
            $user = User::withTrashed()->findOrFail($id);
            $user->restore();
            
            // Log to Activity Log
            ActivityLogService::logCustom(
                auth()->user(),
                'user',
                'restore',
                "User restored: {$user->name}",
                'success',
                ['user_id' => $user->id]
            );

            return response()->json([
                'success' => true,
                'message' => 'User restored successfully',
                'data' => $user,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to restore user: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get user statistics
     */
    public function stats()
    {
        try {
            $total = User::count();
            $active = User::where('email_verified_at', '!=', null)->count();
            $newThisMonth = User::whereMonth('created_at', now()->month)->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total' => $total,
                    'active' => $active,
                    'new_this_month' => $newThisMonth,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch stats',
            ], 500);
        }
    }
}
