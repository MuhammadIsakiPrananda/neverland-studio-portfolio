<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\LoginHistory;
use App\Models\Contact;
use App\Models\Enrollment;
use App\Models\Consultation;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard overview statistics with safe fallbacks
     */
    public function getOverviewStats(Request $request)
    {
        try {
            $stats = [
                'users' => $this->getUserStats(),
                'contacts' => $this->getContactStats(),
                'enrollments' => $this->getEnrollmentStats(),
                'consultations' => $this->getConsultationStats(),
                'newsletters' => $this->getNewsletterStats(),
                'logins' => $this->getLoginStats(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Dashboard stats error: ' . $e->getMessage());
            return response()->json([
                'success' => true,  // Return success but with zero data
                'data' => $this->getEmptyStats()
            ], 200);
        }
    }

    private function getUserStats()
    {
        try {
            return [
                'total' => User::count(),
                'today' => User::whereDate('created_at', Carbon::today())->count(),
                'this_week' => User::whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count(),
                'this_month' => User::whereMonth('created_at', Carbon::now()->month)->count(),
            ];
        } catch (\Exception $e) {
            return ['total' => 0, 'today' => 0, 'this_week' => 0, 'this_month' => 0];
        }
    }

    private function getContactStats()
    {
        try {
            return [
                'total' => Contact::count(),
                'new' => Contact::where('status', 'new')->count(),
                'today' => Contact::whereDate('created_at', Carbon::today())->count(),
            ];
        } catch (\Exception $e) {
            return ['total' => 0, 'new' => 0, 'today' => 0];
        }
    }

    private function getEnrollmentStats()
    {
        try {
            return [
                'total' => Enrollment::count(),
                'pending' => Enrollment::where('status', 'pending')->count(),
                'approved' => Enrollment::where('status', 'approved')->count(),
                'today' => Enrollment::whereDate('created_at', Carbon::today())->count(),
            ];
        } catch (\Exception $e) {
            return ['total' => 0, 'pending' => 0, 'approved' => 0, 'today' => 0];
        }
    }

    private function getConsultationStats()
    {
        try {
            return [
                'total' => Consultation::count(),
                'pending' => Consultation::where('status', 'pending')->count(),
                'scheduled' => Consultation::where('status', 'scheduled')->count(),
                'today' => Consultation::whereDate('created_at', Carbon::today())->count(),
            ];
        } catch (\Exception $e) {
            return ['total' => 0, 'pending' => 0, 'scheduled' => 0, 'today' => 0];
        }
    }

    private function getNewsletterStats()
    {
        try {
            return [
                'total' => Newsletter::count(),
                'today' => Newsletter::whereDate('created_at', Carbon::today())->count(),
            ];
        } catch (\Exception $e) {
            return ['total' => 0, 'today' => 0];
        }
    }

    private function getLoginStats()
    {
        try {
            // Use DB query directly to check table first
            $tableExists = DB::select("SHOW TABLES LIKE 'login_history'");
            if (empty($tableExists)) {
                return ['total' => 0, 'today' => 0, 'failed_today' => 0];
            }

            return [
                'total' => DB::table('login_history')->where('status', 'success')->count(),
                'today' => DB::table('login_history')->where('status', 'success')->whereDate('created_at', Carbon::today())->count(),
                'failed_today' => DB::table('login_history')->where('status', 'failed')->whereDate('created_at', Carbon::today())->count(),
            ];
        } catch (\Exception $e) {
            \Log::warning('Login stats error: ' . $e->getMessage());
            return ['total' => 0, 'today' => 0, 'failed_today' => 0];
        }
    }

    private function getEmptyStats()
    {
        return [
            'users' => ['total' => 0, 'today' => 0, 'this_week' => 0, 'this_month' => 0],
            'contacts' => ['total' => 0, 'new' => 0, 'today' => 0],
            'enrollments' => ['total' => 0, 'pending' => 0, 'approved' => 0, 'today' => 0],
            'consultations' => ['total' => 0, 'pending' => 0, 'scheduled' => 0, 'today' => 0],
            'newsletters' => ['total' => 0, 'today' => 0],
            'logins' => ['total' => 0, 'today' => 0, 'failed_today' => 0],
        ];
    }

    /**
     * Get recent activities across the platform
     */
    public function getRecentActivities(Request $request)
    {
        try {
            $limit = $request->input('limit', 10);
            $activities = collect();

            // Safely get each type of activity
            try {
                $recentContacts = Contact::latest()->take($limit)->get()->map(function ($contact) {
                    return [
                        'id' => $contact->id,
                        'type' => 'contact',
                        'title' => 'New Contact Message',
                        'description' => "From {$contact->name} - {$contact->email}",
                        'timestamp' => $contact->created_at->toISOString(),
                        'status' => $contact->status,
                    ];
                });
                $activities = $activities->merge($recentContacts);
            } catch (\Exception $e) {
                \Log::warning('Contact activities error: ' . $e->getMessage());
            }

            try {
                $recentEnrollments = Enrollment::latest()->take($limit)->get()->map(function ($enrollment) {
                    return [
                        'id' => $enrollment->id,
                        'type' => 'enrollment',
                        'title' => 'New Enrollment Request',
                        'description' => "{$enrollment->full_name} enrolled in {$enrollment->program}",
                        'timestamp' => $enrollment->created_at->toISOString(),
                        'status' => $enrollment->status,
                    ];
                });
                $activities = $activities->merge($recentEnrollments);
            } catch (\Exception $e) {
                \Log::warning('Enrollment activities error: ' . $e->getMessage());
            }

            try {
                $recentConsultations = Consultation::latest()->take($limit)->get()->map(function ($consultation) {
                    return [
                        'id' => $consultation->id,
                        'type' => 'consultation',
                        'title' => 'New Consultation Booking',
                        'description' => "{$consultation->name} - {$consultation->service_type}",
                        'timestamp' => $consultation->created_at->toISOString(),
                        'status' => $consultation->status,
                    ];
                });
                $activities = $activities->merge($recentConsultations);
            } catch (\Exception $e) {
                \Log::warning('Consultation activities error: ' . $e->getMessage());
            }

            try {
                $recentNewsletters = Newsletter::latest()->take($limit)->get()->map(function ($newsletter) {
                    return [
                        'id' => $newsletter->id,
                        'type' => 'newsletter',
                        'title' => 'New Newsletter Subscription',
                        'description' => $newsletter->email,
                        'timestamp' => $newsletter->created_at->toISOString(),
                        'status' => 'subscribed',
                    ];
                });
                $activities = $activities->merge($recentNewsletters);
            } catch (\Exception $e) {
                \Log::warning('Newsletter activities error: ' . $e->getMessage());
            }

            // Sort and limit
            $activities = $activities->sortByDesc('timestamp')->take($limit)->values();

            return response()->json([
                'success' => true,
                'data' => $activities
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Dashboard activities error: ' . $e->getMessage());
            return response()->json([
                'success' => true,
                'data' => []
            ], 200);
        }
    }

    /**
     * Get chart data for analytics
     */
    public function getChartData(Request $request)
    {
        try {
            $days = $request->input('days', 7);
            $dailyStats = [];

            for ($i = 0; $i < $days; $i++) {
                $date = Carbon::now()->subDays($days - $i - 1)->format('Y-m-d');

                $stat = [
                    'date' => $date,
                    'contacts' => 0,
                    'enrollments' => 0,
                    'consultations' => 0,
                    'logins' => 0,
                ];

                try {
                    $stat['contacts'] = Contact::whereDate('created_at', $date)->count();
                } catch (\Exception $e) {
                }

                try {
                    $stat['enrollments'] = Enrollment::whereDate('created_at', $date)->count();
                } catch (\Exception $e) {
                }

                try {
                    $stat['consultations'] = Consultation::whereDate('created_at', $date)->count();
                } catch (\Exception $e) {
                }

                try {
                    $tableExists = DB::select("SHOW TABLES LIKE 'login_history'");
                    if (!empty($tableExists)) {
                        $stat['logins'] = DB::table('login_history')->where('status', 'success')->whereDate('created_at', $date)->count();
                    }
                } catch (\Exception $e) {
                }

                $dailyStats[] = $stat;
            }

            return response()->json([
                'success' => true,
                'data' => $dailyStats
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Dashboard chart data error: ' . $e->getMessage());
            return response()->json([
                'success' => true,
                'data' => []
            ], 200);
        }
    }

    /**
     * Get comprehensive real-time statistics for dashboard
     */
    public function getRealtimeStats(Request $request)
    {
        try {
            $stats = [
                'timestamp' => now()->toIso8601String(),
                'users' => [
                    'total' => User::count(),
                    'today' => User::whereDate('created_at', Carbon::today())->count(),
                    'online' => 0, // Can be enhanced with session tracking
                    'new_this_hour' => User::where('created_at', '>=', Carbon::now()->subHour())->count(),
                ],
                'contacts' => [
                    'total' => Contact::count(),
                    'new' => Contact::where('status', 'new')->count(),
                    'in_progress' => Contact::where('status', 'in_progress')->count(),
                    'resolved' => Contact::where('status', 'resolved')->count(),
                    'today' => Contact::whereDate('created_at', Carbon::today())->count(),
                    'unread' => Contact::where('status', 'new')->count(),
                ],
                'enrollments' => [
                    'total' => Enrollment::count(),
                    'pending' => Enrollment::where('status', 'pending')->count(),
                    'approved' => Enrollment::where('status', 'approved')->count(),
                    'rejected' => Enrollment::where('status', 'rejected')->count(),
                    'today' => Enrollment::whereDate('created_at', Carbon::today())->count(),
                    'this_week' => Enrollment::whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count(),
                ],
                'consultations' => [
                    'total' => Consultation::count(),
                    'pending' => Consultation::where('status', 'pending')->count(),
                    'contacted' => Consultation::where('status', 'contacted')->count(),
                    'in_progress' => Consultation::where('status', 'in_progress')->count(),
                    'completed' => Consultation::where('status', 'completed')->count(),
                    'cancelled' => Consultation::where('status', 'cancelled')->count(),
                    'today' => Consultation::whereDate('created_at', Carbon::today())->count(),
                ],
                'newsletters' => [
                    'total' => Newsletter::count(),
                    'active' => Newsletter::where('is_active', true)->count(),
                    'today' => Newsletter::whereDate('created_at', Carbon::today())->count(),
                    'this_month' => Newsletter::whereMonth('created_at', Carbon::now()->month)->count(),
                ],
                'activity' => $this->getActivityStats(),
                'system' => [
                    'database_size' => $this->getDatabaseSize(),
                    'uptime' => 'N/A', // Can be enhanced with cache tracking
                    'last_backup' => 'N/A', // Can be enhanced with backup tracking
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'timestamp' => now()->toIso8601String(),
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Real-time stats error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch real-time statistics',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get approximate database size
     */
    private function getDatabaseSize()
    {
        try {
            $driver = config('database.default');
            
            if ($driver === 'sqlite') {
                $database = config('database.connections.sqlite.database');
                if (file_exists($database)) {
                    $size = filesize($database) / 1024 / 1024; // Convert to MB
                    return round($size, 2) . ' MB';
                }
                return 'N/A';
            }
            
            if ($driver === 'mysql') {
                $database = config('database.connections.mysql.database');
                $size = DB::select("
                    SELECT 
                        ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
                    FROM information_schema.TABLES
                    WHERE table_schema = ?
                ", [$database]);

                return isset($size[0]->size_mb) ? $size[0]->size_mb . ' MB' : 'N/A';
            }
            
            return 'N/A';
        } catch (\Exception $e) {
            \Log::error('Database size calculation error: ' . $e->getMessage());
            return 'N/A';
        }
    }

    /**
     * Get activity statistics with safe fallback
     */
    private function getActivityStats()
    {
        try {
            // Check if activity_logs table exists
            if (!DB::getSchemaBuilder()->hasTable('activity_logs')) {
                return [
                    'total_today' => 0,
                    'last_hour' => 0,
                    'last_15_minutes' => 0,
                ];
            }

            return [
                'total_today' => DB::table('activity_logs')->whereDate('created_at', Carbon::today())->count(),
                'last_hour' => DB::table('activity_logs')->where('created_at', '>=', Carbon::now()->subHour())->count(),
                'last_15_minutes' => DB::table('activity_logs')->where('created_at', '>=', Carbon::now()->subMinutes(15))->count(),
            ];
        } catch (\Exception $e) {
            \Log::error('Activity stats error: ' . $e->getMessage());
            return [
                'total_today' => 0,
                'last_hour' => 0,
                'last_15_minutes' => 0,
            ];
        }
    }
}
