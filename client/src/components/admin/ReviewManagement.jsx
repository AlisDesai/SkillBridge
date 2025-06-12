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
const ReviewRow = ({ review, onDelete, isDeleting }) => {
  const getRatingColor = (rating) => {
    const colors = {
      5: "text-green-600 bg-green-100",
      4: "text-blue-600 bg-blue-100",
      3: "text-yellow-600 bg-yellow-100",
      2: "text-orange-600 bg-orange-100",
      1: "text-red-600 bg-red-100",
    };
    return colors[rating] || "text-gray-600 bg-gray-100";
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-sm ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
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
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {review.reviewer?.name || "Anonymous"}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {review.reviewer?.email || "No email"}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            {review.reviewee?.avatar ? (
              <img
                src={review.reviewee.avatar}
                alt={review.reviewee.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-xs text-gray-600">
                {review.reviewee?.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {review.reviewee?.name || "Anonymous"}
            </div>
            <div className="text-sm text-gray-500 truncate">
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
          <p className="text-sm text-gray-900 line-clamp-2">{review.comment}</p>
          {review.isEdited && (
            <span className="inline-flex mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              Edited
            </span>
          )}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {new Date(review.createdAt).toLocaleDateString()}
        </div>
        <div className="text-sm text-gray-500">
          {new Date(review.createdAt).toLocaleTimeString()}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {review.isReported && (
            <span className="inline-flex px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
              Reported ({review.reportCount})
            </span>
          )}
          {review.matchId && (
            <span className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              Verified
            </span>
          )}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(review)}
          disabled={isDeleting === review._id}
        >
          {isDeleting === review._id ? (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
              Deleting...
            </div>
          ) : (
            "Delete"
          )}
        </Button>
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
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Review Details" size="lg">
      <div className="space-y-6">
        {/* Reviewer and Reviewee Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Reviewer</h4>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
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
              <div>
                <div className="font-medium text-gray-900">
                  {review.reviewer?.name || "Anonymous"}
                </div>
                <div className="text-sm text-gray-500">
                  {review.reviewer?.email || "No email"}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Reviewee</h4>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                {review.reviewee?.avatar ? (
                  <img
                    src={review.reviewee.avatar}
                    alt={review.reviewee.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-medium">
                    {review.reviewee?.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {review.reviewee?.name || "Anonymous"}
                </div>
                <div className="text-sm text-gray-500">
                  {review.reviewee?.email || "No email"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Rating</h4>
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(review.rating)}</div>
            <span className="text-lg font-semibold text-gray-900">
              {review.rating}/5
            </span>
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Comment</h4>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-900 leading-relaxed">{review.comment}</p>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Review Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="text-gray-900">
                  {new Date(review.createdAt).toLocaleString()}
                </span>
              </div>
              {review.isEdited && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Edited:</span>
                  <span className="text-gray-900">
                    {new Date(review.editedAt).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Verified Match:</span>
                <span className="text-gray-900">
                  {review.matchId ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Status</h4>
            <div className="space-y-2">
              {review.isReported && (
                <span className="inline-flex px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full">
                  Reported ({review.reportCount} times)
                </span>
              )}
              {review.isEdited && (
                <span className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                  Edited Review
                </span>
              )}
              {review.matchId && (
                <span className="inline-flex px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                  Verified Match
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
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
      dispatch(fetchAdminReviewsAsync(filters)); // Refresh data
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage}
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
          >
            Next
          </Button>
        </div>

        <p className="text-sm text-gray-600">
          Total: {reviewsPagination.totalReviews || 0} reviews
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Review Management
          </h2>
          <p className="text-gray-600 mt-1">Monitor and manage user reviews</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating Filter
            </label>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange("rating", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF7A59] focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Filter
            </label>
            <select
              value={filters.reported}
              onChange={(e) => handleFilterChange("reported", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF7A59] focus:border-transparent"
            >
              <option value="">All Reviews</option>
              <option value="true">Reported Only</option>
              <option value="false">Non-Reported</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setFilters({ rating: "", reported: "", page: 1 })}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#FF7A59] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !adminReviews?.length ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">No reviews found</div>
            <p className="text-sm text-gray-400">
              {filters.rating || filters.reported
                ? "Try adjusting your filters"
                : "No reviews have been created yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reviewer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reviewee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adminReviews.map((review) => (
                  <ReviewRow
                    key={review._id}
                    review={review}
                    onDelete={handleDeleteReview}
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
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this review? This action cannot be
            undone.
          </p>
          {deleteModal.review && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-medium">
                  {deleteModal.review.reviewer?.name} →{" "}
                  {deleteModal.review.reviewee?.name}
                </span>
                <span className="text-yellow-500">
                  {"★".repeat(deleteModal.review.rating)}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {deleteModal.review.comment}
              </p>
            </div>
          )}
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ show: false, review: null })}
              disabled={deletingId}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              disabled={deletingId}
            >
              {deletingId ? "Deleting..." : "Delete Review"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
