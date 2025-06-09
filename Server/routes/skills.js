const express = require("express");
const router = express.Router();

const {
  addSkill,
  getSkills,
  addTeachSkill,
  addLearnSkill,
  removeTeachSkill,
  removeLearnSkill,
} = require("../controllers/skillController");

const { protect } = require("../middleware/auth");

// Global skill operations
router.post("/", protect, addSkill);
router.get("/", getSkills);

// User-specific skills
router.post("/teach", protect, addTeachSkill);
router.post("/learn", protect, addLearnSkill);
router.delete("/teach/:name", protect, removeTeachSkill);
router.delete("/learn/:name", protect, removeLearnSkill);

module.exports = router;
