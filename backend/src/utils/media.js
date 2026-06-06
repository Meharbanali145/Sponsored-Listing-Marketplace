const imagePattern = /\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i;

function youtubeId(url) {
  const match = String(url).match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

function normalizeMediaUrl(originalUrl) {
  try {
    const parsed = new URL(originalUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Only public http/https URLs are allowed.");
    const videoId = youtubeId(originalUrl);
    if (videoId) {
      return {
        sourceType: "youtube",
        originalUrl,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        validationStatus: "valid"
      };
    }
    if (!imagePattern.test(parsed.pathname)) throw new Error("Image URL must end with png, jpg, jpeg, webp, gif, or avif.");
    return { sourceType: "image", originalUrl, thumbnailUrl: originalUrl, validationStatus: "valid" };
  } catch (error) {
    return {
      sourceType: "unknown",
      originalUrl,
      thumbnailUrl: "https://placehold.co/900x600/111827/f8fafc?text=Media+Unavailable",
      validationStatus: "invalid",
      validationMessage: error.message
    };
  }
}

module.exports = { normalizeMediaUrl };
