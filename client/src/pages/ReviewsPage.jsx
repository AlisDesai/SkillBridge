import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGivenReviewsAsync,
  fetchReviewStatsAsync,
} from "../redux/slices/reviewSlice";
import ReviewList from "../components/reviews/ReviewList";
import ReviewForm from "../components/reviews/ReviewForm";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";

const TABS = {
  RECEIVED: "received",
  GIVEN: "given",
  WRITE: "write",
};

export default function ReviewsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { givenReviews, reviewStats, loading } = useSelector(
    (state) => state.review
  );

  const [activeTab, setActiveTab] = useState(TABS.RECEIVED);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (user?._id) {
      // Fetch review statistics for dashboard
      dispatch(fetchReviewStatsAsync());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (activeTab === TABS.GIVEN && user?._id) {
      dispatch(fetchGivenReviewsAsync({ page: 1, limit: 10 }));
    }
  }, [dispatch, activeTab, user]);

  const handleWriteReview = () => {
    setShowWriteModal(true);
  };

  const handleCloseWriteModal = () => {
    setShowWriteModal(false);
    setSelectedUser(null);
  };

  const handleReviewSuccess = () => {
    handleCloseWriteModal();
    // Refresh stats
    dispatch(fetchReviewStatsAsync());
    // If we're on received tab, it will auto-refresh through ReviewList component
  };

  const renderTabButton = (tab, label, count = null) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === tab
          ? "bg-[#FF7A59] text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
      {count !== null && (
        <span
          className={`ml-1 text-sm ${
            activeTab === tab ? "text-white" : "text-gray-500"
          }`}
        >
          ({count})
        </span>
      )}
    </button>
  );

  const renderStatsCards = () => {
    if (!reviewStats) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Received Reviews */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Reviews Received
            </h3>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {reviewStats.received?.averageRating || 0}
              </span>
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.round(reviewStats.received?.averageRating || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {reviewStats.received?.totalReviews || 0} total reviews
            </p>
          </div>
        </div>

        {/* Given Reviews */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Reviews Given
            </h3>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">
              {reviewStats.given?.totalReviews || 0}
            </div>
            <p className="text-sm text-gray-600">Reviews you've written</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Activity
            </h3>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">
              {reviewStats.recentReviews?.length || 0}
            </div>
            <p className="text-sm text-gray-600">Recent reviews received</p>
          </div>
        </div>
      </div>
    );
  };

  const renderRecentReviews = () => {
    if (!reviewStats?.recentReviews?.length) return null;

    return (
      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Reviews
        </h3>
        <div className="space-y-3">
          {reviewStats.recentReviews.slice(0, 3).map((review) => (
            <div
              key={review._id}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                {review.reviewer?.avatar ? (
                  <img
                    src={review.reviewer.avatar}
                    alt={review.reviewer.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-600">
                    {review.reviewer?.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-gray-800">
                    {review.reviewer?.name || "Anonymous"}
                  </span>
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-xs ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {review.comment}
                </p>
              </div>
              <span className="text-xs text-gray-500 flex-shrink-0">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.RECEIVED:
        return (
          <ReviewList
            userId={user?._id}
            showActions={false}
            showTitle={false}
          />
        );

      case TABS.GIVEN:
        return (
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-[#FF7A59] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : !givenReviews?.length ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-2">No reviews given yet</div>
                <p className="text-sm text-gray-400 mb-4">
                  Start reviewing your skill exchange partners
                </p>
                <Button variant="primary" onClick={handleWriteReview}>
                  Write Your First Review
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {givenReviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white p-4 rounded-xl shadow-sm border"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {review.reviewee?.avatar ? (
                            <img
                              src={review.reviewee.avatar}
                              alt={review.reviewee.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-600 font-medium">
                              {review.reviewee?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "?"}
                            </span>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800">
                              Review for {review.reviewee?.name || "Anonymous"}
                            </h4>
                            <div className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex text-yellow-400">
                              {Array.from({ length: 5 }, (_, i) => (
                                <span
                                  key={i}
                                  className={
                                    i < review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {review.rating}/5
                            </span>
                          </div>

                          <p className="text-gray-700 text-sm">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Reviews</h2>
          <p className="text-gray-600 mt-1">
            Manage your reviews and see feedback from the community
          </p>
        </div>
        <Button variant="primary" onClick={handleWriteReview}>
          Write Review
        </Button>
      </div>

      {/* Stats Cards */}
      {renderStatsCards()}

      {/* Recent Reviews */}
      {renderRecentReviews()}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {renderTabButton(
          TABS.RECEIVED,
          "Received",
          reviewStats?.received?.totalReviews
        )}
        {renderTabButton(TABS.GIVEN, "Given", reviewStats?.given?.totalReviews)}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        {renderTabContent()}
      </div>

      {/* Write Review Modal */}
      <Modal
        isOpen={showWriteModal}
        onClose={handleCloseWriteModal}
        title="Write a Review"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Share your experience with a skill exchange partner
          </p>

          {/* Simple user selection for now - in production, this would be a search/select component */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-800">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">
                Feature in development
              </span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              The ability to write reviews for specific users will be available
              once the matching and chat systems are integrated.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={handleCloseWriteModal}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
