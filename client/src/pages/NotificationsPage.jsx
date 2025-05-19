import { useEffect, useState } from "react";
import api from "../utils/api";
import { showError } from "../utils/toast";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data || []);
    } catch {
      showError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : !notifications.length ? (
          <p className="text-gray-400">No notifications.</p>
        ) : (
          notifications.map((note) => (
            <div
              key={note._id}
              className="flex justify-between items-center border-b pb-3 last:border-none"
            >
              <p className="text-gray-700">{note.message}</p>
              <span className="text-sm text-gray-400">{note.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
