# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine AS production

# Copy the Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Switch to the non-root user
USER appuser

# Copy the built React application from the builder stage
COPY --chown=appuser:appgroup --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 and start Nginx
EXPOSE 80
# Jalankan Nginx di foreground agar container tetap berjalan
CMD ["nginx", "-g", "daemon off;"]