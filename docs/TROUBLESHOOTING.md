# 🔧 Troubleshooting Guide

<div align="center">

**Solutions to Common Issues in Neverland Studio Portfolio**

Quick fixes for installation, development, and deployment problems.

---

</div>

## 📋 Table of Contents

- [Installation Issues](#-installation-issues)
- [Development Issues](#-development-issues)
- [Database Issues](#-database-issues)
- [Docker Issues](#-docker-issues)
- [API \& CORS Issues](#-api--cors-issues)
- [Authentication Issues](#-authentication-issues)
- [Build \& Deployment Issues](#-build--deployment-issues)
- [Performance Issues](#-performance-issues)
- [General Issues](#-general-issues)

---

## 🛠 Installation Issues

### Node.js Version Mismatch

**Problem**: `error: The engine "node" is incompatible with this module`

**Solution**:
```bash
# Check your Node.js version
node --version

# Need Node.js 20.x or higher
# Install using nvm (recommended)
nvm install 20
nvm use 20

# Or download from nodejs.org
```

**Verify**:
```bash
node --version  # Should show v20.x or higher
npm --version   # Should show v10.x or higher
```

---

### npm install Fails

**Problem**: `npm ERR! code EACCES` or permission errors

**Solution 1 - Fix npm permissions (Linux/Mac)**:
```bash
# Create npm directory
mkdir ~/.npm-global

# Configure npm
npm config set prefix '~/.npm-global'

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH=~/.npm-global/bin:$PATH

# Reload
source ~/.bashrc  # or source ~/.zshrc

# Try again
npm install
```

**Solution 2 - Clear cache and retry**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

**Solution 3 - Use different registry**:
```bash
# Try different npm registry
npm install --registry=https://registry.npmjs.org/
```

---

### Composer install Fails

**Problem**: `Your requirements could not be resolved to an installable set of packages`

**Solution**:
```bash
# Check PHP version (need 8.2+)
php --version

# Update composer
composer self-update

# Clear cache
composer clear-cache

# Delete vendor and composer.lock
rm -rf vendor composer.lock

# Install with verbose output
composer install -vvv

# If specific package fails, try
composer update package/name
```

**Problem**: Memory limit errors

**Solution**:
```bash
# Temporarily increase memory limit
php -d memory_limit=-1 /usr/local/bin/composer install

# Or permanently in php.ini
memory_limit = 512M
```

---

### Git Clone Fails

**Problem**: `Permission denied (publickey)` or authentication errors

**Solution 1 - Use HTTPS instead of SSH**:
```bash
git clone https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio.git
```

**Solution 2 - Setup SSH keys**:
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH Keys → New SSH Key
```

---

## 💻 Development Issues

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::5173`

**Solution 1 - Kill process on port (Linux/Mac)**:
```bash
# Find process
lsof -ti:5173

# Kill process
lsof -ti:5173 | xargs kill -9

# Or in one command
kill -9 $(lsof -ti:5173)
```

**Solution 2 - Kill process (Windows)**:
```powershell
# Find process
netstat -ano | findstr :5173

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Solution 3 - Use different port**:
```javascript
// vite.config.ts
server: {
  port: 3000,  // Change to any available port
}
```

---

### Hot Reload Not Working

**Problem**: Changes not reflected in browser

**Solution 1 - Check file watchers limit (Linux)**:
```bash
# Increase file watchers
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Verify
cat /proc/sys/fs/inotify/max_user_watches
```

**Solution 2 - Hard reload**:
- Chrome/Firefox: `Ctrl + Shift + R` or `Cmd + Shift + R`
- Clear browser cache
- Restart dev server

**Solution 3 - Check Vite config**:
```typescript
// vite.config.ts
server: {
  watch: {
    usePolling: true,  // Use if on VM or Docker
  }
}
```

---

### ESLint Errors

**Problem**: Too many ESLint warnings/errors

**Solution 1 - Auto-fix**:
```bash
# Fix all auto-fixable issues
npm run lint:fix
```

**Solution 2 - Ignore specific rules**:
```javascript
// eslint.config.js
rules: {
  '@typescript-eslint/no-explicit-any': 'warn',  // Change error to warning
  'react-refresh/only-export-components': 'off',  // Disable rule
}
```

**Solution 3 - Disable for specific line**:
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = response.data;
```

---

## 🗄 Database Issues

### Connection Refused

**Problem**: `SQLSTATE[HY000] [2002] Connection refused`

**Solution 1 - Check MySQL is running**:
```bash
# Check status
sudo systemctl status mysql

# Start MySQL
sudo systemctl start mysql

# Enable auto-start
sudo systemctl enable mysql
```

**Solution 2 - Verify credentials**:
```env
# backend/.env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1  # Not 'localhost'
DB_PORT=3306
DB_DATABASE=neverland_portfolio
DB_USERNAME=root
DB_PASSWORD=your_password
```

**Solution 3 - Check MySQL port**:
```bash
# Check MySQL port
sudo netstat -tlnp | grep mysql

# Or
sudo lsof -i :3306
```

**Solution 4 - Test connection**:
```bash
mysql -u root -p -h 127.0.0.1 -P 3306
```

---

### Access Denied

**Problem**: `SQLSTATE[HY000] [1045] Access denied for user`

**Solution 1 - Reset MySQL password**:
```bash
# Login to MySQL
sudo mysql

# For MySQL 8.0+
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new_password';
FLUSH PRIVILEGES;
exit;

# Update backend/.env with new password
```

**Solution 2 - Create new user**:
```sql
-- Login as root
sudo mysql

-- Create user
CREATE USER 'neverland'@'localhost' IDENTIFIED BY 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON neverland_portfolio.* TO 'neverland'@'localhost';
FLUSH PRIVILEGES;
```

Then update `backend/.env`:
```env
DB_USERNAME=neverland
DB_PASSWORD=secure_password
```

---

### Migration Fails

**Problem**: Cannot run migrations

**Solution 1 - Check database exists**:
```bash
mysql -u root -p
```

```sql
CREATE DATABASE IF NOT EXISTS neverland_portfolio;
SHOW DATABASES;
exit;
```

**Solution 2 - Reset migrations**:
```bash
# Rollback all migrations
php artisan migrate:rollback

# Or fresh start (WARNING: deletes all data)
php artisan migrate:fresh

# With seeders
php artisan migrate:fresh --seed
```

**Solution 3 - Fix specific migration**:
```bash
# Check migration status
php artisan migrate:status

# Run specific migration
php artisan migrate --path=/database/migrations/2024_01_01_000000_create_users_table.php

# Force in production
php artisan migrate --force
```

**Solution 4 - Clear config cache**:
```bash
php artisan config:clear
php artisan cache:clear
php artisan migrate
```

---

### Database Already Exists

**Problem**: Error when creating database

**Solution**:
```bash
mysql -u root -p
```

```sql
-- Drop existing database (WARNING: deletes all data)
DROP DATABASE IF EXISTS neverland_portfolio;

-- Create fresh database
CREATE DATABASE neverland_portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verify
SHOW DATABASES;
exit;
```

---

## 🐳 Docker Issues

### Cannot Connect to Docker Daemon

**Problem**: `Cannot connect to the Docker daemon`

**Solution 1 - Start Docker**:
```bash
# Linux
sudo systemctl start docker
sudo systemctl enable docker

# Mac
# Open Docker Desktop application

# Verify
docker ps
```

**Solution 2 - Add user to docker group (Linux)**:
```bash
# Add user
sudo usermod -aG docker $USER

# Logout and login again, or
newgrp docker

# Verify
docker ps
```

---

### Container Fails to Start

**Problem**: Container exits immediately or fails to start

**Solution 1 - Check logs**:
```bash
# View logs
docker compose logs

# Specific service
docker compose logs backend
docker compose logs db

# Follow logs
docker compose logs -f backend
```

**Solution 2 - Rebuild containers**:
```bash
# Stop all containers
docker compose down

# Remove volumes (WARNING: deletes data)
docker compose down -v

# Rebuild
docker compose build --no-cache

# Start
docker compose up -d
```

**Solution 3 - Check environment variables**:
```bash
# Ensure .env files exist
ls -la .env backend/.env

# Verify configuration
docker compose config
```

---

### Port Conflict

**Problem**: `bind: address already in use`

**Solution 1 - Find and stop conflicting service**:
```bash
# Find process on port 80
sudo lsof -i :80

# Kill process
sudo kill -9 <PID>
```

**Solution 2 - Change Docker ports**:
```yaml
# docker-compose.yml
services:
  nginx:
    ports:
      - "8080:80"  # Change from 80 to 8080
```

---

### Database Connection in Docker

**Problem**: Backend cannot connect to database in Docker

**Solution - Verify network and hosts**:
```yaml
# docker-compose.yml - Check services are in same network
services:
  backend:
    depends_on:
      - db
    networks:
      - app-network
  
  db:
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

```env
# backend/.env - Use service name as host
DB_HOST=db  # Not 127.0.0.1 or localhost
DB_PORT=3306
```

**Verify connection inside container**:
```bash
# Access backend container
docker compose exec backend bash

# Test database connection
php artisan tinker
```

```php
DB::connection()->getPdo();
```

---

## 🌐 API & CORS Issues

### CORS Policy Error

**Problem**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution 1 - Update Laravel CORS config**:
```php
// backend/config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:3000',
        env('FRONTEND_URL', 'http://localhost:5173'),
    ],
    
    'allowed_origins_patterns' => [],
    
    'allowed_headers' => ['*'],
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => true,
];
```

**Solution 2 - Clear config cache**:
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

**Solution 3 - Check .env**:
```env
# backend/.env
FRONTEND_URL=http://localhost:5173
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

---

### 404 on API Endpoints

**Problem**: API routes return 404

**Solution 1 - Check routes**:
```bash
# List all routes
php artisan route:list

# Filter API routes
php artisan route:list --path=api

# Clear route cache
php artisan route:clear
```

**Solution 2 - Verify API URL**:
```env
# .env (frontend)
VITE_API_URL=http://localhost:8000/api  # Include /api
```

**Solution 3 - Check middleware**:
```php
// backend/routes/api.php
Route::middleware('api')->group(function () {
    // Your routes here
});
```

---

### Sanctum Authentication Not Working

**Problem**: Cannot authenticate with Sanctum

**Solution 1 - Configure Sanctum**:
```env
# backend/.env
SESSION_DRIVER=cookie
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

**Solution 2 - CSRF token**:
```typescript
// frontend - Get CSRF token before login
await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
  withCredentials: true
});

// Then login
await axios.post('http://localhost:8000/api/login', credentials, {
  withCredentials: true
});
```

**Solution 3 - Clear sessions**:
```bash
php artisan session:clear
php artisan cache:clear
```

---

## 🔐 Authentication Issues

### Cannot Login

**Problem**: Login fails with 422 or 401 error

**Solution 1 - Check credentials**:
```bash
# Reset admin password
php artisan tinker
```

```php
$user = User::where('email', 'admin@example.com')->first();
$user->password = bcrypt('new_password');
$user->save();
```

**Solution 2 - Check validation**:
- Ensure email format is correct
- Password meets requirements
- Check network tab in browser DevTools

**Solution 3 - Clear sessions and cache**:
```bash
php artisan cache:clear
php artisan session:clear
php artisan config:clear
```

---

### Session Expires Immediately

**Problem**: User logged out after page refresh

**Solution 1 - Check session config**:
```env
# backend/.env
SESSION_DRIVER=cookie
SESSION_LIFETIME=120
SESSION_DOMAIN=localhost
SESSION_SECURE_COOKIE=false  # true only with HTTPS
SESSION_SAME_SITE=lax
```

**Solution 2 - Check Axios config**:
```typescript
// frontend API client
axios.defaults.withCredentials = true;
```

**Solution 3 - Clear browser cookies**:
- Clear browser cache and cookies
- Try in incognito/private mode

---

### OAuth Login Fails

**Problem**: Google/GitHub login not working

**Solution 1 - Verify OAuth credentials**:
```env
# backend/.env
GOOGLE_CLIENT_ID=your_actual_client_id
GOOGLE_CLIENT_SECRET=your_actual_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_secret
GITHUB_REDIRECT_URI=http://localhost:8000/api/auth/github/callback
```

**Solution 2 - Check OAuth app settings**:
- Google: Verify authorized redirect URIs
- GitHub: Verify callback URL
- Ensure credentials are for correct environment

**Solution 3 - Clear config**:
```bash
php artisan config:clear
php artisan cache:clear
```

**See**: [OAuth Setup Guide](OAUTH_SETUP.md) for detailed configuration

---

## 🏗 Build & Deployment Issues

### Build Fails

**Problem**: `npm run build` fails

**Solution 1 - Check for errors**:
```bash
# Build with verbose output
npm run build -- --debug

# Check TypeScript errors
npm run type-check
```

**Solution 2 - Fix TypeScript errors**:
```bash
# Generate tsconfig
npx tsc --init

# Check for type errors
tsc --noEmit
```

**Solution 3 - Clear cache and rebuild**:
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Clear dist
rm -rf dist

# Rebuild
npm run build
```

---

### Production Build Too Large

**Problem**: Bundle size too large

**Solution 1 - Analyze bundle**:
```bash
# Build with analyzer
npm run build

# Check dist/ folder size
du -sh dist/
```

**Solution 2 - Enable compression** (already configured):
```typescript
// vite.config.ts
import compression from 'vite-plugin-compression';

plugins: [
  compression({
    algorithm: 'gzip',
    ext: '.gz',
  }),
]
```

**Solution 3 - Code splitting**:
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor': ['react', 'react-dom', 'react-router-dom'],
        'charts': ['chart.js', 'recharts'],
      }
    }
  }
}
```

---

### Deployment Fails

**Problem**: Application doesn't work in production

**Solution 1 - Check environment variables**:
```env
# .env
VITE_API_URL=https://yourdomain.com/api  # Full production URL
```

```env
# backend/.env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
```

**Solution 2 - Optimize Laravel**:
```bash
# Run all optimizations
php artisan optimize

# Individual commands
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Solution 3 - Check file permissions**:
```bash
# Set correct permissions
chmod -R 755 backend/storage
chmod -R 755 backend/bootstrap/cache

# Set ownership
chown -R www-data:www-data backend/storage
chown -R www-data:www-data backend/bootstrap/cache
```

---

## ⚡ Performance Issues

### Slow Page Load

**Problem**: Application loads slowly

**Solution 1 - Enable production mode**:
```env
# backend/.env
APP_ENV=production
APP_DEBUG=false
```

```bash
# Optimize Laravel
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Solution 2 - Enable compression**:
```bash
# Already configured in vite.config.ts
npm run build  # Produces .gz files
```

**Configure Nginx** to serve .gz files:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

**Solution 3 - Use CDN**:
- Cloudflare (recommended, already integrated)
- AWS CloudFront
- Serve static assets from CDN

---

### Database Queries Slow

**Problem**: API responses slow due to database

**Solution 1 - Add indexes**:
```php
// In migration
$table->index('email');
$table->index('created_at');
$table->index(['user_id', 'created_at']);
```

**Solution 2 - Enable query caching**:
```env
# backend/.env
CACHE_DRIVER=redis  # or file
```

**Solution 3 - Use eager loading**:
```php
// Instead of lazy loading (N+1 problem)
$users = User::all();
foreach ($users as $user) {
    $user->posts;  // N+1 query
}

// Use eager loading
$users = User::with('posts')->get();  // Single query
```

**Solution 4 - Enable query log to debug**:
```php
// Enable query log
DB::enableQueryLog();

// Your code
$users = User::all();

// Get queries
dd(DB::getQueryLog());
```

---

### High Memory Usage

**Problem**: Application uses too much memory

**Solution 1 - Optimize PHP**:
```ini
# php.ini
memory_limit = 256M
upload_max_filesize = 10M
post_max_size = 10M
```

**Solution 2 - Use chunking for large datasets**:
```php
// Instead of
$users = User::all();  // Loads all in memory

// Use chunking
User::chunk(100, function ($users) {
    foreach ($users as $user) {
        // Process
    }
});
```

**Solution 3 - Clear caches**:
```bash
php artisan cache:clear
php artisan view:clear
php artisan route:clear
```

---

## 🔍 General Issues

### .env File Not Loaded

**Problem**: Environment variables not working

**Solution 1 - Check file exists**:
```bash
# Frontend
ls -la .env

# Backend
ls -la backend/.env
```

**Solution 2 - Check file format**:
```env
# Correct format
VITE_API_URL=http://localhost:8000/api

# Wrong formats (quotes not needed for most values)
VITE_API_URL="http://localhost:8000/api"  # Remove quotes
VITE_API_URL = http://localhost:8000/api  # No spaces around =
```

**Solution 3 - Clear cache**:
```bash
# Laravel
php artisan config:clear

# Restart dev server
npm run dev
```

---

### Command Not Found

**Problem**: `command not found: php` or `npm`

**Solution - Add to PATH**:
```bash
# Check current PATH
echo $PATH

# Add to PATH (example for npm)
export PATH="$HOME/.npm-global/bin:$PATH"

# Add to ~/.bashrc or ~/.zshrc for persistence
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

---

### Permission Denied

**Problem**: Permission errors when running commands

**Solution 1 - Fix ownership**:
```bash
# Change ownership
sudo chown -R $USER:$USER .

# Fix specific directories
sudo chown -R $USER:$USER node_modules
sudo chown -R $USER:$USER backend/vendor
```

**Solution 2 - Fix permissions**:
```bash
# Make files readable
chmod -R 755 .

# Make scripts executable
chmod +x script.sh
```

---

## 🆘 Still Having Issues?

### Diagnostic Commands

Run these to gather information:

```bash
# System info
uname -a
node --version
npm --version
php --version
composer --version
mysql --version
docker --version

# Check services
sudo systemctl status mysql
sudo systemctl status nginx
docker compose ps

# Check ports
sudo netstat -tlnp | grep :5173
sudo netstat -tlnp | grep :8000
sudo netstat -tlnp | grep :3306

# Check logs
tail -f backend/storage/logs/laravel.log
docker compose logs -f
journalctl -u mysql -f
```

### Getting Help

1. **Search existing issues**:
   - [GitHub Issues](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/issues)

2. **Check documentation**:
   - [FAQ](FAQ.md)
   - [Quick Start](QUICKSTART.md)
   - [Full Docs](../DOCUMENTATION_GUIDE.md)

3. **Create new issue**:
   - Include error messages
   - Include steps to reproduce
   - Include environment info
   - Include logs

4. **Contact support**:
   - Email: muhammadisakiprananda88@gmail.com
   - Include diagnostic information above

---

<div align="center">

**Made with ❤️ by [Neverland Studio](https://portfolio.neverlandstudio.my.id)**

[⬆ Back to Top](#-troubleshooting-guide) • [📖 Documentation](../DOCUMENTATION_GUIDE.md) • [❓ FAQ](FAQ.md)

</div>
