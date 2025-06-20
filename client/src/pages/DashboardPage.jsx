import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function DashboardPage() {
  const [allUsers, setAllUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/discover");
        console.log("API Response:", res.data);
        setAllUsers(res.data);
        setDisplayedUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setDisplayedUsers(allUsers);
      return;
    }

    const filteredUsers = allUsers.filter((user) => {
      const searchLower = query.toLowerCase().trim();

      if (user.name?.toLowerCase().includes(searchLower)) return true;
      if (user.location?.toLowerCase().includes(searchLower)) return true;
      if (user.bio?.toLowerCase().includes(searchLower)) return true;
      if (
        user.teachSkills?.some((skill) =>
          skill.name?.toLowerCase().includes(searchLower)
        )
      )
        return true;
      if (
        user.learnSkills?.some((skill) =>
          skill.name?.toLowerCase().includes(searchLower)
        )
      )
        return true;

      return false;
    });

    setDisplayedUsers(filteredUsers);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDisplayedUsers(allUsers);
  };

  const handleViewDetails = (userId) => {
    navigate(`/user/${userId}`);
  };

  const getTopSkills = (teachSkills = [], learnSkills = []) => {
    const allSkills = [...teachSkills, ...learnSkills];
    return allSkills.slice(0, 3);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-96 -right-96 w-[600px] h-[600px] bg-emerald-400/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-96 -left-96 w-[600px] h-[600px] bg-green-500/4 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-400/3 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-full mb-6 shadow-2xl shadow-emerald-500/30">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-white border-t-transparent"></div>
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent">
              Discovering Amazing People...
            </p>
            <p className="text-slate-400 mt-2">
              Finding skilled professionals just for you
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-96 -right-96 w-[600px] h-[600px] bg-emerald-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-96 -left-96 w-[600px] h-[600px] bg-green-500/4 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-400/3 rounded-full blur-2xl animate-pulse delay-500"></div>

        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-emerald-500/4 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-green-400/3 rounded-full blur-xl"></div>

        <div className="absolute top-20 left-20 w-2 h-2 bg-emerald-400/30 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-green-400/20 rounded-full animate-ping delay-300"></div>
        <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-teal-500/25 rounded-full animate-ping delay-700"></div>
        <div className="absolute top-60 right-1/4 w-1 h-1 bg-emerald-300/20 rounded-full animate-ping delay-1000"></div>

        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(52, 211, 153, 0.08) 1px, transparent 0)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 lg:p-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-emerald-400 transition-colors duration-300">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5"
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
              placeholder="Search for skills, people, or opportunities..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={`w-full pl-12 ${
                searchQuery ? "pr-12" : "pr-4"
              } py-3 bg-gray-800/50 backdrop-blur-sm border border-slate-600/30 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/50 transition-all duration-300 hover:bg-gray-800/70 text-center`}
            />
          </div>
        </div>

        {/* Header Section */}
        {/* <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-2xl mb-6 shadow-2xl shadow-emerald-500/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <svg
              className="w-8 h-8 text-white relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent mb-4">
            Discover Talent
          </h1>
          <p className="text-xl text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            Connect with amazing professionals, learn new skills, and share your
            expertise with the world
          </p>

          <div className="flex items-center justify-center space-x-4 mb-8 flex-wrap">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-400/10 via-green-500/10 to-teal-600/10 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-400/20">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
              <span className="text-emerald-400 font-semibold">
                {displayedUsers.length}{" "}
                {displayedUsers.length === allUsers.length
                  ? "Active Members"
                  : "Results Found"}
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
              <span className="text-green-400 font-semibold">Live Network</span>
            </div>
          </div>
        </div> */}

        {/* Users Grid */}
        <div className="max-w-7xl mx-auto">
          {displayedUsers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {displayedUsers.map((user, index) => {
                const topSkills = getTopSkills(
                  user.teachSkills,
                  user.learnSkills
                );

                return (
                  <div
                    key={user._id}
                    className="group relative bg-gradient-to-br from-gray-950/90 via-slate-950/90 to-gray-900/90 backdrop-blur-xl rounded-3xl border border-slate-600/20 p-8 hover:border-emerald-400/30 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-emerald-500/10 overflow-hidden animate-fadeInUp min-h-[450px]"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-green-500/3 to-teal-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                    <div className="flex justify-center mb-8">
                      <div className="relative">
                        <div className="w-28 h-28 bg-gradient-to-br from-emerald-400/90 via-green-500/90 to-teal-600/90 rounded-full flex items-center justify-center text-white text-3xl font-bold relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          <span className="relative z-10">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        {/* <div className="absolute -inset-3 bg-gradient-to-r from-emerald-400/20 via-green-500/20 to-teal-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white text-center mb-3 group-hover:text-emerald-300 transition-colors duration-300">
                      {user.name || "Anonymous User"}
                    </h3>

                    {user.location && (
                      <div className="flex items-center justify-center space-x-2 mb-6">
                        <svg
                          className="w-5 h-5 text-emerald-400/80"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <p className="text-base text-slate-300 font-medium">
                          {user.location}
                        </p>
                      </div>
                    )}

                    <div className="space-y-4 mb-8">
                      {topSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-3 justify-center">
                          {topSkills.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-4 py-2 bg-gradient-to-r from-emerald-400/15 via-green-500/15 to-teal-600/15 backdrop-blur-sm text-emerald-300 text-sm font-semibold rounded-full border border-emerald-400/20 hover:border-emerald-400/40 hover:bg-emerald-400/20 transition-all duration-300 shadow-md"
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400 text-center bg-slate-800/20 rounded-xl py-3 px-4 border border-slate-600/10">
                          No skills listed yet
                        </p>
                      )}
                    </div>

                    {user.bio && (
                      <p className="text-base text-slate-300 text-center mb-8 leading-relaxed bg-gradient-to-r from-gray-800/20 to-slate-800/20 rounded-xl p-4 border border-slate-600/10 min-h-[80px] flex items-center justify-center">
                        {user.bio.length > 80
                          ? `${user.bio.substring(0, 80)}...`
                          : user.bio}
                      </p>
                    )}

                    <div className="mt-auto">
                      <button
                        onClick={() => handleViewDetails(user._id)}
                        className="relative w-full py-4 px-8 bg-gradient-to-r from-emerald-400/90 via-green-500/90 to-teal-600/90 hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 text-white font-bold text-base rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl overflow-hidden group/btn"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                        <div className="relative flex items-center justify-center space-x-3">
                          <span>View Profile</span>
                          <svg
                            className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-emerald-400/20 via-green-500/20 to-teal-600/20 backdrop-blur-sm rounded-full mb-8 border border-emerald-400/30">
                <svg
                  className="w-12 h-12 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent mb-4">
                No Results Found
              </h3>
              <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                Try searching for different skills, names, or locations to find
                the perfect match.
              </p>
            </div>
          )}
        </div>

        {allUsers.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-emerald-400/20 via-green-500/20 to-teal-600/20 backdrop-blur-sm rounded-full mb-8 border border-emerald-400/30">
              <svg
                className="w-12 h-12 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent mb-4">
              No Users Found
            </h3>
            <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
              Be the pioneer! Add your skills and start building the community.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Add Your Skills
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
