import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabase";

export const fetchPortfolio = createAsyncThunk("portfolioData", async (portfolioId, thunkAPI) => {
  const result = await supabase
    .schema("public")
    .from("portfolios")
    .select("*, portfolio_images(*), portfolio_categories(*), portfolio_tech_stacks(*), portfolio_ai_created(*)")
    .eq("project_id", portfolioId)
    .maybeSingle();
  return await result;
});

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState: {
    data: null,
    status: "idle", // idle | loading | succeeded | failed | notFound
    error: null,
  },
  reducers: {
    resetPortfolio: state => {
      state.data = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchPortfolio.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchPortfolio.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.status = action.payload ? "succeeded" : "notFound";
      state.data?.portfolio_images.sort((a, b) => a.display_order - b.display_order);
      console.log(state.data);
    });
    builder.addCase(fetchPortfolio.rejected, (state, action) => {
      state.data = action.payload.data;
      state.status = "failed";
      state.error = action.payload.error;
    });
  },
});

export const { setLoading, setPortfolio, resetPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;
