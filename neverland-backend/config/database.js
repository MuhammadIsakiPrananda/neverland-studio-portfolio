// config/database.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

import logger from '../utils/logger.js';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'neverland_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.NODE_ENV === 'production'
      ? false
      : (msg) => logger.debug(msg, { component: 'sequelize' }),
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 60000,
      timezone: 'UTC',
      ssl: process.env.NODE_ENV === 'production' && process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: true,
      } : false,
    }
  }
);

export default sequelize;