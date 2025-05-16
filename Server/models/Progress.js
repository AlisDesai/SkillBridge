// /models/Progress.js
const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skill: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["teacher", "learner"],
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "in-progress"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);
