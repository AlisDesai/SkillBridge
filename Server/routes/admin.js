const express = require("express");
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/admin");
const router = express.Router();

const {
  getAdminStats,
  getSystemHealth,
  getUserAnalytics,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllReviews,
  deleteReview,
  getAllSkills,
  deleteSkill,
} = require("../controllers/adminController");

// Protect all routes - require authentication and admin role
router.use(protect);
router.use(adminOnly);

// Admin Dashboard Routes
router.get("/stats", getAdminStats);
router.get("/system-health", getSystemHealth);
router.get("/user-analytics", getUserAnalytics);

// User Management Routes
router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Review Management Routes
router.get("/reviews", getAllReviews);
router.delete("/reviews/:id", deleteReview);

// Skill Management Routes
router.get("/skills", getAllSkills);
router.delete("/skills/:id", deleteSkill);

module.exports = router;
