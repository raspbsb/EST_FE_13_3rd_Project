import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardActionArea, CardMedia, Box, Typography } from "@mui/material";

export default function PortfolioCard({ portfolio }) {
  const navigate = useNavigate();
  const id = portfolio?.id || portfolio?.portfolio_id || portfolio?._id;
  const title = portfolio?.title || "제목 없음";
  const content =
    portfolio?.ai_summary ||
    portfolio?.content ||
    portfolio?.description ||
    "요약 내용이 없습니다.";
  const images = portfolio?.portfolio_images || [];
  const thumbnailObj =
    images.find((img) => img.is_thumbnail || img.is_main) || images[0];

  const image =
    thumbnailObj?.image_url ||
    portfolio?.thumbnail_url ||
    portfolio?.thumbnailImg ||
    portfolio?.image_url ||
    portfolio?.image ||
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"; 
  const handleClick = () => {
    if (id) {
      navigate(`/portfolios/${id}`);
    } else {
      console.warn("포트폴리오 ID가 전달되지 않았습니다.", portfolio);
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        height: { xs: "173px", sm: "280px", md: "360px" },
        aspectRatio: { xs: "1 / 1", sm: "unset" },
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        border: "1px solid #E5E7EB",
        position: "relative",
        mx: "auto", 
      }}
    >
      <CardActionArea
        onClick={handleClick}
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          "&:hover .portfolio-thumbnail": {
            transform: "scale(1.04)",
          },
          "&:hover .portfolio-overlay": {
            opacity: 1,
          },
        }}
      >
        <CardMedia
          component="img"
          image={image}
          alt={title}
          className="portfolio-thumbnail"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
        <Box
          className="portfolio-overlay"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.78)",
            color: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: { xs: 1.5, md: 3 }, 
            boxSizing: "border-box",
            textAlign: "center",
            opacity: 0,
            transition: "opacity 0.25s ease-in-out",
            pointerEvents: "none",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "0.7rem", sm: "0.875rem", md: "1rem" },
              mb: { xs: 0.25, md: 1 },
              color: "#3B82F6",
              letterSpacing: "0.5px",
            }}
          >
            AI 요약
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "0.8rem", sm: "0.95rem", md: "1.1rem" },
              mb: { xs: 0.25, md: 1 },
              wordBreak: "keep-all",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
              color: "#D1D5DB",
              lineHeight: 1.3,
              wordBreak: "keep-all",
              display: "-webkit-box",
              WebkitLineClamp: { xs: 2, sm: 3, md: 4 },
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {content}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}