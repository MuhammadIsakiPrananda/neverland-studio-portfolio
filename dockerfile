# --- Tahap 1: Build ---
# Menggunakan base image Node.js yang ringan untuk proses build.
FROM node:18-alpine AS builder

# Menentukan working directory di dalam container
WORKDIR /app

# Menyalin package.json dan package-lock.json terlebih dahulu.
# Ini memanfaatkan caching Docker, sehingga 'npm install' hanya berjalan jika file-file ini berubah.
COPY package*.json ./

# Menginstall semua dependencies yang dibutuhkan untuk proses build (termasuk devDependencies).
RUN npm install

# Menyalin sisa source code aplikasi (frontend dan backend).
# Karena ini monorepo, kita salin semuanya.
COPY . .

# Menjalankan script build dari package.json untuk membuat aset frontend.
# Vite akan menghasilkan folder 'dist' yang berisi file statis.
RUN npm run build

# --- Tahap 2: Serve ---
# Menggunakan base image Nginx yang ringan untuk menyajikan file statis.
FROM nginx:alpine

# Menyalin hasil build dari tahap 'builder' ke direktori default Nginx.
COPY --from=builder /app/dist /usr/share/nginx/html

# Memberi tahu Docker bahwa container akan mendengarkan di port 80.
EXPOSE 80

# Perintah default untuk Nginx akan dijalankan secara otomatis untuk memulai server.