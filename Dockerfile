# Frontend Dockerfile - Neverland Studio Portfolio
FROM node:18-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./

# ================================
# Development Stage
# ================================
FROM base AS development

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start dev server with host 0.0.0.0 (accessible from outside container)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ================================
# Build Stage
# ================================
FROM base AS build

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build production bundle
RUN npm run build

# ================================
# Production Stage
# ================================
FROM nginx:alpine AS production

# Remove default nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration (if exists)
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
