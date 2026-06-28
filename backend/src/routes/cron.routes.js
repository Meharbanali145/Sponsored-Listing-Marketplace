const express = require("express");
const { publishScheduledAds, expireAds, notifyExpiringSoon, heartbeat } = require("../cron/jobs");

const router = express.Router();

router.post("/publish-scheduled", async (req, res) => res.json({ published: await publishScheduledAds() }));
router.post("/expire-ads", async (req, res) => res.json({ expired: await expireAds() }));
router.post("/notify-expiring", async (req, res) => res.json({ notified: await notifyExpiringSoon() }));
router.post("/heartbeat", async (req, res) => {
  await heartbeat();
  res.json({ message: "Heartbeat logged" });
});

module.exports = router;


