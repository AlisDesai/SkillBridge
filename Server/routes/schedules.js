// /routes/schedules.js
const express = require("express");
const { protect } = require("../middleware/auth");
const {
  setTimeSlot,
  confirmTimeSlot,
  getMySessions,
} = require("../controllers/scheduleController");

const router = express.Router();

router.post("/", protect, setTimeSlot);
router.put("/:id/confirm", protect, confirmTimeSlot);
router.get("/", protect, getMySessions);

module.exports = router;
