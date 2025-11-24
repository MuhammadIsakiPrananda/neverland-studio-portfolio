# Stage 1: Menggunakan base image Node.js yang ringan (Alpine) untuk production
FROM node:18-alpine

# Menentukan working directory di dalam container
WORKDIR /app

# Menyalin package.json dan package-lock.json (jika ada)
# Ini memanfaatkan cache Docker, sehingga 'npm install' hanya berjalan jika file-file ini berubah.
COPY package*.json ./

# Menginstall hanya production dependencies untuk membuat image lebih kecil dan aman.
# nodemon tidak akan di-install jika dipindahkan ke devDependencies.
RUN npm install --production

# Menyalin source code backend ke working directory di dalam container.
# Perhatikan kita menyalin dari subfolder 'neverland-backend' dari konteks build.
COPY ./neverland-backend/ .

# Membuat user dan grup aplikasi
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Memberikan kepemilikan direktori aplikasi kepada user baru
RUN chown -R appuser:appgroup /app

# Beralih ke user non-root
USER appuser

# Memberi tahu Docker bahwa container akan listen di port 5000
# Sesuai dengan process.env.PORT || 5000 di server.js
EXPOSE 5000

# Perintah untuk menjalankan aplikasi saat container dimulai
# Menggunakan script 'start' dari package.json
CMD [ "node", "server.js" ]