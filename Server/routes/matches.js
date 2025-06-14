// /server/routes/matches.js

const express = require("express");
const {
  requestMatch,
  respondToMatch,
  getMyMatches,
  getMatchById,
  findCompatibleUsers,
  checkMatch,
  checkExistingMatch,
  requestCompletion,
  // Smart matching functions
  getSmartMatches,
  calculateCompatibility,
  refreshSmartMatches,
} = require("../controllers/matchController");
const { createMatchReview } = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Smart matching routes (simplified without cache middleware for now)
router.get("/smart", protect, getSmartMatches);
router.get("/smart/refresh", protect, refreshSmartMatches);
router.get("/compatibility/:targetUserId", protect, calculateCompatibility);

// Existing routes
router.get("/suggestions", protect, findCompatibleUsers);
router.post("/", protect, requestMatch);
router.put("/:id", protect, respondToMatch);
router.get("/", protect, getMyMatches);
router.get("/:id", protect, getMatchById);
router.post("/:id/complete", protect, requestCompletion);
router.post("/:id/review", protect, createMatchReview);

// Utility routes
router.get("/check/:userId", protect, checkExistingMatch);
router.post("/check", protect, checkMatch);

module.exports = router;
