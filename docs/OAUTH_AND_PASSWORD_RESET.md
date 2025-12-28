# 🔐 OAuth & Password Reset Setup Guide

Complete guide untuk mengaktifkan Social Authentication (Google & GitHub) dan Password Reset functionality.

---

## 📋 Table of Contents

- [Overview](#overview)
- [OAuth Setup](#oauth-setup)
  - [Google OAuth](#google-oauth)
  - [GitHub OAuth](#github-oauth)
- [Password Reset](#password-reset)
- [Environment Configuration](#environment-configuration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

### Features Implemented

✅ **Social Authentication**
- Google OAuth 2.0 login
- GitHub OAuth login
- Automatic account linking
- Profile picture import
- Email verification via social login

✅ **Password Reset**
- Forgot password flow
- Email-based reset tokens
- Secure password reset page
- Token expiration (24 hours)

---

## 🔑 OAuth Setup

### Google OAuth

#### 1. Create Google OAuth Credentials

1. **Visit Google Cloud Console**
   ```
   https://console.cloud.google.com/apis/credentials
   ```

2. **Create Project** (jika belum ada)
   - Click "Select a project" → "New Project"
   - Name: "Neverland Studio Portfolio"
   - Click "Create"

3. **Configure OAuth Consent Screen**
   - Go to "OAuth consent screen"
   - User Type: External
   - App name: "Neverland Studio Portfolio"
   - User support email: your-email@example.com
   - Developer contact: your-email@example.com
   - Click "Save and Continue"
   - Scopes: Add `email`, `profile`, `openid` (default)
   - Test users: Add your email
   - Click "Save and Continue"

4. **Create OAuth 2.0 Client ID**
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "Neverland Studio Web"
   
   **Authorized JavaScript origins:**
   ```
   Development:
   http://localhost:5173
   http://localhost:8000
   
   Production:
   https://portfolio.neverlandstudio.my.id
   ```
   
   **Authorized redirect URIs:**
   ```
   Development:
   http://localhost:8000/api/auth/google/callback
   http://localhost:5173/auth/callback
   
   Production:
   https://portfolio.neverlandstudio.my.id/api/auth/google/callback
   https://portfolio.neverlandstudio.my.id/auth/callback
   ```
   
   - Click "Create"
   - **Save** the Client ID and Client Secret!

#### 2. Update Environment Variables

**backend/.env**
```env
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URL="${APP_URL}/api/auth/google/callback"
```

**backend/.env.production**
```env
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URL="${APP_URL}/api/auth/google/callback"
```

---

### GitHub OAuth

#### 1. Create GitHub OAuth App

1. **Visit GitHub Developer Settings**
   ```
   https://github.com/settings/developers
   ```

2. **New OAuth App**
   - Click "New OAuth App"
   - Application name: "Neverland Studio Portfolio"
   - Homepage URL:
     ```
     Development: http://localhost:5173
     Production: https://portfolio.neverlandstudio.my.id
     ```
   - Application description: "Portfolio and admin dashboard"
   - Authorization callback URL:
     ```
     Development: http://localhost:8000/api/auth/github/callback
     Production: https://portfolio.neverlandstudio.my.id/api/auth/github/callback
     ```
   - Click "Register application"
   - Click "Generate a new client secret"
   - **Save** the Client ID and Client Secret!

#### 2. Update Environment Variables

**backend/.env**
```env
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here
GITHUB_REDIRECT_URL="${APP_URL}/api/auth/github/callback"
```

**backend/.env.production**
```env
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here
GITHUB_REDIRECT_URL="${APP_URL}/api/auth/github/callback"
```

---

## 🔄 Password Reset

### How It Works

1. **User clicks "Forgot Password"**
   - Enters email address
   - System sends reset link via email

2. **User receives email**
   - Contains secure reset link with token
   - Link valid for 24 hours

3. **User clicks link**
   - Redirected to reset password page
   - Enters new password
   - Password updated securely

### Database Migration

Migration sudah dibuat: `2025_12_27_185935_create_password_reset_tokens_table.php`

Run migration:
```bash
php artisan migrate
```

### Email Configuration

Update **backend/.env**:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com  # or your SMTP provider
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@neverlandstudio.my.id"
MAIL_FROM_NAME="${APP_NAME}"
```

**For Gmail:**
1. Enable 2-factor authentication
2. Create App Password: https://myaccount.google.com/apppasswords
3. Use App Password as `MAIL_PASSWORD`

**Other providers:**
- **Mailtrap** (for testing): https://mailtrap.io
- **SendGrid**: https://sendgrid.com
- **Mailgun**: https://www.mailgun.com
- **Amazon SES**: https://aws.amazon.com/ses

---

## ⚙️ Environment Configuration

### Complete Environment Setup

**backend/.env** (Development)
```env
APP_NAME="Neverland Studio"
APP_ENV=local
APP_KEY=base64:your-app-key-here
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# Database
DB_CONNECTION=mysql
DB_HOST=neverlandstudio-mysql
DB_PORT=3306
DB_DATABASE=neverlandstudio
DB_USERNAME=neverlanduser
DB_PASSWORD=your-password

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@neverlandstudio.my.id"
MAIL_FROM_NAME="${APP_NAME}"

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URL="${APP_URL}/api/auth/google/callback"

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URL="${APP_URL}/api/auth/github/callback"
```

**backend/.env.production** (Production)
```env
APP_NAME="Neverland Studio"
APP_ENV=production
APP_KEY=base64:your-production-app-key
APP_DEBUG=false
APP_URL=https://portfolio.neverlandstudio.my.id
FRONTEND_URL=https://portfolio.neverlandstudio.my.id

# Database
DB_CONNECTION=mysql
DB_HOST=neverlandstudio-mysql
DB_PORT=3306
DB_DATABASE=neverlandstudio
DB_USERNAME=neverlanduser
DB_PASSWORD=your-secure-production-password

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=production-email@gmail.com
MAIL_PASSWORD=production-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@neverlandstudio.my.id"
MAIL_FROM_NAME="${APP_NAME}"

# OAuth Configuration
GOOGLE_CLIENT_ID=production-google-client-id
GOOGLE_CLIENT_SECRET=production-google-client-secret
GOOGLE_REDIRECT_URL="${APP_URL}/api/auth/google/callback"

GITHUB_CLIENT_ID=production-github-client-id
GITHUB_CLIENT_SECRET=production-github-client-secret
GITHUB_REDIRECT_URL="${APP_URL}/api/auth/github/callback"

# Session Configuration
SESSION_DOMAIN=.neverlandstudio.my.id
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax
```

---

## 🧪 Testing

### Test OAuth Login

#### Development
1. Start servers:
   ```bash
   # Backend
   cd backend
   php artisan serve
   
   # Frontend
   npm run dev
   ```

2. Visit: http://localhost:5173
3. Click "Login"
4. Click "Continue with Google" or "Continue with GitHub"
5. Authorize the application
6. Should redirect back with user logged in

#### Production
1. Visit: https://portfolio.neverlandstudio.my.id
2. Test both Google and GitHub login
3. Verify redirects work correctly
4. Check user data is saved properly

### Test Password Reset

1. **Trigger Reset**
   - Click "Forgot Password?"
   - Enter email address
   - Click "Send Reset Link"

2. **Check Email**
   - Open email inbox
   - Find reset email
   - Click reset link

3. **Reset Password**
   - Enter new password
   - Confirm password
   - Click "Reset Password"
   - Should redirect to login

4. **Test New Password**
   - Login with new password
   - Should work successfully

---

## 🐛 Troubleshooting

### Common Issues

#### OAuth Not Working

**Issue**: "redirect_uri_mismatch" error

**Solution**:
- Check redirect URIs in OAuth app match exactly
- Include both `/api/auth/{provider}/callback` and `/auth/callback`
- No trailing slashes
- Protocol must match (http vs https)

**Issue**: User not redirected after OAuth

**Solution**:
- Check FRONTEND_URL in backend/.env
- Verify routes in App.tsx include `/auth/callback`
- Check browser console for errors

#### Password Reset Not Working

**Issue**: Email not sent

**Solution**:
- Verify MAIL_* configuration in .env
- Test with `php artisan tinker`:
  ```php
  Mail::raw('Test email', function($message) {
      $message->to('your-email@example.com')
              ->subject('Test');
  });
  ```
- Check logs: `tail -f storage/logs/laravel.log`

**Issue**: Reset link expired or invalid

**Solution**:
- Token valid for 24 hours only
- Check `password_reset_tokens` table exists
- Run migration: `php artisan migrate`
- Clear cache: `php artisan config:clear`

#### Database Issues

**Issue**: Migration fails

**Solution**:
```bash
# Check migration status
php artisan migrate:status

# Rollback and re-run
php artisan migrate:rollback
php artisan migrate

# Fresh installation (⚠️ clears all data)
php artisan migrate:fresh
```

---

## 📚 API Endpoints

### OAuth Endpoints

```bash
# Get OAuth redirect URL
GET /api/auth/{provider}/redirect
# Returns: { success: true, redirect_url: "..." }

# OAuth callback
GET /api/auth/{provider}/callback?code=...
# Redirects to: {FRONTEND_URL}/auth/callback?success=true&token=...&user=...
```

### Password Reset Endpoints

```bash
# Send reset link
POST /api/auth/forgot-password
Body: { "email": "user@example.com" }

# Reset password
POST /api/auth/reset-password
Body: {
  "token": "reset-token",
  "email": "user@example.com",
  "password": "newpassword",
  "password_confirmation": "newpassword"
}
```

---

## 🔒 Security Best Practices

### OAuth Security
- ✅ Always use HTTPS in production
- ✅ Validate state parameter
- ✅ Short-lived access tokens
- ✅ Secure client secret storage
- ✅ Whitelist redirect URIs

### Password Reset Security
- ✅ Token expires after 24 hours
- ✅ One-time use tokens
- ✅ Email validation required
- ✅ Rate limiting on requests
- ✅ Secure password hashing (bcrypt)

---

## 📝 Checklist

### Before Going Live

- [ ] Update OAuth redirect URIs for production domain
- [ ] Configure production email settings
- [ ] Test Google OAuth in production
- [ ] Test GitHub OAuth in production
- [ ] Test password reset flow
- [ ] Verify emails are sent correctly
- [ ] Check all redirects work
- [ ] Test on different browsers
- [ ] Verify mobile responsiveness
- [ ] Check security headers
- [ ] Enable rate limiting
- [ ] Monitor error logs

---

## 🎉 Summary

### What's Implemented

✅ **Social Authentication**
- Google OAuth fully configured
- GitHub OAuth fully configured
- Automatic account creation/linking
- Profile data import
- Email verification

✅ **Password Reset**
- Email-based reset flow
- Secure token generation
- Reset password page
- Token expiration
- Success notifications

✅ **Security**
- HTTPS in production
- Secure cookies
- Password hashing
- Token validation
- Rate limiting ready

### Next Steps

1. Configure OAuth credentials
2. Setup email service
3. Test all flows
4. Deploy to production
5. Monitor usage & errors

---

**📚 [Back to Documentation](README.md)** | **🚀 [Deployment Guide](CLOUDFLARE_TUNNEL_DEPLOYMENT.md)**
