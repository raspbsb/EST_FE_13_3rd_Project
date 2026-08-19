import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Text from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";

import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CodeIcon from "@mui/icons-material/Code";
import PeopleIcon from "@mui/icons-material/People";

import PortfolioCard from "../components/Home/PortfolioCard";
import { supabase } from "../utils/supabase";

const FeatureIconWrapper = styled(Box)(({ theme }) => ({
  width: "40px",
  height: "40px",
  backgroundColor: "#F1F5F9",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(1.5),
}));

const StyledFeatureCard = styled(Card)(({ theme }) => ({
  width: "100%",
  border: "1px solid #E2E8F0",
  borderRadius: "12px",
  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
  height: "100%",
}));

const RowFeatureSection = ({ cardWidth = "100%" }) => (
  <Box
    sx={{
      display: "flex",
      gap: "24px",
      width: "100%",
      justifyContent: "center",
    }}
  >
    <Box sx={{ flex: 1, maxWidth: cardWidth }}>
      <StyledFeatureCard>
        <CardContent sx={{ p: 2.5 }}>
          <FeatureIconWrapper>
            <AutoAwesomeIcon sx={{ color: "#3B82F6", fontSize: "20px" }} />
          </FeatureIconWrapper>

          <Text
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              color: "#0F172A",
            }}
          >
            AI-Powered Summary
          </Text>

          <Text
            variant="body2"
            sx={{
              color: "#64748B",
              fontSize: "0.85rem",
              lineHeight: 1.45,
            }}
          >
            AI 기반의 등록 기능 및 자동 태깅 포트폴리오
          </Text>
        </CardContent>
      </StyledFeatureCard>
    </Box>

    <Box sx={{ flex: 1, maxWidth: cardWidth }}>
      <StyledFeatureCard>
        <CardContent sx={{ p: 2.5 }}>
          <FeatureIconWrapper>
            <CodeIcon sx={{ color: "#3B82F6", fontSize: "20px" }} />
          </FeatureIconWrapper>

          <Text
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              color: "#0F172A",
            }}
          >
            Codebase Insights
          </Text>

          <Text
            variant="body2"
            sx={{
              color: "#64748B",
              fontSize: "0.85rem",
              lineHeight: 1.45,
            }}
          >
            코드베이스 인사이트 분석 및 기술 스택 자동 태깅
          </Text>
        </CardContent>
      </StyledFeatureCard>
    </Box>

    <Box sx={{ flex: 1, maxWidth: cardWidth }}>
      <StyledFeatureCard>
        <CardContent sx={{ p: 2.5 }}>
          <FeatureIconWrapper>
            <PeopleIcon sx={{ color: "#3B82F6", fontSize: "20px" }} />
          </FeatureIconWrapper>

          <Text
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              color: "#0F172A",
            }}
          >
            Recruiter Direct Connect
          </Text>

          <Text
            variant="body2"
            sx={{
              color: "#64748B",
              fontSize: "0.85rem",
              lineHeight: 1.45,
            }}
          >
            채용 담당자와 직접 연결하여 포트폴리오 공유
          </Text>
        </CardContent>
      </StyledFeatureCard>
    </Box>
  </Box>
);

const ColumnFeatureSection = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      width: "100%",
    }}
  >
    <StyledFeatureCard>
      <CardContent sx={{ p: 2.5 }}>
        <FeatureIconWrapper>
          <AutoAwesomeIcon sx={{ color: "#3B82F6", fontSize: "20px" }} />
        </FeatureIconWrapper>

        <Text
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            mb: 0.5,
            color: "#0F172A",
          }}
        >
          AI-Powered Summary
        </Text>

        <Text
          variant="body2"
          sx={{
            color: "#64748B",
            fontSize: "0.85rem",
            lineHeight: 1.45,
          }}
        >
          AI 기반의 등록 기능 및 자동 태깅 포트폴리오
        </Text>
      </CardContent>
    </StyledFeatureCard>

    <StyledFeatureCard>
      <CardContent sx={{ p: 2.5 }}>
        <FeatureIconWrapper>
          <CodeIcon sx={{ color: "#3B82F6", fontSize: "20px" }} />
        </FeatureIconWrapper>

        <Text
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            mb: 0.5,
            color: "#0F172A",
          }}
        >
          Codebase Insights
        </Text>

        <Text
          variant="body2"
          sx={{
            color: "#64748B",
            fontSize: "0.85rem",
            lineHeight: 1.45,
          }}
        >
          코드베이스 인사이트 분석 및 기술 스택 자동 태깅
        </Text>
      </CardContent>
    </StyledFeatureCard>

    <StyledFeatureCard>
      <CardContent sx={{ p: 2.5 }}>
        <FeatureIconWrapper>
          <PeopleIcon sx={{ color: "#3B82F6", fontSize: "20px" }} />
        </FeatureIconWrapper>

        <Text
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            mb: 0.5,
            color: "#0F172A",
          }}
        >
          Recruiter Direct Connect
        </Text>

        <Text
          variant="body2"
          sx={{
            color: "#64748B",
            fontSize: "0.85rem",
            lineHeight: 1.45,
          }}
        >
          채용 담당자와 직접 연결하여 포트폴리오 공유
        </Text>
      </CardContent>
    </StyledFeatureCard>
  </Box>
);

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);

        let query = supabase
          .from("portfolios")
          .select(
            `
            *,
            portfolio_images (
              image_path,
              display_order
            )
          `,
          )
          .order("created_at", { ascending: false })
          .limit(12);

        const cleanedQuery = searchTerm.trim();

        if (cleanedQuery) {
          query = query.ilike("title", `%${cleanedQuery}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error("포트폴리오 검색 오류:", error);
          throw error;
        }

        console.log("검색어:", cleanedQuery);
        console.log("검색 결과:", data);

        setPortfolios(data ?? []);
      } catch (err) {
        console.error("DB 데이터 로드 오류:", err.message);
        setPortfolios([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchPortfolios();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getInfinitePortfolios = () => {
    if (searchTerm.trim()) {
      return portfolios;
    }

    if (portfolios.length === 0) {
      return [];
    }

    const repeated = [];

    while (repeated.length < 12) {
      repeated.push(...portfolios);
    }

    return repeated.slice(0, 12);
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
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif",
        background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)",
        width: "100%",
      }}
    >
      <Helmet>
        <title>PORTFOLIOS - 개발자 포트폴리오 모음</title>

        <meta name="description" content="개발자들의 포트폴리오를 탐색하고 AI 요약 인사이트를 확인해보세요." />

        <meta property="og:title" content="PORTFOLIOS - 개발자 포트폴리오 탐색" />

        <meta property="og:description" content="개발자들의 포트폴리오를 탐색하고 AI 요약 인사이트를 확인해보세요." />

        <meta property="og:type" content="website" />

        <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : ""} />
      </Helmet>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pb: { mobile: 6, desktop: 10 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            pt: { mobile: 3, tablet: 5 },
            pb: { mobile: 3, tablet: 4 },
            textAlign: "center",
            width: "100%",
            px: 2,
          }}
        >
          <Container
            maxWidth="md"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text
              variant="h2"
              sx={{
                color: "#0F172A",
                fontWeight: 800,
                mb: 1,
                fontSize: {
                  mobile: "2rem",
                  tablet: "2.75rem",
                  desktop: "3.25rem",
                },
                letterSpacing: "-0.02em",
                fontFamily: "inherit",
              }}
            >
              PORTFOLIOS
            </Text>

            <Text
              variant="body2"
              sx={{
                color: "#64748B",
                fontWeight: 600,
                mb: 0.5,
                fontFamily: "inherit",
              }}
            >
              Github
            </Text>

            <Text
              variant="body1"
              sx={{
                color: "#4B5563",
                mb: 3,
                fontFamily: "inherit",
              }}
            >
              개발자들의 포트폴리오를 탐색하고 AI 요약 인사이트를 확인해보세요.
            </Text>

            <Box
              sx={{
                width: "100%",
                maxWidth: 480,
                mx: "auto",
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="탐색을 시작하세요"
                aria-label="포트폴리오 검색"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon
                          sx={{
                            color: "#94A3B8",
                            fontSize: "20px",
                            cursor: "pointer",
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#FFFFFF",
                    fontFamily: "inherit",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",

                    "& fieldset": {
                      borderColor: "#E2E8F0",
                    },

                    "&:hover fieldset": {
                      borderColor: "#CBD5E1",
                    },

                    "&.Mui-focused fieldset": {
                      borderColor: "#3B82F6",
                    },
                  },
                }}
              />
            </Box>
          </Container>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
              width: "100%",
            }}
          >
            <CircularProgress
              sx={{
                color: "#3B82F6",
              }}
            />
          </Box>
        ) : portfolios.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              color: "#64748B",
            }}
          >
            <Text variant="body1">{searchTerm.trim() ? "검색 결과가 없습니다." : "등록된 포트폴리오가 없습니다."}</Text>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              width: "100%",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: {
                  mobile: "none",
                  desktop: "block",
                },
                width: "100%",
              }}
            >
              <Box
                ref={scrollRef}
                onScroll={handleScroll}
                sx={{
                  display: "flex",
                  gap: 3,
                  overflowX: "auto",
                  px: 4,
                  py: 1,
                  mb: 8,

                  justifyContent: portfolios.length < 4 ? "center" : "flex-start",

                  "&::-webkit-scrollbar": {
                    height: 6,
                  },

                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#CBD5E1",
                    borderRadius: 3,
                  },
                }}
              >
                {infinitePortfolios.map((item, index) => (
                  <Box
                    key={`desk-${item?.id ?? "card"}-${index}`}
                    sx={{
                      width: 280,
                      flexShrink: 0,
                      mx: portfolios.length < 4 ? "auto" : undefined,
                    }}
                  >
                    <PortfolioCard portfolio={item} />
                  </Box>
                ))}
              </Box>

              {!searchTerm.trim() && (
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 1272,
                    mx: "auto",
                    px: 3,
                  }}
                >
                  <RowFeatureSection />
                </Box>
              )}
            </Box>
            <Box
              sx={{
                display: {
                  mobile: "none",
                  tablet: "block",
                  desktop: "none",
                },
                width: "100%",
                maxWidth: 1024,
                px: 3,
                mx: "auto",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column-reverse",
                  gap: "32px",
                  alignItems: "center",
                }}
              >
                {!searchTerm.trim() && (
                  <Box sx={{ width: "100%" }}>
                    <RowFeatureSection cardWidth="312px" />
                  </Box>
                )}

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "24px",
                    width: "100%",
                  }}
                >
                  {portfolios.slice(0, 3).map((item, index) => (
                    <Box
                      key={`tab-${item?.id ?? "card"}-${index}`}
                      sx={{
                        width: "100%",
                      }}
                    >
                      <PortfolioCard portfolio={item} />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: {
                  mobile: "block",
                  tablet: "none",
                },
                width: "100%",
                px: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px",
                    width: "100%",
                    maxWidth: 400,
                    mx: "auto",
                  }}
                >
                  {portfolios.slice(0, 4).map((item, index) => (
                    <Box
                      key={`mob-${item?.id ?? "card"}-${index}`}
                      sx={{
                        width: "100%",
                      }}
                    >
                      <PortfolioCard portfolio={item} />
                    </Box>
                  ))}
                </Box>

                {!searchTerm.trim() && (
                  <Box
                    sx={{
                      width: "100%",
                      maxWidth: 400,
                      mx: "auto",
                    }}
                  >
                    <ColumnFeatureSection />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
