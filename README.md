<div align="center">
  <img src="https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/blob/main/public/images/Neverland%20Studio.webp?raw=true" alt="Logo" width="120" height="120">
  <h1 align="center">Neverland Studio</h1>
  <p align="center">
    Sebuah showcase portofolio interaktif dan modern yang dibangun dengan teknologi web terkini. <br />
    Menampilkan desain yang elegan, animasi yang halus, dan pengalaman pengguna yang dinamis.
    <br />
    <a href="https://neverlandstudio.my.id"><strong>Lihat Demo Langsung »</strong></a>
    <br />
    <br />
    <a href="https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/issues">Laporkan Bug</a>
    ·
    <a href="https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/issues">Minta Fitur</a>
  </p>
</div>

---

## 📜 Daftar Isi

<details>
  <summary>Klik untuk membuka</summary>
  <ol>
    <li><a href="#-tentang-proyek">Tentang Proyek</a></li>
    <li><a href="#-fitur-utama">Fitur Utama</a></li>
    <li><a href="#-dibangun-dengan">Dibangun Dengan</a></li>
    <li><a href="#-memulai-proyek">Memulai Proyek</a>
      <ul>
        <li><a href="#prasyarat">Prasyarat</a></li>
        <li><a href="#instalasi">Instalasi</a></li>
        <li><a href="#menjalankan-di-mode-development">Menjalankan di Mode Development</a></li>
        <li><a href="#membuat-build-produksi">Membuat Build Produksi</a></li>
      </ul>
    </li>
    <li><a href="#-deployment-dengan-docker">Deployment dengan Docker</a></li>
    <li><a href="#-struktur-proyek">Struktur Proyek</a></li>
    <li><a href="#-berkontribusi">Berkontribusi</a></li>
    <li><a href="#-lisensi">Lisensi</a></li>
    <li><a href="#-kontak">Kontak</a></li>
  </ol>
</details>

---

## 🌟 Tentang Proyek

![Screenshot Proyek](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/blob/main/public/images/Screenshot%202025-11-12%20105513.png?raw=true)

**Neverland Studio** adalah sebuah portofolio web yang dirancang untuk menampilkan proyek, layanan, dan keahlian sebuah studio digital atau agensi kreatif. Proyek ini bukan sekadar halaman statis, melainkan sebuah aplikasi web interaktif (SPA) yang kaya fitur, dibangun dengan fokus pada estetika modern, performa, dan pengalaman pengguna yang imersif.

Tujuan utama proyek ini adalah:
*   **Menarik Klien Potensial**: Dengan showcase visual yang kuat dan informasi yang jelas.
*   **Mendemonstrasikan Keahlian Teknis**: Menggunakan tumpukan teknologi modern seperti React, TypeScript, dan Framer Motion.
*   **Memberikan Pengalaman Pengguna yang Luar Biasa**: Melalui desain responsif, animasi yang halus, dan interaksi yang intuitif.

---

## 🚀 Fitur Utama

Proyek ini dilengkapi dengan berbagai fitur canggih untuk menciptakan pengalaman portofolio yang lengkap.

| Fitur | Deskripsi |
| :--- | :--- |
| 🎨 **Desain Modern & Responsif** | Dibangun dengan **Tailwind CSS**, memastikan tampilan sempurna di semua perangkat, dari ponsel hingga desktop 4K. |
| ✨ **Animasi Halus & Interaktif** | Pengalaman pengguna yang dinamis dengan **Framer Motion** untuk transisi halaman dan interaksi komponen yang memukau. |
| 🔐 **Sistem Autentikasi** | Alur lengkap untuk **Login**, **Registrasi**, dan **Lupa Password** dengan validasi sisi klien dan keamanan reCAPTCHA. |
| 👤 **Dashboard Pengguna** | Modal dashboard pribadi tempat pengguna dapat memperbarui profil mereka, termasuk nama, email, dan avatar. |
| 🤖 **AI Chatbot Assistant** | Asisten AI interaktif untuk menjawab pertanyaan pengunjung secara real-time, meningkatkan engagement. |
| 🔔 **Sistem Notifikasi** | Notifikasi toast yang elegan untuk memberikan umpan balik kepada pengguna setelah melakukan aksi (misalnya, login berhasil). |
| 🎬 **Modal Interaktif** | Berbagai modal (Auth, Video, Dashboard, Review) dengan animasi `AnimatePresence` untuk pengalaman yang mulus. |
| 🏗️ **Arsitektur Berbasis Komponen** | Kode yang terorganisir dengan baik, memisahkan antara UI, layout, section, dan data untuk kemudahan pemeliharaan. |
| ⚡ **Performa Cepat** | Dibangun dengan **Vite** untuk *Hot Module Replacement* (HMR) super cepat dan *build* produksi yang teroptimasi. |
| 🐳 **Siap Docker** | Dilengkapi dengan `Dockerfile` *multi-stage* untuk *build* yang efisien dan *deployment* yang konsisten menggunakan Nginx. |

---

## 🛠️ Dibangun Dengan

Tumpukan teknologi yang digunakan dalam proyek ini dipilih untuk performa, skalabilitas, dan pengalaman pengembangan terbaik.

<p align="center">
  <a href="https://react.dev" target="_blank"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://vitejs.dev" target="_blank"><img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"></a>
  <a href="https://tailwindcss.com" target="_blank"><img src="https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://www.framer.com/motion/" target="_blank"><img src="https://img.shields.io/badge/Framer_Motion-11.x-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion"></a>
  <a href="https://lucide.dev/" target="_blank"><img src="https://img.shields.io/badge/Lucide-Icons-14B8A6?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide React"></a>
  <a href="https://www.docker.com/" target="_blank"><img src="https://img.shields.io/badge/Docker-24.x-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"></a>
  <a href="https://www.nginx.com/" target="_blank"><img src="https://img.shields.io/badge/Nginx-1.x-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx"></a>
</p>

---

## ⚙️ Memulai Proyek

Ikuti langkah-langkah ini untuk menjalankan salinan proyek di mesin lokal Anda.

### Prasyarat

Pastikan perangkat Anda telah terinstal:
*   Node.js (v20.x atau lebih baru)
*   npm (v10.x atau lebih baru) atau Yarn
*   Docker (Opsional, untuk deployment)

### Instalasi

1.  **Clone repositori:**
    ```bash
    git clone https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio.git
    cd neverland-studio-portfolio
    ```

2.  **Instal dependensi:**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment Variables:**
    Buat file `.env` di root proyek dan tambahkan kunci API yang diperlukan. Anda bisa menyalin dari `.env.example` jika ada.
    ```env
    VITE_RECAPTCHA_SITE_KEY="6Lc5EAgsAAAAAMBLswyP5OAl7Tzo8BYXLHWGKLZt"
    ```
    > **Catatan**: Kunci di atas adalah contoh. Sebaiknya gunakan kunci Anda sendiri dari Google reCAPTCHA Admin Console.

### Menjalankan di Mode Development

Untuk memulai server development dengan HMR:

```bash
npm run dev
```

Buka browser dan kunjungi `http://localhost:5173`.

### Membuat Build Produksi

Untuk membuat bundle aplikasi yang siap untuk produksi:

```bash
npm run build
```

File yang teroptimasi akan dibuat di dalam direktori `dist/`.

---

## 🐳 Deployment dengan Docker

Proyek ini dikonfigurasi untuk deployment yang mudah menggunakan Docker. `Dockerfile` kami menggunakan *multi-stage build* untuk menciptakan image yang ringan dan aman.

1.  **Stage 1 (Builder)**: Menggunakan image Node.js untuk menginstal dependensi dan membangun aset statis React.
2.  **Stage 2 (Production)**: Menggunakan image Nginx yang ringan untuk menyajikan aset yang telah dibangun dari stage sebelumnya, dengan konfigurasi yang optimal.

### Langkah-langkah Deployment

1.  **Bangun Docker Image:**
    Dari direktori root proyek, jalankan:
    ```bash
    docker build -t neverland-studio .
    ```

2.  **Jalankan Docker Container:**
    Setelah image berhasil dibuat, jalankan sebagai container:
    ```bash
    docker run --rm -d -p 8080:80 neverland-studio
    ```
    *   `--rm`: Hapus container secara otomatis saat dihentikan.
    *   `-d`: Jalankan dalam mode *detached* (di latar belakang).
    *   `-p 8080:80`: Petakan port `8080` dari host ke port `80` di container.

Aplikasi Anda sekarang dapat diakses di `http://localhost:8080`.

---

## 📂 Struktur Proyek

Struktur file yang terorganisir dengan baik untuk skalabilitas dan kemudahan pemeliharaan.

```
neverlandstudio/
├── public/                 # Aset statis (favicon, gambar, dll.)
├── src/
│   ├── component/
│   │   ├── common/         # Komponen umum (Footer, FloatingButtons)
│   │   ├── layout/         # Komponen tata letak (DesktopNav, MobileNav)
│   │   ├── sections/       # Komponen per bagian halaman (Hero, Services, etc.)
│   │   └── ui/             # Komponen UI atomik (Button, Modal, Form)
│   ├── data/               # Data statis aplikasi (navItems, services, team)
│   ├── App.tsx             # Komponen root aplikasi & state management utama
│   └── main.tsx            # Titik masuk aplikasi React
├── .gitignore              # File yang diabaikan oleh Git
├── Dockerfile              # Instruksi untuk membangun image Docker
├── index.html              # Template HTML utama
├── nginx.conf              # Konfigurasi Nginx untuk production
├── package.json            # Daftar dependensi dan skrip
├── README.md               # Anda sedang membacanya
└── tsconfig.json           # Konfigurasi TypeScript
```

---

## 🤝 Berkontribusi

Kontribusi membuat komunitas open source menjadi tempat yang luar biasa untuk belajar, menginspirasi, dan berkreasi. Setiap kontribusi yang Anda buat sangat **dihargai**.

Jika Anda memiliki saran untuk perbaikan, silakan fork repositori ini dan buat *pull request*. Anda juga dapat membuka *issue* dengan tag "enhancement". Jangan lupa untuk memberikan bintang pada proyek ini! Terima kasih lagi!

1.  Fork Proyek ini
2.  Buat Branch Fitur Anda (`git checkout -b feature/AmazingFeature`)
3.  Commit Perubahan Anda (`git commit -m 'feat: Add some AmazingFeature'`)
4.  Push ke Branch (`git push origin feature/AmazingFeature`)
5.  Buka sebuah Pull Request

---

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.

---

## ✉️ Kontak

Muhammad Isaki Prananda - arlianto032@gmail.com

Link Proyek: https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio