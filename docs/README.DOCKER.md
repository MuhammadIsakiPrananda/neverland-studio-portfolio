# Docker Production Deployment

## Prerequisites

Docker Engine 20.10+, Docker Compose V2, Git

## Quick Start

Configure environment:
```bash
cp .env.production .env
# Update: APP_KEY, DB_PASSWORD, DB_ROOT_PASSWORD, VITE_API_URL
```

Deploy:
```bash
chmod +x deploy.sh && ./deploy.sh
```

Or manually:
```bash
docker-compose build && docker-compose up -d
docker-compose exec backend php artisan migrate --force
docker-compose exec backend php artisan config:cache route:cache view:cache
```

## Services

MySQL (port 3306), Laravel Backend (port 9000), React/Vite Frontend, Nginx (ports 80/443)

## Common Commands

```bash
# Start/Stop
docker-compose up -d
docker-compose down
docker-compose restart

# Logs & Status
docker-compose logs -f [service-name]
docker-compose ps
docker stats

# Backend
docker-compose exec backend php artisan [command]
docker-compose exec backend sh

# Database
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan db:seed
docker-compose exec mysql mysqldump -u root -p[PASSWORD] neverlandstudio > backup.sql
docker-compose exec -T mysql mysql -u root -p[PASSWORD] neverlandstudio < backup.sql
```

## SSL/HTTPS

Get certificate:
```bash
sudo apt-get install certbot
sudo certbot certonly --standalone -d yourdomain.com
```

Copy certificates:
```bash
mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/certificate.crt
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/private.key
```

Enable HTTPS in `nginx/conf.d/default.conf`, update `VITE_API_URL=https://yourdomain.com/api` in `.env`, then:
```bash
docker-compose down && docker-compose build frontend && docker-compose up -d
```

## Update

```bash
git pull origin main && ./deploy.sh
# Or: docker-compose pull && docker-compose up -d
```

## Troubleshooting

```bash
# Logs
docker-compose logs [service-name]

# Rebuild
docker-compose build --no-cache [service-name]

# Permissions
docker-compose exec backend chown -R www-data:www-data /var/www/storage
docker-compose exec backend chmod -R 775 /var/www/storage

# Clear cache
docker-compose exec backend php artisan cache:clear config:clear route:clear view:clear
```

## Cleanup

```bash
docker-compose down           # Stop containers
docker-compose down -v        # Remove volumes (deletes data!)
docker-compose down --rmi all # Remove images
docker system prune -a --volumes
```

## Production Tips

- Set `APP_ENV=production` and `APP_DEBUG=false` in `.env`
- OPcache enabled by default
- Add to `docker-compose.yml` for MySQL: `command: --max-connections=500`
- Optional: Enable Redis in `docker-compose.yml` and `.env`

## Security

Change default passwords, use strong `APP_KEY`, enable HTTPS, set `APP_DEBUG=false`, keep images updated, backup regularly, use firewall

## Backup

Create `backup.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T mysql mysqldump -u root -p$DB_ROOT_PASSWORD $DB_DATABASE > backup_$DATE.sql
```

Add to crontab: `0 2 * * * /path/to/backup.sh`

## Support

Check logs: `docker-compose logs -f` or `backend/storage/logs/laravel.log`
