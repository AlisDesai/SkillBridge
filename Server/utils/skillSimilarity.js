// /server/utils/skillSimilarity.js

class SkillSimilarity {
  /**
   * Calculate similarity between two skills using multiple algorithms
   * @param {Object} skill1 - First skill object {name, category, tags, level}
   * @param {Object} skill2 - Second skill object {name, category, tags, level}
   * @returns {Number} Similarity score between 0 and 1
   */
  static calculateSkillSimilarity(skill1, skill2) {
    if (!skill1 || !skill2) return 0;

    // Handle both string and object formats
    const name1 =
      typeof skill1 === "string"
        ? skill1.toLowerCase().trim()
        : (skill1.name || skill1.skillName || "").toLowerCase().trim();
    const name2 =
      typeof skill2 === "string"
        ? skill2.toLowerCase().trim()
        : (skill2.name || skill2.skillName || "").toLowerCase().trim();

    // Exact match gets highest score
    if (name1 === name2) return 1.0;

    // Category-based similarity
    const categoryScore = this.calculateCategorySimilarity(skill1, skill2);

    // Name-based similarity using multiple algorithms
    const nameScore = this.calculateNameSimilarity(name1, name2);

    // Tag-based similarity
    const tagScore = this.calculateTagSimilarity(skill1, skill2);

    // Level compatibility
    const levelScore = this.calculateLevelCompatibility(skill1, skill2);

    // Weighted final score
    const weights = {
      category: 0.3,
      name: 0.4,
      tags: 0.2,
      level: 0.1,
    };

    return (
      categoryScore * weights.category +
      nameScore * weights.name +
      tagScore * weights.tags +
      levelScore * weights.level
    );
  }

  /**
   * Calculate category-based similarity
   */
  static calculateCategorySimilarity(skill1, skill2) {
    const cat1 =
      typeof skill1 === "string" ? "" : (skill1.category || "").toLowerCase();
    const cat2 =
      typeof skill2 === "string" ? "" : (skill2.category || "").toLowerCase();

    if (!cat1 || !cat2) return 0.3; // Neutral if no category
    if (cat1 === cat2) return 1.0;

    // Check for related categories
    const relatedCategories = this.getRelatedCategories();

    if (relatedCategories[cat1] && relatedCategories[cat1].includes(cat2)) {
      return 0.7; // Related categories get high score
    }

    return 0.1; // Different categories get low score
  }

  /**
   * Calculate name-based similarity using multiple string algorithms
   */
  static calculateNameSimilarity(name1, name2) {
    if (!name1 || !name2) return 0;

    // Exact substring match
    if (name1.includes(name2) || name2.includes(name1)) {
      return 0.9;
    }

    // Levenshtein distance similarity
    const levenshteinScore = this.calculateLevenshteinSimilarity(name1, name2);

    // Jaccard similarity using word tokens
    const jaccardScore = this.calculateJaccardSimilarity(name1, name2);

    // Fuzzy matching for common abbreviations/variations
    const fuzzyScore = this.calculateFuzzyMatch(name1, name2);

    // Take the highest score from different algorithms
    return Math.max(levenshteinScore, jaccardScore, fuzzyScore);
  }

  /**
   * Calculate tag-based similarity
   */
  static calculateTagSimilarity(skill1, skill2) {
    const tags1 = typeof skill1 === "string" ? [] : skill1.tags || [];
    const tags2 = typeof skill2 === "string" ? [] : skill2.tags || [];

    if (tags1.length === 0 && tags2.length === 0) return 0.5;
    if (tags1.length === 0 || tags2.length === 0) return 0.3;

    const commonTags = tags1.filter((tag) =>
      tags2.some((tag2) => tag.toLowerCase() === tag2.toLowerCase())
    );

    const totalUniqueTags = new Set([...tags1, ...tags2]).size;

    return commonTags.length / totalUniqueTags;
  }

  /**
   * Calculate level compatibility
   */
  static calculateLevelCompatibility(skill1, skill2) {
    const levelMap = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      expert: 4,
    };

    const level1 =
      typeof skill1 === "string"
        ? 2
        : levelMap[skill1.level?.toLowerCase()] || 2;
    const level2 =
      typeof skill2 === "string"
        ? 2
        : levelMap[skill2.level?.toLowerCase()] || 2;

    const difference = Math.abs(level1 - level2);

    // Similar levels get higher compatibility
    if (difference === 0) return 1.0;
    if (difference === 1) return 0.8;
    if (difference === 2) return 0.6;
    return 0.4;
  }

  /**
   * Levenshtein distance similarity
   */
  static calculateLevenshteinSimilarity(str1, str2) {
    const distance = this.levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);

    if (maxLength === 0) return 1.0;

    return Math.max(0, 1 - distance / maxLength);
  }

  /**
   * Levenshtein distance algorithm
   */
  static levenshteinDistance(str1, str2) {
    const matrix = [];
    const n = str1.length;
    const m = str2.length;

    if (n === 0) return m;
    if (m === 0) return n;

    // Initialize matrix
    for (let i = 0; i <= n; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= m; j++) {
      matrix[0][j] = j;
    }

    // Fill matrix
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    return matrix[n][m];
  }

  /**
   * Jaccard similarity using word tokens
   */
  static calculateJaccardSimilarity(str1, str2) {
    const words1 = new Set(str1.toLowerCase().split(/\s+/));
    const words2 = new Set(str2.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
  }

  /**
   * Fuzzy matching for common skill variations
   */
  static calculateFuzzyMatch(name1, name2) {
    const skillAliases = this.getSkillAliases();

    // Check if skills are known aliases
    for (const [canonical, aliases] of Object.entries(skillAliases)) {
      const isName1Match = canonical === name1 || aliases.includes(name1);
      const isName2Match = canonical === name2 || aliases.includes(name2);

      if (isName1Match && isName2Match) {
        return 0.95; // High score for known aliases
      }
    }

    // Check for common patterns
    const patterns = [
      { pattern: /^(.+)\s?(programming|coding|development)$/, weight: 0.8 },
      { pattern: /^(.+)\s?(design|designer)$/, weight: 0.8 },
      { pattern: /^(.+)\s?(language|lang)$/, weight: 0.9 },
      { pattern: /^(.+)\s?(framework|library)$/, weight: 0.8 },
    ];

    for (const { pattern, weight } of patterns) {
      const match1 = name1.match(pattern);
      const match2 = name2.match(pattern);

      if (match1 && match2 && match1[1] === match2[1]) {
        return weight;
      }
    }

    return 0;
  }

  /**
   * Get related skill categories
   */
  static getRelatedCategories() {
    return {
      programming: [
        "web development",
        "mobile development",
        "software development",
        "coding",
      ],
      "web development": ["programming", "frontend", "backend", "full-stack"],
      "mobile development": [
        "programming",
        "ios development",
        "android development",
      ],
      design: ["ui design", "ux design", "graphic design", "web design"],
      "ui design": ["design", "ux design", "frontend"],
      "ux design": ["design", "ui design", "product design"],
      "data science": [
        "machine learning",
        "analytics",
        "statistics",
        "programming",
      ],
      "machine learning": ["data science", "ai", "programming", "statistics"],
      marketing: ["digital marketing", "social media", "content marketing"],
      "digital marketing": ["marketing", "seo", "social media marketing"],
      photography: ["photo editing", "videography", "visual arts"],
      music: ["music production", "audio editing", "sound design"],
      language: ["translation", "writing", "communication"],
      business: ["entrepreneurship", "management", "finance"],
      teaching: ["education", "training", "mentoring"],
    };
  }

  /**
   * Get common skill aliases and variations
   */
  static getSkillAliases() {
    return {
      javascript: ["js", "ecmascript", "node.js", "nodejs"],
      python: ["py", "python3", "python programming"],
      react: ["reactjs", "react.js", "react framework"],
      angular: ["angularjs", "angular.js", "angular framework"],
      vue: ["vuejs", "vue.js", "vue framework"],
      css: ["cascading style sheets", "css3", "stylesheets"],
      html: ["html5", "markup", "hypertext markup"],
      photoshop: ["ps", "adobe photoshop", "photo editing"],
      illustrator: ["ai", "adobe illustrator", "vector design"],
      figma: ["figma design", "ui design tool"],
      sketch: ["sketch app", "sketch design"],
      wordpress: ["wp", "wordpress development"],
      mysql: ["my sql", "mysql database"],
      postgresql: ["postgres", "psql"],
      mongodb: ["mongo", "mongo db"],
      git: ["version control", "github", "gitlab"],
      docker: ["containerization", "containers"],
      aws: ["amazon web services", "amazon aws"],
      "google analytics": ["ga", "web analytics"],
      seo: ["search engine optimization", "search optimization"],
      "social media marketing": ["smm", "social marketing"],
      "content writing": ["copywriting", "blog writing"],
      "graphic design": ["graphics", "visual design"],
      "video editing": ["video production", "film editing"],
      excel: ["microsoft excel", "spreadsheets"],
      powerpoint: ["microsoft powerpoint", "presentations"],
      "project management": ["pm", "project coordination"],
    };
  }

  /**
   * Find similar skills in a skill database
   * @param {Object} targetSkill - Skill to find matches for
   * @param {Array} skillDatabase - Array of skills to search in
   * @param {Number} threshold - Minimum similarity threshold (0-1)
   * @returns {Array} Array of matching skills with similarity scores
   */
  static findSimilarSkills(targetSkill, skillDatabase, threshold = 0.6) {
    return skillDatabase
      .map((skill) => ({
        skill,
        similarity: this.calculateSkillSimilarity(targetSkill, skill),
      }))
      .filter((result) => result.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * Calculate skill compatibility matrix for a user
   * @param {Array} teachSkills - Skills user can teach
   * @param {Array} learnSkills - Skills user wants to learn
   * @param {Array} otherUserTeachSkills - Other user's teaching skills
   * @param {Array} otherUserLearnSkills - Other user's learning skills
   * @returns {Object} Compatibility analysis
   */
  static calculateSkillCompatibility(
    teachSkills,
    learnSkills,
    otherUserTeachSkills,
    otherUserLearnSkills
  ) {
    const compatibilityMatrix = {
      canTeachThem: [],
      canLearnFrom: [],
      mutualInterests: [],
      overallScore: 0,
    };

    // What current user can teach to other user
    learnSkills.forEach((learnSkill) => {
      teachSkills.forEach((teachSkill) => {
        const similarity = this.calculateSkillSimilarity(
          learnSkill,
          teachSkill
        );
        if (similarity > 0.6) {
          compatibilityMatrix.canTeachThem.push({
            theyWant: learnSkill,
            youTeach: teachSkill,
            similarity,
            reason: `You can teach ${teachSkill.name} which matches their interest in ${learnSkill.name}`,
          });
        }
      });
    });

    // What current user can learn from other user
    learnSkills.forEach((learnSkill) => {
      otherUserTeachSkills.forEach((theirTeachSkill) => {
        const similarity = this.calculateSkillSimilarity(
          learnSkill,
          theirTeachSkill
        );
        if (similarity > 0.6) {
          compatibilityMatrix.canLearnFrom.push({
            youWant: learnSkill,
            theyTeach: theirTeachSkill,
            similarity,
            reason: `They can teach ${theirTeachSkill.name} which matches your interest in ${learnSkill.name}`,
          });
        }
      });
    });

    // Mutual learning interests
    learnSkills.forEach((yourLearn) => {
      otherUserLearnSkills.forEach((theirLearn) => {
        const similarity = this.calculateSkillSimilarity(yourLearn, theirLearn);
        if (similarity > 0.7) {
          compatibilityMatrix.mutualInterests.push({
            skill: yourLearn,
            similarity,
            reason: `Both interested in learning ${yourLearn.name}`,
          });
        }
      });
    });

    // Calculate overall compatibility score
    const teachWeight = 0.4;
    const learnWeight = 0.4;
    const mutualWeight = 0.2;

    const avgTeachScore =
      compatibilityMatrix.canTeachThem.length > 0
        ? compatibilityMatrix.canTeachThem.reduce(
            (sum, match) => sum + match.similarity,
            0
          ) / compatibilityMatrix.canTeachThem.length
        : 0;

    const avgLearnScore =
      compatibilityMatrix.canLearnFrom.length > 0
        ? compatibilityMatrix.canLearnFrom.reduce(
            (sum, match) => sum + match.similarity,
            0
          ) / compatibilityMatrix.canLearnFrom.length
        : 0;

    const avgMutualScore =
      compatibilityMatrix.mutualInterests.length > 0
        ? compatibilityMatrix.mutualInterests.reduce(
            (sum, match) => sum + match.similarity,
            0
          ) / compatibilityMatrix.mutualInterests.length
        : 0;

    compatibilityMatrix.overallScore = Math.min(
      1,
      avgTeachScore * teachWeight +
        avgLearnScore * learnWeight +
        avgMutualScore * mutualWeight
    );

    return compatibilityMatrix;
  }

  /**
   * Generate human-readable reasons for skill compatibility
   * @param {Object} compatibilityMatrix - Result from calculateSkillCompatibility
   * @returns {Array} Array of reason strings
   */
  static generateCompatibilityReasons(compatibilityMatrix) {
    const reasons = [];

    // Teaching opportunities
    if (compatibilityMatrix.canTeachThem.length > 0) {
      const topMatches = compatibilityMatrix.canTeachThem
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 2);

      topMatches.forEach((match) => {
        reasons.push(
          `You can help them learn ${match.theyWant.name} with your ${match.youTeach.name} expertise`
        );
      });
    }

    // Learning opportunities
    if (compatibilityMatrix.canLearnFrom.length > 0) {
      const topMatches = compatibilityMatrix.canLearnFrom
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 2);

      topMatches.forEach((match) => {
        reasons.push(
          `They can teach you ${match.theyTeach.name} which you want to learn`
        );
      });
    }

    // Mutual interests
    if (compatibilityMatrix.mutualInterests.length > 0) {
      const topMutual = compatibilityMatrix.mutualInterests[0];
      reasons.push(
        `Both of you are interested in learning ${topMutual.skill.name}`
      );
    }

    // Skill exchange potential
    if (
      compatibilityMatrix.canTeachThem.length > 0 &&
      compatibilityMatrix.canLearnFrom.length > 0
    ) {
      reasons.push(
        `Perfect for skill exchange - mutual teaching and learning opportunities`
      );
    }

    // High compatibility score
    if (compatibilityMatrix.overallScore > 0.8) {
      reasons.push(
        `Exceptional skill compatibility match (${Math.round(
          compatibilityMatrix.overallScore * 100
        )}%)`
      );
    } else if (compatibilityMatrix.overallScore > 0.6) {
      reasons.push(
        `Strong skill compatibility (${Math.round(
          compatibilityMatrix.overallScore * 100
        )}%)`
      );
    }

    return reasons.length > 0
      ? reasons
      : ["Skills have potential for collaboration"];
  }
}

module.exports = SkillSimilarity;
