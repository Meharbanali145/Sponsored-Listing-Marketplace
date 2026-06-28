const express = require("express");
const { Ad, AdMedia } = require("../models");
const { requireAuth, allowRoles } = require("../middleware/auth");
const { recordStatus } = require("../services/workflow");

const router = express.Router();
router.use(requireAuth, allowRoles("moderator", "admin", "super_admin"));

router.get("/review-queue", async (req, res) => {
  const ads = await Ad.find({ status: { $in: ["under_review", "submitted"] } }).populate("user category city package").sort({ duplicateFlag: -1, createdAt: 1 });
  const media = await AdMedia.find({ ad: { $in: ads.map((ad) => ad._id) } });
  res.json(ads.map((ad) => ({ ...ad.toObject(), media: media.filter((m) => String(m.ad) === String(ad._id)) })));
});

router.patch("/ads/:id/review", async (req, res) => {
  const { decision, note } = req.body;
  const ad = await Ad.findById(req.params.id);
  if (!ad) return res.status(404).json({ message: "Ad not found" });
  ad.moderationNotes = note;
  if (decision === "reject") {
    ad.rejectionReason = note || "Listing rejected by moderator.";
    await recordStatus(ad, "rejected", req.user, ad.rejectionReason);
  } else if (decision === "flag") {
    ad.duplicateFlag = true;
    await ad.save();
  } else {
    await recordStatus(ad, "payment_pending", req.user, "Content approved. Payment required.");
  }
  res.json({ message: "Review saved", ad });
});

module.exports = router;


