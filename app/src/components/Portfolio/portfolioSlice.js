import { createSlice } from "@reduxjs/toolkit";

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState: {
    data: null,
    status: "idle", // idle | loading | succeeded | failed | notFound
    error: null,
  },
  reducers: {
    setLoading: state => {
      // "loading" - 스켈레톤 출력하기
      state.data = null;
      state.status = "loading";
      state.error = null;
    },
    setPortfolio: (state, action) => {
      state.data = action.payload.data;
      state.error = action.payload.error;

      if (state.error) {
        // "failed" - 안내 문구 출력하기
        state.status = "failed";
      } else if (!state.data) {
        // "notFound" - 안내 문구 출력하기
        state.status = "notFound";
      } else {
        // "succeeded" - 포트폴리오 출력하기
        state.status = "succeeded";
      }
    },
    resetPortfolio: state => {
      state.data = null;
      state.status = "idle";
      state.error = null;
    },
  },
});

export const { setLoading, setPortfolio, resetPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;
