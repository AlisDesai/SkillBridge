import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  skills: [],
  loading: false,
  error: null,
};

const skillSlice = createSlice({
  name: "skill",
  initialState,
  reducers: {
    setSkills: (state, action) => {
      state.skills = action.payload;
    },
    addSkill: (state, action) => {
      state.skills.push(action.payload);
    },
    removeSkill: (state, action) => {
      state.skills = state.skills.filter((skill) => skill !== action.payload);
    },
    setSkillLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSkillError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSkills,
  addSkill,
  removeSkill,
  setSkillLoading,
  setSkillError,
} = skillSlice.actions;
export default skillSlice.reducer;
