// /client/src/components/matching/MatchReasons.jsx

import React, { useState } from "react";
import {
  BookOpen,
  Users,
  MapPin,
  Clock,
  Star,
  Zap,
  Target,
  Heart,
  Award,
  TrendingUp,
  CheckCircle,
  Info,
  Eye,
} from "lucide-react";

const MatchReasons = ({
  reasons = [],
  showAll = false,
  maxVisible = 2,
  className = "",
  variant = "default", // 'default', 'compact', 'detailed'
}) => {
  const [expanded, setExpanded] = useState(showAll);

  // Icon mapping for different reason types
  const getReasonIcon = (reason) => {
    const reasonLower = reason.toLowerCase();

    if (
      reasonLower.includes("skill") ||
      reasonLower.includes("teach") ||
      reasonLower.includes("learn")
    ) {
      return BookOpen;
    }
    if (reasonLower.includes("experience") || reasonLower.includes("level")) {
      return TrendingUp;
    }
    if (
      reasonLower.includes("location") ||
      reasonLower.includes("city") ||
      reasonLower.includes("meet")
    ) {
      return MapPin;
    }
    if (
      reasonLower.includes("time") ||
      reasonLower.includes("schedule") ||
      reasonLower.includes("availability")
    ) {
      return Clock;
    }
    if (
      reasonLower.includes("rating") ||
      reasonLower.includes("review") ||
      reasonLower.includes("reputation")
    ) {
      return Star;
    }
    if (
      reasonLower.includes("mutual") ||
      reasonLower.includes("exchange") ||
      reasonLower.includes("both")
    ) {
      return Users;
    }
    if (reasonLower.includes("active") || reasonLower.includes("online")) {
      return Zap;
    }
    if (reasonLower.includes("success") || reasonLower.includes("similar")) {
      return Award;
    }
    if (
      reasonLower.includes("communication") ||
      reasonLower.includes("personality")
    ) {
      return Heart;
    }

    return Target; // Default icon
  };

  // Color mapping for different reason types
  const getReasonStyle = (reason, index) => {
    const colors = [
      {
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        text: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-200 dark:border-emerald-700",
        icon: "text-emerald-600 dark:text-emerald-400",
      },
      {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        text: "text-blue-700 dark:text-blue-300",
        border: "border-blue-200 dark:border-blue-700",
        icon: "text-blue-600 dark:text-blue-400",
      },
      {
        bg: "bg-purple-50 dark:bg-purple-900/20",
        text: "text-purple-700 dark:text-purple-300",
        border: "border-purple-200 dark:border-purple-700",
        icon: "text-purple-600 dark:text-purple-400",
      },
      {
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        text: "text-yellow-700 dark:text-yellow-300",
        border: "border-yellow-200 dark:border-yellow-700",
        icon: "text-yellow-600 dark:text-yellow-400",
      },
      {
        bg: "bg-pink-50 dark:bg-pink-900/20",
        text: "text-pink-700 dark:text-pink-300",
        border: "border-pink-200 dark:border-pink-700",
        icon: "text-pink-600 dark:text-pink-400",
      },
      {
        bg: "bg-indigo-50 dark:bg-indigo-900/20",
        text: "text-indigo-700 dark:text-indigo-300",
        border: "border-indigo-200 dark:border-indigo-700",
        icon: "text-indigo-600 dark:text-indigo-400",
      },
    ];

    return colors[index % colors.length];
  };

  const visibleReasons = expanded ? reasons : reasons.slice(0, maxVisible);
  const hasMore = reasons.length > maxVisible;

  if (!reasons.length) {
    return null;
  }

  // Compact variant - just icons with tooltips
  if (variant === "compact") {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="flex items-center space-x-1">
          {visibleReasons.map((reason, index) => {
            const IconComponent = getReasonIcon(reason);
            const style = getReasonStyle(reason, index);

            return (
              <div
                key={index}
                className={`p-1.5 rounded-lg ${style.bg} ${style.border} border group relative`}
                title={reason}
              >
                <IconComponent className={`w-4 h-4 ${style.icon}`} />

                {/* Tooltip */}
                <div
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                                px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 
                                group-hover:opacity-100 transition-opacity duration-200 
                                pointer-events-none whitespace-nowrap z-10"
                >
                  {reason}
                  <div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 
                                  border-4 border-transparent border-t-gray-900"
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {hasMore && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 
                       dark:hover:text-gray-300 transition-colors"
          >
            +{reasons.length - maxVisible} more
          </button>
        )}
      </div>
    );
  }

  // Detailed variant - full cards with descriptions
  if (variant === "detailed") {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center space-x-2 mb-2">
          <Info className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Why this is a great match:
          </span>
        </div>

        <div className="space-y-2">
          {visibleReasons.map((reason, index) => {
            const IconComponent = getReasonIcon(reason);
            const style = getReasonStyle(reason, index);

            return (
              <div
                key={index}
                className={`p-3 rounded-lg ${style.bg} ${style.border} border transition-all duration-200 hover:scale-[1.01]`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-full ${style.bg} ${style.icon} flex-shrink-0`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm ${style.text} leading-relaxed font-medium`}
                    >
                      {reason}
                    </p>
                  </div>
                  <CheckCircle
                    className={`w-5 h-5 ${style.icon} flex-shrink-0 mt-0.5`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {hasMore && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 
                       dark:hover:text-emerald-300 font-medium flex items-center space-x-1 
                       transition-colors"
          >
            <span>Show {reasons.length - maxVisible} more reasons</span>
            <svg
              className="w-4 h-4"
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

        {expanded && hasMore && (
          <button
            onClick={() => setExpanded(false)}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 
                       dark:hover:text-gray-300 font-medium flex items-center space-x-1 
                       transition-colors"
          >
            <span>Show less</span>
            <svg
              className="w-4 h-4 transform rotate-180"
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
      </div>
    );
  }

  // Default variant - simple list with icons
  return (
    <div className={`${className}`}>
      <div className="space-y-2">
        {visibleReasons.map((reason, index) => {
          const IconComponent = getReasonIcon(reason);
          const style = getReasonStyle(reason, index);

          return (
            <div
              key={index}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${style.bg} 
                          ${style.border} border transition-all duration-200 hover:shadow-sm hover:scale-[1.01]`}
            >
              <IconComponent
                className={`w-4 h-4 ${style.icon} flex-shrink-0`}
              />
              <span className={`text-sm ${style.text} font-medium`}>
                {reason}
              </span>
            </div>
          );
        })}
      </div>

      {hasMore && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 
                     dark:hover:text-gray-300 transition-colors flex items-center space-x-1"
        >
          <Eye className="w-3 h-3" />
          <span>Show {reasons.length - maxVisible} more reasons</span>
          <svg
            className="w-3 h-3"
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

      {expanded && hasMore && (
        <button
          onClick={() => setExpanded(false)}
          className="mt-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 
                     dark:hover:text-gray-300 transition-colors flex items-center space-x-1"
        >
          <Eye className="w-3 h-3" />
          <span>Show less</span>
          <svg
            className="w-3 h-3 transform rotate-180"
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
    </div>
  );
};

// Quick reasons summary component
export const MatchReasonsSummary = ({ reasons = [], className = "" }) => {
  const topReasons = reasons.slice(0, 3);

  const getReasonIcon = (reason) => {
    const reasonLower = reason.toLowerCase();

    if (
      reasonLower.includes("skill") ||
      reasonLower.includes("teach") ||
      reasonLower.includes("learn")
    ) {
      return BookOpen;
    }
    if (reasonLower.includes("experience") || reasonLower.includes("level")) {
      return TrendingUp;
    }
    if (
      reasonLower.includes("location") ||
      reasonLower.includes("city") ||
      reasonLower.includes("meet")
    ) {
      return MapPin;
    }
    if (
      reasonLower.includes("time") ||
      reasonLower.includes("schedule") ||
      reasonLower.includes("availability")
    ) {
      return Clock;
    }
    if (
      reasonLower.includes("rating") ||
      reasonLower.includes("review") ||
      reasonLower.includes("reputation")
    ) {
      return Star;
    }
    if (
      reasonLower.includes("mutual") ||
      reasonLower.includes("exchange") ||
      reasonLower.includes("both")
    ) {
      return Users;
    }
    if (reasonLower.includes("active") || reasonLower.includes("online")) {
      return Zap;
    }
    if (reasonLower.includes("success") || reasonLower.includes("similar")) {
      return Award;
    }
    if (
      reasonLower.includes("communication") ||
      reasonLower.includes("personality")
    ) {
      return Heart;
    }

    return Target; // Default icon
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Great for:
      </span>
      {topReasons.map((reason, index) => {
        const IconComponent = getReasonIcon(reason);
        return (
          <IconComponent
            key={index}
            className="w-3 h-3 text-emerald-600 dark:text-emerald-400"
            title={reason}
          />
        );
      })}
      {reasons.length > 3 && (
        <span className="text-xs text-gray-400">+{reasons.length - 3}</span>
      )}
    </div>
  );
};

// Reasons filter component
export const ReasonsFilter = ({
  reasons = [],
  selectedCategories = [],
  onCategoryChange,
  className = "",
}) => {
  const categories = [
    { key: "skill", label: "Skills", icon: BookOpen },
    { key: "experience", label: "Experience", icon: TrendingUp },
    { key: "location", label: "Location", icon: MapPin },
    { key: "time", label: "Availability", icon: Clock },
    { key: "rating", label: "Reputation", icon: Star },
    { key: "mutual", label: "Mutual Interest", icon: Users },
  ];

  const getCategoryCount = (category) => {
    return reasons.filter((reason) =>
      reason.toLowerCase().includes(category.key)
    ).length;
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((category) => {
        const count = getCategoryCount(category);
        const isSelected = selectedCategories.includes(category.key);
        const IconComponent = category.icon;

        if (count === 0) return null;

        return (
          <button
            key={category.key}
            onClick={() => onCategoryChange?.(category.key)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium 
                        transition-all duration-200 ${
                          isSelected
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
          >
            <IconComponent className="w-3 h-3" />
            <span>{category.label}</span>
            <span
              className={`px-1 py-0.5 rounded text-xs ${
                isSelected
                  ? "bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// Reasons stats component
export const ReasonsStats = ({ matches = [], className = "" }) => {
  const allReasons = matches.flatMap((match) => match.reasons || []);
  const reasonCounts = {};

  allReasons.forEach((reason) => {
    reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
  });

  const topReasons = Object.entries(reasonCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 ${className}`}>
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Top Match Reasons
      </h4>
      <div className="space-y-2">
        {topReasons.map(([reason, count], index) => (
          <div key={reason} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  index === 0
                    ? "bg-emerald-500"
                    : index === 1
                    ? "bg-blue-500"
                    : index === 2
                    ? "bg-purple-500"
                    : "bg-gray-400"
                }`}
              ></div>
              <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {reason}
              </span>
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Animated reasons carousel
export const ReasonsCarousel = ({
  reasons = [],
  autoPlay = true,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    if (!autoPlay || reasons.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reasons.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [autoPlay, reasons.length]);

  if (!reasons.length) return null;

  const getReasonIcon = (reason) => {
    const reasonLower = reason.toLowerCase();

    if (reasonLower.includes("skill")) return BookOpen;
    if (reasonLower.includes("experience")) return TrendingUp;
    if (reasonLower.includes("location")) return MapPin;
    if (reasonLower.includes("time")) return Clock;
    if (reasonLower.includes("rating")) return Star;
    if (reasonLower.includes("mutual")) return Users;
    if (reasonLower.includes("active")) return Zap;
    if (reasonLower.includes("success")) return Award;
    if (reasonLower.includes("communication")) return Heart;

    return Target;
  };

  const IconComponent = getReasonIcon(reasons[currentIndex]);

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 
                     dark:from-emerald-900/20 dark:to-teal-900/20 p-4 ${className}`}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-full">
          <IconComponent className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {reasons[currentIndex]}
          </p>
        </div>
      </div>

      {reasons.length > 1 && (
        <div className="flex justify-center space-x-1 mt-3">
          {reasons.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-emerald-500"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchReasons;
