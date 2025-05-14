// utils/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Then in controllers:
exports.getMyMatches = asyncHandler(async (req, res, next) => {
  const matches = await Match.find({
    $or: [{ requester: req.user._id }, { receiver: req.user._id }],
  }).populate("requester receiver", "name email");

  res.json({
    success: true,
    count: matches.length,
    data: matches,
  });
});
