// config/database.js - Flexible database configuration
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

import logger from "../utils/logger.js";

// Detect environment
const isDevelopment = process.env.NODE_ENV !== "production";
const dbHost =
  process.env.DB_HOST || (isDevelopment ? "localhost" : "mariadb-neverland");
const isLocalhost = ["localhost", "127.0.0.1"].includes(dbHost);

const sequelize = new Sequelize(
  process.env.DB_NAME || "neverlandstudio",
  process.env.DB_USER || (isDevelopment ? "root" : "root"),
  process.env.DB_PASSWORD || (isDevelopment ? "" : "root"),
  {
    host: dbHost,
    port: parseInt(process.env.DB_PORT || "3306", 10),
    dialect: "mariadb", // Always use mariadb for better compatibility
    logging: isDevelopment
      ? (msg) => logger.debug(msg, { component: "sequelize" })
      : false,
    pool: {
      max: isDevelopment ? 5 : 10,
      min: isDevelopment ? 0 : 2,
      acquire: 60000,
      idle: 10000,
    },
    dialectOptions: {
      connectTimeout: 60000,
      timezone: "+00:00",
      charset: "utf8mb4",
    },
    // Retry connection in development
    retry: {
      max: isDevelopment ? 3 : 1,
      timeout: 3000,
    },
  }
);

export default sequelize;
