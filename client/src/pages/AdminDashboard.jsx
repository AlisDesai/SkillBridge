import { useEffect, useState } from "react";
import api from "../utils/api";
import { showError } from "../utils/toast";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data || {});
      } catch {
        showError("Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const cards = [
    { label: "Total Users", value: stats.users },
    { label: "Total Skills", value: stats.skills },
    { label: "Total Matches", value: stats.matches },
    { label: "Pending Reviews", value: stats.pendingReviews },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Admin Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-5 rounded-2xl shadow border hover:shadow-md transition"
          >
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-[#4A6FFF] mt-1">
              {loading ? "..." : stat.value ?? 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
