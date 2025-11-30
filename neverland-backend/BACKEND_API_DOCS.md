# Backend API Documentation

## Overview

Backend ini mengimplementasikan authentication yang aman dengan support untuk:
- ✅ Email/Password Registration & Login
- ✅ Google OAuth 2.0 Integration
- ✅ JWT Token-based Authentication
- ✅ reCAPTCHA v2/v3 Verification
- ✅ Password Hashing dengan bcryptjs
- ✅ User Profile Management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MariaDB / MySQL
- **ORM**: Sequelize
- **Authentication**: JWT, Passport.js (Google OAuth)
- **Security**: bcryptjs, helmet headers, CORS

## Environment Variables

Buat file `.env` di root backend folder:

```env
# Server
NODE_ENV=development
PORT=5000
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=neverland_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# reCAPTCHA
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

## API Endpoints

### Authentication Endpoints

#### 1. Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "recaptchaToken": "recaptcha_token_from_frontend"
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "msg": "User registered successfully",
  "token": "Bearer eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Validation Rules**:
- Name: 2-100 characters
- Username: 3-20 characters (alphanumeric + underscore only)
- Email: Valid email format
- Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "john@example.com",
  "password": "SecurePass123",
  "recaptchaToken": "recaptcha_token_from_frontend"
}
```

**Note**: `identifier` bisa berupa email atau username

**Response (200 OK)**
```json
{
  "success": true,
  "msg": "Login successful",
  "token": "Bearer eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### 3. Google OAuth Login
```
GET /api/auth/google
```

Redirect ke Google login page. Setelah user login, Google akan redirect ke:
```
GET /api/auth/google/callback
```

Callback akan redirect ke frontend dengan token:
```
https://your-frontend.com/auth-success?token=eyJhbGc...&user={user_data_json}
```

### User Endpoints (Protected)

**Semua endpoint di bawah memerlukan JWT token di header**:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### 4. Get Current User Profile
```http
GET /api/user/profile
Authorization: Bearer {token}
```

**Response (200 OK)**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "Optional bio",
    "provider": "email",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 5. Update User Profile
```http
PUT /api/user/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe",
  "bio": "New bio text"
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "msg": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "New bio text"
  }
}
```

#### 6. Delete Account
```http
DELETE /api/user/account
Authorization: Bearer {token}
```

**Response (200 OK)**
```json
{
  "success": true,
  "msg": "Account deleted successfully"
}
```

### Health Check
```http
GET /api/health
```

**Response (200 OK)**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Error Handling

Semua error response mengikuti format:
```json
{
  "success": false,
  "msg": "Error message",
  "details": {
    "field": "error_details"
  }
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Invalid/expired token |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Server Error |

## Security Features

### 1. Password Security
- Passwords di-hash menggunakan bcryptjs dengan salt rounds = 10
- Passwords never returned dalam API responses

### 2. JWT Token
- Token expires dalam 7 hari
- Token harus dikirim di Authorization header dengan format: `Bearer {token}`
- Token di-validate di setiap protected route

### 3. reCAPTCHA Protection
- Semua registration dan login require reCAPTCHA verification
- Melindungi dari automated attacks dan bot registrations

### 4. Google OAuth
- Secure OAuth flow dengan Passport.js
- Automatic user creation untuk first-time Google login
- Prevents account takeover dengan unique email checking

### 5. CORS Protection
- CORS hanya allow dari FRONTEND_URL yang di-configure
- Prevent cross-site attacks

### 6. Security Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security untuk HTTPS

## Folder Structure

```
neverland-backend/
├── api/
│   └── auth/
│       ├── auth.js (deprecated - use config/auth.js)
│       ├── login.js (deprecated)
│       ├── register.js (deprecated)
│       └── delete.js (deprecated)
├── config/
│   ├── auth.js (JWT middleware)
│   ├── authRoutes.js (email/password routes)
│   ├── database.js (Sequelize config)
│   ├── googleAuthRoutes.js (Google OAuth routes)
│   ├── passport.js (Passport strategies)
│   └── userRoutes.js (protected user routes)
├── controllers/
│   ├── authController.js (register/login logic)
│   └── userController.js (user profile logic)
├── models/
│   └── User.js (User data model)
├── utils/
│   ├── validation.js (input validation)
│   ├── errors.js (error handling)
│   └── recaptcha.js (reCAPTCHA verification)
├── server.js (main server file)
└── package.json
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  googleId VARCHAR(255) UNIQUE NULL,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NULL,
  image VARCHAR(500) NULL,
  provider ENUM('email', 'google') DEFAULT 'email',
  isVerified BOOLEAN DEFAULT FALSE,
  lastLogin DATETIME NULL,
  bio TEXT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX(email),
  INDEX(username),
  INDEX(googleId)
);
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker
```bash
docker build -t neverland-backend .
docker run -p 5000:5000 --env-file .env neverland-backend
```

## Troubleshooting

### Database Connection Failed
- Ensure MariaDB/MySQL is running
- Check DB_HOST, DB_USER, DB_PASSWORD in .env
- Verify database exists: `CREATE DATABASE neverland_db;`

### Google OAuth Not Working
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Check callback URL in Google Cloud Console matches BACKEND_URL

### reCAPTCHA Verification Failed
- Verify RECAPTCHA_SECRET_KEY is correct
- Check frontend is sending valid reCAPTCHA token
- Ensure frontend reCAPTCHA site key matches secret key

### Token Invalid/Expired
- Ensure JWT_SECRET is same in .env
- Check token format: `Bearer {token}`
- Token expires in 7 days - need to refresh/re-login

## Frontend Integration

### Save Token After Login/Register
```javascript
// After successful login/register
const { token, user } = response.data;
localStorage.setItem('authToken', token);
localStorage.setItem('userProfile', JSON.stringify(user));
```

### Send Token in API Requests
```javascript
const headers = {
  'Authorization': localStorage.getItem('authToken'),
  'Content-Type': 'application/json'
};
```

### Handle Google OAuth Callback
```javascript
// On /auth-success page
const params = new URLSearchParams(window.location.search);
const token = params.get('token');
const user = JSON.parse(params.get('user'));

localStorage.setItem('authToken', token);
localStorage.setItem('userProfile', JSON.stringify(user));
// Redirect to dashboard
window.location.href = '/dashboard';
```

## Performance Optimization

- Database indexes on email, username, googleId
- JWT validation at middleware level
- Connection pooling with Sequelize
- Request payload size limit: 10KB
- CORS pre-flight caching

## Future Enhancements

- [ ] Email verification on signup
- [ ] Password reset functionality
- [ ] Refresh token mechanism
- [ ] Rate limiting on auth endpoints
- [ ] Audit logging for security events
- [ ] Two-factor authentication (2FA)
- [ ] Social media logins (GitHub, Facebook, etc)
