<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Create admin user
$admin = User::updateOrCreate(
    ['email' => 'admin@neverlandstudio.com'],
    [
        'name' => 'Administrator',
        'username' => 'admin',
        'password' => Hash::make('admin123'),
    ]
);

echo "✅ Admin user created successfully!\n";
echo "Email: " . $admin->email . "\n";
echo "Username: admin\n";
echo "Password: admin123\n";
echo "ID: " . $admin->id . "\n";

// Also create superadmin
$superadmin = User::updateOrCreate(
    ['email' => 'superadmin@neverlandstudio.com'],
    [
        'name' => 'Super Admin',
        'username' => 'superadmin',
        'password' => Hash::make('admin123'),
    ]
);

echo "\n✅ Super Admin user created successfully!\n";
echo "Email: " . $superadmin->email . "\n";
echo "Username: superadmin\n";
echo "Password: admin123\n";
echo "ID: " . $superadmin->id . "\n";
