function calculateRank(ad, pkg, seller) {
  const publishedAt = ad.publishAt || ad.updatedAt || new Date();
  const ageHours = Math.max(0, (Date.now() - new Date(publishedAt).getTime()) / 36e5);
  const freshnessPoints = Math.max(0, 25 - Math.floor(ageHours / 8));
  const featured = ad.isFeatured || Boolean(pkg && pkg.isFeatured);
  const verifiedSellerPoints = seller && seller.isVerified ? 10 : 0;
  return (featured ? 50 : 0) + ((pkg && pkg.weight ? pkg.weight : 1) * 10) + freshnessPoints + (ad.adminBoost || 0) + verifiedSellerPoints;
}

module.exports = { calculateRank };


