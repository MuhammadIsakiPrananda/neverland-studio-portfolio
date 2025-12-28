<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SecurityController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\ConsultationController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\SocialAuthController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\ProjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health check endpoint
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'message' => 'Backend is running']);
});

// Public authentication routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    // Social authentication routes
    Route::get('/{provider}/redirect', [SocialAuthController::class, 'redirect'])
        ->where('provider', 'google|github');
    Route::get('/{provider}/callback', [SocialAuthController::class, 'callback'])
        ->where('provider', 'google|github');
});

// Public routes for website features
Route::post('/contact', [ContactController::class, 'store']);
Route::post('/enrollments', [EnrollmentController::class, 'store']);
Route::post('/consultations', [ConsultationController::class, 'store']);
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);
Route::post('/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe']);

// Dashboard routes - accessible without backend auth (frontend has its own protection)
Route::prefix('dashboard')->group(function () {
    Route::get('/overview-stats', [App\Http\Controllers\Api\DashboardController::class, 'getOverviewStats']);
    Route::get('/recent-activities', [App\Http\Controllers\Api\DashboardController::class, 'getRecentActivities']);
    Route::get('/chart-data', [App\Http\Controllers\Api\DashboardController::class, 'getChartData']);
});

// Admin routes - accessible without backend auth (dashboard has frontend auth)
Route::prefix('admin')->group(function () {
    // Contact management
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::patch('/contacts/{id}/status', [ContactController::class, 'updateStatus']);
    Route::delete('/contacts/{id}', [ContactController::class, 'destroy']);

    // Enrollment management
    Route::get('/enrollments', [EnrollmentController::class, 'index']);
    Route::patch('/enrollments/{id}/status', [EnrollmentController::class, 'updateStatus']);

    // Consultation management
    Route::get('/consultations', [ConsultationController::class, 'index']);
    Route::patch('/consultations/{id}/status', [ConsultationController::class, 'updateStatus']);

    // Newsletter management
    Route::get('/newsletters', [NewsletterController::class, 'index']);
    Route::delete('/newsletters/{id}', [NewsletterController::class, 'destroy']);
    Route::get('/newsletters/export', [NewsletterController::class, 'export']);

    // Analytics
    Route::get('/analytics/overview', [App\Http\Controllers\Admin\AnalyticsController::class, 'overview']);
    Route::get('/analytics/visitors', [App\Http\Controllers\Admin\AnalyticsController::class, 'visitors']);
    Route::get('/analytics/traffic', [App\Http\Controllers\Admin\AnalyticsController::class, 'traffic']);
    Route::get('/analytics/conversions', [App\Http\Controllers\Admin\AnalyticsController::class, 'conversions']);
    Route::get('/analytics/pages', [App\Http\Controllers\Admin\AnalyticsController::class, 'pages']);

    // Project management
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::get('/projects/stats', [ProjectController::class, 'stats']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
    Route::post('/projects/{id}/upload', [App\Http\Controllers\Admin\ProjectController::class, 'uploadImages']);
    Route::get('/projects/meta/categories', [App\Http\Controllers\Admin\ProjectController::class, 'categories']);

    // User management
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/stats', [UserController::class, 'stats']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::post('/users/{id}/restore', [UserController::class, 'restore']);

    // Activity logs management
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);
    Route::get('/activity-logs/stats', [ActivityLogController::class, 'stats']);
    Route::get('/activity-logs/recent', [ActivityLogController::class, 'recent']);
    Route::get('/activity-logs/export', [ActivityLogController::class, 'export']);
    Route::post('/activity-logs', [ActivityLogController::class, 'store']);
    Route::delete('/activity-logs/cleanup', [ActivityLogController::class, 'cleanup']);
    Route::get('/activity-logs/user/{userId}', [ActivityLogController::class, 'userLogs']);

    // Real-time dashboard stats
    Route::get('/realtime/stats', [App\Http\Controllers\Api\DashboardController::class, 'getRealtimeStats']);
});

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
    });

    // Profile routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'getProfile']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::post('/avatar', [ProfileController::class, 'uploadAvatar']);
    });

    // Security routes
    Route::prefix('security')->group(function () {
        Route::post('/change-password', [SecurityController::class, 'changePassword']);

        // 2FA routes
        Route::prefix('2fa')->group(function () {
            Route::post('/enable', [SecurityController::class, 'enable2FA']);
            Route::post('/verify', [SecurityController::class, 'verify2FA']);
            Route::post('/disable', [SecurityController::class, 'disable2FA']);
        });

        // Login history and sessions
        Route::get('/login-history', [SecurityController::class, 'getLoginHistory']);
        Route::get('/sessions', [SecurityController::class, 'getActiveSessions']);
        Route::delete('/sessions/{sessionId}', [SecurityController::class, 'revokeSession']);
    });
});
