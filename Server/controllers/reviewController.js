const Review = require("../models/Review");
const User = require("../models/User");
const Match = require("../models/Match");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { reviewee, rating, comment, matchId } = req.body;

    // Validation
    if (!reviewee || !rating || !comment) {
      return next(
        new ErrorResponse("Please provide reviewee, rating, and comment", 400)
      );
    }

    if (rating < 1 || rating > 5) {
      return next(new ErrorResponse("Rating must be between 1 and 5", 400));
    }

    if (req.user._id.toString() === reviewee) {
      return next(new ErrorResponse("You cannot review yourself", 400));
    }

    // Check if reviewee exists
    const revieweeUser = await User.findById(reviewee);
    if (!revieweeUser) {
      return next(new ErrorResponse("Reviewee not found", 404));
    }

    // Check if match exists (if matchId provided)
    if (matchId) {
      const match = await Match.findById(matchId);
      if (!match) {
        return next(new ErrorResponse("Match not found", 404));
      }

      // Verify user is part of the match
      const isParticipant =
        match.requester.toString() === req.user._id.toString() ||
        match.receiver.toString() === req.user._id.toString();
      if (!isParticipant) {
        return next(
          new ErrorResponse("You are not authorized to review this match", 403)
        );
      }
    }

    // Check if review already exists for this match
    if (matchId) {
      const existingReview = await Review.findOne({
        reviewer: req.user._id,
        reviewee,
        matchId,
      });

      if (existingReview) {
        return next(
          new ErrorResponse("You have already reviewed this match", 400)
        );
      }
    }

    const review = await Review.create({
      reviewer: req.user._id,
      reviewee,
      rating: parseInt(rating),
      comment: comment.trim(),
      matchId: matchId || null,
    });

    // Populate reviewer and reviewee details
    await review.populate([
      { path: "reviewer", select: "name avatar" },
      { path: "reviewee", select: "name avatar" },
    ]);

    res.status(201).json({
      success: true,
      data: review,
      message: "Review created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a specific user
// @route   GET /api/reviews/user/:userId
// @access  Public
exports.getUserReviews = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Get reviews with pagination
    const reviews = await Review.find({ reviewee: userId })
      .populate("reviewer", "name avatar")
      .populate("reviewee", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({ reviewee: userId });
    const totalPages = Math.ceil(totalReviews / limit);

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      { $match: { reviewee: userId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: "$rating",
          },
        },
      },
    ]);

    const stats = ratingStats[0] || {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: [],
    };

    // Calculate rating distribution
    const distribution = [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: stats.ratingDistribution.filter((r) => r === rating).length,
    }));

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: page,
          totalPages,
          totalReviews,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        statistics: {
          averageRating: Math.round(stats.averageRating * 10) / 10,
          totalReviews: stats.totalReviews,
          ratingDistribution: distribution,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews given by a user
// @route   GET /api/reviews/given
// @access  Private
exports.getGivenReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ reviewer: req.user._id })
      .populate("reviewer", "name avatar")
      .populate("reviewee", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({
      reviewer: req.user._id,
    });
    const totalPages = Math.ceil(totalReviews / limit);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: page,
          totalPages,
          totalReviews,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:reviewId
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return next(new ErrorResponse("Review not found", 404));
    }

    // Check if user owns this review
    if (review.reviewer.toString() !== req.user._id.toString()) {
      return next(
        new ErrorResponse("Not authorized to update this review", 403)
      );
    }

    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return next(new ErrorResponse("Rating must be between 1 and 5", 400));
    }

    // Update fields
    if (rating) review.rating = parseInt(rating);
    if (comment) review.comment = comment.trim();

    await review.save();

    // Populate for response
    await review.populate([
      { path: "reviewer", select: "name avatar" },
      { path: "reviewee", select: "name avatar" },
    ]);

    res.status(200).json({
      success: true,
      data: review,
      message: "Review updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return next(new ErrorResponse("Review not found", 404));
    }

    // Check if user owns this review or is admin
    if (
      review.reviewer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse("Not authorized to delete this review", 403)
      );
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get review statistics for dashboard
// @route   GET /api/reviews/stats
// @access  Private
exports.getReviewStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Reviews received
    const receivedStats = await Review.aggregate([
      { $match: { reviewee: userId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    // Reviews given
    const givenCount = await Review.countDocuments({ reviewer: userId });

    // Recent reviews received
    const recentReviews = await Review.find({ reviewee: userId })
      .populate("reviewer", "name avatar")
      .sort({ createdAt: -1 })
      .limit(5);

    const stats = receivedStats[0] || { averageRating: 0, totalReviews: 0 };

    res.status(200).json({
      success: true,
      data: {
        received: {
          averageRating: Math.round(stats.averageRating * 10) / 10,
          totalReviews: stats.totalReviews,
        },
        given: {
          totalReviews: givenCount,
        },
        recentReviews,
      },
    });
  } catch (error) {
    next(error);
  }
};
