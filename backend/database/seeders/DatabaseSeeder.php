<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user if doesn't exist
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'username' => 'testuser',
                'password' => Hash::make('password123'),
            ]
        );

        // Create admin user if doesn't exist
        User::firstOrCreate(
            ['email' => 'admin@neverlandstudio.com'],
            [
                'name' => 'Admin Neverland',
                'username' => 'admin',
                'password' => Hash::make('Admin@123'),
            ]
        );

        echo "✓ Test users created successfully!\n";
        echo "Test User: test@example.com / password123\n";
        echo "Admin User: admin@neverlandstudio.com / Admin@123\n\n";

        // Seed projects
        $this->call([
            ProjectSeeder::class,
        ]);

        echo "✓ Projects seeded successfully!\n";
    }
}
