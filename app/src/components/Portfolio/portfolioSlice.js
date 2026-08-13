import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabase";

export const fetchPortfolio = createAsyncThunk("portfolio", async portfolioId => {
  const result = await supabase
    .schema("public")
    .from("portfolios")
    .select(
      "*, profiles(*), portfolio_images(*), portfolio_categories(*), portfolio_tech_stacks(*), portfolio_ai_created(*)",
    )
    .eq("project_id", portfolioId)
    .maybeSingle();
  return result;
});
export const fetchOtherPortfolios = createAsyncThunk("portfolio/fetchOthers", async ({ id, authorId }) => {
  const result = await supabase
    .schema("public")
    .from("portfolios")
    .select("*, profiles(*), portfolio_images(*), portfolio_categories(*), portfolio_tech_stacks(*)", {
      count: "exact",
    })
    .eq("author_id", authorId)
    .neq("project_id", id)
    .order("created_at", { ascending: false })
    .limit(2);
  return result;
});

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState: {
    data: null,
    status: "idle", // idle | loading | succeeded | failed | notFound
    error: null,
    otherPortfolios: {
      data: null,
      status: "idle", // idle | loading | succeeded | failed | notFound
      error: null,
      count: 0,
    },
  },
  reducers: {
    resetPortfolio: state => {
      state.data = null;
      state.status = "idle";
      state.error = null;
      state.otherPortfolios = {
        data: null,
        status: "idle",
        error: null,
        count: 0,
      };
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
      state.status = "failed";
      state.error = action.payload.error ?? action.error;
      console.error(state.error);
    });

    builder.addCase(fetchOtherPortfolios.pending, (state, action) => {
      state.otherPortfolios.status = "loading";
    });
    builder.addCase(fetchOtherPortfolios.fulfilled, (state, action) => {
      state.otherPortfolios.data = action.payload.data;
      state.otherPortfolios.status = action.payload.count > 0 ? "succeeded" : "notFound";
      state.otherPortfolios.count = action.payload.count;
      console.log(state.otherPortfolios.data);
    });
    builder.addCase(fetchOtherPortfolios.rejected, (state, action) => {
      state.otherPortfolios.status = "failed";
      state.otherPortfolios.error = action.payload.error ?? action.error;
      console.error(state.otherPortfolios.error);
    });
  },
});

export const { setLoading, setPortfolio, resetPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;
