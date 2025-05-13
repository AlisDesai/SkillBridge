const express = require("express");
const { protect } = require("../middleware/auth");
const { body } = require("express-validator");
const { runValidation } = require("../middleware/validator");
const {
  getProfile,
  updateProfile,
  searchUsers,
} = require("../controllers/userController");

const router = express.Router();

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
    runValidation,
  ],
  updateProfile
);

// Search Users
router.get("/search", protect, searchUsers);

module.exports = router;
