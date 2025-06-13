// /routes/matches.js
const express = require("express");
const {
  requestMatch,
  respondToMatch,
  getMyMatches,
  getMatchById,
  findCompatibleUsers,
  checkMatch, // ADD THIS
} = require("../controllers/matchController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Suggest compatible users (enhanced matching)
router.get("/suggestions", protect, findCompatibleUsers);

// Check if match exists between users
router.get("/check/:userId", protect, checkMatch);

// Create a match request
router.post("/", protect, requestMatch);

// Respond to a match
router.put("/:id", protect, respondToMatch);

// Fetch all matches related to the user
router.get("/", protect, getMyMatches);

// Fetch specific match details
router.get("/:id", protect, getMatchById);

module.exports = router;
