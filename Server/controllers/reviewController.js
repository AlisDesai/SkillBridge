// /controllers/reviewController.js
const Review = require("../models/Review");

// Post a review
exports.createReview = async (req, res, next) => {
  try {
    const { reviewee, rating, comment, matchId } = req.body;
    const review = await Review.create({
      reviewer: req.user._id,
      reviewee,
      rating,
      comment,
      matchId,
    });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

// Get all reviews for a user
exports.getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};
