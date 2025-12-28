# =================================
# Stage 1: Development
# =================================
FROM php:8.2-fpm-alpine AS development

WORKDIR /var/www

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    mysql-client \
    nodejs \
    npm \
    oniguruma-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application files
COPY . /var/www

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

# Don't cache config in development
# Let docker-compose handle commands

EXPOSE 8000

# =================================
# Stage 2: Production
# =================================
FROM php:8.2-fpm-alpine AS production

WORKDIR /var/www

# Install system dependencies (production only)
RUN apk add --no-cache \
    libpng-dev \
    libzip-dev \
    mysql-client \
    oniguruma-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application files
COPY . /var/www

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

# Install production dependencies only
RUN composer install --optimize-autoloader --no-dev --no-interaction

# Generate optimized autoload files
RUN composer dump-autoload --optimize

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD php artisan || exit 1

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
