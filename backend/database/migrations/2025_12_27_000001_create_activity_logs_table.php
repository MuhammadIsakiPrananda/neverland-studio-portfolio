<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // login, logout, create, update, delete, settings
            $table->string('user'); // User name or identifier
            $table->unsignedBigInteger('user_id')->nullable(); // Foreign key to users table
            $table->string('action'); // Action title
            $table->text('description'); // Action description
            $table->string('ip_address', 45)->nullable(); // IPv4 or IPv6
            $table->string('user_agent')->nullable(); // Browser user agent
            $table->string('status')->default('success'); // success, failed, warning
            $table->json('metadata')->nullable(); // Additional data as JSON
            $table->timestamps();
            
            // Add indexes for common queries
            $table->index('type');
            $table->index('user_id');
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
