import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import skillReducer from "./skillSlice";
import matchReducer from "./matchSlice";
import chatReducer from "./chatSlice";
import reviewReducer from "./reviewSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    skill: skillReducer,
    match: matchReducer,
    chat: chatReducer,
    review: reviewReducer,
  },
});
