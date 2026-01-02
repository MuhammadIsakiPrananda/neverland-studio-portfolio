# 🚀 Deployment Guide

<div align="center">

![Docker](https://img.shields.io/badge/docker-ready-blue.svg)
![Production](https://img.shields.io/badge/production-ready-green.svg)
![Platform](https://img.shields.io/badge/platform-linux-lightgrey.svg)

**Complete production deployment guide for Neverland Studio Portfolio**

</div>

---

## 📑 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#-quick-start)
- [Detailed Setup](#-detailed-setup)
- [Cloudflare Tunnel](#-cloudflare-tunnel-setup)
- [Environment Configuration](#-environment-configuration)
- [Docker Deployment](#-docker-deployment)
- [Database Setup](#-database-setup)
- [Post-Deployment](#-post-deployment)
- [Monitoring](#-monitoring--maintenance)
- [Troubleshooting](#-troubleshooting)

---

## Overview

This guide covers deployment of the Neverland Studio Portfolio platform using Docker Compose with Cloudflare Tunnel for secure, production-ready hosting without exposing ports or managing SSL certificates manually.

### 🎯 Deployment Options

| Method | Complexity | Best For | SSL |
|--------|------------|----------|-----|
| **Cloudflare Tunnel** (Recommended) | ⭐⭐ Easy | Production | ✅ Auto |
| **Direct SSL** | ⭐⭐⭐ Medium | VPS/Dedicated | 🔧 Manual |
| **Reverse Proxy** | ⭐⭐⭐⭐ Advanced | Enterprise | 🔧 Custom |

---

## Prerequisites

### System Requirements

**Minimum**:
- CPU: 2 cores
- RAM: 4 GB
- Storage: 20 GB SSD
- OS: Linux (Ubuntu 20.04+ recommended)

**Recommended**:
- CPU: 4 cores
- RAM: 8 GB
- Storage: 50 GB SSD
- OS: Ubuntu 22.04 LTS

### Required Software

```bash
# Docker Engine 24.0+
docker --version

# Docker Compose V2
docker compose version

# Git
git --version
```

### Installation (if needed)

<details>
<summary><b>Install Docker on Ubuntu</b></summary>

```bash
# Update package list
sudo apt update

# Install dependencies
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
docker --version
docker compose version

# Add user to docker group (optional)
sudo usermod -aG docker $USER
newgrp docker
```

</details>

---

## 🚀 Quick Start

**For experienced users who want to deploy quickly**:

```bash
# 1. Clone repository
git clone https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio.git
cd neverland-studio-portfolio

# 2. Setup environment
cp .env.example .env
cp backend/.env.example backend/.env

# Edit configuration
nano .env                  # Frontend config
nano backend/.env          # Backend config

# 3. Generate Laravel key
cd backend && php artisan key:generate && cd ..

# 4. Deploy
docker compose --profile production up -d --build

# 5. Run migrations
docker compose exec backend php artisan migrate --force

# 6. Check status
docker compose ps
```

🎉 **Done!** Application is running on `http://localhost`

For production with domain: Continue to [Cloudflare Tunnel Setup](#-cloudflare-tunnel-setup)

---

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
```

**⚠️ Security Notes**:
- Use strong, unique database passwords (min 16 characters)
- Never commit `.env` files to git
- Keep `APP_DEBUG=false` in production
- Set `SESSION_SECURE_COOKIE=true` for HTTPS

### Step 3: Generate Application Key

```bash
# Navigate to backend directory
cd backend

# Generate Laravel application key
php artisan key:generate

# Verify key was generated
grep APP_KEY .env

# Return to root
cd ..
```

**Expected output**:
```
Application key set successfully.
```

---

## 🌐 Cloudflare Tunnel Setup

**Recommended for production** - No port forwarding, automatic HTTPS, DDoS protection

### Why Cloudflare Tunnel?

✅ **Benefits**:
- No open ports required
- Automatic SSL/TLS
- DDoS protection
- Global CDN
- Zero Trust security
- Easy management

### Installation

#### On Linux/Mac:

```bash
# Download cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Install
sudo dpkg -i cloudflared-linux-amd64.deb

# Verify installation
cloudflared --version
```

#### On Windows:

```powershell
# Using winget
winget install --id Cloudflare.cloudflared

# Verify
cloudflared --version
```

### Configuration

#### Step 1: Login to Cloudflare

```bash
# Authenticate with Cloudflare
cloudflared tunnel login
```

This will open a browser window. Select your domain.

#### Step 2: Create Tunnel

```bash
# Create a new tunnel
cloudflared tunnel create neverland-portfolio

# Note the Tunnel ID from output
# Example: Created tunnel neverland-portfolio with id abc123-def456-ghi789
```

#### Step 3: Configure Tunnel

Create configuration file:

```bash
# Create config file
nano ~/.cloudflared/config.yml
```

**Configuration** (replace YOUR_TUNNEL_ID):

```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /root/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  # Main application
  - hostname: yourdomain.com
    service: http://localhost:80
  
  # API subdomain (optional)
  - hostname: api.yourdomain.com
    service: http://localhost:8000
  
  # PHPMyAdmin (optional - secure this!)
  - hostname: phpmyadmin.yourdomain.com
    service: http://localhost:8080
  
  # Catch-all rule (required)
  - service: http_status:404
```

#### Step 4: Create DNS Records

```bash
# Route DNS to tunnel
cloudflared tunnel route dns neverland-portfolio yourdomain.com

# For subdomains (if configured)
cloudflared tunnel route dns neverland-portfolio api.yourdomain.com
cloudflared tunnel route dns neverland-portfolio phpmyadmin.yourdomain.com
```

#### Step 5: Run Tunnel

**Test first**:
```bash
cloudflared tunnel run neverland-portfolio
```

**Run as service** (Linux):
```bash
# Install as service
sudo cloudflared service install

# Start service
sudo systemctl start cloudflared

# Enable on boot
sudo systemctl enable cloudflared

# Check status
sudo systemctl status cloudflared
```

**Run in background** (Alternative):
```bash
# Using screen
screen -dmS cloudflared cloudflared tunnel run neverland-portfolio

# Or using nohup
nohup cloudflared tunnel run neverland-portfolio > /var/log/cloudflared.log 2>&1 &
```

---

## 📝 Environment Configuration

### Complete Configuration Reference

#### Frontend (.env)

```env
# ==============================================
# FRONTEND CONFIGURATION
# ==============================================

# API Base URL (production domain)
VITE_API_URL=https://yourdomain.com/api

# Application Info
VITE_APP_NAME=Neverland Studio
VITE_APP_URL=https://yourdomain.com
VITE_APP_VERSION=2.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_REALTIME=true

# Analytics (optional)
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Environment
VITE_ENV=production
```

#### Backend (backend/.env)

```env
# ==============================================
# LARAVEL APPLICATION CONFIGURATION
# ==============================================

APP_NAME="Neverland Studio"
APP_ENV=production
APP_KEY=base64:generated_key_here
APP_DEBUG=false
APP_URL=https://yourdomain.com
APP_TIMEZONE=Asia/Jakarta

# ==============================================
# DATABASE CONFIGURATION
# ==============================================

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=neverland
DB_USERNAME=neverland
DB_PASSWORD=your_very_secure_password_here

# ==============================================
# FRONTEND & CORS
# ==============================================

FRONTEND_URL=https://yourdomain.com
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
SESSION_DOMAIN=.yourdomain.com

# ==============================================
# SESSION CONFIGURATION
# ==============================================

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax

# ==============================================
# CACHE & QUEUE
# ==============================================

CACHE_DRIVER=file
CACHE_PREFIX=neverland_cache

QUEUE_CONNECTION=database

# ==============================================
# MAIL CONFIGURATION (Optional)
# ==============================================

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"

# ==============================================
# OAUTH PROVIDERS (Optional)
# ==============================================

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URL=https://yourdomain.com/api/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URL=https://yourdomain.com/api/auth/github/callback

# ==============================================
# LOGGING
# ==============================================

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=warning

# ==============================================
# BROADCASTING (Future use)
# ==============================================

BROADCAST_DRIVER=log
```

### Environment Variables Checklist

Before deployment, verify these are set:

**Required**:
- [ ] `APP_KEY` generated
- [ ] `APP_URL` set to production domain
- [ ] `DB_PASSWORD` strong and unique
- [ ] `FRONTEND_URL` matches domain
- [ ] `SANCTUM_STATEFUL_DOMAINS` configured
- [ ] `SESSION_DOMAIN` configured
- [ ] `APP_DEBUG=false`

**Optional but Recommended**:
- [ ] Mail configuration for notifications
- [ ] OAuth credentials for social login
- [ ] Analytics ID configured

---

## 🐳 Docker Deployment

### Understanding the Stack

The application uses 5 Docker containers:

| Service | Purpose | Port | Health Check |
|---------|---------|------|--------------|
| **frontend** | React app (Nginx) | 80 | HTTP GET / |
| **backend** | Laravel API (PHP-FPM) | 8000 | HTTP GET /api/health |
| **db** | MySQL 8.0 database | 3307 | mysqladmin ping |
| **nginx** | Reverse proxy | 80 (external) | HTTP GET / |
| **phpmyadmin** | DB management UI | 8080 | HTTP GET / |

### Build & Deploy

#### Development Mode

```bash
# Start development stack
docker compose up -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

#### Production Mode

```bash
# Build and start production stack
docker compose --profile production up -d --build

# This includes:
# - Optimized production builds
# - Nginx reverse proxy
# - Security hardening
# - Resource limits
```

### Deployment Commands

```bash
# Build without cache
docker compose build --no-cache

# Start specific service
docker compose up -d backend

# Restart service
docker compose restart backend

# View service logs
docker compose logs -f backend

# Execute command in container
docker compose exec backend php artisan migrate

# Scale service (if needed)
docker compose up -d --scale backend=3

# Stop all services
docker compose down

# Stop and remove volumes (⚠️ deletes data)
docker compose down -v
```

### Container Management

#### Check Container Status

```bash
# List all containers
docker compose ps

# Check specific container
docker compose ps backend

# Inspect container
docker inspect neverland-backend

# View resource usage
docker stats
```

#### Access Container Shell

```bash
# Backend container
docker compose exec backend bash

# Database container
docker compose exec db mysql -u neverland -p

# Frontend container (if needed)
docker compose exec frontend sh
```

---

## 💾 Database Setup

### Initial Migration

```bash
# Run migrations
docker compose exec backend php artisan migrate --force

# Seed database (optional)
docker compose exec backend php artisan db:seed --force
```

**Expected output**:
```
Migration table created successfully.
Migrating: 2024_01_01_000000_create_users_table
Migrated:  2024_01_01_000000_create_users_table (123.45ms)
...
```

### Database Management

#### Create Admin User

```bash
# Access backend container
docker compose exec backend php artisan tinker

# In tinker console:
User::create([
    'name' => 'Admin',
    'email' => 'admin@yourdomain.com',
    'username' => 'admin',
    'password' => bcrypt('your-secure-password'),
    'role' => 'admin',
    'email_verified_at' => now()
]);
```

#### Backup Database

```bash
# Create backup
docker compose exec db mysqldump -u neverland -p neverland > backup_$(date +%Y%m%d_%H%M%S).sql

# With gzip compression
docker compose exec db mysqldump -u neverland -p neverland | gzip > backup_$(date +%Y%m%d).sql.gz
```

#### Restore Database

```bash
# From SQL file
docker compose exec -T db mysql -u neverland -p neverland < backup.sql

# From gzip
gunzip < backup.sql.gz | docker compose exec -T db mysql -u neverland -p neverland
```

---

## ✅ Post-Deployment

### Verification Checklist

After deployment, verify everything works:

#### 1. Container Health

```bash
# All containers should be "healthy" or "running"
docker compose ps

# Check logs for errors
docker compose logs --tail=50
```

#### 2. Application Access

```bash
# Test frontend
curl -I https://yourdomain.com

# Expected: HTTP/2 200

# Test API
curl https://yourdomain.com/api/maintenance/status

# Expected: {"success":true,"is_maintenance":false}
```

#### 3. Database Connection

```bash
# Run test migration
docker compose exec backend php artisan migrate:status

# Should show list of migrations with "Ran?" status
```

#### 4. File Permissions

```bash
# Check Laravel storage permissions
docker compose exec backend ls -la storage/

# Should show www-data or nginx ownership
```

### Performance Optimization

#### Enable Caching

```bash
# Cache routes
docker compose exec backend php artisan route:cache

# Cache config
docker compose exec backend php artisan config:cache

# Cache views
docker compose exec backend php artisan view:cache

# Optimize autoloader
docker compose exec backend composer install --optimize-autoloader --no-dev
```

#### Clear Caches (if needed)

```bash
# Clear all caches
docker compose exec backend php artisan optimize:clear

# Or individually:
docker compose exec backend php artisan cache:clear
docker compose exec backend php artisan config:clear
docker compose exec backend php artisan route:clear
docker compose exec backend php artisan view:clear
```

---

## 📊 Monitoring & Maintenance

### Application Monitoring

#### Check Application Health

```bash
# Application status
curl https://yourdomain.com/api/health

# Database connection
docker compose exec backend php artisan db:show
```

#### View Logs

```bash
# Laravel logs
docker compose exec backend tail -f storage/logs/laravel.log

# Nginx access logs
docker compose logs -f nginx

# Real-time all logs
docker compose logs -f
```

#### Monitor Resources

```bash
# Container resource usage
docker stats

# Disk usage
docker system df

# Detailed container info
docker compose exec backend df -h
```

### Regular Maintenance

#### Daily Tasks

```bash
# Clear old logs (older than 7 days)
docker compose exec backend find storage/logs -name "*.log" -mtime +7 -delete

# Clean temporary files
docker compose exec backend php artisan cache:clear
```

#### Weekly Tasks

```bash
# Database backup
docker compose exec db mysqldump -u neverland -p neverland | gzip > "backup_$(date +%Y%m%d).sql.gz"

# Update Docker images
docker compose pull
docker compose up -d

# Clean unused Docker resources
docker system prune -a
```

#### Monthly Tasks

```bash
# Full database backup
./scripts/backup-full.sh

# Security updates
apt update && apt upgrade

# Review logs for anomalies
docker compose logs --since 30d | grep -i error

# Update dependencies
cd backend && composer update && cd ..
npm update
```

---

## 🔧 Troubleshooting

### Common Issues

#### Issue 1: Containers Won't Start

**Symptoms**:
```
Error response from daemon: driver failed programming external connectivity
```

**Solutions**:
```bash
# Check if ports are in use
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :8000

# Kill processes using ports
sudo fuser -k 80/tcp
sudo fuser -k 8000/tcp

# Restart Docker
sudo systemctl restart docker

# Rebuild containers
docker compose down
docker compose up -d --build
```

#### Issue 2: Database Connection Failed

**Symptoms**:
```
SQLSTATE[HY000] [2002] Connection refused
```

**Solutions**:
```bash
# Check database container
docker compose ps db

# Verify database is ready
docker compose exec db mysql -u root -p -e "SELECT 1"

# Check database credentials in backend/.env
docker compose exec backend cat .env | grep DB_

# Restart database
docker compose restart db

# Wait for database to be ready
sleep 10

# Run migrations again
docker compose exec backend php artisan migrate --force
```

#### Issue 3: Permission Denied Errors

**Symptoms**:
```
The stream or file "storage/logs/laravel.log" could not be opened
```

**Solutions**:
```bash
# Fix permissions
docker compose exec backend chown -R www-data:www-data storage bootstrap/cache
docker compose exec backend chmod -R 775 storage bootstrap/cache

# Or force  Laravel to create log file
docker compose exec backend touch storage/logs/laravel.log
docker compose exec backend chmod 666 storage/logs/laravel.log
```

#### Issue 4: 502 Bad Gateway

**Symptoms**:
- Website shows "502 Bad Gateway"
- Cannot access application

**Solutions**:
```bash
# Check backend status
docker compose ps backend

# View backend logs
docker compose logs backend

# Restart backend
docker compose restart backend

# Check nginx configuration
docker compose exec nginx nginx -t

# Restart nginx
docker compose restart nginx
```

#### Issue 5: Cloudflare Tunnel Not Connecting

**Symptoms**:
```
ERR  error="Unable to reach the origin service"
```

**Solutions**:
```bash
# Check tunnel status
cloudflared tunnel info neverland-portfolio

# Verify service is running locally
curl http://localhost:80

# Check config file
cat ~/.cloudflared/config.yml

# Restart tunnel
sudo systemctl restart cloudflared

# View tunnel logs
sudo journalctl -u cloudflared -f
```

### Debug Mode

**⚠️ Only for troubleshooting - Never in production!**

```bash
# Enable debug temporarily
docker compose exec backend sed -i 's/APP_DEBUG=false/APP_DEBUG=true/' .env

# Clear config cache
docker compose exec backend php artisan config:clear

# View detailed errors in browser

# DON'T FORGET TO DISABLE:
docker compose exec backend sed -i 's/APP_DEBUG=true/APP_DEBUG=false/' .env
docker compose exec backend php artisan config:cache
```

### Getting Help

If issues persist:

1. **Check logs**: `docker compose logs -f`
2. **Review configuration**: Verify all `.env` variables
3. **Search issues**: [GitHub Issues](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/issues)
4. **Ask for help**: Create new issue with:
   - Error messages
   - Docker compose logs
   - Environment details
   - Steps to reproduce

---

## 📚 Additional Resources

### Documentation
- [Docker Documentation](https://docs.docker.com/)
- [Laravel Deployment](https://laravel.com/docs/deployment)
- [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [Nginx Configuration](https://nginx.org/en/docs/)

### Useful Commands Reference

```bash
# Docker Compose
docker compose up -d              # Start services
docker compose down               # Stop services
docker compose ps                 # List services
docker compose logs -f            # Follow logs
docker compose exec SERVICE bash  # Access container

# Laravel Artisan
php artisan migrate              # Run migrations
php artisan db:seed              # Seed database
php artisan cache:clear          # Clear cache
php artisan config:cache         # Cache config
php artisan queue:work           # Process queue

# Database
mysqldump -u USER -p DB > file.sql   # Backup
mysql -u USER -p DB < file.sql       # Restore

# System
systemctl status SERVICE         # Check service
journalctl -u SERVICE -f         # View logs
df -h                           # Disk usage
free -h                         # Memory usage
```

---

## 🎯 Production Checklist

Before going live, ensure:

### Security
- [ ] `APP_DEBUG=false` in all environments
- [ ] Strong database passwords (16+ characters)
- [ ] `.env` files not in git
- [ ] `SESSION_SECURE_COOKIE=true`
- [ ] HTTPS enabled (via Cloudflare Tunnel)
- [ ] Firewall configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured

### Performance
- [ ] Caches enabled (config, route, view)
- [ ] Opcache enabled in PHP
- [ ] Database indexes optimized
- [ ] CDN configured (Cloudflare)
- [ ] Gzip compression enabled
- [ ] Assets minified
- [ ] Lazy loading implemented

### Monitoring
- [ ] Error logging configured
- [ ] Log rotation setup
- [ ] Uptime monitoring
- [ ] Backup automation
- [ ] Disk space monitoring
- [ ] Resource usage monitoring

### Documentation
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Rollback procedure documented
- [ ] Team has access to credentials
- [ ] Emergency contacts listed

---

<div align="center">

**[⬆ Back to Top](#-deployment-guide)**

Need help? Check [Troubleshooting](#-troubleshooting) or [open an issue](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/issues)

*Last Updated: January 1, 2026* • *Version 2.0.0*

</div>

### Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio.git

# Navigate to project directory
cd neverland-studio-portfolio

# Check current branch
git branch

# Switch to main if needed
git checkout main
```

### Step 2: Prepare Environment Files

#### Frontend Environment (.env)

```bash
# Copy example file
cp .env.example .env

# Edit with your preferred editor
nano .env
```

**Configuration**:
```env
# API Configuration
VITE_API_URL=https://yourdomain.com/api

# App Configuration  
VITE_APP_NAME=Neverland Studio
VITE_APP_URL=https://yourdomain.com

# Optional: Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

#### Backend Environment (backend/.env)

```bash
# Copy example file
cp backend/.env.example backend/.env

# Edit configuration
nano backend/.env
```

**Essential Configuration**:
```env
# Application
APP_NAME="Neverland Studio"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=neverland
DB_USERNAME=neverland
DB_PASSWORD=your_secure_password_here

# Frontend
FRONTEND_URL=https://yourdomain.com
SANCTUM_STATEFUL_DOMAINS=yourdomain.com
SESSION_DOMAIN=.yourdomain.com

# Session & Security
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true

# Cache & Queue
CACHE_DRIVER=file
QUEUE_CONNECTION=database

# Mail (Optional)

---

## Troubleshooting

**Database error:**
```bash
docker-compose logs db
docker-compose restart backend
```

**CORS error:**
```bash
docker-compose exec backend php artisan config:clear
docker-compose restart backend
```

**Can't access site:**
- Check nginx: `docker-compose ps`
- Check tunnel: `cloudflared tunnel info neverland-portfolio`

---

## Switch ke Development

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:8000/api
```

**Backend (backend/.env):**
```env
APP_ENV=local
APP_DEBUG=true
DB_HOST=127.0.0.1
FRONTEND_URL=http://localhost:5173
```

Restart: `docker-compose restart`

---

Made with ❤️ by Neverland Studio
