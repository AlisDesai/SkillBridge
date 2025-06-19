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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-500/4 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Floating particles */}
          <div className="absolute top-20 left-20 w-3 h-3 bg-emerald-400/30 rounded-full animate-ping shadow-lg shadow-emerald-400/15"></div>
          <div className="absolute top-40 right-32 w-2 h-2 bg-green-400/35 rounded-full animate-ping delay-1000 shadow-lg shadow-green-400/15"></div>
          <div className="absolute bottom-32 left-1/3 w-2.5 h-2.5 bg-teal-400/25 rounded-full animate-ping delay-2000 shadow-lg shadow-teal-400/15"></div>
        </div>

        <div className="relative z-10 flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl shadow-emerald-500/10">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
            <div className="text-xl font-semibold bg-gradient-to-r from-white via-gray-100 to-slate-200 bg-clip-text text-transparent pb-4">
              Loading user details...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-500/4 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 text-center py-12 px-4">
          <div className="max-w-md mx-auto bg-gray-950/40 backdrop-blur-xl border border-gray-800/40 rounded-3xl p-12 shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-r from-red-400/20 via-red-500/15 to-red-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-4">User not found</div>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-emerald-500/15"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects - Reduced Lighting */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-500/4 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-teal-600/3 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-emerald-400/30 rounded-full animate-ping shadow-lg shadow-emerald-400/15"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-green-400/35 rounded-full animate-ping delay-1000 shadow-lg shadow-green-400/15"></div>
        <div className="absolute bottom-32 left-1/3 w-2.5 h-2.5 bg-teal-400/25 rounded-full animate-ping delay-2000 shadow-lg shadow-teal-400/15"></div>
        <div className="absolute top-1/2 right-20 w-2 h-2 bg-emerald-300/20 rounded-full animate-ping delay-3000 shadow-lg shadow-emerald-300/10"></div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/2 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-gray-950/50"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Back Button */}
        {/* <button
          onClick={() => navigate("/dashboard")}
          className="group flex items-center gap-3 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-emerald-500/20"
        >
          <div className="w-6 h-6 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span>Back to Discovery</span>
        </button> */}

        {/* User Profile Header */}
        <div className="bg-gray-950/25 backdrop-blur-xl border border-gray-800/30 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/2 via-green-500/1 to-teal-600/2 rounded-3xl opacity-40"></div>
          
          <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-emerald-500/15 transform group-hover:scale-105 transition-all duration-300">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-400 rounded-2xl border-4 border-gray-950 animate-pulse shadow-lg shadow-emerald-400/20"></div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl font-black bg-gradient-to-r from-white via-gray-100 to-slate-200 bg-clip-text text-transparent mb-4 pb-2">
                {user.name || "Anonymous User"}
              </h1>

              {user.location && (
                <div className="flex items-center justify-center lg:justify-start gap-2 text-emerald-400 mb-6">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-lg font-medium">{user.location}</span>
                </div>
              )}

              {user.bio && (
                <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/25 rounded-2xl p-6">
                  <p className="text-slate-300 leading-relaxed text-lg">{user.bio}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            <button
              onClick={handleSendMessage}
              className="group relative bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-emerald-500/15 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Send Message
              </div>
            </button>

            <button
              onClick={handleSendMatchRequest}
              className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800/30 hover:border-emerald-400/20 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:bg-gray-900/70 shadow-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
                Send Match Request
              </div>
            </button>

            <button
              onClick={handleViewReviews}
              className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800/30 hover:border-yellow-400/20 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:bg-gray-900/70 shadow-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                View Reviews
              </div>
            </button>
          </div>
        </div>

        {/* Skills Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Teaching Skills */}
          <div className="group bg-gray-950/25 backdrop-blur-xl border border-gray-800/30 rounded-3xl shadow-xl p-8 hover:bg-gray-950/40 hover:border-emerald-400/10 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/2 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Can Teach</h3>
              </div>

              {user.teachSkills && user.teachSkills.length > 0 ? (
                <div className="space-y-4">
                  {user.teachSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="group/skill flex justify-between items-center p-4 bg-gray-900/30 backdrop-blur-sm border border-gray-800/25 rounded-2xl hover:bg-gray-900/50 hover:border-emerald-400/15 transition-all duration-300 transform hover:scale-102"
                    >
                      <span className="font-semibold text-white text-lg group-hover/skill:text-emerald-300 transition-colors duration-300">
                        {skill.name}
                      </span>
                      <span className="px-4 py-2 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/10">
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-700/50 via-gray-600/40 to-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-lg">No teaching skills listed</p>
                </div>
              )}
            </div>
          </div>

          {/* Learning Skills */}
          <div className="group bg-gray-950/25 backdrop-blur-xl border border-gray-800/30 rounded-3xl shadow-xl p-8 hover:bg-gray-950/40 hover:border-blue-400/10 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/2 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Wants to Learn</h3>
              </div>

              {user.learnSkills && user.learnSkills.length > 0 ? (
                <div className="space-y-4">
                  {user.learnSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="group/skill flex justify-between items-center p-4 bg-gray-900/30 backdrop-blur-sm border border-gray-800/25 rounded-2xl hover:bg-gray-900/50 hover:border-blue-400/15 transition-all duration-300 transform hover:scale-102"
                    >
                      <span className="font-semibold text-white text-lg group-hover/skill:text-blue-300 transition-colors duration-300">
                        {skill.name}
                      </span>
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/10">
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-700/50 via-gray-600/40 to-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-lg">No learning goals listed</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Availability */}
        {user.availability && user.availability.length > 0 && (
          <div className="bg-gray-950/25 backdrop-blur-xl border border-gray-800/30 rounded-3xl shadow-xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/2 to-purple-400/0 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/10">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Availability</h3>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {user.availability.map((time, index) => (
                  <span
                    key={index}
                    className="group px-4 py-3 bg-gray-900/30 backdrop-blur-sm border border-gray-800/25 hover:border-purple-400/15 text-purple-300 hover:text-purple-200 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:bg-gray-900/50 shadow-lg"
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}