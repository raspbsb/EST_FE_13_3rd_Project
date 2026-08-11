import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";

export default function PortfolioCard({ portfolio }) {
  const navigate = useNavigate();
  const id = portfolio?.id || portfolio?.portfolio_id || portfolio?._id;
  const title = portfolio?.title || "제목 없음";
  const content = portfolio?.ai_summary || portfolio?.content || portfolio?.description || "요약 내용이 없습니다.";
  const images = portfolio?.portfolio_images || [];
  const thumbnailObj = images.find(img => img.is_thumbnail || img.is_main) || images[0];

  const image =
    thumbnailObj?.image_url ||
    portfolio?.thumbnail_url ||
    portfolio?.thumbnailImg ||
    portfolio?.image_url ||
    portfolio?.image ||
    null;

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
        height: { mobile: "173px", tablet: "280px", desktop: "360px" },
        aspectRatio: { mobile: "1 / 1", tablet: "unset" },
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
          image={image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"}
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
            padding: { mobile: 1.5, desktop: 3 },
            boxSizing: "border-box",
            textAlign: "center",
            opacity: 0,
            transition: "opacity 0.25s ease-in-out",
            pointerEvents: "none",
          }}
        >
          <Text
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              fontSize: { mobile: "0.7rem", tablet: "0.875rem", desktop: "1rem" },
              mb: { mobile: 0.25, desktop: 1 },
              color: "#3B82F6",
              letterSpacing: "0.5px",
            }}
          >
            AI 요약
          </Text>

          <Text
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: { mobile: "0.8rem", tablet: "0.95rem", desktop: "1.1rem" },
              mb: { mobile: 0.25, desktop: 1 },
              wordBreak: "keep-all",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Text>

          <Text
            variant="body2"
            sx={{
              fontSize: { mobile: "0.7rem", tablet: "0.8rem", desktop: "0.875rem" },
              color: "#D1D5DB",
              lineHeight: 1.3,
              wordBreak: "keep-all",
              display: "-webkit-box",
              WebkitLineClamp: { mobile: 2, tablet: 3, desktop: 4 },
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {content}
          </Text>
        </Box>
      </CardActionArea>
    </Card>
  );
}
