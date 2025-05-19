import { useEffect, useState } from "react";
import api from "../utils/api";
import { useSelector } from "react-redux";

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/users/dashboard-stats");
        setStats(res.data);
      } catch (err) {
        setStats({
          matches: 0,
          skills: 0,
          pending: 0,
          completed: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Matches", value: stats?.matches ?? 0 },
    { label: "Skills Offered", value: stats?.skills ?? 0 },
    { label: "Pending Requests", value: stats?.pending ?? 0 },
    { label: "Completed Sessions", value: stats?.completed ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        Welcome back, {user?.name?.split(" ")[0]}!
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition"
          >
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-[#4A6FFF] mt-1">
              {loading ? "..." : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 h-64">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Messages
          </h3>
          <p className="text-gray-400">Coming soon...</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 h-64">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Upcoming Sessions
          </h3>
          <p className="text-gray-400">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}
