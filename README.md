# 🌟 Neverland Studio Portfolio

Modern, full-stack portfolio website for Neverland Studio - showcasing IT services, learning programs, and digital solutions.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?logo=laravel)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)

## ✨ Features

- 🎨 **Modern UI/UX** - Sleek design with dark theme and smooth animations
- 🌐 **Bilingual** - Full support for English and Indonesian
- 📱 **Responsive** - Perfect display on all devices (mobile, tablet, desktop)
- ⚡ **Fast Performance** - Optimized with Vite and React 19
- 🔐 **Admin Dashboard** - Complete CMS for managing content
- 💳 **IT Learning** - Course enrollment and management system
- 🛠️ **IT Solutions** - Consultation and project inquiry forms
- 📊 **Analytics** - Real-time visitor tracking and insights

## 🚀 Tech Stack

### Frontend
- **Framework:** React 19.2 + TypeScript
- **Build Tool:** Vite (Rolldown)
- **Routing:** React Router DOM v7
- **Charts:** Chart.js + Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast

### Backend
- **Framework:** Laravel 11
- **Database:** MySQL 8.0
- **Authentication:** Laravel Sanctum
- **API:** RESTful API

### DevOps
- **Containerization:** Docker + Docker Compose
- **Web Server:** Nginx (production)
- **Deployment:** Cloudflare Tunnel ready

## 📦 Quick Start

### Development

```bash
# Clone repository
git clone https://github.com/your-username/neverlandstudio-portfolio.git
cd neverlandstudio-portfolio

# Frontend
npm install
npm run dev
# Access at http://localhost:5173

# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
# Access at http://localhost:8000
```

### Docker Deployment

```bash
# Development
docker-compose up -d

# Production (with Nginx)
docker-compose --profile production up -d
```

## 📖 Documentation

- **[Deployment Guide](DOCKER_DEPLOYMENT.md)** - Complete Docker deployment instructions
- **[API Documentation](docs/API.md)** - API endpoints and usage
- **[Project Structure](docs/STRUCTURE.md)** - Code organization
- **[Security](docs/SECURITY.md)** - Security best practices
- **[OAuth Setup](docs/OAUTH_SETUP.md)** - Social login configuration

## 🌐 Production Deployment

Configured for deployment at: `portfolio.neverlandstudio.my.id`

See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for detailed deployment instructions with Cloudflare Tunnel.

## 📂 Project Structure

```
neverlandstudio-portfolio/
├── src/                    # Frontend React source
│   ├── components/         # React components
│   ├── contexts/           # Context providers
│   ├── services/           # API services
│   └── utils/              # Utilities
├── backend/                # Laravel backend
│   ├── app/                # Application code
│   ├── routes/             # API routes
│   └── database/           # Migrations & seeders
├── docs/                   # Documentation
├── nginx/                  # Nginx configuration
├── Dockerfile              # Frontend container
├── docker-compose.yml      # Docker orchestration
└── README.md               # This file
```

## 🛠️ Available Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend
php artisan serve    # Start dev server
php artisan migrate  # Run migrations
php artisan test     # Run tests
```

## 🔒 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://portfolio.neverlandstudio.my.id/api
```

### Backend (backend/.env)
```env
APP_ENV=production
APP_URL=https://portfolio.neverlandstudio.my.id
DB_DATABASE=neverland_portfolio
# ... (see .env.example for all variables)
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Neverland Studio**
- Website: [portfolio.neverlandstudio.my.id](https://portfolio.neverlandstudio.my.id)
- Email: hello@neverlandstudio.my.id

---

Made with ❤️ by Neverland Studio
