import { useEffect, useState } from "react";
import api from "../utils/api";
import MatchCard from "../components/matching/MatchCard";
import { showError } from "../utils/toast";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Move fetchMatches outside useEffect so it can be called from MatchCard
  const fetchMatches = async () => {
    try {
      setLoading(true);
      const userRes = await api.get("/users/me");
      setUserId(userRes.data._id);

      const matchRes = await api.get("/matches");
      setMatches(matchRes.data?.data || []);
    } catch (err) {
      showError("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleViewProfile = (user) => {
    console.log("View profile for", user.name);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Match Requests</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading matches...</div>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No match requests found.</div>
          <p className="text-gray-500 mt-2">
            Start discovering users and send match requests!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => {
            const isRequester = match.requester._id === userId;
            const otherUser = isRequester ? match.receiver : match.requester;

            return (
              <MatchCard
                key={match._id}
                match={match}
                currentUserId={userId}
                onRespond={fetchMatches} // Now this will work!
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
