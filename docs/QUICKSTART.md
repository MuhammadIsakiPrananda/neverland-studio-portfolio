# 🚀 Quick Start Guide

<div align="center">

**Get Neverland Studio Portfolio running in 15 minutes!**

Fast track to getting your development environment up and running.

---

</div>

## ⚡ TL;DR - Super Quick Start

```bash
# 1. Clone repository
git clone https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio.git
cd neverland-studio-portfolio

# 2. Setup frontend
npm install
cp .env.example .env
# Edit .env: Set VITE_API_URL=http://localhost:8000/api

# 3. Setup backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed

# 4. Start development
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend
php artisan serve
```

**🎉 Done!** Visit `http://localhost:5173`

---

## 📋 Table of Contents

- [Prerequisites Check](#-prerequisites-check)
- [Method 1: Local Development](#-method-1-local-development-recommended-for-development)
- [Method 2: Docker Setup](#-method-2-docker-setup-recommended-for-deployment)
- [First Login](#-first-login)
- [Next Steps](#-next-steps)
- [Common Issues](#-common-issues)

---

## ✅ Prerequisites Check

Before starting, verify you have the required tools:

### For Local Development

```bash
# Check Node.js (need 20.x or higher)
node --version

# Check npm (need 10.x or higher)
npm --version

# Check PHP (need 8.2 or higher)
php --version

# Check Composer (need 2.x)
composer --version

# Check MySQL (need 8.0 or higher)
mysql --version
```

### For Docker Setup

```bash
# Check Docker (need 24.0+)
docker --version

# Check Docker Compose (need V2)
docker compose version
```

> **Missing prerequisites?** See [Installation Prerequisites](../README.md#prerequisites) for installation guides.

---

## 🖥 Method 1: Local Development (Recommended for Development)

Perfect for active development and learning. Takes ~15-20 minutes.

### Step 1: Clone Repository

```bash
# Clone the project
git clone https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio.git

# Navigate to directory
cd neverland-studio-portfolio
```

### Step 2: Frontend Setup

```bash
# Install dependencies (this may take 2-3 minutes)
npm install

# Copy environment file
cp .env.example .env

# Edit .env file
nano .env  # or use your favorite editor
```

**Configure `.env`**:
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Neverland Studio
VITE_APP_URL=http://localhost:5173
```

**Start frontend**:
```bash
npm run dev
```

✅ Frontend should be running at `http://localhost:5173`

### Step 3: Backend Setup

Open a **new terminal window**:

```bash
# Navigate to backend
cd backend

# Install PHP dependencies (this may take 2-3 minutes)
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

**Configure `backend/.env`**:
```env
APP_NAME="Neverland Studio"
APP_URL=http://localhost:8000
APP_ENV=local
APP_DEBUG=true

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=neverland_portfolio
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

FRONTEND_URL=http://localhost:5173
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

### Step 4: Database Setup

```bash
# Create database
mysql -u root -p
```

In MySQL console:
```sql
CREATE DATABASE neverland_portfolio;
exit;
```

Back in terminal:
```bash
# Run migrations and seeders
php artisan migrate --seed

# This creates:
# - Database tables
# - Admin user (admin@example.com / password)
# - Sample data for testing
```

### Step 5: Start Backend

```bash
php artisan serve
```

✅ Backend should be running at `http://localhost:8000`

### Step 6: Verify Installation

1. **Open browser**: Navigate to `http://localhost:5173`
2. **Check homepage**: Should load without errors
3. **Test login**: 
   - Email: `admin@example.com`
   - Password: `password`
4. **Access dashboard**: Should redirect to `/dashboard`

🎉 **Success!** You now have a fully functional local development environment.

---

## 🐳 Method 2: Docker Setup (Recommended for Deployment)

Perfect for consistent environments and easy deployment. Takes ~10-15 minutes.

### Step 1: Prerequisites

Ensure Docker and Docker Compose are installed:
```bash
docker --version
docker compose version
```

### Step 2: Clone Repository

```bash
git clone https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio.git
cd neverland-studio-portfolio
```

### Step 3: Configure Environment

```bash
# Copy frontend environment
cp .env.example .env

# Copy backend environment
cp backend/.env.example backend/.env
```

**Edit `.env`**:
```env
VITE_API_URL=http://localhost/api
```

**Edit `backend/.env`**:
```env
DB_HOST=db
DB_PORT=3306
DB_DATABASE=neverland_portfolio
DB_USERNAME=root
DB_PASSWORD=root_password
```

### Step 4: Build and Start Containers

```bash
# Build and start all services
docker compose up -d --build

# This will:
# - Build frontend container
# - Build backend container
# - Start MySQL container
# - Start Nginx container
# - Takes 5-10 minutes on first run
```

**Monitor progress**:
```bash
# Watch logs
docker compose logs -f

# Check container status
docker compose ps
```

### Step 5: Setup Database

```bash
# Run migrations
docker compose exec backend php artisan migrate --seed

# Generate application key
docker compose exec backend php artisan key:generate

# Optimize Laravel
docker compose exec backend php artisan optimize
```

### Step 6: Verify Installation

1. **Open browser**: Navigate to `http://localhost`
2. **Test frontend**: Should see homepage
3. **Test backend**: Visit `http://localhost/api/health`
4. **Login**:
   - Email: `admin@example.com`
   - Password: `password`

🎉 **Success!** Your Docker environment is ready.

### Useful Docker Commands

```bash
# Stop all services
docker compose down

# Restart services
docker compose restart

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Access backend shell
docker compose exec backend bash

# Access database
docker compose exec db mysql -u root -p

# Rebuild specific service
docker compose up -d --build backend
```

---

## 🔐 First Login

### Default Admin Account

After running migrations with `--seed`:

- **Email**: `admin@example.com`
- **Password**: `password`

> ⚠️ **IMPORTANT**: Change this password immediately in production!

### Change Admin Password

1. **Login** to dashboard
2. **Profile** → **Security**
3. **Change Password**
4. **Enable 2FA** (recommended)

### Create Additional Users

**Via Dashboard**:
1. Dashboard → Users → Add New User
2. Fill in details
3. Assign role (Admin/User)
4. Save

**Via Command Line**:
```bash
php artisan tinker
```

```php
User::create([
    'name' => 'Your Name',
    'email' => 'your@email.com',
    'password' => bcrypt('your_password'),
    'role' => 'admin', // or 'user'
]);
```

---

## 🎯 Next Steps

Now that you're up and running, here's what to do next:

### 1. Explore the Dashboard

```
http://localhost:5173/dashboard
```

**Try these features**:
- ✅ View analytics and statistics
- ✅ Manage users
- ✅ Check contact messages
- ✅ Review enrollments
- ✅ Test maintenance mode

### 2. Customize Your Instance

**Branding**:
- Update `VITE_APP_NAME` in `.env`
- Replace logo in `src/assets/`
- Modify colors in `tailwind.config.js`

**Content**:
- Edit homepage sections in `src/components/pages/`
- Add your services
- Update contact information

### 3. Setup OAuth (Optional)

Enable Google and GitHub login:

**Quick setup**:
1. Get OAuth credentials:
   - [Google Console](https://console.cloud.google.com/)
   - [GitHub Settings](https://github.com/settings/developers)

2. Update `backend/.env`:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_secret
   ```

📖 **Detailed guide**: [OAuth Setup](OAUTH_SETUP.md)

### 4. Configure Email

Setup email notifications:

**Using Gmail**:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
```

> 📧 **Gmail App Password**: [Create here](https://support.google.com/accounts/answer/185833)

### 5. Read the Documentation

**Essential reading**:
- [Features Documentation](FEATURES_DOCUMENTATION.md) - Learn all features
- [API Reference](API.md) - API endpoints and usage
- [Project Structure](STRUCTURE.md) - Understand codebase
- [Contributing Guide](../CONTRIBUTING.md) - How to contribute

**📚 Full documentation**: [Documentation Guide](../DOCUMENTATION_GUIDE.md)

### 6. Start Building

**Create your first feature**:
1. Create a new branch: `git checkout -b feature/my-feature`
2. Add frontend component in `src/components/`
3. Add backend endpoint in `backend/app/Http/Controllers/Api/`
4. Update routes in `backend/routes/api.php`
5. Test your changes
6. Submit a PR!

---

## 🔧 Common Issues

### Issue: Port 5173 already in use

**Solution**:
```bash
# Kill process on port
lsof -ti:5173 | xargs kill -9

# Or change port in vite.config.ts
```

### Issue: Database connection failed

**Solution**:
1. Verify MySQL is running
2. Check credentials in `backend/.env`
3. Ensure database exists:
   ```bash
   mysql -u root -p
   CREATE DATABASE neverland_portfolio;
   ```

### Issue: CORS errors

**Solution**:

Update `backend/config/cors.php`:
```php
'allowed_origins' => [
    'http://localhost:5173',
    env('FRONTEND_URL'),
],
```

### Issue: npm install fails

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Composer install fails

**Solution**:
```bash
# Clear composer cache
composer clear-cache

# Delete vendor
rm -rf vendor composer.lock

# Reinstall
composer install
```

### Issue: Docker containers won't start

**Solution**:
```bash
# Check logs
docker compose logs

# Rebuild from scratch
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

### Issue: 404 on API endpoints

**Solution**:
1. Check `VITE_API_URL` in `.env`
2. Verify backend is running
3. Check `backend/routes/api.php` for routes
4. Clear Laravel cache:
   ```bash
   php artisan route:clear
   php artisan cache:clear
   ```

**More help**: See [Troubleshooting Guide](TROUBLESHOOTING.md)

---

## 💡 Pro Tips

### Development Workflow

```bash
# Terminal 1: Frontend with auto-reload
npm run dev

# Terminal 2: Backend with auto-reload (requires laravel-watcher)
cd backend
php artisan serve --watch

# Terminal 3: Tail Laravel logs
cd backend
tail -f storage/logs/laravel.log
```

### Useful Commands

```bash
# Frontend
npm run build          # Build for production
npm run lint           # Check code quality
npm run format         # Format code

# Backend
php artisan migrate:fresh --seed  # Reset database
php artisan optimize              # Optimize Laravel
php artisan route:list            # List all routes
php artisan tinker                # Laravel REPL
```

### Quick Database Access

```bash
# Local MySQL
mysql -u root -p neverland_portfolio

# Docker MySQL
docker compose exec db mysql -u root -p neverland_portfolio

# Run SQL file
mysql -u root -p neverland_portfolio < database.sql
```

---

## 🆘 Getting Help

Stuck? Here's how to get help:

1. **Check Documentation**
   - [FAQ](FAQ.md) - Common questions
   - [Troubleshooting](TROUBLESHOOTING.md) - Common issues
   - [Full Docs](../DOCUMENTATION_GUIDE.md) - Complete guides

2. **Search Issues**
   - [GitHub Issues](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/issues)
   - Someone might have had the same problem

3. **Ask Community**
   - [GitHub Discussions](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/discussions)
   - Share your issue with detailed information

4. **Contact Developer**
   - Email: muhammadisakiprananda88@gmail.com
   - Include error messages and logs

---

## 🎉 You're Ready!

Congratulations! You now have Neverland Studio Portfolio running.

**What's next?**
- 🎨 Customize the design
- ✨ Add new features
- 📚 Read the full documentation
- 🤝 Contribute back to the project

---

<div align="center">

**Made with ❤️ by [Neverland Studio](https://portfolio.neverlandstudio.my.id)**

[⬆ Back to Top](#-quick-start-guide) • [📖 Full Documentation](../DOCUMENTATION_GUIDE.md) • [🐛 Report Issue](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/issues)

</div>
