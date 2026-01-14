<div align="center">

# 🌟 Neverland Studio Portfolio
### The Ultimate Modern Full-Stack Platform for IT Services & Learning
**Premium Design • Real-time Analytics • Educational Management • Consultation System**

[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge&logo=github)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](docs/DEPLOYMENT.md)

[🚀 Live Demo](https://portfolio.neverlandstudio.my.id) • [📖 Documentation Hub](docs/README.md) • [🐛 Report Bug](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/issues) • [✨ Request Feature](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/discussions)

</div>

---

## 📖 Complete Documentation Setup

We have organized our documentation to make it easy for you to find exactly what you need. Please explore the specific guides below:

<div align="center">

| 🏁 **Getting Started** | 🔧 **Technical Guide** | 📘 **Features & Manual** |
|:------------------|:-------------------|:---------------------|
| [⚡ Quick Start Guide](docs/QUICKSTART.md) | [🏗️ Project Structure](docs/STRUCTURE.md) | [⚡ Features Documentation](docs/FEATURES_DOCUMENTATION.md) |
| [🚀 Deployment Guide](docs/DEPLOYMENT.md) | [🔌 API Reference](docs/API.md) | [📊 Real-time Analytics](docs/REALTIME_ANALYTICS.md) |
| [🐳 Docker Setup](docs/DEPLOYMENT.md#docker-deployment) | [🔐 Security Policy](docs/SECURITY.md) | [👤 User Guide](docs/USER_GUIDE.md) |
| [💾 Database Setup](docs/PHPMYADMIN_SETUP.md) | [🔑 OAuth Setup](docs/OAUTH_SETUP.md) | [❓ FAQ & Troubleshooting](docs/FAQ.md) |

</div>

<br>

<details>
<summary><b>📚 Click to view the full Documentation Index</b></summary>
<br>

*   **[Documentation Hub](docs/README.md)** - The central point for all docs.
*   **[Architecture](docs/ARCHITECTURE.md)** - Deep dive into system design.
*   **[Photo Profile System](docs/PHOTO_PROFILE_SYSTEM.md)** - How avatars work.
*   **[SMTP Setup](docs/SMTP_SETUP.md)** - Configuring email.
*   **[Changelog](docs/CHANGELOG.md)** - See what's new.

</details>

---

## 🖼️ Application Showcase

*Experience a visually stunning interface designed for modern users.*

> **Note**: These screenshots are placeholders. Replace them with actual screenshots of your application.

| **🏠 Home Page** | **📊 Admin Dashboard** |
|:---:|:---:|
| ![Home Page](docs/assets/home.png) | ![Dashboard](docs/assets/dashboard.png) |
| *Modern Landing Page with 3D Effects* | *Real-time Analytics & Management* |

| **📱 Mobile Responsive** | **🎨 Dark Mode** |
|:---:|:---:|
| ![Mobile](docs/assets/mobile.png) | ![Dark Mode](docs/assets/dark.png) |
| *Perfect on every device* | *Sleek and easy on the eyes* |

---

## ✨ Key Features

### 🎨 Frontend Experience
*   **Modern UI/UX**: Built with **React 19** & **Tailwind CSS** for a premium feel.
*   **Smooth Animations**: Powered by Framer Motion & GSAP.
*   **Responsive Design**: Mobile-first approach ensuring perfect rendering everywhere.
*   **Dark Mode**: Automatic system preference detection with manual toggle.
*   **Interactive Components**: Glassmorphism, tilt effects, and particle backgrounds.

### 🐘 Powerful Backend
*   **Robust API**: **Laravel 11** serving a secure and fast REST API.
*   **Authentication**: Secure **Sanctum** token-based auth + **Socialite** (Google/GitHub).
*   **Real-Time**: Live User tracking and admin notifications.
*   **Role Management**: Strict Admin vs User capabilities.

### 🛠️ Admin Dashboard
*   **Content Management**: Manage services, projects, testimonials, and teams easily.
*   **Live Analytics**: See who is online and what they are viewing in real-time.
*   **Enrollment System**: Manage student course registrations.
*   **Consultation Booking**: Handle appointment requests seamlessly.

---

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | Infrastructure |
|:---:|:---:|:---:|
| ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) | ![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=flat&logo=laravel&logoColor=white) | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) | ![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat&logo=php&logoColor=white) | ![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat&logo=nginx&logoColor=white) |
| ![Tw](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=flat&logo=mysql&logoColor=white) | ![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=flat&logo=cloudflare&logoColor=white) |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white) | ![Linux](https://img.shields.io/badge/Linux-FCC624?style=flat&logo=linux&logoColor=black) |

</div>

---

## ⚡ Quick Start

Want to run this locally? It's easy with Docker!

```bash
# 1. Clone the repository
git clone https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio.git
cd neverland-studio-portfolio

# 2. Setup Environment Variables
cp .env.example .env
cp backend/.env.example backend/.env

# 3. Start the application
docker compose up -d

# 4. Visit the site
# Frontend: http://localhost:80
# Backend: http://localhost:8000
```


> [!IMPORTANT]
> Make sure you have **Docker** and **Docker Compose** installed.
> For detailed setup without Docker, see [Quick Start Guide](docs/QUICKSTART.md).

---

## 🗳️ Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

### 🌟 Show your support

Give a ⭐️ if this project helped you!

[![Star History Chart](https://api.star-history.com/svg?repos=MuhammadIsakiPrananda/neverland-studio-portfolio&type=Date)](https://star-history.com/#MuhammadIsakiPrananda/neverland-studio-portfolio&Date)

<br>

**Built with 💖 by [Neverland Studio Team](https://github.com/MuhammadIsakiPrananda)**

</div>
