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

    // PREVENT DUPLICATE REQUESTS - Check if match already exists
    const existingMatch = await Match.findOne({
      $or: [
        { requester: req.user._id, receiver: receiver },
        { requester: receiver, receiver: req.user._id },
      ],
    }).sort({ createdAt: -1 }); // Get the most recent match

    if (existingMatch) {
      console.log("Found existing match:", existingMatch); // Debug log
      if (existingMatch.status === "pending") {
        return next(
          new ErrorResponse(
            "Match request already sent! Please wait for their response.",
            400
          )
        );
      } else if (existingMatch.status === "accepted") {
        return next(
          new ErrorResponse(
            "You already have an active match with this user!",
            400
          )
        );
      }
      // If rejected, allow new request (don't return error)
    }

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

// Check if any match request exists between users (pending, accepted, or rejected)
exports.checkExistingMatch = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Check if there's ANY match between users (pending, accepted, or rejected)
    const match = await Match.findOne({
      $or: [
        { requester: currentUserId, receiver: userId },
        { requester: userId, receiver: currentUserId },
      ],
    }).sort({ createdAt: -1 }); // Get the most recent match

    res.json({
      success: true,
      exists: !!match,
      status: match ? match.status : null,
      match: match || null,
    });
  } catch (err) {
    next(
      new ErrorResponse(`Failed to check existing match: ${err.message}`, 500)
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
    const { status, type } = req.query; // Add query parameters for filtering

    let matchQuery = {
      $or: [{ requester: req.user._id }, { receiver: req.user._id }],
    };

    // Filter by status if provided
    if (status) {
      matchQuery.status = status;
    }

    // Filter by type (sent/received) if provided
    if (type === "sent") {
      matchQuery = { requester: req.user._id };
      if (status) matchQuery.status = status;
    } else if (type === "received") {
      matchQuery = { receiver: req.user._id };
      if (status) matchQuery.status = status;
    }

    const matches = await Match.find(matchQuery)
      .populate("requester receiver", "name email bio")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (err) {
    next(new ErrorResponse(`Failed to fetch matches: ${err.message}`, 500));
  }
};

// Add this new function to your matchController.js

exports.requestCompletion = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return next(new ErrorResponse("Match not found", 404));
    }

    // Check if user is part of this match
    if (
      match.requester.toString() !== req.user._id.toString() &&
      match.receiver.toString() !== req.user._id.toString()
    ) {
      return next(new ErrorResponse("Not authorized", 403));
    }

    if (match.status !== "accepted") {
      return next(new ErrorResponse("Match must be accepted first", 400));
    }

    // Check if user already requested completion
    const alreadyRequested = match.completionRequests.some(
      (request) => request.user.toString() === req.user._id.toString()
    );

    if (alreadyRequested) {
      return next(new ErrorResponse("You already requested completion", 400));
    }

    // Add completion request
    match.completionRequests.push({
      user: req.user._id,
      requestedAt: new Date(),
    });

    // If both users have requested completion, mark as completed
    if (match.completionRequests.length === 2) {
      match.status = "completed";
    }

    await match.save();

    res.json({
      success: true,
      data: match,
      message:
        match.status === "completed"
          ? "Match completed successfully!"
          : "Completion request sent. Waiting for other user confirmation.",
    });
  } catch (err) {
    next(
      new ErrorResponse(`Failed to request completion: ${err.message}`, 500)
    );
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

// Check if match exists between current user and target user
exports.checkMatch = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Check if there's an accepted match between users
    const match = await Match.findOne({
      $or: [
        { requester: currentUserId, receiver: userId, status: "accepted" },
        { requester: userId, receiver: currentUserId, status: "accepted" },
      ],
    }).populate("requester receiver", "name");

    res.json({
      success: true,
      match: match || null,
    });
  } catch (err) {
    next(new ErrorResponse(`Failed to check match: ${err.message}`, 500));
  }
};
