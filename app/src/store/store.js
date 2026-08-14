import { configureStore } from "@reduxjs/toolkit";
import portfolioReducer from "../components/Portfolio/portfolioSlice.js";
import galleryReducer from "../components/Gallery/gallerySlice.js";
import userReducer from "./userSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    portfolio: portfolioReducer,
    gallery: galleryReducer,
  },
});
