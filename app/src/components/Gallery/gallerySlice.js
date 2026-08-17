import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabase";

/**
 * sortBy에 컬럼 이름 혼동이나 다른 엉뚱한 값이 들어왔을 때를 대비한 안전장치
 *
 * @param {string} sortBy
 */
const stringToColumnName = (sortBy = "created_at") => {
  switch (sortBy) {
    // 최신순
    case "created_at":
    case "latest":
      return "created_at";

    // 조회순
    case "view_count":
    case "popular":
      return "view_count";

    // 좋아요순
    case "likes":
    case "likes_count":
      return "likes_count";

    // 예외 처리 (최신순으로 안전장치 설정)
    default:
      console.warn('Invalid value for function "stringToColumnName()": ', sortBy);
      return "created_at";
  }
};

/**
 * fetchPortfolios, fetchMorePortfolios에 사용되는 쿼리 조립 함수
 *
 * @param {string} searchTerm 검색 문자열 필터
 * @param {Array} category 카테고리 필터
 * @param {Array} techStack 기술 스택 필터
 * @param {string} sortBy 정렬 방식
 * @param {boolean} ascending 오름차순?
 * @param {number} rangeFrom fetch 범위 시작 index 번호
 * @param {number} rangeTo fetch 범위 끝 index 번호
 */
function buildPortfolioQuery({
  searchTerm = "",
  category = [],
  techStack = [],
  sortBy = "created_at",
  ascending = false,
  rangeFrom = 0,
  rangeTo = 7,
}) {
  let query = supabase
    .schema("public")
    .from("portfolios")
    .select(
      "*, profiles!portfolios_author_id_fkey(*), portfolio_images(*), portfolio_categories!inner(*), portfolio_tech_stacks!inner(*), portfolio_likes(*)",
      {
        count: "exact",
      },
    );

  // 검색 문자열 필터 추가  * 현재 코드로는 대소문자를 구분함
  query = query.ilike("title", `%${searchTerm.trim()}%`);

  // 카테고리 필터 추가  * 현재 미사용
  if (category.length > 0) {
    query = query.in("portfolio_categories.category", category);
  }

  // 기술 스택 필터 추가
  if (techStack.length > 0) {
    query = query.in("portfolio_tech_stacks.tech_stack", techStack);
  }

  // 정렬 방식 추가
  query = query.order(stringToColumnName(sortBy), { ascending });

  // fetch 범위 추가
  if (rangeFrom > rangeTo) {
    console.error("rangeFrom은 rangeTo보다 클 수 없습니다!");
    query = query.range(rangeFrom, rangeFrom);
  } else {
    query = query.range(rangeFrom, rangeTo);
  }
  return query;
}

export const fetchFeaturedPortfolios = createAsyncThunk("gallery/featured", async () => {
  const result = await supabase
    .schema("public")
    .from("portfolios")
    .select(
      "*, profiles!portfolios_author_id_fkey(*), portfolio_images(*), portfolio_categories(*), portfolio_tech_stacks(*), portfolio_likes(*)",
    )
    .order("created_at", { ascending: true })
    .limit(4);
  return result;
});
export const fetchPortfolios = createAsyncThunk(
  "gallery",
  async ({ searchTerm = "", category = [], techStack = [], sortBy = "created_at", ascending = false }) => {
    const query = buildPortfolioQuery({ searchTerm, category, techStack, sortBy, ascending, rangeFrom: 0, rangeTo: 7 });
    const result = await query;
    return result;
  },
);
export const fetchMorePortfolios = createAsyncThunk(
  "gallery/more",
  async (
    {
      searchTerm = "",
      category = [],
      techStack = [],
      sortBy = "created_at",
      ascending = false,
      visibleCount,
      fetchCount = 4,
    },
    { getState },
  ) => {
    const { count } = getState().gallery;

    // 요청 자체를 생략
    if (visibleCount >= count) {
      return { data: [], error: null, count };
    }

    let query = buildPortfolioQuery({
      searchTerm,
      category,
      techStack,
      sortBy,
      ascending,
      rangeFrom: visibleCount - 1,
      rangeTo: Math.min(visibleCount + fetchCount - 1, count - 1),
    });

    const result = await query;
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
    },
    resetGalleryAll: state => {
      state.data = [];
      state.status = "idle";
      state.error = null;
      state.count = 0;
      state.featured = {
        data: [],
        status: "idle",
        error: null,
      };
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchFeaturedPortfolios.pending, (state, action) => {
      state.featured.status = "loading";
    });
    builder.addCase(fetchFeaturedPortfolios.fulfilled, (state, action) => {
      const { data, error } = action.payload;
      state.featured.error = error;
      state.featured.status = error ? "failed" : data?.length > 0 ? "succeeded" : "notFound";
      state.featured.data = data ?? [];
      if (error) console.warn(error);
    });
    builder.addCase(fetchFeaturedPortfolios.rejected, (state, action) => {
      state.featured.status = "failed";
      state.featured.error = action.error;
      console.error(state.featured.error);
    });

    builder.addCase(fetchPortfolios.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchPortfolios.fulfilled, (state, action) => {
      const { data, error, count } = action.payload;
      state.error = error;
      state.status = error ? "failed" : count > 0 ? "succeeded" : "notFound";
      state.data = data ?? [];
      state.count = count ?? 0;
      if (error) console.warn(error);
    });
    builder.addCase(fetchPortfolios.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;
      console.error(state.error);
    });

    builder.addCase(fetchMorePortfolios.fulfilled, (state, action) => {
      const { data, error, count } = action.payload;
      if (!error && count > 0) state.data.push(action.payload.data);
      if (error) console.warn(error);
    });
    builder.addCase(fetchMorePortfolios.rejected, (state, action) => {
      state.error = action.error;
      console.error(state.error);
    });
  },
});

export const { resetGallery, resetGalleryAll } = gallerySlice.actions;
export default gallerySlice.reducer;
