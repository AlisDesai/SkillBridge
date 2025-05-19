import { useEffect, useState } from "react";
import api from "../utils/api";
import { showError } from "../utils/toast";

export default function ProgressPage() {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get("/progress");
        setProgressData(res.data || []);
      } catch (err) {
        showError("Failed to load progress data");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-semibold text-gray-800">
        Learning Progress
      </h2>

      {loading ? (
        <p className="text-gray-400">Loading progress...</p>
      ) : !progressData.length ? (
        <p className="text-gray-400">No progress data available.</p>
      ) : (
        <div className="space-y-4">
          {progressData.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow p-4">
              <p className="font-medium text-gray-700 mb-2">{item.title}</p>
              <div className="w-full h-4 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-[#34D399] rounded-full transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {item.progress}% Complete
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
