<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\User;
use App\Models\Enrollment;
use App\Models\Consultation;
use App\Models\Project;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    /**
     * Get analytics overview
     */
    public function overview()
    {
        try {
            $data = [
                'total_contacts' => Contact::count(),
                'total_users' => User::count(),
                'total_enrollments' => Enrollment::count(),
                'total_consultations' => Consultation::count(),
                'total_projects' => Project::count(),
                'total_subscribers' => Newsletter::where('is_active', true)->count(),

                // This month stats
                'contacts_this_month' => Contact::whereMonth('created_at', now()->month)->count(),
                'users_this_month' => User::whereMonth('created_at', now()->month)->count(),
                'enrollments_this_month' => Enrollment::whereMonth('created_at', now()->month)->count(),
                'consultations_this_month' => Consultation::whereMonth('created_at', now()->month)->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch analytics overview',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get visitor trends (last 30 days)
     */
    public function visitors()
    {
        try {
            // Mock data for now - in production, integrate with analytics service
            $data = [];
            for ($i = 29; $i >= 0; $i--) {
                $date = now()->subDays($i)->format('Y-m-d');
                $data[] = [
                    'date' => $date,
                    'visitors' => rand(50, 200),
                    'page_views' => rand(100, 500),
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch visitor trends',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get traffic sources
     */
    public function traffic()
    {
        try {
            // Mock data - integrate with Google Analytics or similar
            $data = [
                ['source' => 'Direct', 'visitors' => 450],
                ['source' => 'Google Search', 'visitors' => 780],
                ['source' => 'Social Media', 'visitors' => 320],
                ['source' => 'Referral', 'visitors' => 180],
                ['source' => 'Email', 'visitors' => 120],
            ];

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch traffic sources',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get conversion rates
     */
    public function conversions()
    {
        try {
            $total_contacts = Contact::count();
            $total_enrollments = Enrollment::count();
            $total_consultations = Consultation::count();
            $total_subscribers = Newsletter::where('is_active', true)->count();

            // Calculate conversion rates (example metrics)
            $visitors = 5000; // Mock - should come from analytics

            $data = [
                'contact_rate' => $visitors > 0 ? round(($total_contacts / $visitors) * 100, 2) : 0,
                'enrollment_rate' => $visitors > 0 ? round(($total_enrollments / $visitors) * 100, 2) : 0,
                'consultation_rate' => $visitors > 0 ? round(($total_consultations / $visitors) * 100, 2) : 0,
                'newsletter_rate' => $visitors > 0 ? round(($total_subscribers / $visitors) * 100, 2) : 0,
            ];

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch conversion rates',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get popular pages
     */
    public function pages()
    {
        try {
            // Mock data - should integrate with analytics service
            $data = [
                ['page' => '/home', 'views' => 1250],
                ['page' => '/projects', 'views' => 980],
                ['page' => '/services', 'views' => 760],
                ['page' => '/about', 'views' => 540],
                ['page' => '/contact', 'views' => 420],
                ['page' => '/courses', 'views' => 380],
            ];

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch popular pages',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
