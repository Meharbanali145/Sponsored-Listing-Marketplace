const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { clientUrl } = require("./config");

const app = express();

const allowedOrigins = [
  clientUrl: process.env.CLIENT_URL || 'https://sponsored-listing-marketplace-1.onrender.com',
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173"
];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => res.json({ name: "AdFlow Pro API", status: "online" }));
app.use("/api", require("./routes/public.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/client", require("./routes/client.routes"));
app.use("/api/moderator", require("./routes/moderator.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/super-admin", require("./routes/super.routes"));
app.use("/api/health", require("./routes/health.routes"));
app.use("/api/cron", require("./routes/cron.routes"));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

module.exports = app;
