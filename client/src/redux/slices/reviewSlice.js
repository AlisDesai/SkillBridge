import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reviews: [],
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setReviews: (state, action) => {
      state.reviews = action.payload;
    },
    addReview: (state, action) => {
      state.reviews.unshift(action.payload);
    },
    setReviewLoading: (state, action) => {
      state.loading = action.payload;
    },
    setReviewError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setReviews, addReview, setReviewLoading, setReviewError } =
  reviewSlice.actions;
export default reviewSlice.reducer;
