require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/adflow_pro",
  jwtSecret: process.env.JWT_SECRET || "dev_adflow_secret",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  cronEnabled: process.env.CRON_ENABLED !== "false"
};
