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

  // Check completion request status
  const userRequestedCompletion = match.completionRequests?.some(
    (req) => req.user === currentUserId
  );

  const otherUserRequestedCompletion = match.completionRequests?.some(
    (req) => req.user === otherUser._id
  );

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
      onRespond();
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
        return "text-green-600 bg-green-50";
      case "rejected":
        return "text-red-600 bg-red-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "completed":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getRequestType = () => {
    if (isRequester) return "Sent";
    if (isReceiver) return "Received";
    return "";
  };

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-5 border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#4A6FFF] to-[#7C3AED] flex items-center justify-center text-white font-semibold">
          {otherUser.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {otherUser.name || "Unknown User"}
          </h3>
          <p className="text-sm text-gray-500">{otherUser.email || ""}</p>
        </div>
      </div>

      {otherUser.bio && (
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">
          {otherUser.bio}
        </p>
      )}

      <div className="flex items-center justify-between mt-4">
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor()}`}
        >
          Status: {match.status}
        </span>
        <span className="text-xs text-gray-500">{getRequestType()}</span>
      </div>

      {/* Skills Exchange Info - FIXED: Handle missing skill fields */}
      <div className="mt-3 text-xs text-gray-600">
        {match.skillOffered && (
          <div>
            Offering: <span className="font-medium">{match.skillOffered}</span>
          </div>
        )}
        {match.skillRequested && (
          <div>
            Requesting:{" "}
            <span className="font-medium">{match.skillRequested}</span>
          </div>
        )}
        {match.skillsInvolved && match.skillsInvolved.length > 0 && (
          <div>
            Skills:{" "}
            <span className="font-medium">
              {match.skillsInvolved.join(", ")}
            </span>
          </div>
        )}
        {match.message && (
          <div className="mt-2">
            Message:{" "}
            <span className="font-medium italic">"{match.message}"</span>
          </div>
        )}
      </div>

      {/* Completion Status Alert */}
      {match.status === "accepted" &&
        otherUserRequestedCompletion &&
        !userRequestedCompletion && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-700">
              🔔 <strong>{otherUser.name}</strong> has requested to mark this as
              completed. Do you want to complete this exchange too?
            </p>
          </div>
        )}

      {isReceiver && isPending && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handleResponse("accepted")}
            disabled={responding}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-sm font-medium disabled:opacity-50"
          >
            {responding ? "..." : "Accept"}
          </button>
          <button
            onClick={() => handleResponse("rejected")}
            disabled={responding}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl text-sm font-medium disabled:opacity-50"
          >
            {responding ? "..." : "Reject"}
          </button>
        </div>
      )}

      {match.status === "accepted" && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleStartChat}
            className="flex-1 bg-[#4A6FFF] hover:bg-[#3A5FEF] text-white py-2 rounded-xl text-sm font-medium transition-colors"
          >
            💬 Start Chat
          </button>

          {!userRequestedCompletion ? (
            <button
              onClick={handleRequestCompletion}
              disabled={responding}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-sm font-medium disabled:opacity-50"
            >
              ✅ Mark Complete
            </button>
          ) : (
            <button
              disabled
              className="flex-1 bg-gray-400 text-white py-2 rounded-xl text-sm font-medium"
            >
              ⏳ Awaiting Confirmation
            </button>
          )}
        </div>
      )}

      {match.status === "completed" && (
        <div className="mt-4 space-y-3">
          <div className="text-center">
            <span className="text-sm text-green-600 font-medium">
              🎉 Learning Exchange Completed!
            </span>
          </div>
          <button
            onClick={() => navigate(`/review/${match._id}`)}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-xl text-sm font-medium transition-colors"
          >
            ⭐ Write Review
          </button>
        </div>
      )}
    </div>
  );
}
