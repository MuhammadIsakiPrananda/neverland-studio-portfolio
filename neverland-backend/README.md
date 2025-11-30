# Neverland Studio Backend

Backend API untuk Neverland Studio Portfolio Website dengan authentication yang aman dan scalable.

## 🚀 Features

✅ **User Authentication**
- Email/Password Registration & Login
- Google OAuth 2.0 Integration
- JWT Token-based Authentication (7-day expiry)
- Secure Password Hashing (bcryptjs)

✅ **Security**
- reCAPTCHA v2/v3 Protection
- CORS Protection
- Security Headers (XSS, Clickjacking prevention)
- SQL Injection Prevention via ORM
- Rate Limiting Ready

✅ **User Management**
- User Profile Management
- Account Deletion
- Provider Detection (Email vs Google)

✅ **Error Handling**
- Comprehensive Error Messages
- Validation Feedback
- Request Logging

## 📋 Prerequisites

- Node.js >= 16.x
- MariaDB / MySQL >= 5.7
- npm or yarn

## 🔧 Installation

### 1. Clone Repository
```bash
cd neverland-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
# Edit .env dengan konfigurasi Anda
```

### 4. Create Database
```sql
CREATE DATABASE neverland_db;
```

### 5. Run Server

**Development (with auto-reload)**:
```bash
npm run dev
```

**Production**:
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

## 📚 API Documentation

Lihat [BACKEND_API_DOCS.md](./BACKEND_API_DOCS.md) untuk dokumentasi lengkap API endpoints.

### Quick API Examples

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "recaptchaToken": "token_from_frontend"
  }'
```

#### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "john@example.com",
    "password": "SecurePass123",
    "recaptchaToken": "token_from_frontend"
  }'
```

#### Get User Profile
```bash
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🏗️ Project Structure

```
neverland-backend/
├── config/
│   ├── auth.js                 # JWT middleware
│   ├── authRoutes.js           # Email/password routes
│   ├── database.js             # Database connection
│   ├── googleAuthRoutes.js     # Google OAuth routes
│   ├── passport.js             # Passport strategies
│   └── userRoutes.js           # User profile routes
├── controllers/
│   ├── authController.js       # Auth logic
│   └── userController.js       # User profile logic
├── models/
│   └── User.js                 # User database model
├── utils/
│   ├── validation.js           # Input validation
│   ├── errors.js               # Error handling
│   └── recaptcha.js            # reCAPTCHA verification
├── server.js                   # Main server file
├── package.json
├── .env.example                # Environment template
└── BACKEND_API_DOCS.md         # API documentation
```

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Server environment | `development` |
| `PORT` | Server port | `5000` |
| `DB_HOST` | Database host | `localhost` |
| `DB_USER` | Database user | `root` |
| `DB_PASSWORD` | Database password | `password` |
| `DB_NAME` | Database name | `neverland_db` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | `xxx` |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA secret | `xxx` |
| `FRONTEND_URL` | Frontend URL | `http://localhost:5173` |

## 🔗 Integration dengan Frontend

### 1. Save Token Setelah Login
```typescript
// Di frontend, setelah login berhasil
const { token, user } = response.data;
localStorage.setItem('authToken', token);
localStorage.setItem('userProfile', JSON.stringify(user));
```

### 2. Kirim Token di API Requests
```typescript
const response = await fetch('/api/user/profile', {
  headers: {
    'Authorization': localStorage.getItem('authToken'),
  }
});
```

### 3. Handle Google OAuth Callback
```typescript
// Di halaman /auth-success
const params = new URLSearchParams(window.location.search);
const token = params.get('token');
localStorage.setItem('authToken', token);
```

## 🐳 Docker Support

### Build Image
```bash
docker build -t neverland-backend .
```

### Run Container
```bash
docker run -p 5000:5000 \
  -e DB_HOST=host.docker.internal \
  -e DB_USER=root \
  -e DB_PASSWORD=password \
  -e JWT_SECRET=your_secret \
  -e GOOGLE_CLIENT_ID=xxx \
  -e GOOGLE_CLIENT_SECRET=xxx \
  -e RECAPTCHA_SECRET_KEY=xxx \
  neverland-backend
```

## 🧪 Testing API Endpoints

### Menggunakan Postman
1. Import collection dari requests folder
2. Set environment variables
3. Run requests sesuai flow

### Menggunakan cURL
Lihat contoh di section "Quick API Examples" di atas.

## 📊 Database Schema

Database otomatis dibuat oleh Sequelize saat server start.

**Users Table:**
- `id` - Primary key
- `googleId` - Google OAuth ID (unique)
- `name` - User full name
- `username` - Unique username
- `email` - Unique email
- `password` - Hashed password (nullable untuk Google users)
- `image` - Profile image URL
- `provider` - Auth provider (email/google)
- `isVerified` - Email verification status
- `lastLogin` - Last login timestamp
- `bio` - User bio
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

## 🚨 Error Handling

Semua error response mengikuti format konsisten:
```json
{
  "success": false,
  "msg": "Error message",
  "details": {}
}
```

## 🔄 Authentication Flow

### Email/Password Flow
1. User register dengan email, username, password
2. Password di-hash dan disimpan di database
3. JWT token digenerate dan dikirim ke frontend
4. Frontend menyimpan token dan kirim di setiap request
5. Backend verify token di protected routes

### Google OAuth Flow
1. User click "Sign in with Google"
2. Redirect ke Google login page
3. User login di Google
4. Google redirect ke `/api/auth/google/callback`
5. Verify user dengan Passport.js
6. Generate JWT token
7. Redirect ke frontend dengan token di URL

## 🛠️ Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution**: 
- Ensure MariaDB/MySQL is running
- Check DB_HOST, DB_USER, DB_PASSWORD in .env

### Google OAuth Error
```
Error: Unable to authenticate user with Google
```
**Solution**:
- Verify GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET
- Check callback URL di Google Cloud Console

### reCAPTCHA Error
```
Error: Failed to verify reCAPTCHA
```
**Solution**:
- Verify RECAPTCHA_SECRET_KEY is correct
- Frontend harus send valid reCAPTCHA token

### JWT Token Error
```
Error: Token is not valid
```
**Solution**:
- Ensure Authorization header format: `Bearer {token}`
- Check JWT_SECRET consistency
- Token mungkin sudah expired (7 hari)

## 📈 Performance Tips

1. **Database Indexes**: Sudah di-setup untuk email, username, googleId
2. **Connection Pooling**: Sequelize handle pooling otomatis
3. **JWT Validation**: Dilakukan di middleware level
4. **CORS**: Pre-configured untuk production

## 🔒 Security Checklist

- ✅ Passwords hashed dengan bcryptjs
- ✅ JWT tokens dengan expiry 7 hari
- ✅ reCAPTCHA protection untuk signup/login
- ✅ CORS restricted ke FRONTEND_URL
- ✅ Security headers configured
- ✅ SQL Injection prevention via ORM
- ✅ XSS Protection enabled
- ✅ HTTPS recommended for production

## 📝 Logging

Enable SQL logging untuk development:
```javascript
// Di config/database.js
logging: console.log, // Uncomment untuk melihat SQL queries
```

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Update `.env` dengan production values
- [ ] Gunakan strong `JWT_SECRET` (min 32 chars)
- [ ] Enable HTTPS
- [ ] Setup SSL certificate
- [ ] Configure domain di Google Cloud Console
- [ ] Test all auth flows

### Recommended Hosting
- **Backend**: Heroku, Railway, Vercel, or DigitalOcean
- **Database**: Amazon RDS, or hosting provider's managed database
- **Storage**: AWS S3 atau similar

## 📞 Support & Issues

Untuk issues atau pertanyaan, silakan buat GitHub issue atau contact tim development.

## 📄 License

ISC

---

**Last Updated**: January 2024
**Backend Version**: 1.0.0
