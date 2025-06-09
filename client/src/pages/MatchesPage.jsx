import { useEffect, useState } from "react";
import api from "../utils/api";
import MatchCard from "../components/matching/MatchCard";
import { showError } from "../utils/toast";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
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

    fetchMatches();
  }, []);

  const handleViewProfile = (user) => {
    console.log("View profile for", user.name);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Matched Learners</h2>

      {loading ? (
        <p className="text-gray-400">Loading matches...</p>
      ) : matches.length === 0 ? (
        <p className="text-gray-400">No matches found.</p>
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
                onRespond={fetchMatches}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
