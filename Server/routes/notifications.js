const express = require("express");
const { protect } = require("../middleware/auth");
const {
  createNotification,
  getMyNotifications,
  markAsRead,
} = require("../controllers/notificationController");

const router = express.Router();

router.post("/", protect, createNotification);
router.get("/", protect, getMyNotifications);
router.put("/:id/read", protect, markAsRead);

module.exports = router;
