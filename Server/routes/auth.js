const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { runValidation } = require("../middleware/validator");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const rateLimit = require("express-rate-limit");
const { refreshToken } = require("../controllers/authController");

// Rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

// Refresh Token
router.post(
  "/refresh-token",
  [body("refreshToken").notEmpty().withMessage("Refresh token is required")],
  runValidation,
  refreshToken
);

// Register
router.post(
  "/register",
  authLimiter,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  runValidation,
  register
);

// Login
router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  runValidation,
  login
);

// Forgot Password
router.post(
  "/forgot-password",
  authLimiter,
  [body("email").isEmail().withMessage("Valid email is required")],
  runValidation,
  forgotPassword
);

// Reset Password
router.put(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  runValidation,
  resetPassword
);

module.exports = router;
