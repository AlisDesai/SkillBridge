// /controllers/userController.js
const Match = require("../models/Match");

const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// Get current user profile
exports.getProfile = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, teachSkills, learnSkills, availability, location } =
      req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, teachSkills, learnSkills, availability, location },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Get all users for discovery
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("name bio teachSkills learnSkills location")
      .limit(20);

    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const user = req.user;

    const matches = await Match.countDocuments({
      $or: [{ requester: user._id }, { receiver: user._id }],
    });

    const pending = await Match.countDocuments({
      $or: [{ requester: user._id }, { receiver: user._id }],
      status: "pending",
    });

    const completed = await Match.countDocuments({
      $or: [{ requester: user._id }, { receiver: user._id }],
      status: "accepted",
    });

    const skills =
      (user.teachSkills?.length || 0) + (user.learnSkills?.length || 0);

    res.json({
      matches,
      pending,
      completed,
      skills,
    });
  } catch (err) {
    next(err);
  }
};

// Enhanced search with multiple filters
exports.searchUsers = async (req, res, next) => {
  try {
    const { keyword, category, location, availability, level } = req.query;
    const query = {};

    if (keyword) {
      query.$or = [
        { "teachSkills.name": { $regex: keyword, $options: "i" } },
        { "learnSkills.name": { $regex: keyword, $options: "i" } },
      ];
    }

    if (category) {
      query["teachSkills.category"] = category;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (availability) {
      query.availability = { $in: [availability] };
    }

    if (level) {
      query["teachSkills.level"] = level;
    }

    const users = await User.find(query).select("-password");

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(new ErrorResponse(`Search failed: ${err.message}`, 500));
  }
};
