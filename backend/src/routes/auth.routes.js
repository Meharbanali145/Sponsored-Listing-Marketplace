const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const { jwtSecret } = require("../config");
const { User, SellerProfile } = require("../models");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function tokenFor(user) {
  return jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: "7d" });
}

router.post("/register", [
  body("name").isLength({ min: 2 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  const { name, email, password, role = "client", phone, city, businessName } = req.body;
  if (!["client", "moderator", "admin", "super_admin"].includes(role)) return res.status(422).json({ message: "Invalid role" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already registered" });
  const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 10), role });
  if (role === "client") await SellerProfile.create({ user: user._id, displayName: name, phone, city, businessName });
  res.status(201).json({ token: tokenFor(user), user: { id: user._id, name, email, role } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: "Invalid credentials" });
  res.json({ token: tokenFor(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "No account found with this email" });

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpire = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  res.json({
    message: "Password reset token generated. In production this token should be sent by email.",
    resetToken
  });
});

router.post("/reset-password", async (req, res) => {
  const { email, resetToken, newPassword } = req.body;
  if (!email || !resetToken || !newPassword) return res.status(400).json({ message: "Email, token, and new password are required" });
  if (newPassword.length < 6) return res.status(422).json({ message: "Password must be at least 6 characters" });

  const user = await User.findOne({
    email,
    resetToken,
    resetTokenExpire: { $gt: new Date() }
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;
  await user.save();

  res.json({ message: "Password reset successfully. You can login with your new password." });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
