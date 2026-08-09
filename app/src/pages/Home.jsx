import React, { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import PortfolioCard from "../components/Home/PortfolioCard";
import { supabase } from "../utils/supabase";

import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CodeIcon from "@mui/icons-material/Code";
import PeopleIcon from "@mui/icons-material/People";

export default function MainPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("portfolios")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPortfolios(data || []);
      } catch (err) {
        console.error("포트폴리오 로딩 실패:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);
  const filteredPortfolios = portfolios.filter((item) => {
    const query = searchTerm.toLowerCase();
    const title = item.title?.toLowerCase() || "";
    const summary = item.ai_summary?.toLowerCase() || item.description?.toLowerCase() || "";
    return title.includes(query) || summary.includes(query);
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#FFFFFF" }}>
      <Box component="main" sx={{ flexGrow: 1, pb: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            pt: { xs: 5, sm: 7, md: 9 },
            pb: { xs: 4, sm: 6 },
            textAlign: "center",
            px: 2,
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h2"
              sx={{
                color: "#000000",
                mb: 1,
                letterSpacing: "0.5px",
              }}
            >
              PORTFOLIOS
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#6B7280",
                fontWeight: 600,
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
                mb: 0.5,
              }}
            >
              Github
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#4B5563",
                fontSize: { xs: "0.9rem", sm: "1rem" },
                mb: { xs: 3, md: 4 },
                wordBreak: "keep-all",
              }}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </Typography>
            <Box sx={{ maxWidth: 560, mx: "auto" }}>
              <TextField
                fullWidth
                placeholder="탐색을 시작하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon sx={{ color: "#9CA3AF" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: "#FFFFFF",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "4px",
                    height: { xs: "48px", md: "52px" },
                    "& fieldset": { borderColor: "#E5E7EB" },
                    "&:hover fieldset": { borderColor: "#D1D5DB" },
                    "&.Mui-focused fieldset": { borderColor: "#3B82F6" },
                  },
                }}
              />
            </Box>
          </Container>
        </Box>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4, md: 6 }, mb: { xs: 6, md: 8 } }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress color="inherit" />
            </Box>
          ) : filteredPortfolios.length === 0 ? (
            <Typography align="center" sx={{ color: "#9CA3AF", py: 8 }}>
              등록된 포트폴리오가 없습니다.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                gap: { xs: 2, sm: 2.5, md: 3 },
                overflowX: { xs: "visible", md: "auto" },
                flexWrap: { xs: "wrap", md: "nowrap" },
                py: 1,
                px: 0.5,
                "&::-webkit-scrollbar": { height: 6 },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#E2E8F0",
                  borderRadius: 4,
                },
              }}
            >
              {filteredPortfolios.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    width: {
                      xs: "100%",                  
                      sm: "calc(50% - 10px)",      
                      md: "310px",                
                    },
                    minWidth: { md: "310px" },
                    flexShrink: 0,
                  }}
                >
                  <PortfolioCard portfolio={item} />
                </Box>
              ))}
            </Box>
          )}
        </Container>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #E5E7EB",
                  p: 0.5,
                  height: "100%",
                }}
              >
                <CardContent sx={{ display: "flex", gap: 2, alignItems: "flex-start", p: "16px !important" }}>
                  <Box
                    sx={{
                      p: 1.25,
                      backgroundColor: "#F3F4F6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AutoAwesomeIcon sx={{ color: "#4B5563", fontSize: "20px" }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, fontSize: "0.95rem" }}>
                      AI-Powered Summary
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280", lineHeight: 1.45, fontSize: "0.85rem" }}>
                      AI-powered registration features and auto-tagging portfolio
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #E5E7EB",
                  p: 0.5,
                  height: "100%",
                }}
              >
                <CardContent sx={{ display: "flex", gap: 2, alignItems: "flex-start", p: "16px !important" }}>
                  <Box
                    sx={{
                      p: 1.25,
                      backgroundColor: "#F3F4F6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CodeIcon sx={{ color: "#4B5563", fontSize: "20px" }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, fontSize: "0.95rem" }}>
                      Codebase Insights
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280", lineHeight: 1.45, fontSize: "0.85rem" }}>
                      Codebase insights dark/light and auto-tagging portfolio
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #E5E7EB",
                  p: 0.5,
                  height: "100%",
                }}
              >
                <CardContent sx={{ display: "flex", gap: 2, alignItems: "flex-start", p: "16px !important" }}>
                  <Box
                    sx={{
                      p: 1.25,
                      backgroundColor: "#F3F4F6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PeopleIcon sx={{ color: "#4B5563", fontSize: "20px" }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, fontSize: "0.95rem" }}>
                      Recruiter Direct Connect
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280", lineHeight: 1.45, fontSize: "0.85rem" }}>
                      AI-powered registration features and auto-tagging portfolio
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}