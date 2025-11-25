# Stage 1: Build aplikasi frontend (React/Vite)
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Salin file package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Salin sisa source code frontend
COPY . .

# Build aplikasi untuk production
RUN npm run build

# Stage 2: Sajikan aplikasi menggunakan Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]