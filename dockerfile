# STAGE 1: Build Frontend (React)
# Menggunakan base image Node.js untuk proses build. 'as frontend-builder' menamai stage ini.
FROM node:18-alpine AS frontend-builder

# Set working directory di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json (atau yarn.lock) terlebih dahulu
# Ini memanfaatkan caching Docker, sehingga 'npm install' hanya berjalan jika file-file ini berubah.
COPY package*.json ./

# Install dependencies frontend
RUN npm install

# Copy sisa source code frontend
COPY . .

# Build aplikasi React untuk production
# Folder hasil build default dari Vite adalah 'dist'
RUN npm run build

# STAGE 2: Final Image
# Ini adalah image akhir yang akan dijalankan. Menggunakan base image yang ringan.
FROM node:18-alpine

WORKDIR /app

# Copy package.json untuk menginstall production dependencies
COPY package*.json ./

# Install HANYA production dependencies untuk image akhir yang lebih kecil
RUN npm install --production

# Copy source code backend (misal: server.js) dan file-file lain yang relevan
COPY . .

# Copy hasil build frontend dari stage 'frontend-builder' ke folder 'public'
# Vite secara default membuat folder 'dist', bukan 'build'
COPY --from=frontend-builder /app/dist ./public

# Expose port yang digunakan oleh server backend
EXPOSE 8080

# Perintah untuk menjalankan aplikasi saat container dimulai
CMD ["node", "server.js"]