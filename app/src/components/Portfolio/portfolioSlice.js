import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabase";

export const fetchPortfolio = createAsyncThunk("portfolioData", async (portfolioId, thunkAPI) => {
  const result = await supabase
    .schema("public")
    .from("portfolios")
    .select(
      "*, profiles(*), portfolio_images(*), portfolio_categories(*), portfolio_tech_stacks(*), portfolio_ai_created(*)",
    )
    .eq("project_id", portfolioId)
    .maybeSingle();
  return await result;
});

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
