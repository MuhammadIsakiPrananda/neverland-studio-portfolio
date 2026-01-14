<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Http\Traits\ApiResponse;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;

class UserController extends Controller
{
    use ApiResponse;

    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Get all users with pagination, search, and filters
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['search', 'role', 'status', 'verified', 'sort_by', 'sort_order']);
            $perPage = $request->input('per_page', 15);

            $users = $this->userService->getPaginatedUsers($filters, $perPage);

            return $this->successResponse([
                'data' => UserResource::collection($users->items()),
                'pagination' => [
                    'total' => $users->total(),
                    'per_page' => $users->perPage(),
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'from' => $users->firstItem(),
                    'to' => $users->lastItem(),
                ],
            ]);
        } catch (Exception $e) {
            return $this->errorResponse('Failed to fetch users', $e->getMessage());
        }
    }

    /**
     * Create new user
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        try {
            $user = $this->userService->createUser($request->validated());

            return $this->successResponse(
                ['data' => new UserResource($user)],
                'User created successfully',
                201
            );
        } catch (Exception $e) {
            return $this->errorResponse('Failed to create user', $e->getMessage());
        }
    }

    /**
     * Get single user
     */
    public function show(int $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            return $this->successResponse([
                'data' => new UserResource($user)
            ]);
        } catch (Exception $e) {
            return $this->errorResponse('User not found', $e->getMessage(), 404);
        }
    }

    /**
     * Update user
     */
    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);
            $updatedUser = $this->userService->updateUser($user, $request->validated());

            return $this->successResponse(
                ['data' => new UserResource($updatedUser)],
                'User updated successfully'
            );
        } catch (Exception $e) {
            return $this->errorResponse('Failed to update user', $e->getMessage());
        }
    }

    /**
     * Delete user
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);
            $this->userService->deleteUser($user);

            return $this->successResponse(
                null,
                'User deleted successfully'
            );
        } catch (Exception $e) {
            $statusCode = $e->getMessage() === 'You cannot delete your own account' ? 403 : 500;
            return $this->errorResponse('Failed to delete user', $e->getMessage(), $statusCode);
        }
    }

    /**
     * Restore deleted user
     */
    public function restore(int $id): JsonResponse
    {
        try {
            $user = $this->userService->restoreUser($id);

            return $this->successResponse(
                ['data' => new UserResource($user)],
                'User restored successfully'
            );
        } catch (Exception $e) {
            return $this->errorResponse('Failed to restore user', $e->getMessage());
        }
    }

    /**
     * Get user statistics
     */
    public function stats(): JsonResponse
    {
        try {
            $stats = $this->userService->getUserStats();

            return $this->successResponse(['data' => $stats]);
        } catch (Exception $e) {
            return $this->errorResponse('Failed to fetch stats', $e->getMessage());
        }
    }
}
