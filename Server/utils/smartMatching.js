// /server/utils/smartMatching.js

const skillSimilarity = require("./skillSimilarity");

class SmartMatchingAlgorithm {
  /**
   * Main function to calculate smart matches for a user
   * @param {Object} user - Current user object
   * @param {Array} potentialMatches - Array of potential match users
   * @param {Array} userHistory - User's past matches and reviews
   * @returns {Array} Sorted matches with compatibility scores
   */
  static calculateMatchScores(user, potentialMatches, userHistory = []) {
    const scoredMatches = potentialMatches.map((potential) => {
      const compatibility = this.calculateCompatibility(
        user,
        potential,
        userHistory
      );
      return {
        user: potential,
        compatibilityScore: compatibility.total,
        breakdown: compatibility.breakdown,
        confidence: compatibility.confidence,
        reasons: compatibility.reasons,
        matchType: this.determineMatchType(compatibility.breakdown),
      };
    });

    // Sort by compatibility score (highest first)
    return scoredMatches.sort(
      (a, b) => b.compatibilityScore - a.compatibilityScore
    );
  }

  /**
   * Core compatibility calculation with multiple factors
   */
  static calculateCompatibility(user, potential, userHistory) {
    const factors = {
      skillMatch: this.calculateSkillMatch(user, potential),
      experienceBalance: this.calculateExperienceBalance(user, potential),
      availabilityOverlap: this.calculateAvailabilityOverlap(user, potential),
      locationCompatibility: this.calculateLocationScore(user, potential),
      personalityMatch: this.calculatePersonalityMatch(user, potential),
      historicalSuccess: this.calculateHistoricalSuccess(
        user,
        potential,
        userHistory
      ),
      mutualInterest: this.calculateMutualInterest(user, potential),
      activityScore: this.calculateActivityScore(potential),
      reputationScore: this.calculateReputationScore(potential),
    };

    // Weighted scoring system (total = 100%)
    const weights = {
      skillMatch: 0.25, // 25% - Most important
      experienceBalance: 0.15, // 15% - Skill level compatibility
      availabilityOverlap: 0.12, // 12% - Scheduling compatibility
      mutualInterest: 0.12, // 12% - Both want to learn from each other
      reputationScore: 0.1, // 10% - User rating and reviews
      personalityMatch: 0.08, // 8% - Communication style
      historicalSuccess: 0.08, // 8% - Past success with similar users
      locationCompatibility: 0.06, // 6% - Geographic convenience
      activityScore: 0.04, // 4% - How active user is
    };

    let totalScore = 0;
    let confidence = 0;
    const breakdown = {};
    const reasons = [];

    // Calculate weighted score
    for (const [factor, score] of Object.entries(factors)) {
      const weightedScore = score.value * weights[factor];
      totalScore += weightedScore;
      breakdown[factor] = {
        raw: score.value,
        weighted: weightedScore,
        weight: weights[factor],
        explanation: score.explanation,
      };

      if (score.value > 0.7) {
        reasons.push(score.explanation);
      }

      confidence += score.confidence * weights[factor];
    }

    return {
      total: Math.round(totalScore * 100), // Convert to 0-100 scale
      breakdown,
      confidence: Math.round(confidence * 100),
      reasons: reasons.slice(0, 3), // Top 3 reasons
    };
  }

  /**
   * Calculate skill complementarity score
   */
  static calculateSkillMatch(user, potential) {
    const userTeaching = user.skillsOffered || [];
    const userLearning = user.skillsWanted || [];
    const potentialTeaching = potential.skillsOffered || [];
    const potentialLearning = potential.skillsWanted || [];

    let matches = 0;
    let totalPossible = 0;
    const specificMatches = [];

    // Check if user can teach what potential wants to learn
    userTeaching.forEach((teachSkill) => {
      potentialLearning.forEach((learnSkill) => {
        totalPossible++;
        const similarity = skillSimilarity.calculateSkillSimilarity(
          teachSkill,
          learnSkill
        );
        if (similarity > 0.6) {
          matches += similarity;
          specificMatches.push(
            `You can teach ${learnSkill.name} they want to learn`
          );
        }
      });
    });

    // Check if potential can teach what user wants to learn
    potentialTeaching.forEach((teachSkill) => {
      userLearning.forEach((learnSkill) => {
        totalPossible++;
        const similarity = skillSimilarity.calculateSkillSimilarity(
          teachSkill,
          learnSkill
        );
        if (similarity > 0.6) {
          matches += similarity;
          specificMatches.push(
            `They can teach ${learnSkill.name} you want to learn`
          );
        }
      });
    });

    const score = totalPossible > 0 ? matches / totalPossible : 0;

    return {
      value: Math.min(score, 1),
      confidence: totalPossible > 2 ? 0.9 : 0.6,
      explanation:
        specificMatches.length > 0
          ? specificMatches[0]
          : "Limited skill overlap found",
    };
  }

  /**
   * Calculate experience level balance
   */
  static calculateExperienceBalance(user, potential) {
    const experienceMap = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      expert: 4,
    };

    const userLevel = user.experienceLevel
      ? experienceMap[user.experienceLevel.toLowerCase()]
      : 2;
    const potentialLevel = potential.experienceLevel
      ? experienceMap[potential.experienceLevel.toLowerCase()]
      : 2;

    const difference = Math.abs(userLevel - potentialLevel);

    // Sweet spot is 1-2 levels difference for optimal learning
    let score;
    if (difference === 0) score = 0.6; // Same level - okay but not ideal
    else if (difference === 1) score = 0.9; // One level difference - great
    else if (difference === 2) score = 1.0; // Two levels - perfect complement
    else score = 0.3; // Too big gap

    return {
      value: score,
      confidence: 0.8,
      explanation: `Experience levels complement well (${
        user.experienceLevel || "intermediate"
      } ↔ ${potential.experienceLevel || "intermediate"})`,
    };
  }

  /**
   * Calculate availability overlap
   */
  static calculateAvailabilityOverlap(user, potential) {
    if (!user.availability || !potential.availability) {
      return {
        value: 0.5, // Neutral score when availability unknown
        confidence: 0.3,
        explanation: "Availability information not available",
      };
    }

    const userSlots = this.parseAvailability(user.availability);
    const potentialSlots = this.parseAvailability(potential.availability);

    const overlap = this.calculateTimeOverlap(userSlots, potentialSlots);

    return {
      value: overlap,
      confidence: 0.7,
      explanation:
        overlap > 0.6
          ? "Good scheduling compatibility"
          : "Limited time overlap",
    };
  }

  /**
   * Calculate location compatibility
   */
  static calculateLocationScore(user, potential) {
    if (!user.location || !potential.location) {
      return {
        value: 0.5, // Neutral score for remote/unknown
        confidence: 0.4,
        explanation: "Location flexibility available",
      };
    }

    // Simple location matching - can be enhanced with actual distance calculation
    const sameCity = user.location.city === potential.location.city;
    const sameCountry = user.location.country === potential.location.country;

    let score = 0.3; // Base score for different locations
    if (sameCountry) score = 0.6;
    if (sameCity) score = 1.0;

    return {
      value: score,
      confidence: 0.8,
      explanation: sameCity
        ? "Same city - easy to meet"
        : sameCountry
        ? "Same country - feasible"
        : "Remote collaboration",
    };
  }

  /**
   * Calculate personality/communication style match
   */
  static calculatePersonalityMatch(user, potential) {
    // Based on user bio, communication preferences, etc.
    const userBio = (user.bio || "").toLowerCase();
    const potentialBio = (potential.bio || "").toLowerCase();

    // Simple keyword matching for personality traits
    const positiveKeywords = [
      "friendly",
      "patient",
      "helpful",
      "collaborative",
      "supportive",
    ];
    const userTraits = positiveKeywords.filter((trait) =>
      userBio.includes(trait)
    ).length;
    const potentialTraits = positiveKeywords.filter((trait) =>
      potentialBio.includes(trait)
    ).length;

    const score = Math.min(
      (userTraits + potentialTraits) / (positiveKeywords.length * 2),
      1
    );

    return {
      value: score,
      confidence: 0.6,
      explanation:
        score > 0.5
          ? "Compatible communication styles"
          : "Standard communication approach",
    };
  }

  /**
   * Calculate historical success with similar users
   */
  static calculateHistoricalSuccess(user, potential, userHistory) {
    if (!userHistory.length) {
      return {
        value: 0.5, // Neutral for new users
        confidence: 0.3,
        explanation: "No historical data available",
      };
    }

    // Find matches with users similar to the potential match
    const similarMatches = userHistory.filter((match) => {
      return this.areSimilarUsers(match.otherUser, potential);
    });

    if (similarMatches.length === 0) {
      return {
        value: 0.5,
        confidence: 0.4,
        explanation: "No similar previous matches",
      };
    }

    const averageRating =
      similarMatches.reduce((sum, match) => sum + (match.rating || 3), 0) /
      similarMatches.length;
    const score = (averageRating - 1) / 4; // Convert 1-5 rating to 0-1 score

    return {
      value: score,
      confidence: 0.7,
      explanation:
        score > 0.7
          ? "Great success with similar users"
          : "Mixed results with similar users",
    };
  }

  /**
   * Calculate mutual interest score
   */
  static calculateMutualInterest(user, potential) {
    const userTeaching = user.skillsOffered || [];
    const userLearning = user.skillsWanted || [];
    const potentialTeaching = potential.skillsOffered || [];
    const potentialLearning = potential.skillsWanted || [];

    let mutualPairs = 0;
    let totalChecked = 0;

    // Check for mutual skill exchange potential
    userTeaching.forEach((userSkill) => {
      potentialLearning.forEach((potentialSkill) => {
        totalChecked++;
        if (
          skillSimilarity.calculateSkillSimilarity(userSkill, potentialSkill) >
          0.7
        ) {
          // Check if there's a reverse match
          potentialTeaching.forEach((reverseSkill) => {
            userLearning.forEach((userWantSkill) => {
              if (
                skillSimilarity.calculateSkillSimilarity(
                  reverseSkill,
                  userWantSkill
                ) > 0.7
              ) {
                mutualPairs++;
              }
            });
          });
        }
      });
    });

    const score =
      totalChecked > 0 ? Math.min(mutualPairs / totalChecked, 1) : 0;

    return {
      value: score,
      confidence: 0.8,
      explanation:
        score > 0.5
          ? "Strong mutual learning opportunity"
          : "One-way skill sharing potential",
    };
  }

  /**
   * Calculate user activity score
   */
  static calculateActivityScore(potential) {
    const now = new Date();
    const lastActive = potential.lastActive
      ? new Date(potential.lastActive)
      : now;
    const daysSinceActive = (now - lastActive) / (1000 * 60 * 60 * 24);

    let score = 1;
    if (daysSinceActive > 30) score = 0.3;
    else if (daysSinceActive > 7) score = 0.6;
    else if (daysSinceActive > 1) score = 0.9;

    return {
      value: score,
      confidence: 0.9,
      explanation:
        score > 0.8
          ? "Very active user"
          : score > 0.5
          ? "Moderately active"
          : "Less active recently",
    };
  }

  /**
   * Calculate reputation score based on reviews
   */
  static calculateReputationScore(potential) {
    const averageRating = potential.averageRating || 0;
    const totalReviews = potential.totalReviews || 0;

    if (totalReviews === 0) {
      return {
        value: 0.5, // Neutral for new users
        confidence: 0.3,
        explanation: "New user - no reviews yet",
      };
    }

    // Convert 1-5 rating to 0-1 score, with confidence based on review count
    const score = (averageRating - 1) / 4;
    const confidence = Math.min(totalReviews / 10, 1); // Full confidence at 10+ reviews

    return {
      value: score,
      confidence,
      explanation:
        averageRating >= 4
          ? "Excellent reputation"
          : averageRating >= 3
          ? "Good reputation"
          : "Building reputation",
    };
  }

  /**
   * Determine match type based on compatibility breakdown
   */
  static determineMatchType(breakdown) {
    const skillScore = breakdown.skillMatch?.raw || 0;
    const mutualScore = breakdown.mutualInterest?.raw || 0;
    const experienceScore = breakdown.experienceBalance?.raw || 0;

    if (skillScore > 0.8 && mutualScore > 0.7) {
      return "perfect_match";
    } else if (skillScore > 0.6 && experienceScore > 0.8) {
      return "skill_complement";
    } else if (mutualScore > 0.6) {
      return "mutual_learning";
    } else {
      return "potential_match";
    }
  }

  /**
   * Helper function to parse availability
   */
  static parseAvailability(availability) {
    // Simple implementation - can be enhanced
    if (typeof availability === "string") {
      return availability.split(",").map((slot) => slot.trim());
    }
    return availability || [];
  }

  /**
   * Helper function to calculate time overlap
   */
  static calculateTimeOverlap(slots1, slots2) {
    const commonSlots = slots1.filter((slot) => slots2.includes(slot));
    return commonSlots.length / Math.max(slots1.length, slots2.length, 1);
  }

  /**
   * Helper function to check if users are similar
   */
  static areSimilarUsers(user1, user2) {
    // Simple similarity check - can be enhanced
    const skillOverlap = this.calculateSkillOverlap(
      user1.skillsOffered || [],
      user2.skillsOffered || []
    );
    const experienceSimilar =
      Math.abs((user1.experienceLevel || 2) - (user2.experienceLevel || 2)) <=
      1;

    return skillOverlap > 0.3 || experienceSimilar;
  }

  /**
   * Helper function to calculate skill overlap
   */
  static calculateSkillOverlap(skills1, skills2) {
    if (!skills1.length || !skills2.length) return 0;

    let overlap = 0;
    skills1.forEach((skill1) => {
      skills2.forEach((skill2) => {
        overlap += skillSimilarity.calculateSkillSimilarity(skill1, skill2);
      });
    });

    return overlap / (skills1.length * skills2.length);
  }

  /**
   * Get match insights for debugging/analytics
   */
  static getMatchInsights(user, matches) {
    const insights = {
      totalMatches: matches.length,
      averageCompatibility: 0,
      topFactors: {},
      matchTypes: {},
      recommendations: [],
    };

    if (matches.length === 0) {
      insights.recommendations.push(
        "Add more skills to your profile to find better matches"
      );
      return insights;
    }

    // Calculate average compatibility
    insights.averageCompatibility = Math.round(
      matches.reduce((sum, match) => sum + match.compatibilityScore, 0) /
        matches.length
    );

    // Analyze top factors across all matches
    const factorSums = {};
    matches.forEach((match) => {
      Object.entries(match.breakdown).forEach(([factor, data]) => {
        if (!factorSums[factor]) factorSums[factor] = 0;
        factorSums[factor] += data.weighted;
      });
    });

    insights.topFactors = Object.entries(factorSums)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([factor, sum]) => ({
        factor,
        contribution: Math.round((sum / matches.length) * 100),
      }));

    // Analyze match types
    matches.forEach((match) => {
      insights.matchTypes[match.matchType] =
        (insights.matchTypes[match.matchType] || 0) + 1;
    });

    // Generate recommendations
    if (insights.averageCompatibility < 50) {
      insights.recommendations.push(
        "Consider updating your skill preferences for better matches"
      );
    }
    if (factorSums.skillMatch < factorSums.reputationScore) {
      insights.recommendations.push(
        "Add more specific skills to improve skill-based matching"
      );
    }

    return insights;
  }
}

module.exports = SmartMatchingAlgorithm;
