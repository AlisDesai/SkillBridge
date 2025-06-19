import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "../../redux/slices/authSlice";
import { clearAdminData } from "../../redux/slices/adminSlice";
import { fetchAdminStatsAsync, fetchSystemHealthAsync, fetchUserAnalyticsAsync } from "../../redux/slices/adminSlice";
import { showSuccess, showError } from "../../utils/toast";
import Button from "../common/Button";

const adminLinks = [
  { path: "/admin/dashboard", label: "Dashboard" },
  { path: "/admin/users", label: "User Management" },
  { path: "/admin/reviews", label: "Review Management" },
  { path: "/admin/skills", label: "Skill Management" },
  { path: "/admin/stats", label: "Statistics" },
];

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = async () => {
    try {
      dispatch(clearAdminData());
      dispatch(logout());
      showSuccess("Logged out successfully");
      navigate("/");
    } catch (err) {
      showError("Failed to logout");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(fetchAdminStatsAsync()).unwrap(),
        dispatch(fetchSystemHealthAsync()).unwrap(),
        dispatch(fetchUserAnalyticsAsync()).unwrap(),
      ]);
      showSuccess("Dashboard refreshed successfully");
    } catch (err) {
      showError("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <header className="bg-gradient-to-r from-gray-900/95 via-slate-900/95 to-gray-950/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Navigation Links */}
          <nav className="flex items-center justify-center gap-8 flex-1">
            {adminLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 text-emerald-400"
                      : "text-slate-300 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 hover:text-emerald-400 hover:border hover:border-emerald-400/20"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="group relative bg-gradient-to-br from-emerald-500/25 via-green-500/20 to-teal-600/25 border-emerald-400/40 text-emerald-300 hover:from-emerald-500/40 hover:via-green-500/30 hover:to-teal-600/40 hover:border-emerald-400/60 hover:text-emerald-200 transition-all duration-300 px-6 py-3 font-medium"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-teal-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2">
                {refreshing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300"
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
                    <span>Refresh</span>
                  </>
                )}
              </div>
            </Button>

            <Button 
              variant="danger" 
              onClick={handleLogout}
              className="group relative bg-gradient-to-br from-red-500/30 via-red-600/25 to-red-700/30 border-red-400/50 text-red-300 hover:from-red-500/50 hover:via-red-600/40 hover:to-red-700/50 hover:border-red-400/70 hover:text-red-200 transition-all duration-300 px-6 py-3 font-medium"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-red-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2">
                <svg
                  className="w-4 h-4 transition-transform group-hover:scale-110 duration-300"
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
                <span>Logout</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
} 