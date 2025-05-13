// /routes/progress.js
const express = require("express");
const { protect } = require("../middleware/auth");
const {
  recordProgress,
  markAsCompleted,
  getMyProgress,
} = require("../controllers/progressController");

const router = express.Router();

router.post("/", protect, recordProgress);
router.put("/:id/complete", protect, markAsCompleted);
router.get("/", protect, getMyProgress);

module.exports = router;
