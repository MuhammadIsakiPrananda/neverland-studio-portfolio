# 📧 SMTP Configuration untuk Reset Password

## Setup Google OAuth & SMTP

Proyek ini sudah dikonfigurasi dengan:
- **Google OAuth Client ID**: `739120812976-t4juf4ojl8pk2bo2n1g7943tt6c0o74o.apps.googleusercontent.com`
- **Google OAuth Secret**: Sudah dikonfigurasi di `.env`
- **SMTP**: Gmail SMTP untuk pengiriman email reset password

---

## 📝 Langkah Setup SMTP Gmail

### 1. Setup App Password di Gmail

Karena Gmail menggunakan 2-Factor Authentication, Anda perlu membuat "App Password":

1. Buka [Google Account Security](https://myaccount.google.com/security)
2. Pastikan **2-Step Verification** sudah aktif
3. Cari menu **App passwords** atau kunjungi: https://myaccount.google.com/apppasswords
4. Pilih:
   - **App**: Mail
   - **Device**: Other (Custom name) → ketik "Neverland Portfolio"
5. Google akan generate password 16 karakter (contoh: `abcd efgh ijkl mnop`)
6. Copy password tersebut (tanpa spasi)

### 2. Update File `.env` Backend

Edit file `/backend/.env` dan update bagian MAIL:

```env
# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com          # ← Ganti dengan email Gmail Anda
MAIL_PASSWORD=abcdefghijklmnop              # ← Ganti dengan App Password dari step 1 (16 karakter, tanpa spasi)
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com      # ← Ganti dengan email Gmail Anda
MAIL_FROM_NAME="${APP_NAME}"
```

**Contoh:**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=admin@neverlandstudio.my.id
MAIL_PASSWORD=abcdefghijklmnop
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=admin@neverlandstudio.my.id
MAIL_FROM_NAME="Neverland Studio Portfolio"
```

### 3. Clear Config Cache (Penting!)

Setelah update `.env`, jalankan:

```bash
cd backend
php artisan config:clear
php artisan cache:clear
```

Atau jika menggunakan Docker:
```bash
docker-compose exec neverland-backend php artisan config:clear
docker-compose exec neverland-backend php artisan cache:clear
```

---

## 🧪 Testing Email Reset Password

### Via Postman/Thunder Client:

**1. Request Forgot Password:**
```http
POST http://localhost:8000/api/auth/forgot-password
Content-Type: application/json

{
    "email": "user@example.com"
}
```

**Response Success:**
```json
{
    "success": true,
    "message": "Password reset link sent to your email"
}
```

**2. Check Email:**
- Buka inbox email yang Anda masukkan
- Cari email dengan subject "Reset Password"
- Klik link atau copy token dari URL

**3. Reset Password:**
```http
POST http://localhost:8000/api/auth/reset-password
Content-Type: application/json

{
    "token": "token-dari-email",
    "email": "user@example.com",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
}
```

**Response Success:**
```json
{
    "success": true,
    "message": "Password reset successfully"
}
```

---

## 🔧 Troubleshooting

### Error: "Connection could not be established"

**Solusi 1: Pastikan Less Secure Apps DISABLED**
- Jangan gunakan "Less Secure Apps"
- Harus gunakan App Password (lihat step 1)

**Solusi 2: Check Firewall/Port**
```bash
# Test koneksi ke Gmail SMTP
telnet smtp.gmail.com 587
# atau
nc -vz smtp.gmail.com 587
```

**Solusi 3: Gunakan Port 465 (SSL) sebagai alternatif**
```env
MAIL_PORT=465
MAIL_ENCRYPTION=ssl
```

### Error: "Invalid credentials"

1. ✅ Pastikan `MAIL_USERNAME` adalah email Gmail lengkap
2. ✅ Pastikan `MAIL_PASSWORD` adalah App Password (16 karakter)
3. ✅ Jangan gunakan password Gmail biasa
4. ✅ Hapus semua spasi di App Password

### Email tidak terkirim tapi tidak ada error

1. Check queue (jika menggunakan queue):
```bash
php artisan queue:work
```

2. Check log:
```bash
tail -f storage/logs/laravel.log
```

3. Test manual via tinker:
```bash
php artisan tinker

# Test kirim email
Mail::raw('Test email', function($message) {
    $message->to('test@example.com')->subject('Test');
});
```

---

## 📋 Konfigurasi OAuth Google (Sudah Dikonfigurasi)

OAuth credentials sudah dikonfigurasi di `.env`:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=739120812976-t4juf4ojl8pk2bo2n1g7943tt6c0o74o.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URL=https://portfolio.neverlandstudio.my.id/api/auth/google/callback
```

### Authorized Redirect URIs di Google Console

Pastikan di [Google Cloud Console](https://console.cloud.google.com/), project Anda memiliki redirect URIs:

**Production:**
- `https://portfolio.neverlandstudio.my.id/api/auth/google/callback`

**Development:**
- `http://localhost:8000/api/auth/google/callback`
- `http://localhost:5173/auth/callback/google`

---

## 🎨 Template Email

Template email reset password sudah dibuat di:
```
backend/resources/views/emails/password-reset.blade.php
```

Template ini memiliki:
- ✨ Desain modern dan responsive
- 🔐 Button "Reset Password" yang jelas
- ⏰ Informasi expiry time (60 menit)
- 📱 Mobile-friendly
- 🎨 Branding Neverland Studio

---

## 🔐 Keamanan

1. **Token Expiry**: Token reset password expired dalam 60 menit (configurable)
2. **One-time Use**: Token hanya bisa digunakan 1 kali
3. **Hashed Token**: Token di-hash di database
4. **Rate Limiting**: Bisa ditambahkan throttle di route
5. **HTTPS Only**: Di production, pastikan gunakan HTTPS

---

## 📚 File yang Telah Dikonfigurasi

1. ✅ `/backend/.env` - SMTP & OAuth credentials
2. ✅ `/backend/.env.example` - Template untuk development
3. ✅ `/backend/config/mail.php` - Mail configuration
4. ✅ `/backend/config/services.php` - OAuth services
5. ✅ `/backend/app/Http/Controllers/Api/AuthController.php` - Forgot & Reset methods
6. ✅ `/backend/routes/api.php` - API routes
7. ✅ `/backend/resources/views/emails/password-reset.blade.php` - Email template
8. ✅ `/backend/database/migrations/0001_01_01_000000_create_users_table.php` - Password reset tokens table

---

## 🚀 Next Steps

1. **Setup App Password Gmail** (Step 1 di atas)
2. **Update MAIL_USERNAME dan MAIL_PASSWORD di `.env`**
3. **Clear config cache**
4. **Test forgot password flow**
5. **Customize email template** jika diperlukan

---

## 📞 Support

Jika ada pertanyaan atau masalah, silakan:
- Check Laravel logs: `backend/storage/logs/laravel.log`
- Check SMTP connection dengan telnet
- Pastikan 2FA aktif di Gmail dan App Password sudah dibuat

---

**Happy Coding! 🎉**
