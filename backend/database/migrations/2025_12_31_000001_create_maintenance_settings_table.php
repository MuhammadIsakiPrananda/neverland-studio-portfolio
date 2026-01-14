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
        Schema::create('maintenance_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_active')->default(false);
            $table->string('title')->default('Website Under Maintenance');
            $table->text('message')->nullable();
            $table->string('estimated_time')->nullable();
            $table->json('allowed_ips')->nullable();
            $table->timestamps();
        });

        // Insert default settings
        DB::table('maintenance_settings')->insert([
            'is_active' => false,
            'title' => 'Website Under Maintenance',
            'message' => 'We are currently performing scheduled maintenance. We will be back soon!',
            'estimated_time' => null,
            'allowed_ips' => json_encode([]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_settings');
    }
};
