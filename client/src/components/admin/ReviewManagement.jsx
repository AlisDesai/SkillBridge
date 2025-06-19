import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminReviewsAsync,
  deleteAdminReviewAsync,
  clearError,
} from "../../redux/slices/adminSlice";
import { showError, showSuccess } from "../../utils/toast";
import Button from "../common/Button";
import Modal from "../common/Modal";

const ReviewRow = ({ review, onDelete, isDeleting, onViewDetails }) => {
  const getRatingColor = (rating) => {
    const colors = {
      5: "text-emerald-400 bg-emerald-500/20",
      4: "text-green-400 bg-green-500/20",
      3: "text-teal-400 bg-teal-500/20",
      2: "text-yellow-400 bg-yellow-400/20",
      1: "text-red-400 bg-red-500/20",
    };
    return colors[rating] || "text-slate-400 bg-slate-500/20";
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-sm ${
          index < rating ? "text-yellow-400" : "text-slate-600"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <tr className="hover:bg-slate-900/50 border-b border-slate-800/50 transition-colors duration-200">
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
            {review.reviewer?.avatar ? (
              <img
                src={review.reviewer.avatar}
                alt={review.reviewer.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-xs text-white font-medium">
                {review.reviewer?.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white truncate">
              {review.reviewer?.name || "Anonymous"}
            </div>
            <div className="text-sm text-slate-400 truncate">
              {review.reviewer?.email || "No email"}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
            {review.reviewee?.avatar ? (
              <img
                src={review.reviewee.avatar}
                alt={review.reviewee.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-xs text-white font-medium">
                {review.reviewee?.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white truncate">
              {review.reviewee?.name || "Anonymous"}
            </div>
            <div className="text-sm text-slate-400 truncate">
              {review.reviewee?.email || "No email"}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex">{renderStars(review.rating)}</div>
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRatingColor(
              review.rating
            )}`}
          >
            {review.rating}/5
          </span>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="max-w-xs">
          <p className="text-sm text-slate-300 line-clamp-2">{review.comment}</p>
          {review.isEdited && (
            <span className="inline-flex mt-1 px-2 py-1 text-xs bg-teal-500/20 text-teal-400 rounded-full">
              Edited
            </span>
          )}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-white">
          {new Date(review.createdAt).toLocaleDateString()}
        </div>
        <div className="text-sm text-slate-400">
          {new Date(review.createdAt).toLocaleTimeString()}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2 flex-wrap">
          {review.isReported && (
            <span className="inline-flex px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full">
              Reported ({review.reportCount})
            </span>
          )}
          {review.matchId && (
            <span className="inline-flex px-2 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
              Verified
            </span>
          )}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => onViewDetails(review)}
            className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 text-sm font-medium transition-colors"
          >
            View
          </button>
          <button
            onClick={() => onDelete(review)}
            disabled={isDeleting === review._id}
            className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting === review._id ? (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </div>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};

const ReviewDetailsModal = ({ review, isOpen, onClose }) => {
  if (!review) return null;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? "text-yellow-400" : "text-slate-600"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Review Details" size="lg">
      <div className="space-y-6 bg-slate-950 p-6 rounded-xl">
        {/* Reviewer and Reviewee Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-white">Reviewer</h4>
            <div className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-full flex items-center justify-center">
                {review.reviewer?.avatar ? (
                  <img
                    src={review.reviewer.avatar}
                    alt={review.reviewer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium text-lg">
                    {review.reviewer?.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium text-white">
                  {review.reviewer?.name || "Anonymous"}
                </div>
                <div className="text-sm text-slate-400">
                  {review.reviewer?.email || "No email"}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-white">Reviewee</h4>
            <div className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-full flex items-center justify-center">
                {review.reviewee?.avatar ? (
                  <img
                    src={review.reviewee.avatar}
                    alt={review.reviewee.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium text-lg">
                    {review.reviewee?.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium text-white">
                  {review.reviewee?.name || "Anonymous"}
                </div>
                <div className="text-sm text-slate-400">
                  {review.reviewee?.email || "No email"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-3">
          <h4 className="font-medium text-white">Rating</h4>
          <div className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
            <div className="flex">{renderStars(review.rating)}</div>
            <span className="text-xl font-semibold text-white">
              {review.rating}/5
            </span>
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-3">
          <h4 className="font-medium text-white">Comment</h4>
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
            <p className="text-slate-300 leading-relaxed">{review.comment}</p>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-white">Review Information</h4>
            <div className="space-y-3 text-sm p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
              <div className="flex justify-between">
                <span className="text-slate-400">Created:</span>
                <span className="text-white">
                  {new Date(review.createdAt).toLocaleString()}
                </span>
              </div>
              {review.isEdited && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Edited:</span>
                  <span className="text-white">
                    {new Date(review.editedAt).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Verified Match:</span>
                <span className="text-white">
                  {review.matchId ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-white">Status</h4>
            <div className="space-y-2 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
              {review.isReported && (
                <span className="inline-flex px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded-full">
                  Reported ({review.reportCount} times)
                </span>
              )}
              {review.isEdited && (
                <span className="inline-flex px-3 py-1 text-sm bg-teal-500/20 text-teal-400 rounded-full">
                  Edited Review
                </span>
              )}
              {review.matchId && (
                <span className="inline-flex px-3 py-1 text-sm bg-emerald-500/20 text-emerald-400 rounded-full">
                  Verified Match
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default function ReviewManagement() {
  const dispatch = useDispatch();
  const { adminReviews, reviewsPagination, loading, error } = useSelector(
    (state) => state.admin
  );

  const [filters, setFilters] = useState({
    rating: "",
    reported: "",
    page: 1,
  });
  const [deleteModal, setDeleteModal] = useState({ show: false, review: null });
  const [detailsModal, setDetailsModal] = useState({
    show: false,
    review: null,
  });
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminReviewsAsync(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (error) {
      showError(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleDeleteReview = (review) => {
    setDeleteModal({ show: true, review });
  };

  const confirmDelete = async () => {
    if (!deleteModal.review) return;

    setDeletingId(deleteModal.review._id);
    try {
      await dispatch(deleteAdminReviewAsync(deleteModal.review._id)).unwrap();
      showSuccess("Review deleted successfully");
      setDeleteModal({ show: false, review: null });
      dispatch(fetchAdminReviewsAsync(filters));
    } catch (error) {
      showError(error?.message || "Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewDetails = (review) => {
    setDetailsModal({ show: true, review });
  };

  const renderPagination = () => {
    if (!reviewsPagination?.totalPages || reviewsPagination.totalPages <= 1)
      return null;

    const { currentPage, totalPages, hasPrevPage, hasNextPage } =
      reviewsPagination;

    return (
      <div className="flex items-center justify-between mt-6 px-6 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <span className="px-4 py-2 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 text-white rounded-lg font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>

        <p className="text-sm text-slate-400">
          Total: {reviewsPagination.totalReviews || 0} reviews
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-slate-200 bg-clip-text text-transparent">
              Review Management
            </h2>
            <p className="text-slate-400 mt-2 text-lg">Monitor and manage user reviews</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Rating Filter
              </label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange("rating", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-colors"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Status Filter
              </label>
              <select
                value={filters.reported}
                onChange={(e) => handleFilterChange("reported", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-colors"
              >
                <option value="">All Reviews</option>
                <option value="true">Reported Only</option>
                <option value="false">Non-Reported</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ rating: "", reported: "", page: 1 })}
                className="w-full px-4 py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !adminReviews?.length ? (
            <div className="text-center py-16">
              <div className="text-slate-300 mb-2 text-lg">No reviews found</div>
              <p className="text-sm text-slate-500">
                {filters.rating || filters.reported
                  ? "Try adjusting your filters"
                  : "No reviews have been created yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Reviewer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Reviewee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Comment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-900/30">
                  {adminReviews.map((review) => (
                    <ReviewRow
                      key={review._id}
                      review={review}
                      onDelete={handleDeleteReview}
                      onViewDetails={handleViewDetails}
                      isDeleting={deletingId}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {renderPagination()}
        </div>

        {/* Review Details Modal */}
        <ReviewDetailsModal
          review={detailsModal.review}
          isOpen={detailsModal.show}
          onClose={() => setDetailsModal({ show: false, review: null })}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.show}
          onClose={() => setDeleteModal({ show: false, review: null })}
          title="Delete Review"
        >
          <div className="space-y-6 bg-slate-950 p-6 rounded-xl">
            <p className="text-slate-300 text-lg">
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
            {deleteModal.review && (
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-medium text-white">
                    {deleteModal.review.reviewer?.name} →{" "}
                    {deleteModal.review.reviewee?.name}
                  </span>
                  <span className="text-yellow-400">
                    {"★".repeat(deleteModal.review.rating)}
                  </span>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2">
                  {deleteModal.review.comment}
                </p>
              </div>
            )}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, review: null })}
                disabled={deletingId}
                className="px-6 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId}
                className="px-6 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 disabled:opacity-50 transition-colors"
              >
                {deletingId ? "Deleting..." : "Delete Review"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}