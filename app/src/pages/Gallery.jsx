import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFeaturedPortfolios, fetchPortfolios, fetchMorePortfolios } from "../components/Gallery/gallerySlice";
import { techStackOptions } from "../constants/portfolioOptions";

import ProjectCard from "../components/ProjectCard";
import TagChip from "../components/TagChip";
import Text from "@mui/material/Typography";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";
import SearchIcon from "@mui/icons-material/Search";

const normalizeOption = opt => {
  if (typeof opt === "object" && opt !== null) {
    return {
      value: opt.value || opt.label || "",
      label: opt.label || opt.value || "",
    };
  }
  return { value: String(opt), label: String(opt) };
};

const formatCardData = item => {
  if (!item) return {};
  const base = item.portfolio || item;

  let img = base.image_url || base.imageUrl || base.thumbnail_url || base.cover_image;

  const likeCount = Array.isArray(base.portfolio_likes) ? base.portfolio_likes.length : 0;

  if (!img && Array.isArray(base.portfolio_images) && base.portfolio_images.length > 0) {
    img = base.portfolio_images[0]?.image_url || base.portfolio_images[0]?.url;
  }

  return {
    ...base,
    image_url: img || "",
    imageUrl: img || "",
    like_count: likeCount,
  };
};

export default function Gallery() {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [techStack, setTechStack] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const { data, status, count, featured } = useSelector(
    state =>
      state.gallery || {
        data: [],
        status: "idle",
        count: 0,
        featured: { data: [], status: "idle" },
      },
  );

  const featuredList = featured?.data || [];
  const featuredStatus = featured?.status || "idle";

  const normalizedTechOptions = (techStackOptions || []).map(normalizeOption);
  useEffect(() => {
    dispatch(fetchFeaturedPortfolios());
  }, [dispatch]);
  useEffect(() => {
    dispatch(
      fetchPortfolios({
        searchTerm,
        techStack: techStack === "all" ? [] : [techStack],
        sortBy,
        ascending: false,
      }),
    );
  }, [dispatch, searchTerm, techStack, sortBy]);
  const handleShowMore = () => {
    dispatch(
      fetchMorePortfolios({
        searchTerm,
        techStack: techStack === "all" ? [] : [techStack],
        sortBy,
        ascending: false,
        visibleCount: data.length,
        fetchCount: 4,
      }),
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "background.paper",
      }}
    >
      <Box component="main" sx={{ flexGrow: 1, py: { mobile: 3, tablet: 5, desktop: 8 } }}>
        <Container maxWidth="xl" sx={{ px: { mobile: 2, tablet: 4, desktop: 6 } }}>
          <Box sx={{ mb: { mobile: 4, desktop: 7 } }}>
            <Text variant="h5" color="text.primary" sx={{ fontWeight: 800, mb: 2.5 }}>
              추천 포트폴리오
            </Text>

            {featuredStatus === "loading" ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={32} />
              </Box>
            ) : featuredStatus === "notFound" || featuredList.length === 0 ? (
              <Text variant="body2" color="text.secondary">
                추천 포트폴리오가 없습니다.
              </Text>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gap: { mobile: 2, tablet: 2.5, desktop: 3 },
                  gridTemplateColumns: {
                    mobile: "minmax(0, 1fr)",
                    tablet: "repeat(3, minmax(0, 1fr))",
                    desktop: "repeat(4, minmax(0, 1fr))",
                  },
                }}
              >
                {featuredList.map((item, index) => {
                  const cardItem = formatCardData(item);
                  return (
                    <Box
                      key={cardItem?.id ? `featured-${cardItem.id}` : `featured-idx-${index}`}
                      sx={{ width: "100%", minWidth: 0 }}
                    >
                      <ProjectCard portfolio={cardItem} project={cardItem} data={cardItem} {...cardItem} />
                    </Box>
                  );
                })}
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
              <Text variant="h5" color="text.primary" sx={{ fontWeight: 800 }}>
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
                  {normalizedTechOptions.slice(0, 3).map(tech => (
                    <Box
                      key={`chip-${tech.value}`}
                      onClick={() => setTechStack(techStack === tech.value ? "all" : tech.value)}
                    >
                      <TagChip label={tech.label} className={techStack === tech.value ? "active" : ""} />
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
                <FormControl size="small" sx={{ minWidth: 130, width: { mobile: "100%", tablet: "auto" } }}>
                  <Select value={techStack} onChange={e => setTechStack(e.target.value)}>
                    <MenuItem value="all">전체 기술스택</MenuItem>
                    {normalizedTechOptions.map(tech => (
                      <MenuItem key={`opt-${tech.value}`} value={tech.value}>
                        {tech.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 110, width: { mobile: "100%", tablet: "auto" } }}>
                  <Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <MenuItem value="created_at">최신순</MenuItem>
                    <MenuItem value="view_count">조회순</MenuItem>
                    <MenuItem value="likes">좋아요순</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            {status === "loading" ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : status === "notFound" || data.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Text variant="body1" color="text.secondary">
                  조건에 맞는 포트폴리오가 없습니다.
                </Text>
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    display: "grid",
                    gap: { mobile: 2, tablet: 2.5, desktop: 3 },
                    gridTemplateColumns: {
                      mobile: "minmax(0, 1fr)",
                      tablet: "repeat(3, minmax(0, 1fr))",
                      desktop: "repeat(4, minmax(0, 1fr))",
                    },
                  }}
                >
                  {data.map((item, idx) => {
                    const cardItem = formatCardData(item);
                    return (
                      <Box
                        key={cardItem?.id ? `gallery-${cardItem.id}` : `gallery-idx-${idx}`}
                        sx={{ width: "100%", minWidth: 0 }}
                      >
                        <ProjectCard portfolio={cardItem} project={cardItem} data={cardItem} {...cardItem} />
                      </Box>
                    );
                  })}
                </Box>
                {data.length < count && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                    <Button
                      variant="outlined"
                      onClick={handleShowMore}
                      sx={{
                        px: 4,
                        py: 1,
                        color: "text.primary",
                        borderColor: "divider",
                        fontWeight: 600,
                      }}
                    >
                      더보기 ({data.length} / {count})
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
