# OAuth Setup - Quick Guide

## ⚠️ Important Configuration

OAuth requires specific redirect URLs to work properly. Follow these steps carefully.

## Backend Environment Variables

Add to `backend/.env`:
```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URL=http://localhost:8000/api/auth/google/callback

# GitHub OAuth  
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here
GITHUB_REDIRECT_URL=http://localhost:8000/api/auth/github/callback
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add **Authorized redirect URIs**:
   ```
   http://localhost:8000/api/auth/google/callback
   ```
7. Copy **Client ID** and **Client Secret** to `.env`

## GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Your App Name
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:8000/api/auth/github/callback`
4. Copy **Client ID** and **Client Secret** to `.env`

## OAuth Flow

```
1. User clicks "Login with Google/GitHub" on website
2. Frontend redirects to backend API endpoint
3. Backend redirects to OAuth provider (Google/GitHub)
4. User authorizes on provider's page
5. Provider redirects back to backend callback URL
6. Backend creates/updates user and generates token
7. Backend redirects to frontend with token in URL
8. Frontend stores token and completes login
```

## Testing OAuth

### Test Google Login
1. Start backend: `cd backend && php artisan serve`
2. Start frontend: `npm run dev`
3. Open `http://localhost:5173`
4. Click Login → Google button
5. Authorize with your Google account
6. Should redirect back logged in

### Test GitHub Login
1. Follow same steps but click GitHub button
2. Authorize with your GitHub account
3. Should redirect back logged in

## Troubleshooting

### "redirect_uri_mismatch" Error
- Check redirect URLs in OAuth app settings match exactly
- Must be `http://localhost:8000/api/auth/google/callback` (not 5173)
- No trailing slashes

### OAuth Works in Login but Not Register
- Both use same OAuth flow
- Check browser console for errors
- Verify CORS settings in backend

### "Authentication Failed" Message
- Check backend logs: `backend/storage/logs/laravel.log`
- Verify CLIENT_ID and CLIENT_SECRET are correct
- Ensure OAuth scopes are configured (email, profile)

### Database Errors
- Run migration: `php artisan migrate`
- Check if OAuth fields exist in users table:
  - `provider`
  - `provider_id`
  - `provider_token`
  - `provider_refresh_token`
  - `role`

## Production Deployment

Update redirect URLs for production:

**Backend `.env`:**
```env
APP_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com

GOOGLE_REDIRECT_URL=https://yourdomain.com/api/auth/google/callback
GITHUB_REDIRECT_URL=https://yourdomain.com/api/auth/github/callback
```

**OAuth Provider Settings:**
- Update redirect URIs to use production domain
- Update authorized origins to include production domain
- Use HTTPS for production URLs

## Support

For detailed OAuth documentation, see [OAUTH_SETUP.md](OAUTH_SETUP.md)
