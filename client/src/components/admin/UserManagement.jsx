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
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "bg-purple-100 text-purple-800",
      user: "bg-blue-100 text-blue-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.name || "Unknown"}
            </div>
            <div className="text-sm text-gray-500">
              {user.email || "No email"}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
            user.role
          )}`}
        >
          {user.role}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            user.isActive
          )}`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.skillsCount || 0} skills
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(user)}
            disabled={isDeleting === user._id}
          >
            {isDeleting === user._id ? (
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
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User Details
          </label>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, role: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF7A59] focus:border-transparent"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              className="rounded border-gray-300 text-[#FF7A59] focus:ring-[#FF7A59]"
            />
            <span className="text-sm font-medium text-gray-700">
              Active Account
            </span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
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
    status: "",
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
      dispatch(fetchUsersAsync(filters)); // Refresh data
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
      dispatch(fetchUsersAsync(filters)); // Refresh data
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
      <div className="flex items-center justify-between mt-6">
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
          Total: {usersPagination.totalUsers || 0} users
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
            User Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage platform users and their permissions
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Users
            </label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={usersLoading}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF7A59] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange("role", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF7A59] focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF7A59] focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() =>
                setFilters({ search: "", role: "", status: "", page: 1 })
              }
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {usersLoading || loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#FF7A59] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !users?.length ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">No users found</div>
            <p className="text-sm text-gray-400">
              {filters.search || filters.role || filters.status
                ? "Try adjusting your filters"
                : "No users have been created yet"}
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
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
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
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <strong>{deleteModal.user?.name}</strong>? This will also delete all
            their skills, matches, and reviews. This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ show: false, user: null })}
              disabled={deletingId}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              disabled={deletingId}
            >
              {deletingId ? "Deleting..." : "Delete User"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
