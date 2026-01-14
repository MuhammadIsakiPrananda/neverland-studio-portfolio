# 🚀 Quick Reference - OAuth & SMTP Integration

## 📧 Password Reset Flow

```
User Request → API Endpoint → Database → Email → User Clicks Link → Reset Password
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/forgot-password` | Request password reset email |
| `POST` | `/api/auth/reset-password` | Reset password with token |

### Request Examples

**Forgot Password:**
```bash
curl -X POST http://localhost:8000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

**Reset Password:**
```bash
curl -X POST http://localhost:8000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"reset-token-from-email",
    "email":"user@example.com",
    "password":"newpassword123",
    "password_confirmation":"newpassword123"
  }'
```

---

## 🔐 OAuth Login Flow

```
User Clicks → Redirect to OAuth Provider → User Authorizes → Callback → Login Success
```

### OAuth Endpoints

| Provider | Redirect | Callback |
|----------|----------|----------|
| Google | `/api/auth/google/redirect` | `/api/auth/google/callback` |
| GitHub | `/api/auth/github/redirect` | `/api/auth/github/callback` |

### Frontend Integration

```typescript
// Trigger OAuth login
const handleGoogleLogin = () => {
  window.location.href = `${API_URL}/api/auth/google/redirect`;
};

// Handle callback
// User will be redirected to: /auth/callback?token=...&user=...
```

---

## ⚙️ Environment Variables

### Backend `.env`

```env
# OAuth - Google
GOOGLE_CLIENT_ID=739120812976-t4juf4ojl8pk2bo2n1g7943tt6c0o74o.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URL=https://yourdomain.com/api/auth/google/callback

# OAuth - GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URL=https://yourdomain.com/api/auth/github/callback

# SMTP - Gmail
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-char-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"

# Frontend
FRONTEND_URL=https://yourdomain.com
```

---

## 🧪 Testing Checklist

### SMTP Testing

- [ ] Gmail App Password created
- [ ] `MAIL_USERNAME` and `MAIL_PASSWORD` updated in `.env`
- [ ] Config cache cleared: `php artisan config:clear`
- [ ] Test script executed: `./test-smtp.sh`
- [ ] Email received in inbox
- [ ] Reset password link works
- [ ] Password successfully reset

### OAuth Testing

#### Google OAuth
- [ ] Redirect URL added to Google Cloud Console
- [ ] Test login button works
- [ ] Redirected to Google login
- [ ] Authorized and redirected back
- [ ] User created/logged in
- [ ] Profile data retrieved

#### GitHub OAuth
- [ ] Redirect URL added to GitHub Developer Settings
- [ ] Test login button works
- [ ] Redirected to GitHub login
- [ ] Authorized and redirected back
- [ ] User created/logged in
- [ ] Profile data retrieved

---

## 🔧 Common Commands

```bash
# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Test SMTP connection
./test-smtp.sh

# Check Laravel logs
tail -f backend/storage/logs/laravel.log

# Test email via Tinker
php artisan tinker
>>> Mail::raw('Test', fn($msg) => $msg->to('test@example.com')->subject('Test'));

# Database migrations
php artisan migrate:fresh --seed

# Run tests
php artisan test
```

---

## 📁 Key Files

### Backend
```
backend/
├── .env                           # Environment config ⚠️ CONFIGURE THIS
├── config/
│   ├── services.php              # OAuth configuration
│   ├── mail.php                  # SMTP configuration
│   └── app.php                   # Frontend URL config
├── app/
│   ├── Http/Controllers/Api/
│   │   ├── AuthController.php    # Password reset logic
│   │   └── SocialAuthController.php # OAuth logic
│   ├── Models/User.php           # User model with notification
│   └── Notifications/
│       └── ResetPasswordNotification.php # Custom notification
└── resources/views/emails/
    └── password-reset.blade.php  # Email template
```

### Frontend
```
src/
├── components/
│   ├── auth/
│   │   ├── ResetPassword.tsx     # Reset password page
│   │   └── OAuthCallback.tsx     # OAuth callback handler
│   └── modals/
│       └── ForgotPasswordModal.tsx # Forgot password modal
├── services/
│   └── authService.ts            # Auth API service
└── config/
    └── api.config.ts             # API configuration
```

---

## 🐛 Troubleshooting

### SMTP Issues

**Error: "Connection refused"**
```bash
# Test connection
nc -vz smtp.gmail.com 587

# Try alternative port
MAIL_PORT=465
MAIL_ENCRYPTION=ssl
```

**Error: "Invalid credentials"**
- Ensure using App Password (not regular password)
- Remove all spaces from App Password
- Verify email address is correct
- Check 2FA is enabled on Gmail

**Email not sent but no error**
```bash
# Check queue
php artisan queue:work

# Check logs
tail -f backend/storage/logs/laravel.log
```

### OAuth Issues

**Error: "Redirect URI mismatch"**
- Check Google Cloud Console → Credentials → Authorized redirect URIs
- Must match exactly: `https://yourdomain.com/api/auth/google/callback`
- Include both production and development URLs

**Error: "Client ID not found"**
- Verify `GOOGLE_CLIENT_ID` in `.env`
- Clear config cache: `php artisan config:clear`

---

## 📞 Support

**Documentation:**
- [SMTP Setup Guide](../docs/SMTP_SETUP.md)
- [OAuth Setup Guide](../docs/OAUTH_SETUP.md)
- [Integration Summary](../OAUTH_SMTP_INTEGRATION.md)

**Logs:**
- Backend: `backend/storage/logs/laravel.log`
- Frontend: Browser Console (F12)

**Test Scripts:**
- SMTP Test: `./test-smtp.sh`
- API Test: Use Postman/Thunder Client

---

**Last Updated**: January 2026  
**Version**: 2.0.0
