# 📁 Project Structure

Dokumentasi lengkap struktur proyek Neverland Studio Portfolio.

---

## 🗂️ Root Directory Structure

```
neverlandstudio-portofolio/
├── 📄 README.md                    # Documentation utama
├── 📄 LICENSE                      # MIT License
├── 📂 docs/                        # 📚 All documentation files
├── 📂 src/                         # ⚛️ React frontend source code
├── 📂 backend/                     # 🐘 Laravel backend API
├── 📂 nginx/                       # 🌐 Nginx configuration
├── 📂 public/                      # 📦 Public assets
├── 🐳 docker-compose.yml           # Development Docker setup
├── 🐳 docker-compose.prod.yml     # Production Docker setup
├── 🐳 Dockerfile.frontend          # Frontend Docker image
└── ⚙️ Configuration files          # Vite, TypeScript, Tailwind, etc.
```

---

## 📚 Documentation Directory (`docs/`)

```
docs/
├── 📖 README.md                            # Documentation index
├── 🚀 CLOUDFLARE_TUNNEL_DEPLOYMENT.md     # Production deployment guide
├── 🚀 PRODUCTION_DEPLOYMENT.md            # Alternative deployment
├── ✅ PRODUCTION_READY.md                 # Production checklist
├── ✅ VERIFICATION_COMPLETE.md            # Final verification
├── 🐳 README.DOCKER.md                    # Docker guide
├── ⚡ REALTIME_ANALYTICS.md               # Real-time features (EN)
├── ⚡ REALTIME_ANALYTICS_ID.md            # Real-time features (ID)
├── 🔐 SECURITY.md                         # Security policy
├── 🔐 OAUTH_SETUP.md                      # OAuth configuration
├── 🔐 OAUTH_QUICKSTART.md                 # OAuth quick start
├── 🔌 API.md                              # API documentation
├── 🤝 CONTRIBUTING.md                     # Contribution guide
├── 📝 CODE_OF_CONDUCT.md                  # Community guidelines
├── 📝 CHANGELOG.md                        # Version history
└── 📁 STRUCTURE.md                        # This file
```

---

## ⚛️ Frontend Structure (`src/`)

```
src/
├── 📄 main.tsx                    # Application entry point
├── 📄 App.tsx                     # Root component
├── 🎨 App.css                     # Global styles
├── 🎨 index.css                   # Base Tailwind styles
├── 📂 components/                 # React components
│   ├── auth/                      # Authentication components
│   ├── common/                    # Reusable UI components
│   ├── dashboard/                 # Admin dashboard components
│   │   ├── Analytics.tsx          # Real-time analytics
│   │   ├── DashboardHome.tsx      # Dashboard overview
│   │   ├── UserManagement.tsx     # User CRUD
│   │   └── ...
│   ├── layout/                    # Layout components
│   ├── modals/                    # Modal dialogs
│   └── pages/                     # Page components
├── 📂 services/                   # API service layer
│   ├── apiService.ts              # Base API client
│   ├── authService.ts             # Authentication API
│   ├── analyticsService.ts        # Analytics API
│   ├── dashboardService.ts        # Dashboard API
│   ├── realtimeService.ts         # Real-time polling
│   └── ...
├── 📂 contexts/                   # React contexts
│   └── LanguageContext.tsx        # Multi-language support
├── 📂 hooks/                      # Custom React hooks
│   ├── useAuthMonitor.ts          # Auth state monitoring
│   ├── useDashboardAuth.ts        # Dashboard authentication
│   └── useScrollReveal.ts         # Scroll animations
├── 📂 types/                      # TypeScript type definitions
├── 📂 utils/                      # Utility functions
├── 📂 assets/                     # Static assets (images, icons)
└── 📂 data/                       # Mock data for development
```

---

## 🐘 Backend Structure (`backend/`)

```
backend/
├── 📄 artisan                     # Laravel CLI
├── 📄 composer.json               # PHP dependencies
├── 🐳 Dockerfile                  # Backend Docker image
├── 📂 app/                        # Application code
│   ├── Http/
│   │   ├── Controllers/           # API controllers
│   │   │   ├── Api/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── AnalyticsController.php
│   │   │   │   └── ...
│   │   └── Middleware/            # HTTP middleware
│   ├── Models/                    # Eloquent models
│   │   ├── User.php
│   │   └── ...
│   ├── Services/                  # Business logic
│   └── Providers/                 # Service providers
├── 📂 config/                     # Configuration files
│   ├── app.php
│   ├── auth.php
│   ├── cors.php                   # CORS configuration
│   ├── database.php
│   └── ...
├── 📂 database/
│   ├── migrations/                # Database migrations
│   ├── seeders/                   # Database seeders
│   └── factories/                 # Model factories
├── 📂 routes/
│   ├── api.php                    # API routes
│   ├── web.php                    # Web routes
│   └── console.php                # Console commands
├── 📂 storage/                    # Storage (logs, cache, uploads)
│   ├── app/
│   ├── framework/
│   └── logs/
├── 📂 resources/                  # Views and assets
├── 📂 tests/                      # PHPUnit tests
│   ├── Feature/
│   └── Unit/
└── 📂 vendor/                     # Composer dependencies
```

---

## 🌐 Nginx Structure (`nginx/`)

```
nginx/
├── 📄 nginx.conf                  # Main Nginx configuration
├── 📂 conf.d/                     # Site configurations
│   ├── default.conf               # Development/local
│   ├── cloudflare.conf            # Cloudflare Tunnel (Production)
│   └── production.conf            # Alternative SSL setup
└── 📂 ssl/                        # SSL certificates (if needed)
```

---

## ⚙️ Configuration Files

### Frontend Configuration

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build configuration |
| `tsconfig.json` | TypeScript compiler options |
| `tsconfig.app.json` | App-specific TypeScript config |
| `tsconfig.node.json` | Node-specific TypeScript config |
| `tailwind.config.js` | Tailwind CSS configuration |
| `postcss.config.js` | PostCSS configuration |
| `eslint.config.js` | ESLint rules |
| `package.json` | NPM dependencies & scripts |

### Backend Configuration

| File | Purpose |
|------|---------|
| `composer.json` | PHP dependencies |
| `.env.example` | Environment variables template |
| `phpunit.xml` | PHPUnit test configuration |

### Environment Files

| File | Purpose |
|------|---------|
| `.env.development` | Development environment (localhost) |
| `.env.production` | Production environment (domain) |
| `.env.local.example` | Template for local overrides |
| `backend/.env` | Backend development config |
| `backend/.env.production` | Backend production config |
| `backend/.env.example` | Backend config template |

### Docker Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Development containers |
| `docker-compose.prod.yml` | Production containers |
| `Dockerfile.frontend` | Frontend build image |
| `backend/Dockerfile` | Backend runtime image |
| `.dockerignore` | Docker build exclusions |

---

## 🔑 Key Directories Explained

### `/src/components/`

Organized by feature and function:
- **`auth/`** - Login, register, OAuth components
- **`common/`** - Buttons, inputs, cards, notifications
- **`dashboard/`** - Admin panel components (Analytics, Users, etc.)
- **`layout/`** - Header, footer, sidebar, navigation
- **`modals/`** - Popup dialogs and overlays
- **`pages/`** - Full page components (Home, About, Contact, etc.)

### `/src/services/`

API communication layer with environment variable support:
- All services use `VITE_API_URL` for flexible deployment
- Fallback to localhost for development
- Centralized error handling

### `/backend/app/Http/Controllers/Api/`

RESTful API endpoints:
- **`AuthController`** - Authentication (login, register, logout)
- **`DashboardController`** - Dashboard statistics & data
- **`AnalyticsController`** - Real-time analytics data
- **`UserController`** - User management CRUD

### `/docs/`

All documentation in one place:
- Deployment guides
- Feature documentation
- API references
- Security policies
- Contributing guidelines

---

## 📊 File Size Guidelines

- **Components**: Keep under 300 lines (split if larger)
- **Services**: Single responsibility, 150-200 lines max
- **Controllers**: Thin controllers, delegate to services
- **Documentation**: Clear sections with table of contents

---

## 🎨 Naming Conventions

### Frontend (TypeScript/React)

```
PascalCase     - Components, Types, Interfaces
camelCase      - Variables, functions, hooks
kebab-case     - File names, CSS classes
UPPER_CASE     - Constants, environment variables
```

### Backend (PHP/Laravel)

```
PascalCase     - Classes, Models, Controllers
camelCase      - Methods, variables
snake_case     - Database tables, columns, config keys
kebab-case     - Route names
```

### Files & Directories

```
kebab-case     - Regular files (api-service.ts)
PascalCase     - React components (Analytics.tsx)
lowercase      - Directories (components/, services/)
UPPERCASE      - Documentation (README.md, LICENSE)
```

---

## 🔍 Quick Navigation

| Need to... | Go to... |
|------------|----------|
| Add new API endpoint | `backend/routes/api.php` + `backend/app/Http/Controllers/Api/` |
| Create new component | `src/components/` (choose appropriate subfolder) |
| Add new service | `src/services/` |
| Configure environment | `.env.development` or `.env.production` |
| Update Docker setup | `docker-compose.yml` or `docker-compose.prod.yml` |
| Modify Nginx config | `nginx/conf.d/` |
| Add database migration | `backend/database/migrations/` |
| Write documentation | `docs/` |
| Configure CORS | `backend/config/cors.php` |
| Update dependencies | `package.json` or `composer.json` |

---

## 🚀 Deployment Checklist

Before deploying, ensure:

- [ ] All files in correct directories
- [ ] Environment variables configured
- [ ] Documentation updated in `docs/`
- [ ] Docker configurations tested
- [ ] No sensitive data in repository
- [ ] `.gitignore` properly configured
- [ ] Production URLs configured
- [ ] SSL/Cloudflare setup complete

---

## 📝 Maintenance

### Regular Updates

- **Weekly**: Check for security updates in dependencies
- **Monthly**: Review and clean up unused files
- **Quarterly**: Audit project structure and refactor if needed

### Documentation

- Update `CHANGELOG.md` for every release
- Keep `docs/` synchronized with code changes
- Document all major architectural decisions

---

**[← Back to Main README](../README.md)** | **[📚 All Documentation](README.md)**
