import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsersAsync,
  deleteUserAsync,
  updateUserAsync,
  clearError,
} from "../../redux/slices/adminSlice";
import { showError, showSuccess } from "../../utils/toast";
import Button from "../common/Button";
import Modal from "../common/Modal";

const UserRow = ({ user, onEdit, onDelete, isDeleting }) => {
  const getStatusColor = (isActive) => {
    return isActive 
      ? "bg-gradient-to-r from-emerald-400/25 to-green-500/25 text-emerald-400 border border-emerald-400/40 shadow-sm" 
      : "bg-gradient-to-r from-slate-500/25 to-gray-500/25 text-slate-400 border border-slate-400/40 shadow-sm";
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "bg-gradient-to-r from-teal-400/25 to-emerald-400/25 text-teal-400 border border-teal-400/40 shadow-sm",
      user: "bg-gradient-to-r from-green-400/25 to-teal-400/25 text-green-400 border border-green-400/40 shadow-sm",
    };
    return colors[role] || "bg-gradient-to-r from-slate-500/25 to-gray-500/25 text-slate-400 border border-slate-400/40 shadow-sm";
  };

  return (
    <tr className="hover:bg-gradient-to-r hover:from-emerald-500/15 hover:to-teal-500/15 transition-all duration-300 border-b border-slate-500/20 group">
      <td className="px-8 py-6 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center ring-2 ring-emerald-400/30 shadow-lg group-hover:ring-emerald-400/50 transition-all duration-300">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
            ) : (
              <span className="text-white font-bold text-xl">
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div className="ml-5">
            <div className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors duration-300">
              {user.name || "Unknown"}
            </div>
            <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
              {user.email || "No email"}
            </div>
          </div>
        </div>
      </td>

      <td className="px-8 py-6 whitespace-nowrap">
        <span
          className={`inline-flex px-4 py-2 text-sm font-semibold rounded-lg ${getRoleColor(
            user.role
          )}`}
        >
          {user.role}
        </span>
      </td>

      <td className="px-8 py-6 whitespace-nowrap">
        <span
          className={`inline-flex px-4 py-2 text-sm font-semibold rounded-lg ${getStatusColor(
            user.isActive
          )}`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      <td className="px-8 py-6 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3 shadow-md">
            {user.skillsCount || 0}
          </div>
          <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">skills</span>
        </div>
      </td>

      <td className="px-8 py-6 whitespace-nowrap text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>

      <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => onEdit(user)}
            className="group/btn relative px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all duration-300 font-medium border border-teal-400/30 shadow-lg hover:shadow-emerald-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            <span className="relative">Edit</span>
          </button>
          <button
            onClick={() => onDelete(user)}
            disabled={isDeleting === user._id}
            className="group/btn relative px-5 py-2.5 bg-gradient-to-r from-red-500/80 to-red-600/80 text-white rounded-lg hover:from-red-500 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium border border-red-400/30 shadow-lg hover:shadow-red-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-500/20 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              {isDeleting === user._id ? (
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

const EditUserModal = ({ user, isOpen, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    role: "",
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        role: user.role || "user",
        isActive: user.isActive !== false,
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(user._id, formData);
  };

  if (!user) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Edit User"
      className="bg-gradient-to-br from-gray-950 via-slate-950 to-black border border-slate-500"
    >
      <div className="bg-gradient-to-br from-gray-950/95 via-slate-950/90 to-black/95 p-6 rounded-2xl border border-slate-500/30">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              User Details
            </label>
            <div className="p-4 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-xl border border-emerald-400/25">
              <p className="font-semibold text-white">{user.name}</p>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value }))
              }
              className="w-full border-2 border-slate-500/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-gradient-to-r from-gray-900 to-slate-900 text-white transition-all duration-300 [&>option]:bg-gray-900 [&>option]:text-white [&>option]:py-2"
            >
              <option value="user" className="bg-gray-900 text-white">User</option>
              <option value="admin" className="bg-gray-900 text-white">Admin</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-500/15 to-teal-500/15 border border-green-400/25">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                }
                className="rounded border-2 border-emerald-400/50 text-emerald-500 focus:ring-emerald-400 w-5 h-5"
              />
              <span className="text-sm font-semibold text-slate-300">
                Active Account
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-slate-500/50 to-gray-500/50 text-slate-300 border border-slate-400/30 rounded-xl hover:from-slate-400/50 hover:to-gray-400/50 disabled:opacity-50 transition-all duration-300 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border border-emerald-400/30 rounded-xl hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 transition-all duration-300 font-medium"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default function UserManagement() {
  const dispatch = useDispatch();
  const { users, usersPagination, usersLoading, loading, error } = useSelector(
    (state) => state.admin || {}
  );

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    page: 1,
  });
  const [editModal, setEditModal] = useState({ show: false, user: null });
  const [deleteModal, setDeleteModal] = useState({ show: false, user: null });
  const [deletingId, setDeletingId] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchUsersAsync(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (error) {
      showError(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSearch = (value) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleEditUser = (user) => {
    setEditModal({ show: true, user });
  };

  const handleSaveUser = async (userId, userData) => {
    setUpdating(true);
    try {
      await dispatch(updateUserAsync({ userId, userData })).unwrap();
      showSuccess("User updated successfully");
      setEditModal({ show: false, user: null });
      dispatch(fetchUsersAsync(filters));
    } catch (error) {
      showError(error?.message || "Failed to update user");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = (user) => {
    setDeleteModal({ show: true, user });
  };

  const confirmDelete = async () => {
    if (!deleteModal.user) return;

    setDeletingId(deleteModal.user._id);
    try {
      await dispatch(deleteUserAsync(deleteModal.user._id)).unwrap();
      showSuccess("User deleted successfully");
      setDeleteModal({ show: false, user: null });
      dispatch(fetchUsersAsync(filters));
    } catch (error) {
      showError(error?.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const renderPagination = () => {
    if (!usersPagination?.totalPages || usersPagination.totalPages <= 1)
      return null;

    const { currentPage, totalPages, hasPrevPage, hasNextPage } =
      usersPagination;

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
          Total: {usersPagination.totalUsers || 0} users
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-emerald-200 to-slate-300 bg-clip-text text-transparent leading-tight">
                User Management
              </h1>
              <div className="w-28 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-full mx-auto shadow-lg shadow-emerald-500/30"></div>
              <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                Efficiently manage platform users, permissions, and access controls with advanced administrative tools
              </p>
            </div>
          </div>
        </div> */}

        {/* Filters */}
        <div className="bg-gradient-to-br from-gray-950/95 via-slate-950/90 to-black/95 rounded-3xl border border-slate-500/30 p-8 backdrop-blur-sm">
          <div className="flex items-end justify-between gap-8">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Search Users
              </label>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                disabled={usersLoading}
                className="w-full border-2 border-slate-500/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-gradient-to-r from-gray-900 to-slate-900 text-white placeholder-slate-400 transition-all duration-300"
              />
            </div>

            <div className="w-64">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Role
              </label>
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
                className="w-full border-2 border-slate-500/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-gradient-to-r from-gray-900 to-slate-900 text-white transition-all duration-300 [&>option]:bg-gray-900 [&>option]:text-white [&>option]:py-2"
              >
                <option value="" className="bg-gray-900 text-white">All Roles</option>
                <option value="user" className="bg-gray-900 text-white">User</option>
                <option value="admin" className="bg-gray-900 text-white">Admin</option>
              </select>
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={() =>
                  setFilters({ search: "", role: "", status: "", page: 1 })
                }
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

        {/* Users Table */}
        <div className="bg-gradient-to-br from-gray-950/95 via-slate-950/90 to-black/95 rounded-3xl border border-slate-500/30 overflow-hidden backdrop-blur-sm shadow-2xl shadow-black/20">
          {usersLoading || loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-600/30 border-t-emerald-400 rounded-full animate-spin mb-6"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-green-500 rounded-full animate-spin animate-reverse"></div>
              </div>
              <p className="text-slate-400 font-medium text-lg">Loading users...</p>
            </div>
          ) : !users?.length ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-500/30 to-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-400/30 shadow-lg">
                <svg className="w-12 h-12 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <div className="text-slate-300 mb-3 text-2xl font-semibold">No users found</div>
              <p className="text-slate-500 text-lg">
                {filters.search || filters.role || filters.status
                  ? "Try adjusting your filters to find users"
                  : "No users have been created yet"}
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
                      Role
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-slate-200 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-slate-200 uppercase tracking-wider">
                      Skills
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-slate-200 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-8 py-6 text-right text-sm font-bold text-slate-200 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gradient-to-br from-gray-950/90 via-slate-950/90 to-black/90 divide-y divide-slate-500/20">
                  {users.map((user) => (
                    <UserRow
                      key={user._id}
                      user={user}
                      onEdit={handleEditUser}
                      onDelete={handleDeleteUser}
                      isDeleting={deletingId}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {renderPagination()}
        </div>

        {/* Edit User Modal */}
        <EditUserModal
          user={editModal.user}
          isOpen={editModal.show}
          onClose={() => setEditModal({ show: false, user: null })}
          onSave={handleSaveUser}
          loading={updating}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.show}
          onClose={() => setDeleteModal({ show: false, user: null })}
          title="Delete User"
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
            
            <p className="text-slate-300 bg-gradient-to-r from-red-500/15 to-red-600/15 p-4 rounded-xl border border-red-400/25">
              Are you sure you want to delete{" "}
              <strong className="text-red-400">{deleteModal.user?.name}</strong>? 
              This will also delete all their skills, matches, and reviews.
            </p>
            
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => setDeleteModal({ show: false, user: null })}
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
                {deletingId ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}