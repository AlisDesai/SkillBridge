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
  color = "blue",
  trend = null,
  loading = false,
}) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
    red: "bg-red-50 border-red-200 text-red-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <p className="text-3xl font-bold text-gray-900">{value || 0}</p>
            )}
            {trend && !loading && trend.value > 0 && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  trend.type === "increase"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {trend.type === "increase" ? "↗" : "↘"} {trend.value}%
              </span>
            )}
          </div>
        </div>
        <div
          className={`w-12 h-12 rounded-xl border flex items-center justify-center ${colorClasses[color]}`}
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
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg animate-pulse">
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const severityColors = {
    info: "bg-blue-50 border-l-blue-500",
    success: "bg-green-50 border-l-green-500",
    warning: "bg-yellow-50 border-l-yellow-500",
    error: "bg-red-50 border-l-red-500",
  };

  const dotColors = {
    info: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border-l-4 ${
        severityColors[activity.severity]
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${dotColors[activity.severity]}`}
      ></div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
        <p className="text-xs text-gray-500">
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
  color = "blue",
}) => {
  const colorClasses = {
    blue: "hover:bg-blue-50 border-blue-200",
    green: "hover:bg-green-50 border-green-200",
    yellow: "hover:bg-yellow-50 border-yellow-200",
    purple: "hover:bg-purple-50 border-purple-200",
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border p-6 cursor-pointer transition-all ${colorClasses[color]}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
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
    // Navigate to management components
    console.log(`Quick action: ${action}`);
    showError("Navigation will be implemented with routing");
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      // Clear admin data
      dispatch(clearAdminData());
      // Logout user
      dispatch(logout());
      showSuccess("Logged out successfully");
      // Redirect to homepage
      navigate("/");
    } catch (err) {
      showError("Failed to logout");
    } finally {
      setShowLogoutModal(false);
    }
  };

  if (loading && !adminStats) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-2 border-[#FF7A59] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Failed to load admin dashboard</div>
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
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage your SkillBridge platform · Last updated:{" "}
            {lastRefresh.toLocaleTimeString()}
            {user && (
              <span className="ml-4">
                Welcome, <span className="font-medium">{user.name}</span>
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Refreshing...
              </div>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </>
            )}
          </Button>

          <Button variant="danger" onClick={handleLogout}>
            <svg
              className="w-4 h-4 mr-2"
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
            Logout
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          color="blue"
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
              className="w-6 h-6"
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
              className="w-6 h-6"
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
          color="purple"
          loading={loading}
          icon={
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
              className="w-6 h-6"
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
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New Users (30 days)</span>
              {loading ? (
                <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <span className="font-medium text-gray-900">
                  {stats.recentUsers || 0}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Weekly Users</span>
              {loading ? (
                <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <span className="font-medium text-gray-900">
                  {stats.weeklyUsers || 0}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Users</span>
              {loading ? (
                <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <span className="font-medium text-green-600">
                  {stats.activeUsers || 0}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Rating</span>
              {loading ? (
                <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <span className="font-medium text-gray-900">
                  {stats.averageRating || 0}★
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Match Statistics
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending</span>
              {loading ? (
                <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <span className="font-medium text-yellow-600">
                  {matchStats.pending || 0}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Accepted</span>
              {loading ? (
                <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <span className="font-medium text-green-600">
                  {matchStats.accepted || 0}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completed</span>
              {loading ? (
                <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <span className="font-medium text-blue-600">
                  {matchStats.completed || 0}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rejected</span>
              {loading ? (
                <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <span className="font-medium text-red-600">
                  {matchStats.rejected || 0}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Skills
          </h3>
          <div className="space-y-3">
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))
              : topSkills.slice(0, 5).map((skill, index) => (
                  <div
                    key={skill._id || index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600 truncate">
                      {skill._id}
                    </span>
                    <span className="font-medium text-gray-900">
                      {skill.count}
                    </span>
                  </div>
                ))}
            {!loading && topSkills.length === 0 && (
              <p className="text-sm text-gray-500">No skills data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Platform Health */}
      {(systemHealth || healthLoading) && (
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Platform Health
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {healthLoading ? (
                  <div className="w-12 h-8 bg-gray-200 rounded animate-pulse mx-auto"></div>
                ) : (
                  "Online"
                )}
              </div>
              <div className="text-sm text-gray-600">System Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {healthLoading ? (
                  <div className="w-16 h-8 bg-gray-200 rounded animate-pulse mx-auto"></div>
                ) : (
                  `${Math.floor((systemHealth?.server?.uptime || 0) / 3600)}h`
                )}
              </div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {healthLoading ? (
                  <div className="w-12 h-8 bg-gray-200 rounded animate-pulse mx-auto"></div>
                ) : (
                  `${Math.round(
                    (systemHealth?.server?.memory?.heapUsed || 0) / 1024 / 1024
                  )}MB`
                )}
              </div>
              <div className="text-sm text-gray-600">Memory</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {healthLoading ? (
                  <div className="w-12 h-8 bg-gray-200 rounded animate-pulse mx-auto"></div>
                ) : (
                  platformHealth.activeUsers || 0
                )}
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            title="Manage Users"
            description="View, edit, and manage user accounts"
            color="blue"
            icon={
              <svg
                className="w-5 h-5 text-blue-600"
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
                className="w-5 h-5 text-yellow-600"
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
                className="w-5 h-5 text-green-600"
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
            color="purple"
            icon={
              <svg
                className="w-5 h-5 text-purple-600"
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
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
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
              <p className="text-gray-500">No recent activities to display</p>
            </div>
          )}
        </div>
      </div>

      {/* User Growth Chart Section */}
      {userGrowth.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            User Growth Trend
          </h2>
          <div className="space-y-4">
            {userGrowth.slice(-6).map((growth, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-700">
                  {new Date(
                    growth._id.year,
                    growth._id.month - 1
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
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
                  <span className="text-sm font-bold text-gray-900 w-8 text-right">
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
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Users by Role
            </h3>
            <div className="space-y-3">
              {analyticsLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))
                : userAnalytics?.byRole?.map((role, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600 capitalize">
                        {role._id || "Unknown"}
                      </span>
                      <span className="font-medium text-gray-900">
                        {role.count}
                      </span>
                    </div>
                  ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Users by Status
            </h3>
            <div className="space-y-3">
              {analyticsLoading
                ? Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))
                : userAnalytics?.byStatus?.map((status, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600">
                        {status._id ? "Active" : "Inactive"}
                      </span>
                      <span
                        className={`font-medium ${
                          status._id ? "text-green-600" : "text-red-600"
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
      <div className="text-center text-sm text-gray-500 pt-4 border-t">
        <div className="flex items-center justify-center gap-4">
          <p>
            Last updated:{" "}
            {adminStats?.lastUpdated
              ? new Date(adminStats.lastUpdated).toLocaleString()
              : "Never"}
          </p>
          <span>•</span>
          <p>
            Total platform uptime:{" "}
            {platformHealth.systemUptime
              ? `${Math.floor(
                  platformHealth.systemUptime / 3600
                )}h ${Math.floor((platformHealth.systemUptime % 3600) / 60)}m`
              : "Unknown"}
          </p>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
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
              <h3 className="text-lg font-semibold text-gray-900">
                Are you sure you want to logout?
              </h3>
              <p className="text-sm text-gray-600">
                You will be redirected to the homepage and will need to login
                again to access the admin panel.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmLogout}>
              Yes, Logout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
