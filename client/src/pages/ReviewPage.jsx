import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../utils/api";
import { showError, showSuccess } from "../utils/toast";
import Button from "../components/common/Button";

export default function ReviewPage() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [review, setReview] = useState({
    rating: 5,
    comment: "",
    skillDelivered: true,
    wouldRecommend: true,
    teachingQuality: 5,
    communication: 5,
    reliability: 5,
  });

  useEffect(() => {
    fetchMatch();
  }, [matchId]);

  const fetchMatch = async () => {
    try {
      const response = await api.get(`/matches/${matchId}`);
      const matchData = response.data.data;

      if (matchData.status !== "completed") {
        showError("Can only review completed matches");
        navigate("/matches");
        return;
      }

      setMatch(matchData);
    } catch (err) {
      showError("Failed to load match details");
      navigate("/matches");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!review.comment.trim()) {
      showError("Please write a comment about your experience");
      return;
    }

    setSubmitting(true);

    try {
      await api.post(`/matches/${matchId}/review`, {
        ...review,
        reviewee: otherUser._id,
      });

      showSuccess("Review submitted successfully!");
      navigate("/matches");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Loading review form...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 flex items-center justify-center">
        <div className="text-center bg-slate-900/50 border border-slate-800 rounded-2xl p-12">
          <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Match Not Found</h2>
          <p className="text-slate-400">The requested match could not be found.</p>
        </div>
      </div>
    );
  }

  const otherUser =
    match.requester._id === user._id ? match.receiver : match.requester;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"></div>
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <span className="text-4xl font-bold text-white relative z-10">
                {otherUser.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-emerald-200 to-green-200 bg-clip-text text-transparent mb-4">
            Rate Your Experience
          </h1>
          <p className="text-2xl text-slate-400 mb-2">with {otherUser.name}</p>
          <p className="text-lg text-slate-500">Help others discover great skill partners</p>
        </div>

        {/* Skills Exchange Summary */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-slate-900/30 border border-slate-800/50 rounded-3xl p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-center text-white mb-8">Skills Exchange Summary</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-2xl p-6 mb-4">
                  <div className="w-16 h-16 bg-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-emerald-400 mb-2">You Learned</h3>
                  <p className="text-2xl font-bold text-white">{match.skillRequested}</p>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-teal-500/20 border border-teal-400/30 rounded-2xl p-6 mb-4">
                  <div className="w-16 h-16 bg-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-teal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-teal-400 mb-2">You Taught</h3>
                  <p className="text-2xl font-bold text-white">{match.skillOffered}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmitReview} className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            {/* Left Column - Ratings */}
            <div className="space-y-8">
              {/* Overall Rating */}
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-8 backdrop-blur-xl">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-white mb-2">Overall Rating</h3>
                  <p className="text-slate-400 mb-8">How was your overall experience?</p>
                  
                  <div className="flex justify-center gap-4 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReview((prev) => ({ ...prev, rating: star }))}
                        className={`text-6xl transition-all duration-300 transform hover:scale-110 ${
                          star <= review.rating 
                            ? "text-yellow-400 drop-shadow-lg" 
                            : "text-slate-700 hover:text-slate-600"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-2xl p-4">
                    <span className="text-2xl font-bold text-white">
                      {review.rating} out of 5 stars
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Ratings */}
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-8 backdrop-blur-xl">
                <h3 className="text-2xl font-bold text-white text-center mb-8">Detailed Ratings</h3>
                
                <div className="space-y-6">
                  {/* Teaching Quality */}
                  <div className="bg-slate-800/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-white">Teaching Quality</span>
                      <span className="text-sm text-slate-400">{review.teachingQuality}/5</span>
                    </div>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setReview((prev) => ({ ...prev, teachingQuality: star }))
                          }
                          className={`text-3xl transition-all duration-200 hover:scale-110 ${
                            star <= review.teachingQuality ? "text-yellow-400" : "text-slate-600"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Communication */}
                  <div className="bg-slate-800/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-white">Communication</span>
                      <span className="text-sm text-slate-400">{review.communication}/5</span>
                    </div>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setReview((prev) => ({ ...prev, communication: star }))
                          }
                          className={`text-3xl transition-all duration-200 hover:scale-110 ${
                            star <= review.communication ? "text-yellow-400" : "text-slate-600"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reliability */}
                  <div className="bg-slate-800/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-white">Reliability</span>
                      <span className="text-sm text-slate-400">{review.reliability}/5</span>
                    </div>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setReview((prev) => ({ ...prev, reliability: star }))
                          }
                          className={`text-3xl transition-all duration-200 hover:scale-110 ${
                            star <= review.reliability ? "text-yellow-400" : "text-slate-600"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Comments & Questions */}
            <div className="space-y-8">
              {/* Written Review */}
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-8 backdrop-blur-xl">
                <h3 className="text-2xl font-bold text-white mb-2">Share Your Experience</h3>
                <p className="text-slate-400 mb-6">Tell others about your learning journey</p>
                
                <textarea
                  value={review.comment}
                  onChange={(e) =>
                    setReview((prev) => ({ ...prev, comment: e.target.value }))
                  }
                  placeholder="Describe your experience... What did you learn? How was the teaching style? Would you exchange skills with this person again?"
                  rows={8}
                  className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent resize-none text-lg leading-relaxed"
                  required
                />
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-slate-500">Minimum 10 characters</span>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    review.comment.length >= 10 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {review.comment.length}/10
                  </span>
                </div>
              </div>

              {/* Quick Questions */}
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-8 backdrop-blur-xl">
                <h3 className="text-2xl font-bold text-white text-center mb-8">Quick Questions</h3>
                
                <div className="space-y-6">
                  <div className="bg-slate-800/50 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-white text-center mb-6">
                      Did they deliver the skill as promised?
                    </h4>
                    <div className="flex justify-center gap-8">
                      <label className="group cursor-pointer">
                        <input
                          type="radio"
                          name="skillDelivered"
                          checked={review.skillDelivered === true}
                          onChange={() =>
                            setReview((prev) => ({ ...prev, skillDelivered: true }))
                          }
                          className="sr-only"
                        />
                        <div className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 ${
                          review.skillDelivered === true
                            ? 'bg-emerald-500/20 border-2 border-emerald-400'
                            : 'bg-slate-700/50 border-2 border-transparent hover:bg-slate-700'
                        }`}>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            review.skillDelivered === true
                              ? 'border-emerald-400 bg-emerald-400'
                              : 'border-slate-500'
                          }`}>
                            {review.skillDelivered === true && (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-lg font-semibold text-emerald-400">Yes</span>
                        </div>
                      </label>
                      
                      <label className="group cursor-pointer">
                        <input
                          type="radio"
                          name="skillDelivered"
                          checked={review.skillDelivered === false}
                          onChange={() =>
                            setReview((prev) => ({ ...prev, skillDelivered: false }))
                          }
                          className="sr-only"
                        />
                        <div className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 ${
                          review.skillDelivered === false
                            ? 'bg-red-500/20 border-2 border-red-400'
                            : 'bg-slate-700/50 border-2 border-transparent hover:bg-slate-700'
                        }`}>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            review.skillDelivered === false
                              ? 'border-red-400 bg-red-400'
                              : 'border-slate-500'
                          }`}>
                            {review.skillDelivered === false && (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                          <span className="text-lg font-semibold text-red-400">No</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-white text-center mb-6">
                      Would you recommend them to others?
                    </h4>
                    <div className="flex justify-center gap-8">
                      <label className="group cursor-pointer">
                        <input
                          type="radio"
                          name="wouldRecommend"
                          checked={review.wouldRecommend === true}
                          onChange={() =>
                            setReview((prev) => ({ ...prev, wouldRecommend: true }))
                          }
                          className="sr-only"
                        />
                        <div className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 ${
                          review.wouldRecommend === true
                            ? 'bg-emerald-500/20 border-2 border-emerald-400'
                            : 'bg-slate-700/50 border-2 border-transparent hover:bg-slate-700'
                        }`}>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            review.wouldRecommend === true
                              ? 'border-emerald-400 bg-emerald-400'
                              : 'border-slate-500'
                          }`}>
                            {review.wouldRecommend === true && (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-lg font-semibold text-emerald-400">Yes</span>
                        </div>
                      </label>
                      
                      <label className="group cursor-pointer">
                        <input
                          type="radio"
                          name="wouldRecommend"
                          checked={review.wouldRecommend === false}
                          onChange={() =>
                            setReview((prev) => ({ ...prev, wouldRecommend: false }))
                          }
                          className="sr-only"
                        />
                        <div className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 ${
                          review.wouldRecommend === false
                            ? 'bg-red-500/20 border-2 border-red-400'
                            : 'bg-slate-700/50 border-2 border-transparent hover:bg-slate-700'
                        }`}>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            review.wouldRecommend === false
                              ? 'border-red-400 bg-red-400'
                              : 'border-slate-500'
                          }`}>
                            {review.wouldRecommend === false && (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                          <span className="text-lg font-semibold text-red-400">No</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="mt-16 text-center">
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-8 backdrop-blur-xl">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to submit your review?</h3>
              <p className="text-slate-400 mb-8">Your feedback helps build a better skill-sharing community</p>
              
              <div className="flex justify-center gap-6">
                <button
                  type="button"
                  onClick={() => navigate("/matches")}
                  disabled={submitting}
                  className="px-8 py-4 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-2xl hover:bg-slate-700/50 disabled:opacity-50 transition-all duration-200 text-lg font-medium"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={submitting || review.comment.length < 10}
                  className="relative px-12 py-4 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 text-white rounded-2xl hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg font-bold overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <div className="relative flex items-center gap-3">
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Publishing Review...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Submit Review
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}