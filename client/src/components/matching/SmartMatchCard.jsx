// /client/src/components/matching/SmartMatchCard.jsx

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Eye,
  MapPin,
  Clock,
  Star,
  Zap,
  Users,
  BookOpen,
} from "lucide-react";
import CompatibilityScore from "./CompatibilityScore";
import MatchReasons from "./MatchReasons";
import {
  likeMatch,
  rejectMatch,
  markMatchAsViewed,
  createMatchRequest,
} from "../../redux/slices/smartMatchSlice";

const SmartMatchCard = ({
  match,
  onViewProfile,
  onSendMessage,
  showInsights = false,
  className = "",
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isViewed, setIsViewed] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    user,
    compatibilityScore,
    matchType,
    reasons,
    confidence,
    breakdown,
  } = match;

  // Get match type styling
  const getMatchTypeStyle = (type) => {
    const styles = {
      perfect_match: {
        gradient: "from-emerald-500 to-teal-500",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        border: "border-emerald-200 dark:border-emerald-700",
        text: "text-emerald-700 dark:text-emerald-300",
        icon: "✨",
      },
      skill_complement: {
        gradient: "from-blue-500 to-cyan-500",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-200 dark:border-blue-700",
        text: "text-blue-700 dark:text-blue-300",
        icon: "🎯",
      },
      mutual_learning: {
        gradient: "from-purple-500 to-pink-500",
        bg: "bg-purple-50 dark:bg-purple-900/20",
        border: "border-purple-200 dark:border-purple-700",
        text: "text-purple-700 dark:text-purple-300",
        icon: "🤝",
      },
      potential_match: {
        gradient: "from-gray-500 to-slate-500",
        bg: "bg-gray-50 dark:bg-gray-900/20",
        border: "border-gray-200 dark:border-gray-700",
        text: "text-gray-700 dark:text-gray-300",
        icon: "💡",
      },
    };
    return styles[type] || styles.potential_match;
  };

  const matchStyle = getMatchTypeStyle(matchType);

  // Handle Connect button click - redirect to user detail page
  const handleConnect = () => {
    navigate(`/user/${user._id}`);
  };

  // Handle card interactions
  const handleLike = async (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    dispatch(likeMatch(user._id));

    // Optional: Auto-send match request on like
    if (!isLiked) {
      try {
        setLoading(true);
        await dispatch(
          createMatchRequest({
            receiverId: user._id,
            message: `Hi! I'd love to learn from your expertise. Let's exchange skills!`,
            skillsInvolved: {
              offering: user.skillsWanted?.slice(0, 2) || [],
              requesting: user.skillsOffered?.slice(0, 2) || [],
            },
          })
        );
      } catch (error) {
        console.error("Error sending match request:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReject = (e) => {
    e.stopPropagation();
    dispatch(rejectMatch(user._id));
  };

  const handleView = () => {
    if (!isViewed) {
      setIsViewed(true);
      dispatch(markMatchAsViewed(user._id));
    }
    onViewProfile?.(user);
  };

  const handleMessage = (e) => {
    e.stopPropagation();
    onSendMessage?.(user);
  };

  // Format skills for display
  const formatSkills = (skills = []) => {
    return (
      skills
        .slice(0, 3)
        .map((skill) => skill.name || skill)
        .join(", ") + (skills.length > 3 ? ` +${skills.length - 3} more` : "")
    );
  };

  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 
                     hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 
                     hover:shadow-xl hover:shadow-emerald-500/10 ${className}`}
    >
      {/* Match Type Badge */}
      <div
        className={`absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-bold 
                       bg-gradient-to-r ${matchStyle.gradient} text-white shadow-lg z-10`}
      >
        {matchStyle.icon} {matchType.replace("_", " ").toUpperCase()}
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            <div className="relative">
              <img
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`
                }
                alt={user.name}
                className="w-16 h-16 rounded-xl object-cover ring-2 ring-emerald-100 dark:ring-emerald-800"
              />
              {user.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {user.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {user.experienceLevel || "Intermediate"} •{" "}
                {user.totalReviews || 0} reviews
              </p>

              {/* Location & Rating */}
              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                {user.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{user.location.city || "Remote"}</span>
                  </div>
                )}
                {user.averageRating > 0 && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{user.averageRating.toFixed(1)}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {user.lastActive ? "Active recently" : "New user"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Compatibility Score */}
          <CompatibilityScore
            score={compatibilityScore}
            confidence={confidence}
            size="lg"
          />
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {user.bio}
          </p>
        )}

        {/* Skills Section */}
        <div className="space-y-3 mb-4">
          {/* Skills They Offer */}
          {user.skillsOffered?.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Can Teach
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {user.skillsOffered.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 
                               text-xs rounded-lg font-medium"
                  >
                    {skill.name || skill}
                  </span>
                ))}
                {user.skillsOffered.length > 4 && (
                  <span
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 
                                   text-xs rounded-lg"
                  >
                    +{user.skillsOffered.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Skills They Want */}
          {user.skillsWanted?.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Wants to Learn
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {user.skillsWanted.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 
                               text-xs rounded-lg font-medium"
                  >
                    {skill.name || skill}
                  </span>
                ))}
                {user.skillsWanted.length > 4 && (
                  <span
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 
                                   text-xs rounded-lg"
                  >
                    +{user.skillsWanted.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Match Reasons */}
        {reasons?.length > 0 && (
          <MatchReasons
            reasons={reasons}
            className="mb-4"
            showAll={isExpanded}
          />
        )}

        {/* Insights Toggle */}
        {showInsights && breakdown && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 
                       dark:hover:text-emerald-300 font-medium mb-4 flex items-center space-x-1"
          >
            <span>{isExpanded ? "Hide" : "Show"} Match Details</span>
            <svg
              className={`w-4 h-4 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}

        {/* Expanded Insights */}
        {isExpanded && breakdown && (
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Compatibility Breakdown
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {Object.entries(breakdown).map(([factor, data]) => (
                <div key={factor} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 capitalize">
                    {factor.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span
                    className={`font-medium ${
                      data.raw > 0.7
                        ? "text-green-600"
                        : data.raw > 0.4
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }`}
                  >
                    {Math.round(data.raw * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connect Button - Full Width */}
        <button
          onClick={handleConnect}
          className="w-full px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 
                     bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 
                     text-white hover:scale-105 active:scale-95"
        >
          <div className="flex items-center justify-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Connect</span>
          </div>
        </button>
      </div>

      {/* Hover Effects */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-2xl 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      ></div>
    </div>
  );
};

export default SmartMatchCard;
