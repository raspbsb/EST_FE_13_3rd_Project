import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabase";

export const fetchPortfolios = createAsyncThunk(
  "gallery",
  async ({ page = 1, pageSize = 8, search = "", category = [], techStack = [] }) => {
    const result = await supabase
      .schema("public")
      .from("portfolios")
      .select("*")
      .contains("title", search)
      // .contains("category", category)
      // .contains("tech_stack", techStack)
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize + 1);
    return result;
  },
);

const gallerySlice = createSlice({
  name: "gallery",
  initialState: {
    data: null,
    status: "idle", // idle | loading | succeeded | failed | notFound
    error: null,
  },
  reducers: {
    resetGallery: state => {
      state.data = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchPortfolios.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchPortfolios.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.status = action.payload ? "succeeded" : "notFound";
      console.log(state.data);
    });
    builder.addCase(fetchPortfolios.rejected, (state, action) => {
      state.data = action.payload.data;
      state.status = "failed";
      state.error = action.payload.error;
    });
  },
});

export default gallerySlice.reducer;
