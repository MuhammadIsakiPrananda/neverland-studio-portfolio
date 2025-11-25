# Stage 1: Build aplikasi frontend (React/Vite)
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Salin file-file manifest dan lock untuk caching dependensi
COPY package*.json ./

# Install hanya dependensi yang diperlukan untuk build frontend
RUN npm install --omit=optional

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