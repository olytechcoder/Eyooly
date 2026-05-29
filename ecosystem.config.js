/**
 * PM2 Ecosystem Configuration for Eyooly
 *
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 start ecosystem.config.js --env production
 *   pm2 save && pm2 startup
 */

module.exports = {
  apps: [
    {
      name: "eyooly",
      script: "npm",
      args: "start",
      cwd: "/var/www/eyooly",   // ← Update this to your actual project path

      // Environment
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      // Process management
      instances: 1,             // Use "max" to use all CPU cores (cluster mode)
      exec_mode: "fork",        // Use "cluster" for multi-core
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",

      // Logging
      log_file: "/var/log/eyooly/combined.log",
      out_file: "/var/log/eyooly/out.log",
      error_file: "/var/log/eyooly/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,

      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
};
