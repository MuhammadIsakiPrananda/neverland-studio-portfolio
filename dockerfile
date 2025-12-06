# Stage 1: Build aplikasi frontend (React/Vite)
# Menggunakan image slim (berbasis Debian) untuk kompatibilitas native dependency yang lebih baik
FROM node:20-slim AS builder

# Build-time arguments for Vite environment variables
ARG VITE_API_BASE_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_GITHUB_CLIENT_ID
ARG VITE_RECAPTCHA_SITE_KEY

# Set environment variables for build
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}
ENV VITE_GITHUB_CLIENT_ID=${VITE_GITHUB_CLIENT_ID}
ENV VITE_RECAPTCHA_SITE_KEY=${VITE_RECAPTCHA_SITE_KEY}

# Set working directory
WORKDIR /app

# Salin file-file manifest dan lock untuk caching dependensi
COPY package*.json ./

# Install semua dependensi. Karena package.json berisi dependensi frontend dan backend,
# kita perlu menginstall semuanya agar build tool (rolldown) yang merupakan optional dependency bisa terinstall.
RUN npm install

# Salin sisa source code
COPY . .

# Build aplikasi untuk production
RUN npm run build

# Stage 2: Sajikan aplikasi menggunakan Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]