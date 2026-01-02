<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MaintenanceController extends Controller
{
    /**
     * Get maintenance settings
     */
    public function getSettings()
    {
        $settings = MaintenanceSettings::first();
        
        if (!$settings) {
            $settings = MaintenanceSettings::create([
                'is_active' => false,
                'title' => 'Website Under Maintenance',
                'message' => 'We are currently performing scheduled maintenance. We will be back soon!',
                'estimated_time' => null,
                'allowed_ips' => [],
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * Update maintenance settings
     */
    public function updateSettings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'is_active' => 'required|boolean',
            'title' => 'nullable|string|max:255',
            'message' => 'nullable|string',
            'estimated_time' => 'nullable|string|max:255',
            'allowed_ips' => 'nullable|array',
            'allowed_ips.*' => 'ip',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $settings = MaintenanceSettings::first();
        
        if (!$settings) {
            $settings = new MaintenanceSettings();
        }

        $settings->is_active = $request->is_active;
        
        if ($request->has('title')) {
            $settings->title = $request->title;
        }
        
        if ($request->has('message')) {
            $settings->message = $request->message;
        }
        
        if ($request->has('estimated_time')) {
            $settings->estimated_time = $request->estimated_time;
        }
        
        if ($request->has('allowed_ips')) {
            $settings->allowed_ips = $request->allowed_ips;
        }

        $settings->save();

        return response()->json([
            'success' => true,
            'message' => 'Maintenance settings updated successfully',
            'data' => $settings
        ]);
    }

    /**
     * Check if maintenance mode is active
     */
    public function checkStatus(Request $request)
    {
        $settings = MaintenanceSettings::first();
        
        if (!$settings) {
            return response()->json([
                'success' => true,
                'is_maintenance' => false,
                'data' => null
            ]);
        }

        $clientIp = $request->ip();
        $isAllowed = $settings->isIpAllowed($clientIp);

        return response()->json([
            'success' => true,
            'is_maintenance' => $settings->is_active && !$isAllowed,
            'data' => $settings->is_active ? [
                'title' => $settings->title,
                'message' => $settings->message,
                'estimated_time' => $settings->estimated_time,
            ] : null
        ]);
    }
}
