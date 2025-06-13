import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleSendMessage = async () => {
    try {
      // First check if there's an existing match between users
      const matchRes = await api.get(`/matches/check/${user._id}`);

      if (matchRes.data.match) {
        // If match exists, get or create conversation
        const conversationRes = await api.get(
          `/chats/conversations/match/${matchRes.data.match._id}`
        );
        navigate("/chat", {
          state: {
            conversationId: conversationRes.data._id,
            userName: user.name,
          },
        });
      } else {
        alert("Please wait for match approval before messaging!");
      }
    } catch (err) {
      console.error("Failed to initiate chat:", err);
      alert("Failed to start conversation. Please try again.");
    }
  };

  const handleSendMatchRequest = async () => {
    try {
      // Get current user to determine skills
      const currentUserRes = await api.get("/users/me");
      const currentUser = currentUserRes.data;

      // Check if match request already exists (any status)
      const existingMatchRes = await api.get(`/matches/existing/${user._id}`);

      if (existingMatchRes.data.exists) {
        const matchStatus = existingMatchRes.data.status;
        if (matchStatus === "pending") {
          alert("Match request already sent! Please wait for confirmation.");
          return;
        } else if (matchStatus === "accepted") {
          alert("You are already matched with this user!");
          return;
        }
        // If rejected, continue to allow new request
      }

      // Find matching skills between users
      const skillOffered =
        currentUser.teachSkills?.[0]?.name || "General Knowledge";
      const skillRequested = user.teachSkills?.[0]?.name || "General Knowledge";

      await api.post("/matches", {
        receiver: user._id,
        skillOffered,
        skillRequested,
      });
      alert("Match request sent!");
    } catch (err) {
      console.error("Match request error:", err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to send match request");
      }
    }
  };  

  const handleViewReviews = () => {
    navigate(`/user/${user._id}/reviews`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading user details...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">User not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center text-[#4A6FFF] hover:text-[#3A5FEF] font-medium"
      >
        ← Back to Discovery
      </button>

      {/* User Profile Header */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Picture */}
          <div className="w-24 h-24 bg-gradient-to-br from-[#4A6FFF] to-[#7C3AED] rounded-full flex items-center justify-center text-white text-3xl font-semibold">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {user.name || "Anonymous User"}
            </h1>

            {user.location && (
              <p className="text-gray-600 mb-4">📍 {user.location}</p>
            )}

            {user.bio && (
              <p className="text-gray-700 leading-relaxed">{user.bio}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={handleSendMessage}
            className="flex-1 bg-[#4A6FFF] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#3A5FEF] transition-colors"
          >
            💬 Send Message
          </button>

          <button
            onClick={handleSendMatchRequest}
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            🤝 Send Match Request
          </button>

          <button
            onClick={handleViewReviews}
            className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            ⭐ View Reviews
          </button>
        </div>
      </div>

      {/* Skills Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Teaching Skills */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            🎓 Can Teach
          </h3>

          {user.teachSkills && user.teachSkills.length > 0 ? (
            <div className="space-y-3">
              {user.teachSkills.map((skill, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <span className="font-medium text-gray-800">
                    {skill.name}
                  </span>
                  <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">
              No teaching skills listed
            </p>
          )}
        </div>

        {/* Learning Skills */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            📚 Wants to Learn
          </h3>

          {user.learnSkills && user.learnSkills.length > 0 ? (
            <div className="space-y-3">
              {user.learnSkills.map((skill, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <span className="font-medium text-gray-800">
                    {skill.name}
                  </span>
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">
              No learning goals listed
            </p>
          )}
        </div>
      </div>

      {/* Availability */}
      {user.availability && user.availability.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🕒 Availability
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.availability.map((time, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
              >
                {time}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
