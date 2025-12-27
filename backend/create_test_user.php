use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Create test user if doesn't exist
$user = User::firstOrCreate(
    ['email' => 'test@example.com'],
    [
        'name' => 'Test User',
        'username' => 'testuser',
        'password' => Hash::make('password123'),
    ]
);

echo "User created/found: " . $user->email . "\n";
echo "ID: " . $user->id . "\n";
