const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Updated to support multiple skills and messages
    skillsInvolved: [
      {
        type: String,
      },
    ],
    // Keep legacy fields for compatibility
    skillOffered: {
      type: String,
    },
    skillRequested: {
      type: String,
    },
    message: {
      type: String,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    // Smart matching fields
    compatibilityScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    matchType: {
      type: String,
      enum: ["bidirectional", "skill_exchange", "mentorship", "learning"],
    },
    acceptedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    completionRequests: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        requestedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Indexes for better performance
matchSchema.index({ requester: 1, receiver: 1 });
matchSchema.index({ status: 1 });
matchSchema.index({ compatibilityScore: -1 });

module.exports = mongoose.model("Match", matchSchema);
