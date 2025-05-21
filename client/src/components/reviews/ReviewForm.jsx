import { useState } from "react";
import { showError, showSuccess } from "../../utils/toast";
import api from "../../utils/api";
import Button from "../common/Button";

export default function ReviewForm({ matchId, onSuccess }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!review || !rating) return;

    setLoading(true);
    try {
      await api.post("/reviews", { matchId, review, rating });
      showSuccess("Review submitted");
      setReview("");
      setRating(5);
      onSuccess?.(); // refresh reviews
    } catch (err) {
      showError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      <textarea
        rows="4"
        placeholder="Write your review..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#FF7A59]"
      />
      <div className="flex items-center gap-4">
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#FF7A59]"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Star{r > 1 ? "s" : ""}
            </option>
          ))}
        </select>
        <Button variant="secondary" disabled={loading} onClick={handleSubmit}>
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </div>
  );
}
