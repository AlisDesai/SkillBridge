import { useEffect, useState } from "react";
import api from "../utils/api";
import { showError, showSuccess } from "../utils/toast";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data || []);
    } catch {
      showError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlockUser = async (userId, currentStatus) => {
    try {
      const action = currentStatus === "Blocked" ? "unblock" : "block";
      await api.put(`/admin/users/${userId}/${action}`);
      showSuccess(`User ${action}ed`);
      fetchUsers();
    } catch {
      showError("Failed to update user status");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-semibold text-gray-800">Manage Users</h2>
      <div className="bg-white rounded-2xl shadow p-6 overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="text-gray-500 text-sm border-b">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-gray-400 py-4 text-center">
                  Loading users...
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="border-b text-sm text-gray-700">
                  <td className="py-3">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        u.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="text-[#4A6FFF] hover:underline"
                      onClick={() => toggleBlockUser(u._id, u.status)}
                    >
                      {u.status === "Blocked" ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
