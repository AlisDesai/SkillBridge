// /routes/admin.js

const { adminOnly } = require("../middleware/admin");

const express = require("express");
const { getAllUsers, deleteUser } = require("../controllers/adminController");
const { protect } = require("../middleware/auth");
const router = express.Router();

const {
  getAdminStats,
  updateUser,
  getAllReviews,
  deleteReview,
  getAllSkills,
  deleteSkill,
} = require("../controllers/adminController");

router.get("/stats", protect, adminOnly, getAdminStats);
router.put("/users/:id", protect, adminOnly, updateUser);
router.get("/reviews", protect, adminOnly, getAllReviews);
router.delete("/reviews/:id", protect, adminOnly, deleteReview);
router.get("/skills", protect, adminOnly, getAllSkills);
router.delete("/skills/:id", protect, adminOnly, deleteSkill);

// @route   GET /api/admin/users
router.get("/users", protect, adminOnly, getAllUsers);

// @route   DELETE /api/admin/users/:id
router.delete("/users/:id", protect, adminOnly, deleteUser);

module.exports = router;
