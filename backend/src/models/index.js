const mongoose = require("mongoose");

const { Schema } = mongoose;
const roles = ["client", "moderator", "admin", "super_admin"];
const statuses = ["draft", "submitted", "under_review", "payment_pending", "payment_submitted", "payment_verified", "scheduled", "published", "expired", "archived", "rejected"];

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  resetToken: String,
  resetTokenExpire: Date,
  role: { type: String, enum: roles, default: "client" },
  status: { type: String, enum: ["active", "suspended"], default: "active" }
}, { timestamps: true });

const sellerProfileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  displayName: String,
  businessName: String,
  phone: String,
  city: String,
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

const packageSchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  durationDays: { type: Number, required: true },
  weight: { type: Number, required: true },
  price: { type: Number, required: true },
  isFeatured: { type: Boolean, default: false },
  homepagePlacement: { type: Boolean, default: false },
  refreshRule: { type: String, default: "none" },
  benefits: [String],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const taxonomySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const adSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  package: { type: Schema.Types.ObjectId, ref: "Package" },
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  city: { type: Schema.Types.ObjectId, ref: "City", required: true },
  description: { type: String, required: true },
  price: Number,
  sellerPhone: String,
  status: { type: String, enum: statuses, default: "draft", index: true },
  rejectionReason: String,
  moderationNotes: String,
  adminBoost: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  duplicateFlag: { type: Boolean, default: false },
  publishAt: Date,
  expireAt: Date,
  rankScore: { type: Number, default: 0, index: true },
  viewCount: { type: Number, default: 0 },
  reportCount: { type: Number, default: 0 }
}, { timestamps: true });

const mediaSchema = new Schema({
  ad: { type: Schema.Types.ObjectId, ref: "Ad", required: true },
  sourceType: { type: String, enum: ["image", "youtube", "unknown"], default: "unknown" },
  originalUrl: { type: String, required: true },
  thumbnailUrl: String,
  validationStatus: { type: String, enum: ["valid", "invalid"], default: "valid" },
  validationMessage: String
}, { timestamps: true });

const paymentSchema = new Schema({
  ad: { type: Schema.Types.ObjectId, ref: "Ad", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  package: { type: Schema.Types.ObjectId, ref: "Package", required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  transactionRef: { type: String, required: true, unique: true },
  senderName: { type: String, required: true },
  screenshotUrl: String,
  status: { type: String, enum: ["submitted", "verified", "rejected"], default: "submitted" },
  adminNote: String,
  verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
  verifiedAt: Date
}, { timestamps: true });

const notificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  message: String,
  type: { type: String, default: "info" },
  isRead: { type: Boolean, default: false },
  link: String
}, { timestamps: true });

const auditLogSchema = new Schema({
  actor: { type: Schema.Types.ObjectId, ref: "User" },
  actionType: String,
  targetType: String,
  targetId: Schema.Types.ObjectId,
  oldValue: Schema.Types.Mixed,
  newValue: Schema.Types.Mixed
}, { timestamps: true });

const statusHistorySchema = new Schema({
  ad: { type: Schema.Types.ObjectId, ref: "Ad", required: true },
  previousStatus: String,
  newStatus: String,
  changedBy: { type: Schema.Types.ObjectId, ref: "User" },
  note: String
}, { timestamps: true });

const learningQuestionSchema = new Schema({
  question: String,
  answer: String,
  topic: String,
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const healthLogSchema = new Schema({
  source: String,
  responseMs: Number,
  status: { type: String, enum: ["ok", "failed"], default: "ok" },
  message: String
}, { timestamps: true });

module.exports = {
  User: mongoose.model("User", userSchema),
  SellerProfile: mongoose.model("SellerProfile", sellerProfileSchema),
  Package: mongoose.model("Package", packageSchema),
  Category: mongoose.model("Category", taxonomySchema),
  City: mongoose.model("City", taxonomySchema),
  Ad: mongoose.model("Ad", adSchema),
  AdMedia: mongoose.model("AdMedia", mediaSchema),
  Payment: mongoose.model("Payment", paymentSchema),
  Notification: mongoose.model("Notification", notificationSchema),
  AuditLog: mongoose.model("AuditLog", auditLogSchema),
  AdStatusHistory: mongoose.model("AdStatusHistory", statusHistorySchema),
  LearningQuestion: mongoose.model("LearningQuestion", learningQuestionSchema),
  SystemHealthLog: mongoose.model("SystemHealthLog", healthLogSchema)
};
