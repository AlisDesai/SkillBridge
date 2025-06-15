// /client/src/pages/MatchesPage.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sparkles, Target, Brain, Search, RefreshCw } from "lucide-react";
import api from "../utils/api";
import MatchCard from "../components/matching/MatchCard";
import SmartMatchCard from "../components/matching/SmartMatchCard";
import MatchFilters from "../components/matching/MatchFilters";
import { ReasonsStats } from "../components/matching/MatchReasons";
import { showError, showSuccess } from "../utils/toast";
import {
  fetchSmartMatches,
  clearSmartMatches,
  selectSmartMatches,
  selectSmartMatchesLoading,
  selectSmartMatchesError,
} from "../redux/slices/smartMatchSlice";

export default function MatchesPage() {
  const dispatch = useDispatch();

  // Regular matches state
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  // Smart matching state
  const smartMatches = useSelector(selectSmartMatches);
  const smartMatchesLoading = useSelector(selectSmartMatchesLoading);
  const smartMatchesError = useSelector(selectSmartMatchesError);

  // UI state
  const [activeTab, setActiveTab] = useState("requests"); // 'requests' | 'smart' | 'analytics'
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      console.log("Fetching user info and matches...");

      const userRes = await api.get("/users/me");
      console.log("Current user:", userRes.data);
      setUserId(userRes.data._id);

      const matchRes = await api.get("/matches");
      console.log("Raw match response:", matchRes.data);

      // FIXED: Handle both possible response structures
      const allMatches = Array.isArray(matchRes.data.data)
        ? matchRes.data.data
        : matchRes.data?.data?.matches || [];

      console.log("Processed matches:", allMatches);
      setMatches(allMatches);
      filterMatches(allMatches, activeFilter, userRes.data._id);
    } catch (err) {
      console.error("Failed to load matches:", err);
      console.error("Error response:", err.response?.data);
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

    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((match) => {
        const otherUser =
          match.requester._id === currentUserId
            ? match.receiver
            : match.requester;
        return (
          otherUser.name?.toLowerCase().includes(query) ||
          otherUser.skillsToTeach?.some((skill) =>
            skill.toLowerCase().includes(query)
          ) ||
          otherUser.skillsToLearn?.some((skill) =>
            skill.toLowerCase().includes(query)
          )
        );
      });
    }

    setFilteredMatches(filtered);
  };

  const handleSmartMatchRefresh = async () => {
    if (userId) {
      await dispatch(
        fetchSmartMatches({
          page: 1,
          limit: 10,
          minCompatibility: 30,
          includeInsights: false,
        })
      );
      showSuccess("Smart matches refreshed!");
    }
  };

  const handleSmartMatchRequest = async (targetUserId) => {
    try {
      await api.post("/matches/request", { receiverId: targetUserId });
      showSuccess("Match request sent!");

      // Refresh both regular and smart matches
      fetchMatches();
      handleSmartMatchRefresh();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to send match request");
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (matches.length > 0 && userId) {
      filterMatches(matches, activeFilter, userId);
    }
  }, [activeFilter, matches, userId, searchQuery]);

  // Fetch smart matches when tab changes to smart
  useEffect(() => {
    if (activeTab === "smart" && userId && smartMatches.length === 0) {
      dispatch(
        fetchSmartMatches({
          page: 1,
          limit: 10,
          minCompatibility: 30,
          includeInsights: false,
        })
      );
    }
  }, [activeTab, userId, dispatch, smartMatches.length]);

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

  const getTabStats = () => {
    // Ensure matches is always an array
    const safeMatches = Array.isArray(matches) ? matches : [];
    const safeSmartMatches = Array.isArray(smartMatches) ? smartMatches : [];

    const stats = {
      requests: safeMatches.length,
      smart: safeSmartMatches.length,
      current: safeMatches.filter((m) => m.status === "accepted").length,
      pending: safeMatches.filter((m) => m.status === "pending").length,
    };
    return stats;
  };

  const stats = getTabStats();
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Matching Center
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Discover compatible learning partners and manage your connections
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === "smart" && (
            <button
              onClick={handleSmartMatchRefresh}
              disabled={smartMatchesLoading}
              className="flex items-center space-x-2 px-3 py-2 bg-emerald-600 text-white 
                         rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  smartMatchesLoading ? "animate-spin" : ""
                }`}
              />
              <span>Refresh</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("requests")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "requests"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Match Requests</span>
              {stats.requests > 0 && (
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full text-xs">
                  {stats.requests}
                </span>
              )}
            </div>
          </button>

          <button
            onClick={() => setActiveTab("smart")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "smart"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Smart Matches</span>
              <Sparkles className="w-3 h-3 text-yellow-500" />
              {stats.smart > 0 && (
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-xs">
                  {stats.smart}
                </span>
              )}
            </div>
          </button>

          
        </nav>
      </div>

      {/* Search and Filters */}
      

      {/* Tab Content */}
      {activeTab === "requests" && (
        <div>
          {/* Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.requests}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Requests
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-emerald-600">
                {stats.current}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Active Matches
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Pending
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-blue-600">
                {stats.current > 0
                  ? Math.round((stats.current / stats.requests) * 100)
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Success Rate
              </div>
            </div>
          </div>

          {/* Match Requests Content */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600 dark:text-gray-400">
                Loading matches...
              </div>
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">{getEmptyMessage()}</div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {searchQuery
                  ? "Try adjusting your search or filters."
                  : "Start discovering users and send match requests!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(filteredMatches)
                ? filteredMatches.map((match) => (
                    <MatchCard
                      key={match._id}
                      match={match}
                      currentUserId={userId}
                      onRespond={fetchMatches}
                    />
                  ))
                : null}
            </div>
          )}
        </div>
      )}

      {activeTab === "smart" && (
        <div>
          {/* Smart Matches Header */}
          <div
            className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 
                          rounded-lg p-6 mb-6"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Brain className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                AI-Powered Smart Matches
              </h3>
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Our intelligent matching algorithm analyzes your skills,
              preferences, and learning goals to find the most compatible
              learning partners.
            </p>
          </div>

          {/* Smart Matches Content */}
          {smartMatchesLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Brain className="w-8 h-8 text-emerald-600 animate-pulse mx-auto mb-2" />
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  AI is analyzing potential matches...
                </div>
              </div>
            </div>
          ) : smartMatchesError ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg">
                Failed to load smart matches
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {smartMatchesError}
              </p>
              <button
                onClick={handleSmartMatchRefresh}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : smartMatches.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-400 text-lg">
                No smart matches found
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Complete your profile and add more skills to get better matches!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {smartMatches.map((smartMatch) => (
                <SmartMatchCard
                  key={smartMatch.user._id}
                  match={smartMatch}
                  onSendRequest={() =>
                    handleSmartMatchRequest(smartMatch.user._id)
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

      
    </div>
  );
}
