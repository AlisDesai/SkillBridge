import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { showError, showSuccess } from "../../utils/toast";

export default function MatchCard({ match, currentUserId, onRespond }) {
  const navigate = useNavigate();
  const otherUser =
    match.requester._id === currentUserId ? match.receiver : match.requester;

  const isReceiver = match.receiver._id === currentUserId;
  const isRequester = match.requester._id === currentUserId;
  const isPending = match.status === "pending";

  const [responding, setResponding] = useState(false);

  console.log("MatchCard - match data:", match);
  console.log("MatchCard - other user:", otherUser);

  // Check completion request status - FIXED: Compare with string IDs
  const userRequestedCompletion = match.completionRequests?.some(
    (req) => req.user.toString() === currentUserId.toString()
  );

  const otherUserRequestedCompletion = match.completionRequests?.some(
    (req) => req.user.toString() === otherUser._id.toString()
  );

  console.log("Completion status:", {
    userRequested: userRequestedCompletion,
    otherUserRequested: otherUserRequestedCompletion,
    completionRequests: match.completionRequests,
  });

  const handleResponse = async (status) => {
    setResponding(true);
    try {
      await api.put(`/matches/${match._id}`, { status });
      showSuccess(`Match ${status}`);
      onRespond();
    } catch (err) {
      console.error("Error responding to match:", err);
      showError("Failed to update match");
    } finally {
      setResponding(false);
    }
  };

  const handleRequestCompletion = async () => {
    setResponding(true);
    try {
      const response = await api.post(`/matches/${match._id}/complete`);
      showSuccess(response.data.message);
      onRespond(); // Refresh the matches list
    } catch (err) {
      showError(err.response?.data?.message || "Failed to request completion");
    } finally {
      setResponding(false);
    }
  };

  const handleStartChat = () => {
    navigate(`/chat/${otherUser._id}`);
  };

  const getStatusColor = () => {
    switch (match.status) {
      case "accepted":
        return "text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200";
      case "rejected":
        return "text-red-700 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200";
      case "pending":
        return "text-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200";
      case "completed":
        return "text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200";
      default:
        return "text-slate-700 bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200";
    }
  };

  const getRequestType = () => {
    if (isRequester) return "Sent";
    if (isReceiver) return "Received";
    return "";
  };

  // Get completion button text and state
  const getCompletionButtonState = () => {
    if (userRequestedCompletion && otherUserRequestedCompletion) {
      return { text: "✅ Completed", disabled: true, color: "bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/25" };
    } else if (userRequestedCompletion) {
      return {
        text: "⏳ Awaiting Confirmation",
        disabled: true,
        color: "bg-gradient-to-r from-slate-400 to-gray-400",
      };
    } else if (otherUserRequestedCompletion) {
      return {
        text: "✅ Confirm Completion",
        disabled: false,
        color: "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40",
      };
    } else {
      return {
        text: "✅ Mark Complete",
        disabled: false,
        color: "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40",
      };
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-slate-50/50 to-white backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border border-slate-200/60 hover:border-slate-300/80 group relative overflow-hidden hover:-translate-y-2">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
      
      {/* Header Section */}
      <div className="relative z-10 flex items-center gap-6">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-500 group-hover:scale-110">
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
            <span className="relative z-10">{otherUser.name?.charAt(0)?.toUpperCase() || "U"}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-indigo-700 transition-colors duration-300">
            {otherUser.name || "Unknown User"}
          </h3>
          <p className="text-slate-500 font-medium">{otherUser.email || ""}</p>
        </div>
      </div>

      {otherUser.bio && (
        <div className="relative z-10 mt-6">
          <p className="text-slate-600 leading-relaxed bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-4 border border-slate-200/50 line-clamp-2">
            "{otherUser.bio}"
          </p>
        </div>
      )}

      <div className="relative z-10 flex items-center justify-between mt-6">
        <span className={`text-sm px-4 py-2 rounded-full font-semibold ${getStatusColor()} shadow-sm`}>
          Status: {match.status}
        </span>
        <span className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">{getRequestType()}</span>
      </div>

      {/* Skills Exchange Info */}
      <div className="relative z-10 mt-6 space-y-3">
        {match.skillOffered && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200/50">
            <span className="text-blue-700 text-sm font-medium">Offering: </span>
            <span className="text-blue-800 font-bold">{match.skillOffered}</span>
          </div>
        )}
        {match.skillRequested && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-200/50">
            <span className="text-purple-700 text-sm font-medium">Requesting: </span>
            <span className="text-purple-800 font-bold">{match.skillRequested}</span>
          </div>
        )}
        {match.skillsInvolved && match.skillsInvolved.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-3 border border-emerald-200/50">
            <span className="text-emerald-700 text-sm font-medium">Skills: </span>
            <span className="text-emerald-800 font-bold">{match.skillsInvolved.join(", ")}</span>
          </div>
        )}
        {match.message && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200/50">
            <span className="text-amber-700 text-sm font-medium">Message: </span>
            <p className="text-amber-800 font-semibold italic mt-1">"{match.message}"</p>
          </div>
        )}
      </div>

      {/* Completion Status Alert - IMPROVED */}
      {match.status === "accepted" &&
        otherUserRequestedCompletion &&
        !userRequestedCompletion && (
          <div className="relative z-10 mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-300/50 rounded-2xl shadow-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🔔</span>
              </div>
              <div>
                <p className="text-yellow-800 font-semibold">
                  <strong>{otherUser.name}</strong> has requested to mark this exchange as completed.
                </p>
                <p className="text-yellow-700 text-sm mt-1">
                  Click "Confirm Completion" if you also want to complete this exchange.
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Action Buttons */}
      {isReceiver && isPending && (
        <div className="relative z-10 flex gap-4 mt-8">
          <button
            onClick={() => handleResponse("accepted")}
            disabled={responding}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-4 rounded-2xl font-bold disabled:opacity-50 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-105"
          >
            {responding ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Accept"
            )}
          </button>
          <button
            onClick={() => handleResponse("rejected")}
            disabled={responding}
            className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white py-4 rounded-2xl font-bold disabled:opacity-50 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-105"
          >
            {responding ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Reject"
            )}
          </button>
        </div>
      )}

      {match.status === "accepted" && (
        <div className="relative z-10 flex gap-4 mt-8">
          <button
            onClick={handleStartChat}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>💬</span>
              <span>Start Chat</span>
            </span>
          </button>

          {(() => {
            const buttonState = getCompletionButtonState();
            return (
              <button
                onClick={handleRequestCompletion}
                disabled={responding || buttonState.disabled}
                className={`flex-1 ${buttonState.color} text-white py-4 rounded-2xl font-bold disabled:opacity-50 transition-all duration-300 transform hover:scale-105`}
              >
                {responding ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  buttonState.text
                )}
              </button>
            );
          })()}
        </div>
      )}

      {match.status === "completed" && (
        <div className="relative z-10 mt-8 space-y-4">
          <div className="text-center bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-200/50">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl">🎉</span>
              <span className="text-emerald-700 font-bold text-lg">Learning Exchange Completed!</span>
            </div>
          </div>
          <button
            onClick={() => navigate(`/review/${match._id}`)}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>⭐</span>
              <span>Write Review</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}