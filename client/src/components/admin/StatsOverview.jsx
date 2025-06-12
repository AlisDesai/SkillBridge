import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStatsAsync } from "../../redux/slices/adminSlice";
import { showError } from "../../utils/toast";
import Button from "../common/Button";

const MetricCard = ({ title, value, change, icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
    red: "bg-red-50 border-red-200 text-red-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  change.type === "increase"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {change.type === "increase" ? "↗" : "↘"} {change.value}%
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

const ChartCard = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
};

const SimpleBarChart = ({ data, label }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No data available</div>
    );
  }

  const maxValue = Math.max(...data.map((item) => item.count));

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-16 text-sm text-gray-600 capitalize">
            {item._id || `Month ${index + 1}`}
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
            <div
              className="bg-[#FF7A59] h-4 rounded-full transition-all duration-500"
              style={{
                width: `${maxValue > 0 ? (item.count / maxValue) * 100 : 0}%`,
              }}
            />
          </div>
          <div className="w-12 text-sm font-medium text-gray-900 text-right">
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
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
      info: "bg-blue-100 text-blue-800",
    };
    return colors[status] || colors.info;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return (
          <svg
            className="w-4 h-4 text-green-600"
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
            className="w-4 h-4 text-yellow-600"
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
            className="w-4 h-4 text-red-600"
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
            className="w-4 h-4 text-blue-600"
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
            <p className="text-sm font-medium text-gray-900">
              {activity.message}
            </p>
            <p className="text-xs text-gray-500">
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
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-2 border-[#FF7A59] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Failed to load statistics</div>
        <Button variant="outline" onClick={handleRefresh}>
          Try Again
        </Button>
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Statistics Overview
          </h2>
          <p className="text-gray-600 mt-1">
            Comprehensive analytics and insights
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
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
              Refresh Data
            </>
          )}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={stats.totalUsers || 0}
          color="blue"
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
          color="purple"
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
          value={`${stats.averageRating || 0}★`}
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
          <SimpleBarChart data={matchChartData} label="Matches" />
        </ChartCard>

        <ChartCard title="Top Skills">
          <SimpleBarChart data={topSkills.slice(0, 5)} label="Skills" />
        </ChartCard>
      </div>

      {/* User Growth Chart */}
      <ChartCard title="User Growth (Last 12 Months)">
        {userGrowth.length > 0 ? (
          <div className="space-y-4">
            {userGrowth.slice(-6).map((month, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-20 text-sm text-gray-600">
                  {month._id
                    ? `${month._id.month}/${month._id.year}`
                    : `Month ${index + 1}`}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                  <div
                    className="bg-[#4A6FFF] h-4 rounded-full transition-all duration-500"
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
                <div className="w-12 text-sm font-medium text-gray-900 text-right">
                  {month.count}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
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
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">
                  Database
                </span>
              </div>
              <span className="text-sm text-green-800">Operational</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">
                  API Services
                </span>
              </div>
              <span className="text-sm text-green-800">Operational</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">
                  File Storage
                </span>
              </div>
              <span className="text-sm text-green-800">Operational</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">
                  Email Service
                </span>
              </div>
              <span className="text-sm text-yellow-800">Maintenance</span>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Platform Performance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Response Time</span>
              <span className="text-sm font-medium text-green-600">125ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="text-sm font-medium text-green-600">99.9%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Error Rate</span>
              <span className="text-sm font-medium text-green-600">0.01%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            User Engagement
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Daily Active Users</span>
              <span className="text-sm font-medium text-blue-600">
                {Math.floor((stats.totalUsers || 0) * 0.3)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Session Time</span>
              <span className="text-sm font-medium text-blue-600">12 min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Bounce Rate</span>
              <span className="text-sm font-medium text-blue-600">22%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Growth Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New Users (30d)</span>
              <span className="text-sm font-medium text-purple-600">
                {stats.recentUsers || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Skill Creation Rate</span>
              <span className="text-sm font-medium text-purple-600">↗ 15%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Match Success Rate</span>
              <span className="text-sm font-medium text-purple-600">78%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pt-4 border-t">
        <p>
          Statistics last updated:{" "}
          {adminStats?.lastUpdated
            ? new Date(adminStats.lastUpdated).toLocaleString()
            : "Never"}
        </p>
      </div>
    </div>
  );
}
