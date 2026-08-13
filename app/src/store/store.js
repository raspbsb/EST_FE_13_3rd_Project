import { configureStore } from "@reduxjs/toolkit";
import portfolioReducer from "../components/Portfolio/portfolioSlice.js";
import galleryReducer from "../components/Gallery/gallerySlice.js";

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
    gallery: galleryReducer,
  },
});
