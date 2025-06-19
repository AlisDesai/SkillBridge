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
      teach: "bg-gradient-to-r from-blue-400/25 to-blue-500/25 text-blue-400 border border-blue-400/40 shadow-sm",
      learn: "bg-gradient-to-r from-green-400/25 to-emerald-500/25 text-green-400 border border-green-400/40 shadow-sm",
      both: "bg-gradient-to-r from-purple-400/25 to-purple-500/25 text-purple-400 border border-purple-400/40 shadow-sm",
    };
    return colors[type] || "bg-gradient-to-r from-slate-500/25 to-gray-500/25 text-slate-400 border border-slate-400/40 shadow-sm";
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <tr className="hover:bg-gradient-to-r hover:from-emerald-500/15 hover:to-teal-500/15 transition-all duration-300 border-b border-slate-500/20 group">
      <td className="px-8 py-6">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 ring-2 ring-emerald-400/30 shadow-lg group-hover:ring-emerald-400/50 transition-all duration-300">
            {skill.user?.avatar ? (
              <img
                src={skill.user.avatar}
                alt={skill.user.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-lg">
                {skill.user?.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors duration-300 truncate">
              {skill.user?.name || "Anonymous"}
            </div>
            <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300 truncate">
              {skill.user?.email || "No email"}
            </div>
          </div>
        </div>
      </td>

      <td className="px-8 py-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors duration-300">
            {skill.name}
          </span>
          {skill.category && (
            <span className="inline-flex px-3 py-1 text-xs bg-gradient-to-r from-slate-500/30 to-gray-500/30 text-slate-300 border border-slate-400/30 rounded-lg">
              {skill.category}
            </span>
          )}
        </div>
      </td>

      <td className="px-8 py-6">
        <div className="max-w-xs">
          <p className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
            {truncateText(skill.description)}
          </p>
        </div>
      </td>

      <td className="px-8 py-6">
        <span
          className={`inline-flex px-3 py-1.5 text-sm font-semibold rounded-lg ${getSkillTypeColor(
            skill.type
          )}`}
        >
          {skill.type || "N/A"}
        </span>
      </td>

      <td className="px-8 py-6">
        <div className="flex items-center gap-2">
          {skill.level && (
            <span className="inline-flex px-3 py-1 text-xs bg-gradient-to-r from-yellow-400/25 to-yellow-500/25 text-yellow-400 border border-yellow-400/40 rounded-lg shadow-sm">
              Level {skill.level}
            </span>
          )}
          {skill.isVerified && (
            <span className="inline-flex px-3 py-1 text-xs bg-gradient-to-r from-green-400/25 to-emerald-500/25 text-green-400 border border-green-400/40 rounded-lg shadow-sm">
              Verified
            </span>
          )}
        </div>
      </td>

      <td className="px-8 py-6 whitespace-nowrap">
        <div className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
          {new Date(skill.createdAt).toLocaleDateString()}
        </div>
        <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
          {new Date(skill.createdAt).toLocaleTimeString()}
        </div>
      </td>

      <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => onViewDetails(skill)}
            className="group/btn relative px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all duration-300 font-medium border border-teal-400/30 shadow-lg hover:shadow-emerald-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            <span className="relative">View</span>
          </button>
          <button
            onClick={() => onDelete(skill)}
            disabled={isDeleting === skill._id}
            className="group/btn relative px-4 py-2 bg-gradient-to-r from-red-500/80 to-red-600/80 text-white rounded-lg hover:from-red-500 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium border border-red-400/30 shadow-lg hover:shadow-red-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-500/20 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              {isDeleting === skill._id ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Deleting...
                </div>
              ) : (
                "Delete"
              )}
            </div>
          </button>
        </div>
      </td>
    </tr>
  );
};

const SkillDetailsModal = ({ skill, isOpen, onClose }) => {
  if (!skill) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Skill Details" 
      size="lg"
      className="bg-gradient-to-br from-gray-950 via-slate-950 to-black border border-slate-500"
    >
      <div className="bg-gradient-to-br from-gray-950/95 via-slate-950/90 to-black/95 p-6 rounded-2xl border border-slate-500/30 space-y-6">
        {/* User Info */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-200">Skill Owner</h4>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-xl border border-emerald-400/25">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
              {skill.user?.avatar ? (
                <img
                  src={skill.user.avatar}
                  alt={skill.user.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
              ) : (
                <span className="text-white font-semibold">
                  {skill.user?.name?.charAt(0)?.toUpperCase() || "?"}
                </span>
              )}
            </div>
            <div>
              <div className="font-semibold text-white">
                {skill.user?.name || "Anonymous"}
              </div>
              <div className="text-sm text-slate-400">
                {skill.user?.email || "No email"}
              </div>
            </div>
          </div>
        </div>

        {/* Skill Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200">Basic Information</h4>
            <div className="space-y-3 text-sm bg-gradient-to-r from-slate-500/15 to-gray-500/15 p-4 rounded-xl border border-slate-400/25">
              <div className="flex justify-between">
                <span className="text-slate-400">Name:</span>
                <span className="text-white font-medium">{skill.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="text-white">{skill.category || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Type:</span>
                <span className="text-white capitalize">
                  {skill.type || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Level:</span>
                <span className="text-white">{skill.level || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200">Status</h4>
            <div className="space-y-3 bg-gradient-to-r from-slate-500/15 to-gray-500/15 p-4 rounded-xl border border-slate-400/25">
              {skill.isVerified && (
                <span className="inline-flex px-3 py-1 text-sm bg-gradient-to-r from-green-400/25 to-emerald-500/25 text-green-400 border border-green-400/40 rounded-lg">
                  Verified Skill
                </span>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Created:</span>
                <span className="text-white">
                  {new Date(skill.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-200">Description</h4>
          <div className="p-4 bg-gradient-to-r from-slate-500/15 to-gray-500/15 rounded-xl border border-slate-400/25">
            <p className="text-slate-300 leading-relaxed">
              {skill.description || "No description provided"}
            </p>
          </div>
        </div>

        {/* Tags */}
        {skill.tags && skill.tags.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {skill.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex px-3 py-1 text-xs bg-gradient-to-r from-blue-400/25 to-blue-500/25 text-blue-400 border border-blue-400/40 rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end pt-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-slate-500/50 to-gray-500/50 text-slate-300 border border-slate-400/30 rounded-xl hover:from-slate-400/50 hover:to-gray-400/50 transition-all duration-300 font-medium"
          >
            Close
          </button>
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
      dispatch(fetchAdminSkillsAsync(filters));
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
      <div className="flex items-center justify-between mt-8 px-6 py-4 bg-gradient-to-r from-gray-900/95 via-slate-900/90 to-gray-950/95 rounded-2xl border border-slate-500/30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium border border-teal-400/30"
          >
            Previous
          </button>

          <span className="text-sm font-semibold text-slate-300 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 px-4 py-2 rounded-lg border border-emerald-400/30">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium border border-teal-400/30"
          >
            Next
          </button>
        </div>

        <p className="text-sm font-semibold text-slate-300 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 px-4 py-2 rounded-lg border border-emerald-400/30">
          Total: {skillsPagination.totalSkills || 0} skills
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        {/* <div className="relative py-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/3 to-teal-500/5 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/5 to-transparent blur-xl"></div>
          
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-2xl mb-6 border-2 border-emerald-400/30 shadow-2xl shadow-emerald-500/25 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/20 to-teal-400/20 rounded-2xl animate-pulse"></div>
              <svg className="w-10 h-10 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-emerald-200 to-slate-300 bg-clip-text text-transparent leading-tight">
                Skill Management
              </h1>
              <div className="w-28 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-full mx-auto shadow-lg shadow-emerald-500/30"></div>
              <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                Monitor and manage user skills across the platform with comprehensive administrative controls
              </p>
            </div>
          </div>
        </div> */}

        {/* Filters */}
        <div className="bg-gradient-to-br from-gray-950/95 via-slate-950/90 to-black/95 rounded-3xl border border-slate-500/30 p-8 backdrop-blur-sm">
          <div className="flex items-end justify-between gap-8">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Search Skills
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Search by skill name..."
                className="w-full border-2 border-slate-500/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-gradient-to-r from-gray-900 to-slate-900 text-white placeholder-slate-400 transition-all duration-300"
              />
            </div>

            <div className="w-64">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Type Filter
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full border-2 border-slate-500/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-gradient-to-r from-gray-900 to-slate-900 text-white transition-all duration-300 [&>option]:bg-gray-900 [&>option]:text-white [&>option]:py-2"
              >
                <option value="" className="bg-gray-900 text-white">All Types</option>
                <option value="teach" className="bg-gray-900 text-white">Teaching</option>
                <option value="learn" className="bg-gray-900 text-white">Learning</option>
              </select>
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={() => setFilters({ search: "", type: "", page: 1 })}
                className="group relative px-8 py-3 bg-gradient-to-r from-teal-500/80 to-emerald-500/80 text-white border border-teal-400/50 rounded-xl hover:from-teal-500 hover:to-emerald-500 hover:border-teal-400/70 transition-all duration-300 font-medium shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear Filters
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Skills Table */}
        <div className="bg-gradient-to-br from-gray-950/95 via-slate-950/90 to-black/95 rounded-3xl border border-slate-500/30 overflow-hidden backdrop-blur-sm shadow-2xl shadow-black/20">
          {skillsLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-600/30 border-t-emerald-400 rounded-full animate-spin mb-6"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-green-500 rounded-full animate-spin animate-reverse"></div>
              </div>
              <p className="text-slate-400 font-medium text-lg">Loading skills...</p>
            </div>
          ) : !adminSkills?.length ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-500/30 to-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-400/30 shadow-lg">
                <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="text-slate-300 mb-3 text-2xl font-semibold">No skills found</div>
              <p className="text-slate-500 text-lg">
                {filters.search || filters.type
                  ? "Try adjusting your filters to find skills"
                  : "No skills have been created yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-500/20">
                <thead className="bg-gradient-to-r from-emerald-500/25 to-teal-500/25 border-b-2 border-slate-500/30 backdrop-blur-sm">
                  <tr>
                    <th className="px-8 py-6 text-left text-sm font-bold text-slate-200 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-slate-200 uppercase tracking-wider">
                      Skill Name
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-slate-200 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-slate-200 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-slate-200 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-slate-200 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-8 py-6 text-right text-sm font-bold text-slate-200 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gradient-to-br from-gray-950/90 via-slate-950/90 to-black/90 divide-y divide-slate-500/20">
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
          className="bg-gradient-to-br from-gray-950 via-slate-950 to-black border border-slate-500"
        >
          <div className="bg-gradient-to-br from-gray-950/95 via-slate-950/90 to-black/95 p-6 rounded-2xl border border-slate-500/30 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500/30 to-red-600/30 rounded-full flex items-center justify-center border border-red-400/30">
                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Confirm Deletion</h3>
                <p className="text-slate-400">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-slate-300">
              Are you sure you want to delete this skill? This action cannot be undone.
            </p>
            
            {deleteModal.skill && (
              <div className="p-4 bg-gradient-to-r from-red-500/15 to-red-600/15 rounded-xl border border-red-400/25">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-white">{deleteModal.skill.name}</span>
                  <span className="text-sm text-slate-400">
                    by {deleteModal.skill.user?.name || "Unknown"}
                  </span>
                </div>
                <p className="text-sm text-slate-300">
                  {deleteModal.skill.description?.length > 100
                    ? deleteModal.skill.description.substring(0, 100) + "..."
                    : deleteModal.skill.description || "No description"}
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => setDeleteModal({ show: false, skill: null })}
                disabled={deletingId}
                className="px-6 py-3 bg-gradient-to-r from-slate-500/50 to-gray-500/50 text-slate-300 border border-slate-400/30 rounded-xl hover:from-slate-400/50 hover:to-gray-400/50 disabled:opacity-50 transition-all duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId}
                className="px-6 py-3 bg-gradient-to-r from-red-500/80 to-red-600/80 text-white border border-red-400/30 rounded-xl hover:from-red-500 hover:to-red-600 disabled:opacity-50 transition-all duration-300 font-medium"
              >
                {deletingId ? "Deleting..." : "Delete Skill"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}