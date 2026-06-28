const cron = require("node-cron");
const mongoose = require("mongoose");
const { Ad, SystemHealthLog, Notification, SellerProfile } = require("../models");
const { calculateRank } = require("../utils/ranking");

async function publishScheduledAds() {
  const due = await Ad.find({ status: "scheduled", publishAt: { $lte: new Date() } }).populate("package");
  for (const ad of due) {
    const seller = await SellerProfile.findOne({ user: ad.user });
    ad.status = "published";
    ad.rankScore = calculateRank(ad, ad.package, seller);
    await ad.save();
  }
  return due.length;
}

async function expireAds() {
  const result = await Ad.updateMany({ status: "published", expireAt: { $lte: new Date() } }, { $set: { status: "expired" } });
  return result.modifiedCount || 0;
}

async function notifyExpiringSoon() {
  const soon = new Date(Date.now() + 48 * 60 * 60 * 1000);
  const ads = await Ad.find({ status: "published", expireAt: { $lte: soon, $gt: new Date() } });
  await Promise.all(ads.map((ad) => Notification.create({
    user: ad.user,
    title: "Listing expires soon",
    message: `${ad.title} will expire within 48 hours.`,
    type: "expiry",
    link: "/client"
  })));
  return ads.length;
}

async function heartbeat() {
  const started = Date.now();
  await SystemHealthLog.create({
    source: "cron-heartbeat",
    responseMs: Date.now() - started,
    status: mongoose.connection.readyState === 1 ? "ok" : "failed",
    message: "Scheduled database heartbeat."
  });
}

function startCron() {
  cron.schedule("0 * * * *", publishScheduledAds);
  cron.schedule("15 0 * * *", expireAds);
  cron.schedule("30 8 * * *", notifyExpiringSoon);
  cron.schedule("*/20 * * * *", heartbeat);
}

module.exports = { startCron, publishScheduledAds, expireAds, notifyExpiringSoon, heartbeat };


