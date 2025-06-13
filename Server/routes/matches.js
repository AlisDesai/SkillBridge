const express = require("express");
const {
  requestMatch,
  respondToMatch,
  getMyMatches,
  getMatchById,
  findCompatibleUsers,
  checkMatch,
  checkExistingMatch,
  requestCompletion, // existing import
} = require("../controllers/matchController");
const { createMatchReview } = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// existing routes...
router.get("/suggestions", protect, findCompatibleUsers);
router.post("/", protect, requestMatch);
router.put("/:id", protect, respondToMatch);
router.get("/", protect, getMyMatches);
router.get("/:id", protect, getMatchById);
router.post("/:id/complete", protect, requestCompletion);
router.post("/:id/review", protect, createMatchReview);

module.exports = router;
