<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Exception;

class UserService
{
    /**
     * Get paginated users with filters
     */
    public function getPaginatedUsers(array $filters = [], int $perPage = 15)
    {
        $query = User::query();

        $this->applyFilters($query, $filters);
        $this->applySorting($query, $filters);

        return $query->paginate($perPage);
    }

    /**
     * Create a new user
     */
    public function createUser(array $data): User
    {
        DB::beginTransaction();
        
        try {
            // Auto-generate username if not provided
            if (empty($data['username'])) {
                $data['username'] = $this->generateUsername($data['name']);
            }

            // Hash password
            $data['password'] = Hash::make($data['password']);

            $user = User::create($data);

            // Log activity
            ActivityLogService::logCreate(
                auth()->user(),
                'user',
                $user->name,
                ['user_id' => $user->id, 'email' => $user->email]
            );

            DB::commit();
            return $user;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update existing user
     */
    public function updateUser(User $user, array $data): User
    {
        DB::beginTransaction();
        
        try {
            // Hash password if provided
            if (!empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }

            $user->update($data);

            // Log activity
            ActivityLogService::logUpdate(
                auth()->user(),
                'user',
                $user->name,
                ['user_id' => $user->id, 'updated_fields' => array_keys($data)]
            );

            DB::commit();
            return $user->fresh();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete a user
     */
    public function deleteUser(User $user): bool
    {
        DB::beginTransaction();
        
        try {
            // Prevent self-deletion
            if ($user->id === auth()->id()) {
                throw new Exception('You cannot delete your own account');
            }

            // Revoke all tokens
            $user->tokens()->delete();

            $userName = $user->name;
            $userEmail = $user->email;
            
            $user->delete();

            // Log activity
            ActivityLogService::logDelete(
                auth()->user(),
                'user',
                "{$userName} ({$userEmail})",
                ['user_id' => $user->id]
            );

            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Restore a deleted user
     */
    public function restoreUser(int $userId): User
    {
        DB::beginTransaction();
        
        try {
            $user = User::withTrashed()->findOrFail($userId);
            $user->restore();

            // Log activity
            ActivityLogService::logCustom(
                auth()->user(),
                'user',
                'restore',
                "User restored: {$user->name}",
                'success',
                ['user_id' => $user->id]
            );

            DB::commit();
            return $user;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get user statistics
     */
    public function getUserStats(): array
    {
        return [
            'total' => User::count(),
            'active' => User::whereNotNull('email_verified_at')->count(),
            'new_this_month' => User::whereMonth('created_at', now()->month)->count(),
            'verified' => User::whereNotNull('email_verified_at')->count(),
            'unverified' => User::whereNull('email_verified_at')->count(),
        ];
    }

    /**
     * Apply filters to query
     */
    private function applyFilters($query, array $filters): void
    {
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")
                  ->orWhere('email', 'like', "%{$filters['search']}%")
                  ->orWhere('username', 'like', "%{$filters['search']}%");
            });
        }

        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['verified'])) {
            if ($filters['verified']) {
                $query->whereNotNull('email_verified_at');
            } else {
                $query->whereNull('email_verified_at');
            }
        }
    }

    /**
     * Apply sorting to query
     */
    private function applySorting($query, array $filters): void
    {
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        
        $query->orderBy($sortBy, $sortOrder);
    }

    /**
     * Generate unique username from name
     */
    private function generateUsername(string $name): string
    {
        $username = strtolower(str_replace(' ', '', $name));
        $username = preg_replace('/[^a-z0-9]/', '', $username);
        
        // Ensure uniqueness
        $originalUsername = $username;
        $counter = 1;
        
        while (User::where('username', $username)->exists()) {
            $username = $originalUsername . $counter;
            $counter++;
        }
        
        return $username;
    }
}
