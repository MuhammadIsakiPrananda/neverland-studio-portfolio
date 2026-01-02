<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
    /**
     * Get all projects with optional filtering
     */
    public function index(Request $request)
    {
        try {
            $query = Project::query();

            // Filter by status
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Filter by category
            if ($request->has('category') && $request->category !== 'all') {
                $query->where('category', $request->category);
            }

            // Search by title or description
            if ($request->has('search') && !empty($request->search)) {
                $query->where(function($q) use ($request) {
                    $q->where('title', 'like', '%' . $request->search . '%')
                      ->orWhere('description', 'like', '%' . $request->search . '%');
                });
            }

            // Filter featured projects
            if ($request->has('featured') && $request->featured === 'true') {
                $query->where('featured', true);
            }

            // Order by date (newest first)
            $query->orderBy('date', 'desc');

            $projects = $query->get();

            return response()->json([
                'success' => true,
                'data' => $projects,
                'message' => 'Projects retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve projects: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a single project
     */
    public function show($id)
    {
        try {
            $project = Project::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $project,
                'message' => 'Project retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        }
    }

    /**
     * Create a new project
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'category' => 'required|string',
                'status' => 'required|in:draft,published,archived',
                'featured' => 'boolean',
                'image' => 'nullable|string',
                'technologies' => 'required|array',
                'client' => 'nullable|string',
                'date' => 'required|date',
                'url' => 'nullable|url',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $project = Project::create($validator->validated());

            // Log activity
            $this->logActivity('project', 'created', "Created project: {$project->title}", $project->id);

            return response()->json([
                'success' => true,
                'data' => $project,
                'message' => 'Project created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create project: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing project
     */
    public function update(Request $request, $id)
    {
        try {
            $project = Project::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'category' => 'sometimes|string',
                'status' => 'sometimes|in:draft,published,archived',
                'featured' => 'sometimes|boolean',
                'image' => 'nullable|string',
                'technologies' => 'sometimes|array',
                'client' => 'nullable|string',
                'date' => 'sometimes|date',
                'url' => 'nullable|url',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $project->update($validator->validated());

            // Log activity
            $this->logActivity('project', 'updated', "Updated project: {$project->title}", $project->id);

            return response()->json([
                'success' => true,
                'data' => $project,
                'message' => 'Project updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update project: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a project
     */
    public function destroy($id)
    {
        try {
            $project = Project::findOrFail($id);
            $projectTitle = $project->title;

            $project->delete();

            // Log activity
            $this->logActivity('project', 'deleted', "Deleted project: {$projectTitle}", $id);

            return response()->json([
                'success' => true,
                'message' => 'Project deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete project: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get project statistics
     */
    public function stats()
    {
        try {
            $stats = [
                'total' => Project::count(),
                'draft' => Project::where('status', 'draft')->count(),
                'published' => Project::where('status', 'published')->count(),
                'archived' => Project::where('status', 'archived')->count(),
                'featured' => Project::where('featured', true)->count(),
                'categories' => Project::select('category')
                    ->distinct()
                    ->pluck('category')
                    ->toArray(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Project statistics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Log activity
     */
    private function logActivity($type, $action, $description, $relatedId = null)
    {
        try {
            \App\Models\ActivityLog::create([
                'type' => $type,
                'action' => $action,
                'description' => $description,
                'related_id' => $relatedId,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to log activity: ' . $e->getMessage());
        }
    }
}
