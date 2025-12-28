<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\SocialAuthController;

Route::get('/', function () {
    return view('welcome');
});

// Google OAuth Routes
Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);

// GitHub OAuth Routes
Route::get('/auth/github', [SocialAuthController::class, 'redirectToGitHub']);
Route::get('/auth/github/callback', [SocialAuthController::class, 'handleGitHubCallback']);
