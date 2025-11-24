# Gunakan base image Node.js versi LTS (Long Term Support)
FROM node:20-alpine

# Tentukan direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Instal semua dependensi
RUN npm install

# Salin sisa kode aplikasi ke dalam direktori kerja
COPY . .

# Buka port 5000 agar bisa diakses dari luar container
EXPOSE 5000

# Perintah untuk menjalankan aplikasi saat container dimulai
CMD [ "npm", "run", "dev" ]