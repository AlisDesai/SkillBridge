// /middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// Middleware to protect routes (require login)
exports.protect = async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized, token missing", 401));
  }

  try {
    // Verify token and get user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    req.user = user;
    next();
  } catch (err) {
    next(new ErrorResponse("Not authorized, token invalid", 401));
  }
};

// Middleware for admin-only access
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    next(new ErrorResponse("Access denied: Admins only", 403));
  }
};
