import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function DashboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/discover");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleViewDetails = (userId) => {
    navigate(`/user/${userId}`);
  };

  const getTopSkills = (teachSkills = [], learnSkills = []) => {
    const allSkills = [...teachSkills, ...learnSkills];
    return allSkills.slice(0, 3);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Discover Users</h2>
        <p className="text-gray-600">{users.length} users available</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => {
          const topSkills = getTopSkills(user.teachSkills, user.learnSkills);

          return (
            <div
              key={user._id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              {/* Profile Picture */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#4A6FFF] to-[#7C3AED] rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </div>

              {/* Name */}
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                {user.name || "Anonymous User"}
              </h3>

              {/* Location */}
              {user.location && (
                <p className="text-sm text-gray-500 text-center mb-3">
                  📍 {user.location}
                </p>
              )}

              {/* Top Skills */}
              <div className="space-y-2 mb-4">
                {topSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {topSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full border border-blue-200"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center">
                    No skills listed
                  </p>
                )}
              </div>

              {/* Bio Preview */}
              {user.bio && (
                <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">
                  {user.bio.length > 50
                    ? `${user.bio.substring(0, 50)}...`
                    : user.bio}
                </p>
              )}

              {/* View Details Button */}
              <button
                onClick={() => handleViewDetails(user._id)}
                className="w-full bg-[#4A6FFF] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#3A5FEF] transition-colors duration-200"
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>

      {users.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No users found</div>
          <p className="text-gray-500">Be the first to add your skills!</p>
        </div>
      )}
    </div>
  );
}
