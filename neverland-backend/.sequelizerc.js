import path from "path";
import { fileURLToPath } from "url";
import config from "./config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  development: {
    username: config.database.user,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    port: config.database.port,
    dialect: "mariadb",
    dialectOptions: {
      charset: "utf8mb4",
      timezone: "+00:00",
    },
    logging: false,
  },
  production: {
    username: config.database.user,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    port: config.database.port,
    dialect: "mariadb",
    dialectOptions: {
      charset: "utf8mb4",
      timezone: "+00:00",
      connectTimeout: 10000,
    },
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
  },
};

export default {
  config: dbConfig[process.env.NODE_ENV || "production"],
  "migrations-path": path.join(__dirname, "migrations"),
  "seeders-path": path.join(__dirname, "seeders"),
  "models-path": path.join(__dirname, "models"),
};
