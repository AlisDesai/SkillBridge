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
      className={`group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 overflow-hidden ${
        activeTab === tab
          ? "bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
          : "bg-gray-900/25 backdrop-blur-sm border border-gray-800/30 text-slate-300 hover:bg-gray-900/40 hover:border-emerald-400/30 hover:text-emerald-400"
      }`}
    >
      {activeTab === tab && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      )}
      <span className="relative flex items-center gap-2">
        {label}
        {count !== null && (
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              activeTab === tab 
                ? "bg-white/20 text-white" 
                : "bg-emerald-400/20 text-emerald-400 group-hover:bg-emerald-400/30"
            }`}
          >
            {count}
          </span>
        )}
      </span>
    </button>
  );

  const renderStatsCards = () => {
    if (!reviewStats) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Received Reviews */}
        <div className="group bg-gray-950/25 backdrop-blur-xl border border-gray-800/30 rounded-3xl p-6 hover:bg-gray-950/40 hover:border-emerald-500/30 transition-all duration-500 transform hover:scale-105 relative overflow-hidden shadow-xl hover:shadow-emerald-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/10 to-green-500/10 rounded-3xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
          
          <div className="relative flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 pb-1">
              Reviews Received
            </h3>
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-400/25 via-green-500/20 to-teal-600/25 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-6 h-6 text-emerald-400"
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
          
          <div className="relative space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent pb-1">
                {reviewStats.received?.averageRating || 0}
              </span>
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-lg transition-all duration-300 hover:scale-125 ${
                      i < Math.round(reviewStats.received?.averageRating || 0)
                        ? "text-yellow-400 drop-shadow-lg"
                        : "text-gray-600"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 pb-1">
              {reviewStats.received?.totalReviews || 0} total reviews
            </p>
          </div>
        </div>

        {/* Given Reviews */}
        <div className="group bg-gray-950/25 backdrop-blur-xl border border-gray-800/30 rounded-3xl p-6 hover:bg-gray-950/40 hover:border-green-500/30 transition-all duration-500 transform hover:scale-105 relative overflow-hidden shadow-xl hover:shadow-green-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500/10 to-teal-600/10 rounded-3xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
          
          <div className="relative flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors duration-300 pb-1">
              Reviews Given
            </h3>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500/25 via-teal-600/20 to-emerald-400/25 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-6 h-6 text-green-400"
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
          
          <div className="relative space-y-3">
            <div className="text-4xl font-black bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent pb-1">
              {reviewStats.given?.totalReviews || 0}
            </div>
            <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 pb-1">
              Reviews you've written
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="group bg-gray-950/25 backdrop-blur-xl border border-gray-800/30 rounded-3xl p-6 hover:bg-gray-950/40 hover:border-teal-600/30 transition-all duration-500 transform hover:scale-105 relative overflow-hidden shadow-xl hover:shadow-teal-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600/5 to-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-600/10 to-emerald-400/10 rounded-3xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
          
          <div className="relative flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors duration-300 pb-1">
              Recent Activity
            </h3>
            <div className="w-12 h-12 bg-gradient-to-r from-teal-600/25 via-emerald-400/20 to-green-500/25 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-6 h-6 text-teal-400"
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
          
          <div className="relative space-y-3">
            <div className="text-4xl font-black bg-gradient-to-r from-teal-600 to-emerald-400 bg-clip-text text-transparent pb-1">
              {reviewStats.recentReviews?.length || 0}
            </div>
            <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 pb-1">
              Recent reviews received
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderRecentReviews = () => {
    if (!reviewStats?.recentReviews?.length) return null;

    return (
      <div className="bg-gray-950/25 backdrop-blur-xl border border-gray-800/30 rounded-3xl p-6 mb-8 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6 pb-2">
          Recent Reviews
        </h3>
        <div className="space-y-4">
          {reviewStats.recentReviews.slice(0, 3).map((review, index) => (
            <div
              key={review._id}
              className="group flex items-start gap-4 p-4 bg-gray-900/25 backdrop-blur-sm border border-gray-800/25 rounded-2xl hover:bg-gray-900/40 hover:border-emerald-400/30 transition-all duration-300 transform hover:scale-102 relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-green-500/5 to-teal-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              
              <div className="relative w-12 h-12 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                {review.reviewer?.avatar ? (
                  <img
                    src={review.reviewer.avatar}
                    alt={review.reviewer.name}
                    className="w-12 h-12 rounded-2xl object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-lg">
                    {review.reviewer?.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                )}
              </div>
              
              <div className="relative flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300">
                    {review.reviewer?.name || "Anonymous"}
                  </span>
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-sm transition-all duration-300 hover:scale-125 ${
                          i < review.rating
                            ? "text-yellow-400 drop-shadow-lg"
                            : "text-gray-600"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 leading-relaxed pb-1">
                  {review.comment}
                </p>
              </div>
              
              <span className="relative text-xs text-slate-500 flex-shrink-0 group-hover:text-emerald-400 transition-colors duration-300">
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
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center animate-pulse shadow-2xl shadow-emerald-500/25">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                </div>
              </div>
            ) : !givenReviews?.length ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-400/25 via-green-500/20 to-teal-600/25 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-white mb-3 pb-1">No reviews given yet</h4>
                <p className="text-slate-400 mb-6 max-w-md mx-auto leading-relaxed pb-2">
                  Start reviewing your skill exchange partners to build trust and help the community grow
                </p>
                <button
                  onClick={handleWriteReview}
                  className="group relative px-8 py-3 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-emerald-500/30 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Write Your First Review
                  </span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {givenReviews.map((review, index) => (
                  <div
                    key={review._id}
                    className="group bg-gray-900/25 backdrop-blur-sm border border-gray-800/25 rounded-2xl p-6 hover:bg-gray-900/40 hover:border-emerald-400/30 transition-all duration-300 transform hover:scale-102 relative overflow-hidden shadow-lg"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-green-500/5 to-teal-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                    
                    <div className="relative flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-14 h-14 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          {review.reviewee?.avatar ? (
                            <img
                              src={review.reviewee.avatar}
                              alt={review.reviewee.name}
                              className="w-14 h-14 rounded-2xl object-cover"
                            />
                          ) : (
                            <span className="text-white font-bold text-xl">
                              {review.reviewee?.name?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 pb-1">
                              Review for {review.reviewee?.name || "Anonymous"}
                            </h4>
                            <div className="text-xs text-slate-500 group-hover:text-emerald-400 transition-colors duration-300">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex text-yellow-400">
                              {Array.from({ length: 5 }, (_, i) => (
                                <span
                                  key={i}
                                  className={`text-lg transition-all duration-300 hover:scale-125 ${
                                    i < review.rating
                                      ? "text-yellow-400 drop-shadow-lg"
                                      : "text-gray-600"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-sm font-semibold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                              {review.rating}/5
                            </span>
                          </div>

                          <p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300 leading-relaxed pb-1">
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-500/12 rounded-full blur-3xl animate-pulse delay-1000"></div>

        
        {/* Floating particles */}
        <div className="absolute top-20 right-20 w-3 h-3 bg-emerald-400/60 rounded-full animate-ping shadow-lg shadow-emerald-400/30"></div>
        <div className="absolute top-40 left-32 w-2 h-2 bg-green-400/70 rounded-full animate-ping delay-1000 shadow-lg shadow-green-400/30"></div>
        <div className="absolute bottom-32 right-1/3 w-2.5 h-2.5 bg-teal-400/50 rounded-full animate-ping delay-2000 shadow-lg shadow-teal-400/30"></div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-gray-950/50"></div>
      </div>

      <div className="relative z-10 space-y-8 max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-white via-gray-100 to-slate-200 bg-clip-text text-transparent mb-3 pb-2">
              Reviews & Feedback
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed pb-2">
              Manage your reviews and see feedback from the community
            </p>
          </div>
          <button
            onClick={handleWriteReview}
            className="group relative px-8 py-4 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-emerald-500/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Write Review
            </span>
          </button>
        </div>

        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Recent Reviews */}
        {renderRecentReviews()}

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8">
          {renderTabButton(
            TABS.RECEIVED,
            "Received",
            reviewStats?.received?.totalReviews
          )}
          {renderTabButton(TABS.GIVEN, "Given", reviewStats?.given?.totalReviews)}
        </div>

        {/* Tab Content */}
        <div className="bg-gray-950/25 backdrop-blur-xl border border-gray-800/30 rounded-3xl p-8 shadow-xl">
          {renderTabContent()}
        </div>

        {/* Write Review Modal */}
        <Modal
          isOpen={showWriteModal}
          onClose={handleCloseWriteModal}
          title="Write a Review"
          size="lg"
        >
          <div className="space-y-6">
            <p className="text-slate-400 leading-relaxed">
              Share your experience with a skill exchange partner
            </p>

            {/* Simple user selection for now - in production, this would be a search/select component */}
            <div className="bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-orange-500/10 border border-yellow-400/20 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-yellow-400 mb-3">
                <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center">
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
                </div>
                <span className="font-bold">
                  Feature in Development
                </span>
              </div>
              <p className="text-yellow-300/80 leading-relaxed">
                The ability to write reviews for specific users will be available
                once the matching and chat systems are integrated.
              </p>
            </div>

            <div className="flex items-center justify-end gap-4">
              <button
                onClick={handleCloseWriteModal}
                className="px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-slate-300 font-semibold rounded-xl hover:bg-gray-700/60 hover:border-gray-600/50 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}