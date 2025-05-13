// /routes/skills.js
const express = require('express');
const { addSkill, getSkills } = require('../controllers/skillController');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/skills
router.post('/', protect, addSkill);

// @route   GET /api/skills
router.get('/', getSkills);

module.exports = router;
