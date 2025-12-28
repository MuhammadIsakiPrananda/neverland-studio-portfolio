<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'client',
        'category',
        'technologies',
        'status',
        'featured',
        'image',
        'technologies',
        'client',
        'date',
        'url',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'technologies' => 'array',
        'date' => 'date',
        'deleted_at' => 'datetime',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
