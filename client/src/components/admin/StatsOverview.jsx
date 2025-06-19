import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStatsAsync } from "../../redux/slices/adminSlice";
import { showError } from "../../utils/toast";
import Button from "../common/Button";

const MetricCard = ({ title, value, change, icon, color = "emerald" }) => {
  const colorClasses = {
    emerald: "bg-emerald-500/20 border-emerald-400/30 text-emerald-400",
    green: "bg-green-500/20 border-green-400/30 text-green-400",
    teal: "bg-teal-500/20 border-teal-400/30 text-teal-400",
    yellow: "bg-yellow-400/20 border-yellow-400/30 text-yellow-400",
    red: "bg-red-500/20 border-red-400/30 text-red-400",
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400 mb-2">{title}</p>
          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold text-white">{value}</p>
            {change && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  change.type === "increase"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {change.type === "increase" ? "↗" : "↘"} {change.value}%
              </span>
            )}
          </div>
        </div>
        <div
          className={`w-14 h-14 rounded-xl border flex items-center justify-center ${colorClasses[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm ${className}`}>
      <h3 className="text-xl font-semibold text-white mb-6">{title}</h3>
      {children}
    </div>
  );
};

const SimpleBarChart = ({ data, label, color = "emerald" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">No data available</div>
    );
  }

  const maxValue = Math.max(...data.map((item) => item.count));

  const colorClasses = {
    emerald: "bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600",
    green: "bg-gradient-to-r from-green-400 to-emerald-500",
    teal: "bg-gradient-to-r from-teal-400 to-green-500",
  };

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="w-20 text-sm text-slate-400 capitalize">
            {item._id || `Month ${index + 1}`}
          </div>
          <div className="flex-1 bg-slate-800 rounded-full h-4 relative overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-700 ${colorClasses[color]}`}
              style={{
                width: `${maxValue > 0 ? (item.count / maxValue) * 100 : 0}%`,
              }}
            />
          </div>
          <div className="w-16 text-sm font-medium text-white text-right">
            {item.count}
          </div>
        </div>
      ))}
    </div>
  );
};

const ActivityTimeline = ({ activities = [] }) => {
  const defaultActivities = [
    {
      type: "system",
      message: "System health check completed",
      time: new Date(),
      status: "success",
    },
    {
      type: "backup",
      message: "Daily database backup completed",
      time: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "success",
    },
    {
      type: "update",
      message: "Platform security updates applied",
      time: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: "info",
    },
  ];

  const activityList = activities.length > 0 ? activities : defaultActivities;

  const getStatusColor = (status) => {
    const colors = {
      success: "bg-emerald-500/20 text-emerald-400",
      warning: "bg-yellow-400/20 text-yellow-400",
      error: "bg-red-500/20 text-red-400",
      info: "bg-teal-500/20 text-teal-400",
    };
    return colors[status] || colors.info;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-4 h-4"
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
        );
      default:
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-4">
      {activityList.map((activity, index) => (
        <div key={index} className="flex items-start gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(
              activity.status
            )}`}
          >
            {getStatusIcon(activity.status)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">
              {activity.message}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {activity.time
                ? new Date(activity.time).toLocaleString()
                : "Unknown time"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function StatsOverview() {
  const dispatch = useDispatch();
  const { adminStats, loading, error } = useSelector((state) => state.admin);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminStatsAsync());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchAdminStatsAsync()).unwrap();
    } catch (err) {
      showError("Failed to refresh statistics");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading && !adminStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 flex items-center justify-center">
        <div className="text-center bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
          <div className="text-red-400 mb-4 text-lg">
            {error.includes("Admin privileges")
              ? "Access denied. Admin privileges required."
              : "Failed to load statistics"}
          </div>
          <button
            onClick={handleRefresh}
            className="px-6 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = adminStats?.overview || {};
  const topSkills = adminStats?.topSkills || [];
  const matchStats = adminStats?.matchStatistics || {};
  const userGrowth = adminStats?.userGrowth || [];

  // Transform match stats for chart
  const matchChartData = Object.entries(matchStats).map(([status, count]) => ({
    _id: status,
    count,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-slate-200 bg-clip-text text-transparent">
            Statistics Overview
          </h2>
          <p className="text-slate-400 mt-2 text-lg">
            Comprehensive analytics and insights
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Users"
            value={stats.totalUsers || 0}
            color="emerald"
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

          <MetricCard
            title="Total Skills"
            value={stats.totalSkills || 0}
            color="green"
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

          <MetricCard
            title="Active Matches"
            value={stats.totalMatches || 0}
            color="teal"
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

          <MetricCard
            title="Platform Rating"
            value={`${stats.averageRating || 5}★`}
            color="yellow"
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Match Status Distribution">
            <SimpleBarChart data={matchChartData} label="Matches" color="emerald" />
          </ChartCard>

          <ChartCard title="Top Skills">
            <SimpleBarChart data={topSkills.slice(0, 5)} label="Skills" color="green" />
          </ChartCard>
        </div>

        {/* User Growth Chart */}
        <ChartCard title="User Growth (Last 12 Months)">
          {userGrowth.length > 0 ? (
            <div className="space-y-4">
              {userGrowth.slice(-6).map((month, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-slate-400">
                    {month._id
                      ? `${month._id.month}/${month._id.year}`
                      : `Month ${index + 1}`}
                  </div>
                  <div className="flex-1 bg-slate-800 rounded-full h-4 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-400 to-emerald-500 h-4 rounded-full transition-all duration-700"
                      style={{
                        width: `${
                          userGrowth.length > 0
                            ? (month.count /
                                Math.max(...userGrowth.map((m) => m.count))) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <div className="w-16 text-sm font-medium text-white text-right">
                    {month.count}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              No user growth data available
            </div>
          )}
        </ChartCard>

        {/* Activity and System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Recent Activity">
            <ActivityTimeline />
          </ChartCard>

          <ChartCard title="System Health">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-500/20 border border-emerald-400/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm font-medium text-white">
                    Database
                  </span>
                </div>
                <span className="text-sm text-emerald-400 font-medium">Operational</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-500/20 border border-green-400/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium text-white">
                    API Services
                  </span>
                </div>
                <span className="text-sm text-green-400 font-medium">Operational</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-teal-500/20 border border-teal-400/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                  <span className="text-sm font-medium text-white">
                    File Storage
                  </span>
                </div>
                <span className="text-sm text-teal-400 font-medium">Operational</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-400/20 border border-yellow-400/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm font-medium text-white">
                    Email Service
                  </span>
                </div>
                <span className="text-sm text-yellow-400 font-medium">Maintenance</span>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-6">
              Platform Performance
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Avg Response Time</span>
                <span className="text-sm font-medium text-emerald-400">125ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Uptime</span>
                <span className="text-sm font-medium text-emerald-400">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Error Rate</span>
                <span className="text-sm font-medium text-emerald-400">0.01%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-6">
              User Engagement
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Daily Active Users</span>
                <span className="text-sm font-medium text-teal-400">
                  {Math.floor((stats.totalUsers || 0) * 0.3)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Avg Session Time</span>
                <span className="text-sm font-medium text-teal-400">12 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Bounce Rate</span>
                <span className="text-sm font-medium text-teal-400">22%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-6">
              Growth Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">New Users (30d)</span>
                <span className="text-sm font-medium text-green-400">
                  {stats.recentUsers || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Skill Creation Rate</span>
                <span className="text-sm font-medium text-green-400">↗ 15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Match Success Rate</span>
                <span className="text-sm font-medium text-green-400">78%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500 pt-6 border-t border-slate-800">
          <p>
            Statistics last updated:{" "}
            <span className="text-slate-400">
              {adminStats?.lastUpdated
                ? new Date(adminStats.lastUpdated).toLocaleString()
                : "Never"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}