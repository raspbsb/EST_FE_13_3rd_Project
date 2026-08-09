import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardActionArea, CardMedia, Box, Typography } from "@mui/material";

export default function PortfolioCard({ portfolio }) {
  const navigate = useNavigate();
  const id = portfolio?.id;
  const title = portfolio?.title || "제목 없음";
  const content = portfolio?.ai_summary || portfolio?.content || portfolio?.description || "요약 내용이 없습니다.";
  const image = portfolio?.thumbnail_url || portfolio?.thumbnailImg || portfolio?.image || "https://via.placeholder.com/600x400";

  const handleClick = () => {
    if (id) {
      navigate(`/portfolio/${id}`);
    }
  };

  return (
    <Card
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        border: "1px solid #E5E7EB",
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <CardActionArea
        onClick={handleClick}
        sx={{
          height: "100%",
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
            height: { xs: "200px", sm: "240px", md: "280px" },
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
            padding: { xs: "16px", md: "24px" },
            boxSizing: "border-box",
            textAlign: "center",
            opacity: 0,
            transition: "opacity 0.25s ease-in-out",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              fontSize: "1rem",
              mb: 1,
              color: "#FFFFFF",
              letterSpacing: "0.5px",
            }}
          >
            AI 요약
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1rem", md: "1.15rem" },
              mb: 1,
              wordBreak: "keep-all",
              lineHeight: 1.3,
            }}
          >
            Title : {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: "0.85rem", md: "0.925rem" },
              color: "#D1D5DB",
              lineHeight: 1.5,
              wordBreak: "keep-all",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            Content : {content}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}