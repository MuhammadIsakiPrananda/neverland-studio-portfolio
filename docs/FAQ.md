# ❓ Frequently Asked Questions (FAQ)

<div align="center">

**Quick answers to common questions about Neverland Studio Portfolio**

[General](#-general) • [Installation](#-installation) • [Development](#-development) • [Deployment](#-deployment) • [Troubleshooting](#-troubleshooting)

---

</div>

## 📑 Table of Contents

- [General Questions](#-general-questions)
- [Installation \& Setup](#-installation--setup)
- [Development](#-development)
- [Features \& Functionality](#-features--functionality)
- [Deployment \& Production](#-deployment--production)
- [Security](#-security)
- [Performance](#-performance)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🌟 General Questions

### What is Neverland Studio Portfolio?

Neverland Studio Portfolio is a modern, full-stack web platform designed for showcasing IT services, managing learning programs, and handling digital consultations. It's built with React (frontend) and Laravel (backend).

### Who is this project for?

- **IT Service Providers** - Showcase your services professionally
- **Educational Institutions** - Manage course enrollments and students
- **Digital Agencies** - Handle consultations and client bookings
- **Developers** - Learn full-stack development best practices
- **Freelancers** - Professional portfolio platform

### What makes this project special?

✨ **Modern Tech Stack** - React 19, Laravel 11, TypeScript, Vite 7  
🚀 **Production Ready** - Docker, Cloudflare integration, CI/CD ready  
📊 **Real-time Analytics** - Live visitor tracking and statistics  
🔒 **Secure** - OAuth, 2FA, Sanctum authentication  
🎨 **Beautiful UI** - Responsive, modern design with Tailwind CSS  
📚 **Well-documented** - Extensive documentation (200+ pages)

### Is this project free to use?

Yes! This project is licensed under the **MIT License**, which means you can:
- ✅ Use it for commercial projects
- ✅ Modify as you need
- ✅ Distribute your own version
- ✅ Use privately

Just remember to include the original license and state any changes you make.

### Can I use this for my business?

Absolutely! The MIT license allows commercial use. You can customize it for your business needs.

---

## 🛠 Installation & Setup

### What are the system requirements?

**For Local Development:**
- Node.js 20.x or higher
- PHP 8.2 or higher
- Composer 2.x
- MySQL 8.0 or higher

**For Docker Deployment:**
- Docker 24.0+
- Docker Compose V2
- Git

See [Prerequisites](../README.md#prerequisites) for details.

### How long does installation take?

- **Local Setup**: ~15-20 minutes (including dependency installation)
- **Docker Setup**: ~10-15 minutes (including image builds)
- **Production Deployment**: ~30-45 minutes (with Cloudflare setup)

### Do I need to know Docker?

Not required but recommended! We provide both:
- **Local development** - No Docker needed
- **Docker deployment** - Easier, more consistent setup

Choose what you're comfortable with. See [Installation Guide](../README.md#-installation).

### Can I use Windows?

Yes! The project works on:
- ✅ **Windows** (with WSL2 recommended for Docker)
- ✅ **macOS**
- ✅ **Linux** (preferred)

For Windows, we recommend using WSL2 for better Docker performance.

### How do I set up environment variables?

1. **Frontend**:
   ```bash
   cp .env.example .env
   # Edit .env and set VITE_API_URL
   ```

2. **Backend**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env for database, mail, etc.
   ```

See [Configuration Guide](../README.md#-configuration) for all available options.

---

## 💻 Development

### What tech stack does this use?

**Frontend:**
- React 19.2.0 + TypeScript 5.9
- Vite 7.2.5 (with Rolldown)
- Tailwind CSS 3.4
- React Router DOM 7
- Axios, Chart.js, Recharts

**Backend:**
- Laravel 11.x + PHP 8.2
- MySQL 8.0
- Laravel Sanctum (API auth)
- Laravel Socialite (OAuth)

**DevOps:**
- Docker + Docker Compose
- Nginx
- Cloudflare Tunnel

See [Tech Stack](../README.md#-tech-stack) for complete list.

### How do I start development?

```bash
# Terminal 1 - Frontend
npm install
npm run dev
# Runs on http://localhost:5173

# Terminal 2 - Backend
cd backend
composer install
php artisan serve
# Runs on http://localhost:8000
```

See [Quick Start](../README.md#-quick-start) for detailed steps.

### How do I add a new feature?

1. **Plan** - Check existing features and architecture
2. **Create Branch** - `git checkout -b feature/your-feature`
3. **Frontend** - Add components in `src/components/`
4. **Backend** - Add controllers, models, routes in `backend/`
5. **Test** - Ensure everything works
6. **Document** - Update relevant docs
7. **Submit PR** - Follow [Contributing Guide](../CONTRIBUTING.md)

### How is the project structured?

```
portfolio/
├── src/              # React frontend
├── backend/          # Laravel API
├── docs/             # Documentation
├── public/           # Static assets
└── docker-compose.yml
```

See [Project Structure](STRUCTURE.md) for detailed breakdown.

### Can I use a different database?

Yes! Laravel supports:
- MySQL (default)
- PostgreSQL
- SQLite
- SQL Server

Just update `backend/.env` database configuration.

---

## ✨ Features & Functionality

### What features are included?

**User Features:**
- User registration and login
- OAuth login (Google, GitHub)
- Two-Factor Authentication (2FA)
- Profile management
- Course enrollment
- Consultation booking
- Contact form

**Admin Features:**
- Complete dashboard
- User management
- Content management
- Real-time analytics
- Maintenance mode
- Activity logging
- Session tracking

See [Features Documentation](FEATURES_DOCUMENTATION.md) for complete list.

### How do I enable OAuth login?

1. **Setup OAuth Apps**:
   - [Google Console](https://console.cloud.google.com/)
   - [GitHub Settings](https://github.com/settings/developers)

2. **Configure Backend**:
   ```env
   # backend/.env
   GOOGLE_CLIENT_ID=your_id
   GOOGLE_CLIENT_SECRET=your_secret
   GITHUB_CLIENT_ID=your_id
   GITHUB_CLIENT_SECRET=your_secret
   ```

See [OAuth Setup Guide](OAUTH_SETUP.md) for step-by-step instructions.

### How does real-time analytics work?

The platform uses **polling-based real-time updates**:
- Dashboard auto-refreshes every 3-5 seconds
- Tracks active visitors, sessions, activities
- Updates badges and charts in real-time
- No WebSocket required (uses HTTP polling)

See [Real-time Analytics](REALTIME_ANALYTICS.md) for implementation details.

### Can I customize the design?

Yes! The project uses Tailwind CSS:
- Modify `tailwind.config.js` for theme
- Edit components in `src/components/`
- Add custom CSS in component files
- Full flexibility with utility classes

### How do I add email functionality?

Configure SMTP in `backend/.env`:

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

For Gmail, use [App Password](https://support.google.com/accounts/answer/185833).

---

## 🚀 Deployment & Production

### How do I deploy to production?

**Recommended: Docker + Cloudflare Tunnel**

1. **Setup Server** (VPS/Cloud)
2. **Install Docker**
3. **Clone Repository**
4. **Configure Environment**
5. **Build with Docker**
6. **Setup Cloudflare Tunnel**
7. **Run Migrations**
8. **Start Application**

See [Deployment Guide](DEPLOYMENT.md) for complete walkthrough.

### Do I need a domain name?

- **Development**: No, use localhost
- **Production**: Yes, recommended for professional use
- **Cloudflare Tunnel**: Can use free Cloudflare subdomain

### What hosting do I need?

**Minimum Requirements:**
- 2GB RAM
- 2 CPU cores
- 20GB storage
- Ubuntu 20.04+ or similar

**Recommended VPS Providers:**
- DigitalOcean Droplets ($6/month)
- Vultr Cloud Compute ($6/month)
- AWS EC2 t3.small
- Google Cloud Compute Engine
- Linode

### How do I setup HTTPS?

Use **Cloudflare Tunnel** (recommended):
- ✅ Automatic HTTPS
- ✅ No port forwarding needed
- ✅ DDoS protection
- ✅ Free plan available

See [Deployment Guide - Cloudflare Section](DEPLOYMENT.md#cloudflare-tunnel-setup).

### How do I backup my data?

**Database Backup:**
```bash
# Manual backup
docker compose exec db mysqldump -u root -p neverland_portfolio > backup.sql

# Restore
docker compose exec -T db mysql -u root -p neverland_portfolio < backup.sql
```

**File Backup:**
```bash
# Backup uploads
tar -czf uploads_backup.tar.gz backend/storage/app/public/
```

Set up automated backups using cron jobs.

---

## 🔒 Security

### Is this project secure?

Yes! Security features include:
- ✅ HTTPS via Cloudflare
- ✅ CSRF protection
- ✅ XSS prevention
- ✅ SQL injection protection
- ✅ Rate limiting
- ✅ Bcrypt password hashing
- ✅ API authentication (Sanctum)
- ✅ Input validation
- ✅ CORS policy

See [Security Policy](SECURITY.md) for details.

### How do I enable Two-Factor Authentication?

1. **User Account** → **Security Settings**
2. **Enable 2FA**
3. **Scan QR Code** with Google Authenticator
4. **Verify Code**

Admin can enable/disable 2FA for users in dashboard.

### How do I handle security vulnerabilities?

If you find a vulnerability:
1. **DO NOT** open a public issue
2. Email: muhammadisakiprananda88@gmail.com
3. Include detailed description
4. Allow 24 hours for response

See [Security Policy](SECURITY.md#reporting-vulnerabilities).

### How often should I update dependencies?

**Recommended Schedule:**
- **Security updates**: Immediately
- **Minor updates**: Monthly
- **Major updates**: Quarterly (with testing)

```bash
# Check for updates
npm outdated
composer outdated

# Update
npm update
composer update
```

---

## ⚡ Performance

### How fast is this application?

**Performance Metrics:**
- Frontend build: ~5-10 seconds (Vite 7 with Rolldown)
- Page load: <1 second (optimized builds)
- API response: <200ms average
- Lighthouse score: 90+ (Performance)

### How do I optimize performance?

**Frontend:**
```bash
# Production build
npm run build:prod

# Enable compression
# Already configured in vite.config.ts
```

**Backend:**
```bash
# Laravel optimization
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Database:**
- Add indexes on frequently queried columns
- Use eager loading to prevent N+1 queries
- Configure query caching

### How many users can it handle?

**Default Configuration:**
- ~100 concurrent users
- ~1000 daily active users

**With Optimization:**
- ~500 concurrent users
- ~5000+ daily active users

Scale further with:
- Load balancer
- Database replication
- Redis caching
- CDN for static assets

---

## 🔧 Troubleshooting

### Common Issues

#### Port already in use

**Error**: `Address already in use: 0.0.0.0:5173`

**Solution**:
```bash
# Kill process on port
# Linux/Mac
lsof -ti:5173 | xargs kill -9

# Or change port in vite.config.ts
server: { port: 3000 }
```

#### Database connection failed

**Error**: `SQLSTATE[HY000] [2002] Connection refused`

**Solution**:
1. Check MySQL is running
2. Verify `backend/.env` database credentials
3. Ensure database exists

```bash
# Create database
mysql -u root -p
CREATE DATABASE neverland_portfolio;
```

#### CORS errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
Update `backend/config/cors.php`:
```php
'allowed_origins' => [
    'http://localhost:5173',
    env('FRONTEND_URL', 'http://localhost:5173'),
],
```

#### Docker containers won't start

**Solution**:
```bash
# Check logs
docker compose logs

# Rebuild containers
docker compose down
docker compose build --no-cache
docker compose up -d
```

See [Troubleshooting Guide](TROUBLESHOOTING.md) for more solutions.

---

## 🤝 Contributing

### How can I contribute?

**Ways to contribute:**
- 🐛 Report bugs
- ✨ Suggest features
- 📝 Improve documentation
- 🔧 Submit pull requests
- 🌐 Translate to other languages
- ⭐ Star the repository

See [Contributing Guide](../CONTRIBUTING.md) for detailed process.

### What should I know before contributing?

**Required:**
- Git basics
- JavaScript/TypeScript (for frontend)
- PHP/Laravel (for backend)
- Markdown (for documentation)

**Good to have:**
- React experience
- Docker knowledge
- Testing experience

### How do I submit a pull request?

1. **Fork** the repository
2. **Create branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** and commit
4. **Push**: `git push origin feature/amazing-feature`
5. **Open PR** on GitHub
6. **Respond to reviews**

See [Contributing Guide](../CONTRIBUTING.md#pull-request-process).

### Where can I get help?

| Type | Channel |
|------|---------|
| 🐛 **Bug Reports** | [GitHub Issues](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/issues) |
| ✨ **Feature Requests** | [GitHub Discussions](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/discussions) |
| 💬 **Questions** | [GitHub Discussions](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/discussions) |
| 📧 **Direct Contact** | muhammadisakiprananda88@gmail.com |

---

## 📚 Additional Questions

### Where can I find more documentation?

**Start Here**: [Documentation Guide](../DOCUMENTATION_GUIDE.md)

**Essential Docs**:
- [API Reference](API.md) - Complete API documentation
- [Features Guide](FEATURES_DOCUMENTATION.md) - All features explained
- [Deployment Guide](DEPLOYMENT.md) - Production deployment
- [Project Structure](STRUCTURE.md) - Codebase organization
- [Security Policy](SECURITY.md) - Security guidelines

### How do I stay updated?

- ⭐ **Star** the repository on GitHub
- 👁️ **Watch** for notifications
- 📰 Check [Changelog](CHANGELOG.md) for updates
- 🐦 Follow on social media (if available)

### Can I hire the developer?

Yes! For custom development, consulting, or support:
- **Email**: muhammadisakiprananda88@gmail.com
- **Website**: [portfolio.neverlandstudio.my.id](https://portfolio.neverlandstudio.my.id)

---

## 🆘 Still Have Questions?

If your question isn't answered here:

1. **Search** [existing issues](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/issues)
2. **Check** [documentation](../DOCUMENTATION_GUIDE.md)
3. **Ask** in [discussions](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/discussions)
4. **Contact** us via email

---

<div align="center">

**Made with ❤️ by [Neverland Studio](https://portfolio.neverlandstudio.my.id)**

[⬆ Back to Top](#-frequently-asked-questions-faq)

</div>
