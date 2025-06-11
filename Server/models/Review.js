const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reviewer is required"],
      index: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reviewee is required"],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      validate: {
        validator: Number.isInteger,
        message: "Rating must be a whole number",
      },
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      minlength: [10, "Comment must be at least 10 characters long"],
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      default: null,
      index: true,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
    isReported: {
      type: Boolean,
      default: false,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for efficient queries
reviewSchema.index({ reviewee: 1, createdAt: -1 });
reviewSchema.index({ reviewer: 1, createdAt: -1 });

// Prevent duplicate reviews for the same match
reviewSchema.index(
  { reviewer: 1, reviewee: 1, matchId: 1 },
  {
    unique: true,
    partialFilterExpression: { matchId: { $ne: null } },
  }
);

// Virtual for time since review
reviewSchema.virtual("timeAgo").get(function () {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
});

// Pre-save middleware
reviewSchema.pre("save", function (next) {
  // Prevent self-review
  if (this.reviewer.toString() === this.reviewee.toString()) {
    const error = new Error("You cannot review yourself");
    error.status = 400;
    return next(error);
  }

  // Track edits
  if (this.isModified("comment") || this.isModified("rating")) {
    if (!this.isNew) {
      this.isEdited = true;
      this.editedAt = new Date();
    }
  }

  next();
});

// Static method to get user's average rating
reviewSchema.statics.getAverageRating = async function (userId) {
  try {
    const result = await this.aggregate([
      { $match: { reviewee: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    return result[0] || { averageRating: 0, totalReviews: 0 };
  } catch (error) {
    throw error;
  }
};

// Static method to get rating distribution
reviewSchema.statics.getRatingDistribution = async function (userId) {
  try {
    const result = await this.aggregate([
      { $match: { reviewee: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    // Create distribution array [5, 4, 3, 2, 1]
    const distribution = [5, 4, 3, 2, 1].map((rating) => {
      const found = result.find((r) => r._id === rating);
      return {
        rating,
        count: found ? found.count : 0,
      };
    });

    return distribution;
  } catch (error) {
    throw error;
  }
};

// Instance method to check if user can edit this review
reviewSchema.methods.canEdit = function (userId) {
  return this.reviewer.toString() === userId.toString();
};

// Instance method to check if review is recent (within 24 hours)
reviewSchema.methods.isRecent = function () {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.createdAt > oneDayAgo;
};

module.exports = mongoose.model("Review", reviewSchema);
