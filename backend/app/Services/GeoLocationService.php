<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeoLocationService
{
    /**
     * IP-API.com endpoint (free tier: 45 requests/minute)
     */
    private const API_URL = 'http://ip-api.com/json/';
    
    /**
     * Cache TTL: 24 hours (86400 seconds)
     */
    private const CACHE_TTL = 86400;
    
    /**
     * API timeout: 3 seconds
     */
    private const TIMEOUT = 3;

    /**
     * Get location from IP address
     * 
     * @param string $ip IP address to lookup
     * @return string Formatted location string
     */
    public static function getLocation(string $ip): string
    {
        // Handle local/private IPs
        if (self::isLocalIp($ip)) {
            return 'Local';
        }

        // Check cache first to reduce API calls
        $cacheKey = "geoip_{$ip}";
        if (Cache::has($cacheKey)) {
            Log::debug("GeoIP cache hit for {$ip}");
            return Cache::get($cacheKey);
        }

        try {
            Log::debug("GeoIP API call for {$ip}");
            
            // Call GeoIP API
            $response = Http::timeout(self::TIMEOUT)
                ->get(self::API_URL . $ip);

            if ($response->successful()) {
                $data = $response->json();
                
                if (isset($data['status']) && $data['status'] === 'success') {
                    $location = self::formatLocation($data);
                    
                    // Cache for 24 hours
                    Cache::put($cacheKey, $location, self::CACHE_TTL);
                    
                    Log::info("GeoIP success for {$ip}: {$location}");
                    return $location;
                }
                
                Log::warning("GeoIP API returned failure status", ['ip' => $ip, 'data' => $data]);
            } else {
                Log::warning("GeoIP API request failed", [
                    'ip' => $ip,
                    'status' => $response->status()
                ]);
            }
        } catch (\Exception $e) {
            Log::warning("GeoIP lookup failed for {$ip}: " . $e->getMessage());
        }

        // Fallback to unknown location
        return 'Unknown Location';
    }

    /**
     * Format location data into readable string
     * 
     * @param array $data GeoIP API response data
     * @return string Formatted location (e.g., "Jakarta, DKI Jakarta, Indonesia")
     */
    private static function formatLocation(array $data): string
    {
        $parts = [];
        
        // Add city if available
        if (!empty($data['city'])) {
            $parts[] = $data['city'];
        }
        
        // Add region/state if available and different from city
        if (!empty($data['regionName']) && $data['regionName'] !== ($data['city'] ?? '')) {
            $parts[] = $data['regionName'];
        }
        
        // Add country
        if (!empty($data['country'])) {
            $parts[] = $data['country'];
        }

        return !empty($parts) ? implode(', ', $parts) : 'Unknown Location';
    }

    /**
     * Check if IP is local/private
     * 
     * @param string $ip IP address to check
     * @return bool True if local/private IP
     */
    private static function isLocalIp(string $ip): bool
    {
        // Localhost
        if ($ip === '127.0.0.1' || $ip === '::1') {
            return true;
        }

        // Private/reserved IP ranges
        return filter_var(
            $ip, 
            FILTER_VALIDATE_IP, 
            FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
        ) === false;
    }
}
