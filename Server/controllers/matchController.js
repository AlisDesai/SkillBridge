// /server/controllers/matchController.js - Enhanced with Smart Matching

const Match = require("../models/Match");
const User = require("../models/User");
const MatchHistory = require("../models/MatchHistory");
const MatchPreference = require("../models/MatchPreference");
const ErrorResponse = require("../utils/errorResponse");
const SmartMatchingAlgorithm = require("../utils/smartMatching");
const { aiCache } = require("../middleware/aiCache");
const {
  getConfig,
  isFeatureEnabled,
  getAlgorithmWeights,
} = require("../config/aiConfig");

// @desc    Get smart matches for current user
// @route   GET /api/matches/smart
// @access  Private
exports.getSmartMatches = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      page = 1,
      limit = 10,
      minCompatibility = 30,
      maxResults = 50,
      includeInsights = false,
    } = req.query;

    // Check if smart matching is enabled for this user
    if (!isFeatureEnabled("smartMatching", userId)) {
      return next(new ErrorResponse("Smart matching not available", 403));
    }

    // Get user preferences - handle case where model might not exist
    let userPreferences = null;
    try {
      userPreferences = await MatchPreference.getOrCreateForUser(userId);
    } catch (error) {
      console.warn("MatchPreference model not available, using defaults");
      userPreferences = null;
    }

    // Check cache first
    const cacheKey = `smart_matches:${userId}:${page}:${limit}:${minCompatibility}`;
    const cachedResults = await aiCache.get(cacheKey);

    if (cachedResults) {
      console.log(`🚀 Smart match cache hit for user ${userId}`);
      return res.status(200).json({
        success: true,
        data: cachedResults,
        cached: true,
      });
    }

    // Get current user with full data
    const currentUser = await User.findById(userId)
      .populate("skillsOffered skillsWanted")
      .lean();

    if (!currentUser) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Get potential matches (exclude current user, blocked users, existing matches)
    const existingMatches = await Match.find({
      $or: [{ requester: userId }, { receiver: userId }],
    })
      .select("requester receiver")
      .lean();

    const excludedUserIds = [
      userId,
      ...existingMatches.map((match) =>
        match.requester.toString() === userId.toString()
          ? match.receiver.toString()
          : match.requester.toString()
      ),
    ];

    // Build query for potential matches
    const matchQuery = {
      _id: { $nin: excludedUserIds },
      isActive: true,
      $or: [
        { skillsOffered: { $exists: true, $not: { $size: 0 } } },
        { skillsWanted: { $exists: true, $not: { $size: 0 } } },
      ],
    };

    // Get potential matches
    const potentialMatches = await User.find(matchQuery)
      .populate("skillsOffered skillsWanted")
      .limit(maxResults)
      .lean();

    if (potentialMatches.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          matches: [],
          pagination: { currentPage: page, totalPages: 0, totalMatches: 0 },
          insights: {
            message:
              "No potential matches found. Try updating your skills or preferences.",
          },
        },
      });
    }

    // Get user's match history for algorithm learning
    let matchHistory = [];
    try {
      matchHistory = await MatchHistory.find({ user: userId })
        .populate("matchedUser", "skillsOffered skillsWanted experienceLevel")
        .limit(50)
        .lean();
    } catch (error) {
      console.warn("MatchHistory model not available, using empty history");
      matchHistory = [];
    }

    // Calculate smart matches using AI algorithm
    console.log(
      `🤖 Calculating smart matches for ${potentialMatches.length} potential users...`
    );

    const smartMatches = SmartMatchingAlgorithm.calculateMatchScores(
      currentUser,
      potentialMatches,
      matchHistory || []
    );

    // Filter by minimum compatibility
    const filteredMatches = smartMatches.filter((match) => {
      return match.compatibilityScore >= minCompatibility;
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedMatches = filteredMatches.slice(startIndex, endIndex);

    // Prepare response data
    const responseData = {
      matches: paginatedMatches.map((match) => ({
        user: {
          _id: match.user._id,
          name: match.user.name,
          email: match.user.email,
          avatar: match.user.avatar,
          bio: match.user.bio,
          location: match.user.location,
          skillsOffered: match.user.skillsOffered,
          skillsWanted: match.user.skillsWanted,
          experienceLevel: match.user.experienceLevel,
          averageRating: match.user.averageRating,
          totalReviews: match.user.totalReviews,
          isOnline: match.user.isOnline,
          lastActive: match.user.lastActive,
        },
        compatibilityScore: match.compatibilityScore,
        matchType: match.matchType,
        reasons: match.reasons,
        confidence: match.confidence,
        ...(includeInsights && { breakdown: match.breakdown }),
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredMatches.length / limit),
        totalMatches: filteredMatches.length,
        hasNextPage: endIndex < filteredMatches.length,
        hasPrevPage: page > 1,
      },
    };

    // Cache the results
    await aiCache.set(cacheKey, responseData, 1800); // 30 minutes

    res.status(200).json({
      success: true,
      data: responseData,
      cached: false,
    });
  } catch (error) {
    console.error("Smart matching error:", error);
    next(new ErrorResponse("Error calculating smart matches", 500));
  }
};

// @desc    Calculate compatibility between current user and target user
// @route   GET /api/matches/compatibility/:targetUserId
// @access  Private
exports.calculateCompatibility = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.params;

    if (userId.toString() === targetUserId) {
      return next(
        new ErrorResponse("Cannot calculate compatibility with yourself", 400)
      );
    }

    // Check cache first
    const cacheKey = `compatibility:${userId}:${targetUserId}`;
    const cachedResult = await aiCache.get(cacheKey);

    if (cachedResult) {
      return res.status(200).json({
        success: true,
        data: cachedResult,
        cached: true,
      });
    }

    // Get both users with full data
    const [currentUser, targetUser] = await Promise.all([
      User.findById(userId).populate("skillsOffered skillsWanted").lean(),
      User.findById(targetUserId).populate("skillsOffered skillsWanted").lean(),
    ]);

    if (!targetUser) {
      return next(new ErrorResponse("Target user not found", 404));
    }

    // Get user's match history for algorithm learning
    let matchHistory = [];
    try {
      matchHistory = await MatchHistory.find({ user: userId })
        .populate("matchedUser", "skillsOffered skillsWanted experienceLevel")
        .limit(20)
        .lean();
    } catch (error) {
      console.warn("MatchHistory model not available, using empty history");
      matchHistory = [];
    }

    // Calculate compatibility using smart matching algorithm
    const compatibility = SmartMatchingAlgorithm.calculateMatchScores(
      currentUser,
      [targetUser],
      matchHistory || []
    )[0];

    const result = {
      targetUser: {
        _id: targetUser._id,
        name: targetUser.name,
        avatar: targetUser.avatar,
        bio: targetUser.bio,
        skillsOffered: targetUser.skillsOffered,
        skillsWanted: targetUser.skillsWanted,
        experienceLevel: targetUser.experienceLevel,
        averageRating: targetUser.averageRating,
        totalReviews: targetUser.totalReviews,
      },
      compatibility: {
        score: compatibility.compatibilityScore,
        percentage: Math.round(compatibility.compatibilityScore),
        matchType: compatibility.matchType,
        reasons: compatibility.reasons,
        breakdown: compatibility.breakdown,
        confidence: compatibility.confidence,
      },
      recommendations: generateMatchRecommendations(compatibility),
    };

    // Cache the result
    await aiCache.set(cacheKey, result, 3600); // 1 hour

    res.status(200).json({
      success: true,
      data: result,
      cached: false,
    });
  } catch (error) {
    console.error("Calculate compatibility error:", error);
    next(new ErrorResponse("Error calculating compatibility", 500));
  }
};

// @desc    Refresh smart matches for current user
// @route   GET /api/matches/smart/refresh
// @access  Private
exports.refreshSmartMatches = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Clear user's smart match cache
    await aiCache.invalidateUserCaches(userId);

    // Force recalculation by calling getSmartMatches with cache bypass
    req.bypassCache = true;

    // Call the main smart matches function
    await exports.getSmartMatches(req, res, next);
  } catch (error) {
    console.error("Refresh smart matches error:", error);
    next(new ErrorResponse("Error refreshing smart matches", 500));
  }
};

// @desc    Get match insights and analytics
// @route   GET /api/matches/insights
// @access  Private
exports.getMatchInsights = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (!isFeatureEnabled("matchInsights", userId)) {
      return next(new ErrorResponse("Match insights not available", 403));
    }

    // Simple insights for now
    const insights = {
      overview: {
        totalMatches: 0,
        successfulMatches: 0,
        successRate: 0,
        averageCompatibility: 0,
        averageRating: 0,
        completedSessions: 0,
      },
      topSkills: [],
      matchTypes: {},
      recommendations: [
        {
          type: "profile_completion",
          message:
            "Complete your profile with more skills to get better matches",
          priority: "high",
        },
      ],
      trends: {
        last30Days: 0,
        averageResponseTime: 0,
        improvementAreas: [],
      },
      preferences: {
        customizationLevel: 0,
        effectivenessScore: 50,
      },
    };

    res.status(200).json({
      success: true,
      data: insights,
      cached: false,
    });
  } catch (error) {
    console.error("Match insights error:", error);
    next(new ErrorResponse("Error fetching match insights", 500));
  }
};

// @desc    Create a match request
// @route   POST /api/matches/request
// @access  Private
exports.requestMatch = async (req, res, next) => {
  try {
    const requesterId = req.user._id;
    const { receiverId, message, skillsInvolved } = req.body;

    console.log("Creating match request:", {
      requesterId: requesterId.toString(),
      receiverId,
      message,
      skillsInvolved,
    });

    // Validate receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Check if match already exists - FIXED: Use same logic as checkExistingMatch
    const existingMatch = await Match.findOne({
      $or: [
        { requester: requesterId, receiver: receiverId },
        { requester: receiverId, receiver: requesterId },
      ],
    });

    console.log("Existing match found:", existingMatch);

    if (existingMatch) {
      // Check the status - only block if it's pending or accepted
      if (existingMatch.status === "pending") {
        return next(new ErrorResponse("Match request already pending", 400));
      } else if (existingMatch.status === "accepted") {
        return next(new ErrorResponse("Users are already matched", 400));
      }
      // If status is 'rejected', allow creating a new match request
      // Delete the old rejected match first
      if (existingMatch.status === "rejected") {
        await Match.findByIdAndDelete(existingMatch._id);
        console.log("Deleted old rejected match, allowing new request");
      }
    }

    // Create match
    const match = await Match.create({
      requester: requesterId,
      receiver: receiverId,
      message: message || "Match request",
      skillsInvolved: skillsInvolved || [],
      status: "pending",
    });

    console.log("Match created successfully:", match._id);

    // Populate the match for response
    const populatedMatch = await Match.findById(match._id)
      .populate("requester", "name email avatar")
      .populate("receiver", "name email avatar");

    res.status(201).json({
      success: true,
      data: populatedMatch,
      message: "Match request sent successfully",
    });
  } catch (error) {
    console.error("Create match request error:", error);
    next(new ErrorResponse("Error creating match request", 500));
  }
};

// @desc    Respond to match request
// @route   PUT /api/matches/:id
// @access  Private
exports.respondToMatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    const match = await Match.findById(id);
    if (!match) {
      return next(new ErrorResponse("Match not found", 404));
    }

    // Verify user is the receiver
    if (!match.receiver.equals(userId)) {
      return next(
        new ErrorResponse("Not authorized to respond to this match", 403)
      );
    }

    match.status = status;
    if (status === "accepted") {
      match.acceptedAt = new Date();
    } else if (status === "rejected") {
      match.rejectedAt = new Date();
    }

    await match.save();

    const populatedMatch = await Match.findById(match._id)
      .populate("requester", "name email avatar")
      .populate("receiver", "name email avatar");

    res.status(200).json({
      success: true,
      data: populatedMatch,
      message: `Match request ${status}`,
    });
  } catch (error) {
    console.error("Respond to match error:", error);
    next(new ErrorResponse("Error responding to match request", 500));
  }
};

// @desc    Get user's matches
// @route   GET /api/matches
// @access  Private
exports.getMyMatches = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    let query = {
      $or: [{ requester: userId }, { receiver: userId }],
    };

    if (status) {
      query.status = status;
    }

    const matches = await Match.find(query)
      .populate("requester", "name email avatar skillsOffered skillsWanted")
      .populate("receiver", "name email avatar skillsOffered skillsWanted")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Match.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        matches,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalMatches: total,
        },
      },
    });
  } catch (error) {
    console.error("Get matches error:", error);
    next(new ErrorResponse("Error fetching matches", 500));
  }
};

// @desc    Get match by ID
// @route   GET /api/matches/:id
// @access  Private
exports.getMatchById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const match = await Match.findById(id)
      .populate(
        "requester",
        "name email avatar skillsOffered skillsWanted bio location"
      )
      .populate(
        "receiver",
        "name email avatar skillsOffered skillsWanted bio location"
      );

    if (!match) {
      return next(new ErrorResponse("Match not found", 404));
    }

    // Verify user is part of this match
    if (
      !match.requester._id.equals(userId) &&
      !match.receiver._id.equals(userId)
    ) {
      return next(new ErrorResponse("Not authorized to view this match", 403));
    }

    res.status(200).json({
      success: true,
      data: match,
    });
  } catch (error) {
    console.error("Get match by ID error:", error);
    next(new ErrorResponse("Error fetching match", 500));
  }
};

// @desc    Find compatible users (simplified)
// @route   GET /api/matches/suggestions
// @access  Private
exports.findCompatibleUsers = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { limit = 10 } = req.query;

    // Get current user
    const currentUser = await User.findById(userId).populate(
      "skillsOffered skillsWanted"
    );

    // Get potential matches (exclude current user and existing matches)
    const existingMatches = await Match.find({
      $or: [{ requester: userId }, { receiver: userId }],
    }).select("requester receiver");

    const excludedUserIds = [
      userId,
      ...existingMatches.map((match) =>
        match.requester.toString() === userId.toString()
          ? match.receiver.toString()
          : match.requester.toString()
      ),
    ];

    const compatibleUsers = await User.find({
      _id: { $nin: excludedUserIds },
      isActive: true,
      $or: [
        { skillsOffered: { $exists: true, $not: { $size: 0 } } },
        { skillsWanted: { $exists: true, $not: { $size: 0 } } },
      ],
    })
      .populate("skillsOffered skillsWanted")
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: compatibleUsers,
    });
  } catch (error) {
    console.error("Find compatible users error:", error);
    next(new ErrorResponse("Error finding compatible users", 500));
  }
};

// @desc    Check if match exists
// @route   POST /api/matches/check
// @access  Private
exports.checkMatch = async (req, res, next) => {
  try {
    const { userId1, userId2 } = req.body;

    const match = await Match.findOne({
      $or: [
        { requester: userId1, receiver: userId2 },
        { requester: userId2, receiver: userId1 },
      ],
    });

    res.status(200).json({
      success: true,
      data: {
        exists: !!match,
        match: match || null,
      },
    });
  } catch (error) {
    console.error("Check match error:", error);
    next(new ErrorResponse("Error checking match", 500));
  }
};

// @desc    Check existing match with user
// @route   GET /api/matches/check/:userId
// @access  Private
// @desc    Check existing match with user
// @route   GET /api/matches/check/:userId
// @access  Private
exports.checkExistingMatch = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const { userId } = req.params;

    const match = await Match.findOne({
      $or: [
        { requester: currentUserId, receiver: userId },
        { requester: userId, receiver: currentUserId },
      ],
    });

    res.status(200).json({
      success: true,
      data: {
        exists: !!match,
        status: match ? match.status : null, // Add this line
        match: match || null,
      },
    });
  } catch (error) {
    console.error("Check existing match error:", error);
    next(new ErrorResponse("Error checking existing match", 500));
  }
};

// @desc    Request match completion
// @route   POST /api/matches/:id/complete
// @access  Private
exports.requestCompletion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const match = await Match.findById(id);
    if (!match) {
      return next(new ErrorResponse("Match not found", 404));
    }

    // Verify user is part of this match
    if (!match.requester.equals(userId) && !match.receiver.equals(userId)) {
      return next(new ErrorResponse("Not authorized", 403));
    }

    // Only accepted matches can be completed
    if (match.status !== "accepted") {
      return next(
        new ErrorResponse("Match must be accepted to request completion", 400)
      );
    }

    match.status = "completed";
    match.completedAt = new Date();
    await match.save();

    res.status(200).json({
      success: true,
      data: match,
      message: "Match marked as completed",
    });
  } catch (error) {
    console.error("Request completion error:", error);
    next(new ErrorResponse("Error requesting match completion", 500));
  }
};

// Helper function to generate match recommendations
function generateMatchRecommendations(compatibility) {
  const recommendations = [];
  const score = compatibility.compatibilityScore;

  if (score >= 80) {
    recommendations.push({
      type: "high_compatibility",
      message:
        "Excellent match! Strong skill alignment and mutual learning opportunities.",
      action: "Send a match request soon",
      priority: "high",
    });
  } else if (score >= 60) {
    recommendations.push({
      type: "good_compatibility",
      message: "Good compatibility with several matching interests.",
      action: "Consider reaching out with a personalized message",
      priority: "medium",
    });
  } else if (score >= 40) {
    recommendations.push({
      type: "potential_match",
      message: "Some compatibility areas found.",
      action: "Review their profile for common interests",
      priority: "low",
    });
  } else {
    recommendations.push({
      type: "low_compatibility",
      message: "Limited compatibility detected.",
      action: "Look for other potential matches",
      priority: "low",
    });
  }

  return recommendations;
}
