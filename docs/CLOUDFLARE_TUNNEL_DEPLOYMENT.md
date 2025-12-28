# 🚀 Cloudflare Tunnel Deployment Guide

Panduan deployment untuk Neverland Studio Portfolio menggunakan Cloudflare Tunnel (Argo Tunnel).

## 🌐 Domain
- **Production URL**: https://portfolio.neverlandstudio.my.id
- **API Endpoint**: https://portfolio.neverlandstudio.my.id/api

## ✨ Keuntungan Cloudflare Tunnel

- ✅ **Tidak perlu SSL certificate** - Cloudflare handle HTTPS
- ✅ **Tidak perlu public IP** - Server bisa di belakang NAT/Firewall
- ✅ **DDoS Protection** - Built-in dari Cloudflare
- ✅ **Zero Trust Security** - Akses aman tanpa expose port
- ✅ **Auto SSL Renewal** - Dikelola Cloudflare
- ✅ **CDN Gratis** - Global content delivery

## 📋 Prerequisites

1. **Cloudflare Account** dengan domain `neverlandstudio.my.id` sudah terdaftar
2. **Server** dengan Docker & Docker Compose installed
3. **Cloudflared** installed di server
4. Port 80 hanya untuk internal (tidak perlu expose ke public)

## 🔧 Setup Cloudflare Tunnel

### 1. Install Cloudflared di Server

```bash
# Download cloudflared (Linux)
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Install
sudo dpkg -i cloudflared-linux-amd64.deb

# Verify installation
cloudflared --version
```

### 2. Login ke Cloudflare

```bash
# Authenticate (akan buka browser)
cloudflared tunnel login

# File credential akan tersimpan di:
# ~/.cloudflared/cert.pem
```

### 3. Buat Tunnel

```bash
# Buat tunnel dengan nama
cloudflared tunnel create neverlandstudio

# Output akan memberikan Tunnel ID
# Copy Tunnel ID untuk konfigurasi
# Credential file: ~/.cloudflared/<TUNNEL_ID>.json
```

### 4. Konfigurasi Tunnel

Buat file `~/.cloudflared/config.yml`:

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

ingress:
  # Route untuk portfolio subdomain
  - hostname: portfolio.neverlandstudio.my.id
    service: http://localhost:80
  
  # Catch-all rule (required)
  - service: http_status:404
```

**Ganti `<TUNNEL_ID>` dengan Tunnel ID yang Anda dapatkan di step 3.**

### 5. Setup DNS di Cloudflare Dashboard

```bash
# Route DNS ke tunnel
cloudflared tunnel route dns neverlandstudio portfolio.neverlandstudio.my.id
```

Atau manual di Cloudflare Dashboard:
1. Login ke Cloudflare Dashboard
2. Pilih domain `neverlandstudio.my.id`
3. Go to **DNS** > **Records**
4. Add CNAME record:
   - **Name**: `portfolio`
   - **Target**: `<TUNNEL_ID>.cfargotunnel.com`
   - **Proxy status**: Proxied (orange cloud)

## 🐳 Deploy Aplikasi

### 1. Clone Repository

```bash
git clone https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio.git
cd neverland-studio-portfolio
```

### 2. Setup Environment Variables

Environment sudah dikonfigurasi untuk domain `portfolio.neverlandstudio.my.id`.

Verify `.env.production`:
```env
VITE_API_URL=https://portfolio.neverlandstudio.my.id/api
APP_URL=https://portfolio.neverlandstudio.my.id
FRONTEND_URL=https://portfolio.neverlandstudio.my.id
```

Update passwords di `.env.production`:
```env
DB_PASSWORD=YOUR_SECURE_DB_PASSWORD
DB_ROOT_PASSWORD=YOUR_SECURE_ROOT_PASSWORD
```

### 3. Setup Backend Environment

```bash
# Copy backend env
cp backend/.env.production backend/.env

# Edit jika perlu
nano backend/.env
```

Generate Laravel APP_KEY:
```bash
cd backend
php artisan key:generate --show
# Copy output ke backend/.env
cd ..
```

### 4. Build dan Start Services

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### 5. Setup Database

```bash
# Masuk ke backend container
docker exec -it neverlandstudio-backend-prod bash

# Run migrations
php artisan migrate --force

# Create storage link
php artisan storage:link

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Create admin user
php artisan tinker
```

Di tinker console:
```php
$user = new App\Models\User();
$user->name = 'Admin';
$user->email = 'admin@neverlandstudio.my.id';
$user->password = bcrypt('your-secure-password');
$user->role = 'admin';
$user->email_verified_at = now();
$user->save();
exit
```

Exit container:
```bash
exit
```

## 🌐 Start Cloudflare Tunnel

### Method 1: Run as Service (Recommended)

```bash
# Install as systemd service
sudo cloudflared service install

# Start service
sudo systemctl start cloudflared

# Enable auto-start on boot
sudo systemctl enable cloudflared

# Check status
sudo systemctl status cloudflared

# View logs
sudo journalctl -u cloudflared -f
```

### Method 2: Run Manually

```bash
# Run tunnel
cloudflared tunnel run neverlandstudio

# Atau dengan config file
cloudflared tunnel --config ~/.cloudflared/config.yml run
```

### Method 3: Docker Container (Optional)

Buat `docker-compose.tunnel.yml`:
```yaml
version: '3.8'

services:
  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared-tunnel
    restart: always
    command: tunnel --no-autoupdate run
    environment:
      - TUNNEL_TOKEN=<YOUR_TUNNEL_TOKEN>
    networks:
      - neverlandstudio-network

networks:
  neverlandstudio-network:
    external: true
```

Start:
```bash
docker-compose -f docker-compose.tunnel.yml up -d
```

## ✅ Verification

### 1. Check All Services

```bash
# Check Docker containers
docker-compose -f docker-compose.prod.yml ps

# Check Cloudflare tunnel
sudo systemctl status cloudflared
# atau
cloudflared tunnel info neverlandstudio
```

### 2. Test Endpoints

```bash
# Test health endpoint
curl http://localhost/health
# Should return: healthy

# Test via Cloudflare Tunnel
curl https://portfolio.neverlandstudio.my.id/health
# Should return: healthy

# Test API
curl https://portfolio.neverlandstudio.my.id/api/health
# Should return JSON
```

### 3. Browser Test

1. Buka https://portfolio.neverlandstudio.my.id
2. Check SSL certificate (should be valid, issued by Cloudflare)
3. Test login `/login`
4. Check dashboard `/dashboard/analytics`
5. Verify real-time updates working

## 🔄 Update & Maintenance

### Update Application

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

### Restart Cloudflare Tunnel

```bash
# If running as service
sudo systemctl restart cloudflared

# If running manually
# Stop (Ctrl+C) and start again
cloudflared tunnel run neverlandstudio
```

### View Logs

```bash
# Application logs
docker-compose -f docker-compose.prod.yml logs -f

# Cloudflare tunnel logs
sudo journalctl -u cloudflared -f

# Nginx logs
docker exec neverlandstudio-nginx-prod tail -f /var/log/nginx/access.log
docker exec neverlandstudio-nginx-prod tail -f /var/log/nginx/error.log
```

## 🛡️ Security Best Practices

### 1. Cloudflare Settings

Di Cloudflare Dashboard untuk `portfolio.neverlandstudio.my.id`:

**SSL/TLS Settings:**
- SSL Mode: **Full** (atau Full Strict jika ada certificate di origin)
- Always Use HTTPS: **On**
- Minimum TLS Version: **TLS 1.2**
- Automatic HTTPS Rewrites: **On**

**Security Settings:**
- Security Level: **Medium** atau **High**
- Challenge Passage: **30 minutes**
- Browser Integrity Check: **On**
- Bot Fight Mode: **On** (optional)

**Firewall Rules:**
- Block countries (optional)
- Rate limiting rules
- Allow only Cloudflare IPs to origin

**Speed Settings:**
- Auto Minify: Enable **JavaScript, CSS, HTML**
- Brotli: **On**
- Rocket Loader: **On** (optional)

### 2. Server Firewall

```bash
# Only allow localhost and Cloudflare IPs
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp  # SSH
sudo ufw allow from 127.0.0.1  # Localhost

# Allow Cloudflare IP ranges (optional, since tunnel handles this)
sudo ufw enable
```

### 3. Docker Security

```bash
# Update passwords in .env.production
DB_PASSWORD=<strong-password>
DB_ROOT_PASSWORD=<strong-root-password>

# Generate new APP_KEY
docker exec neverlandstudio-backend-prod php artisan key:generate
```

## 🐛 Troubleshooting

### Tunnel Not Connected

```bash
# Check tunnel status
cloudflared tunnel info neverlandstudio

# Check tunnel logs
sudo journalctl -u cloudflared -n 100

# Restart tunnel
sudo systemctl restart cloudflared
```

### Website Not Accessible

1. **Check DNS propagation**:
   ```bash
   nslookup portfolio.neverlandstudio.my.id
   # Should return Cloudflare IP
   ```

2. **Check tunnel status** in Cloudflare Dashboard:
   - Zero Trust > Access > Tunnels
   - Status should be "Healthy"

3. **Check application**:
   ```bash
   curl http://localhost/health
   # Should return: healthy
   ```

### API CORS Errors

Check backend `.env`:
```env
APP_URL=https://portfolio.neverlandstudio.my.id
FRONTEND_URL=https://portfolio.neverlandstudio.my.id
```

Restart backend:
```bash
docker-compose -f docker-compose.prod.yml restart backend
```

### Database Connection Failed

```bash
# Check MySQL container
docker exec neverlandstudio-mysql-prod mysqladmin ping -h localhost

# Check credentials
docker exec -it neverlandstudio-mysql-prod mysql -u neverlanduser -p
```

## 📊 Monitoring

### Cloudflare Analytics

Dashboard > Analytics > Traffic:
- Requests per second
- Bandwidth usage
- Cache hit ratio
- Status codes
- Top URLs

### Application Monitoring

```bash
# Real-time logs
docker-compose -f docker-compose.prod.yml logs -f

# Resource usage
docker stats

# Health check
curl https://portfolio.neverlandstudio.my.id/health
```

## 🚀 Performance Tips

1. **Enable Cloudflare Caching**:
   - Cache static assets
   - Set appropriate Cache TTL
   - Use Page Rules for specific paths

2. **Optimize Images**:
   - Enable Cloudflare Polish (Image Optimization)
   - Use WebP format
   - Lazy loading

3. **Database Optimization**:
   ```bash
   docker exec -it neverlandstudio-mysql-prod mysql -u root -p
   USE neverlandstudio;
   OPTIMIZE TABLE users, contacts, enrollments, consultations;
   ```

## 📝 Configuration Files Summary

- ✅ `nginx/conf.d/cloudflare.conf` - Nginx config for Cloudflare Tunnel
- ✅ `.env.production` - Frontend environment
- ✅ `backend/.env.production` - Backend environment
- ✅ `docker-compose.prod.yml` - Production Docker Compose (no SSL)
- ✅ `~/.cloudflared/config.yml` - Cloudflare Tunnel config

## 🎉 Done!

Your application is now live at:
- 🌐 **Frontend**: https://portfolio.neverlandstudio.my.id
- 🔌 **API**: https://portfolio.neverlandstudio.my.id/api
- 📊 **Dashboard**: https://portfolio.neverlandstudio.my.id/dashboard

**Cloudflare Tunnel Status**: Check at Cloudflare Dashboard > Zero Trust > Access > Tunnels

---

**Need Help?**
- [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [Docker Documentation](https://docs.docker.com/)
- [Laravel Deployment](https://laravel.com/docs/deployment)
