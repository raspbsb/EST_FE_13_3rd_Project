import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import PortfolioCard from "../components/Home/PortfolioCard";
import ProfileDropdown from "../components/Home/ProfileDropdown";
import { supabase } from "../utils/supabase";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Text from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";

import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CodeIcon from "@mui/icons-material/Code";
import PeopleIcon from "@mui/icons-material/People";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("portfolios")
          .select(
            `
            *,
            portfolio_images (*) (
              image_url,
              is_thumbnail
            )
          `,
          )
          .order("created_at", { ascending: false });

        if (error) throw error;

        console.log("Supabase 가져온 데이터:", data);
        setPortfolios(data && data.length > 0 ? data : []);
      } catch (err) {
        console.error("DB 데이터 로드 오류:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);
  const filteredPortfolios = portfolios.filter(item => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return true;

    const title = item?.title?.toLowerCase() || "";
    const summary = item?.ai_summary?.toLowerCase() || item?.description?.toLowerCase() || "";
    return title.includes(query) || summary.includes(query);
  });
  const getInfinitePortfolios = () => {
    if (filteredPortfolios.length === 0) return [];
    let list = [...filteredPortfolios];
    while (list.length < 12) {
      list = [...list, ...filteredPortfolios];
    }
    return list;
  };
  const infinitePortfolios = getInfinitePortfolios();
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    if (container.scrollLeft >= maxScrollLeft - 5) {
      container.scrollLeft = 1;
    } else if (container.scrollLeft <= 0) {
      container.scrollLeft = maxScrollLeft - 6;
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        overflowX: "hidden",
      }}
    >
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pb: { mobile: 6, desktop: 10 },
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: { mobile: 16, desktop: 24 },
            right: { mobile: 16, desktop: 32 },
            zIndex: 100,
          }}
        >
          <ProfileDropdown />
        </Box>

        <Box
          sx={{
            pt: { mobile: 5, tablet: 7, desktop: 9 },
            pb: { mobile: 4, tablet: 6 },
            textAlign: "center",
            px: 2,
            background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)",
          }}
        >
          <Container maxWidth="md">
            <Text
              variant="h2"
              sx={{
                color: "#000000",
                mb: 1,
                letterSpacing: "-0.05px",
                fontSize: { mobile: "2.125rem", desktop: "3.75rem" },
                lineHeight: { mobile: 1.235, desktop: 1.2 },
              }}
            >
              PORTFOLIOS
            </Text>

            <Text variant="body2" sx={{ color: "text.secondary", fontWeight: 600, mb: 0.5 }}>
              Github
            </Text>

            <Text variant="body1" sx={{ color: "#4B5563", mb: { mobile: 3, desktop: 4 } }}>
              개발자들의 포트폴리오를 탐색하고 AI 요약 인사이트를 확인해보세요.
            </Text>

            <Box sx={{ maxWidth: 520, mx: "auto" }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="탐색을 시작하세요"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                slotProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon sx={{ color: "text.secondary", cursor: "pointer" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: "#FFFFFF",
                  "& .MuiOutlinedInput-root": {
                    height: { mobile: "48px", desktop: "52px" },
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
                    "& fieldset": { borderColor: "#E5E7EB" },
                    "&:hover fieldset": { borderColor: "#D1D5DB" },
                    "&.Mui-focused fieldset": { borderColor: "#3B82F6" },
                  },
                }}
              />
            </Box>
          </Container>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { mobile: 4, tablet: 5, desktop: 6 },
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              order: {
                mobile: 1,
                tablet: 2,
                desktop: 1,
              },
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress sx={{ color: "#3B82F6" }} />
              </Box>
            ) : filteredPortfolios.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                <Text variant="body1">등록된 포트폴리오가 없거나 검색 결과가 없습니다.</Text>
              </Box>
            ) : (
              <>
                <Box
                  ref={scrollRef}
                  onScroll={handleScroll}
                  sx={{
                    display: { mobile: "none", desktop: "flex" },
                    gap: 3,
                    overflowX: "auto",
                    overflowY: "hidden",
                    width: "100%",
                    px: { mobile: 2, desktop: 4 },
                    py: 1,
                    boxSizing: "border-box",
                    "&::-webkit-scrollbar": { height: 6 },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#CBD5E1",
                      borderRadius: 3,
                    },
                  }}
                >
                  {infinitePortfolios.map((item, index) => (
                    <Box
                      key={`desktop-${item?.id ?? "card"}-${index}`}
                      sx={{
                        width: "320px",
                        flexShrink: 0,
                      }}
                    >
                      <PortfolioCard portfolio={item} />
                    </Box>
                  ))}
                </Box>
                <Container
                  maxWidth="xl"
                  sx={{
                    display: { mobile: "block", desktop: "none" },
                    px: { mobile: 2, tablet: 3 },
                  }}
                >
                  <Grid container spacing={{ mobile: 1.5, tablet: 2 }} sx={{ justifyContent: "center" }}>
                    {(filteredPortfolios.length >= 4
                      ? filteredPortfolios.slice(0, 4)
                      : Array.from({ length: 4 }, (_, i) => filteredPortfolios[i % filteredPortfolios.length])
                    ).map((item, index) => (
                      <Grid
                        key={`grid-${item?.id ?? "card"}-${index}`}
                        sx={{
                          maxWidth: { mobile: "173px !important", tablet: "100%" },
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <PortfolioCard portfolio={item} />
                      </Grid>
                    ))}
                  </Grid>
                </Container>
              </>
            )}
          </Box>
          <Container
            maxWidth={false}
            sx={{
              maxWidth: "1272px",
              px: { mobile: 2, tablet: 3 },
              mx: "auto",
              boxSizing: "border-box",
              order: {
                mobile: 2,
                tablet: 1,
                desktop: 2,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { mobile: "column", tablet: "row" },
                gap: { mobile: 2, desktop: 3 },
                width: "100%",
              }}
            >
              <Card elevation={0} sx={{ flex: 1, minWidth: 0 }}>
                <CardContent sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <Box sx={{ p: 1.25, backgroundColor: "divider", display: "flex", flexShrink: 0 }}>
                    <AutoAwesomeIcon sx={{ color: "#4B5563", fontSize: "20px" }} />
                  </Box>
                  <Box>
                    <Text variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                      AI-Powered Summary
                    </Text>
                    <Text variant="body2" sx={{ color: "text.secondary", lineHeight: 1.45 }}>
                      AI 기반의 등록 기능 및 자동 태깅 포트폴리오
                    </Text>
                  </Box>
                </CardContent>
              </Card>

              <Card elevation={0} sx={{ flex: 1, minWidth: 0 }}>
                <CardContent sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <Box sx={{ p: 1.25, backgroundColor: "divider", display: "flex", flexShrink: 0 }}>
                    <CodeIcon sx={{ color: "#4B5563", fontSize: "20px" }} />
                  </Box>
                  <Box>
                    <Text variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: "text.primary" }}>
                      Codebase Insights
                    </Text>
                    <Text variant="body2" sx={{ color: "text.secondary", lineHeight: 1.45 }}>
                      코드베이스 인사이트 분석 및 기술 스택 자동 태깅
                    </Text>
                  </Box>
                </CardContent>
              </Card>

              <Card elevation={0} sx={{ flex: 1, minWidth: 0 }}>
                <CardContent sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <Box sx={{ p: 1.25, backgroundColor: "divider", display: "flex", flexShrink: 0 }}>
                    <PeopleIcon sx={{ color: "#4B5563", fontSize: "20px" }} />
                  </Box>
                  <Box>
                    <Text variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: "text.primary" }}>
                      Recruiter Direct Connect
                    </Text>
                    <Text variant="body2" sx={{ color: "text.secondary", lineHeight: 1.45 }}>
                      채용 담당자와 직접 연결하여 포트폴리오 공유
                    </Text>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
