import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Initial state
const initialState = {
  // Admin stats
  adminStats: null,

  // System health and analytics
  systemHealth: null,
  userAnalytics: null,

  // Users management
  users: [],
  usersPagination: {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },

  // Reviews management
  adminReviews: [],
  reviewsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },

  // Skills management
  adminSkills: [],
  skillsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalSkills: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  skillStatistics: [],

  // Loading states
  loading: false,
  usersLoading: false,
  reviewsLoading: false,
  skillsLoading: false,
  healthLoading: false,
  analyticsLoading: false,

  // Action states
  creating: false,
  updating: false,
  deleting: false,

  // Error state
  error: null,
};

// Async thunks
export const fetchAdminStatsAsync = createAsyncThunk(
  "admin/fetchAdminStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/stats");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch admin statistics";
      return rejectWithValue({ message });
    }
  }
);

export const fetchSystemHealthAsync = createAsyncThunk(
  "admin/fetchSystemHealth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/system-health");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch system health";
      return rejectWithValue({ message });
    }
  }
);

export const fetchUserAnalyticsAsync = createAsyncThunk(
  "admin/fetchUserAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/user-analytics");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch user analytics";
      return rejectWithValue({ message });
    }
  }
);

export const fetchUsersAsync = createAsyncThunk(
  "admin/fetchUsers",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/admin/users?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch users";
      return rejectWithValue({ message });
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  "admin/updateUser",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update user";
      return rejectWithValue({ message });
    }
  }
);

export const deleteUserAsync = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      return userId;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete user";
      return rejectWithValue({ message });
    }
  }
);

export const fetchAdminReviewsAsync = createAsyncThunk(
  "admin/fetchAdminReviews",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/admin/reviews?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch reviews";
      return rejectWithValue({ message });
    }
  }
);

export const deleteAdminReviewAsync = createAsyncThunk(
  "admin/deleteAdminReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/reviews/${reviewId}`);
      return reviewId;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete review";
      return rejectWithValue({ message });
    }
  }
);

export const fetchAdminSkillsAsync = createAsyncThunk(
  "admin/fetchAdminSkills",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/admin/skills?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch skills";
      return rejectWithValue({ message });
    }
  }
);

export const deleteAdminSkillAsync = createAsyncThunk(
  "admin/deleteAdminSkill",
  async (skillId, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/skills/${skillId}`);
      return skillId;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete skill";
      return rejectWithValue({ message });
    }
  }
);

// Helper functions
const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.usersLoading = false;
  state.reviewsLoading = false;
  state.skillsLoading = false;
  state.healthLoading = false;
  state.analyticsLoading = false;
  state.creating = false;
  state.updating = false;
  state.deleting = false;
  state.error = action.payload?.message || "An error occurred";
};

// Slice
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
    },

    // Clear all admin data (useful for logout)
    clearAdminData: (state) => {
      return initialState;
    },

    // Set loading states manually if needed
    setLoading: (state, action) => {
      const { type, value } = action.payload;
      if (type === "users") state.usersLoading = value;
      else if (type === "reviews") state.reviewsLoading = value;
      else if (type === "skills") state.skillsLoading = value;
      else if (type === "health") state.healthLoading = value;
      else if (type === "analytics") state.analyticsLoading = value;
      else state.loading = value;
    },

    // Update user in list (optimistic update)
    updateUserInList: (state, action) => {
      const { userId, updates } = action.payload;
      const userIndex = state.users.findIndex((u) => u._id === userId);
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...updates };
      }
    },

    // Remove user from list (optimistic delete)
    removeUserFromList: (state, action) => {
      const userId = action.payload;
      state.users = state.users.filter((u) => u._id !== userId);
      if (state.usersPagination.totalUsers > 0) {
        state.usersPagination.totalUsers -= 1;
      }
    },

    // Remove review from list (optimistic delete)
    removeReviewFromList: (state, action) => {
      const reviewId = action.payload;
      state.adminReviews = state.adminReviews.filter((r) => r._id !== reviewId);
      if (state.reviewsPagination.totalReviews > 0) {
        state.reviewsPagination.totalReviews -= 1;
      }
    },

    // Remove skill from list (optimistic delete)
    removeSkillFromList: (state, action) => {
      const skillId = action.payload;
      state.adminSkills = state.adminSkills.filter((s) => s._id !== skillId);
      if (state.skillsPagination.totalSkills > 0) {
        state.skillsPagination.totalSkills -= 1;
      }
    },

    // Update stats after actions
    updateStatsAfterAction: (state, action) => {
      const { type, increment = false } = action.payload;
      if (state.adminStats?.overview) {
        if (type === "user") {
          state.adminStats.overview.totalUsers += increment ? 1 : -1;
        } else if (type === "review") {
          state.adminStats.overview.totalReviews += increment ? 1 : -1;
        } else if (type === "skill") {
          state.adminStats.overview.totalSkills += increment ? 1 : -1;
        }
      }
    },
  },

  extraReducers: (builder) => {
    // Fetch Admin Stats
    builder
      .addCase(fetchAdminStatsAsync.pending, handlePending)
      .addCase(fetchAdminStatsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.adminStats = action.payload;
      })
      .addCase(fetchAdminStatsAsync.rejected, handleRejected);

    // Fetch System Health
    builder
      .addCase(fetchSystemHealthAsync.pending, (state) => {
        state.healthLoading = true;
        state.error = null;
      })
      .addCase(fetchSystemHealthAsync.fulfilled, (state, action) => {
        state.healthLoading = false;
        state.systemHealth = action.payload;
      })
      .addCase(fetchSystemHealthAsync.rejected, handleRejected);

    // Fetch User Analytics
    builder
      .addCase(fetchUserAnalyticsAsync.pending, (state) => {
        state.analyticsLoading = true;
        state.error = null;
      })
      .addCase(fetchUserAnalyticsAsync.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.userAnalytics = action.payload;
      })
      .addCase(fetchUserAnalyticsAsync.rejected, handleRejected);

    // Fetch Users
    builder
      .addCase(fetchUsersAsync.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.users || [];
        state.usersPagination =
          action.payload.pagination || initialState.usersPagination;
      })
      .addCase(fetchUsersAsync.rejected, handleRejected);

    // Update User
    builder
      .addCase(updateUserAsync.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.updating = false;
        const updatedUser = action.payload;
        const userIndex = state.users.findIndex(
          (u) => u._id === updatedUser._id
        );
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload?.message || "Failed to update user";
      });

    // Delete User
    builder
      .addCase(deleteUserAsync.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.deleting = false;
        const userId = action.payload;
        state.users = state.users.filter((u) => u._id !== userId);
        if (state.usersPagination.totalUsers > 0) {
          state.usersPagination.totalUsers -= 1;
        }
        // Update stats
        if (state.adminStats?.overview?.totalUsers > 0) {
          state.adminStats.overview.totalUsers -= 1;
        }
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload?.message || "Failed to delete user";
      });

    // Fetch Admin Reviews
    builder
      .addCase(fetchAdminReviewsAsync.pending, (state) => {
        state.reviewsLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminReviewsAsync.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.adminReviews = action.payload.reviews || [];
        state.reviewsPagination =
          action.payload.pagination || initialState.reviewsPagination;
      })
      .addCase(fetchAdminReviewsAsync.rejected, handleRejected);

    // Delete Admin Review
    builder
      .addCase(deleteAdminReviewAsync.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteAdminReviewAsync.fulfilled, (state, action) => {
        state.deleting = false;
        const reviewId = action.payload;
        state.adminReviews = state.adminReviews.filter(
          (r) => r._id !== reviewId
        );
        if (state.reviewsPagination.totalReviews > 0) {
          state.reviewsPagination.totalReviews -= 1;
        }
        // Update stats
        if (state.adminStats?.overview?.totalReviews > 0) {
          state.adminStats.overview.totalReviews -= 1;
        }
      })
      .addCase(deleteAdminReviewAsync.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload?.message || "Failed to delete review";
      });

    // Fetch Admin Skills
    builder
      .addCase(fetchAdminSkillsAsync.pending, (state) => {
        state.skillsLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminSkillsAsync.fulfilled, (state, action) => {
        state.skillsLoading = false;
        state.adminSkills = action.payload.skills || [];
        state.skillsPagination =
          action.payload.pagination || initialState.skillsPagination;
        state.skillStatistics = action.payload.statistics || [];
      })
      .addCase(fetchAdminSkillsAsync.rejected, handleRejected);

    // Delete Admin Skill
    builder
      .addCase(deleteAdminSkillAsync.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteAdminSkillAsync.fulfilled, (state, action) => {
        state.deleting = false;
        const skillId = action.payload;
        state.adminSkills = state.adminSkills.filter((s) => s._id !== skillId);
        if (state.skillsPagination.totalSkills > 0) {
          state.skillsPagination.totalSkills -= 1;
        }
        // Update stats
        if (state.adminStats?.overview?.totalSkills > 0) {
          state.adminStats.overview.totalSkills -= 1;
        }
      })
      .addCase(deleteAdminSkillAsync.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload?.message || "Failed to delete skill";
      });
  },
});

// Export actions
export const {
  clearError,
  clearAdminData,
  setLoading,
  updateUserInList,
  removeUserFromList,
  removeReviewFromList,
  removeSkillFromList,
  updateStatsAfterAction,
} = adminSlice.actions;

// Selectors
export const selectAdminStats = (state) => state.admin.adminStats;
export const selectSystemHealth = (state) => state.admin.systemHealth;
export const selectUserAnalytics = (state) => state.admin.userAnalytics;
export const selectUsers = (state) => state.admin.users;
export const selectUsersPagination = (state) => state.admin.usersPagination;
export const selectAdminReviews = (state) => state.admin.adminReviews;
export const selectReviewsPagination = (state) => state.admin.reviewsPagination;
export const selectAdminSkills = (state) => state.admin.adminSkills;
export const selectSkillsPagination = (state) => state.admin.skillsPagination;
export const selectSkillStatistics = (state) => state.admin.skillStatistics;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectUsersLoading = (state) => state.admin.usersLoading;
export const selectReviewsLoading = (state) => state.admin.reviewsLoading;
export const selectSkillsLoading = (state) => state.admin.skillsLoading;
export const selectHealthLoading = (state) => state.admin.healthLoading;
export const selectAnalyticsLoading = (state) => state.admin.analyticsLoading;
export const selectAdminError = (state) => state.admin.error;
export const selectIsCreating = (state) => state.admin.creating;
export const selectIsUpdating = (state) => state.admin.updating;
export const selectIsDeleting = (state) => state.admin.deleting;

// Export reducer
export default adminSlice.reducer;
