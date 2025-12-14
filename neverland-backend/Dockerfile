# Simple Production Dockerfile for Backend
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev for sequelize-cli)
# We need sequelize-cli to run migrations
RUN npm ci && npm cache clean --force

# Copy application code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 5000

# Start script that runs migrations then starts the app
CMD sh -c "npm run db:migrate && node server.js"