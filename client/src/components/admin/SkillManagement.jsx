import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminSkillsAsync,
  deleteAdminSkillAsync,
  clearError,
} from "../../redux/slices/adminSlice";
import { showError, showSuccess } from "../../utils/toast";
import Button from "../common/Button";
import Modal from "../common/Modal";

const SkillRow = ({ skill, onDelete, onViewDetails, isDeleting }) => {
  const getSkillTypeColor = (type) => {
    const colors = {
      teach: "text-blue-600 bg-blue-100",
      learn: "text-green-600 bg-green-100",
      both: "text-purple-600 bg-purple-100",
    };
    return colors[type] || "text-gray-600 bg-gray-100";
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            {skill.user?.avatar ? (
              <img
                src={skill.user.avatar}
                alt={skill.user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-xs text-gray-600">
                {skill.user?.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {skill.user?.name || "Anonymous"}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {skill.user?.email || "No email"}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {skill.name}
          </span>
          {skill.category && (
            <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
              {skill.category}
            </span>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="max-w-xs">
          <p className="text-sm text-gray-900">
            {truncateText(skill.description)}
          </p>
        </div>
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSkillTypeColor(
            skill.type
          )}`}
        >
          {skill.type || "N/A"}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {skill.level && (
            <span className="inline-flex px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
              Level {skill.level}
            </span>
          )}
          {skill.isVerified && (
            <span className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              Verified
            </span>
          )}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {new Date(skill.createdAt).toLocaleDateString()}
        </div>
        <div className="text-sm text-gray-500">
          {new Date(skill.createdAt).toLocaleTimeString()}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(skill)}
          >
            View
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(skill)}
            disabled={isDeleting === skill._id}
          >
            {isDeleting === skill._id ? (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </div>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </td>
    </tr>
  );
};

const SkillDetailsModal = ({ skill, isOpen, onClose }) => {
  if (!skill) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Skill Details" size="lg">
      <div className="space-y-6">
        {/* User Info */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Skill Owner</h4>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              {skill.user?.avatar ? (
                <img
                  src={skill.user.avatar}
                  alt={skill.user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-600 font-medium">
                  {skill.user?.name?.charAt(0)?.toUpperCase() || "?"}
                </span>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {skill.user?.name || "Anonymous"}
              </div>
              <div className="text-sm text-gray-500">
                {skill.user?.email || "No email"}
              </div>
            </div>
          </div>
        </div>

        {/* Skill Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Basic Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="text-gray-900 font-medium">{skill.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="text-gray-900">{skill.category || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="text-gray-900 capitalize">
                  {skill.type || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Level:</span>
                <span className="text-gray-900">{skill.level || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Status</h4>
            <div className="space-y-2">
              {skill.isVerified && (
                <span className="inline-flex px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                  Verified Skill
                </span>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Created:</span>
                <span className="text-gray-900">
                  {new Date(skill.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Description</h4>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-900 leading-relaxed">
              {skill.description || "No description provided"}
            </p>
          </div>
        </div>

        {/* Tags */}
        {skill.tags && skill.tags.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {skill.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default function SkillManagement() {
  const dispatch = useDispatch();
  const {
    adminSkills,
    skillsPagination,
    loading: skillsLoading,
    error,
  } = useSelector((state) => state.admin);

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    page: 1,
  });
  const [deleteModal, setDeleteModal] = useState({ show: false, skill: null });
  const [detailsModal, setDetailsModal] = useState({
    show: false,
    skill: null,
  });
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminSkillsAsync(filters));
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

  const handleDeleteSkill = (skill) => {
    setDeleteModal({ show: true, skill });
  };

  const confirmDelete = async () => {
    if (!deleteModal.skill) return;

    setDeletingId(deleteModal.skill._id);
    try {
      await dispatch(deleteAdminSkillAsync(deleteModal.skill._id)).unwrap();
      showSuccess("Skill deleted successfully");
      setDeleteModal({ show: false, skill: null });
      dispatch(fetchAdminSkillsAsync(filters)); // Refresh data
    } catch (error) {
      showError(error?.message || "Failed to delete skill");
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewDetails = (skill) => {
    setDetailsModal({ show: true, skill });
  };

  const renderPagination = () => {
    if (!skillsPagination?.totalPages || skillsPagination.totalPages <= 1)
      return null;

    const { currentPage, totalPages, hasPrevPage, hasNextPage } =
      skillsPagination;

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
          Total: {skillsPagination.totalSkills || 0} skills
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
            Skill Management
          </h2>
          <p className="text-gray-600 mt-1">Monitor and manage user skills</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Skills
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search by skill name..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF7A59] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type Filter
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF7A59] focus:border-transparent"
            >
              <option value="teach">Teaching</option>
              <option value="learn">Learning</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setFilters({ search: "", type: "", page: 1 })}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Skills Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {skillsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#FF7A59] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !adminSkills?.length ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">No skills found</div>
            <p className="text-sm text-gray-400">
              {filters.search || filters.type
                ? "Try adjusting your filters"
                : "No skills have been created yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skill Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adminSkills.map((skill) => (
                  <SkillRow
                    key={skill._id}
                    skill={skill}
                    onDelete={handleDeleteSkill}
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

      {/* Skill Details Modal */}
      <SkillDetailsModal
        skill={detailsModal.skill}
        isOpen={detailsModal.show}
        onClose={() => setDetailsModal({ show: false, skill: null })}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, skill: null })}
        title="Delete Skill"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this skill? This action cannot be
            undone.
          </p>
          {deleteModal.skill && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-medium">{deleteModal.skill.name}</span>
                <span className="text-sm text-gray-500">
                  by {deleteModal.skill.user?.name || "Unknown"}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {deleteModal.skill.description?.length > 100
                  ? deleteModal.skill.description.substring(0, 100) + "..."
                  : deleteModal.skill.description || "No description"}
              </p>
            </div>
          )}
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ show: false, skill: null })}
              disabled={deletingId}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              disabled={deletingId}
            >
              {deletingId ? "Deleting..." : "Delete Skill"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
