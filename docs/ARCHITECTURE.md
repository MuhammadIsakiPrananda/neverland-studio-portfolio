# 📐 System Architecture

<div align="center">

**Comprehensive Architecture Documentation for Neverland Studio Portfolio**

Understanding the system design, components, and data flow.

---

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Component Architecture](#-component-architecture)
- [Data Flow](#-data-flow)
- [Database Schema](#-database-schema)
- [API Architecture](#-api-architecture)
- [Authentication Flow](#-authentication-flow)
- [Frontend Architecture](#-frontend-architecture)
- [Backend Architecture](#-backend-architecture)
- [Deployment Architecture](#-deployment-architecture)
- [Security Architecture](#-security-architecture)

---

## 🎯 Overview

Neverland Studio Portfolio follows a **modern full-stack architecture** with clear separation between frontend and backend, using industry-standard technologies and best practices.

### Key Principles

- **Separation of Concerns** - Clear boundaries between layers
- **RESTful API Design** - Standard HTTP methods and status codes
- **Stateless Authentication** - Token-based auth with Laravel Sanctum
- **Responsive Design** - Mobile-first approach
- **Scalability** - Designed to scale horizontally
- **Security First** - Multiple layers of security

---

## 🏗 System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Desktop    │  │    Tablet    │  │    Mobile    │      │
│  │   Browsers   │  │   Browsers   │  │   Browsers   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE LAYER                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  CDN • DDoS Protection • SSL/TLS • WAF • Caching     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │ Tunnel
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │              Nginx Reverse Proxy                    │     │
│  │                                                     │     │
│  │  • Static File Serving                             │     │
│  │  • Request Routing                                 │     │
│  │  • Load Balancing                                  │     │
│  │  • Compression (gzip)                              │     │
│  └──────────────┬──────────────────────┬──────────────┘     │
└─────────────────┼──────────────────────┼────────────────────┘
                  │                      │
        /         │                      │         /api/*
        │         ↓                      ↓         │
┌───────┴─────────────────┐  ┌─────────────────────┴──────────┐
│   APPLICATION LAYER     │  │   APPLICATION LAYER            │
│      (Frontend)         │  │      (Backend)                 │
│                         │  │                                │
│  ┌─────────────────┐   │  │  ┌──────────────────────────┐  │
│  │  React 19 + TS  │   │  │  │  Laravel 11 + PHP 8.2    │  │
│  │                 │   │  │  │                          │  │
│  │  • Vite 7       │   │  │  │  • REST API              │  │
│  │  • React Router │   │  │  │  • Sanctum Auth          │  │
│  │  • Axios        │   │  │  │  • Eloquent ORM          │  │
│  │  • Tailwind CSS │   │  │  │  • Validation            │  │
│  │  • Chart.js     │   │  │  │  • Mail Service          │  │
│  └─────────────────┘   │  │  └───────────┬──────────────┘  │
│         Port 5173       │  │              │  Port 8000      │
└─────────────────────────┘  └──────────────┼─────────────────┘
                                            │
                                            ↓
                          ┌─────────────────────────────────┐
                          │        DATA LAYER               │
                          │                                 │
                          │  ┌──────────────────────────┐   │
                          │  │    MySQL 8.0             │   │
                          │  │                          │   │
                          │  │  • Users                 │   │
                          │  │  • Contacts              │   │
                          │  │  • Enrollments           │   │
                          │  │  • Consultations         │   │
                          │  │  • Activity Logs         │   │
                          │  │  • Sessions              │   │
                          │  └──────────────────────────┘   │
                          │         Port 3306               │
                          └─────────────────────────────────┘
```

---

## 🧩 Component Architecture

### Frontend Components

```
src/
├── components/
│   ├── auth/                    # Authentication Components
│   │   ├── LoginForm.tsx        # Login interface
│   │   ├── RegisterForm.tsx     # Registration interface
│   │   ├── ForgotPassword.tsx   # Password recovery
│   │   └── TwoFactorAuth.tsx    # 2FA verification
│   │
│   ├── common/                  # Reusable UI Components
│   │   ├── Button.tsx           # Button component
│   │   ├── Input.tsx            # Input field
│   │   ├── Modal.tsx            # Modal dialog
│   │   ├── Card.tsx             # Card container
│   │   ├── Badge.tsx            # Badge/label
│   │   ├── Spinner.tsx          # Loading spinner
│   │   └── Toast.tsx            # Notification toast
│   │
│   ├── dashboard/               # Admin Dashboard Components
│   │   ├── DashboardLayout.tsx  # Dashboard layout
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   ├── Header.tsx           # Dashboard header
│   │   ├── StatCard.tsx         # Statistics card
│   │   ├── Chart.tsx            # Chart component
│   │   ├── Table.tsx            # Data table
│   │   └── RealtimeIndicator.tsx # Live indicator
│   │
│   ├── layout/                  # Layout Components
│   │   ├── Header.tsx           # Main header
│   │   ├── Footer.tsx           # Main footer
│   │   ├── Navigation.tsx       # Main navigation
│   │   └── Container.tsx        # Page container
│   │
│   └── pages/                   # Page-specific Components
│       ├── HomePage.tsx         # Landing page
│       ├── AboutPage.tsx        # About page
│       ├── ServicesPage.tsx     # Services page
│       ├── ContactPage.tsx      # Contact page
│       └── ...
│
├── contexts/                    # React Contexts
│   ├── AuthContext.tsx          # Authentication state
│   ├── LanguageContext.tsx      # i18n state
│   └── ThemeContext.tsx         # Theme state (if any)
│
├── hooks/                       # Custom Hooks
│   ├── useAuth.ts               # Authentication hook
│   ├── useAuthMonitor.ts        # Auth monitoring
│   ├── useDashboardAuth.ts      # Dashboard auth
│   ├── useRealtime.ts           # Real-time updates
│   ├── usePerformance.ts        # Performance tracking
│   └── useApi.ts                # API calls helper
│
├── services/                    # Service Layer
│   ├── apiService.ts            # Base API client
│   ├── authService.ts           # Auth operations
│   ├── dashboardService.ts      # Dashboard operations
│   ├── realtimeService.ts       # Real-time polling
│   └── ...
│
├── types/                       # TypeScript Types
│   ├── auth.types.ts            # Auth types
│   ├── user.types.ts            # User types
│   ├── api.types.ts             # API types
│   └── ...
│
└── utils/                       # Utility Functions
    ├── validators.ts            # Validation helpers
    ├── formatters.ts            # Data formatting
    ├── constants.ts             # App constants
    └── ...
```

### Backend Components

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/             # API Controllers
│   │   │       ├── AuthController.php
│   │   │       ├── UserController.php
│   │   │       ├── ContactController.php
│   │   │       ├── EnrollmentController.php
│   │   │       ├── ConsultationController.php
│   │   │       ├── DashboardController.php
│   │   │       └── ...
│   │   │
│   │   ├── Middleware/          # HTTP Middleware
│   │   │   ├── Authenticate.php
│   │   │   ├── CheckRole.php
│   │   │   ├── LogActivity.php
│   │   │   └── ...
│   │   │
│   │   └── Requests/            # Form Requests
│   │       ├── LoginRequest.php
│   │       ├── RegisterRequest.php
│   │       └── ...
│   │
│   ├── Models/                  # Eloquent Models
│   │   ├── User.php
│   │   ├── Contact.php
│   │   ├── Enrollment.php
│   │   ├── Consultation.php
│   │   ├── ActivityLog.php
│   │   └── ...
│   │
│   ├── Services/                # Business Logic
│   │   ├── AuthService.php
│   │   ├── UserService.php
│   │   ├── EmailService.php
│   │   └── ...
│   │
│   └── Providers/               # Service Providers
│       ├── AppServiceProvider.php
│       ├── AuthServiceProvider.php
│       └── RouteServiceProvider.php
│
├── database/
│   ├── migrations/              # Database Migrations
│   ├── seeders/                 # Database Seeders
│   └── factories/               # Model Factories
│
├── routes/
│   ├── api.php                  # API Routes
│   └── web.php                  # Web Routes
│
└── config/                      # Configuration Files
    ├── app.php
    ├── database.php
    ├── cors.php
    └── sanctum.php
```

---

## 🔄 Data Flow

### Request/Response Flow

```
┌────────────┐      1. User Action        ┌─────────────┐
│   Browser  │ ─────────────────────────→ │   React     │
│            │                             │  Component  │
└────────────┘                             └──────┬──────┘
                                                  │
                                                  │ 2. Dispatch Action
                                                  ↓
                                           ┌─────────────┐
                                           │   Service   │
                                           │   Layer     │
                                           └──────┬──────┘
                                                  │
                                                  │ 3. HTTP Request (Axios)
                                                  ↓
                                           ┌─────────────┐
                                           │  Laravel    │
                                           │   Route     │
                                           └──────┬──────┘
                                                  │
                                                  │ 4. Middleware
                                                  ↓
                                           ┌─────────────┐
                                           │ Controller  │
                                           └──────┬──────┘
                                                  │
                                                  │ 5. Business Logic
                                                  ↓
                                           ┌─────────────┐
                                           │   Model     │
                                           │ (Eloquent)  │
                                           └──────┬──────┘
                                                  │
                                                  │ 6. Database Query
                                                  ↓
                                           ┌─────────────┐
                                           │   MySQL     │
                                           └──────┬──────┘
                                                  │
                                                  │ 7. Result Set
                                                  ↓
┌────────────┐      11. Update UI        ┌─────────────┐
│   Browser  │ ←───────────────────────  │   React     │
│            │                            │  Component  │
└────────────┘                            └──────┬──────┘
                                                 ↑
                                                 │ 10. State Update
                                          ┌──────┴──────┐
                                          │   Service   │
                                          │   Layer     │
                                          └──────┬──────┘
                                                 ↑
                                                 │ 9. HTTP Response
                                          ┌──────┴──────┐
                                          │  Laravel    │
                                          │   JSON      │
                                          │  Response   │
                                          └─────────────┘
                                                 ↑
                                                 │ 8. Transform Data
```

### Authentication Flow

```
┌──────────┐                                          ┌──────────┐
│  Client  │                                          │  Server  │
└─────┬────┘                                          └────┬─────┘
      │                                                    │
      │  1. GET /sanctum/csrf-cookie                     │
      │ ─────────────────────────────────────────────→   │
      │                                                    │
      │  2. Set-Cookie: XSRF-TOKEN                       │
      │ ←─────────────────────────────────────────────   │
      │                                                    │
      │  3. POST /api/login (credentials + CSRF)         │
      │ ─────────────────────────────────────────────→   │
      │                                                    │
      │                                       4. Validate │
      │                                     5. Create     │
      │                                        Session    │
      │                                                    │
      │  6. Set-Cookie: laravel_session                  │
      │     + User Data (JSON)                           │
      │ ←─────────────────────────────────────────────   │
      │                                                    │
      │  7. Store user data in state                     │
      │                                                    │
      │  8. Authenticated requests                       │
      │     (with cookies automatically)                 │
      │ ─────────────────────────────────────────────→   │
      │                                                    │
      │  9. Verify session                               │
      │                                       10. Process │
      │                                                    │
      │  11. Response with data                          │
      │ ←─────────────────────────────────────────────   │
      │                                                    │
```

---

## 🗄 Database Schema

### Entity Relationship Diagram

```
┌─────────────────────┐
│       users         │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ email (unique)      │
│ password            │
│ role (enum)         │
│ email_verified_at   │
│ two_factor_secret   │
│ google_id           │
│ github_id           │
│ timestamps          │
└──────────┬──────────┘
           │
           │ 1:N
           ↓
┌─────────────────────┐       ┌─────────────────────┐
│   activity_logs     │       │     sessions        │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │       │ id (PK)             │
│ user_id (FK)        │       │ user_id (FK)        │
│ action              │       │ ip_address          │
│ description         │       │ user_agent          │
│ ip_address          │       │ device_type         │
│ user_agent          │       │ browser             │
│ timestamps          │       │ location            │
└─────────────────────┘       │ last_activity       │
                              │ timestamps          │
                              └─────────────────────┘
           │
           │ 1:N
           ↓
┌─────────────────────┐       ┌─────────────────────┐
│     contacts        │       │    enrollments      │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │       │ id (PK)             │
│ user_id (FK, null)  │       │ user_id (FK, null)  │
│ name                │       │ name                │
│ email               │       │ email               │
│ subject             │       │ phone               │
│ message             │       │ course              │
│ is_archived         │       │ status              │
│ timestamps          │       │ timestamps          │
└─────────────────────┘       └─────────────────────┘

           │
           │ 1:N
           ↓
┌─────────────────────┐       ┌─────────────────────┐
│   consultations     │       │  newsletter_subs    │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │       │ id (PK)             │
│ user_id (FK, null)  │       │ email (unique)      │
│ name                │       │ is_active           │
│ email               │       │ timestamps          │
│ phone               │       └─────────────────────┘
│ service             │
│ preferred_date      │
│ status              │
│ timestamps          │
└─────────────────────┘

┌────────────────────────┐
│ maintenance_settings   │
├────────────────────────┤
│ id (PK)                │
│ is_enabled             │
│ message                │
│ allowed_ips (JSON)     │
│ timestamps             │
└────────────────────────┘
```

### Key Tables

#### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    email_verified_at TIMESTAMP NULL,
    two_factor_secret TEXT NULL,
    google_id VARCHAR(255) NULL,
    github_id VARCHAR(255) NULL,
    profile_photo_path VARCHAR(2048) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);
```

#### Activity Logs Table
```sql
CREATE TABLE activity_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NULL,
    action VARCHAR(255) NOT NULL,
    description TEXT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);
```

---

## 📡 API Architecture

### RESTful API Design

**Base URL**: `https://yourdomain.com/api`

**Standards**:
- Uses standard HTTP methods (GET, POST, PUT, DELETE)
- RESTful resource naming
- Consistent JSON response format
- Proper HTTP status codes
- API versioning ready

### API Response Format

```json
// Success Response
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": ["validation error"]
  }
}

// Paginated Response
{
  "success": true,
  "data": [...],
  "meta": {
    "current_page": 1,
    "total": 100,
    "per_page": 15,
    "last_page": 7
  }
}
```

### API Endpoints Structure

```
/api
├── /auth
│   ├── POST   /login
│   ├── POST   /register
│   ├── POST   /logout
│   ├── GET    /user
│   ├── POST   /forgot-password
│   ├── POST   /reset-password
│   ├── POST   /verify-email
│   └── /oauth
│       ├── GET  /google
│       ├── GET  /google/callback
│       ├── GET  /github
│       └── GET  /github/callback
│
├── /users
│   ├── GET    /              # List users
│   ├── POST   /              # Create user
│   ├── GET    /{id}          # Get user
│   ├── PUT    /{id}          # Update user
│   └── DELETE /{id}          # Delete user
│
├── /dashboard
│   ├── GET    /stats         # Dashboard statistics
│   ├── GET    /analytics     # Analytics data
│   └── GET    /activities    # Recent activities
│
├── /contacts
│   ├── GET    /              # List contacts
│   ├── POST   /              # Create contact
│   ├── GET    /{id}          # Get contact
│   └── DELETE /{id}          # Delete contact
│
├── /enrollments
│   ├── GET    /              # List enrollments
│   ├── POST   /              # Create enrollment
│   ├── PUT    /{id}          # Update enrollment
│   └── DELETE /{id}          # Delete enrollment
│
├── /consultations
│   ├── GET    /              # List consultations
│   ├── POST   /              # Book consultation
│   ├── PUT    /{id}          # Update consultation
│   └── DELETE /{id}          # Cancel consultation
│
└── /maintenance
    ├── GET    /status        # Check maintenance status
    ├── POST   /enable        # Enable maintenance mode
    └── POST   /disable       # Disable maintenance mode
```

---

## 🔐 Authentication Flow

### Sanctum Cookie-Based Authentication

```
Client                          Server
  │                               │
  │ 1. GET /sanctum/csrf-cookie  │
  │────────────────────────────→ │
  │                               │
  │ 2. XSRF-TOKEN cookie         │
  │←──────────────────────────── │
  │                               │
  │ 3. POST /api/login           │
  │    (credentials + CSRF)       │
  │────────────────────────────→ │
  │                               │
  │                  4. Validate  │
  │               5. CreateToken │
  │                               │
  │ 6. laravel_session cookie    │
  │←──────────────────────────── │
  │                               │
  │ 7. Subsequent requests        │
  │    (cookies sent auto)        │
  │────────────────────────────→ │
  │                               │
  │           8. Verify session   │
  │                               │
  │ 9. Response                   │
  │←──────────────────────────── │
```

---

## 🎨 Frontend Architecture

### Component Hierarchy

```
App
├── Router
│   ├── Public Routes
│   │   ├── HomePage
│   │   ├── AboutPage
│   │   ├── ServicesPage
│   │   ├── ContactPage
│   │   └── AuthPages
│   │       ├── LoginPage
│   │       └── RegisterPage
│   │
│   └── Protected Routes
│       └── DashboardLayout
│           ├── Sidebar
│           ├── Header
│           └── Content
│               ├── Overview
│               ├── Users
│               ├── Contacts
│               ├── Enrollments
│               ├── Consultations
│               └── Settings
```

### State Management

```
React Context API
├── AuthContext        # Authentication state
│   ├── user
│   ├── isAuthenticated
│   ├── login()
│   ├── logout()
│   └── updateUser()
│
└── LanguageContext    # Internationalization
    ├── language
    ├── translations
    └── setLanguage()
```

---

## 🖥 Backend Architecture

### MVC Pattern

```
Request → Route → Middleware → Controller → Service → Model → Database
                                    ↓
                                Response
```

### Layer Responsibilities

1. **Routes** (`routes/api.php`)
   - Define endpoints
   - Group related routes
   - Apply middleware

2. **Middleware**
   - Authentication check
   - Authorization check
   - Activity logging
   - Rate limiting

3. **Controllers**
   - Handle HTTP requests
   - Validate input
   - Call services
   - Return responses

4. **Services** (Business Logic)
   - Complex operations
   - External API calls
   - Email sending
   - File processing

5. **Models**
   - Database interaction
   - Relationships
   - Data casting
   - Accessors/Mutators

6. **Database**
   - Store data
   - Enforce constraints
   - Indexing

---

## 🚀 Deployment Architecture

### Docker Container Architecture

```
┌─────────────────────────────────────────────────┐
│              Docker Host (VPS/Cloud)             │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │         Cloudflare Tunnel                   │ │
│  │         (cloudflared daemon)                │ │
│  └──────────────────┬─────────────────────────┘ │
│                     │                            │
│                     ↓                            │
│  ┌────────────────────────────────────────────┐ │
│  │         Nginx Container                     │ │
│  │         Port 80 → localhost:80             │ │
│  └─────────┬──────────────────────┬───────────┘ │
│            │                      │              │
│            ↓                      ↓              │
│  ┌──────────────────┐  ┌──────────────────────┐ │
│  │   Frontend       │  │   Backend            │ │
│  │   Container      │  │   Container          │ │
│  │   (Node + Vite)  │  │   (PHP-FPM + Laravel)│ │
│  │   Port 5173      │  │   Port 8000          │ │
│  └──────────────────┘  └─────────┬────────────┘ │
│                                  │               │
│                                  ↓               │
│                        ┌──────────────────────┐  │
│                        │   MySQL Container    │  │
│                        │   Port 3307:3306     │  │
│                        │   Volume: db_data    │  │
│                        └──────────────────────┘  │
│                                                  │
│  Networks:                                       │
│  • app-network (bridge)                         │
│                                                  │
│  Volumes:                                        │
│  • db_data (MySQL data persistence)             │
│  • backend_storage (uploads, logs)              │
└─────────────────────────────────────────────────┘
```

---

## 🔒 Security Architecture

### Security Layers

```
┌────────────────────────────────────────────┐
│  Layer 1: Network Security                 │
│  • Cloudflare DDoS Protection              │
│  • WAF (Web Application Firewall)          │
│  • Rate Limiting                           │
└──────────────────┬─────────────────────────┘
                   │
                   ↓
┌────────────────────────────────────────────┐
│  Layer 2: Transport Security               │
│  • HTTPS/TLS 1.3                           │
│  • Certificate Management                  │
└──────────────────┬─────────────────────────┘
                   │
                   ↓
┌────────────────────────────────────────────┐
│  Layer 3: Application Security             │
│  • CSRF Protection                         │
│  • XSS Prevention                          │
│  • SQL Injection Protection                │
│  • Input Validation                        │
│  • Output Encoding                         │
└──────────────────┬─────────────────────────┘
                   │
                   ↓
┌────────────────────────────────────────────┐
│  Layer 4: Authentication & Authorization   │
│  • Laravel Sanctum                         │
│  • Bcrypt Password Hashing                 │
│  • Two-Factor Authentication               │
│  • OAuth (Google, GitHub)                  │
│  • Role-Based Access Control               │
└──────────────────┬─────────────────────────┘
                   │
                   ↓
┌────────────────────────────────────────────┐
│  Layer 5: Data Security                    │
│  • Encrypted Database                      │
│  • Secure Session Management               │
│  • Activity Logging                        │
└────────────────────────────────────────────┘
```

---

<div align="center">

**Made with ❤️ by [Neverland Studio](https://portfolio.neverlandstudio.my.id)**

[⬆ Back to Top](#-system-architecture) • [📖 Documentation](../DOCUMENTATION_GUIDE.md)

</div>
