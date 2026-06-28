const express = require("express");
const { Ad, Payment, Package, Category, City, User, SystemHealthLog, SellerProfile } = require("../models");
const { requireAuth, allowRoles } = require("../middleware/auth");
const { recordStatus } = require("../services/workflow");
const { calculateRank } = require("../utils/ranking");

const router = express.Router();
router.use(requireAuth, allowRoles("admin", "super_admin"));

router.get("/payment-queue", async (req, res) => {
  res.json(await Payment.find({ status: "submitted" }).populate({ path: "ad", populate: ["category", "city"] }).populate("user package").sort({ createdAt: 1 }));
});

router.get("/publish-queue", async (req, res) => {
  res.json(await Ad.find({ status: { $in: ["payment_verified", "scheduled"] } }).populate("user package category city").sort({ updatedAt: 1 }));
});

router.patch("/payments/:id/verify", async (req, res) => {
  const { decision, note } = req.body;
  const payment = await Payment.findById(req.params.id).populate("package");
  if (!payment) return res.status(404).json({ message: "Payment not found" });
  const ad = await Ad.findById(payment.ad);
  if (!ad) return res.status(404).json({ message: "Ad not found" });
  payment.status = decision === "reject" ? "rejected" : "verified";
  payment.adminNote = note;
  payment.verifiedBy = req.user._id;
  payment.verifiedAt = new Date();
  await payment.save();
  if (decision === "reject") await recordStatus(ad, "rejected", req.user, note || "Payment rejected.");
  else await recordStatus(ad, "payment_verified", req.user, "Payment verified. Ready to publish.");
  res.json({ message: "Payment verification saved", payment });
});

router.patch("/ads/:id/publish", async (req, res) => {
  const { publishAt, adminBoost = 0, isFeatured } = req.body;
  const ad = await Ad.findById(req.params.id).populate("package");
  if (!ad) return res.status(404).json({ message: "Ad not found" });
  const payment = await Payment.findOne({ ad: ad._id, status: "verified" });
  if (!payment) return res.status(409).json({ message: "A verified payment is required before publishing." });
  const seller = await SellerProfile.findOne({ user: ad.user });
  const publishDate = publishAt ? new Date(publishAt) : new Date();
  ad.publishAt = publishDate;
  ad.expireAt = new Date(publishDate.getTime() + ad.package.durationDays * 24 * 60 * 60 * 1000);
  ad.adminBoost = adminBoost;
  ad.isFeatured = typeof isFeatured === "boolean" ? isFeatured : ad.package.isFeatured;
  ad.rankScore = calculateRank(ad, ad.package, seller);
  await recordStatus(ad, publishDate > new Date() ? "scheduled" : "published", req.user, "Admin completed publishing controls.");
  res.json({ message: "Publishing updated", ad });
});

router.get("/analytics/summary", async (req, res) => {
  const [adsByStatus, revenueByPackage, byCategory, byCity, users, health] = await Promise.all([
    Ad.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Payment.aggregate([{ $match: { status: "verified" } }, { $lookup: { from: "packages", localField: "package", foreignField: "_id", as: "pkg" } }, { $unwind: "$pkg" }, { $group: { _id: "$pkg.name", total: { $sum: "$amount" }, count: { $sum: 1 } } }]),
    Ad.aggregate([{ $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "cat" } }, { $unwind: "$cat" }, { $group: { _id: "$cat.name", count: { $sum: 1 } } }]),
    Ad.aggregate([{ $lookup: { from: "cities", localField: "city", foreignField: "_id", as: "city" } }, { $unwind: "$city" }, { $group: { _id: "$city.name", count: { $sum: 1 } } }]),
    User.countDocuments(),
    SystemHealthLog.find().sort({ createdAt: -1 }).limit(8)
  ]);
  res.json({ adsByStatus, revenueByPackage, byCategory, byCity, users, health });
});

router.get("/management", async (req, res) => {
  const [packages, categories, cities, users, ads] = await Promise.all([Package.find(), Category.find(), City.find(), User.find().select("-passwordHash"), Ad.find().populate("user package category city").sort({ updatedAt: -1 }).limit(50)]);
  res.json({ packages, categories, cities, users, ads });
});

module.exports = router;


