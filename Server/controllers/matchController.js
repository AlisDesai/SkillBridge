// /controllers/matchController.js
const Match = require("../models/Match");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Enhanced Skill Matching Algorithm
exports.findCompatibleUsers = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) return next(new ErrorResponse("User not found", 404));

    const teachSkills = currentUser.teachSkills.map((s) =>
      s.name.toLowerCase()
    );
    const learnSkills = currentUser.learnSkills.map((s) =>
      s.name.toLowerCase()
    );

    const compatibleUsers = await User.find({
      _id: { $ne: currentUser._id },
      teachSkills: {
        $elemMatch: {
          name: { $in: learnSkills },
        },
      },
      learnSkills: {
        $elemMatch: {
          name: { $in: teachSkills },
        },
      },
    }).select("name email bio teachSkills learnSkills");

    res.status(200).json({
      success: true,
      count: compatibleUsers.length,
      data: compatibleUsers,
    });
  } catch (err) {
    next(new ErrorResponse(`Failed to find matches: ${err.message}`, 500));
  }
};

exports.requestMatch = async (req, res, next) => {
  try {
    const { receiver, skillOffered, skillRequested } = req.body;

    const match = await Match.create({
      requester: req.user._id,
      receiver,
      skillOffered,
      skillRequested,
    });

    res.status(201).json({
      success: true,
      data: match,
    });
  } catch (err) {
    next(
      new ErrorResponse(`Failed to create match request: ${err.message}`, 500)
    );
  }
};

exports.respondToMatch = async (req, res, next) => {
  try {
    const { status } = req.body;
    const match = await Match.findById(req.params.id);

    if (!match) {
      return next(new ErrorResponse("Match not found", 404));
    }

    if (match.receiver.toString() !== req.user._id.toString()) {
      return next(
        new ErrorResponse("Not authorized to update this match", 403)
      );
    }

    match.status = status;
    await match.save();

    res.json({
      success: true,
      data: match,
    });
  } catch (err) {
    next(new ErrorResponse(`Failed to respond to match: ${err.message}`, 500));
  }
};

exports.getMyMatches = async (req, res, next) => {
  try {
    const matches = await Match.find({
      $or: [{ requester: req.user._id }, { receiver: req.user._id }],
    }).populate("requester receiver", "name email");

    res.json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (err) {
    next(new ErrorResponse(`Failed to fetch matches: ${err.message}`, 500));
  }
};

exports.getMatchById = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id).populate(
      "requester receiver",
      "name email bio teachSkills learnSkills"
    );

    if (!match) {
      return next(new ErrorResponse("Match not found", 404));
    }

    // Verify the user is part of this match
    if (
      match.requester._id.toString() !== req.user._id.toString() &&
      match.receiver._id.toString() !== req.user._id.toString()
    ) {
      return next(new ErrorResponse("Not authorized to view this match", 403));
    }

    res.json({
      success: true,
      data: match,
    });
  } catch (err) {
    next(new ErrorResponse(`Failed to fetch match: ${err.message}`, 500));
  }
};
