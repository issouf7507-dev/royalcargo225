module.exports = {
  apps: [
    {
      name: "royalcargo",
      script: "npm",
      args: "start",
      cwd: "/var/www/webapp/royalcargo/current",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "/var/www/webapp/royalcargo/logs/err.log",
      out_file: "/var/www/webapp/royalcargo/logs/out.log",
      log_file: "/var/www/webapp/royalcargo/logs/combined.log",
      time: true,
    },
  ],
};
