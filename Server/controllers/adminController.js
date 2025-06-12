const User = require("../models/User");
const Skill = require("../models/Skill");
const Match = require("../models/Match");
const Review = require("../models/Review");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res, next) => {
  try {
    // Get basic counts
    const [
      totalUsers,
      totalSkills,
      totalMatches,
      totalReviews,
      recentUsers,
      topSkills,
      matchStats,
      reviewStats,
    ] = await Promise.all([
      User.countDocuments(),
      Skill.countDocuments(),
      Match.countDocuments(),
      Review.countDocuments(),

      // Recent users (last 30 days)
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),

      // Top 5 most offered skills
      Skill.aggregate([
        { $group: { _id: "$name", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),

      // Match statistics
      Match.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // Review statistics
      Review.aggregate([
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Format match stats
    const matchStatistics = {
      pending: 0,
      accepted: 0,
      rejected: 0,
      completed: 0,
    };

    matchStats.forEach((stat) => {
      matchStatistics[stat._id] = stat.count;
    });

    // User growth (last 12 months)
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalSkills,
          totalMatches,
          totalReviews,
          recentUsers,
          averageRating: reviewStats[0]?.averageRating?.toFixed(1) || 0,
        },
        topSkills,
        matchStatistics,
        userGrowth,
        lastUpdated: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with pagination and filters
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const role = req.query.role || "";
    const status = req.query.status || "";

    // Build filter query
    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (status) {
      filter.isActive = status === "active";
    }

    // Get users with pagination
    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("skills", "name type"),
      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return next(new ErrorResponse("You cannot delete your own account", 400));
    }

    // Delete related data
    await Promise.all([
      Skill.deleteMany({ user: user._id }),
      Match.deleteMany({
        $or: [{ requester: user._id }, { receiver: user._id }],
      }),
      Review.deleteMany({
        $or: [{ reviewer: user._id }, { reviewee: user._id }],
      }),
    ]);

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User and related data deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Prevent admin from changing their own role
    if (user._id.toString() === req.user._id.toString() && role) {
      return next(new ErrorResponse("You cannot change your own role", 400));
    }

    // Update fields
    if (role !== undefined) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
      message: "User updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews with filters
// @route   GET /api/admin/reviews
// @access  Private/Admin
exports.getAllReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const rating = req.query.rating || "";
    const reported = req.query.reported || "";

    // Build filter
    let filter = {};
    if (rating) filter.rating = parseInt(rating);
    if (reported === "true") filter.isReported = true;

    const [reviews, totalReviews] = await Promise.all([
      Review.find(filter)
        .populate("reviewer", "name email")
        .populate("reviewee", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments(filter),
    ]);

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

// @desc    Delete a review
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return next(new ErrorResponse("Review not found", 404));
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

// @desc    Get all skills with stats
// @route   GET /api/admin/skills
// @access  Private/Admin
exports.getAllSkills = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const type = req.query.type || "";
    const search = req.query.search || "";

    // Build filter
    let filter = {};
    if (type) filter.type = type;
    if (search) filter.name = { $regex: search, $options: "i" };

    const [skills, totalSkills] = await Promise.all([
      Skill.find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Skill.countDocuments(filter),
    ]);

    // Get skill statistics
    const skillStats = await Skill.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalPages = Math.ceil(totalSkills / limit);

    res.status(200).json({
      success: true,
      data: {
        skills,
        statistics: skillStats,
        pagination: {
          currentPage: page,
          totalPages,
          totalSkills,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill
// @route   DELETE /api/admin/skills/:id
// @access  Private/Admin
exports.deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return next(new ErrorResponse("Skill not found", 404));
    }

    await skill.deleteOne();

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
