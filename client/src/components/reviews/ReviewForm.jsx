import { useState } from "react";
import { useDispatch } from "react-redux";
import { createReviewAsync } from "../../redux/slices/reviewSlice";
import { showError, showSuccess } from "../../utils/toast";
import Button from "../common/Button";

const RATING_LABELS = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

export default function ReviewForm({
  revieweeId,
  revieweeName,
  matchId = null,
  onSuccess,
  onCancel,
}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    comment: "",
    rating: 5,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.comment.trim()) {
      newErrors.comment = "Comment is required";
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = "Comment must be at least 10 characters";
    } else if (formData.comment.length > 500) {
      newErrors.comment = "Comment cannot exceed 500 characters";
    }

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Please select a rating";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const reviewData = {
        reviewee: revieweeId,
        comment: formData.comment.trim(),
        rating: parseInt(formData.rating),
        ...(matchId && { matchId }),
      };

      const result = await dispatch(createReviewAsync(reviewData)).unwrap();

      showSuccess("Review submitted successfully!");

      // Reset form
      setFormData({
        comment: "",
        rating: 5,
      });

      // Call success callback
      onSuccess?.(result);
    } catch (error) {
      const message = error?.message || "Failed to submit review";
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (rating) => {
    handleInputChange("rating", rating);
  };

  const handleRatingHover = (rating) => {
    setHoveredRating(rating);
  };

  const handleRatingLeave = () => {
    setHoveredRating(0);
  };

  const displayRating = hoveredRating || formData.rating;

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Write a Review
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Share your experience with {revieweeName}
          </p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-2"
            disabled={loading}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Rating *
          </label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => handleRatingHover(star)}
                  onMouseLeave={handleRatingLeave}
                  className={`text-2xl transition-colors duration-150 hover:scale-110 transform ${
                    star <= displayRating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {RATING_LABELS[displayRating]}
            </span>
          </div>
          {errors.rating && (
            <p className="text-sm text-red-600">{errors.rating}</p>
          )}
        </div>

        {/* Comment Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Comment *
          </label>
          <textarea
            rows={4}
            placeholder="Share your experience, what went well, and any feedback..."
            value={formData.comment}
            onChange={(e) => handleInputChange("comment", e.target.value)}
            className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FF7A59] focus:border-transparent resize-none transition-colors ${
              errors.comment ? "border-red-300" : "border-gray-300"
            }`}
            disabled={loading}
          />
          <div className="flex justify-between items-center">
            <span
              className={`text-xs ${
                formData.comment.length > 500 ? "text-red-500" : "text-gray-500"
              }`}
            >
              {formData.comment.length}/500 characters
            </span>
            {formData.comment.length > 0 && formData.comment.length < 10 && (
              <span className="text-xs text-orange-500">
                {10 - formData.comment.length} more characters needed
              </span>
            )}
          </div>
          {errors.comment && (
            <p className="text-sm text-red-600">{errors.comment}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={
              loading ||
              !formData.comment.trim() ||
              formData.comment.length < 10
            }
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : (
              "Submit Review"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
