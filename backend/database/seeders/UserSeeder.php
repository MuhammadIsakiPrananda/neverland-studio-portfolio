<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test user
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'username' => 'testuser',
                'password' => Hash::make('password123'),
                'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=test@example.com&backgroundColor=b6e3f4',
            ]
        );

        // Create admin user
        User::firstOrCreate(
            ['email' => 'admin@neverlandstudio.com'],
            [
                'name' => 'Admin Neverland',
                'username' => 'admin',
                'password' => Hash::make('admin123'),
                'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin@neverlandstudio.com&backgroundColor=c0aede',
            ]
        );

        echo "✅ Test users created successfully!\n";
        echo "Test User: test@example.com / password123\n";
        echo "Admin User: admin@neverlandstudio.com / admin123\n";
    }
}
