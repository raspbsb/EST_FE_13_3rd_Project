import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabase";

export const fetchPortfolio = createAsyncThunk("portfolio", async portfolioId => {
  const result = await supabase
    .schema("public")
    .from("portfolios")
    .select(
      "*, profiles!portfolios_author_id_fkey(*), portfolio_images(*), portfolio_categories(*), portfolio_tech_stacks(*), portfolio_likes(*), bookmarks(*), portfolio_ai_created(*)",
    )
    .eq("project_id", portfolioId)
    .maybeSingle();
  return result;
});
export const fetchLikes = createAsyncThunk("portfolio/likes", async portfolioId => {
  const result = await supabase.schema("public").from("portfolio_likes").select("*").eq("project_id", portfolioId);
  return result;
});
export const fetchOtherPortfolios = createAsyncThunk("portfolio/fetchOthers", async ({ id, authorId }) => {
  const result = await supabase
    .schema("public")
    .from("portfolios")
    .select(
      "*, profiles!portfolios_author_id_fkey(*), portfolio_images(*), portfolio_categories(*), portfolio_tech_stacks(*), portfolio_likes(*)",
      {
        count: "exact",
      },
    )
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
      const { data, error } = action.payload;
      state.error = error;
      state.status = error ? "failed" : data ? "succeeded" : "notFound";
      state.data = data;
      if (error) console.warn(error);
    });
    builder.addCase(fetchPortfolio.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;
      console.error(state.error);
    });

    builder.addCase(fetchLikes.fulfilled, (state, action) => {
      const { data, error } = action.payload;
      error ? console.warn(error) : (state.data.portfolio_likes = data);
    });

    builder.addCase(fetchOtherPortfolios.pending, (state, action) => {
      state.otherPortfolios.status = "loading";
    });
    builder.addCase(fetchOtherPortfolios.fulfilled, (state, action) => {
      const { data, error, count } = action.payload;
      state.error = error;
      state.otherPortfolios.status = error ? "failed" : count > 0 ? "succeeded" : "notFound";
      state.otherPortfolios.data = data ?? [];
      state.otherPortfolios.count = count ?? 0;
      if (error) console.warn(error);
    });
    builder.addCase(fetchOtherPortfolios.rejected, (state, action) => {
      state.otherPortfolios.status = "failed";
      state.otherPortfolios.error = action.error;
      console.error(state.otherPortfolios.error);
    });
  },
});

export const { resetPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;
