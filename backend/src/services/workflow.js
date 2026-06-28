const { AdStatusHistory, AuditLog, Notification } = require("../models");

async function recordStatus(ad, newStatus, actor, note) {
  const previousStatus = ad.status;
  ad.status = newStatus;
  await ad.save();
  await AdStatusHistory.create({ ad: ad._id, previousStatus, newStatus, changedBy: actor && actor._id, note });
  await AuditLog.create({
    actor: actor && actor._id,
    actionType: "status_change",
    targetType: "ad",
    targetId: ad._id,
    oldValue: previousStatus,
    newValue: newStatus
  });
  if (String(ad.user) !== String(actor && actor._id)) {
    await Notification.create({
      user: ad.user,
      title: `Ad moved to ${newStatus.replace("_", " ")}`,
      message: note || `Your listing "${ad.title}" changed status.`,
      type: newStatus.includes("rejected") ? "warning" : "workflow",
      link: `/client`
    });
  }
}

module.exports = { recordStatus };


