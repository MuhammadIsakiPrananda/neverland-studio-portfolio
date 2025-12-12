# Simple Production Dockerfile for Backend
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy application code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 5000

# Jalankan migrasi sebelum start server
CMD npx sequelize-cli db:migrate && node server.js