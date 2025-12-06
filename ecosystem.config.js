module.exports = {
  apps: [
    {
      name: "neverland-backend",
      script: "server.js",
      cwd: "./neverland-backend",
      instances: 2,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      max_memory_restart: "1G",
      error_file: "./neverland-backend/logs/pm2-error.log",
      out_file: "./neverland-backend/logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
};
