<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'invoice_number',
        'client_name',
        'client_email',
        'client_phone',
        'product_name',
        'description',
        'amount',
        'status',
        'payment_method',
        'payment_reference',
        'paid_at',
        'due_date',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
        'due_date' => 'datetime',
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Generate unique invoice number with database locking for concurrent safety
     * Format: INV-YYYYMMDD-XXXX (sequential per day)
     */
    public static function generateInvoiceNumber(): string
    {
        return \DB::transaction(function () {
            $prefix = 'INV';
            $date = now()->format('Ymd');
            
            // Lock table to prevent race conditions in concurrent requests
            $lastInvoice = self::lockForUpdate()
                ->where('invoice_number', 'like', "{$prefix}-{$date}-%")
                ->orderBy('invoice_number', 'desc')
                ->first();
            
            if ($lastInvoice) {
                // Extract sequence number from last invoice and increment
                $lastNumber = (int) substr($lastInvoice->invoice_number, -4);
                $count = $lastNumber + 1;
            } else {
                // First invoice of the day
                $count = 1;
            }
            
            return sprintf('%s-%s-%04d', $prefix, $date, $count);
        });
    }

    /**
     * Scope for filtering by status
     */
    public function scopeStatus($query, $status)
    {
        if ($status && $status !== 'all') {
            return $query->where('status', $status);
        }
        return $query;
    }

    /**
     * Scope for search
     */
    public function scopeSearch($query, $search)
    {
        if ($search) {
            return $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhere('client_name', 'like', "%{$search}%")
                  ->orWhere('client_email', 'like', "%{$search}%")
                  ->orWhere('product_name', 'like', "%{$search}%");
            });
        }
        return $query;
    }

    /**
     * Check if transaction is overdue
     */
    public function isOverdue(): bool
    {
        return $this->status === 'pending' 
            && $this->due_date 
            && $this->due_date->isPast();
    }

    /**
     * Mark as paid
     */
    public function markAsPaid(?string $paymentMethod = null, ?string $paymentReference = null): bool
    {
        $this->status = 'paid';
        $this->paid_at = now();
        
        if ($paymentMethod) {
            $this->payment_method = $paymentMethod;
        }
        
        if ($paymentReference) {
            $this->payment_reference = $paymentReference;
        }
        
        return $this->save();
    }
}
