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
            $table->text('description');
            $table->string('category');
            $table->enum('status', ['active', 'completed', 'archived'])->default('active');
            $table->boolean('featured')->default(false);
            $table->string('image')->nullable();
            $table->json('technologies');
            $table->string('client')->nullable();
            $table->date('date');
            $table->string('url')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index('status');
            $table->index('category');
            $table->index('featured');
            $table->index('date');
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
