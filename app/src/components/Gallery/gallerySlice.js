import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabase";

const stringToColumnName = (sortBy = "created_at") => {
  switch (sortBy) {
    case "created_at":
    case "latest": // 최신순
      return "created_at";
    case "view_count":
    case "popular": // 조회순
      return "view_count";
    case "likes": // 좋아요순
    // 좋아요 테이블 미구현
    default:
      console.warn('Invalid value for function "stringToColumnName()": ', sortBy);
      return "created_at";
  }
};

export const fetchFeaturedPortfolios = createAsyncThunk("gallery/featured", async () => {
  const result = await supabase
    .schema("public")
    .from("portfolios")
    .select("*, profiles(*), portfolio_images(*), portfolio_categories(*), portfolio_tech_stacks(*)")
    .order("created_at", { ascending: true })
    .limit(4);
  return result;
});
export const fetchPortfolios = createAsyncThunk(
  "gallery",
  async ({ searchTerm = "", category = [], techStack = [], sortBy = "created_at", ascending = false }) => {
    const result = await supabase
      .schema("public")
      .from("portfolios")
      .select("*, profiles(*), portfolio_images(*), portfolio_categories(*), portfolio_tech_stacks(*)", {
        count: "exact",
      })
      .ilike("title", `%${searchTerm.trim()}%`)
      // .???("category", category)
      // .???("tech_stack", techStack)
      .order(stringToColumnName(sortBy), { ascending })
      .range(0, 7);
    return result;
  },
);
export const fetchMorePortfolios = createAsyncThunk(
  "gallery/more",
  async ({
    searchTerm = "",
    category = [],
    techStack = [],
    sortBy = "created_at",
    ascending = false,
    visibleCount,
    fetchCount = 4,
  }) => {
    const result = await supabase
      .schema("public")
      .from("portfolios")
      .select("*, profiles(*), portfolio_images(*), portfolio_categories(*), portfolio_tech_stacks(*)", {
        count: "exact",
      })
      .ilike("title", `%${searchTerm.trim()}%`)
      // .???("category", category)
      // .???("tech_stack", techStack)
      .order(stringToColumnName(sortBy), { ascending })
      .range(visibleCount - 1, visibleCount + fetchCount - 1);
    return result;
  },
);

const gallerySlice = createSlice({
  name: "gallery",
  initialState: {
    data: [],
    status: "idle", // idle | loading | succeeded | failed | notFound
    error: null,
    count: 0,
    featured: {
      data: [],
      status: "idle", // idle | loading | succeeded | failed | notFound
      error: null,
    },
  },
  reducers: {
    resetGallery: state => {
      state.data = [];
      state.status = "idle";
      state.error = null;
      state.count = 0;
      state.featured = {
        data: [],
        status: idle,
        error: null,
      };
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchFeaturedPortfolios.pending, (state, action) => {
      state.featured.status = "loading";
    });
    builder.addCase(fetchFeaturedPortfolios.fulfilled, (state, action) => {
      state.featured.data = action.payload.data;
      state.featured.status = action.payload.data?.length > 0 ? "succeeded" : "notFound";
      console.log(state.featured.data);
    });
    builder.addCase(fetchFeaturedPortfolios.rejected, (state, action) => {
      state.featured.status = "failed";
      state.featured.error = action.payload.error ?? action.error;
      console.error(state.featured.error);
    });

    builder.addCase(fetchPortfolios.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchPortfolios.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.status = action.payload.count > 0 ? "succeeded" : "notFound";
      state.count = action.payload.count;
      console.log(state.data);
    });
    builder.addCase(fetchPortfolios.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.error ?? action.error;
      console.error(state.error);
    });

    builder.addCase(fetchMorePortfolios.fulfilled, (state, action) => {
      state.data.push(action.payload.data);
      console.log(state.data);
    });
    builder.addCase(fetchMorePortfolios.rejected, (state, action) => {
      state.error = action.payload.error ?? action.error;
      console.error(state.error);
    });
  },
});

export default gallerySlice.reducer;
