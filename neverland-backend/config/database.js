// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT, // 'mariadb' atau 'mysql'
    logging: false, // Set ke `console.log` untuk melihat query SQL
  }
);

module.exports = sequelize;
