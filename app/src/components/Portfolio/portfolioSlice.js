import { createSlice } from "@reduxjs/toolkit";

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState: {
    data: null,
    status: "idle", // idle | loading | succeeded | failed | notFound
    error: null,
    dataImages: null,
    dataCategories: [],
    dataTechStacks: [],
    dataAiCreated: null,
  },
  reducers: {
    setLoading: state => {
      // "loading" - 스켈레톤 출력하기
      state.data = null;
      state.status = "loading";
      state.error = null;
      state.dataImages = [];
      state.dataCategories = [];
      state.dataTechStacks = [];
      state.dataAiCreated = null;
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
    setImages: (state, action) => {
      if (action.payload.error) {
        console.warn("이미지 로드 실패!", action.payload.error);
      }
      state.dataImages = action.payload.data;
    },
    setCategories: (state, action) => {
      if (action.payload.error) {
        console.warn("카테고리 칩 로드 실패!", action.payload.error);
      }
      state.dataCategories = action.payload.data;
    },
    setTechStacks: (state, action) => {
      if (action.payload.error) {
        console.warn("기술 스택 칩 로드 실패!", action.payload.error);
      }
      state.dataTechStacks = action.payload.data;
    },
    setAiCreated: (state, action) => {
      if (action.payload.error) {
        console.warn("AI 분석결과 로드 실패!", action.payload.error);
      }
      state.dataAiCreated = action.payload.data;
    },
    resetPortfolio: state => {
      state.data = null;
      state.status = "idle";
      state.error = null;
      state.dataImages = [];
      state.dataCategories = [];
      state.dataTechStacks = [];
      state.dataAiCreated = null;
    },
  },
});

export const { setLoading, setPortfolio, setImages, setCategories, setTechStacks, setAiCreated, resetPortfolio } =
  portfolioSlice.actions;
export default portfolioSlice.reducer;
