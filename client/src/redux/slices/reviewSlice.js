import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Initial state
const initialState = {
  reviews: [],
  givenReviews: [],
  reviewStats: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  statistics: {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: [],
  },
  loading: false,
  error: null,
  creating: false,
  updating: false,
  deleting: false,
};

// Async thunks
export const createReviewAsync = createAsyncThunk(
  "review/createReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await api.post("/reviews", reviewData);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to create review";
      return rejectWithValue({ message });
    }
  }
);

export const fetchUserReviewsAsync = createAsyncThunk(
  "review/fetchUserReviews",
  async ({ userId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/reviews/user/${userId}`, {
        params: { page, limit },
      });
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch reviews";
      return rejectWithValue({ message });
    }
  }
);

export const fetchGivenReviewsAsync = createAsyncThunk(
  "review/fetchGivenReviews",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get("/reviews/given", {
        params: { page, limit },
      });
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch given reviews";
      return rejectWithValue({ message });
    }
  }
);

export const fetchReviewStatsAsync = createAsyncThunk(
  "review/fetchReviewStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/reviews/my/stats");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch review statistics";
      return rejectWithValue({ message });
    }
  }
);

export const updateReviewAsync = createAsyncThunk(
  "review/updateReview",
  async ({ reviewId, ...updateData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, updateData);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update review";
      return rejectWithValue({ message });
    }
  }
);

export const deleteReviewAsync = createAsyncThunk(
  "review/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      return reviewId;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete review";
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
  state.creating = false;
  state.updating = false;
  state.deleting = false;
  state.error = action.payload?.message || "An error occurred";
};

// Slice
const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
    },

    // Clear reviews (useful for cleanup)
    clearReviews: (state) => {
      state.reviews = [];
      state.givenReviews = [];
      state.pagination = initialState.pagination;
      state.statistics = initialState.statistics;
    },

    // Set loading states manually if needed
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Update a single review in the list (optimistic update)
    updateReviewInList: (state, action) => {
      const { reviewId, updates } = action.payload;

      // Update in reviews array
      const reviewIndex = state.reviews.findIndex((r) => r._id === reviewId);
      if (reviewIndex !== -1) {
        state.reviews[reviewIndex] = {
          ...state.reviews[reviewIndex],
          ...updates,
        };
      }

      // Update in givenReviews array
      const givenReviewIndex = state.givenReviews.findIndex(
        (r) => r._id === reviewId
      );
      if (givenReviewIndex !== -1) {
        state.givenReviews[givenReviewIndex] = {
          ...state.givenReviews[givenReviewIndex],
          ...updates,
        };
      }
    },

    // Remove review from list (optimistic delete)
    removeReviewFromList: (state, action) => {
      const reviewId = action.payload;
      state.reviews = state.reviews.filter((r) => r._id !== reviewId);
      state.givenReviews = state.givenReviews.filter((r) => r._id !== reviewId);
    },
  },

  extraReducers: (builder) => {
    // Create Review
    builder
      .addCase(createReviewAsync.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createReviewAsync.fulfilled, (state, action) => {
        state.creating = false;
        // Add to given reviews if it's the current user's review
        state.givenReviews.unshift(action.payload);
        // Update stats if available
        if (state.reviewStats?.given) {
          state.reviewStats.given.totalReviews += 1;
        }
      })
      .addCase(createReviewAsync.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload?.message || "Failed to create review";
      });

    // Fetch User Reviews (received)
    builder
      .addCase(fetchUserReviewsAsync.pending, handlePending)
      .addCase(fetchUserReviewsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews || [];
        state.pagination = action.payload.pagination || initialState.pagination;
        state.statistics = action.payload.statistics || initialState.statistics;
      })
      .addCase(fetchUserReviewsAsync.rejected, handleRejected);

    // Fetch Given Reviews
    builder
      .addCase(fetchGivenReviewsAsync.pending, handlePending)
      .addCase(fetchGivenReviewsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.givenReviews = action.payload.reviews || [];
        // Update pagination for given reviews if needed
        if (action.payload.pagination) {
          state.givenReviewsPagination = action.payload.pagination;
        }
      })
      .addCase(fetchGivenReviewsAsync.rejected, handleRejected);

    // Fetch Review Stats
    builder
      .addCase(fetchReviewStatsAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchReviewStatsAsync.fulfilled, (state, action) => {
        state.reviewStats = action.payload;
      })
      .addCase(fetchReviewStatsAsync.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to fetch review stats";
      });

    // Update Review
    builder
      .addCase(updateReviewAsync.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateReviewAsync.fulfilled, (state, action) => {
        state.updating = false;
        const updatedReview = action.payload;

        // Update in reviews array
        const reviewIndex = state.reviews.findIndex(
          (r) => r._id === updatedReview._id
        );
        if (reviewIndex !== -1) {
          state.reviews[reviewIndex] = updatedReview;
        }

        // Update in givenReviews array
        const givenReviewIndex = state.givenReviews.findIndex(
          (r) => r._id === updatedReview._id
        );
        if (givenReviewIndex !== -1) {
          state.givenReviews[givenReviewIndex] = updatedReview;
        }
      })
      .addCase(updateReviewAsync.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload?.message || "Failed to update review";
      });

    // Delete Review
    builder
      .addCase(deleteReviewAsync.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteReviewAsync.fulfilled, (state, action) => {
        state.deleting = false;
        const reviewId = action.payload;

        // Remove from reviews array
        state.reviews = state.reviews.filter((r) => r._id !== reviewId);

        // Remove from givenReviews array
        state.givenReviews = state.givenReviews.filter(
          (r) => r._id !== reviewId
        );

        // Update statistics
        if (state.statistics.totalReviews > 0) {
          state.statistics.totalReviews -= 1;
        }

        // Update review stats
        if (
          state.reviewStats?.given &&
          state.reviewStats.given.totalReviews > 0
        ) {
          state.reviewStats.given.totalReviews -= 1;
        }
        if (
          state.reviewStats?.received &&
          state.reviewStats.received.totalReviews > 0
        ) {
          state.reviewStats.received.totalReviews -= 1;
        }
      })
      .addCase(deleteReviewAsync.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload?.message || "Failed to delete review";
      });
  },
});

// Export actions
export const {
  clearError,
  clearReviews,
  setLoading,
  updateReviewInList,
  removeReviewFromList,
} = reviewSlice.actions;

// Selectors
export const selectReviews = (state) => state.review.reviews;
export const selectGivenReviews = (state) => state.review.givenReviews;
export const selectReviewStats = (state) => state.review.reviewStats;
export const selectReviewLoading = (state) => state.review.loading;
export const selectReviewError = (state) => state.review.error;
export const selectReviewPagination = (state) => state.review.pagination;
export const selectReviewStatistics = (state) => state.review.statistics;
export const selectIsCreating = (state) => state.review.creating;
export const selectIsUpdating = (state) => state.review.updating;
export const selectIsDeleting = (state) => state.review.deleting;

// Export reducer
export default reviewSlice.reducer;
