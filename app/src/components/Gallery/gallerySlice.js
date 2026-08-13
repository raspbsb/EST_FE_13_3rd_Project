import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabase";

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
  async ({
    page = 1,
    pageSize = 8,
    search = "",
    category = [],
    techStack = [],
    sort = "created_at",
    ascending = false,
  }) => {
    switch (sort) {
      case "latest": // 최신순
        sort = "created_at";
      case "popular": // 조회순
        sort = "view_count";
      case "likes": // 좋아요순
      // 좋아요 테이블 미구현
      default:
        sort = sort;
    }

    const result = await supabase
      .schema("public")
      .from("portfolios")
      .select("*, profiles(*), portfolio_images(*), portfolio_categories(*), portfolio_tech_stacks(*)", {
        count: "exact",
      })
      .ilike("title", `%${search.trim()}%`)
      // .???("category", category)
      // .???("tech_stack", techStack)
      .order(sort, { ascending })
      .range((page - 1) * pageSize, page * pageSize + 1);
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
      featured: {
        data = [];
        status = idle;
        error = null;
      }
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
      state.featured.data = action.payload.data;
      state.featured.status = "failed";
      state.featured.error = action.payload.error;
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
      state.data = action.payload.data;
      state.status = "failed";
      state.error = action.payload.error;
      console.error(state.error);
    });
  },
});

export default gallerySlice.reducer;
