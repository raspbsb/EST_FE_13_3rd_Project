import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import PortfolioCard from "../components/Home/PortfolioCard";
import ProfileDropdown from "../components/Home/ProfileDropdown";
import { supabase } from "../utils/supabase";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
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

  const filteredPortfolios = portfolios.filter((item) => {
    const query = searchTerm.toLowerCase();
    const title = item.title?.toLowerCase() || "";
    const summary =
      item.ai_summary?.toLowerCase() || item.description?.toLowerCase() || "";
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
    if (
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - 20
    ) {
      container.scrollTo({ left: 1, behavior: "auto" });
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
          pb: { xs: 6, md: 10 },
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: { xs: 16, md: 24 },
            right: { xs: 16, md: 32 },
            zIndex: 100,
          }}
        >
          <ProfileDropdown />
        </Box>

        <Box
          sx={{
            pt: { xs: 5, sm: 7, md: 9 },
            pb: { xs: 4, sm: 6 },
            textAlign: "center",
            px: 2,
            background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)",
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h2"
              sx={{
                color: "#000000",
                mb: 1,
                letterSpacing: "-0.05px",
                fontSize: { xs: "2.125rem", md: "3.75rem" },
                lineHeight: { xs: 1.235, md: 1.2 },
              }}
            >
              PORTFOLIOS
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontWeight: 600, mb: 0.5 }}
            >
              Github
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: "#4B5563", mb: { xs: 3, md: 4 } }}
            >
              개발자들의 포트폴리오를 탐색하고 AI 요약 인사이트를 확인해보세요.
            </Typography>

            <Box sx={{ maxWidth: 520, mx: "auto" }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="탐색을 시작하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon
                        sx={{ color: "text.secondary", cursor: "pointer" }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: "#FFFFFF",
                  "& .MuiOutlinedInput-root": {
                    height: { xs: "48px", md: "52px" },
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
            gap: { xs: 4, sm: 5, md: 6 },
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              order: {
                xs: 1,
                sm: 2,
                md: 1,
              },
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress sx={{ color: "#3B82F6" }} />
              </Box>
            ) : filteredPortfolios.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                <Typography variant="body1">
                  등록된 포트폴리오가 없거나 검색 결과가 없습니다.
                </Typography>
              </Box>
            ) : (
              <>
                <Box
                  ref={scrollRef}
                  onScroll={handleScroll}
                  sx={{
                    display: { xs: "none", md: "flex" },
                    gap: 3,
                    overflowX: "auto",
                    overflowY: "hidden",
                    width: "100%",
                    px: { xs: 2, md: 4 },
                    py: 1,
                    boxSizing: "border-box",
                    "&::-webkit-scrollbar": { height: 6 },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#CBD5E1",
                    },
                  }}
                >
                  {infinitePortfolios.map((item, index) => (
                    <Box
                      key={`desktop-${item.id || "card"}-${index}`}
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
                    display: { xs: "block", md: "none" },
                    px: { xs: 2, sm: 3 },
                  }}
                >
                  <Grid
                    container
                    spacing={{ xs: 1.5, sm: 2 }}
                    sx={{ justifyContent: "center" }}
                  >
                    {(filteredPortfolios.length >= 4
                      ? filteredPortfolios.slice(0, 4)
                      : Array.from(
                          { length: 4 },
                          (_, i) =>
                            filteredPortfolios[i % filteredPortfolios.length],
                        )
                    ).map((item, index) => (
                      <Grid
                        item
                        xs={6}
                        sm={12}
                        key={`grid-${item?.id || "card"}-${index}`}
                        sx={{
                          maxWidth: { xs: "173px !important", sm: "100%" },
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
              px: { xs: 2, sm: 3 },
              mx: "auto",
              boxSizing: "border-box",
              order: {
                xs: 2,
                sm: 1,
                md: 2,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, md: 3 },
                width: "100%",
              }}
            >
              <Card
                elevation={0}
                sx={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <CardContent
                  sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}
                >
                  <Box
                    sx={{
                      p: 1.25,
                      backgroundColor: "divider",
                      display: "flex",
                      flexShrink: 0,
                    }}
                  >
                    <AutoAwesomeIcon
                      sx={{ color: "#4B5563", fontSize: "20px" }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, mb: 0.5 }}
                    >
                      AI-Powered Summary
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.45,
                      }}
                    >
                      AI 기반의 등록 기능 및 자동 태깅 포트폴리오
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              <Card
                elevation={0}
                sx={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <CardContent
                  sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}
                >
                  <Box
                    sx={{
                      p: 1.25,
                      backgroundColor: "divider",
                      display: "flex",
                      flexShrink: 0,
                    }}
                  >
                    <CodeIcon sx={{ color: "#4B5563", fontSize: "20px" }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="text.primary"
                      sx={{ fontWeight: 700, mb: 0.5 }}
                    >
                      Codebase Insights
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.45,
                      }}
                    >
                      코드베이스 인사이트 분석 및 기술 스택 자동 태깅
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              <Card
                elevation={0}
                sx={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <CardContent
                  sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}
                >
                  <Box
                    sx={{
                      p: 1.25,
                      backgroundColor: "divider",
                      display: "flex",
                      flexShrink: 0,
                    }}
                  >
                    <PeopleIcon sx={{ color: "#4B5563", fontSize: "20px" }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="text.primary"
                      sx={{ fontWeight: 700, mb: 0.5 }}
                    >
                      Recruiter Direct Connect
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.45,
                      }}
                    >
                      채용 담당자와 직접 연결하여 포트폴리오 공유
                    </Typography>
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
