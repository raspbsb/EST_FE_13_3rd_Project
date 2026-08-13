import { useSelector, useDispatch } from "react-redux";
import { fetchFeaturedPortfolios, fetchPortfolios } from "../components/Gallery/gallerySlice";
import React, { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import ProjectCard from "../components/ProjectCard";
import TagChip from "../components/TagChip";
import { supabase } from "../utils/supabase";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Text from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";
import SearchIcon from "@mui/icons-material/Search";

const DUMMY_DATA = Array.from({ length: 8 }, (_, i) => ({
  id: `dummy-${i + 1}`,
  title: `프로젝트 제목 ${i + 1}`,
  ai_summary: "AI가 요약한 포트폴리오 설명입니다.",
  tags: ["React", "AI"],
  views: 100 + i,
  likes: 10 + i,
  created_at: new Date().toISOString(),
}));

export default function Gallery() {
  // const [portfolios, setPortfolios] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [visibleCount, setVisibleCount] = useState(8);

  const dispatch = useDispatch();
  const {
    data: portfolios,
    status,
    error,
    count,
    featured: { data: featuredPortfolios, status: statusF, error: errorF },
  } = useSelector(state => state.gallery);

  useEffect(() => {
    // handleFetchPortfolios();
    dispatch(fetchFeaturedPortfolios());
    dispatch(fetchPortfolios({ searchTerm, sortBy }));
  }, []);
  /*
  const handleFetchPortfolios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("portfolios")
        .select(
          `
          *,
          portfolio_images (*),
          profiles (*)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const fetchedList = data && data.length > 0 ? data : [];
      if (fetchedList.length < 8) {
        setPortfolios([...fetchedList, ...DUMMY_DATA.slice(0, 8 - fetchedList.length)]);
      } else {
        setPortfolios(fetchedList);
      }
    } catch (err) {
      console.error("데이터 로드 실패, 더미 데이터로 대체합니다:", err.message);
      setPortfolios(DUMMY_DATA);
    } finally {
      setLoading(false);
    }
  };

  const filteredPortfolios = portfolios.filter(item => {
    const query = searchTerm.toLowerCase().trim();
    const titleMatch = item?.title?.toLowerCase().includes(query) || false;
    const summaryMatch = item?.ai_summary?.toLowerCase().includes(query) || false;
    const isSearchMatched = !query || titleMatch || summaryMatch;
    const isCategoryMatched = category === "all" || (item?.tags && item.tags.includes(category));

    return isSearchMatched && isCategoryMatched;
  });

  const sortedPortfolios = [...filteredPortfolios].sort((a, b) => {
    if (sortBy === "popular") return (b?.views || 0) - (a?.views || 0);
    if (sortBy === "likes") return (b?.likes || 0) - (a?.likes || 0);
    return new Date(b?.created_at) - new Date(a?.created_at);
  });

  const featuredPortfolios = portfolios.slice(0, 4);
  const allPortfolios = sortedPortfolios.slice(0, visibleCount);
*/
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#FFFFFF" }}>
      <Box component="main" sx={{ flexGrow: 1, py: { mobile: 3, tablet: 5, desktop: 8 } }}>
        <Container maxWidth="xl" sx={{ px: { mobile: 2, tablet: 4, desktop: 6 } }}>
          <Box sx={{ mb: { mobile: 4, desktop: 7 } }}>
            <Text variant="h5" sx={{ fontWeight: 800, mb: 2, fontSize: { mobile: "1.2rem", desktop: "1.5rem" } }}>
              추천 포트폴리오
            </Text>

            {statusF === "loading" ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gap: { mobile: 2, tablet: 2.5, desktop: 3 },
                  gridTemplateColumns: {
                    mobile: "repeat(1, 1fr)",
                    tablet: "repeat(3, 1fr)",
                    desktop: "repeat(4, 1fr)",
                  },
                }}
              >
                {featuredPortfolios?.map(item => (
                  <Box key={`featured-${item.id}`} sx={{ width: "100%" }}>
                    <ProjectCard portfolio={item} project={item} data={item} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { mobile: "column", tablet: "row" },
                justifyContent: "space-between",
                alignItems: { mobile: "stretch", tablet: "center" },
                gap: 2,
                mb: 3,
              }}
            >
              <Text variant="h5" sx={{ fontWeight: 800, fontSize: { mobile: "1.2rem", desktop: "1.5rem" } }}>
                전체 포트폴리오
              </Text>

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  flexDirection: { mobile: "column", tablet: "row" },
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: { mobile: "none", desktop: "flex" }, gap: 0.5, mr: 1 }}>
                  {["React", "Next.js", "AI"].map(tag => (
                    <Box key={tag} onClick={() => setCategory(category === tag ? "all" : tag)}>
                      <TagChip label={tag} className={category === tag ? "acitve" : ""} />
                    </Box>
                  ))}
                </Box>

                <TextField
                  size="small"
                  placeholder="포트폴리오 검색..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ width: { mobile: "100%", tablet: "220px" } }}
                />

                <FormControl size="small" sx={{ minWidth: 110, width: { mobile: "100%", tablet: "auto" } }}>
                  <Select value={category} onChange={e => setCategory(e.target.value)}>
                    <MenuItem value="all">Category</MenuItem>
                    <MenuItem value="React">React</MenuItem>
                    <MenuItem value="Next.js">Next.js</MenuItem>
                    <MenuItem value="AI">AI</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 100, width: { mobile: "100%", tablet: "auto" } }}>
                  <Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <MenuItem value="latest">최신순</MenuItem>
                    <MenuItem value="popular">조회순</MenuItem>
                    <MenuItem value="likes">좋아요순</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {status === "loading" ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : status === "notFound" ? (
              <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                <Text variant="body1">조건에 맞는 포트폴리오가 없습니다.</Text>
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    display: { mobile: "none", tablet: "grid" },
                    gap: { tablet: 2.5, desktop: 3 },
                    gridTemplateColumns: {
                      tablet: "repeat(3, 1fr)",
                      desktop: "repeat(4, 1fr)",
                    },
                  }}
                >
                  {portfolios?.map(item => (
                    <Box key={`desktop-gallery-${item.id}`} sx={{ width: "100%" }}>
                      <ProjectCard portfolio={item} project={item} data={item} />
                    </Box>
                  ))}
                </Box>
                <Box sx={{ display: { mobile: "block", tablet: "none" } }}>
                  {portfolios?.[0] && (
                    <Box sx={{ mb: 2, width: "100%" }}>
                      <ProjectCard portfolio={portfolios[0]} project={portfolios[0]} data={portfolios[0]} />
                    </Box>
                  )}
                  <Box
                    sx={{
                      display: "grid",
                      gap: 1.5,
                      gridTemplateColumns: "repeat(2, 1fr)",
                    }}
                  >
                    {portfolios?.slice(1).map(item => (
                      <Box key={`mobile-gallery-${item.id}`} sx={{ width: "100%" }}>
                        <ProjectCard portfolio={item} project={item} data={item} />
                      </Box>
                    ))}
                  </Box>
                </Box>
                {visibleCount < count && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setVisibleCount(prev => prev + 4)}
                      sx={{ px: 4, py: 1, color: "#374151", borderColor: "#D1D5DB", fontWeight: 600 }}
                    >
                      더보기
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
