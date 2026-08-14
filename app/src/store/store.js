import { configureStore } from "@reduxjs/toolkit";
import portfolioReducer from "../components/Portfolio/portfolioSlice.js";
import galleryReducer from "../components/Gallery/gallerySlice.js";
import userReducer, { fetchUser } from "./userSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    portfolio: portfolioReducer,
    gallery: galleryReducer,
  },
});

supabase.auth.onAuthStateChange(() => {
  store.dispatch(fetchUser());
});
