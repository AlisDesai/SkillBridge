import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../utils/api";
import { showError, showSuccess } from "../utils/toast";
import Button from "../components/common/Button";

export default function ReviewPage() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [review, setReview] = useState({
    rating: 5,
    comment: "",
    skillDelivered: true,
    wouldRecommend: true,
    teachingQuality: 5,
    communication: 5,
    reliability: 5,
  });

  useEffect(() => {
    fetchMatch();
  }, [matchId]);

  const fetchMatch = async () => {
    try {
      const response = await api.get(`/matches/${matchId}`);
      const matchData = response.data.data;

      // Check if match is completed
      if (matchData.status !== "completed") {
        showError("Can only review completed matches");
        navigate("/matches");
        return;
      }

      setMatch(matchData);
    } catch (err) {
      showError("Failed to load match details");
      navigate("/matches");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!review.comment.trim()) {
      showError("Please write a comment about your experience");
      return;
    }

    setSubmitting(true);

    try {
      await api.post(`/matches/${matchId}/review`, {
        ...review,
        reviewee: otherUser._id,
      });

      showSuccess("Review submitted successfully!");
      navigate("/matches");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-[#4A6FFF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-800">Match not found</h2>
      </div>
    );
  }

  const otherUser =
    match.requester._id === user._id ? match.receiver : match.requester;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#4A6FFF] to-[#7C3AED] flex items-center justify-center text-white font-semibold text-xl">
            {otherUser.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Write a Review for {otherUser.name}
            </h1>
            <p className="text-gray-600">
              Share your experience with this skill exchange
            </p>
          </div>
        </div>

        {/* Exchange Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">You learned:</span>
              <p className="font-medium text-gray-800">
                {match.skillRequested}
              </p>
            </div>
            <div>
              <span className="text-gray-600">You taught:</span>
              <p className="font-medium text-gray-800">{match.skillOffered}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <form
        onSubmit={handleSubmitReview}
        className="bg-white rounded-2xl shadow-sm border p-6 space-y-6"
      >
        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Overall Rating *
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReview((prev) => ({ ...prev, rating: star }))}
                className={`text-3xl ${
                  star <= review.rating ? "text-yellow-400" : "text-gray-300"
                } hover:text-yellow-400 transition-colors`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-gray-600">{review.rating}/5</span>
          </div>
        </div>

        {/* Detailed Ratings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Teaching Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teaching Quality
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setReview((prev) => ({ ...prev, teachingQuality: star }))
                  }
                  className={`text-lg ${
                    star <= review.teachingQuality
                      ? "text-yellow-400"
                      : "text-gray-300"
                  } hover:text-yellow-400`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Communication */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Communication
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setReview((prev) => ({ ...prev, communication: star }))
                  }
                  className={`text-lg ${
                    star <= review.communication
                      ? "text-yellow-400"
                      : "text-gray-300"
                  } hover:text-yellow-400`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Reliability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reliability
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setReview((prev) => ({ ...prev, reliability: star }))
                  }
                  className={`text-lg ${
                    star <= review.reliability
                      ? "text-yellow-400"
                      : "text-gray-300"
                  } hover:text-yellow-400`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Experience *
          </label>
          <textarea
            value={review.comment}
            onChange={(e) =>
              setReview((prev) => ({ ...prev, comment: e.target.value }))
            }
            placeholder="Share details about your learning experience, teaching quality, and what you gained from this exchange..."
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A6FFF] focus:border-transparent resize-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum 10 characters ({review.comment.length}/10)
          </p>
        </div>

        {/* Quick Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Did they deliver the skill as promised?
            </span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="skillDelivered"
                  checked={review.skillDelivered === true}
                  onChange={() =>
                    setReview((prev) => ({ ...prev, skillDelivered: true }))
                  }
                  className="text-[#4A6FFF]"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="skillDelivered"
                  checked={review.skillDelivered === false}
                  onChange={() =>
                    setReview((prev) => ({ ...prev, skillDelivered: false }))
                  }
                  className="text-[#4A6FFF]"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Would you recommend them to others?
            </span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="wouldRecommend"
                  checked={review.wouldRecommend === true}
                  onChange={() =>
                    setReview((prev) => ({ ...prev, wouldRecommend: true }))
                  }
                  className="text-[#4A6FFF]"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="wouldRecommend"
                  checked={review.wouldRecommend === false}
                  onChange={() =>
                    setReview((prev) => ({ ...prev, wouldRecommend: false }))
                  }
                  className="text-[#4A6FFF]"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/matches")}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={submitting || review.comment.length < 10}
          >
            {submitting ? (
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
