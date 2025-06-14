// /server/models/MatchHistory.js

const mongoose = require("mongoose");

const matchHistorySchema = new mongoose.Schema(
  {
    // Core match information
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matchedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalMatch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: false, // May be null for viewed profiles that didn't become matches
    },

    // Interaction type and outcome
    interactionType: {
      type: String,
      enum: [
        "viewed",
        "liked",
        "contacted",
        "matched",
        "session_completed",
        "session_cancelled",
      ],
      required: true,
    },
    outcome: {
      type: String,
      enum: ["positive", "negative", "neutral", "pending"],
      default: "pending",
    },

    // Algorithm data at time of match
    algorithmData: {
      compatibilityScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },
      breakdown: {
        skillMatch: Number,
        experienceBalance: Number,
        availabilityOverlap: Number,
        locationCompatibility: Number,
        personalityMatch: Number,
        historicalSuccess: Number,
        mutualInterest: Number,
        activityScore: Number,
        reputationScore: Number,
      },
      reasons: [
        {
          type: String,
        },
      ],
      matchType: {
        type: String,
        enum: [
          "perfect_match",
          "skill_complement",
          "mutual_learning",
          "potential_match",
        ],
        required: true,
      },
      algorithmVersion: {
        type: String,
        default: "1.0",
      },
    },

    // Skills involved in the match
    skillsInvolved: {
      userOffered: [
        {
          name: String,
          category: String,
          level: String,
        },
      ],
      userWanted: [
        {
          name: String,
          category: String,
          level: String,
        },
      ],
      matchedUserOffered: [
        {
          name: String,
          category: String,
          level: String,
        },
      ],
      matchedUserWanted: [
        {
          name: String,
          category: String,
          level: String,
        },
      ],
    },

    // Session details (if a session occurred)
    sessionDetails: {
      scheduled: Boolean,
      scheduledDate: Date,
      duration: Number, // in minutes
      format: {
        type: String,
        enum: [
          "video_call",
          "in_person",
          "text_chat",
          "phone_call",
          "group_session",
        ],
      },
      location: String, // or virtual platform
      completed: Boolean,
      completedDate: Date,
      noShowBy: {
        type: String,
        enum: ["user", "matched_user", "both", "none"],
      },
    },

    // Feedback and ratings
    feedback: {
      userRating: {
        overall: {
          type: Number,
          min: 1,
          max: 5,
        },
        teaching: {
          type: Number,
          min: 1,
          max: 5,
        },
        communication: {
          type: Number,
          min: 1,
          max: 5,
        },
        reliability: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
      userComment: {
        type: String,
        maxlength: 1000,
      },
      matchedUserRating: {
        overall: {
          type: Number,
          min: 1,
          max: 5,
        },
        teaching: {
          type: Number,
          min: 1,
          max: 5,
        },
        communication: {
          type: Number,
          min: 1,
          max: 5,
        },
        reliability: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
      matchedUserComment: {
        type: String,
        maxlength: 1000,
      },
    },

    // Learning outcomes
    learningOutcomes: {
      skillsLearned: [
        {
          skill: String,
          proficiencyGained: {
            type: String,
            enum: ["basic", "intermediate", "advanced"],
          },
          confidenceLevel: {
            type: Number,
            min: 1,
            max: 10,
          },
        },
      ],
      skillsTaught: [
        {
          skill: String,
          teachingEffectiveness: {
            type: Number,
            min: 1,
            max: 10,
          },
        },
      ],
      goalAchievement: {
        type: String,
        enum: ["exceeded", "met", "partially_met", "not_met"],
        default: "partially_met",
      },
      wouldRecommend: Boolean,
      wouldMatchAgain: Boolean,
    },

    // Timeline tracking
    timeline: [
      {
        event: {
          type: String,
          enum: [
            "profile_viewed",
            "interest_sent",
            "match_created",
            "first_message",
            "session_scheduled",
            "session_completed",
            "feedback_given",
          ],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        details: String,
      },
    ],

    // Analytics and insights
    analytics: {
      algorithmAccuracy: {
        type: Number, // How well the algorithm predicted this match success
        min: 0,
        max: 1,
      },
      responseTime: {
        initialResponse: Number, // Time to first response in hours
        averageResponse: Number, // Average response time during conversation
      },
      engagementMetrics: {
        messagesExchanged: {
          type: Number,
          default: 0,
        },
        totalCommunicationTime: Number, // in minutes
        profileViewsAfterMatch: Number,
      },
      conversionRate: {
        viewToContact: Boolean,
        contactToSession: Boolean,
        sessionToPositiveReview: Boolean,
      },
    },

    // Flags and moderation
    flags: {
      disputed: Boolean,
      inappropriate: Boolean,
      spam: Boolean,
      flaggedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      flagReason: String,
      moderatorReviewed: Boolean,
      moderatorNotes: String,
    },

    // Status tracking
    status: {
      type: String,
      enum: ["active", "completed", "cancelled", "disputed", "archived"],
      default: "active",
    },

    // Metadata
    metadata: {
      deviceType: String, // mobile, desktop, tablet
      platform: String, // ios, android, web
      location: {
        country: String,
        city: String,
        timezone: String,
      },
      referralSource: String, // how user found the match
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
matchHistorySchema.index({ user: 1, createdAt: -1 });
matchHistorySchema.index({ user: 1, interactionType: 1 });
matchHistorySchema.index({ user: 1, outcome: 1 });
matchHistorySchema.index({ "algorithmData.compatibilityScore": -1 });
matchHistorySchema.index({ "algorithmData.matchType": 1 });
matchHistorySchema.index({ status: 1, createdAt: -1 });

// Pre-save middleware to add timeline events
matchHistorySchema.pre("save", function (next) {
  if (this.isNew) {
    this.timeline.push({
      event: "profile_viewed",
      timestamp: new Date(),
      details: `User viewed ${this.matchedUser}'s profile`,
    });
  }
  next();
});

// Instance methods
matchHistorySchema.methods.addTimelineEvent = function (event, details = "") {
  this.timeline.push({
    event,
    timestamp: new Date(),
    details,
  });
  return this.save();
};

matchHistorySchema.methods.updateOutcome = function (outcome, rating = null) {
  this.outcome = outcome;

  if (rating) {
    this.feedback.userRating.overall = rating;
  }

  // Calculate algorithm accuracy
  if (outcome === "positive" && this.algorithmData.compatibilityScore) {
    this.analytics.algorithmAccuracy =
      this.algorithmData.compatibilityScore / 100;
  } else if (outcome === "negative") {
    this.analytics.algorithmAccuracy =
      1 - this.algorithmData.compatibilityScore / 100;
  }

  return this.save();
};

matchHistorySchema.methods.recordSession = function (sessionData) {
  this.sessionDetails = {
    ...this.sessionDetails,
    ...sessionData,
    completed: true,
    completedDate: new Date(),
  };

  this.addTimelineEvent(
    "session_completed",
    `Session completed: ${sessionData.duration} minutes`
  );

  return this.save();
};

// Static methods for analytics
matchHistorySchema.statics.getUserMatchAnalytics = async function (userId) {
  const pipeline = [
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalMatches: { $sum: 1 },
        averageCompatibility: { $avg: "$algorithmData.compatibilityScore" },
        successfulMatches: {
          $sum: { $cond: [{ $eq: ["$outcome", "positive"] }, 1, 0] },
        },
        completedSessions: {
          $sum: { $cond: ["$sessionDetails.completed", 1, 0] },
        },
        averageRating: { $avg: "$feedback.userRating.overall" },
        matchTypes: {
          $push: "$algorithmData.matchType",
        },
      },
    },
  ];

  const result = await this.aggregate(pipeline);
  return result[0] || {};
};

matchHistorySchema.statics.getAlgorithmPerformance = async function (
  startDate,
  endDate
) {
  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        outcome: { $ne: "pending" },
      },
    },
    {
      $group: {
        _id: {
          matchType: "$algorithmData.matchType",
          compatibilityRange: {
            $switch: {
              branches: [
                {
                  case: { $lt: ["$algorithmData.compatibilityScore", 50] },
                  then: "low",
                },
                {
                  case: { $lt: ["$algorithmData.compatibilityScore", 70] },
                  then: "medium",
                },
                {
                  case: { $lt: ["$algorithmData.compatibilityScore", 85] },
                  then: "high",
                },
              ],
              default: "very_high",
            },
          },
        },
        count: { $sum: 1 },
        successRate: {
          $avg: { $cond: [{ $eq: ["$outcome", "positive"] }, 1, 0] },
        },
        averageRating: { $avg: "$feedback.userRating.overall" },
        averageAccuracy: { $avg: "$analytics.algorithmAccuracy" },
      },
    },
    { $sort: { "_id.compatibilityRange": 1, "_id.matchType": 1 } },
  ];

  return this.aggregate(pipeline);
};

matchHistorySchema.statics.getSkillSuccessRates = async function (userId) {
  const pipeline = [
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        outcome: "positive",
      },
    },
    { $unwind: "$skillsInvolved.userOffered" },
    {
      $group: {
        _id: "$skillsInvolved.userOffered.name",
        successfulTeaching: { $sum: 1 },
        averageRating: { $avg: "$feedback.userRating.teaching" },
        category: { $first: "$skillsInvolved.userOffered.category" },
      },
    },
    { $sort: { successfulTeaching: -1 } },
  ];

  return this.aggregate(pipeline);
};

// Virtual for success rate
matchHistorySchema.virtual("isSuccessful").get(function () {
  return this.outcome === "positive" && this.feedback.userRating?.overall >= 4;
});

// Virtual for match effectiveness
matchHistorySchema.virtual("effectiveness").get(function () {
  if (!this.feedback.userRating?.overall) return null;

  const ratingScore = this.feedback.userRating.overall / 5;
  const compatibilityScore = this.algorithmData.compatibilityScore / 100;

  // How well the algorithm predicted this outcome
  return Math.abs(ratingScore - compatibilityScore) < 0.2
    ? "accurate"
    : "inaccurate";
});

const MatchHistory = mongoose.model("MatchHistory", matchHistorySchema);

module.exports = MatchHistory;
