<div align="center">
  <h1 align="center">✨ Neverland Studio Portfolio ✨</h1>
  <p align="center">
    Showcase interaktif dan modern dari karya-karya kreatif dan proyek-proyek inovatif.
  </p>

  <!-- Badges -->
  <p align="center">
    <!-- Ganti 'your-username' dengan nama pengguna GitHub Anda -->
    <a href="https://github.com/your-username/neverland-studio-portfolio/actions"><img src="https://img.shields.io/github/actions/workflow/status/your-username/neverland-studio-portfolio/main.yml?branch=main&style=for-the-badge" alt="Build Status"></a>
    <a href="LICENSE"><img src="https://img.shields.io/github/license/your-username/neverland-studio-portfolio?style=for-the-badge" alt="License"></a>
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Vite-blue?style=for-the-badge&logo=vite" alt="Vite">
    <img src="https://img.shields.io/badge/Docker-blue?style=for-the-badge&logo=docker" alt="Docker">
  </p>
</div>

---

## 📜 Daftar Isi

- 🌐 Demo Langsung
- 🚀 Fitur Utama
- 🛠️ Tumpukan Teknologi
- ⚙️ Memulai Proyek
  - Prasyarat
  - Instalasi
  - Menjalankan di Mode Development
  - Membuat Build Produksi
- 🐳 Deployment dengan Docker
- 📂 Struktur Proyek
- 🤝 Berkontribusi
- 📄 Lisensi
- ✉️ Kontak

---

## 🌐 Demo Langsung

Anda dapat melihat versi live dari portofolio ini di sini:

**➡️ portfolio.neverlandstudio.com**

*(Ganti URL di atas dengan URL deployment Anda)*

!Screenshot Aplikasi
*(Ganti `https://via.placeholder.com/800x450?text=Tambahkan+Screenshot+Aplikasi+Anda+Di+Sini` dengan URL atau path gambar screenshot aplikasi Anda)*

---

## 🚀 Fitur Utama

-   🎨 **Desain Modern & Responsif**: Dibangun dengan Tailwind CSS, memastikan tampilan yang sempurna di semua ukuran layar, dari ponsel hingga desktop 4K.
-   ✨ **Animasi Halus**: Pengalaman pengguna yang dinamis dan menarik dengan `framer-motion` untuk transisi halaman dan interaksi komponen.
-   🛡️ **Formulir Aman & Interaktif**: Contoh implementasi formulir Login dan Lupa Password dengan validasi sisi klien dan animasi yang informatif.
-   🌍 **Internasionalisasi (i18n)**: Dukungan multi-bahasa yang mudah diperluas menggunakan `react-i18next`.
-   ⚡ **Performa Cepat**: Dibangun dengan Vite untuk *hot module replacement* (HMR) yang super cepat di development dan bundle yang teroptimasi untuk produksi.
-   🐳 **Siap Docker**: Dilengkapi dengan `Dockerfile` multi-stage untuk build yang efisien dan deployment yang konsisten menggunakan Nginx.

---

## 🛠️ Tumpukan Teknologi

| Kategori      | Teknologi                                                                                                                                                                                          |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**  | React 19, TypeScript, Vite, Tailwind CSS                                                  |
| **Animasi**   | Framer Motion                                                                                                                                                    |
| **Ikon**      | Lucide React                                                                                                                                                                |
| **i18n**      | react-i18next                                                                                                                                                        |
| **Deployment**| Docker, Nginx                                                                                                                                  |

---

## ⚙️ Memulai Proyek

Ikuti langkah-langkah ini untuk menjalankan salinan proyek di mesin lokal Anda untuk tujuan pengembangan dan pengujian.

### Prasyarat

Pastikan perangkat Anda telah terinstal perangkat lunak berikut:
-   Node.js (v20.x atau lebih baru)
-   npm (v10.x atau lebih baru) atau Yarn
-   Docker (Wajib untuk deployment Docker)

### Instalasi

1.  **Clone repositori ini:**
    ```bash
    git clone https://github.com/your-username/neverland-studio-portfolio.git
    cd neverland-studio-portfolio
    ```
    *(Ganti `your-username` dengan nama pengguna GitHub Anda)*

2.  **Instal dependensi proyek:**
    Proyek ini menggunakan `npm` secara default (berdasarkan adanya `package-lock.json`).
    ```bash
    npm install
    ```
    *Atau jika Anda lebih suka menggunakan Yarn:*
    ```bash
    # yarn install
    ```

### Menjalankan di Mode Development

Untuk memulai server development dengan Hot-Module-Replacement (HMR):

```bash
npm run dev
```

Buka browser Anda dan kunjungi **http://localhost:5173**.

### Membuat Build Produksi

Untuk membuat bundle aplikasi yang siap untuk produksi:

```bash
npm run build
```

File yang dioptimalkan akan dibuat di dalam direktori `dist/`.

---

## 🐳 Deployment dengan Docker

Proyek ini dikonfigurasi untuk deployment yang mudah menggunakan Docker. `Dockerfile` kami menggunakan *multi-stage build* untuk menciptakan image yang ringan dan aman.

1.  **Stage 1 (Builder)**: Menginstal dependensi Node.js dan membangun aset statis React.
2.  **Stage 2 (Production)**: Menggunakan image Nginx yang ringan untuk menyajikan aset yang telah dibangun dari stage sebelumnya.

### Langkah-langkah Deployment

1.  **Bangun Docker Image:**
    Dari direktori root proyek, jalankan:
    ```bash
    docker build -t neverland-studio .
    ```

2.  **Jalankan Docker Container:**
    Setelah image berhasil dibuat, jalankan sebagai container:
    ```bash
    docker run --rm -d -p 80:80 neverland-studio
    ```
    -   `--rm`: Hapus container secara otomatis saat dihentikan.
    -   `-d`: Jalankan dalam mode *detached* (di latar belakang).
    -   `-p 80:80`: Petakan port 80 dari host ke port 80 di container.

Aplikasi Anda sekarang dapat diakses di **http://localhost**.

---

## 📂 Struktur Proyek

Struktur file utama dalam proyek ini adalah sebagai berikut:

```
neverlandstudio/
├── .github/                # Konfigurasi GitHub Actions (CI/CD)
├── public/                 # Aset statis (favicon, dll.)
├── src/
│   ├── assets/             # Gambar, font, dan aset lainnya
│   ├── components/         # Komponen React yang dapat digunakan kembali
│   │   └── ui/             # Contoh: Komponen UI dasar (Button, Input, dll.)
│   ├── pages/              # Contoh: Komponen yang mewakili halaman (Home, About, Contact)
│   ├── lib/                # Contoh: Logika utilitas, hooks kustom, dll.
│   ├── styles/             # Contoh: File CSS global atau konfigurasi Tailwind
│   ├── App.tsx             # Komponen root aplikasi
│   └── main.tsx            # Titik masuk aplikasi
├── Dockerfile              # Instruksi untuk membangun image Docker
├── nginx.conf              # Konfigurasi Nginx untuk menyajikan aplikasi
├── package.json            # Daftar dependensi dan skrip
├── yarn.lock               # Lock file untuk Yarn (jika digunakan)
├── README.md               # Anda sedang membacanya
└── tsconfig.json           # Konfigurasi TypeScript
```

---

## 🤝 Berkontribusi

Kontribusi membuat komunitas open source menjadi tempat yang luar biasa untuk belajar, menginspirasi, dan berkreasi. Setiap kontribusi yang Anda buat sangat **dihargai**.

Jika Anda memiliki saran untuk perbaikan, silakan fork repositori ini dan buat *pull request*. Anda juga dapat membuka *issue* dengan tag "enhancement".

1.  Fork Proyek ini
2.  Buat Branch Fitur Anda (`git checkout -b feature/AmazingFeature`)
3.  Commit Perubahan Anda (`git commit -m 'Add some AmazingFeature'`)
4.  Push ke Branch (`git push origin feature/AmazingFeature`)
5.  Buka sebuah Pull Request

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.

---

## ✉️ Kontak

Jika Anda memiliki pertanyaan atau ingin berdiskusi lebih lanjut, jangan ragu untuk menghubungi:

-   **Nama Anda / Neverland Studio**
-   **Email**: arlianto032@gmail.com
-   **LinkedIn**: Profil LinkedIn Anda
-   **Website**: neverlandstudio.com (jika ada)

Link Proyek: https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio