<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contact;
use App\Models\Enrollment;
use App\Models\Consultation;
use App\Models\Newsletter;
use Carbon\Carbon;

class DashboardDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data first
        Contact::truncate();
        Enrollment::truncate();
        Consultation::truncate();
        Newsletter::truncate();
        
        // Create sample contacts (without phone field)
        Contact::insert([
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'subject' => 'Web Development Inquiry',
                'message' => 'Interested in web development services',
                'status' => 'new',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'subject' => 'Mobile App Consultation',
                'message' => 'Need consultation for mobile app',
                'status' => 'new',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Bob Johnson',
                'email' => 'bob@example.com',
                'subject' => 'Cloud Infrastructure',
                'message' => 'Cloud infrastructure setup',
                'status' => 'read',
                'created_at' => Carbon::yesterday(),
                'updated_at' => Carbon::yesterday(),
            ],
            [
                'name' => 'Sarah Williams',
                'email' => 'sarah@example.com',
                'subject' => 'E-commerce Development',
                'message' => 'E-commerce platform development',
                'status' => 'new',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Mike Chen',
                'email' => 'mike@example.com',
                'subject' => 'Mobile App Project',
                'message' => 'Mobile app consultation needed',
                'status' => 'read',
                'created_at' => Carbon::subDays(2),
                'updated_at' => Carbon::subDays(2),
            ],
        ]);

        // Create sample enrollments (without phone field)
        Enrollment::insert([
            [
                'name' => 'Alice Brown',
                'email' => 'alice@example.com',
                'course' => 'React.js Development',
                'message' => 'Interested in advanced React course',
                'status' => 'pending',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Charlie Wilson',
                'email' => 'charlie@example.com',
                'course' => 'Node.js Backend',
                'message' => 'Want to learn backend development',
                'status' => 'pending',
                'created_at' => Carbon::yesterday(),
                'updated_at' => Carbon::yesterday(),
            ],
            [
                'name' => 'Diana Martinez',
                'email' => 'diana@example.com',
                'course' => 'Full Stack Development',
                'message' => 'Complete web development bootcamp',
                'status' => 'approved',
                'created_at' => Carbon::subDays(2),
                'updated_at' => Carbon::subDays(2),
            ],
            [
                'name' => 'Eric Taylor',
                'email' => 'eric@example.com',
                'course' => 'Python & Django',
                'message' => 'Learn Python web development',
                'status' => 'approved',
                'created_at' => Carbon::subDays(3),
                'updated_at' => Carbon::subDays(3),
            ],
        ]);

        // Create sample consultations (without phone field)
        Consultation::insert([
            [
                'name' => 'David Lee',
                'email' => 'david@example.com',
                'preferred_date' => Carbon::tomorrow()->format('Y-m-d'),
                'preferred_time' => '10:00',
                'topic' => 'System Architecture',
                'message' => 'Need help with system design',
                'status' => 'pending',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Emma Davis',
                'email' => 'emma@example.com',
                'preferred_date' => Carbon::addDays(2)->format('Y-m-d'),
                'preferred_time' => '14:00',
                'topic' => 'Cloud Migration',
                'message' => 'Planning to migrate to cloud',
                'status' => 'scheduled',
                'created_at' => Carbon::yesterday(),
                'updated_at' => Carbon::yesterday(),
            ],
            [
                'name' => 'Frank Garcia',
                'email' => 'frank@example.com',
                'preferred_date' => Carbon::addDays(3)->format('Y-m-d'),
                'preferred_time' => '15:30',
                'topic' => 'Database Optimization',
                'message' => 'Database performance issues',
                'status' => 'pending',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);

        // Create sample newsletter subscribers
        $subscribers = [];
        for ($i = 1; $i <= 15; $i++) {
            $subscribers[] = [
                'email' => "subscriber{$i}@example.com",
                'status' => 'subscribed',
                'created_at' => Carbon::now()->subDays(rand(0, 7)),
                'updated_at' => Carbon::now()->subDays(rand(0, 7)),
            ];
        }
        Newsletter::insert($subscribers);

        $this->command->info('\n✅ Dashboard data seeded successfully!');
        $this->command->info('📊 Created:');
        $this->command->info('   - ' . Contact::count() . ' contacts');
        $this->command->info('   - ' . Enrollment::count() . ' enrollments');
        $this->command->info('   - ' . Consultation::count() . ' consultations');
        $this->command->info('   - ' . Newsletter::count() . ' newsletter subscribers');
    }
}
