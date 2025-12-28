# 🚀 Production Deployment Guide

Panduan lengkap untuk deploy aplikasi Neverland Studio Portfolio ke production.

## 📋 Prerequisites

- Server dengan Docker & Docker Compose installed
- Domain name (contoh: yourdomain.com)
- DNS sudah dikonfigurasi ke server IP
- Port 80 dan 443 terbuka
- Minimal 2GB RAM, 2 CPU cores
- 20GB storage space

## 🔧 Persiapan Sebelum Deploy

### 1. Clone Repository ke Server

```bash
# SSH ke server
ssh user@your-server-ip

# Clone repository
git clone https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio.git
cd neverland-studio-portfolio
```

### 2. Setup Environment Variables

#### Frontend Environment (.env.production)

```bash
# Edit file .env.production
nano .env.production
```

Update dengan domain Anda:
```env
VITE_API_URL=https://yourdomain.com/api
VITE_APP_NAME=Neverland Studio
VITE_APP_ENV=production
```

#### Backend Environment (backend/.env)

```bash
# Copy template
cp backend/.env.production backend/.env

# Edit backend environment
nano backend/.env
```

Update konfigurasi:
```env
APP_NAME="Neverland Studio"
APP_ENV=production
APP_KEY=base64:YOUR_KEY_HERE
APP_DEBUG=false
APP_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com

DB_DATABASE=neverlandstudio
DB_USERNAME=neverlanduser
DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE

SESSION_DOMAIN=.yourdomain.com
SESSION_SECURE_COOKIE=true

MAIL_FROM_ADDRESS="noreply@yourdomain.com"
```

### 3. Generate Laravel APP_KEY

```bash
# Masuk ke backend directory
cd backend

# Generate key (akan update .env file)
php artisan key:generate

# Atau manual copy key ini ke backend/.env
cd ..
```

### 4. Update Domain di Nginx Config

```bash
# Edit nginx production config
nano nginx/conf.d/production.conf
```

Replace `yourdomain.com` dengan domain Anda:
```nginx
server_name yourdomain.com www.yourdomain.com;
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
```

## 🔐 Setup SSL Certificate (Let's Encrypt)

### Method 1: Manual Setup (Recommended)

```bash
# Install certbot
sudo apt update
sudo apt install certbot

# Get certificate (pastikan port 80 terbuka dan DNS sudah pointing)
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificate akan tersimpan di:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

### Method 2: Using Docker Certbot

```bash
# Jalankan nginx dulu tanpa SSL
docker-compose -f docker-compose.prod.yml up -d nginx

# Dapatkan certificate
docker run -it --rm \
  -v /etc/letsencrypt:/etc/letsencrypt \
  -v /var/lib/letsencrypt:/var/lib/letsencrypt \
  -v ./nginx/conf.d:/etc/nginx/conf.d:ro \
  -p 80:80 \
  certbot/certbot certonly --standalone \
  -d yourdomain.com -d www.yourdomain.com \
  --agree-tos -m your-email@example.com
```

## 🐳 Build dan Deploy dengan Docker

### 1. Build Images

```bash
# Build semua services
docker-compose -f docker-compose.prod.yml build

# Atau build satu per satu
docker-compose -f docker-compose.prod.yml build backend
docker-compose -f docker-compose.prod.yml build frontend
```

### 2. Start Services

```bash
# Start semua services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 3. Setup Database

```bash
# Masuk ke backend container
docker exec -it neverlandstudio-backend-prod bash

# Jalankan migrations
php artisan migrate --force

# (Optional) Seed data
php artisan db:seed --force

# Create admin user
php artisan tinker
>>> $user = new App\Models\User();
>>> $user->name = 'Admin';
>>> $user->email = 'admin@yourdomain.com';
>>> $user->password = bcrypt('your-secure-password');
>>> $user->role = 'admin';
>>> $user->email_verified_at = now();
>>> $user->save();
>>> exit

# Create storage link
php artisan storage:link

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Exit container
exit
```

## ✅ Verification

### 1. Check Services Health

```bash
# Check all containers running
docker-compose -f docker-compose.prod.yml ps

# Should show:
# - neverlandstudio-mysql-prod (healthy)
# - neverlandstudio-backend-prod (healthy)
# - neverlandstudio-nginx-prod (healthy)
# - neverlandstudio-certbot
```

### 2. Test Endpoints

```bash
# Test health endpoint
curl http://localhost/health
# Should return: healthy

# Test API
curl https://yourdomain.com/api/health
# Should return JSON with status

# Test frontend
curl https://yourdomain.com
# Should return HTML
```

### 3. Test di Browser

1. Buka `https://yourdomain.com`
2. Pastikan SSL certificate valid (🔒 hijau)
3. Test login ke dashboard `/login`
4. Cek real-time updates di `/dashboard/analytics`

## 🔄 Update & Maintenance

### Update Aplikasi

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker exec -it neverlandstudio-backend-prod php artisan migrate --force

# Clear and rebuild cache
docker exec -it neverlandstudio-backend-prod php artisan optimize
```

### Backup Database

```bash
# Manual backup
docker exec neverlandstudio-mysql-prod mysqldump \
  -u neverlanduser -pYOUR_PASSWORD neverlandstudio \
  > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker exec -i neverlandstudio-mysql-prod mysql \
  -u neverlanduser -pYOUR_PASSWORD neverlandstudio \
  < backup_20231228_120000.sql
```

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f nginx
docker-compose -f docker-compose.prod.yml logs -f backend

# Laravel logs
docker exec neverlandstudio-backend-prod tail -f storage/logs/laravel.log
```

### SSL Certificate Renewal

```bash
# Auto-renewal sudah di-handle oleh certbot container
# Untuk manual renewal:
docker exec neverlandstudio-certbot certbot renew

# Reload nginx after renewal
docker-compose -f docker-compose.prod.yml restart nginx
```

## 🛡️ Security Checklist

- [ ] Generate strong `APP_KEY` untuk Laravel
- [ ] Ubah semua default passwords (DB, admin user)
- [ ] Setup firewall (UFW atau iptables)
- [ ] Disable root SSH login
- [ ] Setup fail2ban untuk brute force protection
- [ ] Enable automatic security updates
- [ ] Regular backup database
- [ ] Monitor application logs
- [ ] Setup monitoring (Prometheus, Grafana, atau New Relic)
- [ ] Configure rate limiting di Nginx
- [ ] Review dan update dependencies regularly

## 🔥 Firewall Setup (Ubuntu/Debian)

```bash
# Enable UFW
sudo ufw enable

# Allow SSH (IMPORTANT - jangan sampai terkunci!)
sudo ufw allow 22/tcp

# Allow HTTP & HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

## 📊 Monitoring Setup (Optional)

### Setup Fail2ban

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Setup Log Rotation

```bash
# Edit logrotate config
sudo nano /etc/logrotate.d/neverlandstudio

# Add:
/var/lib/docker/containers/*/*.log {
  rotate 7
  daily
  compress
  missingok
  delaycompress
  copytruncate
}
```

## 🐛 Troubleshooting

### Container tidak start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check specific container
docker logs neverlandstudio-backend-prod

# Rebuild without cache
docker-compose -f docker-compose.prod.yml build --no-cache
```

### Permission Issues

```bash
# Fix backend permissions
docker exec neverlandstudio-backend-prod chown -R www-data:www-data /var/www/storage
docker exec neverlandstudio-backend-prod chmod -R 775 /var/www/storage
```

### Database Connection Failed

```bash
# Check MySQL is running
docker exec neverlandstudio-mysql-prod mysqladmin ping -h localhost

# Check credentials in backend/.env
# Test connection manually
docker exec -it neverlandstudio-mysql-prod mysql -u neverlanduser -p
```

### Frontend tidak tampil

```bash
# Rebuild frontend
docker-compose -f docker-compose.prod.yml build frontend

# Check nginx config
docker exec neverlandstudio-nginx-prod nginx -t

# Reload nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### SSL Certificate Issues

```bash
# Renew certificate
sudo certbot renew --force-renewal

# Check certificate expiry
sudo certbot certificates

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

## 📱 Performance Optimization

### Enable OPcache

Sudah di-enable di `backend/Dockerfile`. Verify:

```bash
docker exec neverlandstudio-backend-prod php -i | grep opcache
```

### Database Optimization

```bash
# Masuk ke MySQL
docker exec -it neverlandstudio-mysql-prod mysql -u root -p

# Optimize tables
USE neverlandstudio;
OPTIMIZE TABLE users, contacts, enrollments, consultations;
```

### Nginx Optimization

Sudah dikonfigurasi di `nginx/conf.d/production.conf`:
- Gzip compression enabled
- Static file caching
- SSL session caching

## 🔄 CI/CD Setup (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        script: |
          cd /path/to/neverland-studio-portfolio
          git pull origin main
          docker-compose -f docker-compose.prod.yml build
          docker-compose -f docker-compose.prod.yml up -d
          docker exec neverlandstudio-backend-prod php artisan migrate --force
          docker exec neverlandstudio-backend-prod php artisan optimize
```

## 📞 Support & Contacts

- **Documentation**: [README.md](../README.md)
- **API Documentation**: [API.md](../API.md)
- **Real-time Analytics**: [REALTIME_ANALYTICS.md](REALTIME_ANALYTICS.md)

## ✅ Post-Deployment Checklist

- [ ] SSL certificate installed dan valid
- [ ] Domain accessible via HTTPS
- [ ] Database migrations completed
- [ ] Admin user created
- [ ] Storage link created
- [ ] Laravel cache optimized
- [ ] All environment variables configured
- [ ] Firewall rules applied
- [ ] Backup system configured
- [ ] Monitoring setup (optional)
- [ ] Email tested (if using)
- [ ] Real-time updates working
- [ ] API endpoints responding
- [ ] Frontend assets loading correctly
- [ ] Mobile responsive test passed

---

**🎉 Selamat! Aplikasi Anda sudah siap production!**

Visit: `https://yourdomain.com` 🚀
