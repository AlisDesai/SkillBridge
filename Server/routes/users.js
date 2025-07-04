const express = require("express");
const { protect } = require("../middleware/auth");
const { body } = require("express-validator");
const { runValidation } = require("../middleware/validator");
const {
  getProfile,
  updateProfile,
  searchUsers,
  getAllUsers,
  getDashboardStats,
  getUserById, // ADDED
} = require("../controllers/userController");

const router = express.Router();

// Get current logged-in user
router.get("/me", protect, async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (err) {
    next(err);
  }
});

// Get Profile
router.get("/profile", protect, getProfile);

// Update Profile
router.put(
  "/profile",
  [
    protect,
    body("name").optional().isString(),
    body("bio").optional().isString(),
    body("teachSkills").optional().isArray(),
    body("learnSkills").optional().isArray(),
    body("availability").optional().isArray(),
    body("location").optional().isString(),
    runValidation,
  ],
  updateProfile
);

// Get all users for discovery
router.get("/discover", protect, getAllUsers);

// Get dashboard stats
router.get("/dashboard-stats", protect, getDashboardStats);

// Get single user by ID
router.get("/:id", protect, getUserById); // ADDED

// Search Users
router.get("/search", protect, searchUsers);

module.exports = router;
