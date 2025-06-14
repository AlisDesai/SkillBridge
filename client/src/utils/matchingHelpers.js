// /client/src/utils/matchingHelpers.js

/**
 * Utility functions for Smart Matching functionality
 */

// Format compatibility score with appropriate styling
export const formatCompatibilityScore = (score) => {
  if (score >= 85) {
    return {
      label: "Perfect Match",
      color: "emerald",
      emoji: "✨",
      description: "Exceptional compatibility across all factors",
    };
  } else if (score >= 70) {
    return {
      label: "Great Match",
      color: "blue",
      emoji: "⭐",
      description: "Strong compatibility with excellent potential",
    };
  } else if (score >= 50) {
    return {
      label: "Good Match",
      color: "yellow",
      emoji: "👍",
      description: "Solid compatibility with good learning opportunities",
    };
  } else {
    return {
      label: "Potential Match",
      color: "gray",
      emoji: "💡",
      description: "Some compatibility factors align well",
    };
  }
};

// Get match type styling and information
export const getMatchTypeInfo = (matchType) => {
  const matchTypes = {
    perfect_match: {
      label: "Perfect Match",
      description: "Excellent skill complement with high compatibility",
      color: "emerald",
      gradient: "from-emerald-500 to-teal-500",
      icon: "✨",
      priority: 1,
    },
    skill_complement: {
      label: "Skill Complement",
      description: "Strong skill-based match with good experience balance",
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
      icon: "🎯",
      priority: 2,
    },
    mutual_learning: {
      label: "Mutual Learning",
      description: "Great mutual learning opportunity",
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
      icon: "🤝",
      priority: 3,
    },
    potential_match: {
      label: "Potential Match",
      description: "Decent compatibility with learning potential",
      color: "gray",
      gradient: "from-gray-500 to-slate-500",
      icon: "💡",
      priority: 4,
    },
  };

  return matchTypes[matchType] || matchTypes.potential_match;
};

// Calculate skill overlap percentage
export const calculateSkillOverlap = (userSkills = [], matchSkills = []) => {
  if (!userSkills.length || !matchSkills.length) return 0;

  const userSkillNames = userSkills.map((skill) =>
    (skill.name || skill).toLowerCase().trim()
  );
  const matchSkillNames = matchSkills.map((skill) =>
    (skill.name || skill).toLowerCase().trim()
  );

  const overlap = userSkillNames.filter((skill) =>
    matchSkillNames.includes(skill)
  ).length;

  return Math.round(
    (overlap / Math.max(userSkillNames.length, matchSkillNames.length)) * 100
  );
};

// Generate skill exchange suggestions
export const generateSkillExchangeSuggestions = (currentUser, matchedUser) => {
  const suggestions = [];

  const userTeaching = currentUser.skillsOffered || [];
  const userLearning = currentUser.skillsWanted || [];
  const matchTeaching = matchedUser.skillsOffered || [];
  const matchLearning = matchedUser.skillsWanted || [];

  // Find what user can teach that match wants to learn
  userTeaching.forEach((teachSkill) => {
    matchLearning.forEach((learnSkill) => {
      if (isSkillSimilar(teachSkill, learnSkill)) {
        suggestions.push({
          type: "you_teach",
          skill: teachSkill.name || teachSkill,
          description: `You can teach ${
            learnSkill.name || learnSkill
          } that they want to learn`,
          priority: "high",
        });
      }
    });
  });

  // Find what match can teach that user wants to learn
  matchTeaching.forEach((teachSkill) => {
    userLearning.forEach((learnSkill) => {
      if (isSkillSimilar(teachSkill, learnSkill)) {
        suggestions.push({
          type: "they_teach",
          skill: teachSkill.name || teachSkill,
          description: `They can teach ${
            learnSkill.name || learnSkill
          } that you want to learn`,
          priority: "high",
        });
      }
    });
  });

  return suggestions.slice(0, 4); // Return top 4 suggestions
};

// Simple skill similarity check
const isSkillSimilar = (skill1, skill2) => {
  const name1 = (skill1.name || skill1).toLowerCase().trim();
  const name2 = (skill2.name || skill2).toLowerCase().trim();

  // Exact match
  if (name1 === name2) return true;

  // Check if one contains the other
  if (name1.includes(name2) || name2.includes(name1)) return true;

  // Check category match
  const cat1 = (skill1.category || "").toLowerCase();
  const cat2 = (skill2.category || "").toLowerCase();
  if (cat1 && cat2 && cat1 === cat2) return true;

  return false;
};

// Format user activity status
export const formatUserActivity = (user) => {
  if (!user.lastActive) {
    return {
      status: "new",
      label: "New User",
      color: "blue",
      icon: "🆕",
    };
  }

  const lastActive = new Date(user.lastActive);
  const now = new Date();
  const diffInHours = (now - lastActive) / (1000 * 60 * 60);

  if (user.isOnline) {
    return {
      status: "online",
      label: "Online Now",
      color: "green",
      icon: "🟢",
    };
  } else if (diffInHours < 24) {
    return {
      status: "recent",
      label: "Active Today",
      color: "emerald",
      icon: "⚡",
    };
  } else if (diffInHours < 168) {
    // 7 days
    return {
      status: "week",
      label: "Active This Week",
      color: "yellow",
      icon: "📅",
    };
  } else {
    return {
      status: "inactive",
      label: "Less Active",
      color: "gray",
      icon: "💤",
    };
  }
};

// Format location for display
export const formatLocation = (location) => {
  if (!location) return "Remote";

  if (typeof location === "string") return location;

  const parts = [];
  if (location.city) parts.push(location.city);
  if (location.country && location.country !== location.city) {
    parts.push(location.country);
  }

  return parts.length > 0 ? parts.join(", ") : "Remote";
};

// Generate match conversation starters
export const generateConversationStarters = (match) => {
  const starters = [];
  const { user, reasons, compatibilityScore } = match;

  // Skill-based starters
  if (user.skillsOffered?.length > 0) {
    const topSkill = user.skillsOffered[0];
    starters.push(
      `Hi! I'm really interested in learning ${
        topSkill.name || topSkill
      }. Would you be open to teaching me?`
    );
  }

  if (user.skillsWanted?.length > 0) {
    const wantedSkill = user.skillsWanted[0];
    starters.push(
      `Hello! I noticed you want to learn ${
        wantedSkill.name || wantedSkill
      }. I'd love to help you with that!`
    );
  }

  // Reason-based starters
  if (reasons?.length > 0) {
    const firstReason = reasons[0];
    if (firstReason.includes("mutual")) {
      starters.push(
        `Hi! It looks like we have a great mutual learning opportunity. Interested in exchanging skills?`
      );
    }
    if (firstReason.includes("experience")) {
      starters.push(
        `Hello! I think our experience levels would complement each other well for learning.`
      );
    }
  }

  // Compatibility-based starters
  if (compatibilityScore >= 80) {
    starters.push(
      `Hi! We seem to be a perfect match for skill exchange. Would you like to connect?`
    );
  }

  // Generic friendly starters
  starters.push(
    `Hello! I came across your profile and think we could learn a lot from each other. Interested in connecting?`
  );
  starters.push(
    `Hi there! Your skills look amazing and I'd love to chat about potential collaboration.`
  );

  return starters.slice(0, 3); // Return top 3 starters
};

// Filter matches based on criteria
export const filterMatches = (matches, filters) => {
  let filtered = [...matches];

  // Filter by minimum compatibility
  if (filters.minCompatibility) {
    filtered = filtered.filter(
      (match) => match.compatibilityScore >= filters.minCompatibility
    );
  }

  // Filter by match type
  if (filters.matchTypes?.length > 0) {
    filtered = filtered.filter((match) =>
      filters.matchTypes.includes(match.matchType)
    );
  }

  // Filter by online status
  if (filters.onlineOnly) {
    filtered = filtered.filter((match) => match.user.isOnline);
  }

  // Filter by verified users
  if (filters.verifiedOnly) {
    filtered = filtered.filter((match) => match.user.isVerified);
  }

  // Filter by minimum rating
  if (filters.minRating) {
    filtered = filtered.filter(
      (match) => (match.user.averageRating || 0) >= filters.minRating
    );
  }

  // Filter by location
  if (filters.location) {
    filtered = filtered.filter((match) => {
      const userLocation = formatLocation(match.user.location);
      return userLocation
        .toLowerCase()
        .includes(filters.location.toLowerCase());
    });
  }

  // Filter by skills
  if (filters.skills?.length > 0) {
    filtered = filtered.filter((match) => {
      const userSkills = [
        ...(match.user.skillsOffered || []),
        ...(match.user.skillsWanted || []),
      ].map((skill) => (skill.name || skill).toLowerCase());

      return filters.skills.some((filterSkill) =>
        userSkills.some((userSkill) =>
          userSkill.includes(filterSkill.toLowerCase())
        )
      );
    });
  }

  return filtered;
};

// Sort matches based on criteria
export const sortMatches = (matches, sortBy = "compatibility") => {
  const sorted = [...matches];

  switch (sortBy) {
    case "compatibility":
      return sorted.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    case "recent":
      return sorted.sort((a, b) => {
        const aTime = new Date(a.user.lastActive || 0);
        const bTime = new Date(b.user.lastActive || 0);
        return bTime - aTime;
      });

    case "rating":
      return sorted.sort(
        (a, b) => (b.user.averageRating || 0) - (a.user.averageRating || 0)
      );

    case "reviews":
      return sorted.sort(
        (a, b) => (b.user.totalReviews || 0) - (a.user.totalReviews || 0)
      );

    case "alphabetical":
      return sorted.sort((a, b) =>
        (a.user.name || "").localeCompare(b.user.name || "")
      );

    default:
      return sorted;
  }
};

// Generate match analytics
export const generateMatchAnalytics = (matches) => {
  if (!matches.length) {
    return {
      total: 0,
      averageCompatibility: 0,
      matchTypes: {},
      topSkills: [],
      locationDistribution: {},
      experienceLevels: {},
    };
  }

  const analytics = {
    total: matches.length,
    averageCompatibility: Math.round(
      matches.reduce((sum, match) => sum + match.compatibilityScore, 0) /
        matches.length
    ),
    matchTypes: {},
    topSkills: [],
    locationDistribution: {},
    experienceLevels: {},
  };

  // Calculate match type distribution
  matches.forEach((match) => {
    analytics.matchTypes[match.matchType] =
      (analytics.matchTypes[match.matchType] || 0) + 1;
  });

  // Calculate top skills
  const skillCounts = {};
  matches.forEach((match) => {
    const skills = [
      ...(match.user.skillsOffered || []),
      ...(match.user.skillsWanted || []),
    ];
    skills.forEach((skill) => {
      const skillName = skill.name || skill;
      skillCounts[skillName] = (skillCounts[skillName] || 0) + 1;
    });
  });

  analytics.topSkills = Object.entries(skillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count }));

  // Calculate location distribution
  matches.forEach((match) => {
    const location = formatLocation(match.user.location);
    analytics.locationDistribution[location] =
      (analytics.locationDistribution[location] || 0) + 1;
  });

  // Calculate experience level distribution
  matches.forEach((match) => {
    const level = match.user.experienceLevel || "Not specified";
    analytics.experienceLevels[level] =
      (analytics.experienceLevels[level] || 0) + 1;
  });

  return analytics;
};

// Debounce function for search/filter inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Format time ago
export const formatTimeAgo = (date) => {
  if (!date) return "Never";

  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return past.toLocaleDateString();
};

// Validate user preferences
export const validatePreferences = (preferences) => {
  const errors = {};

  // Validate algorithm settings
  if (preferences.algorithmSettings) {
    const settings = preferences.algorithmSettings;
    const weights = [
      settings.prioritizeSkillMatch,
      settings.prioritizeExperience,
      settings.prioritizeLocation,
      settings.prioritizeAvailability,
      settings.prioritizeReputation,
    ];

    const total = weights.reduce((sum, weight) => sum + (weight || 0), 0);
    if (total > 1) {
      errors.algorithmSettings = "Total priority weights cannot exceed 100%";
    }
  }

  // Validate location preferences
  if (preferences.locationPreferences?.maxDistance) {
    if (preferences.locationPreferences.maxDistance < 0) {
      errors.maxDistance = "Distance cannot be negative";
    }
  }

  // Validate user preferences
  if (preferences.userPreferences) {
    const { minRating, minReviewCount } = preferences.userPreferences;

    if (minRating && (minRating < 1 || minRating > 5)) {
      errors.minRating = "Rating must be between 1 and 5";
    }

    if (minReviewCount && minReviewCount < 0) {
      errors.minReviewCount = "Review count cannot be negative";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  formatCompatibilityScore,
  getMatchTypeInfo,
  calculateSkillOverlap,
  generateSkillExchangeSuggestions,
  formatUserActivity,
  formatLocation,
  generateConversationStarters,
  filterMatches,
  sortMatches,
  generateMatchAnalytics,
  debounce,
  formatTimeAgo,
  validatePreferences,
};
