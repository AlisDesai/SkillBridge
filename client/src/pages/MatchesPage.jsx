// src/pages/MatchesPage.jsx
import { useEffect, useState } from "react";
import api from "../utils/api";
import MatchCard from "../components/matching/MatchCard";
import { showError } from "../utils/toast";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get("/matches");
        setMatches(res.data || []);
      } catch (err) {
        showError("Failed to load matches");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleViewProfile = (user) => {
    // navigate or open modal - placeholder for now
    console.log("View user:", user);
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
          {matches.map((match) => (
            <MatchCard
              key={match._id}
              user={match}
              onView={handleViewProfile}
            />
          ))}
        </div>
      )}
    </div>
  );
}
