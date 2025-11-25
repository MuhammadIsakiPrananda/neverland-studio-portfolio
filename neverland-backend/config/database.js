// config/database.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Memuat variabel lingkungan dari file .env
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    // Menggunakan dialek 'mariadb' karena driver mariadb yang diinstal
    dialect: 'mariadb',
    logging: false, // Set ke `console.log` untuk melihat query SQL
  }
);

export default sequelize;
