const express = require("express");
const { Ad, AdMedia, Category, City, Package, LearningQuestion, SellerProfile } = require("../models");

const router = express.Router();
const activeFilter = { status: "published", $or: [{ expireAt: { $exists: false } }, { expireAt: { $gt: new Date() } }] };

router.get("/meta", async (req, res) => {
  const [packages, categories, cities] = await Promise.all([
    Package.find({ isActive: true }).sort({ weight: 1 }),
    Category.find({ isActive: true }).sort({ name: 1 }),
    City.find({ isActive: true }).sort({ name: 1 })
  ]);
  res.json({ packages, categories, cities });
});

router.get("/packages", async (req, res) => {
  res.json(await Package.find({ isActive: true }).sort({ weight: 1 }));
});

router.get("/ads", async (req, res) => {
  const { q, category, city, sort = "rank", page = 1, limit = 12 } = req.query;
  const filter = { ...activeFilter };
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (city) filter.city = city;
  const sortMap = { newest: { publishAt: -1 }, expiring: { expireAt: 1 }, rank: { isFeatured: -1, rankScore: -1, publishAt: -1 } };
  const skip = (Number(page) - 1) * Number(limit);
  const [ads, total] = await Promise.all([
    Ad.find(filter).populate("package category city user", "name slug weight isFeatured durationDays").sort(sortMap[sort] || sortMap.rank).skip(skip).limit(Number(limit)),
    Ad.countDocuments(filter)
  ]);
  const media = await AdMedia.find({ ad: { $in: ads.map((ad) => ad._id) } });
  res.json({ data: ads.map((ad) => ({ ...ad.toObject(), media: media.filter((m) => String(m.ad) === String(ad._id)) })), total, page: Number(page) });
});

router.get("/ads/:slug", async (req, res) => {
  const ad = await Ad.findOne({ slug: req.params.slug, ...activeFilter }).populate("package category city user", "name email");
  if (!ad) return res.status(404).json({ message: "Ad not found" });
  ad.viewCount += 1;
  await ad.save();
  const [media, seller] = await Promise.all([AdMedia.find({ ad: ad._id }), SellerProfile.findOne({ user: ad.user._id })]);
  res.json({ ...ad.toObject(), media, seller });
});

router.post("/ads/:slug/report", async (req, res) => {
  const ad = await Ad.findOne({ slug: req.params.slug });
  if (!ad) return res.status(404).json({ message: "Ad not found" });
  ad.reportCount += 1;
  await ad.save();
  res.json({ message: "Report received. A moderator will review this listing." });
});

router.get("/questions/random", async (req, res) => {
  const [question] = await LearningQuestion.aggregate([{ $match: { isActive: true } }, { $sample: { size: 1 } }]);
  res.json(question || { question: "What does RBAC protect in AdFlow Pro?", answer: "Role-based access keeps client, moderator, admin, and super-admin actions separate." });
});

module.exports = router;
