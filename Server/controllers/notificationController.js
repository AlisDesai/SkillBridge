// /controllers/notificationController.js
const Notification = require("../models/Notification");

// Create notification
exports.createNotification = async (req, res, next) => {
  try {
    const notif = await Notification.create(req.body);
    res.status(201).json(notif);
  } catch (err) {
    next(err);
  }
};

// Get user's notifications
exports.getMyNotifications = async (req, res, next) => {
  try {
    const notifs = await Notification.find({ recipient: req.user._id }).sort(
      "-createdAt"
    );
    res.json(notifs);
  } catch (err) {
    next(err);
  }
};

// Mark notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Marked as read" });
  } catch (err) {
    next(err);
  }
};
