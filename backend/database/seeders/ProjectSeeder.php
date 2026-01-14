<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use Carbon\Carbon;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = [
            [
                'title' => 'E-Commerce Platform',
                'description' => 'A modern e-commerce platform with advanced features including real-time inventory management, payment gateway integration, and AI-powered product recommendations.',
                'category' => 'Web Development',
                'status' => 'published',
                'featured' => true,
                'image' => 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
                'technologies' => ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
                'client' => 'TechMart Inc',
                'date' => Carbon::now()->subMonths(2)->format('Y-m-d'),
                'url' => 'https://example.com/ecommerce',
            ],
            [
                'title' => 'Healthcare Management System',
                'description' => 'Comprehensive healthcare management system with patient records, appointment scheduling, telemedicine integration, and prescription management.',
                'category' => 'Healthcare',
                'status' => 'published',
                'featured' => true,
                'image' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
                'technologies' => ['Vue.js', 'Laravel', 'PostgreSQL', 'Docker'],
                'client' => 'MediCare Solutions',
                'date' => Carbon::now()->subMonths(4)->format('Y-m-d'),
                'url' => 'https://example.com/healthcare',
            ],
            [
                'title' => 'Real Estate Portal',
                'description' => 'Modern real estate portal with property listings, virtual tours, mortgage calculators, and integrated CRM for agents.',
                'category' => 'Real Estate',
                'status' => 'published',
                'featured' => false,
                'image' => 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
                'technologies' => ['Next.js', 'TypeScript', 'Prisma', 'Google Maps API'],
                'client' => 'PropertyHub',
                'date' => Carbon::now()->subMonths(3)->format('Y-m-d'),
                'url' => 'https://example.com/realestate',
            ],
            [
                'title' => 'Financial Dashboard',
                'description' => 'Advanced financial analytics dashboard with real-time data visualization, custom reporting, and AI-powered insights.',
                'category' => 'Finance',
                'status' => 'published',
                'featured' => true,
                'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
                'technologies' => ['React', 'D3.js', 'Python', 'FastAPI', 'Redis'],
                'client' => 'FinanceFlow',
                'date' => Carbon::now()->subMonths(1)->format('Y-m-d'),
                'url' => 'https://example.com/finance',
            ],
            [
                'title' => 'Learning Management System',
                'description' => 'Interactive learning management system with video streaming, assessments, progress tracking, and certification.',
                'category' => 'Education',
                'status' => 'published',
                'featured' => false,
                'image' => 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop',
                'technologies' => ['Angular', 'Django', 'MySQL', 'WebRTC'],
                'client' => 'EduTech Academy',
                'date' => Carbon::now()->subMonths(5)->format('Y-m-d'),
                'url' => 'https://example.com/lms',
            ],
            [
                'title' => 'Social Media Analytics Tool',
                'description' => 'Comprehensive social media analytics tool with multi-platform integration, sentiment analysis, and performance metrics.',
                'category' => 'Marketing',
                'status' => 'published',
                'featured' => false,
                'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
                'technologies' => ['React', 'Node.js', 'GraphQL', 'MongoDB', 'ML'],
                'client' => 'SocialMetrics',
                'date' => Carbon::now()->subMonths(2)->format('Y-m-d'),
                'url' => 'https://example.com/analytics',
            ],
            [
                'title' => 'Restaurant Ordering System',
                'description' => 'Mobile-first restaurant ordering system with QR code menus, real-time order tracking, and kitchen management.',
                'category' => 'Hospitality',
                'status' => 'draft',
                'featured' => false,
                'image' => 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
                'technologies' => ['React Native', 'Firebase', 'Stripe'],
                'client' => 'FoodHub',
                'date' => Carbon::now()->format('Y-m-d'),
                'url' => null,
            ],
            [
                'title' => 'Logistics Management Platform',
                'description' => 'End-to-end logistics management platform with route optimization, fleet tracking, and delivery scheduling.',
                'category' => 'Logistics',
                'status' => 'published',
                'featured' => true,
                'image' => 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=800&h=600&fit=crop',
                'technologies' => ['Vue.js', 'Spring Boot', 'PostgreSQL', 'Google Maps'],
                'client' => 'LogiTech Solutions',
                'date' => Carbon::now()->subMonths(3)->format('Y-m-d'),
                'url' => 'https://example.com/logistics',
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}
