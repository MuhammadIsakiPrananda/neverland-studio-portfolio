<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class ActivityLogService
{
    /**
     * Log a user login activity.
     */
    public static function logLogin($user, $status = 'success', $description = null)
    {
        return ActivityLog::log([
            'type' => 'login',
            'user' => $user->name ?? $user->email ?? 'Unknown',
            'user_id' => $user->id ?? null,
            'action' => $status === 'success' ? 'User Login' : 'Login Attempt',
            'description' => $description ?? ($status === 'success' 
                ? 'Successfully logged in to the dashboard' 
                : 'Failed login attempt'),
            'status' => $status,
        ]);
    }

    /**
     * Log a user logout activity.
     */
    public static function logLogout($user)
    {
        return ActivityLog::log([
            'type' => 'logout',
            'user' => $user->name ?? $user->email ?? 'Unknown',
            'user_id' => $user->id ?? null,
            'action' => 'User Logout',
            'description' => 'Successfully logged out from the dashboard',
            'status' => 'success',
        ]);
    }

    /**
     * Log a create action.
     */
    public static function logCreate($user, $resourceType, $resourceName, $metadata = null)
    {
        return ActivityLog::log([
            'type' => 'create',
            'user' => $user->name ?? $user->email ?? 'Unknown',
            'user_id' => $user->id ?? null,
            'action' => ucfirst($resourceType) . ' Created',
            'description' => "Created new {$resourceType}: \"{$resourceName}\"",
            'status' => 'success',
            'metadata' => $metadata,
        ]);
    }

    /**
     * Log an update action.
     */
    public static function logUpdate($user, $resourceType, $resourceName, $metadata = null)
    {
        return ActivityLog::log([
            'type' => 'update',
            'user' => $user->name ?? $user->email ?? 'Unknown',
            'user_id' => $user->id ?? null,
            'action' => ucfirst($resourceType) . ' Updated',
            'description' => "Updated {$resourceType}: \"{$resourceName}\"",
            'status' => 'success',
            'metadata' => $metadata,
        ]);
    }

    /**
     * Log a delete action.
     */
    public static function logDelete($user, $resourceType, $resourceName, $metadata = null)
    {
        return ActivityLog::log([
            'type' => 'delete',
            'user' => $user->name ?? $user->email ?? 'Unknown',
            'user_id' => $user->id ?? null,
            'action' => ucfirst($resourceType) . ' Deleted',
            'description' => "Deleted {$resourceType}: \"{$resourceName}\"",
            'status' => 'warning',
            'metadata' => $metadata,
        ]);
    }

    /**
     * Log a settings change.
     */
    public static function logSettings($user, $settingName, $description = null)
    {
        return ActivityLog::log([
            'type' => 'settings',
            'user' => $user->name ?? $user->email ?? 'Unknown',
            'user_id' => $user->id ?? null,
            'action' => 'Settings Changed',
            'description' => $description ?? "Updated {$settingName} settings",
            'status' => 'success',
        ]);
    }

    /**
     * Log a custom activity.
     */
    public static function logCustom(array $data)
    {
        $user = Auth::user();
        
        return ActivityLog::log([
            'type' => $data['type'] ?? 'custom',
            'user' => $data['user'] ?? ($user ? ($user->name ?? $user->email) : 'System'),
            'user_id' => $data['user_id'] ?? ($user ? $user->id : null),
            'action' => $data['action'],
            'description' => $data['description'],
            'status' => $data['status'] ?? 'success',
            'metadata' => $data['metadata'] ?? null,
        ]);
    }

    /**
     * Log API access.
     */
    public static function logApiAccess($endpoint, $method, $statusCode, $user = null)
    {
        return ActivityLog::log([
            'type' => 'api',
            'user' => $user ? ($user->name ?? $user->email) : 'Anonymous',
            'user_id' => $user ? $user->id : null,
            'action' => 'API Access',
            'description' => "{$method} {$endpoint} - Status: {$statusCode}",
            'status' => $statusCode >= 200 && $statusCode < 300 ? 'success' : 'failed',
            'metadata' => [
                'endpoint' => $endpoint,
                'method' => $method,
                'status_code' => $statusCode,
            ],
        ]);
    }

    /**
     * Log database query.
     */
    public static function logDatabaseQuery($query, $user = null)
    {
        return ActivityLog::log([
            'type' => 'database',
            'user' => $user ? ($user->name ?? $user->email) : 'System',
            'user_id' => $user ? $user->id : null,
            'action' => 'Database Query',
            'description' => substr($query, 0, 200),
            'status' => 'success',
            'metadata' => [
                'query' => $query,
            ],
        ]);
    }

    /**
     * Log an error.
     */
    public static function logError($errorMessage, $errorDetails = null, $user = null)
    {
        return ActivityLog::log([
            'type' => 'error',
            'user' => $user ? ($user->name ?? $user->email) : 'System',
            'user_id' => $user ? $user->id : null,
            'action' => 'Error Occurred',
            'description' => $errorMessage,
            'status' => 'failed',
            'metadata' => $errorDetails,
        ]);
    }
}
