# 🚀 Backend Quick Start Guide

Panduan cepat untuk setup dan menjalankan backend Neverland Studio.

## ⚡ Setup dalam 5 Menit

### 1. Install Dependencies
```bash
cd neverland-backend
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

Edit file `.env` dengan konfigurasi Anda:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=neverland_db

# JWT
JWT_SECRET=your_strong_secret_key_min_32_chars

# Google OAuth (dari Google Cloud Console)
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx

# reCAPTCHA (dari Google reCAPTCHA Admin)
RECAPTCHA_SECRET_KEY=xxx

# URLs
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

### 3. Create Database
```bash
# Open MySQL/MariaDB
mysql -u root -p

# Create database
CREATE DATABASE neverland_db;
```

### 4. Run Server
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

✅ Server siap di: `http://localhost:5000`

---

## 🧪 Test API Endpoints

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "TestPass123",
    "recaptchaToken": "dummy_token_for_testing"
  }'
```

**Response:**
```json
{
  "success": true,
  "msg": "User registered successfully",
  "token": "Bearer eyJhbGc...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### 3. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "john@example.com",
    "password": "TestPass123",
    "recaptchaToken": "dummy_token_for_testing"
  }'
```

### 4. Get User Profile (Memerlukan Token)
```bash
curl http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📁 File Structure

```
neverland-backend/
├── config/           # Configuration files
│   ├── auth.js       # JWT middleware
│   ├── authRoutes.js
│   ├── database.js
│   ├── googleAuthRoutes.js
│   ├── passport.js
│   └── userRoutes.js
├── controllers/      # Business logic
│   ├── authController.js
│   └── userController.js
├── models/           # Database models
│   └── User.js
├── utils/            # Utilities
│   ├── validation.js
│   ├── errors.js
│   └── recaptcha.js
├── server.js         # Main server
├── package.json
├── .env              # Environment (create from .env.example)
└── README.md         # Full documentation
```

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/google` | Google OAuth | ❌ |
| GET | `/api/auth/google/callback` | OAuth callback | ❌ |

### User (Protected)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/user/profile` | Get profile | ✅ |
| PUT | `/api/user/profile` | Update profile | ✅ |
| DELETE | `/api/user/account` | Delete account | ✅ |

### System
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Health check | ❌ |

---

## 🐛 Troubleshooting

### ❌ "Cannot find module" Error
```bash
npm install
```

### ❌ "Database connection failed"
1. Ensure MySQL/MariaDB is running
2. Check `DB_HOST`, `DB_USER`, `DB_PASSWORD` in `.env`
3. Verify database exists: `CREATE DATABASE neverland_db;`

### ❌ "JWT_SECRET is not defined"
1. Make sure `.env` file exists
2. Check `JWT_SECRET` is set
3. Restart server

### ❌ "reCAPTCHA verification failed"
- In development, you can use dummy token: `"dummy_token_for_testing"`
- In production, frontend must send real reCAPTCHA token

### ❌ "Google OAuth not working"
1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
2. Check callback URL in Google Cloud Console
3. Ensure `FRONTEND_URL` is correct

---

## 💡 Tips

### Enable SQL Logging (Development)
Edit `config/database.js`:
```javascript
logging: console.log, // Uncomment this line
```

### Test Protected Endpoints
1. Register user dan copy token
2. Gunakan token di Authorization header:
```bash
Authorization: Bearer eyJhbGc...
```

### Check User in Database
```bash
mysql -u root -p
USE neverland_db;
SELECT id, username, email, provider FROM users;
```

---

## 📚 More Info

- **Full API Docs**: See `BACKEND_API_DOCS.md`
- **Setup Guide**: See `README.md`
- **Improvements**: See `IMPROVEMENTS.md`

---

## 🎯 Common Tasks

### Add New Route
1. Create endpoint di `config/newRoutes.js`
2. Add controller di `controllers/newController.js`
3. Import route di `server.js`

### Change Database URL
Edit `.env`:
```env
DB_HOST=new_host
DB_USER=new_user
DB_PASSWORD=new_password
DB_NAME=new_database
```

### Deploy to Production
1. Update `.env` dengan production values
2. Change `NODE_ENV=production`
3. Run `npm start`
4. Setup reverse proxy (Nginx)
5. Enable HTTPS

---

**Need Help?** Check the logs in console for error messages!
