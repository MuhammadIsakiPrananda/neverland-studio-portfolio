# 🎨 Neverland Studio Portfolio

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=vercel)](https://neverlandstudio.my.id)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![License MIT](https://img.shields.io/github/license/MuhammadIsakiPrananda/neverland-studio-portfolio?style=for-the-badge)](LICENSE)

**Full-Stack Modern Portfolio Platform with React 19, TypeScript, Express, OAuth, 2FA & AI Chatbot**

[🚀 Live Demo](https://neverlandstudio.my.id) • [📖 Documentation](#-table-of-contents) • [🐞 Report Bug](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/issues)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Quick Start](#-quick-start)
- [Development](#-development)
- [Docker Deployment](#-docker-deployment)
- [Project Structure](#-project-structure)
- [Environment Variables](#️-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#️-contact)

---

## 🎯 Overview

**Neverland Studio** is a production-ready, full-stack portfolio platform built with cutting-edge technologies. It features a modern React 19 frontend with TypeScript, a robust Express backend with MySQL, complete authentication system with OAuth and 2FA, user dashboard, and an AI-powered chatbot assistant.

### ✨ Why Neverland Studio?

- ✅ **Production Ready** - Enterprise-grade architecture with best practices
- ✅ **Type Safe** - Full TypeScript implementation for both frontend and backend
- ✅ **Secure** - JWT authentication, OAuth 2.0, 2FA, reCAPTCHA, rate limiting
- ✅ **Modern Stack** - React 19, Vite, Express, Sequelize ORM
- ✅ **Docker Ready** - Multi-stage builds and docker-compose configuration
- ✅ **Premium UI/UX** - Responsive design with smooth animations

---

## ✨ Key Features

### 🔐 Authentication & Security

- **Multiple Login Methods**
  - Email/Password with JWT
  - Google OAuth 2.0
  - GitHub OAuth
- **Two-Factor Authentication (2FA)**
  - Time-based OTP (TOTP)
  - QR code generation
  - Backup codes
- **Security Features**
  - Google reCAPTCHA v3
  - Password hashing with bcrypt
  - Rate limiting on API endpoints
  - Session management
  - XSS & CSRF protection

### 👤 User Dashboard

- **Profile Management**
  - Update name, email, avatar
  - Username changes (3 per month limit)
  - Custom bio and social links
- **Account Settings**
  - Security settings (2FA, password)
  - API key management
  - Appearance customization
  - Notification preferences
- **Activity & Analytics**
  - Account activity log
  - Real-time statistics
  - Usage insights

### 🤖 Additional Features

- **AI Chatbot Assistant** - Interactive bot to answer visitor questions
- **Contact Forms** - reCAPTCHA protected contact and consultation forms
- **Toast Notifications** - Real-time feedback for user actions
- **Responsive Design** - Mobile-first approach, works on all devices
- **Modal System** - Auth, video player, dashboard, confirmation dialogs

---

## 🛠️ Tech Stack

### Frontend

| Technology       | Version | Purpose                       |
| ---------------- | ------- | ----------------------------- |
| React            | 19.1.1  | UI library                    |
| TypeScript       | 5.9     | Type-safe JavaScript          |
| Vite             | 7.1.14  | Fast build tool with HMR      |
| Tailwind CSS     | 3.3     | Utility-first CSS framework   |
| Framer Motion    | 12.23   | Animation library             |
| React Router DOM | 7.9     | Client-side routing           |
| Axios            | 1.13    | HTTP client                   |
| Recharts         | 3.4     | Charts and data visualization |
| Lucide React     | 0.552   | Modern icon library           |

### Backend

| Technology             | Version  | Purpose                       |
| ---------------------- | -------- | ----------------------------- |
| Node.js                | ≥18.0.0  | JavaScript runtime            |
| Express                | 4.21     | Web framework                 |
| Sequelize              | 6.37     | ORM for SQL databases         |
| MySQL2 / MariaDB       | 3.15     | Database drivers              |
| Passport.js            | 0.7      | Authentication middleware     |
| JWT                    | 9.0      | Token-based authentication    |
| bcryptjs               | 2.4      | Password hashing              |
| Helmet                 | 8.0      | Security middleware           |
| Express Rate Limit     | 7.4      | Rate limiting                 |
| Winston                | 3.17     | Logging                       |
| express-validator      | 7.0      | Request validation            |

### DevOps

- **Docker** - Containerization with multi-stage builds
- **Nginx** - Production web server and reverse proxy
- **Docker Compose** - Multi-container orchestration

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

```bash
Node.js >= 18.x    # Check: node --version
npm >= 9.x         # Check: npm --version
MySQL/MariaDB      # For backend database
Docker (optional)  # For containerized deployment
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio.git
cd neverland-studio-portfolio

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd neverland-backend
npm install
cd ..

# 4. Configure environment variables (see below)
cp .env.example .env
cp neverland-backend/.env.example neverland-backend/.env
# Edit both .env files with your configuration

# 5. Setup database (from neverland-backend directory)
cd neverland-backend
npm run db:migrate
npm run db:seed  # Optional: seed with sample data
cd ..

# 6. Start development servers
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd neverland-backend
npm run dev
```

Your application will be running at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

---

## 💻 Development

### Available Scripts

#### Frontend

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `npm run dev`        | Start dev server with HMR      |
| `npm run build`      | Build for production           |
| `npm run preview`    | Preview production build       |
| `npm run lint`       | Run ESLint                     |
| `npm run test`       | Run tests with Vitest          |

#### Backend

| Command                       | Description                  |
| ----------------------------- | ---------------------------- |
| `npm run dev`                 | Start dev server with nodemon|
| `npm run start`               | Start production server      |
| `npm run db:migrate`          | Run database migrations      |
| `npm run db:migrate:undo`     | Rollback last migration      |
| `npm run db:seed`             | Seed database                |
| `npm run db:reset`            | Reset database completely    |
| `npm run lint`                | Run ESLint                   |

### Development Workflow

1. **Frontend Development** - Changes are reflected instantly with Hot Module Replacement (HMR)
2. **Backend Development** - Server auto-restarts on file changes with nodemon
3. **Database Changes** - Create migrations for schema changes
4. **Type Safety** - TypeScript will catch errors during development

---

## 🐳 Docker Deployment

### Quick Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Docker Services

The `docker-compose.yml` includes:

- **Frontend** - React app served by Nginx (port 80)
- **Backend** - Express API server (port 3000)
- **Database** - MySQL/MariaDB database (port 3306)

### Manual Docker Build

```bash
# Build frontend
docker build -t neverland-frontend .

# Build backend
docker build -t neverland-backend ./neverland-backend

# Run frontend
docker run -d -p 80:80 neverland-frontend

# Run backend
docker run -d -p 3000:3000 neverland-backend
```

### Production Deployment

For production deployment:

1. **Set environment variables** - Update `.env` files with production values
2. **Configure CORS** - Update allowed origins in backend
3. **Setup SSL** - Configure HTTPS with certificates
4. **Update OAuth callbacks** - Set production callback URLs
5. **Database** - Configure production database connection
6. **Build & Deploy** - Run `docker-compose up -d --build`

---

## 📂 Project Structure

```
neverland-studio-portfolio/
│
├── 📁 src/                          # Frontend source code
│   ├── 📄 main.tsx                  # App entry point
│   ├── 📄 App.tsx                   # Root component
│   │
│   ├── 📁 features/                 # Feature modules
│   │   ├── 📁 auth/                 # Authentication
│   │   │   ├── 📁 components/       # Login, Register, etc.
│   │   │   ├── 📁 context/          # Auth context
│   │   │   ├── 📁 hooks/            # Auth hooks
│   │   │   └── 📁 services/         # API services
│   │   │
│   │   ├── 📁 dashboard/            # User dashboard
│   │   │   ├── 📁 components/       # Dashboard tabs
│   │   │   └── 📁 pages/            # Dashboard pages
│   │   │
│   │   └── 📁 landing/              # Landing page
│   │       └── 📁 components/       # Sections
│   │
│   ├── 📁 shared/                   # Shared utilities
│   │   ├── 📁 components/           # Reusable UI components
│   │   ├── 📁 hooks/                # Custom hooks
│   │   ├── 📁 utils/                # Helper functions
│   │   └── 📁 types/                # TypeScript types
│   │
│   └── 📁 styles/                   # Global styles
│
├── 📁 neverland-backend/            # Backend API
│   ├── 📄 server.js                 # Server entry point
│   ├── 📁 config/                   # Configuration
│   ├── 📁 controllers/              # Route controllers
│   ├── 📁 models/                   # Database models
│   ├── 📁 routes/                   # API routes
│   ├── 📁 services/                 # Business logic
│   ├── 📁 middleware/               # Custom middleware
│   ├── 📁 migrations/               # Database migrations
│   ├── 📁 seeders/                  # Database seeders
│   └── 📁 utils/                    # Utilities
│
├── 📄 docker-compose.yml            # Docker Compose config
├── 📄 Dockerfile                    # Frontend Dockerfile
├── 📄 nginx.conf                    # Nginx configuration
├── 📄 vite.config.ts                # Vite config
├── 📄 tailwind.config.js            # Tailwind config
└── 📄 package.json                  # Dependencies & scripts
```

---

## ⚙️ Environment Variables

### Frontend (`.env`)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Google reCAPTCHA v3
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key

# OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id

# App Configuration
VITE_APP_NAME=Neverland Studio
VITE_APP_URL=http://localhost:5173
VITE_ENABLE_CHATBOT=true
```

### Backend (`neverland-backend/.env`)

```env
# Server
NODE_ENV=development
PORT=3000
HOST=localhost

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=neverland_db
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=30d

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

# reCAPTCHA
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Session
SESSION_SECRET=your_session_secret
```

### Getting API Keys

1. **Google reCAPTCHA**: [console.cloud.google.com/recaptcha](https://console.cloud.google.com/recaptcha)
2. **Google OAuth**: [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
3. **GitHub OAuth**: [github.com/settings/developers](https://github.com/settings/developers)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### How to Contribute

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/neverland-studio-portfolio.git

# 3. Create a feature branch
git checkout -b feature/amazing-feature

# 4. Make your changes and commit
git commit -m "feat: add amazing feature"

# 5. Push to your fork
git push origin feature/amazing-feature

# 6. Open a Pull Request
```

### Commit Convention

Follow [Conventional Commits](https://conventionalcommits.org):

```
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style changes (formatting)
refactor: Code refactoring
test:     Add or update tests
chore:    Build process or dependency updates
```

### Reporting Bugs

Open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node version)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License
Copyright (c) 2024 Muhammad Isaki Prananda

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## ✉️ Contact

**Muhammad Isaki Prananda**

- 📧 Email: [arlianto032@gmail.com](mailto:arlianto032@gmail.com)
- 🌐 Website: [neverlandstudio.my.id](https://neverlandstudio.my.id)
- 💼 GitHub: [@MuhammadIsakiPrananda](https://github.com/MuhammadIsakiPrananda)

**Project Repository**  
[github.com/MuhammadIsakiPrananda/neverland-studio-portfolio](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio)

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ by Muhammad Isaki Prananda**

[⬆ Back to Top](#-neverland-studio-portfolio)

</div>
