// /client/src/pages/MatchesPage.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Sparkles,
  Target,
  Brain,
  Search,
  RefreshCw,
  Filter,
  Zap,
  Users,
  TrendingUp,
} from "lucide-react";
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const filterOptions = [
    {
      key: "all",
      label: "All Matches",
      icon: Users,
      count: () => matches.length,
    },
    {
      key: "current",
      label: "Active",
      icon: Zap,
      count: () => matches.filter((m) => m.status === "accepted").length,
    },
    {
      key: "pending-sent",
      label: "Sent",
      icon: TrendingUp,
      count: () =>
        matches.filter(
          (m) => m.status === "pending" && m.requester._id === userId
        ).length,
    },
    {
      key: "pending-received",
      label: "Received",
      icon: Target,
      count: () =>
        matches.filter(
          (m) => m.status === "pending" && m.receiver._id === userId
        ).length,
    },
    {
      key: "rejected",
      label: "Declined",
      icon: Filter,
      count: () => matches.filter((m) => m.status === "rejected").length,
    },
  ];

  const stats = getTabStats();

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-96 -right-96 w-[800px] h-[800px] bg-emerald-400/2 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-96 -left-96 w-[800px] h-[800px] bg-green-500/2 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-400/2 rounded-full blur-2xl animate-pulse delay-500"></div>

        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-emerald-500/2 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-green-400/2 rounded-full blur-xl"></div>

        <div className="absolute top-20 left-20 w-2 h-2 bg-emerald-400/15 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-green-400/10 rounded-full animate-ping delay-300"></div>
        <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-teal-500/12 rounded-full animate-ping delay-700"></div>
        <div className="absolute top-60 right-1/4 w-1 h-1 bg-emerald-300/10 rounded-full animate-ping delay-1000"></div>

        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(52, 211, 153, 0.04) 1px, transparent 0)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 lg:p-8">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-3xl mb-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <svg
              className="w-10 h-10 text-white relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>

          <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent mb-4 leading-tight pb-2">
            Matching Center
          </h1>
          <p className="text-xl text-slate-300 mb-6 max-w-3xl mx-auto leading-relaxed">
            Discover compatible learning partners, manage your connections, and
            unlock your potential through intelligent skill matching
          </p>

          <div className="flex items-center justify-center space-x-6 mb-8 flex-wrap">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-400/10 via-green-500/10 to-teal-600/10 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-400/20">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
              <span className="text-emerald-400 font-semibold">
                Live Network
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-green-400/10 via-teal-500/10 to-emerald-600/10 backdrop-blur-sm rounded-full px-4 py-2 border border-green-400/20">
              <svg
                className="w-4 h-4 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="text-green-400 font-semibold">
                Smart AI Matching
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Search Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500/5 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-emerald-400 transition-colors duration-300">
              <Search className="w-6 h-6" />
            </div>

            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors duration-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            <input
              type="text"
              placeholder="Search for skills, people, or learning opportunities..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={`w-full pl-16 ${
                searchQuery ? "pr-16" : "pr-6"
              } py-4 bg-gray-800/50 backdrop-blur-sm border border-slate-600/30 rounded-3xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/50 transition-all duration-300 hover:bg-gray-800/70 text-lg`}
            />
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="bg-gradient-to-r from-gray-900/90 via-gray-950/95 to-black/90 backdrop-blur-xl rounded-3xl border border-slate-800/40 p-2 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/3 via-green-500/2 to-teal-500/3 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

          <div className="flex space-x-2 relative z-10">
            {[
              {
                id: "requests",
                icon: Target,
                label: "Match Requests",
                count: stats.requests,
              },
              {
                id: "smart",
                icon: Brain,
                label: "Smart Matches",
                count: stats.smart,
                special: true,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 relative overflow-hidden group ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/50 border border-emerald-300/20"
                    : "bg-gray-900/50 text-slate-400 hover:text-emerald-300 hover:bg-gray-800/60 hover:shadow-lg hover:shadow-emerald-500/10 border border-slate-700/50 hover:border-emerald-500/30"
                }`}
              >
                {activeTab === tab.id && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-transparent to-teal-600/20 animate-pulse"></div>
                  </>
                )}
                <div className="relative z-10 flex items-center space-x-3">
                  <div
                    className={`transition-all duration-300 ${
                      activeTab === tab.id
                        ? "scale-110 rotate-12"
                        : "group-hover:scale-110 group-hover:rotate-6"
                    }`}
                  >
                    <tab.icon
                      className={`w-5 h-5 ${
                        activeTab === tab.id
                          ? "text-white"
                          : "text-slate-400 group-hover:text-emerald-400"
                      }`}
                    />
                  </div>
                  <span className={`${activeTab === tab.id ? "" : ""}`}>
                    {tab.label}
                  </span>
                  {tab.special && (
                    <Sparkles
                      className={`w-4 h-4 ${
                        activeTab === tab.id
                          ? "text-yellow-300"
                          : "text-yellow-400"
                      } animate-pulse`}
                    />
                  )}
                  {tab.count > 0 && (
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                        activeTab === tab.id
                          ? "bg-white/20 text-white border border-white/30 shadow-lg"
                          : "bg-gradient-to-r from-emerald-900/30 to-green-900/30 text-emerald-300 border border-emerald-400/20 group-hover:from-emerald-800/40 group-hover:to-green-800/40"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </div>
              </button>
            ))}

            {activeTab === "smart" && (
              <button
                onClick={handleSmartMatchRefresh}
                disabled={smartMatchesLoading}
                className="px-6 py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 relative overflow-hidden group border border-emerald-400/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                <div className="relative z-10 flex items-center space-x-2">
                  <RefreshCw
                    className={`w-4 h-4 ${
                      smartMatchesLoading
                        ? "animate-spin"
                        : "group-hover:rotate-180 transition-transform duration-500"
                    }`}
                  />
                  <span>Refresh</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "requests" && (
          <div>
            {/* Enhanced Filter Section */}
            <div className="bg-gradient-to-r from-black/90 via-gray-950/95 to-slate-950/90 backdrop-blur-xl rounded-3xl border border-emerald-500/30 p-8 mb-10 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/8 via-green-500/6 to-teal-500/8 opacity-0 hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>

              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-400/60 rounded-full filter blur-3xl animate-blob"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-teal-400/60 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-400/60 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl shadow-lg shadow-emerald-500/30">
                      <Filter className="w-6 h-6 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-emerald-300 via-green-400 to-teal-400 bg-clip-text text-transparent">
                      Filter Matches
                    </span>
                  </h3>
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500/15 to-green-500/10 rounded-full border border-emerald-500/40">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-emerald-300 font-medium">
                      {filteredMatches.length} of {matches.length} matches
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {filterOptions.map((option, index) => {
                    const IconComponent = option.icon;
                    const count = option.count();
                    const isActive = activeFilter === option.key;

                    return (
                      <button
                        key={option.key}
                        onClick={() => setActiveFilter(option.key)}
                        className={`relative p-5 rounded-2xl border-2 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group ${
                          isActive
                            ? "bg-gradient-to-br from-gray-900/90 via-slate-900/90 to-black/90 text-emerald-300 border-emerald-400/70 shadow-2xl shadow-emerald-500/50 ring-2 ring-emerald-400/40"
                            : "bg-gradient-to-br from-slate-900/80 via-gray-900/90 to-black/80 text-slate-300 border-slate-800/50 hover:border-emerald-500/50 hover:text-emerald-300 hover:shadow-xl hover:shadow-emerald-500/30"
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-r from-emerald-500/8 via-green-500/12 to-teal-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl ${
                            isActive ? "opacity-100" : ""
                          }`}
                        ></div>

                        {isActive && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/60 animate-pulse">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}

                        <div className="relative z-10 text-center">
                          <div
                            className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 transition-all duration-500 ${
                              isActive
                                ? "bg-gradient-to-br from-emerald-500/50 to-green-500/50 text-emerald-200 shadow-lg shadow-emerald-500/50 rotate-12 scale-110"
                                : "bg-gradient-to-br from-slate-800/50 to-gray-900/60 text-slate-300 group-hover:from-emerald-500/30 group-hover:to-green-500/30 group-hover:text-emerald-300 group-hover:shadow-lg group-hover:shadow-emerald-500/30 group-hover:rotate-6"
                            }`}
                          >
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="font-semibold text-sm mb-2">
                            {option.label}
                          </div>
                          <div
                            className={`text-2xl font-bold ${
                              isActive
                                ? "text-emerald-300"
                                : "text-slate-300 group-hover:text-emerald-300"
                            } transition-colors duration-300`}
                          >
                            {count}
                          </div>
                        </div>

                        <div
                          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-b-2xl transition-all duration-300 ${
                            isActive
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          }`}
                        ></div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Enhanced Match Requests Content */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-full mb-6 shadow-2xl shadow-emerald-500/30">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-white border-t-transparent"></div>
                  </div>
                  <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent">
                    Loading Matches...
                  </p>
                  <p className="text-slate-400 mt-2">
                    Finding your perfect learning partners
                  </p>
                </div>
              </div>
            ) : filteredMatches.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-emerald-400/20 via-green-500/20 to-teal-600/20 backdrop-blur-sm rounded-full mb-8 border border-emerald-400/30">
                  <Target className="w-12 h-12 text-emerald-400" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent mb-4">
                  {getEmptyMessage()}
                </h3>
                <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                  {searchQuery
                    ? "Try adjusting your search or filters to find more matches."
                    : "Start discovering users and send match requests to begin your learning journey!"}
                </p>
                <button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Discover Users
                </button>
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
            {/* Enhanced Smart Matches Header */}
            <div className="bg-gradient-to-r from-emerald-50/5 to-teal-50/5 backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-8 mb-8 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/3 via-green-500/2 to-teal-500/3 rounded-2xl"></div>

              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
                      <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                        AI-Powered Smart Matches
                      </span>
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                    </h3>
                    <p className="text-slate-300 mt-1">
                      Our intelligent algorithm analyzes your skills,
                      preferences, and learning goals
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl p-4 border border-emerald-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">
                        Compatibility Score
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Advanced matching algorithms calculate perfect
                      partnerships
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-xl p-4 border border-blue-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-semibold">
                        Skill Alignment
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Match with users who complement your learning goals
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 font-semibold">
                        Mutual Learning
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Find partners for reciprocal skill exchange
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Smart Matches Content */}
            {smartMatchesLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-full mb-6 shadow-2xl shadow-emerald-500/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full animate-pulse transition-transform duration-1000"></div>
                    <Brain className="w-10 h-10 text-white animate-pulse relative z-10" />
                  </div>
                  <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent leading-normal pb-1">
                    AI Analyzing Matches...
                  </p>
                  <p className="text-slate-400 mt-2 leading-relaxed">
                    Finding your most compatible learning partners
                  </p>
                  <div className="mt-4 flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            ) : smartMatchesError ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-400/20 via-rose-500/20 to-red-600/20 backdrop-blur-sm rounded-full mb-8 border border-red-400/30">
                  <svg
                    className="w-12 h-12 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-red-400 mb-4">
                  Failed to Load Smart Matches
                </h3>
                <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                  {smartMatchesError}
                </p>
                <button
                  onClick={handleSmartMatchRefresh}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Try Again
                </button>
              </div>
            ) : smartMatches.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-emerald-400/20 via-green-500/20 to-teal-600/20 backdrop-blur-sm rounded-full mb-8 border border-emerald-400/30">
                  <Brain className="w-12 h-12 text-emerald-400" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent mb-4 leading-normal pb-1">
                  No Smart Matches Found
                </h3>
                <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                  Complete your profile and add more skills to get better
                  AI-powered matches!
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => (window.location.href = "/profile")}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Complete Profile
                  </button>
                  <div className="text-center">
                    <button
                      onClick={() => (window.location.href = "/skills")}
                      className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-300"
                    >
                      Add Skills →
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-bold text-white flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <span>{smartMatches.length} Perfect Matches Found</span>
                  </h4>
                  <div className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-600/30">
                    Updated just now
                  </div>
                </div>

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
              </div>
            )}
          </div>
        )}

        {/* Enhanced Footer Stats */}
        {matches.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-gray-800/70 via-slate-800/60 to-gray-900/70 backdrop-blur-xl rounded-2xl border border-slate-600/30 p-8 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-green-500/2 to-teal-500/0 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent inline-block leading-normal pb-1">
                  Your Matching Journey
                </span>
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  {
                    label: "Total Connections",
                    value: stats.requests,
                    icon: Users,
                    color: "from-emerald-400 to-green-500",
                    bg: "bg-emerald-500/15 border-emerald-400/25",
                  },
                  {
                    label: "Active Matches",
                    value: stats.current,
                    icon: Zap,
                    color: "from-blue-400 to-cyan-500",
                    bg: "bg-blue-500/15 border-blue-400/25",
                  },
                  {
                    label: "Smart Matches",
                    value: stats.smart,
                    icon: Brain,
                    color: "from-purple-400 to-pink-500",
                    bg: "bg-purple-500/15 border-purple-400/25",
                  },
                  {
                    label: "Success Rate",
                    value:
                      stats.current > 0
                        ? Math.round((stats.current / stats.requests) * 100) +
                          "%"
                        : "0%",
                    icon: TrendingUp,
                    color: "from-yellow-400 to-orange-500",
                    bg: "bg-yellow-500/15 border-yellow-400/25",
                  },
                ].map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className={`${stat.bg} border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden`}
                      style={{
                        animationDelay: `${index * 150}ms`,
                        animation: "fadeInUp 0.6s ease-out forwards",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl"></div>

                      <div className="relative z-10">
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl mb-3 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div
                          className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:text-4xl transition-all duration-300`}
                        >
                          {stat.value}
                        </div>
                        <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300 font-medium">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
