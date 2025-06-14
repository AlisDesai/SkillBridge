// /server/middleware/aiCache.js

const redis = require("redis");
const crypto = require("crypto");

class AICache {
  constructor() {
    this.client = null;
    this.isRedisAvailable = false;
    this.memoryCache = new Map();
    this.maxMemoryCacheSize = 1000;
    this.defaultTTL = 3600; // 1 hour in seconds

    // Only initialize Redis if not explicitly set to memory
    if (process.env.CACHE_PROVIDER !== "memory") {
      this.initializeRedis();
    }
  }

  async initializeRedis() {
    try {
      // Try to connect to Redis if available
      this.client = redis.createClient({
        socket: {
          host: process.env.REDIS_HOST || "localhost",
          port: process.env.REDIS_PORT || 6379,
        },
        password: process.env.REDIS_PASSWORD,
        database: process.env.REDIS_DB || 0,
      });

      this.client.on("ready", () => {
        this.isRedisAvailable = true;
        console.log("✅ Redis connected for AI caching");
      });

      this.client.on("error", (err) => {
        this.isRedisAvailable = false;
        console.log("⚠️  Redis unavailable, using memory cache:", err.message);
      });

      // Connect to Redis
      await this.client.connect().catch(() => {
        this.isRedisAvailable = false;
      });
    } catch (error) {
      console.log("⚠️  Redis setup failed, using memory cache:", error.message);
      this.isRedisAvailable = false;
    }
  }

  // Generate cache key for matching algorithm
  generateMatchCacheKey(userId, potentialMatches, preferences = {}) {
    const potentialIds = potentialMatches.map((u) => u._id.toString()).sort();
    const prefsHash = this.hashObject(preferences);
    const dataString = `match:${userId}:${potentialIds.join(",")}:${prefsHash}`;
    return crypto.createHash("md5").update(dataString).digest("hex");
  }

  // Generate cache key for skill similarity
  generateSkillCacheKey(skill1, skill2) {
    const normalizedSkill1 = this.normalizeSkillForCache(skill1);
    const normalizedSkill2 = this.normalizeSkillForCache(skill2);
    const combined = [normalizedSkill1, normalizedSkill2].sort().join("|");
    return `skill:${crypto.createHash("md5").update(combined).digest("hex")}`;
  }

  // Generate cache key for user analytics
  generateAnalyticsCacheKey(userId, type, params = {}) {
    const paramsHash = this.hashObject(params);
    return `analytics:${type}:${userId}:${paramsHash}`;
  }

  // Normalize skill object for consistent caching
  normalizeSkillForCache(skill) {
    return JSON.stringify({
      name: (skill.name || "").toLowerCase().trim(),
      category: (skill.category || "").toLowerCase().trim(),
      level: (skill.level || "").toLowerCase().trim(),
      tags: (skill.tags || []).map((tag) => tag.toLowerCase().trim()).sort(),
    });
  }

  // Hash object for cache key generation
  hashObject(obj) {
    const string = JSON.stringify(obj, Object.keys(obj).sort());
    return crypto.createHash("md5").update(string).digest("hex");
  }

  // Get from cache
  async get(key) {
    try {
      if (this.isRedisAvailable && this.client) {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
      } else {
        // Use memory cache
        const item = this.memoryCache.get(key);
        if (item && item.expiry > Date.now()) {
          return item.value;
        } else if (item) {
          this.memoryCache.delete(key);
        }
        return null;
      }
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  // Set in cache
  async set(key, value, ttl = this.defaultTTL) {
    try {
      if (this.isRedisAvailable && this.client) {
        await this.client.setex(key, ttl, JSON.stringify(value));
      } else {
        // Use memory cache
        this.cleanupMemoryCache();
        this.memoryCache.set(key, {
          value,
          expiry: Date.now() + ttl * 1000,
        });
      }
    } catch (error) {
      console.error("Cache set error:", error);
    }
  }

  // Delete from cache
  async delete(key) {
    try {
      if (this.isRedisAvailable && this.client) {
        await this.client.del(key);
      } else {
        this.memoryCache.delete(key);
      }
    } catch (error) {
      console.error("Cache delete error:", error);
    }
  }

  // Clear cache by pattern
  async clearPattern(pattern) {
    try {
      if (this.isRedisAvailable && this.client) {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          await this.client.del(keys);
        }
      } else {
        // Clear memory cache by pattern
        for (const key of this.memoryCache.keys()) {
          if (key.includes(pattern.replace("*", ""))) {
            this.memoryCache.delete(key);
          }
        }
      }
    } catch (error) {
      console.error("Cache clear pattern error:", error);
    }
  }

  // Cleanup memory cache when it gets too large
  cleanupMemoryCache() {
    if (this.memoryCache.size >= this.maxMemoryCacheSize) {
      // Remove expired items first
      const now = Date.now();
      for (const [key, item] of this.memoryCache.entries()) {
        if (item.expiry <= now) {
          this.memoryCache.delete(key);
        }
      }

      // If still too large, remove oldest items
      if (this.memoryCache.size >= this.maxMemoryCacheSize) {
        const entries = Array.from(this.memoryCache.entries());
        const toRemove = entries.slice(
          0,
          Math.floor(this.maxMemoryCacheSize * 0.3)
        );
        toRemove.forEach(([key]) => this.memoryCache.delete(key));
      }
    }
  }

  // Cache match results
  async cacheMatchResults(userId, potentialMatches, results, preferences = {}) {
    const key = this.generateMatchCacheKey(
      userId,
      potentialMatches,
      preferences
    );
    await this.set(
      key,
      {
        results,
        timestamp: Date.now(),
        userId,
        matchCount: results.length,
      },
      1800
    ); // 30 minutes TTL for match results
  }

  // Get cached match results
  async getCachedMatchResults(userId, potentialMatches, preferences = {}) {
    const key = this.generateMatchCacheKey(
      userId,
      potentialMatches,
      preferences
    );
    return await this.get(key);
  }

  // Cache skill similarity
  async cacheSkillSimilarity(skill1, skill2, similarity) {
    const key = this.generateSkillCacheKey(skill1, skill2);
    await this.set(
      key,
      {
        similarity,
        skill1: this.normalizeSkillForCache(skill1),
        skill2: this.normalizeSkillForCache(skill2),
        timestamp: Date.now(),
      },
      86400
    ); // 24 hours TTL for skill similarities
  }

  // Get cached skill similarity
  async getCachedSkillSimilarity(skill1, skill2) {
    const key = this.generateSkillCacheKey(skill1, skill2);
    const cached = await this.get(key);
    return cached ? cached.similarity : null;
  }

  // Cache user analytics
  async cacheUserAnalytics(userId, type, data, params = {}) {
    const key = this.generateAnalyticsCacheKey(userId, type, params);
    await this.set(
      key,
      {
        data,
        timestamp: Date.now(),
        type,
        userId,
      },
      3600
    ); // 1 hour TTL for analytics
  }

  // Get cached user analytics
  async getCachedUserAnalytics(userId, type, params = {}) {
    const key = this.generateAnalyticsCacheKey(userId, type, params);
    const cached = await this.get(key);
    return cached ? cached.data : null;
  }

  // Invalidate user-related caches when user data changes
  async invalidateUserCaches(userId) {
    await this.clearPattern(`match:${userId}:*`);
    await this.clearPattern(`analytics:*:${userId}:*`);
  }

  // Invalidate skill-related caches when skills change
  async invalidateSkillCaches(skill) {
    const normalizedSkill = this.normalizeSkillForCache(skill);
    await this.clearPattern(`skill:*${normalizedSkill}*`);
  }

  // Get cache statistics
  async getCacheStats() {
    const stats = {
      type: this.isRedisAvailable ? "redis" : "memory",
      isRedisAvailable: this.isRedisAvailable,
    };

    if (this.isRedisAvailable && this.client) {
      try {
        const info = await this.client.info("memory");
        stats.redisMemoryUsage = info;
      } catch (error) {
        stats.redisError = error.message;
      }
    } else {
      stats.memoryCacheSize = this.memoryCache.size;
      stats.maxMemoryCacheSize = this.maxMemoryCacheSize;

      // Calculate memory usage estimate
      let estimatedSize = 0;
      for (const [key, item] of this.memoryCache.entries()) {
        estimatedSize += key.length + JSON.stringify(item).length;
      }
      stats.estimatedMemoryUsage = `${(estimatedSize / 1024).toFixed(2)} KB`;
    }

    return stats;
  }

  // Close connections
  async close() {
    if (this.client && this.isRedisAvailable) {
      await this.client.quit();
    }
    this.memoryCache.clear();
  }
}

// Create singleton instance
const aiCache = new AICache();

// Middleware function for caching match results
const cacheMatchResults = (ttl = 1800) => {
  return async (req, res, next) => {
    const { userId } = req.params;
    const cacheKey = `api:matches:${userId}:${aiCache.hashObject(req.query)}`;

    try {
      const cached = await aiCache.get(cacheKey);
      if (cached) {
        console.log(`🚀 Cache hit for matches: ${userId}`);
        return res.json(cached);
      }

      // Store original res.json
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = function (data) {
        if (res.statusCode === 200 && data.success) {
          aiCache.set(cacheKey, data, ttl).catch(console.error);
        }
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error("Cache middleware error:", error);
      next();
    }
  };
};

// Middleware function for caching user analytics
const cacheAnalytics = (ttl = 3600) => {
  return async (req, res, next) => {
    const userId = req.user?._id || req.params.userId;
    const cacheKey = `api:analytics:${userId}:${
      req.route.path
    }:${aiCache.hashObject(req.query)}`;

    try {
      const cached = await aiCache.get(cacheKey);
      if (cached) {
        console.log(`📊 Cache hit for analytics: ${userId}`);
        return res.json(cached);
      }

      const originalJson = res.json.bind(res);
      res.json = function (data) {
        if (res.statusCode === 200 && data.success) {
          aiCache.set(cacheKey, data, ttl).catch(console.error);
        }
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error("Analytics cache middleware error:", error);
      next();
    }
  };
};

// Middleware to invalidate caches on data changes
const invalidateOnUpdate = (cachePatterns = []) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = function (data) {
      if (res.statusCode === 200 && data.success) {
        // Invalidate specified cache patterns
        cachePatterns.forEach((pattern) => {
          const finalPattern = pattern.replace(
            ":userId",
            req.user?._id || req.params.userId
          );
          aiCache.clearPattern(finalPattern).catch(console.error);
        });
      }
      return originalJson(data);
    };

    next();
  };
};

module.exports = {
  aiCache,
  cacheMatchResults,
  cacheAnalytics,
  invalidateOnUpdate,
};
