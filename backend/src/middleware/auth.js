const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");
const { User } = require("../models");

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : req.cookies.token;
    if (!token) return res.status(401).json({ message: "Authentication required" });
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload.id).select("-passwordHash");
    if (!user || user.status !== "active") return res.status(401).json({ message: "Invalid account" });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Access denied" });
    next();
  };
}

module.exports = { requireAuth, allowRoles };
