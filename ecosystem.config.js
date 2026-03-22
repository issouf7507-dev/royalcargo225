module.exports = {
  apps: [
    {
      name: "royalcargo",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/home/dev-issouf/apps/royalcargo225",
      instances: 1,
      exec_mode: "fork", // ou "cluster" si besoin
      watch: false,
      autorestart: true,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3003,
      },
    },
  ],
};
