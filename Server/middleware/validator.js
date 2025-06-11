const { body, param, validationResult } = require("express-validator");

// Your existing validation function
exports.runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

// Review validation rules
exports.validateReview = [
  body("reviewee")
    .notEmpty()
    .withMessage("Reviewee is required")
    .isMongoId()
    .withMessage("Invalid reviewee ID"),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),

  body("comment")
    .notEmpty()
    .withMessage("Comment is required")
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Comment must be between 10 and 500 characters"),

  body("matchId").optional().isMongoId().withMessage("Invalid match ID"),

  exports.runValidation,
];

exports.validateReviewUpdate = [
  param("reviewId").isMongoId().withMessage("Invalid review ID"),

  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),

  body("comment")
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Comment must be between 10 and 500 characters"),

  // At least one field validation
  (req, res, next) => {
    const { rating, comment } = req.body;
    if (!rating && !comment) {
      return res.status(400).json({
        errors: [
          { msg: "At least one field (rating or comment) must be provided" },
        ],
      });
    }
    next();
  },

  exports.runValidation,
];

exports.validateUserId = [
  param("userId").isMongoId().withMessage("Invalid user ID"),

  exports.runValidation,
];

exports.validateReviewId = [
  param("reviewId").isMongoId().withMessage("Invalid review ID"),

  exports.runValidation,
];
