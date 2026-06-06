const mongoose = require("mongoose");
const { mongoUri } = require("./config");
const dns = require("dns")
dns.setServers(["8.8.8.8"])

async function connectDB() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}

module.exports = connectDB;
