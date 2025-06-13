const express = require("express");
const {
  createReview,
  getUserReviews,
  getGivenReviews,
  updateReview,
  deleteReview,
  getReviewStats,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");
const {
  validateReview,
  validateReviewUpdate,
} = require("../middleware/validator");
const rateLimit = require("express-rate-limit");

const router = express.Router();
// Rate limiting for review creation
const createReviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each user to 5 review creations per windowMs
  message: {
    success: false,
    message: "Too many review attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
router.get("/my/stats", protect, getReviewStats);
router.get("/given", protect, getGivenReviews);
router.post("/", protect, createReviewLimiter, validateReview, createReview);
router.get("/user/:userId", getUserReviews);
router.put("/:reviewId", protect, validateReviewUpdate, updateReview);
router.delete("/:reviewId", protect, deleteReview);

module.exports = router;
