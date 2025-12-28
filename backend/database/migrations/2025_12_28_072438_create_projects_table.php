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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('client')->nullable();
            $table->string('category')->nullable(); // web, mobile, design, etc
            $table->json('technologies')->nullable(); // Array of tech stack
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->boolean('featured')->default(false);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('project_url', 500)->nullable();
            $table->string('github_url', 500)->nullable();
            $table->json('images')->nullable(); // Array of image URLs
            $table->integer('order')->default(0); // Display order
            $table->timestamps();

            // Indexes for faster queries
            $table->index('status');
            $table->index('category');
            $table->index('featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
