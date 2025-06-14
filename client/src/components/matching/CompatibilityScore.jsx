// /client/src/components/matching/CompatibilityScore.jsx

import React from "react";
import { Zap, Star, Award, Target } from "lucide-react";

const CompatibilityScore = ({
  score,
  confidence = null,
  size = "md",
  showLabel = true,
  showConfidence = false,
  animated = true,
  className = "",
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      circle: "w-12 h-12",
      text: "text-xs",
      stroke: "3",
      icon: "w-3 h-3",
    },
    md: {
      circle: "w-16 h-16",
      text: "text-sm",
      stroke: "4",
      icon: "w-4 h-4",
    },
    lg: {
      circle: "w-20 h-20",
      text: "text-base",
      stroke: "5",
      icon: "w-5 h-5",
    },
    xl: {
      circle: "w-24 h-24",
      text: "text-lg",
      stroke: "6",
      icon: "w-6 h-6",
    },
  };

  const config = sizeConfig[size] || sizeConfig.md;

  // Score styling based on value
  const getScoreStyle = (score) => {
    if (score >= 85) {
      return {
        gradient: "from-emerald-500 to-green-400",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        text: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-200 dark:border-emerald-700",
        icon: Award,
        label: "Perfect Match",
        color: "#10b981",
      };
    } else if (score >= 70) {
      return {
        gradient: "from-blue-500 to-cyan-400",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        text: "text-blue-700 dark:text-blue-300",
        border: "border-blue-200 dark:border-blue-700",
        icon: Star,
        label: "Great Match",
        color: "#3b82f6",
      };
    } else if (score >= 50) {
      return {
        gradient: "from-yellow-500 to-orange-400",
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        text: "text-yellow-700 dark:text-yellow-300",
        border: "border-yellow-200 dark:border-yellow-700",
        icon: Target,
        label: "Good Match",
        color: "#eab308",
      };
    } else {
      return {
        gradient: "from-gray-500 to-slate-400",
        bg: "bg-gray-50 dark:bg-gray-900/20",
        text: "text-gray-700 dark:text-gray-300",
        border: "border-gray-200 dark:border-gray-700",
        icon: Zap,
        label: "Potential",
        color: "#6b7280",
      };
    }
  };

  const scoreStyle = getScoreStyle(score);
  const IconComponent = scoreStyle.icon;

  // Calculate circle progress
  const radius =
    size === "sm" ? 18 : size === "lg" ? 32 : size === "xl" ? 40 : 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      {/* Circular Progress */}
      <div className="relative">
        {/* Background Circle */}
        <svg
          className={`${config.circle} transform -rotate-90`}
          viewBox="0 0 100 100"
        >
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth={config.stroke}
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />

          {/* Progress track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={scoreStyle.color}
            strokeWidth={config.stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ease-out ${
              animated ? "animate-pulse" : ""
            }`}
            style={{
              filter: "drop-shadow(0 0 6px rgba(16, 185, 129, 0.3))",
            }}
          />
        </svg>

        {/* Center Content */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center ${config.text}`}
        >
          {/* Score Number */}
          <span className={`font-bold ${scoreStyle.text}`}>{score}</span>

          {/* Icon */}
          <IconComponent
            className={`${config.icon} ${scoreStyle.text} mt-0.5`}
          />
        </div>

        {/* Glow Effect for High Scores */}
        {score >= 85 && animated && (
          <div
            className={`absolute inset-0 ${config.circle} rounded-full bg-gradient-to-r ${scoreStyle.gradient} 
                           opacity-20 animate-ping`}
          ></div>
        )}
      </div>

      {/* Labels */}
      {showLabel && (
        <div className="text-center space-y-1">
          <div className={`text-xs font-semibold ${scoreStyle.text}`}>
            {scoreStyle.label}
          </div>

          {showConfidence && confidence && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {confidence}% confidence
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Mini version for inline use
export const CompatibilityBadge = ({ score, className = "" }) => {
  const getScoreColor = (score) => {
    if (score >= 85)
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (score >= 70) return "bg-blue-100 text-blue-700 border-blue-200";
    if (score >= 50) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                      border ${getScoreColor(score)} ${className}`}
    >
      <Zap className="w-3 h-3 mr-1" />
      {score}% match
    </span>
  );
};

// Horizontal progress bar version
export const CompatibilityBar = ({
  score,
  label = true,
  height = "h-2",
  className = "",
}) => {
  const getScoreColor = (score) => {
    if (score >= 85) return "bg-emerald-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-gray-500";
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Compatibility</span>
          <span>{score}%</span>
        </div>
      )}

      <div
        className={`w-full ${height} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}
      >
        <div
          className={`${height} ${getScoreColor(
            score
          )} transition-all duration-1000 ease-out rounded-full`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
};

// Comparison component for multiple scores
export const CompatibilityComparison = ({ scores, labels }) => {
  return (
    <div className="space-y-3">
      {scores.map((score, index) => (
        <div key={index} className="flex items-center space-x-3">
          <CompatibilityScore
            score={score}
            size="sm"
            showLabel={false}
            animated={false}
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {labels?.[index] || `Match ${index + 1}`}
            </div>
            <CompatibilityBar score={score} label={false} height="h-1" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompatibilityScore;
