const express = require("express");
const slugify = require("slugify");
const { Ad, AdMedia, Payment, Notification, Package, SellerProfile } = require("../models");
const { requireAuth, allowRoles } = require("../middleware/auth");
const { normalizeMediaUrl } = require("../utils/media");
const { recordStatus } = require("../services/workflow");

const router = express.Router();
router.use(requireAuth, allowRoles("client", "admin", "super_admin"));

router.get("/dashboard", async (req, res) => {
  const ads = await Ad.find({ user: req.user._id }).populate("package category city").sort({ updatedAt: -1 });
  const payments = await Payment.find({ user: req.user._id }).sort({ updatedAt: -1 });
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(12);
  const media = await AdMedia.find({ ad: { $in: ads.map((ad) => ad._id) } });
  res.json({ ads: ads.map((ad) => ({ ...ad.toObject(), media: media.filter((m) => String(m.ad) === String(ad._id)) })), payments, notifications });
});

router.post("/ads", async (req, res) => {
  const { title, category, city, description, price, sellerPhone, package: packageId, mediaUrls = [], submit = false } = req.body;
  const baseSlug = slugify(title, { lower: true, strict: true });
  const slug = `${baseSlug}-${Date.now().toString(36)}`;
  const duplicateFlag = Boolean(sellerPhone && await Ad.exists({ sellerPhone, status: { $nin: ["archived", "expired"] } }));
  const ad = await Ad.create({ user: req.user._id, package: packageId, title, slug, category, city, description, price, sellerPhone, duplicateFlag, status: submit ? "submitted" : "draft" });
  await Promise.all(mediaUrls.filter(Boolean).map((url) => AdMedia.create({ ad: ad._id, ...normalizeMediaUrl(url) })));
  if (submit) await recordStatus(ad, "under_review", req.user, "Client submitted listing for moderation.");
  res.status(201).json({ message: "Ad saved", ad });
});

router.patch("/ads/:id", async (req, res) => {
  const ad = await Ad.findOne({ _id: req.params.id, user: req.user._id });
  if (!ad) return res.status(404).json({ message: "Ad not found" });
  if (!["draft", "submitted", "rejected"].includes(ad.status)) return res.status(409).json({ message: "Published or paid ads require admin review for critical edits." });
  Object.assign(ad, req.body);
  if (req.body.submit) await recordStatus(ad, "under_review", req.user, "Client resubmitted listing.");
  else await ad.save();
  res.json({ message: "Ad updated", ad });
});

router.post("/payments", async (req, res) => {
  const { ad: adId, package: packageId, method, transactionRef, senderName, screenshotUrl } = req.body;
  const ad = await Ad.findOne({ _id: adId, user: req.user._id });
  if (!ad) return res.status(404).json({ message: "Ad not found" });
  if (!["payment_pending", "rejected"].includes(ad.status)) return res.status(409).json({ message: "Ad is not waiting for payment." });
  const pkg = await Package.findById(packageId || ad.package);
  if (!pkg) return res.status(404).json({ message: "Package not found" });
  const payment = await Payment.create({ ad: ad._id, user: req.user._id, package: pkg._id, amount: pkg.price, method, transactionRef, senderName, screenshotUrl });
  ad.package = pkg._id;
  await recordStatus(ad, "payment_submitted", req.user, "Payment proof submitted.");
  res.status(201).json({ message: "Payment submitted", payment });
});

router.patch("/profile", async (req, res) => {
  const profile = await SellerProfile.findOneAndUpdate({ user: req.user._id }, req.body, { new: true, upsert: true });
  res.json({ message: "Seller profile updated", profile });
});

module.exports = router;


