// /server/models/MatchPreference.js

const mongoose = require("mongoose");

const matchPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // This already creates an index
    },
    preferredSkillCategories: [
      {
        type: String,
        trim: true,
      },
    ],
    experienceLevelPreference: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "any"],
      default: "any",
    },
    locationPreference: {
      type: String,
      enum: ["same-city", "same-country", "anywhere"],
      default: "anywhere",
    },
    ageRangePreference: {
      min: {
        type: Number,
        min: 18,
        max: 100,
        default: 18,
      },
      max: {
        type: Number,
        min: 18,
        max: 100,
        default: 100,
      },
    },
    availabilityPreference: [
      {
        type: String,
        enum: ["morning", "afternoon", "evening", "weekend", "flexible"],
      },
    ],
    communicationStyle: {
      type: String,
      enum: ["text", "voice", "video", "in-person", "any"],
      default: "any",
    },
    learningStyle: {
      type: String,
      enum: ["structured", "casual", "project-based", "theory-focused", "any"],
      default: "any",
    },
    matchRadius: {
      type: Number, // in kilometers
      default: 50,
      min: 5,
      max: 10000,
    },
    minCompatibilityScore: {
      type: Number,
      default: 0.3,
      min: 0,
      max: 1,
    },
    excludedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    preferredGender: {
      type: String,
      enum: ["male", "female", "other", "any"],
      default: "any",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance (removed duplicate user index)
// matchPreferenceSchema.index({ user: 1 }); // REMOVED - already created by unique: true
matchPreferenceSchema.index({ isActive: 1 });
matchPreferenceSchema.index({ lastUpdated: -1 });

// Update lastUpdated on save
matchPreferenceSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

// Static method to get or create preferences for a user
matchPreferenceSchema.statics.getOrCreateForUser = async function (userId) {
  try {
    let preferences = await this.findOne({ user: userId });

    if (!preferences) {
      preferences = await this.create({ user: userId });
    }

    return preferences;
  } catch (error) {
    // Handle duplicate key error (race condition)
    if (error.code === 11000) {
      return await this.findOne({ user: userId });
    }
    throw error;
  }
};

// Method to check if preferences are configured
matchPreferenceSchema.methods.isConfigured = function () {
  return (
    this.preferredSkillCategories.length > 0 ||
    this.experienceLevelPreference !== "any" ||
    this.locationPreference !== "anywhere"
  );
};

module.exports = mongoose.model("MatchPreference", matchPreferenceSchema);
