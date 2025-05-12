// /controllers/scheduleController.js
const Schedule = require("../models/Schedule");
const ErrorResponse = require("../utils/errorResponse");

// Set available time slot for a match
exports.setTimeSlot = async (req, res, next) => {
  try {
    const { matchId, teacher, learner, timeSlot } = req.body;

    const session = await Schedule.create({
      matchId,
      teacher,
      learner,
      timeSlot,
    });

    if (!matchId || !teacher || !learner || !timeSlot) {
      return next(new ErrorResponse("Missing required fields", 400));
    }

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (err) {
    next(new ErrorResponse(`Failed to create schedule: ${err.message}`, 500));
  }
};

// Confirm a scheduled session
exports.confirmTimeSlot = async (req, res, next) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) return next(new ErrorResponse("Schedule not found", 404));

    schedule.status = "confirmed";
    await schedule.save();

    res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (err) {
    next(new ErrorResponse(`Failed to confirm schedule: ${err.message}`, 500));
  }
};

// Get all scheduled sessions for current user
exports.getMySessions = async (req, res, next) => {
  try {
    const sessions = await Schedule.find({
      $or: [{ teacher: req.user._id }, { learner: req.user._id }],
    })
      .populate("matchId")
      .populate("teacher", "name email")
      .populate("learner", "name email");

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (err) {
    next(new ErrorResponse(`Failed to fetch sessions: ${err.message}`, 500));
  }
};
