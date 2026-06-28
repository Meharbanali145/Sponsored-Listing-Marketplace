const express = require("express");
const mongoose = require("mongoose");
const { SystemHealthLog } = require("../models");

const router = express.Router();

router.get("/db", async (req, res) => {
  const started = Date.now();
  const ok = mongoose.connection.readyState === 1;
  const log = await SystemHealthLog.create({
    source: "manual-db-check",
    responseMs: Date.now() - started,
    status: ok ? "ok" : "failed",
    message: ok ? "MongoDB connection is healthy." : "MongoDB connection is not ready."
  });
  res.status(ok ? 200 : 503).json(log);
});

module.exports = router;


