import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  matches: [],
  loading: false,
  error: null,
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setMatches: (state, action) => {
      state.matches = action.payload;
    },
    addMatch: (state, action) => {
      state.matches.push(action.payload);
    },
    clearMatches: (state) => {
      state.matches = [];
    },
    setMatchLoading: (state, action) => {
      state.loading = action.payload;
    },
    setMatchError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setMatches,
  addMatch,
  clearMatches,
  setMatchLoading,
  setMatchError,
} = matchSlice.actions;
export default matchSlice.reducer;
