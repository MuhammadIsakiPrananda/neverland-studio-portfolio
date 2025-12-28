# Deployment Guide

Simple guide untuk deploy Neverland Studio Portfolio.

---

## Quick Start

### 1. Setup Environment

**Frontend (.env di root):**
```env
VITE_API_URL=https://portfolio.neverlandstudio.my.id/api
```

**Backend (backend/.env):**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://portfolio.neverlandstudio.my.id
DB_PASSWORD=neverland_secure_2024
FRONTEND_URL=https://portfolio.neverlandstudio.my.id
SESSION_DOMAIN=.neverlandstudio.my.id
```

### 2. Generate Laravel Key

```bash
cd backend
php artisan key:generate
cd ..
```

### 3. Deploy

```bash
# Start semua services (dengan nginx untuk production)
docker-compose --profile production up -d --build

# Jalankan migrations
docker-compose exec backend php artisan migrate --force
```

### 4. Setup Cloudflare Tunnel

```bash
# Install cloudflared
winget install --id Cloudflare.cloudflared

# Login dan buat tunnel
cloudflared tunnel login
cloudflared tunnel create neverland-portfolio

# Edit cloudflared-config.yml (ganti YOUR_TUNNEL_ID dengan tunnel ID Anda)

# Create DNS record
cloudflared tunnel route dns neverland-portfolio portfolio.neverlandstudio.my.id

# Start tunnel
cloudflared tunnel --config cloudflared-config.yml run neverland-portfolio
```

**Live di:** https://portfolio.neverlandstudio.my.id

---

## Commands

```bash
# Start production
docker-compose --profile production up -d

# Stop semua
docker-compose down

# Lihat logs
docker-compose logs -f backend

# Laravel commands
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan config:cache
```

---

## Environment Files

**Frontend (.env)** - Vite variables
```
VITE_API_URL=https://portfolio.neverlandstudio.my.id/api
```

**Backend (backend/.env)** - Laravel config
```
APP_ENV=production
DB_HOST=db
FRONTEND_URL=https://portfolio.neverlandstudio.my.id
SANCTUM_STATEFUL_DOMAINS=portfolio.neverlandstudio.my.id
```

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
