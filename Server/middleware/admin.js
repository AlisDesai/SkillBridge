const ErrorResponse = require("../utils/errorResponse");

// Admin only middleware
const adminOnly = (req, res, next) => {
  try {
    // Check if user exists and is authenticated (protect middleware should run first)
    if (!req.user) {
      return next(new ErrorResponse("Access denied. Please login first.", 401));
    }

    // Check if user has admin role
    if (req.user.role !== "admin") {
      return next(
        new ErrorResponse("Access denied. Admin privileges required.", 403)
      );
    }

    next();
  } catch (error) {
    next(new ErrorResponse("Access denied. Invalid token.", 401));
  }
};

// Check if user is admin or owner of the resource
const adminOrOwner = (resourceUserIdField = "userId") => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return next(
          new ErrorResponse("Access denied. Please login first.", 401)
        );
      }

      // Allow if user is admin
      if (req.user.role === "admin") {
        return next();
      }

      // Allow if user is the owner of the resource
      const resourceUserId =
        req.params[resourceUserIdField] || req.body[resourceUserIdField];
      if (req.user._id.toString() === resourceUserId) {
        return next();
      }

      return next(
        new ErrorResponse(
          "Access denied. You can only access your own resources.",
          403
        )
      );
    } catch (error) {
      next(new ErrorResponse("Access denied. Invalid token.", 401));
    }
  };
};

module.exports = {
  adminOnly,
  adminOrOwner,
};
