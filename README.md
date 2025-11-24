<div align="center">
  <img src="https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/blob/main/public/images/Neverland%20Studio.webp?raw=true" alt="Logo" width="120" height="120">
  <h1 align="center">Neverland Studio</h1>
  <p align="center">
    Showcase portofolio interaktif dan modern yang dibangun dengan tumpukan teknologi web terkini. <br />
    Menghadirkan desain elegan, animasi yang imersif, dan pengalaman pengguna yang dinamis.
    <br />
    <a href="https://neverlandstudio.my.id"><strong>🚀 Lihat Demo Langsung »</strong></a>
    <br />
    <br />
    <a href="https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/issues">🐞 Laporkan Bug</a>
    ·
    <a href="https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/issues">✨ Minta Fitur</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/github/stars/MuhammadIsakiPrananda/neverland-studio-portfolio?style=for-the-badge" alt="GitHub Stars">
    <img src="https://img.shields.io/github/forks/MuhammadIsakiPrananda/neverland-studio-portfolio?style=for-the-badge" alt="GitHub Forks">
    <img src="https://img.shields.io/github/license/MuhammadIsakiPrananda/neverland-studio-portfolio?style=for-the-badge" alt="License">
  </p>
</div>

---

## 📜 Daftar Isi

<details>
  <summary>Buka Daftar Isi</summary>
  <ol>
    <li><a href="#-tentang-proyek">Tentang Proyek</a>
      <ul>
        <li><a href="#-dibangun-dengan">Dibangun Dengan</a></li>
      </ul>
    </li>
    <li><a href="#-fitur-unggulan">Fitur Unggulan</a></li>
    <li><a href="#-memulai">Memulai</a>
      <ul>
        <li><a href="#prasyarat">Prasyarat</a></li>
        <li><a href="#instalasi-dan-konfigurasi">Instalasi dan Konfigurasi</a></li>
      </ul>
    </li>
    <li><a href="#-skrip-yang-tersedia">Skrip yang Tersedia</a></li>
    <li><a href="#-deployment-dengan-docker">Deployment dengan Docker</a>
      <ul>
        <li><a href="#manfaat-multi-stage-build">Manfaat Multi-Stage Build</a></li>
        <li><a href="#langkah-langkah-deployment">Langkah-langkah Deployment</a></li>
      </ul>
    </li>
    <li><a href="#-arsitektur-proyek">Arsitektur Proyek</a></li>
    <li><a href="#-roadmap">Roadmap</a></li>
    <li><a href="#-berkontribusi">Berkontribusi</a></li>
    <li><a href="#-lisensi">Lisensi</a></li>
    <li><a href="#-kontak">Kontak</a></li>
    <li><a href="#-penghargaan">Penghargaan</a></li>
  </ol>
</details>

---

## 🌟 Tentang Proyek

![Pratinjau Proyek](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/blob/main/public/images/Preview%20Web.png?raw=true)

**Neverland Studio** adalah sebuah portofolio web yang dirancang untuk menampilkan proyek, layanan, dan keahlian sebuah studio digital atau agensi kreatif. Proyek ini bukan sekadar halaman statis, melainkan sebuah aplikasi web interaktif (SPA) yang kaya fitur, dibangun dengan fokus pada estetika modern, performa, dan pengalaman pengguna yang imersif.

Tujuan utama proyek ini adalah:
*   **Menarik Klien Potensial**: Dengan *showcase* visual yang kuat dan informasi yang jelas.
*   **Mendemonstrasikan Keahlian Teknis**: Menggunakan tumpukan teknologi modern untuk menunjukkan kemampuan dalam pengembangan web.
*   **Memberikan Pengalaman Pengguna yang Luar Biasa**: Melalui desain responsif, animasi yang halus, dan interaksi yang intuitif.

### 🛠️ Dibangun Dengan

Tumpukan teknologi yang digunakan dalam proyek ini dipilih untuk performa, skalabilitas, dan pengalaman pengembangan terbaik.

*   **Framework Utama**: **React** & **TypeScript**
    *   *Kenapa?* React menyediakan arsitektur berbasis komponen yang kuat, sementara TypeScript menambahkan keamanan tipe statis untuk skalabilitas dan pemeliharaan kode yang lebih baik.
*   **Build Tool**: **Vite**
    *   *Kenapa?* Menawarkan *Hot Module Replacement* (HMR) yang sangat cepat selama pengembangan dan *build* produksi yang sangat teroptimasi.
*   **Styling**: **Tailwind CSS**
    *   *Kenapa?* Sebuah *utility-first CSS framework* yang memungkinkan pembuatan desain kustom dengan cepat tanpa meninggalkan HTML.
*   **Animasi**: **Framer Motion**
    *   *Kenapa?* Pustaka animasi deklaratif untuk React yang memudahkan pembuatan animasi kompleks dan interaktif dengan performa tinggi.
*   **Ikon**: **Lucide React**
    *   *Kenapa?* Pustaka ikon yang ringan, konsisten, dan mudah dikustomisasi.
*   **Formulir & Validasi**: **React Hook Form** & **Google reCAPTCHA**
    *   *Kenapa?* React Hook Form untuk manajemen state formulir yang performan dan Google reCAPTCHA untuk lapisan keamanan tambahan.
*   **Deployment**: **Docker** & **Nginx**
    *   *Kenapa?* Kontainerisasi dengan Docker memastikan konsistensi lingkungan, dan Nginx berfungsi sebagai web server yang ringan dan efisien untuk menyajikan aset statis.

---

## ✨ Fitur Unggulan

*   🎨 **Desain Modern & Responsif**: Dibangun dengan **Tailwind CSS**, memastikan tampilan sempurna di semua perangkat, dari ponsel hingga desktop 4K.
*   ✨ **Animasi Halus & Interaktif**: Pengalaman pengguna yang dinamis dengan **Framer Motion** untuk transisi halaman dan interaksi komponen yang memukau.
*   🔐 **Sistem Autentikasi Lengkap**:
    *   Alur **Login**, **Registrasi**, dan **Lupa Password**.
    *   Validasi formulir sisi klien secara *real-time*.
    *   Integrasi **Google reCAPTCHA v3** untuk mencegah bot.
*   👤 **Dashboard Pengguna**: Modal dashboard pribadi tempat pengguna dapat memperbarui profil mereka, termasuk nama, email, dan avatar.
*   🤖 **AI Chatbot Assistant**: Asisten AI interaktif (konseptual) untuk menjawab pertanyaan pengunjung, meningkatkan *engagement*.
*   🔔 **Sistem Notifikasi Toast**: Notifikasi yang elegan untuk memberikan umpan balik instan kepada pengguna setelah melakukan aksi (misalnya, login berhasil, profil diperbarui).
*   🎬 **Modal Interaktif Canggih**:
    *   Berbagai modal (Autentikasi, Video, Dashboard, Review).
    *   Dikelola dengan `AnimatePresence` dari Framer Motion untuk animasi *enter/exit* yang mulus.
*   🏗️ **Arsitektur Berbasis Komponen**: Kode yang sangat terorganisir, memisahkan antara UI, layout, section, dan data untuk kemudahan pemeliharaan dan skalabilitas.
*   ⚡ **Performa Cepat**: Dibangun dengan **Vite** untuk pengembangan super cepat dan *build* produksi yang teroptimasi.
*   🐳 **Siap Docker**: Dilengkapi dengan `Dockerfile` *multi-stage* untuk *build* yang efisien dan *deployment* yang konsisten.

---

## ⚙️ Memulai

Ikuti langkah-langkah ini untuk menyiapkan dan menjalankan salinan proyek di mesin lokal Anda untuk tujuan pengembangan dan pengujian.

### Prasyarat

Pastikan perangkat Anda telah terinstal:
*   Node.js (v20.x atau lebih baru)
*   npm (v10.x atau lebih baru) atau Yarn
*   Docker & Docker Compose (Opsional, untuk deployment)

### Instalasi dan Konfigurasi

1.  **Clone repositori:**
    ```bash
    git clone https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio.git
    cd neverland-studio-portfolio
    ```

2.  **Instal dependensi proyek:**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment Variables:**
    Buat file `.env` di direktori root proyek dengan menyalin dari contoh yang ada.
    ```bash
    cp .env.example .env
    ```
    Kemudian, isi variabel yang diperlukan di dalam file `.env`:
    ```env
    VITE_RECAPTCHA_SITE_KEY="6Lc5EAgsAAAAAMBLswyP5OAl7Tzo8BYXLHWGKLZt"
    ```
    > **Penting**: Kunci di atas adalah contoh publik untuk pengujian. Untuk lingkungan produksi, sangat disarankan untuk membuat kunci Anda sendiri melalui Google reCAPTCHA Admin Console.

---

## 🚀 Skrip yang Tersedia

Di dalam direktori proyek, Anda dapat menjalankan beberapa skrip:

*   **`npm run dev`**
    Menjalankan aplikasi dalam mode pengembangan dengan *Hot-Module-Replacement*.
    Buka http://localhost:5173 untuk melihatnya di browser.

*   **`npm run build`**
    Membangun aplikasi untuk produksi ke dalam folder `dist`.
    Ini menggabungkan React dengan benar dalam mode produksi dan mengoptimalkan *build* untuk performa terbaik.

*   **`npm run lint`**
    Menjalankan linter untuk memeriksa masalah gaya penulisan kode dan potensi error.

*   **`npm run preview`**
    Menjalankan server lokal untuk melihat hasil *build* produksi dari folder `dist`.

---

## 🐳 Deployment dengan Docker

Proyek ini dikonfigurasi untuk deployment yang mudah menggunakan Docker. `Dockerfile` kami menggunakan *multi-stage build* untuk menciptakan image yang ringan dan aman.

### Manfaat Multi-Stage Build

1.  **Image Lebih Kecil**: Image produksi akhir hanya berisi aset statis dan Nginx, tanpa `node_modules` atau kode sumber, sehingga ukurannya jauh lebih kecil.
2.  **Keamanan Lebih Baik**: Mengurangi *attack surface* karena *toolchain* pengembangan tidak disertakan dalam image akhir.
3.  **Build yang Bersih**: Setiap *stage* dimulai dari lingkungan yang bersih, memastikan tidak ada artefak yang tidak perlu terbawa.

### Langkah-langkah Deployment

1.  **Bangun Docker Image:**
    Dari direktori root proyek, jalankan:
    ```bash
    docker build -t neverland-studio:latest .
    ```

2.  **Jalankan Docker Container:**
    Setelah image berhasil dibuat, jalankan sebagai container:
    ```bash
    docker run --rm -d -p 8080:80 --name neverland-app neverland-studio:latest
    ```
    *   `--rm`: Hapus container secara otomatis saat dihentikan.
    *   `-d`: Jalankan dalam mode *detached* (di latar belakang).
    *   `-p 8080:80`: Petakan port `8080` dari host ke port `80` di container.
    *   `--name neverland-app`: Memberi nama pada container agar mudah dikelola.

Aplikasi Anda sekarang dapat diakses di `http://localhost:8080`.

---

## 📂 Arsitektur Proyek

Struktur file dirancang agar intuitif, modular, dan mudah diskalakan.

```text
neverlandstudio/
├── public/                 # Aset statis (favicon, gambar, font)
├── src/
│   ├── components/
│   │   ├── common/         # Komponen bersama (Footer, FloatingButtons, Logo)
│   │   ├── layout/         # Komponen struktur utama (Navbar, PageWrapper)
│   │   ├── sections/       # Komponen untuk setiap bagian halaman (Hero, Services, About)
│   │   └── ui/             # Komponen UI atomik (Button, Modal, Input, Toast)
│   ├── data/               # Data statis aplikasi (navItems, services, team, testimonials)
│   ├── hooks/              # Custom hooks (misal: useAuth, useModal)
│   ├── contexts/           # Konteks React (misal: AuthContext, ThemeContext)
│   ├── lib/                # Fungsi utilitas dan helper
│   ├── styles/             # File CSS global
│   ├── App.tsx             # Komponen root, routing, dan state management utama
│   └── main.tsx            # Titik masuk aplikasi React (React DOM render)
├── .env.example            # Contoh file environment variables
├── .gitignore              # File yang diabaikan oleh Git
├── Dockerfile              # Instruksi untuk membangun image Docker
├── index.html              # Template HTML utama yang digunakan oleh Vite
├── nginx.conf              # Konfigurasi Nginx untuk production di dalam Docker
├── package.json            # Daftar dependensi dan skrip proyek
├── README.md               # Anda sedang membacanya
└── tsconfig.json           # Konfigurasi kompiler TypeScript
```

---

## 🗺️ Roadmap

-   [ ] Implementasi *backend* untuk sistem autentikasi.
-   [ ] Penambahan tema Terang/Gelap (*Light/Dark Mode*).
-   [ ] Integrasi dengan CMS *headless* untuk manajemen konten dinamis.
-   [ ] Penambahan halaman blog.
-   [ ] Peningkatan aksesibilitas (WCAG).

Lihat issues terbuka untuk daftar lengkap fitur yang diusulkan (dan masalah yang diketahui).

---

## 🤝 Berkontribusi

Kontribusi membuat komunitas open source menjadi tempat yang luar biasa untuk belajar, menginspirasi, dan berkreasi. Setiap kontribusi yang Anda buat sangat **dihargai**.

Jika Anda memiliki saran untuk perbaikan, silakan *fork* repositori ini dan buat *pull request*. Anda juga dapat membuka *issue* dengan tag "enhancement". Jangan lupa untuk memberikan bintang pada proyek ini! Terima kasih!

1.  Fork Proyek ini
2.  Buat Branch Fitur Anda (`git checkout -b feature/AmazingFeature`)
3.  Commit Perubahan Anda (`git commit -m 'feat: Add some AmazingFeature'`)
4.  Push ke Branch (`git push origin feature/AmazingFeature`)
5.  Buka sebuah *Pull Request*

---

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE.txt` untuk informasi lebih lanjut.

---

## ✉️ Kontak

Muhammad Isaki Prananda - arlianto032@gmail.com

Link Proyek: https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio

---

## 🎉 Penghargaan

*   Vite
*   React
*   Tailwind CSS
*   Framer Motion
*   Shields.io untuk badge yang keren