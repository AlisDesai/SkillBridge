import { useState } from "react";

const existingReviews = [
  {
    name: "Rahul Verma",
    comment: "Fantastic session on MERN stack!",
    rating: 5,
  },
  { name: "Sneha Roy", comment: "Very helpful and patient mentor.", rating: 4 },
];

export default function ReviewsPage() {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-semibold text-gray-800">Reviews</h2>

      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <textarea
          placeholder="Write your review..."
          rows={4}
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
          <button className="px-6 py-2 bg-[#FF7A59] text-white rounded-xl hover:bg-[#e76745]">
            Submit Review
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {existingReviews.map((rev, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow flex justify-between"
          >
            <div>
              <p className="font-semibold text-gray-800">{rev.name}</p>
              <p className="text-gray-500 text-sm mt-1">{rev.comment}</p>
            </div>
            <span className="text-[#FF7A59] font-bold">{rev.rating}★</span>
          </div>
        ))}
      </div>
    </div>
  );
}
