import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabase";
import { techStackOptions } from "../../constants/portfolioOptions";

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

    // 예외 처리
    default:
      return "created_at";
  }
};

const getTechStackLabels = techStacks => {
  return techStacks.map(tech => {
    const option = techStackOptions.find(item => item.value === tech);
    return option?.label || tech;
  });
};

/**
 * fetchPortfolios, fetchMorePortfolios에 사용되는 쿼리 조립 함수
 *
 * @param {string} searchTerm
 * @param {Array} category
 * @param {Array} techStack
 * @param {string} sortBy
 * @param {boolean} ascending
 * @param {number} rangeFrom
 * @param {number} rangeTo
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
      "*, profiles!portfolios_author_id_fkey(*), portfolio_images(*), portfolio_categories!inner(*), portfolio_tech_stacks!inner(*)",
      {
        count: "exact",
      },
    );

  // 공개한 포트폴리오만 가져오기
  query = query.eq("is_public", true);

  // 검색 문자열 필터
  if (searchTerm.trim()) {
    query = query.ilike("title", `%${searchTerm.trim()}%`);
  }

  // 카테고리 필터
  if (category.length > 0) {
    query = query.in("portfolio_categories.category", category);
  }

  // 기술 스택 필터
  if (techStack.length > 0) {
    const techStackLabels = getTechStackLabels(techStack);

    query = query.in("portfolio_tech_stacks.tech_stack", techStackLabels);
  }

  // 정렬 방식
  query = query.order(stringToColumnName(sortBy), {
    ascending,
  });

  // fetch 범위
  if (rangeFrom > rangeTo) {
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
      "*, profiles!portfolios_author_id_fkey(*), portfolio_images(*), portfolio_categories(*), portfolio_tech_stacks(*)",
    )
    .eq("is_public", true)
    .order("likes_count", { ascending: false })
    .limit(4);

  return result;
});

export const fetchPortfolios = createAsyncThunk(
  "gallery",
  async ({ searchTerm = "", category = [], techStack = [], sortBy = "created_at", ascending = false }) => {
    const query = buildPortfolioQuery({
      searchTerm,
      category,
      techStack,
      sortBy,
      ascending,
      rangeFrom: 0,
      rangeTo: 7,
    });

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

    if (visibleCount >= count) {
      return {
        data: [],
        error: null,
        count,
      };
    }

    const query = buildPortfolioQuery({
      searchTerm,
      category,
      techStack,
      sortBy,
      ascending,
      rangeFrom: visibleCount,

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
    status: "idle",
    error: null,
    count: 0,

    featured: {
      data: [],
      status: "idle",
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
    builder.addCase(fetchFeaturedPortfolios.pending, state => {
      state.featured.status = "loading";
    });

    builder.addCase(fetchFeaturedPortfolios.fulfilled, (state, action) => {
      const { data, error } = action.payload;

      state.featured.error = error;

      state.featured.status = error ? "failed" : data?.length > 0 ? "succeeded" : "notFound";

      state.featured.data = data ?? [];
    });

    builder.addCase(fetchFeaturedPortfolios.rejected, (state, action) => {
      state.featured.status = "failed";
      state.featured.error = action.error;
    });

    builder.addCase(fetchPortfolios.pending, state => {
      state.status = "loading";
    });

    builder.addCase(fetchPortfolios.fulfilled, (state, action) => {
      const { data, error, count } = action.payload;

      const formattedData = data ?? [];

      state.error = error;

      state.status = error ? "failed" : count > 0 ? "succeeded" : "notFound";

      state.data = formattedData;
      state.count = count ?? 0;
    });

    builder.addCase(fetchPortfolios.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;
    });
    builder.addCase(fetchMorePortfolios.fulfilled, (state, action) => {
      const { data, error, count } = action.payload;

      if (!error && count > 0) {
        const formattedData = data ?? [];

        state.data.push(...formattedData);
      }
    });

    builder.addCase(fetchMorePortfolios.rejected, (state, action) => {
      state.error = action.error;
    });
  },
});

export const { resetGallery, resetGalleryAll } = gallerySlice.actions;

export default gallerySlice.reducer;
