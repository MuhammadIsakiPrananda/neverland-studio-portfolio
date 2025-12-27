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
        Schema::table('users', function (Blueprint $table) {
            // Basic profile fields
            $table->string('phone', 20)->nullable();
            $table->string('job_title')->nullable();
            $table->string('company')->nullable();
            $table->text('bio')->nullable();
            $table->string('location')->nullable();
            $table->string('website')->nullable();

            // Social media links
            $table->string('linkedin')->nullable();
            $table->string('twitter')->nullable();
            $table->string('github')->nullable();
            $table->string('instagram')->nullable();

            // Personal information
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['male', 'female', 'other', 'prefer-not-to-say'])->nullable();

            // Avatar (can be base64 or URL)
            $table->text('avatar')->nullable();

            // Account preferences and settings (JSON)
            $table->json('preferences')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'job_title',
                'company',
                'bio',
                'location',
                'website',
                'linkedin',
                'twitter',
                'github',
                'instagram',
                'birth_date',
                'gender',
                'avatar',
                'preferences'
            ]);
        });
    }
};
