import { createSlice } from "@reduxjs/toolkit";

const portfolioSlice = createSlice({
  name: "counter",
  initialState: {
    data: null,
    status: "idle", // idle | loading | succeeded | failed
  },
  reducers: {
    setLoading: state => {
      // "loading" - 스켈레톤 출력하기
      state.data = null;
      state.status = "loading";
    },
    setPortfolio: (state, action) => {
      state.data = action.payload;

      if (state.data.error) {
        // "failed" - 안내 문구 출력하기
        state.status = "failed";
      } else {
        // "succeeded" - 포트폴리오 출력하기
        state.status = "succeeded";
      }
    },
    resetPortfolio: state => {
      state.data = null;
      state.status = "idle";
    },
  },
});

export const { setLoading, setPortfolio, resetPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;
