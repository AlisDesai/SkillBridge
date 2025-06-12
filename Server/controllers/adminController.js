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
    // Date calculations
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    // Get basic counts
    const [
      totalUsers,
      totalSkills,
      totalMatches,
      totalReviews,
      recentUsers,
      weeklyUsers,
      activeUsers,
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
        createdAt: { $gte: thirtyDaysAgo },
      }),

      // Weekly users
      User.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
      }),

      // Active users (logged in within 30 days)
      User.countDocuments({
        lastLogin: { $gte: thirtyDaysAgo },
      }),

      // Top 5 most offered skills
      Skill.aggregate([
        { $group: { _id: "$name", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
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
          createdAt: { $gte: oneYearAgo },
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

    // Recent activities
    const recentActivities = await getRecentActivities();

    // Platform health metrics
    const platformHealth = {
      activeUsers,
      completedMatches: matchStatistics.completed,
      systemUptime: Math.floor(process.uptime()),
      totalMessages: await getTotalMessages(),
    };

    // Calculate growth rate
    const lastMonthUsers = await User.countDocuments({
      createdAt: {
        $gte: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        $lt: thirtyDaysAgo,
      },
    });

    const userGrowthRate =
      lastMonthUsers > 0
        ? (((recentUsers - lastMonthUsers) / lastMonthUsers) * 100).toFixed(1)
        : 0;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalSkills,
          totalMatches,
          totalReviews,
          recentUsers,
          weeklyUsers,
          activeUsers,
          averageRating: reviewStats[0]?.averageRating?.toFixed(1) || 0,
          userGrowthRate,
        },
        topSkills,
        matchStatistics,
        userGrowth,
        recentActivities,
        platformHealth,
        lastUpdated: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to get recent activities
async function getRecentActivities() {
  try {
    const activities = [];

    // Recent user registrations
    const newUsers = await User.find()
      .select("name createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    newUsers.forEach((user) => {
      activities.push({
        type: "user_registered",
        message: `New user "${user.name}" registered`,
        timestamp: user.createdAt,
        severity: "info",
      });
    });

    // Recent matches
    const newMatches = await Match.find()
      .populate("requester", "name")
      .populate("receiver", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    newMatches.forEach((match) => {
      activities.push({
        type: "match_created",
        message: `Match created between ${match.requester?.name} and ${match.receiver?.name}`,
        timestamp: match.createdAt,
        severity: "success",
      });
    });

    // Recent reviews
    const newReviews = await Review.find()
      .populate("reviewer", "name")
      .populate("reviewee", "name")
      .sort({ createdAt: -1 })
      .limit(3);

    newReviews.forEach((review) => {
      activities.push({
        type: "review_created",
        message: `${review.reviewer?.name} reviewed ${review.reviewee?.name} (${review.rating}★)`,
        timestamp: review.createdAt,
        severity: "info",
      });
    });

    // Sort all activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return activities.slice(0, 10);
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return [];
  }
}

// Helper function to get total messages (if Message model exists)
async function getTotalMessages() {
  try {
    const Message = require("../models/Message");
    return await Message.countDocuments();
  } catch (error) {
    return 0;
  }
}

// @desc    Get system health metrics
// @route   GET /api/admin/system-health
// @access  Private/Admin
exports.getSystemHealth = async (req, res, next) => {
  try {
    const health = {
      database: {
        status: "healthy",
        responseTime: Date.now(),
      },
      server: {
        uptime: Math.floor(process.uptime()),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
      },
      stats: {
        activeConnections: 0,
        requestsPerMinute: 0,
        errorRate: 0,
      },
    };

    res.status(200).json({
      success: true,
      data: health,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user analytics
// @route   GET /api/admin/user-analytics
// @access  Private/Admin
exports.getUserAnalytics = async (req, res, next) => {
  try {
    const userStats = await User.aggregate([
      {
        $facet: {
          byRole: [{ $group: { _id: "$role", count: { $sum: 1 } } }],
          byStatus: [{ $group: { _id: "$isActive", count: { $sum: 1 } } }],
          byCreationDate: [
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
          ],
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: userStats[0],
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
        .limit(limit),
      User.countDocuments(filter),
    ]);

    // Add skills count to each user
    const usersWithSkillsCount = users.map((user) => {
      const userObj = user.toObject();
      userObj.skillsCount =
        (userObj.teachSkills?.length || 0) + (userObj.learnSkills?.length || 0);
      return userObj;
    });

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      data: {
        users: usersWithSkillsCount,
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

// REPLACE getAllSkills function (around line 300)
// In adminController.js - replace the getAllSkills function
exports.getAllSkills = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const type = req.query.type || "";

    let pipeline = [
      { $match: {} },
      {
        $project: {
          name: 1,
          email: 1,
          avatar: 1,
          skills: {
            $concatArrays: [
              {
                $map: {
                  input: { $ifNull: ["$teachSkills", []] },
                  as: "skill",
                  in: {
                    _id: "$$skill._id",
                    name: "$$skill.name",
                    // category: {
                    //   $ifNull: ["$$skill.category", "Uncategorized"],
                    // },
                    subcategory: { $ifNull: ["$$skill.subcategory", null] },
                    description: {
                      $ifNull: ["$$skill.description", "No description"],
                    },
                    level: { $ifNull: ["$$skill.level", "Beginner"] },
                    type: "teach",
                    user: {
                      _id: "$_id",
                      name: "$name",
                      email: "$email",
                      avatar: { $ifNull: ["$avatar", null] },
                    },
                    createdAt: { $ifNull: ["$$skill.createdAt", "$createdAt"] },
                    isVerified: { $ifNull: ["$$skill.isVerified", false] },
                  },
                },
              },
              {
                $map: {
                  input: { $ifNull: ["$learnSkills", []] },
                  as: "skill",
                  in: {
                    _id: "$$skill._id",
                    name: "$$skill.name",
                    // category: {
                    //   $ifNull: ["$$skill.category", "Uncategorized"],
                    // },
                    subcategory: { $ifNull: ["$$skill.subcategory", null] },
                    description: {
                      $ifNull: ["$$skill.description", "No description"],
                    },
                    level: { $ifNull: ["$$skill.level", "Beginner"] },
                    type: "learn",
                    user: {
                      _id: "$_id",
                      name: "$name",
                      email: "$email",
                      avatar: { $ifNull: ["$avatar", null] },
                    },
                    createdAt: { $ifNull: ["$$skill.createdAt", "$createdAt"] },
                    isVerified: { $ifNull: ["$$skill.isVerified", false] },
                  },
                },
              },
            ],
          },
        },
      },
      { $unwind: { path: "$skills", preserveNullAndEmptyArrays: false } },
      { $replaceRoot: { newRoot: "$skills" } },
    ];

    // Add filters
    if (type) {
      pipeline.push({ $match: { type: type } });
    }

    if (search) {
      pipeline.push({
        $match: {
          name: { $regex: search, $options: "i" },
        },
      });
    }

    // Get total count
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await User.aggregate(countPipeline);
    const totalSkills = countResult[0]?.total || 0;

    // Add pagination
    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    const skills = await User.aggregate(pipeline);

    console.log("Skills found:", skills.length); // Debug log

    const totalPages = Math.ceil(totalSkills / limit);

    res.status(200).json({
      success: true,
      data: {
        skills,
        statistics: [{ _id: "total", count: totalSkills }],
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
    console.error("Error fetching skills:", error);
    next(error);
  }
};

// REPLACE deleteSkill function
exports.deleteSkill = async (req, res, next) => {
  try {
    const skillId = req.params.id;

    // Find and remove from User arrays
    const userWithTeachSkill = await User.findOne({
      "teachSkills._id": skillId,
    });

    const userWithLearnSkill = await User.findOne({
      "learnSkills._id": skillId,
    });

    if (!userWithTeachSkill && !userWithLearnSkill) {
      return next(new ErrorResponse("Skill not found", 404));
    }

    // Remove from teachSkills
    if (userWithTeachSkill) {
      userWithTeachSkill.teachSkills = userWithTeachSkill.teachSkills.filter(
        (skill) => skill._id.toString() !== skillId
      );
      await userWithTeachSkill.save();
    }

    // Remove from learnSkills
    if (userWithLearnSkill) {
      userWithLearnSkill.learnSkills = userWithLearnSkill.learnSkills.filter(
        (skill) => skill._id.toString() !== skillId
      );
      await userWithLearnSkill.save();
    }

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
