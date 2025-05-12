// /controllers/userController.js
const User = require("../models/User");

// Get current user profile
exports.getProfile = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};

// Search users by teachSkills or learnSkills
exports.searchUsers = async (req, res, next) => {
  try {
    const { keyword } = req.query;
    const users = await User.find({
      $or: [
        { "teachSkills.name": { $regex: keyword, $options: "i" } },
        { "learnSkills.name": { $regex: keyword, $options: "i" } },
      ],
    }).select("-password");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, teachSkills, learnSkills, availability } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, teachSkills, learnSkills, availability },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    next(err);
  }
};
