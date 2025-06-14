// /client/src/redux/slices/smartMatchSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Async thunks for API calls
export const fetchSmartMatches = createAsyncThunk(
  "smartMatch/fetchMatches",
  async (
    { page = 1, limit = 10, minCompatibility = 30, includeInsights = false },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get("/matches/smart", {
        params: { page, limit, minCompatibility, includeInsights },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch matches"
      );
    }
  }
);

export const fetchMatchInsights = createAsyncThunk(
  "smartMatch/fetchInsights",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/matches/insights");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch insights"
      );
    }
  }
);

export const updateMatchPreferences = createAsyncThunk(
  "smartMatch/updatePreferences",
  async (preferences, { rejectWithValue }) => {
    try {
      const response = await api.put("/matches/preferences", preferences);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update preferences"
      );
    }
  }
);

export const createMatchRequest = createAsyncThunk(
  "smartMatch/createRequest",
  async ({ receiverId, message, skillsInvolved }, { rejectWithValue }) => {
    try {
      const response = await api.post("/matches/request", {
        receiverId,
        message,
        skillsInvolved,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create match request"
      );
    }
  }
);

export const rateMatch = createAsyncThunk(
  "smartMatch/rateMatch",
  async ({ matchId, rating, comment, skills }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/matches/${matchId}/rate`, {
        rating,
        comment,
        skills,
      });
      return { matchId, rating, response: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to rate match"
      );
    }
  }
);

// Initial state
const initialState = {
  // Match data
  matches: [],
  currentMatch: null,
  totalMatches: 0,

  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },

  // Filters and preferences
  filters: {
    minCompatibility: 30,
    page: 1,
    limit: 10,
    includeInsights: false,
  },

  preferences: {
    skillPreferences: {
      preferredCategories: [],
      excludedCategories: [],
      skillLevelPreference: "any",
      mutualExchangeOnly: false,
    },
    locationPreferences: {
      maxDistance: null,
      preferLocal: false,
      remoteOnly: false,
      preferredTimezones: [],
    },
    userPreferences: {
      experienceLevelRange: { min: "beginner", max: "expert" },
      minRating: 0,
      minReviewCount: 0,
      preferVerifiedUsers: false,
    },
    algorithmSettings: {
      prioritizeSkillMatch: 0.25,
      prioritizeExperience: 0.15,
      prioritizeLocation: 0.06,
      prioritizeAvailability: 0.12,
      prioritizeReputation: 0.1,
      showLowMatches: true,
      maxMatchesPerDay: 10,
    },
  },

  // Insights and analytics
  insights: {
    overview: {
      totalMatches: 0,
      successfulMatches: 0,
      successRate: 0,
      averageCompatibility: 0,
      averageRating: 0,
      completedSessions: 0,
    },
    topSkills: [],
    matchTypes: {},
    recommendations: [],
    trends: {
      last30Days: 0,
      averageResponseTime: 0,
      improvementAreas: [],
    },
    preferences: {
      customizationLevel: 0,
      effectivenessScore: 50,
    },
  },

  // UI state
  loading: {
    matches: false,
    insights: false,
    preferences: false,
    creating: false,
    rating: false,
  },

  error: {
    matches: null,
    insights: null,
    preferences: null,
    creating: null,
    rating: null,
  },

  // Cache information
  cached: false,
  lastFetch: null,

  // Match interaction state
  viewedMatches: [],
  likedMatches: [],
  rejectedMatches: [],

  // Algorithm feedback
  algorithmFeedback: {
    accuratePredictions: 0,
    inaccuratePredictions: 0,
    totalFeedback: 0,
  },
};

const smartMatchSlice = createSlice({
  name: "smartMatch",
  initialState,
  reducers: {
    // Filter and pagination actions
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    setPage: (state, action) => {
      state.filters.page = action.payload;
    },

    setMinCompatibility: (state, action) => {
      state.filters.minCompatibility = action.payload;
    },

    // Match interaction actions
    markMatchAsViewed: (state, action) => {
      if (!state.viewedMatches.includes(action.payload)) {
        state.viewedMatches.push(action.payload);
      }
    },

    likeMatch: (state, action) => {
      const matchId = action.payload;
      if (!state.likedMatches.includes(matchId)) {
        state.likedMatches.push(matchId);
      }
      state.rejectedMatches = state.rejectedMatches.filter(
        (id) => id !== matchId
      );
    },

    rejectMatch: (state, action) => {
      const matchId = action.payload;
      if (!state.rejectedMatches.includes(matchId)) {
        state.rejectedMatches.push(matchId);
      }
      state.likedMatches = state.likedMatches.filter((id) => id !== matchId);
    },

    // Current match selection
    setCurrentMatch: (state, action) => {
      state.currentMatch = action.payload;
    },

    clearCurrentMatch: (state) => {
      state.currentMatch = null;
    },

    // Preferences updates (local only)
    updateLocalPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },

    // Algorithm feedback
    provideFeedback: (state, action) => {
      const { accurate } = action.payload;
      if (accurate) {
        state.algorithmFeedback.accuratePredictions++;
      } else {
        state.algorithmFeedback.inaccuratePredictions++;
      }
      state.algorithmFeedback.totalFeedback++;
    },

    // Clear errors
    clearError: (state, action) => {
      const errorType = action.payload;
      if (errorType) {
        state.error[errorType] = null;
      } else {
        // Clear all errors
        Object.keys(state.error).forEach((key) => {
          state.error[key] = null;
        });
      }
    },

    // Clear matches (for refresh)
    clearMatches: (state) => {
      state.matches = [];
      state.totalMatches = 0;
      state.pagination = initialState.pagination;
    },

    // Reset state
    resetState: (state) => {
      return { ...initialState };
    },
  },

  extraReducers: (builder) => {
    // Fetch Smart Matches
    builder
      .addCase(fetchSmartMatches.pending, (state) => {
        state.loading.matches = true;
        state.error.matches = null;
      })
      .addCase(fetchSmartMatches.fulfilled, (state, action) => {
        state.loading.matches = false;
        const { data } = action.payload;

        // Handle different API response formats
        let matches = [];
        if (data?.matches) {
          matches = data.matches;
        } else if (Array.isArray(data)) {
          matches = data;
        } else if (data?.data) {
          matches = Array.isArray(data.data) ? data.data : [];
        }

        // If it's page 1, replace matches; otherwise append
        if (state.filters.page === 1) {
          state.matches = matches;
        } else {
          state.matches = [...state.matches, ...matches];
        }

        state.totalMatches = data?.pagination?.totalMatches || matches.length;
        state.pagination = data?.pagination || state.pagination;
        state.cached = action.payload.cached || false;
        state.lastFetch = new Date().toISOString();

        // Update insights if included
        if (data?.insights) {
          state.insights = { ...state.insights, ...data.insights };
        }
      })
      .addCase(fetchSmartMatches.rejected, (state, action) => {
        state.loading.matches = false;
        state.error.matches = action.payload;
      });

    // Fetch Match Insights
    builder
      .addCase(fetchMatchInsights.pending, (state) => {
        state.loading.insights = true;
        state.error.insights = null;
      })
      .addCase(fetchMatchInsights.fulfilled, (state, action) => {
        state.loading.insights = false;
        state.insights = action.payload.data;
        state.cached = action.payload.cached || false;
      })
      .addCase(fetchMatchInsights.rejected, (state, action) => {
        state.loading.insights = false;
        state.error.insights = action.payload;
      });

    // Update Match Preferences
    builder
      .addCase(updateMatchPreferences.pending, (state) => {
        state.loading.preferences = true;
        state.error.preferences = null;
      })
      .addCase(updateMatchPreferences.fulfilled, (state, action) => {
        state.loading.preferences = false;
        state.preferences = action.payload.data;
        // Clear matches to force refresh with new preferences
        state.matches = [];
        state.totalMatches = 0;
      })
      .addCase(updateMatchPreferences.rejected, (state, action) => {
        state.loading.preferences = false;
        state.error.preferences = action.payload;
      });

    // Create Match Request
    builder
      .addCase(createMatchRequest.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
      })
      .addCase(createMatchRequest.fulfilled, (state, action) => {
        state.loading.creating = false;
        // Remove the matched user from current matches
        const receiverId = action.meta.arg.receiverId;
        state.matches = state.matches.filter(
          (match) => match.user._id !== receiverId
        );
        state.totalMatches = Math.max(0, state.totalMatches - 1);
      })
      .addCase(createMatchRequest.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.payload;
      });

    // Rate Match
    builder
      .addCase(rateMatch.pending, (state) => {
        state.loading.rating = true;
        state.error.rating = null;
      })
      .addCase(rateMatch.fulfilled, (state, action) => {
        state.loading.rating = false;
        // Update insights to reflect new rating
        const { rating } = action.meta.arg;
        if (rating >= 4) {
          state.insights.overview.successfulMatches++;
        }
      })
      .addCase(rateMatch.rejected, (state, action) => {
        state.loading.rating = false;
        state.error.rating = action.payload;
      });
  },
});

// Export actions
export const {
  setFilters,
  setPage,
  setMinCompatibility,
  markMatchAsViewed,
  likeMatch,
  rejectMatch,
  setCurrentMatch,
  clearCurrentMatch,
  updateLocalPreferences,
  provideFeedback,
  clearError,
  clearMatches,
  resetState,
} = smartMatchSlice.actions;

// Selectors
export const selectMatches = (state) => state.smartMatch.matches;
export const selectCurrentMatch = (state) => state.smartMatch.currentMatch;
export const selectPagination = (state) => state.smartMatch.pagination;
export const selectFilters = (state) => state.smartMatch.filters;
export const selectPreferences = (state) => state.smartMatch.preferences;
export const selectInsights = (state) => state.smartMatch.insights;
export const selectLoading = (state) => state.smartMatch.loading;
export const selectError = (state) => state.smartMatch.error;
export const selectCached = (state) => state.smartMatch.cached;
export const selectViewedMatches = (state) => state.smartMatch.viewedMatches;
export const selectLikedMatches = (state) => state.smartMatch.likedMatches;
export const selectRejectedMatches = (state) =>
  state.smartMatch.rejectedMatches;
export const selectAlgorithmFeedback = (state) =>
  state.smartMatch.algorithmFeedback;

// Complex selectors
export const selectFilteredMatches = (state) => {
  const { matches, rejectedMatches } = state.smartMatch;
  return matches.filter((match) => !rejectedMatches.includes(match.user._id));
};

export const selectMatchesByType = (state) => {
  const matches = selectFilteredMatches(state);
  return matches.reduce((acc, match) => {
    const type = match.matchType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(match);
    return acc;
  }, {});
};

export const selectTopMatches = (state) => {
  const matches = selectFilteredMatches(state);
  return matches.filter((match) => match.compatibilityScore >= 70).slice(0, 5);
};

export const selectRecommendationPriority = (state) => {
  const { recommendations } = state.smartMatch.insights;
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
  });
};

export const selectAlgorithmAccuracy = (state) => {
  const { accuratePredictions, totalFeedback } =
    state.smartMatch.algorithmFeedback;
  return totalFeedback > 0 ? (accuratePredictions / totalFeedback) * 100 : 0;
};

export default smartMatchSlice.reducer;
export const selectSmartMatches = (state) => state.smartMatch.matches;
export const selectSmartMatchesLoading = (state) =>
  state.smartMatch.loading.matches;
export const selectSmartMatchesError = (state) =>
  state.smartMatch.error.matches;
export const clearSmartMatches = clearMatches; // Alias for existing action
