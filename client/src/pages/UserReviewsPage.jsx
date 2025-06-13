import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearReviews } from "../redux/slices/reviewSlice";
import ReviewList from "../components/reviews/ReviewList";
import api from "../utils/api";

export default function UserReviewsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useParams(); // If you want to use URL params instead
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get userId from state or params
  const targetUserId = location.state?.userId || userId;

  useEffect(() => {
    if (!targetUserId) {
      navigate("/dashboard");
      return;
    }

    // Clear previous reviews when component mounts
    dispatch(clearReviews());

    // Fetch user details
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${targetUserId}`);
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [targetUserId, navigate, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-[#4A6FFF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">User not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-[#4A6FFF] hover:text-[#3A5FEF] font-medium mb-4"
      >
        ← Back
      </button>

      {/* User Header */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#4A6FFF] to-[#7C3AED] rounded-full flex items-center justify-center text-white text-xl font-semibold">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Reviews for {user.name}
            </h1>
            <p className="text-gray-600">
              See what others are saying about their experience
            </p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <ReviewList
          userId={targetUserId}
          showActions={false}
          showTitle={false}
          limit={10}
        />
      </div>
    </div>
  );
}
