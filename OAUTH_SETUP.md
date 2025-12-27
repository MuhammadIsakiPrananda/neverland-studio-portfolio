# OAuth Authentication Setup Guide

This guide explains how to configure Google and GitHub OAuth authentication for the Neverland Studio Portfolio application.

## Table of Contents
- [Overview](#overview)
- [Google OAuth Setup](#google-oauth-setup)
- [GitHub OAuth Setup](#github-oauth-setup)
- [Backend Configuration](#backend-configuration)
- [Frontend Integration](#frontend-integration)
- [Testing OAuth Flow](#testing-oauth-flow)
- [Troubleshooting](#troubleshooting)

---

## Overview

The application supports social login via:
- **Google OAuth 2.0** - Login with Google account
- **GitHub OAuth** - Login with GitHub account

Users can register/login using their social accounts, and the system will automatically:
- Create a new user account if email doesn't exist
- Link social account to existing user if email matches
- Store OAuth tokens for future API access
- Verify email automatically (social accounts are pre-verified)

---

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** for your project

### 2. Configure OAuth Consent Screen

1. Navigate to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type (or Internal for workspace)
3. Fill in required information:
   - **App name**: Neverland Studio Portfolio
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
5. Add test users if using External type
6. Click **Save and Continue**

### 3. Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Choose **Web application**
4. Configure settings:
   - **Name**: Neverland Studio Web Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:5173
     http://localhost:8000
     https://yourdomain.com (production)
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:8000/api/auth/google/callback
     https://yourdomain.com/api/auth/google/callback (production)
     ```
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

### 4. Update Environment Variables

Add to your `backend/.env` file:
```env
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
GOOGLE_REDIRECT_URL=http://localhost:8000/api/auth/google/callback
```

---

## GitHub OAuth Setup

### 1. Register OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in application details:
   - **Application name**: Neverland Studio Portfolio
   - **Homepage URL**: `http://localhost:5173` (development)
   - **Authorization callback URL**: 
     ```
     http://localhost:8000/api/auth/github/callback
     ```
4. Click **Register application**

### 2. Generate Client Secret

1. After registration, click **Generate a new client secret**
2. Copy the **Client ID** and **Client Secret** immediately
   - ⚠️ **Important**: Client secret is shown only once!

### 3. Update Environment Variables

Add to your `backend/.env` file:
```env
GITHUB_CLIENT_ID=your-actual-github-client-id
GITHUB_CLIENT_SECRET=your-actual-github-client-secret
GITHUB_REDIRECT_URL=http://localhost:8000/api/auth/github/callback
```

### 4. Production Configuration

For production deployment:
1. Create another OAuth App or update existing app
2. Update URLs:
   - **Homepage URL**: `https://yourdomain.com`
   - **Callback URL**: `https://yourdomain.com/api/auth/github/callback`
3. Update production `.env` with new credentials

---

## Backend Configuration

### 1. Install Dependencies

The Laravel Socialite package is already added to `composer.json`:

```bash
cd backend
composer install
```

### 2. Run Database Migration

Create OAuth fields in users table:

```bash
php artisan migrate
```

This will add:
- `provider` - OAuth provider name (google/github)
- `provider_id` - Unique ID from OAuth provider
- `provider_token` - Access token from provider
- `provider_refresh_token` - Refresh token (if available)
- `role` - User role (user/admin)

### 3. Verify Configuration

Check `config/services.php`:
```php
'google' => [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect' => env('GOOGLE_REDIRECT_URL'),
],

'github' => [
    'client_id' => env('GITHUB_CLIENT_ID'),
    'client_secret' => env('GITHUB_CLIENT_SECRET'),
    'redirect' => env('GITHUB_REDIRECT_URL'),
],
```

### 4. API Routes

OAuth routes are already configured in `routes/api.php`:
```php
// Social authentication routes
Route::get('/{provider}/redirect', [SocialAuthController::class, 'redirect'])
    ->where('provider', 'google|github');
Route::get('/{provider}/callback', [SocialAuthController::class, 'callback'])
    ->where('provider', 'google|github');
```

---

## Frontend Integration

### 1. OAuth Buttons

The login page (`DashboardLogin.tsx`) includes social login buttons:
- Google button with Chrome icon
- GitHub button with GitHub icon

### 2. OAuth Flow

When user clicks social login button:
1. Frontend calls `authService.socialLogin(provider)`
2. Backend returns OAuth provider's authorization URL
3. Frontend redirects to OAuth provider
4. User authorizes on provider's page
5. Provider redirects to callback URL with authorization code
6. `OAuthCallback` component handles the code
7. Backend exchanges code for user info and creates/updates user
8. Frontend stores token and redirects to dashboard

### 3. Callback Handling

The `OAuthCallback.tsx` component:
- Shows loading state during authentication
- Handles success/error states
- Redirects to dashboard on success
- Redirects back to login on error

---

## Testing OAuth Flow

### 1. Start Development Servers

**Backend:**
```bash
cd backend
php artisan serve
```

**Frontend:**
```bash
npm run dev
```

### 2. Test Google Login

1. Navigate to `http://localhost:5173/dashboard`
2. Click **Google** button
3. Select Google account
4. Grant permissions
5. Should redirect back and login successfully

### 3. Test GitHub Login

1. Navigate to `http://localhost:5173/dashboard`
2. Click **GitHub** button
3. Authorize application
4. Should redirect back and login successfully

### 4. Verify User Creation

Check database:
```sql
SELECT id, name, email, provider, provider_id, email_verified_at 
FROM users 
WHERE provider IS NOT NULL;
```

---

## Troubleshooting

### Common Issues

#### 1. "redirect_uri_mismatch" Error

**Problem**: OAuth provider rejects redirect URL

**Solution**: 
- Ensure callback URL in OAuth app matches exactly
- Include protocol (http/https)
- No trailing slashes
- Check port number

#### 2. CORS Errors

**Problem**: Frontend can't call backend OAuth endpoints

**Solution**: 
Add to `backend/config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie', 'api/auth/*/callback'],
'supports_credentials' => true,
```

#### 3. "Client authentication failed"

**Problem**: Invalid client credentials

**Solution**:
- Verify CLIENT_ID and CLIENT_SECRET in `.env`
- Regenerate secret if needed
- Clear config cache: `php artisan config:clear`

#### 4. Token Not Stored

**Problem**: User logged in but token not saved

**Solution**:
- Check browser console for errors
- Verify `authService.handleOAuthCallback` stores token
- Check localStorage in DevTools

#### 5. Email Already Exists

**Problem**: User with email already exists without OAuth

**Solution**:
The system automatically links OAuth to existing account by email.
If error persists, check User model `$fillable` array includes OAuth fields.

### Debug Mode

Enable debug logging in `SocialAuthController`:
```php
Log::info('OAuth callback', [
    'provider' => $provider,
    'user' => $socialUser->getEmail(),
]);
```

Check logs:
```bash
tail -f storage/logs/laravel.log
```

---

## Security Considerations

### Production Checklist

- [ ] Use HTTPS for all OAuth callbacks
- [ ] Store CLIENT_SECRET securely (never commit to git)
- [ ] Set `APP_DEBUG=false` in production
- [ ] Enable rate limiting on OAuth endpoints
- [ ] Implement CSRF protection
- [ ] Use environment-specific OAuth apps
- [ ] Monitor login attempts and failures
- [ ] Implement account linking confirmation
- [ ] Add email notification for new social login
- [ ] Regularly rotate OAuth secrets

### Best Practices

1. **Separate OAuth Apps**: Use different OAuth apps for dev/staging/production
2. **Minimal Scopes**: Only request necessary permissions
3. **Token Refresh**: Implement token refresh for long-lived sessions
4. **Secure Storage**: Never expose tokens in frontend code
5. **Audit Trail**: Log all OAuth authentication attempts

---

## Additional Resources

### Documentation

- [Laravel Socialite](https://laravel.com/docs/11.x/socialite)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Apps](https://docs.github.com/en/apps/oauth-apps)

### Support

For issues or questions:
- Create an issue on [GitHub Repository](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio)
- Check existing issues for solutions
- Contact: [Your Email]

---

## Quick Reference

### Environment Variables Template

```env
# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMnOpQrStUvWxYz
GOOGLE_REDIRECT_URL=http://localhost:8000/api/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=Iv1.a1b2c3d4e5f6g7h8
GITHUB_CLIENT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
GITHUB_REDIRECT_URL=http://localhost:8000/api/auth/github/callback
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/google/redirect` | GET | Get Google OAuth URL |
| `/api/auth/google/callback` | GET | Handle Google callback |
| `/api/auth/github/redirect` | GET | Get GitHub OAuth URL |
| `/api/auth/github/callback` | GET | Handle GitHub callback |

### Database Schema

```sql
-- OAuth fields in users table
provider VARCHAR(255) NULL          -- 'google' or 'github'
provider_id VARCHAR(255) NULL       -- Unique ID from provider
provider_token TEXT NULL             -- OAuth access token
provider_refresh_token TEXT NULL     -- OAuth refresh token
role VARCHAR(255) DEFAULT 'user'     -- User role
```

---

**Last Updated**: December 27, 2025
**Version**: 1.0.0
