import { useEffect, useState } from "react";
import api from "../../utils/api";
import { showError } from "../../utils/toast";

export default function ReviewList({ matchId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/${matchId}`);
      setReviews(res.data || []);
    } catch (err) {
      showError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [matchId]);

  if (loading) return <p className="text-gray-400">Loading reviews...</p>;
  if (!reviews.length) return <p className="text-gray-400">No reviews yet.</p>;

  return (
    <div className="space-y-4">
      {reviews.map((rev, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-xl shadow flex justify-between items-start"
        >
          <div>
            <p className="font-semibold text-gray-800">{rev.reviewerName}</p>
            <p className="text-gray-600 text-sm mt-1">{rev.comment}</p>
          </div>
          <span className="text-[#FF7A59] font-bold">{rev.rating}★</span>
        </div>
      ))}
    </div>
  );
}
