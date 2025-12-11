// utils/migrationRunner.js
import { exec } from "child_process";
import { promisify } from "util";
import logger from "./logger.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const execPromise = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Run database migrations automatically
 * @returns {Promise<boolean>} - Success status
 */
export const runMigrations = async () => {
  try {
    logger.info("🔄 Running database migrations...");

    const projectRoot = join(__dirname, "..");

    // Run sequelize migrations
    const { stdout, stderr } = await execPromise(
      "npx sequelize-cli db:migrate",
      {
        cwd: projectRoot,
        env: { ...process.env },
      }
    );

    if (stdout) {
      logger.info("Migration output:", stdout);
    }

    if (stderr && !stderr.includes("Sequelize CLI")) {
      logger.warn("Migration warnings:", stderr);
    }

    logger.info("✅ Database migrations completed successfully");
    return true;
  } catch (error) {
    // Check if error is "No migrations were executed"
    if (
      error.message?.includes("No migrations were executed") ||
      error.stdout?.includes("No migrations were executed")
    ) {
      logger.info("✅ Database is up to date - no migrations needed");
      return true;
    }

    logger.error("❌ Migration failed:", {
      error: error.message,
      stdout: error.stdout,
      stderr: error.stderr,
    });

    return false;
  }
};

/**
 * Check if migrations table exists and create if needed
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<boolean>}
 */
export const ensureMigrationsTable = async (sequelize) => {
  try {
    const queryInterface = sequelize.getQueryInterface();

    // Check if SequelizeMeta table exists
    const tables = await queryInterface.showAllTables();

    if (!tables.includes("SequelizeMeta")) {
      logger.info("📋 Creating migrations tracking table...");
      await queryInterface.createTable("SequelizeMeta", {
        name: {
          type: sequelize.Sequelize.STRING,
          allowNull: false,
          unique: true,
          primaryKey: true,
        },
      });
      logger.info("✅ Migrations tracking table created");
    }

    return true;
  } catch (error) {
    logger.error("Error ensuring migrations table:", error.message);
    return false;
  }
};

export default {
  runMigrations,
  ensureMigrationsTable,
};
