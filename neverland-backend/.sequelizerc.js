import path from 'path';
import { fileURLToPath } from 'url';
import config from './config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  development: {
    username: config.database.user,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,
    ssl: config.database.dialect === 'postgres' ? false : undefined,
  },
  production: {
    username: config.database.user,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  },
};

export default {
  config: dbConfig[process.env.NODE_ENV || 'development'],
  'migrations-path': path.join(__dirname, 'migrations'),
  'seeders-path': path.join(__dirname, 'seeders'),
  'models-path': path.join(__dirname, 'models'),
};
