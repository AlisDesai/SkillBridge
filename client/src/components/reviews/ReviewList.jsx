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
  5: "text-green-600",
  4: "text-blue-600",
  3: "text-yellow-600",
  2: "text-orange-600",
  1: "text-red-600",
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
        className={`text-lg ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  const renderRatingStats = () => {
    if (!statistics?.totalReviews) return null;

    return (
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">
              {statistics.averageRating}
            </div>
            <div className="flex justify-center mb-1">
              {renderStars(Math.round(statistics.averageRating))}
            </div>
            <div className="text-sm text-gray-600">
              Based on {statistics.totalReviews} review
              {statistics.totalReviews !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="flex-1 max-w-md ml-6">
            {statistics.ratingDistribution?.map((item) => (
              <div key={item.rating} className="flex items-center gap-2 mb-1">
                <span className="text-sm w-4">{item.rating}</span>
                <span className="text-yellow-400">★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        statistics.totalReviews > 0
                          ? (item.count / statistics.totalReviews) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{item.count}</span>
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
      <div className="flex items-center justify-center gap-2 mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(current - 1)}
          disabled={!pagination.hasPrevPage}
        >
          Previous
        </Button>

        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            disabled={typeof page !== "number"}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              page === current
                ? "bg-[#FF7A59] text-white"
                : typeof page === "number"
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "text-gray-400 cursor-default"
            }`}
          >
            {page}
          </button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(current + 1)}
          disabled={!pagination.hasNextPage}
        >
          Next
        </Button>
      </div>
    );
  };

  if (loading && currentPage === 1) {
    return (
      <div className="space-y-4">
        {showTitle && (
          <h3 className="text-lg font-semibold text-gray-800">Reviews</h3>
        )}
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-[#FF7A59] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        {showTitle && (
          <h3 className="text-lg font-semibold text-gray-800">Reviews</h3>
        )}
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">Failed to load reviews</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              dispatch(
                fetchUserReviewsAsync({ userId, page: currentPage, limit })
              )
            }
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-800">
          Reviews{" "}
          {statistics?.totalReviews ? `(${statistics.totalReviews})` : ""}
        </h3>
      )}

      {renderRatingStats()}

      {!reviews?.length ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">No reviews yet</div>
          <p className="text-sm text-gray-400">
            Reviews will appear here once users start sharing their experiences
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    {review.reviewer?.avatar ? (
                      <img
                        src={review.reviewer.avatar}
                        alt={review.reviewer.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-medium">
                        {review.reviewer?.name?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {review.reviewer?.name || "Anonymous"}
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              RATING_COLORS[review.rating]
                            }`}
                          >
                            {review.rating}/5
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                        {review.isEdited && (
                          <div className="text-xs text-gray-400">Edited</div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review.comment}
                    </p>

                    {review.matchId && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          Verified Match
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {canDeleteReview(review) && (
                  <div className="ml-2">
                    <button
                      onClick={() => handleDeleteClick(review._id)}
                      disabled={deletingId === review._id}
                      className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                      title="Delete review"
                    >
                      {deletingId === review._id ? (
                        <div className="w-4 h-4 border border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg
                          className="w-4 h-4"
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
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this review? This action cannot be
            undone.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={deletingId}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              disabled={deletingId}
            >
              {deletingId ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
