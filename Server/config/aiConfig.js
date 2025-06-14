// /server/config/aiConfig.js

const aiConfig = {
  // Smart Matching Algorithm Configuration
  matching: {
    // Algorithm version for tracking changes
    version: "1.0.0",

    // Default weights for compatibility factors
    defaultWeights: {
      skillMatch: 0.25, // 25% - Most important factor
      experienceBalance: 0.15, // 15% - Skill level compatibility
      availabilityOverlap: 0.12, // 12% - Scheduling compatibility
      mutualInterest: 0.12, // 12% - Both want to learn from each other
      reputationScore: 0.1, // 10% - User rating and reviews
      personalityMatch: 0.08, // 8% - Communication style compatibility
      historicalSuccess: 0.08, // 8% - Past success with similar users
      locationCompatibility: 0.06, // 6% - Geographic convenience
      activityScore: 0.04, // 4% - How active user is
    },

    // Thresholds for match quality
    thresholds: {
      minimumMatch: 30, // Don't show matches below 30%
      goodMatch: 60, // Matches above 60% are "good"
      excellentMatch: 80, // Matches above 80% are "excellent"
      perfectMatch: 90, // Matches above 90% are "perfect"
    },

    // Performance tuning
    performance: {
      maxMatchesPerRequest: 50, // Maximum matches to process at once
      cacheTimeout: 1800, // 30 minutes cache for match results
      enableParallelProcessing: true,
      batchSize: 10, // Process matches in batches
    },

    // Skill matching configuration
    skillMatching: {
      exactMatchWeight: 1.0, // Weight for exact skill name matches
      categoryMatchWeight: 0.7, // Weight for same category matches
      similarSkillWeight: 0.6, // Weight for similar skills
      tagMatchWeight: 0.4, // Weight for tag-based matches
      minimumSimilarity: 0.3, // Minimum similarity to consider a match

      // Level compatibility settings
      levelCompatibility: {
        exact: 1.0, // Same level compatibility
        oneLevel: 0.9, // One level difference
        twoLevel: 0.8, // Two level difference
        threeLevel: 0.4, // Three level difference
      },

      // Category relationships for better matching
      relatedCategories: {
        programming: [
          "web development",
          "mobile development",
          "software development",
        ],
        design: ["ui design", "ux design", "graphic design"],
        marketing: ["digital marketing", "social media", "content marketing"],
        "data science": ["machine learning", "analytics", "statistics"],
        business: ["entrepreneurship", "management", "finance"],
      },
    },

    // Experience level mappings
    experienceLevels: {
      beginner: {
        value: 1,
        label: "Beginner",
        description: "0-1 years experience",
      },
      intermediate: {
        value: 2,
        label: "Intermediate",
        description: "1-3 years experience",
      },
      advanced: {
        value: 3,
        label: "Advanced",
        description: "3-5 years experience",
      },
      expert: { value: 4, label: "Expert", description: "5+ years experience" },
    },

    // Match type definitions
    matchTypes: {
      perfect_match: {
        threshold: 85,
        description: "Excellent skill complement with high compatibility",
        priority: 1,
      },
      skill_complement: {
        threshold: 70,
        description: "Strong skill-based match with good experience balance",
        priority: 2,
      },
      mutual_learning: {
        threshold: 60,
        description: "Great mutual learning opportunity",
        priority: 3,
      },
      potential_match: {
        threshold: 40,
        description: "Decent compatibility with learning potential",
        priority: 4,
      },
    },
  },

  // Caching Configuration
  caching: {
    enabled: true,
    provider: process.env.CACHE_PROVIDER || "auto", // 'redis', 'memory', 'auto'

    // TTL settings in seconds
    ttl: {
      matchResults: 1800, // 30 minutes
      skillSimilarity: 86400, // 24 hours
      userAnalytics: 3600, // 1 hour
      algorithmInsights: 7200, // 2 hours
      userPreferences: 1800, // 30 minutes
    },

    // Memory cache settings (when Redis unavailable)
    memory: {
      maxSize: 1000, // Maximum number of cache entries
      cleanupInterval: 300000, // 5 minutes cleanup interval
      cleanupPercentage: 0.3, // Remove 30% of old entries during cleanup
    },

    // Redis settings
    redis: {
      host: process.env.REDIS_HOST || "localhost",
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      db: process.env.REDIS_DB || 0,
      keyPrefix: "skillswap:ai:",
      retryAttempts: 3,
      retryDelay: 1000,
    },
  },

  // Analytics and Insights Configuration
  analytics: {
    enabled: true,

    // Data collection settings
    collection: {
      trackMatchAccuracy: true,
      trackUserBehavior: true,
      trackAlgorithmPerformance: true,
      anonymizeData: true,
    },

    // Performance monitoring
    monitoring: {
      alertThresholds: {
        lowMatchAccuracy: 0.6, // Alert if accuracy drops below 60%
        highResponseTime: 5000, // Alert if response time > 5 seconds
        lowCacheHitRate: 0.3, // Alert if cache hit rate < 30%
      },

      metricsRetention: {
        daily: 90, // Keep daily metrics for 90 days
        hourly: 7, // Keep hourly metrics for 7 days
        realtime: 1, // Keep real-time metrics for 1 day
      },
    },

    // A/B testing configuration
    experiments: {
      enabled: false, // Disable A/B testing by default

      // Algorithm variations to test
      variations: {
        skillWeightIncrease: {
          weights: { skillMatch: 0.35, experienceBalance: 0.1 },
        },
        locationFocus: {
          weights: { locationCompatibility: 0.15, skillMatch: 0.2 },
        },
        reputationFocus: {
          weights: { reputationScore: 0.2, skillMatch: 0.2 },
        },
      },

      // Traffic allocation
      trafficAllocation: {
        control: 0.7, // 70% get default algorithm
        variant1: 0.15, // 15% get variant 1
        variant2: 0.15, // 15% get variant 2
      },
    },
  },

  // Machine Learning Configuration (Future Enhancement)
  machineLearning: {
    enabled: false, // ML features disabled by default

    // When enabled, these settings would apply
    models: {
      skillSimilarity: {
        type: "cosine_similarity",
        vectorSize: 100,
        updateFrequency: "weekly",
      },

      userCompatibility: {
        type: "collaborative_filtering",
        factors: 50,
        regularization: 0.1,
        updateFrequency: "daily",
      },

      successPrediction: {
        type: "random_forest",
        features: ["compatibility_score", "skill_overlap", "experience_diff"],
        updateFrequency: "weekly",
      },
    },

    // Training data requirements
    training: {
      minimumSamples: 1000, // Minimum samples needed to train models
      validationSplit: 0.2, // 20% for validation
      testSplit: 0.1, // 10% for testing
      crossValidationFolds: 5,
    },
  },

  // Feature Flags
  features: {
    smartMatching: {
      enabled: true,
      rolloutPercentage: 100, // 100% of users get smart matching
    },

    advancedFiltering: {
      enabled: true,
      rolloutPercentage: 100,
    },

    matchInsights: {
      enabled: true,
      rolloutPercentage: 50, // 50% of users get match insights
    },

    realTimeUpdates: {
      enabled: false, // Disable real-time updates for now
      rolloutPercentage: 0,
    },

    personalizedWeights: {
      enabled: true, // Allow users to customize algorithm weights
      rolloutPercentage: 80, // 80% of users can customize
    },
  },

  // API Rate Limiting for AI endpoints
  rateLimiting: {
    smartMatch: {
      windowMs: 60000, // 1 minute window
      maxRequests: 10, // 10 requests per minute
      skipSuccessfulHits: false,
    },

    analytics: {
      windowMs: 300000, // 5 minute window
      maxRequests: 20, // 20 requests per 5 minutes
      skipSuccessfulHits: true,
    },

    skillSearch: {
      windowMs: 30000, // 30 second window
      maxRequests: 30, // 30 requests per 30 seconds
      skipSuccessfulHits: true,
    },
  },

  // Error Handling and Fallbacks
  errorHandling: {
    // Fallback behavior when AI services fail
    fallbacks: {
      useBasicMatching: true, // Fall back to basic matching
      cacheExpiredResults: true, // Use cached results even if expired
      returnPartialResults: true, // Return partial results on timeout
      defaultCompatibility: 50, // Default compatibility score
    },

    // Retry configuration
    retries: {
      maxAttempts: 3,
      backoffMultiplier: 2,
      initialDelay: 1000,
    },

    // Circuit breaker settings
    circuitBreaker: {
      enabled: true,
      failureThreshold: 10, // Trip after 10 failures
      resetTimeout: 60000, // Reset after 1 minute
      monitoringPeriod: 300000, // Monitor for 5 minutes
    },
  },

  // Environment-specific overrides
  environments: {
    development: {
      caching: { enabled: false },
      analytics: { collection: { anonymizeData: false } },
      rateLimiting: { smartMatch: { maxRequests: 100 } },
    },

    test: {
      caching: { enabled: false },
      analytics: { enabled: false },
      machineLearning: { enabled: false },
    },

    production: {
      caching: { enabled: true },
      analytics: { enabled: true },
      errorHandling: { fallbacks: { useBasicMatching: true } },
    },
  },
};

// Helper function to get environment-specific config
function getConfig() {
  const env = process.env.NODE_ENV || "development";
  const config = { ...aiConfig };

  // Apply environment-specific overrides
  if (config.environments[env]) {
    const envOverrides = config.environments[env];

    // Deep merge environment overrides
    Object.keys(envOverrides).forEach((key) => {
      if (
        typeof envOverrides[key] === "object" &&
        !Array.isArray(envOverrides[key])
      ) {
        config[key] = { ...config[key], ...envOverrides[key] };
      } else {
        config[key] = envOverrides[key];
      }
    });
  }

  return config;
}

// Helper function to check if a feature is enabled for a user
function isFeatureEnabled(featureName, userId = null, userPercentage = null) {
  const config = getConfig();
  const feature = config.features[featureName];

  if (!feature || !feature.enabled) {
    return false;
  }

  // If no rollout percentage or 100%, always return true
  if (!feature.rolloutPercentage || feature.rolloutPercentage === 100) {
    return true;
  }

  // Use user-specific percentage or generate from userId
  let percentage = userPercentage;
  if (!percentage && userId) {
    // Generate consistent percentage based on userId
    const hash = require("crypto")
      .createHash("md5")
      .update(userId.toString())
      .digest("hex");
    percentage = (parseInt(hash.substring(0, 2), 16) / 255) * 100;
  }

  return percentage <= feature.rolloutPercentage;
}

// Helper function to get algorithm weights (with user preferences)
function getAlgorithmWeights(userPreferences = null) {
  const config = getConfig();

  if (userPreferences && userPreferences.algorithmSettings) {
    return userPreferences.getWeights();
  }

  return config.matching.defaultWeights;
}

// Helper function to validate configuration
function validateConfig() {
  const config = getConfig();
  const errors = [];

  // Validate weights sum to approximately 1
  const weights = config.matching.defaultWeights;
  const weightSum = Object.values(weights).reduce(
    (sum, weight) => sum + weight,
    0
  );

  if (Math.abs(weightSum - 1.0) > 0.01) {
    errors.push(
      `Algorithm weights sum to ${weightSum}, should be close to 1.0`
    );
  }

  // Validate thresholds are in ascending order
  const thresholds = config.matching.thresholds;
  if (
    thresholds.minimumMatch >= thresholds.goodMatch ||
    thresholds.goodMatch >= thresholds.excellentMatch ||
    thresholds.excellentMatch >= thresholds.perfectMatch
  ) {
    errors.push("Match thresholds must be in ascending order");
  }

  return errors;
}

module.exports = {
  getConfig,
  isFeatureEnabled,
  getAlgorithmWeights,
  validateConfig,
  default: aiConfig,
};
