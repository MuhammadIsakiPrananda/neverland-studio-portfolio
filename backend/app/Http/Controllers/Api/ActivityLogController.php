<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ActivityLogController extends Controller
{
    /**
     * Get all activity logs with pagination and filters.
     */
    public function index(Request $request)
    {
        $query = ActivityLog::query()->orderBy('created_at', 'desc');

        // Filter by type
        if ($request->has('type') && $request->type !== 'all') {
            $query->ofType($request->type);
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->withStatus($request->status);
        }

        // Search by user, action, or description
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('user', 'like', "%{$search}%")
                    ->orWhere('action', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Date range filter
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->dateRange($request->start_date, $request->end_date);
        }

        // Pagination
        $perPage = $request->get('per_page', 50);
        $logs = $query->paginate($perPage);

        return response()->json($logs);
    }

    /**
     * Get activity log statistics.
     */
    public function stats(Request $request)
    {
        $today = now()->startOfDay();
        $yesterday = now()->subDay()->startOfDay();

        $stats = [
            'total' => ActivityLog::count(),
            'today' => ActivityLog::where('created_at', '>=', $today)->count(),
            'yesterday' => ActivityLog::whereBetween('created_at', [$yesterday, $today])->count(),
            'failed' => ActivityLog::where('status', 'failed')->count(),
            'failed_today' => ActivityLog::where('status', 'failed')
                ->where('created_at', '>=', $today)
                ->count(),
            'by_type' => ActivityLog::select('type', DB::raw('count(*) as count'))
                ->groupBy('type')
                ->get()
                ->pluck('count', 'type'),
            'by_status' => ActivityLog::select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->get()
                ->pluck('count', 'status'),
            'active_users' => ActivityLog::where('created_at', '>=', $today)
                ->distinct('user')
                ->count('user'),
        ];

        return response()->json($stats);
    }

    /**
     * Get recent activity logs.
     */
    public function recent(Request $request)
    {
        $limit = $request->get('limit', 20);
        
        $logs = ActivityLog::orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'data' => $logs,
            'count' => $logs->count(),
        ]);
    }

    /**
     * Get activity logs for a specific user.
     */
    public function userLogs(Request $request, $userId)
    {
        $logs = ActivityLog::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json($logs);
    }

    /**
     * Create a new activity log entry.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'user' => 'required|string',
            'user_id' => 'nullable|integer',
            'action' => 'required|string',
            'description' => 'required|string',
            'status' => 'nullable|in:success,failed,warning',
            'metadata' => 'nullable|array',
        ]);

        $log = ActivityLog::log([
            'type' => $validated['type'],
            'user' => $validated['user'],
            'user_id' => $validated['user_id'] ?? null,
            'action' => $validated['action'],
            'description' => $validated['description'],
            'status' => $validated['status'] ?? 'success',
            'metadata' => $validated['metadata'] ?? null,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'message' => 'Activity log created successfully',
            'data' => $log,
        ], 201);
    }

    /**
     * Export activity logs.
     */
    public function export(Request $request)
    {
        $query = ActivityLog::query()->orderBy('created_at', 'desc');

        // Apply same filters as index
        if ($request->has('type') && $request->type !== 'all') {
            $query->ofType($request->type);
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->withStatus($request->status);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('user', 'like', "%{$search}%")
                    ->orWhere('action', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $logs = $query->get();

        // Format for export
        $exportData = $logs->map(function ($log) {
            return [
                'ID' => $log->id,
                'Type' => $log->type,
                'User' => $log->user,
                'Action' => $log->action,
                'Description' => $log->description,
                'IP Address' => $log->ip_address,
                'Status' => $log->status,
                'Created At' => $log->created_at->format('Y-m-d H:i:s'),
            ];
        });

        return response()->json([
            'data' => $exportData,
            'count' => $exportData->count(),
        ]);
    }

    /**
     * Delete old activity logs.
     */
    public function cleanup(Request $request)
    {
        $days = $request->get('days', 90);
        $date = now()->subDays($days);

        $deleted = ActivityLog::where('created_at', '<', $date)->delete();

        return response()->json([
            'message' => "Deleted {$deleted} activity logs older than {$days} days",
            'deleted_count' => $deleted,
        ]);
    }
}
