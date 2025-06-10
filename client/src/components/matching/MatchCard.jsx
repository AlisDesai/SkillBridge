import { useState } from "react";
import api from "../../utils/api";
import { showError, showSuccess } from "../../utils/toast";

export default function MatchCard({ match, currentUserId, onRespond }) {
  const otherUser =
    match.requester._id === currentUserId ? match.receiver : match.requester;

  const isReceiver = match.receiver._id === currentUserId;
  const isPending = match.status === "pending";

  const [responding, setResponding] = useState(false);

  const handleResponse = async (status) => {
    setResponding(true);
    try {
      await api.put(`/matches/${match._id}`, { status });
      showSuccess(`Match ${status}`);
      onRespond(); // refetch or update
    } catch (err) {
      showError("Failed to update match");
    } finally {
      setResponding(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-5 border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-[#E5E7EB]" />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {otherUser.name}
          </h3>
          <p className="text-sm text-gray-500">{otherUser.email}</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-2">{otherUser.bio}</p>

      <p className="text-sm mt-2 text-gray-500">
        Status: <b>{match.status}</b>
      </p>

      {isReceiver && isPending && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handleResponse("accepted")}
            disabled={responding}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl"
          >
            Accept
          </button>
          <button
            onClick={() => handleResponse("rejected")}
            disabled={responding}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
