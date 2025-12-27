<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'email_verified_at',
        // Profile fields
        'phone',
        'job_title',
        'company',
        'bio',
        'location',
        'website',
        // Social media
        'linkedin',
        'twitter',
        'github',
        'instagram',
        // Personal info
        'birth_date',
        'gender',
        'avatar',
        // Account settings
        'preferences',
        // OAuth fields
        'provider',
        'provider_id',
        'provider_token',
        'provider_refresh_token',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'birth_date' => 'date',
            'two_factor_enabled' => 'boolean',
            'two_factor_verified_at' => 'datetime',
            'preferences' => 'array',
        ];
    }

    /**
     * Get the user's active sessions.
     */
    public function sessions()
    {
        return $this->hasMany(UserSession::class);
    }

    /**
     * Get the user's login history.
     */
    public function loginHistory()
    {
        return $this->hasMany(LoginHistory::class)->orderBy('created_at', 'desc');
    }
}
