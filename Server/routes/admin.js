// /routes/admin.js
const express = require("express");
const { getAllUsers, deleteUser } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");
const router = express.Router();

// @route   GET /api/admin/users
router.get("/users", protect, adminOnly, getAllUsers);

// @route   DELETE /api/admin/users/:id
router.delete("/users/:id", protect, adminOnly, deleteUser);

module.exports = router;
