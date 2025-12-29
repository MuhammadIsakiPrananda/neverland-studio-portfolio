# Frontend Dockerfile - Neverland Studio Portfolio
# Multi-stage build for optimized production deployment

# ================================
# Base Stage
# ================================
FROM node:18-alpine AS base

WORKDIR /app

# Install dependencies in a separate layer for better caching
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
# Build Dependencies Stage
# ================================
FROM base AS dependencies

# Install ALL dependencies needed for build (including devDependencies)
RUN npm ci

# ================================
# Build Stage
# ================================
FROM dependencies AS build

# Copy source code
COPY . .

# Build production bundle with optimizations
ENV NODE_ENV=production
RUN npm run build

# ================================
# Production Stage
# ================================
FROM nginx:alpine AS production

# Add labels for better container management
LABEL maintainer="Neverland Studio <hello@neverlandstudio.my.id>"
LABEL description="Neverland Studio Portfolio - Production Frontend"

# Install curl for healthchecks
RUN apk add --no-cache curl

# Remove default nginx static assets and config
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx cache directories
RUN mkdir -p /var/cache/nginx/client_temp \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
