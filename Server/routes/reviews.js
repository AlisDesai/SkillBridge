// /routes/reviews.js
const express = require('express');
const { createReview, getUserReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/reviews
router.post('/', protect, createReview);

// @route   GET /api/reviews/:userId
router.get('/:userId', getUserReviews);

module.exports = router;
