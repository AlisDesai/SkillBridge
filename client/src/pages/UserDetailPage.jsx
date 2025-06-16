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

      if (matchRes.data.data?.exists && matchRes.data.data?.match) {
        const match = matchRes.data.data.match;

        // Check if match is accepted
        if (match.status !== "accepted") {
          alert("Please wait for match approval before messaging!");
          return;
        }

        // If match exists and is accepted, get or create conversation
        const conversationRes = await api.get(
          `/chats/conversations/match/${match._id}`
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

      console.log("Current user:", currentUser._id);
      console.log("Target user:", user._id);

      // Check if match request already exists (any status)
      // Add cache busting with timestamp
      const existingMatchRes = await api.get(
        `/matches/check/${user._id}?t=${Date.now()}`
      );
      console.log("Existing match response:", existingMatchRes.data);

      // FIXED: Check the data structure properly
      if (
        existingMatchRes.data &&
        existingMatchRes.data.data &&
        existingMatchRes.data.data.exists
      ) {
        const { status } = existingMatchRes.data.data;

        console.log("Match exists");
        console.log("Match status:", status);

        switch (status) {
          case "pending":
            alert("Match request already sent! Please wait for confirmation.");
            return;
          case "accepted":
            alert("You are already matched with this user!");
            return;
          case "rejected":
            console.log("Previous match was rejected, allowing new request");
            break;
          default:
            console.log("Unknown status:", status);
        }
      }

      // Find matching skills between users
      const skillOffered =
        currentUser.teachSkills?.[0]?.name || "General Knowledge";
      const skillRequested = user.teachSkills?.[0]?.name || "General Knowledge";

      console.log("Sending match request with:", {
        receiverId: user._id,
        message: `I'd like to learn ${skillRequested} and can teach ${skillOffered}`,
        skillsInvolved: [skillOffered, skillRequested],
      });

      const matchResponse = await api.post("/matches", {
        receiverId: user._id,
        message: `I'd like to learn ${skillRequested} and can teach ${skillOffered}`,
        skillsInvolved: [skillOffered, skillRequested],
      });

      console.log("Match request sent successfully:", matchResponse.data);
      alert("Match request sent!");
    } catch (err) {
      console.error("Match request error:", err);
      console.error("Error response:", err.response?.data);

      if (err.response?.data?.error) {
        alert(err.response.data.error);
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
