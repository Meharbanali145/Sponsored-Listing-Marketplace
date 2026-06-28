const express = require("express");
const slugify = require("slugify");
const { Package, Category, City, LearningQuestion } = require("../models");
const { requireAuth, allowRoles } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth, allowRoles("super_admin"));

router.post("/packages", async (req, res) => {
  const payload = { ...req.body, slug: req.body.slug || slugify(req.body.name, { lower: true, strict: true }) };
  res.status(201).json(await Package.create(payload));
});

router.patch("/packages/:id", async (req, res) => {
  res.json(await Package.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.post("/categories", async (req, res) => {
  res.status(201).json(await Category.create({ ...req.body, slug: req.body.slug || slugify(req.body.name, { lower: true, strict: true }) }));
});

router.post("/cities", async (req, res) => {
  res.status(201).json(await City.create({ ...req.body, slug: req.body.slug || slugify(req.body.name, { lower: true, strict: true }) }));
});

router.post("/questions", async (req, res) => {
  res.status(201).json(await LearningQuestion.create(req.body));
});

module.exports = router;


