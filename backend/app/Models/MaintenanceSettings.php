<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceSettings extends Model
{
    use HasFactory;

    protected $fillable = [
        'is_active',
        'title',
        'message',
        'estimated_time',
        'allowed_ips',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'allowed_ips' => 'array',
    ];

    /**
     * Check if IP is allowed during maintenance
     */
    public function isIpAllowed(string $ip): bool
    {
        $allowedIps = $this->allowed_ips ?? [];
        return in_array($ip, $allowedIps);
    }
}
