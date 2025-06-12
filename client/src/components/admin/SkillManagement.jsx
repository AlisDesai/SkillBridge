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

const SkillRow = ({ skill, onDelete, isDeleting }) => {
  const getTypeColor = (type) => {
    const colors = {
      teach: "bg-green-100 text-green-800",
      learn: "bg-blue-100 text-blue-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getLevelColor = (level) => {
    const colors = {
      beginner: "bg-yellow-100 text-yellow-800",
      intermediate: "bg-orange-100 text-orange-800",
      advanced: "bg-red-100 text-red-800",
      expert: "bg-purple-100 text-purple-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10">
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {skill.name}
            </div>
            <div className="text-sm text-gray-500">
              {skill.category || "Uncategorized"}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
            skill.type
          )}`}
        >
          {skill.type === "teach" ? "Teaching" : "Learning"}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(
            skill.level
          )}`}
        >
          {skill.level
            ? skill.level.charAt(0).toUpperCase() + skill.level.slice(1)
            : "N/A"}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 max-w-xs truncate">
          {skill.description || "No description"}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
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
          <div>
            <div className="text-sm font-medium text-gray-900">
              {skill.user?.name || "Unknown User"}
            </div>
            <div className="text-sm text-gray-500">
              {skill.user?.email || "No email"}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(skill.createdAt).toLocaleDateString()}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
      </td>
    </tr>
  );
};

const SkillDetailsModal = ({ skill, isOpen, onClose }) => {
  if (!skill) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Skill Details" size="lg">
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Skill Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="text-gray-900 font-medium">{skill.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="text-gray-900">
                  {skill.category || "Uncategorized"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="text-gray-900 capitalize">{skill.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Level:</span>
                <span className="text-gray-900 capitalize">
                  {skill.level || "Not specified"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">User Information</h4>
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
                  {skill.user?.name || "Unknown User"}
                </div>
                <div className="text-sm text-gray-500">
                  {skill.user?.email || "No email"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {skill.description && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Description</h4>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-900 leading-relaxed">
                {skill.description}
              </p>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Timestamps</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Created:</span>
              <span className="text-gray-900">
                {new Date(skill.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Updated:</span>
              <span className="text-gray-900">
                {new Date(skill.updatedAt).toLocaleString()}
              </span>
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

export default function SkillManagement() {
  const dispatch = useDispatch();
  const {
    adminSkills,
    skillsPagination,
    skillStatistics,
    skillsLoading,
    error,
  } = useSelector((state) => state.admin);

  const [filters, setFilters] = useState({
    type: "",
    search: "",
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

  const renderStatistics = () => {
    if (!skillStatistics?.length) return null;

    return (
      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Skill Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skillStatistics.map((stat) => (
            <div
              key={stat._id}
              className="text-center p-4 bg-gray-50 rounded-lg"
            >
              <div className="text-2xl font-bold text-gray-900">
                {stat.count}
              </div>
              <div className="text-sm text-gray-600 capitalize">
                {stat._id === "teach" ? "Teaching Skills" : "Learning Skills"}
              </div>
            </div>
          ))}
        </div>
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
          <p className="text-gray-600 mt-1">
            Manage platform skills and categories
          </p>
        </div>
      </div>

      {/* Statistics */}
      {renderStatistics()}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Skills
            </label>
            <input
              type="text"
              placeholder="Search by skill name..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF7A59] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF7A59] focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="teach">Teaching</option>
              <option value="learn">Learning</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setFilters({ type: "", search: "", page: 1 })}
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
                    Skill
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
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
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{deleteModal.skill.name}</span>
                <span className="text-sm text-gray-500 capitalize">
                  {deleteModal.skill.type}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Owner: {deleteModal.skill.user?.name || "Unknown User"}
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
