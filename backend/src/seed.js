const bcrypt = require("bcryptjs");
const connectDB = require("./db");
const { User, SellerProfile, Package, Category, City, Ad, AdMedia, Payment, LearningQuestion, SystemHealthLog } = require("./models");
const { normalizeMediaUrl } = require("./utils/media");
const { calculateRank } = require("./utils/ranking");

const imagePool = [
  "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop",
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
];

async function upsertUser(name, email, role) {
  const passwordHash = await bcrypt.hash("password123", 10);
  return User.findOneAndUpdate({ email }, { name, email, role, passwordHash, status: "active" }, { upsert: true, new: true });
}

async function seed() {
  await connectDB();
  await Promise.all([User.deleteMany({}), SellerProfile.deleteMany({}), Package.deleteMany({}), Category.deleteMany({}), City.deleteMany({}), Ad.deleteMany({}), AdMedia.deleteMany({}), Payment.deleteMany({}), LearningQuestion.deleteMany({}), SystemHealthLog.deleteMany({})]);

  const [client, moderator, admin, superAdmin] = await Promise.all([
    upsertUser("Ayesha Client", "client@adflow.test", "client"),
    upsertUser("Musa Moderator", "moderator@adflow.test", "moderator"),
    upsertUser("Noor Admin", "admin@adflow.test", "admin"),
    upsertUser("Sana Super Admin", "super@adflow.test", "super_admin")
  ]);
  await SellerProfile.create({ user: client._id, displayName: "Ayesha Market Studio", businessName: "Ayesha Studio", phone: "+92 300 1234567", city: "Lahore", isVerified: true });

  const packages = await Package.insertMany([
    { name: "Basic", slug: "basic", durationDays: 7, weight: 1, price: 1500, benefits: ["7 day listing", "Public search visibility"], refreshRule: "none" },
    { name: "Standard", slug: "standard", durationDays: 15, weight: 2, price: 3200, benefits: ["Category priority", "Manual refresh"], refreshRule: "manual refresh" },
    { name: "Premium", slug: "premium", durationDays: 30, weight: 3, price: 6500, isFeatured: true, homepagePlacement: true, benefits: ["Homepage featured", "Auto refresh every 3 days"], refreshRule: "auto every 3 days" }
  ]);
  const categories = await Category.insertMany(["Vehicles", "Property", "Jobs", "Services", "Electronics", "Education"].map((name) => ({ name, slug: name.toLowerCase() })));
  const cities = await City.insertMany(["Lahore", "Karachi", "Islamabad", "Faisalabad", "Multan"].map((name) => ({ name, slug: name.toLowerCase() })));

  const titles = [
    "Premium coworking desks near Gulberg", "Verified home tutor for O level maths", "Hybrid SUV with complete service history",
    "Boutique apartment for short stays", "Startup brand photography package", "Gaming laptop with warranty",
    "Digital marketing retainer for SMEs", "Warehouse space near ring road", "Language course admissions open",
    "Wedding stage decor premium setup", "Executive office chair clearance", "Solar consultation and installation",
    "City tour transport service", "Restaurant POS setup package", "Graphic designer monthly contract",
    "Modern studio flat with parking", "Event sound system rental", "Imported kitchen appliance bundle"
  ];

  for (let i = 0; i < titles.length; i += 1) {
    const pkg = packages[i % packages.length];
    const publishAt = new Date(Date.now() - i * 7 * 60 * 60 * 1000);
    const expireAt = new Date(publishAt.getTime() + pkg.durationDays * 24 * 60 * 60 * 1000);
    const ad = await Ad.create({
      user: client._id,
      package: pkg._id,
      title: titles[i],
      slug: `${titles[i].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${i + 1}`,
      category: categories[i % categories.length]._id,
      city: cities[i % cities.length]._id,
      description: "A moderated marketplace sample listing with external media, package ranking, payment verification, and expiry rules.",
      price: 12000 + i * 2500,
      sellerPhone: `+92 300 5550${String(i).padStart(3, "0")}`,
      status: i < 14 ? "published" : i === 14 ? "under_review" : i === 15 ? "payment_pending" : "scheduled",
      publishAt,
      expireAt,
      isFeatured: pkg.isFeatured,
      adminBoost: i % 4 === 0 ? 8 : 0
    });
    ad.rankScore = calculateRank(ad, pkg, { isVerified: true });
    await ad.save();
    await AdMedia.create({ ad: ad._id, ...normalizeMediaUrl(imagePool[i % imagePool.length]) });
    if (["published", "scheduled"].includes(ad.status)) {
      await Payment.create({ ad: ad._id, user: client._id, package: pkg._id, amount: pkg.price, method: "bank_transfer", transactionRef: `TXN-${10000 + i}`, senderName: "Ayesha Client", status: "verified", verifiedBy: admin._id, verifiedAt: new Date() });
    }
  }

  await LearningQuestion.insertMany([
    { question: "Why are expired ads hidden before search filters run?", answer: "It prevents stale listings from leaking into public results.", topic: "Workflow", difficulty: "medium" },
    { question: "What does media normalization store for a YouTube URL?", answer: "The original URL, source type, validation status, and generated thumbnail URL.", topic: "Media", difficulty: "easy" },
    { question: "Which roles can verify payment records?", answer: "Admin and super admin accounts.", topic: "RBAC", difficulty: "easy" }
  ]);
  await SystemHealthLog.create({ source: "seed", responseMs: 4, status: "ok", message: "Seed completed." });
  console.log("Seed complete. Logins: client/moderator/admin/super @adflow.test, password password123");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});


