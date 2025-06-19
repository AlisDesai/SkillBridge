import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserReviewsAsync,
  deleteReviewAsync,
} from "../../redux/slices/reviewSlice";
import { showError, showSuccess } from "../../utils/toast";
import Button from "../common/Button";
import Modal from "../common/Modal";

const RATING_COLORS = {
  5: "text-emerald-400",
  4: "text-green-400",
  3: "text-yellow-400",
  2: "text-orange-400",
  1: "text-red-400",
};

export default function ReviewList({
  userId,
  showActions = false,
  limit = 10,
  showTitle = true,
}) {
  const dispatch = useDispatch();
  const { reviews, loading, pagination, statistics, error } = useSelector(
    (state) => state.review
  );
  const { user: currentUser } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    reviewId: null,
  });
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (userId) {
      dispatch(
        fetchUserReviewsAsync({
          userId,
          page: currentPage,
          limit,
        })
      );
    }
  }, [dispatch, userId, currentPage, limit]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (reviewId) => {
    setDeleteModal({ show: true, reviewId });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.reviewId) return;

    setDeletingId(deleteModal.reviewId);
    try {
      await dispatch(deleteReviewAsync(deleteModal.reviewId)).unwrap();
      showSuccess("Review deleted successfully");

      // Refresh reviews
      dispatch(
        fetchUserReviewsAsync({
          userId,
          page: currentPage,
          limit,
        })
      );
    } catch (error) {
      showError(error?.message || "Failed to delete review");
    } finally {
      setDeletingId(null);
      setDeleteModal({ show: false, reviewId: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, reviewId: null });
  };

  const canDeleteReview = (review) => {
    return (
      showActions &&
      (currentUser?._id === review.reviewer._id ||
        currentUser?.role === "admin")
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg transition-all duration-300 hover:scale-125 ${
          index < rating ? "text-yellow-400 drop-shadow-lg" : "text-gray-600"
        }`}
      >
        ★
      </span>
    ));
  };

  const renderRatingStats = () => {
    if (!statistics?.totalReviews) return null;

    return (
      <div className="bg-gray-900/25 backdrop-blur-sm border border-gray-800/30 rounded-2xl p-6 mb-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent pb-2">
              {statistics.averageRating}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(statistics.averageRating))}
            </div>
            <div className="text-sm text-slate-400">
              Based on {statistics.totalReviews} review
              {statistics.totalReviews !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="flex-1 max-w-md ml-8">
            {statistics.ratingDistribution?.map((item) => (
              <div key={item.rating} className="flex items-center gap-3 mb-2">
                <span className="text-sm text-slate-300 w-4">{item.rating}</span>
                <span className="text-yellow-400">★</span>
                <div className="flex-1 bg-gray-800/50 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        statistics.totalReviews > 0
                          ? (item.count / statistics.totalReviews) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm text-slate-400 w-8">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPagination = () => {
    if (!pagination?.totalPages || pagination.totalPages <= 1) return null;

    const pages = [];
    const current = pagination.currentPage;
    const total = pagination.totalPages;

    // Always show first page
    if (current > 3) {
      pages.push(1);
      if (current > 4) pages.push("...");
    }

    // Show pages around current
    for (
      let i = Math.max(1, current - 2);
      i <= Math.min(total, current + 2);
      i++
    ) {
      pages.push(i);
    }

    // Always show last page
    if (current < total - 2) {
      if (current < total - 3) pages.push("...");
      pages.push(total);
    }

    return (
      <div className="flex items-center justify-center gap-3 mt-8">
        <button
          onClick={() => handlePageChange(current - 1)}
          disabled={!pagination.hasPrevPage}
          className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-slate-300 font-medium rounded-xl hover:bg-gray-700/60 hover:border-gray-600/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            disabled={typeof page !== "number"}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              page === current
                ? "bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                : typeof page === "number"
                ? "bg-gray-800/50 text-slate-300 hover:bg-gray-700/60 border border-gray-700/50 hover:border-emerald-400/30 hover:text-emerald-400"
                : "text-slate-600 cursor-default"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(current + 1)}
          disabled={!pagination.hasNextPage}
          className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-slate-300 font-medium rounded-xl hover:bg-gray-700/60 hover:border-gray-600/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading && currentPage === 1) {
    return (
      <div className="space-y-6">
        {showTitle && (
          <h3 className="text-xl font-bold text-white pb-2">Reviews</h3>
        )}
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center animate-pulse shadow-2xl shadow-emerald-500/25">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {showTitle && (
          <h3 className="text-xl font-bold text-white pb-2">Reviews</h3>
        )}
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-red-400/25 via-red-500/20 to-red-600/25 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="text-red-400 mb-4 text-lg font-semibold">Failed to load reviews</div>
          <button
            onClick={() =>
              dispatch(
                fetchUserReviewsAsync({ userId, page: currentPage, limit })
              )
            }
            className="px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-slate-300 font-semibold rounded-xl hover:bg-gray-700/60 hover:border-gray-600/50 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showTitle && (
        <h3 className="text-xl font-bold text-white pb-2">
          Reviews{" "}
          {statistics?.totalReviews ? (
            <span className="text-emerald-400">({statistics.totalReviews})</span>
          ) : ""}
        </h3>
      )}

      {renderRatingStats()}

      {!reviews?.length ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-400/25 via-green-500/20 to-teal-600/25 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="text-slate-300 mb-2 text-lg font-semibold">No reviews yet</div>
          <p className="text-slate-400 leading-relaxed">
            Reviews will appear here once users start sharing their experiences
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div
              key={review._id}
              className="group bg-gray-900/25 backdrop-blur-sm border border-gray-800/25 rounded-2xl p-6 hover:bg-gray-900/40 hover:border-emerald-400/30 transition-all duration-300 transform hover:scale-102 relative overflow-hidden shadow-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-green-500/5 to-teal-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              
              <div className="relative flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
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

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 text-lg pb-1">
                          {review.reviewer?.name || "Anonymous"}
                        </h4>
                        <div className="flex items-center gap-3">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span
                            className={`text-sm font-bold ${
                              RATING_COLORS[review.rating]
                            }`}
                          >
                            {review.rating}/5
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-slate-500 group-hover:text-emerald-400 transition-colors duration-300">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                        {review.isEdited && (
                          <div className="text-xs text-slate-600">Edited</div>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300 leading-relaxed mb-3 pb-1">
                      {review.comment}
                    </p>

                    {review.matchId && (
                      <div className="mt-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/30">
                          Verified Match
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {canDeleteReview(review) && (
                  <div className="relative ml-3">
                    <button
                      onClick={() => handleDeleteClick(review._id)}
                      disabled={deletingId === review._id}
                      className="w-10 h-10 bg-gray-800/50 hover:bg-red-500/20 border border-gray-700/50 hover:border-red-500/50 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-400 transition-all duration-300 group/delete"
                      title="Delete review"
                    >
                      {deletingId === review._id ? (
                        <div className="w-4 h-4 border border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg
                          className="w-5 h-5 group-hover/delete:scale-110 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {renderPagination()}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={handleDeleteCancel}
        title="Delete Review"
      >
        <div className="space-y-6">
          <p className="text-slate-400 leading-relaxed">
            Are you sure you want to delete this review? This action cannot be
            undone.
          </p>
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={handleDeleteCancel}
              disabled={deletingId}
              className="px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-slate-300 font-semibold rounded-xl hover:bg-gray-700/60 hover:border-gray-600/50 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deletingId}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/30"
            >
              {deletingId ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}