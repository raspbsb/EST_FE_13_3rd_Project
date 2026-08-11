import { configureStore } from "@reduxjs/toolkit";
import portfolioReducer from "../components/Portfolio/portfolioSlice.js";

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
  },
});
