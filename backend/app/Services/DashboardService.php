<?php

namespace App\Services;

use App\Models\User;
use App\Models\Contact;
use App\Models\Enrollment;
use App\Models\Consultation;
use App\Models\Newsletter;
use App\Models\LoginHistory;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Cache;

class DashboardService
{
    /**
     * Get all dashboard overview statistics
     */
    public function getOverviewStats(): array
    {
        // Cache for 5 minutes to improve performance
        return Cache::remember('dashboard.overview.stats', 300, function () {
            return [
                'users' => $this->getUserStats(),
                'contacts' => $this->getContactStats(),
                'enrollments' => $this->getEnrollmentStats(),
                'consultations' => $this->getConsultationStats(),
                'newsletters' => $this->getNewsletterStats(),
                'logins' => $this->getLoginStats(),
            ];
        });
    }

    /**
     * Get user statistics
     */
    private function getUserStats(): array
    {
        try {
            $now = Carbon::now();
            
            return [
                'total' => User::count(),
                'today' => User::whereDate('created_at', $now->toDateString())->count(),
                'this_week' => User::whereBetween('created_at', [
                    $now->copy()->startOfWeek(),
                    $now->copy()->endOfWeek()
                ])->count(),
                'this_month' => User::whereMonth('created_at', $now->month)
                    ->whereYear('created_at', $now->year)
                    ->count(),
                'verified' => User::whereNotNull('email_verified_at')->count(),
            ];
        } catch (Exception $e) {
            \Log::error('Failed to get user stats: ' . $e->getMessage());
            return $this->getEmptyUserStats();
        }
    }

    /**
     * Get contact statistics
     */
    private function getContactStats(): array
    {
        try {
            return [
                'total' => Contact::count(),
                'new' => Contact::where('status', 'new')->count(),
                'replied' => Contact::where('status', 'replied')->count(),
                'today' => Contact::whereDate('created_at', Carbon::today())->count(),
            ];
        } catch (Exception $e) {
            \Log::error('Failed to get contact stats: ' . $e->getMessage());
            return ['total' => 0, 'new' => 0, 'replied' => 0, 'today' => 0];
        }
    }

    /**
     * Get enrollment statistics
     */
    private function getEnrollmentStats(): array
    {
        try {
            return [
                'total' => Enrollment::count(),
                'pending' => Enrollment::where('status', 'pending')->count(),
                'confirmed' => Enrollment::where('status', 'confirmed')->count(),
                'completed' => Enrollment::where('status', 'completed')->count(),
                'today' => Enrollment::whereDate('created_at', Carbon::today())->count(),
            ];
        } catch (Exception $e) {
            \Log::error('Failed to get enrollment stats: ' . $e->getMessage());
            return ['total' => 0, 'pending' => 0, 'confirmed' => 0, 'completed' => 0, 'today' => 0];
        }
    }

    /**
     * Get consultation statistics
     */
    private function getConsultationStats(): array
    {
        try {
            return [
                'total' => Consultation::count(),
                'pending' => Consultation::where('status', 'pending')->count(),
                'scheduled' => Consultation::where('status', 'scheduled')->count(),
                'completed' => Consultation::where('status', 'completed')->count(),
                'today' => Consultation::whereDate('created_at', Carbon::today())->count(),
            ];
        } catch (Exception $e) {
            \Log::error('Failed to get consultation stats: ' . $e->getMessage());
            return ['total' => 0, 'pending' => 0, 'scheduled' => 0, 'completed' => 0, 'today' => 0];
        }
    }

    /**
     * Get newsletter statistics
     */
    private function getNewsletterStats(): array
    {
        try {
            return [
                'total' => Newsletter::count(),
                'active' => Newsletter::where('status', 'active')->count(),
                'today' => Newsletter::whereDate('created_at', Carbon::today())->count(),
            ];
        } catch (Exception $e) {
            \Log::error('Failed to get newsletter stats: ' . $e->getMessage());
            return ['total' => 0, 'active' => 0, 'today' => 0];
        }
    }

    /**
     * Get login statistics
     */
    private function getLoginStats(): array
    {
        try {
            $today = Carbon::today();
            
            return [
                'total' => LoginHistory::count(),
                'today' => LoginHistory::whereDate('created_at', $today)->count(),
                'successful_today' => LoginHistory::whereDate('created_at', $today)
                    ->where('status', 'success')
                    ->count(),
                'failed_today' => LoginHistory::whereDate('created_at', $today)
                    ->where('status', 'failed')
                    ->count(),
            ];
        } catch (Exception $e) {
            \Log::error('Failed to get login stats: ' . $e->getMessage());
            return ['total' => 0, 'today' => 0, 'successful_today' => 0, 'failed_today' => 0];
        }
    }

    /**
     * Get empty user stats as fallback
     */
    private function getEmptyUserStats(): array
    {
        return [
            'total' => 0,
            'today' => 0,
            'this_week' => 0,
            'this_month' => 0,
            'verified' => 0,
        ];
    }

    /**
     * Clear dashboard cache
     */
    public function clearCache(): void
    {
        Cache::forget('dashboard.overview.stats');
    }
}
