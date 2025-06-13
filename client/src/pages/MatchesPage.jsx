import { useEffect, useState } from "react";
import api from "../utils/api";
import MatchCard from "../components/matching/MatchCard";
import MatchFilters from "../components/matching/MatchFilters";
import { showError } from "../utils/toast";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const userRes = await api.get("/users/me");
      setUserId(userRes.data._id);

      const matchRes = await api.get("/matches");
      const allMatches = matchRes.data?.data || [];
      setMatches(allMatches);
      filterMatches(allMatches, activeFilter, userRes.data._id);
    } catch (err) {
      showError("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  const filterMatches = (matchList, filter, currentUserId) => {
    let filtered = [];

    switch (filter) {
      case "current":
        filtered = matchList.filter((match) => match.status === "accepted");
        break;
      case "pending-sent":
        filtered = matchList.filter(
          (match) =>
            match.status === "pending" && match.requester._id === currentUserId
        );
        break;
      case "pending-received":
        filtered = matchList.filter(
          (match) =>
            match.status === "pending" && match.receiver._id === currentUserId
        );
        break;
      case "rejected":
        filtered = matchList.filter((match) => match.status === "rejected");
        break;
      default: // 'all'
        filtered = matchList;
        break;
    }

    setFilteredMatches(filtered);
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (matches.length > 0 && userId) {
      filterMatches(matches, activeFilter, userId);
    }
  }, [activeFilter, matches, userId]);

  const getEmptyMessage = () => {
    switch (activeFilter) {
      case "current":
        return "No current matches found.";
      case "pending-sent":
        return "No pending requests sent.";
      case "pending-received":
        return "No pending requests received.";
      case "rejected":
        return "No rejected matches.";
      default:
        return "No match requests found.";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Match Requests</h2>
        <div className="text-sm text-gray-500">
          {filteredMatches.length} of {matches.length} matches
        </div>
      </div>

      <MatchFilters
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading matches...</div>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">{getEmptyMessage()}</div>
          <p className="text-gray-500 mt-2">
            Start discovering users and send match requests!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match._id}
              match={match}
              currentUserId={userId}
              onRespond={fetchMatches}
            />
          ))}
        </div>
      )}
    </div>
  );
}
