// /controllers/progressController.js
const Progress = require("../models/Progress");
const ErrorResponse = require("../utils/errorResponse");

// Record progress for a session
exports.recordProgress = async (req, res, next) => {
  try {
    const { matchId, teacher, learner, skill, role } = req.body;

    const entry = await Progress.create({
      matchId,
      teacher,
      learner,
      skill,
      role,
    });

    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    next(new ErrorResponse(`Failed to record progress: ${err.message}`, 500));
  }
};

// Mark a progress record as completed
exports.markAsCompleted = async (req, res, next) => {
  try {
    const progress = await Progress.findById(req.params.id);
    if (!progress) return next(new ErrorResponse("Progress not found", 404));

    progress.status = "completed";
    await progress.save();

    res.json({ success: true, data: progress });
  } catch (err) {
    next(new ErrorResponse(`Failed to mark completed: ${err.message}`, 500));
  }
};

// Get progress records for dashboard
exports.getMyProgress = async (req, res, next) => {
  try {
    const records = await Progress.find({
      $or: [{ teacher: req.user._id }, { learner: req.user._id }],
    });

    const taught = records.filter((r) => r.role === "teacher").length;
    const learned = records.filter((r) => r.role === "learner").length;
    const completed = records.filter((r) => r.status === "completed").length;

    res.json({
      success: true,
      total: records.length,
      taught,
      learned,
      completed,
      data: records,
    });
  } catch (err) {
    next(new ErrorResponse(`Failed to fetch progress: ${err.message}`, 500));
  }
};
