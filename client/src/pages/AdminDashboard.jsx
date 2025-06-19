import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAdminStatsAsync,
  fetchSystemHealthAsync,
  fetchUserAnalyticsAsync,
  clearAdminData,
} from "../redux/slices/adminSlice";
import { logout } from "../redux/slices/authSlice";
import { showError, showSuccess, showConfirm } from "../utils/toast";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";

const StatCard = ({
  title,
  value,
  icon,
  color = "emerald",
  trend = null,
  loading = false,
}) => {
  const colorClasses = {
    emerald: "bg-gradient-to-br from-emerald-400/20 via-green-500/15 to-teal-600/20 border-emerald-400/30 text-emerald-400",
    green: "bg-gradient-to-br from-green-400/20 via-emerald-500/15 to-green-600/20 border-green-400/30 text-green-400",
    teal: "bg-gradient-to-br from-teal-400/20 via-green-500/15 to-teal-600/20 border-teal-400/30 text-teal-400",
    yellow: "bg-gradient-to-br from-yellow-400/20 via-emerald-400/15 to-green-500/20 border-yellow-400/30 text-yellow-400",
  };

  return (
    <div className="bg-gradient-to-br from-gray-950/95 via-slate-950/90 to-black/95 backdrop-blur-sm rounded-2xl border border-slate-500/30 p-6 hover:border-emerald-400/40 transition-all duration-300 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-300 mb-2">{title}</p>
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg animate-pulse"></div>
            ) : (
              <p className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-200 to-slate-300 bg-clip-text text-transparent">
                {value || 0}
              </p>
            )}
            {trend && !loading && trend.value > 0 && (
              <span
                className={`text-xs px-3 py-1 rounded-full border ${
                  trend.type === "increase"
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }`}
              >
                {trend.type === "increase" ? "↗" : "↘"} {trend.value}%
              </span>
            )}
          </div>
        </div>
        <div
          className={`w-14 h-14 rounded-xl border backdrop-blur-sm flex items-center justify-center ${colorClasses[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ activity, loading = false }) => {
  if (loading) {
    return (
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-800/50 to-gray-800/50 rounded-xl border border-slate-500/30 animate-pulse">
        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-slate-500 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-slate-400 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const severityColors = {
    info: "bg-gradient-to-r from-emerald-500/25 to-teal-500/25 border-l-emerald-400",
    success: "bg-gradient-to-r from-green-500/25 to-emerald-500/25 border-l-green-400",
    warning: "bg-gradient-to-r from-yellow-400/25 to-emerald-400/25 border-l-yellow-400",
    error: "bg-gradient-to-r from-red-500/25 to-emerald-400/25 border-l-red-400",
  };

  const dotColors = {
    info: "bg-emerald-400",
    success: "bg-green-400",
    warning: "bg-yellow-400",
    error: "bg-red-400",
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border-l-4 backdrop-blur-sm ${
        severityColors[activity.severity]
      }`}
    >
      <div
        className={`w-3 h-3 rounded-full ${dotColors[activity.severity]}`}
      ></div>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{activity.message}</p>
        <p className="text-xs text-slate-400">
          {new Date(activity.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

const QuickActionCard = ({
  title,
  description,
  icon,
  onClick,
  color = "emerald",
}) => {
  const colorClasses = {
    emerald: "hover:bg-gradient-to-br hover:from-emerald-500/25 hover:to-green-500/25 border-emerald-400/25 hover:border-emerald-400/50",
    green: "hover:bg-gradient-to-br hover:from-green-500/25 hover:to-teal-500/25 border-green-400/25 hover:border-green-400/50",
    teal: "hover:bg-gradient-to-br hover:from-teal-500/25 hover:to-emerald-500/25 border-teal-400/25 hover:border-teal-400/50",
    yellow: "hover:bg-gradient-to-br hover:from-yellow-400/25 hover:to-emerald-400/25 border-yellow-400/25 hover:border-yellow-400/50",
  };

  return (
    <div
      className={`bg-gradient-to-br from-gray-950/95 via-slate-950/90 to-black/95 backdrop-blur-sm rounded-2xl border p-6 cursor-pointer transition-all duration-300 ${colorClasses[color]} hover:scale-105 shadow-lg`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/25 to-teal-500/25 rounded-xl flex items-center justify-center flex-shrink-0 border border-emerald-400/30">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-white mb-2">{title}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const {
    adminStats,
    systemHealth,
    userAnalytics,
    loading,
    healthLoading,
    analyticsLoading,
    error,
  } = useSelector((state) => state.admin || {});

  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    loadAllData();
  }, [dispatch]);

  const loadAllData = async () => {
    try {
      await Promise.all([
        dispatch(fetchAdminStatsAsync()).unwrap(),
        dispatch(fetchSystemHealthAsync()).unwrap(),
        dispatch(fetchUserAnalyticsAsync()).unwrap(),
      ]);
      setLastRefresh(new Date());
    } catch (err) {
      showError("Failed to load dashboard data");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadAllData();
      showSuccess("Dashboard refreshed successfully");
    } catch (err) {
      showError("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  const handleQuickAction = (action) => {
    console.log(`Quick action: ${action}`);
    showError("Navigation will be implemented with routing");
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      dispatch(clearAdminData());
      dispatch(logout());
      showSuccess("Logged out successfully");
      navigate("/");
    } catch (err) {
      showError("Failed to logout");
    } finally {
      setShowLogoutModal(false);
    }
  };

  if (loading && !adminStats) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-gradient-to-br from-black via-gray-950 to-slate-950">
        <div className="w-12 h-12 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-black via-gray-950 to-slate-950 min-h-screen">
        <div className="text-red-400 mb-4">Failed to load admin dashboard</div>
        <Button variant="outline" onClick={handleRefresh}>
          Try Again
        </Button>
      </div>
    );
  }

  const stats = adminStats?.overview || {};
  const topSkills = adminStats?.topSkills || [];
  const matchStats = adminStats?.matchStatistics || {};
  const recentActivities = adminStats?.recentActivities || [];
  const platformHealth = adminStats?.platformHealth || {};
  const userGrowth = adminStats?.userGrowth || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950">
      <div className="space-y-8 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-2">
              Manage your SkillBridge platform · Last updated:{" "}
              <span className="text-emerald-400">{lastRefresh.toLocaleTimeString()}</span>
              {user && (
                <span className="ml-4">
                  Welcome, <span className="font-medium text-white">{user.name}</span>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            color="emerald"
            loading={loading}
            trend={
              stats.userGrowthRate && {
                type:
                  parseFloat(stats.userGrowthRate) >= 0 ? "increase" : "decrease",
                value: Math.abs(parseFloat(stats.userGrowthRate)),
              }
            }
            icon={
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            }
          />

          <StatCard
            title="Total Skills"
            value={stats.totalSkills}
            color="green"
            loading={loading}
            icon={
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            }
          />

          <StatCard
            title="Total Matches"
            value={stats.totalMatches}
            color="teal"
            loading={loading}
            icon={
              <svg
                className="w-7 h-7"
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
            }
          />

          <StatCard
            title="Total Reviews"
            value={stats.totalReviews}
            color="yellow"
            loading={loading}
            icon={
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            }
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-950/95 via-slate-950/90 to-black/95 backdrop-blur-sm rounded-2xl border border-slate-500/30 p-6 shadow-lg">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-500/20 pb-3">
                <span className="text-sm text-slate-400">New Users (30 days)</span>
                {loading ? (
                  <div className="w-12 h-5 bg-slate-500 rounded animate-pulse"></div>
                ) : (
                  <span className="font-bold text-emerald-400">
                    {stats.recentUsers || 0}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between border-b border-slate-500/20 pb-3">
                <span className="text-sm text-slate-400">Weekly Users</span>
                {loading ? (
                  <div className="w-12 h-5 bg-slate-500 rounded animate-pulse"></div>
                ) : (
                  <span className="font-bold text-green-400">
                    {stats.weeklyUsers || 0}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between border-b border-slate-500/20 pb-3">
                <span className="text-sm text-slate-400">Active Users</span>
                {loading ? (
                  <div className="w-12 h-5 bg-slate-500 rounded animate-pulse"></div>
                ) : (
                  <span className="font-bold text-teal-400">
                    {stats.activeUsers || 0}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Average Rating</span>
                {loading ? (
                  <div className="w-12 h-5 bg-slate-500 rounded animate-pulse"></div>
                ) : (
                  <span className="font-bold text-yellow-400">
                    {stats.averageRating || 0}★
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-950/95 via-slate-950/90 to-black/95 backdrop-blur-sm rounded-2xl border border-slate-500/30 p-6 shadow-lg">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6">
              Match Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-500/20 pb-3">
                <span className="text-sm text-slate-400">Pending</span>
                {loading ? (
                  <div className="w-12 h-5 bg-slate-500 rounded animate-pulse"></div>
                ) : (
                  <span className="font-bold text-yellow-400">
                    {matchStats.pending || 0}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between border-b border-slate-500/20 pb-3">
                <span className="text-sm text-slate-400">Accepted</span>
                {loading ? (
                  <div className="w-12 h-5 bg-slate-500 rounded animate-pulse"></div>
                ) : (
                  <span className="font-bold text-green-400">
                    {matchStats.accepted || 0}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between border-b border-slate-500/20 pb-3">
                <span className="text-sm text-slate-400">Completed</span>
                {loading ? (
                  <div className="w-12 h-5 bg-slate-500 rounded animate-pulse"></div>
                ) : (
                  <span className="font-bold text-emerald-400">
                    {matchStats.completed || 0}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Rejected</span>
                {loading ? (
                  <div className="w-12 h-5 bg-slate-500 rounded animate-pulse"></div>
                ) : (
                  <span className="font-bold text-red-400">
                    {matchStats.rejected || 0}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-950/95 via-slate-950/90 to-black/95 backdrop-blur-sm rounded-2xl border border-slate-500/30 p-6 shadow-lg">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent mb-6">
              Top Skills
            </h3>
            <div className="space-y-4">
              {loading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-slate-500/20 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="w-24 h-4 bg-slate-500 rounded animate-pulse"></div>
                      <div className="w-8 h-4 bg-slate-500 rounded animate-pulse"></div>
                    </div>
                  ))
                : topSkills.slice(0, 5).map((skill, index) => (
                    <div
                      key={skill._id || index}
                      className="flex items-center justify-between border-b border-slate-500/20 pb-3 last:border-b-0 last:pb-0"
                    >
                      <span className="text-sm text-slate-400 truncate">
                        {skill._id}
                      </span>
                      <span className="font-bold text-emerald-400">
                        {skill.count}
                      </span>
                    </div>
                  ))}
              {!loading && topSkills.length === 0 && (
                <p className="text-sm text-slate-500">No skills data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Platform Health */}
        {(systemHealth || healthLoading) && (
          <div className="bg-gradient-to-br from-gray-950/95 via-slate-950/90 to-black/95 backdrop-blur-sm rounded-2xl border border-slate-500/30 p-6 shadow-lg">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent mb-8">
              Platform Health
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/15 rounded-xl border border-green-400/30">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {healthLoading ? (
                    <div className="w-16 h-8 bg-slate-500 rounded animate-pulse mx-auto"></div>
                  ) : (
                    "Online"
                  )}
                </div>
                <div className="text-sm text-slate-400">System Status</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/15 rounded-xl border border-emerald-400/30">
                <div className="text-3xl font-bold text-emerald-400 mb-2">
                  {healthLoading ? (
                    <div className="w-20 h-8 bg-slate-500 rounded animate-pulse mx-auto"></div>
                  ) : (
                    `${Math.floor((systemHealth?.server?.uptime || 0) / 3600)}h`
                  )}
                </div>
                <div className="text-sm text-slate-400">Uptime</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-teal-500/20 to-green-500/15 rounded-xl border border-teal-400/30">
                <div className="text-3xl font-bold text-teal-400 mb-2">
                  {healthLoading ? (
                    <div className="w-16 h-8 bg-slate-500 rounded animate-pulse mx-auto"></div>
                  ) : (
                    `${Math.round(
                      (systemHealth?.server?.memory?.heapUsed || 0) / 1024 / 1024
                    )}MB`
                  )}
                </div>
                <div className="text-sm text-slate-400">Memory</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-yellow-400/20 to-emerald-400/15 rounded-xl border border-yellow-400/30">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {healthLoading ? (
                    <div className="w-16 h-8 bg-slate-500 rounded animate-pulse mx-auto"></div>
                  ) : (
                    platformHealth.activeUsers || 0
                  )}
                </div>
                <div className="text-sm text-slate-400">Active Users</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent mb-8">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard
              title="Manage Users"
              description="View, edit, and manage user accounts"
              color="emerald"
              icon={
                <svg
                  className="w-6 h-6 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              }
              onClick={() => handleQuickAction("users")}
            />

            <QuickActionCard
              title="Review Management"
              description="Monitor and manage user reviews"
              color="yellow"
              icon={
                <svg
                  className="w-6 h-6 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              }
              onClick={() => handleQuickAction("reviews")}
            />

            <QuickActionCard
              title="Skill Management"
              description="Oversee skills and categories"
              color="green"
              icon={
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              }
              onClick={() => handleQuickAction("skills")}
            />

            <QuickActionCard
              title="System Analytics"
              description="View detailed analytics and reports"
              color="teal"
              icon={
                <svg
                  className="w-6 h-6 text-teal-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
              onClick={() => handleQuickAction("analytics")}
            />
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="bg-gradient-to-br from-gray-950/95 via-slate-950/90 to-black/95 backdrop-blur-sm rounded-2xl border border-slate-500/30 p-6 shadow-lg">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent mb-8">
            Recent Platform Activity
          </h2>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <ActivityItem key={index} loading={true} />
              ))
            ) : recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400/25 to-teal-500/25 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-400/30">
                  <svg
                    className="w-8 h-8 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <p className="text-slate-400">No recent activities to display</p>
              </div>
            )}
          </div>
        </div>

        {/* User Growth Chart Section */}
        {userGrowth.length > 0 && (
          <div className="bg-gradient-to-br from-gray-950/95 via-slate-950/90 to-black/95 backdrop-blur-sm rounded-2xl border border-slate-500/30 p-6 shadow-lg">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent mb-8">
              User Growth Trend
            </h2>
            <div className="space-y-4">
              {userGrowth.slice(-6).map((growth, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-xl border border-emerald-400/25"
                >
                  <span className="text-sm font-medium text-slate-300">
                    {new Date(
                      growth._id.year,
                      growth._id.month - 1
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-slate-600/50 rounded-full h-3 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            (growth.count /
                              Math.max(...userGrowth.map((g) => g.count))) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-emerald-400 w-12 text-right">
                      {growth.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Analytics Section */}
        {(userAnalytics || analyticsLoading) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-950/95 via-slate-950/90 to-black/95 backdrop-blur-sm rounded-2xl border border-slate-500/30 p-6 shadow-lg">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-6">
                Users by Role
              </h3>
              <div className="space-y-4">
                {analyticsLoading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="w-20 h-4 bg-slate-500 rounded animate-pulse"></div>
                        <div className="w-12 h-4 bg-slate-500 rounded animate-pulse"></div>
                      </div>
                    ))
                  : userAnalytics?.byRole?.map((role, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-500/20 to-green-500/15 rounded-lg border border-emerald-400/30"
                      >
                        <span className="text-sm text-slate-300 capitalize">
                          {role._id || "Unknown"}
                        </span>
                        <span className="font-bold text-emerald-400">
                          {role.count}
                        </span>
                      </div>
                    ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-950/95 via-slate-950/90 to-black/95 backdrop-blur-sm rounded-2xl border border-slate-500/30 p-6 shadow-lg">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent mb-6">
                Users by Status
              </h3>
              <div className="space-y-4">
                {analyticsLoading
                  ? Array.from({ length: 2 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="w-20 h-4 bg-slate-500 rounded animate-pulse"></div>
                        <div className="w-12 h-4 bg-slate-500 rounded animate-pulse"></div>
                      </div>
                    ))
                  : userAnalytics?.byStatus?.map((status, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-500/20 to-emerald-500/15 rounded-lg border border-teal-400/30"
                      >
                        <span className="text-sm text-slate-300">
                          {status._id ? "Active" : "Inactive"}
                        </span>
                        <span
                          className={`font-bold ${
                            status._id ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {status.count}
                        </span>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center text-sm text-slate-500 pt-6 border-t border-slate-500/30">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <p className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Last updated:{" "}
              <span className="text-emerald-400">
                {adminStats?.lastUpdated
                  ? new Date(adminStats.lastUpdated).toLocaleString()
                  : "Never"}
              </span>
            </p>
            <span className="text-slate-400">•</span>
            <p className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Platform uptime:{" "}
              <span className="text-green-400">
                {platformHealth.systemUptime
                  ? `${Math.floor(
                      platformHealth.systemUptime / 3600
                    )}h ${Math.floor((platformHealth.systemUptime % 3600) / 60)}m`
                  : "Unknown"}
              </span>
            </p>
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        <Modal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          title="Confirm Logout"
          className="bg-gradient-to-br from-gray-950 via-slate-950 to-black border border-slate-500"
        >
          <div className="bg-gradient-to-br from-gray-950/95 via-slate-950/90 to-black/95 p-6 rounded-2xl border border-slate-500/30 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/25 to-red-600/25 flex items-center justify-center border border-red-400/30">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Are you sure you want to logout?
                </h3>
                <p className="text-sm text-slate-400">
                  You will be redirected to the homepage and will need to login
                  again to access the admin panel.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-6 py-3 bg-gradient-to-r from-slate-500/50 to-gray-500/50 text-slate-300 border border-slate-400/30 rounded-xl hover:from-slate-400/50 hover:to-gray-400/50 transition-all duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-6 py-3 bg-gradient-to-r from-red-500/80 to-red-600/80 text-white border border-red-400/30 rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-300 font-medium"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}