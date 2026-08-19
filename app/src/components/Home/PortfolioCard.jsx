import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { supabase } from "../../utils/supabase";

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  border: "1px solid #E5E7EB",
  position: "relative",
  marginRight: "auto",
  marginLeft: "auto",
}));

const StyledCardActionArea = styled(CardActionArea)({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "space-between",
  "&:hover .portfolio-thumbnail": {
    transform: "scale(1.04)",
  },
  "&:hover .portfolio-overlay": {
    opacity: 1,
  },
});

const DEFAULT_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23F1F5F9%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2218%22%20fill%3D%22%2394A3B8%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E";

export default function PortfolioCard({ portfolio }) {
  const navigate = useNavigate();

  const id = portfolio?.project_id || portfolio?.id || portfolio?.portfolio_id || portfolio?._id;
  const title = portfolio?.title || "제목 없음";

  const content =
    portfolio?.text || portfolio?.ai_summary || portfolio?.content || portfolio?.description || "요약 내용이 없습니다.";

  const images = Array.isArray(portfolio?.portfolio_images) ? portfolio.portfolio_images : [];

  const sortedImages = [...images].sort((a, b) => {
    const orderA = Number.isFinite(Number(a?.display_order)) ? Number(a.display_order) : Infinity;
    const orderB = Number.isFinite(Number(b?.display_order)) ? Number(b.display_order) : Infinity;
    return orderA - orderB;
  });

  const thumbnailObj = sortedImages[0];

  const rawPath =
    thumbnailObj?.image_path ||
    thumbnailObj?.image_url ||
    (typeof thumbnailObj === "string" ? thumbnailObj : null) ||
    portfolio?.image_path ||
    portfolio?.thumbnail_url ||
    portfolio?.cover_image ||
    portfolio?.image;

  const getImageUrl = path => {
    if (!path) return DEFAULT_IMAGE;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    const cleanPath = path.replace(/^portfolio_images\//, "");
    const { data } = supabase.storage.from("portfolio_images").getPublicUrl(cleanPath);
    return data?.publicUrl || DEFAULT_IMAGE;
  };

  const image = getImageUrl(rawPath);

  const handleCardClick = () => {
    if (id) {
      navigate(`/portfolios/${id}`);
    } else {
      console.warn("포트폴리오 ID가 전달되지 않았습니다.", portfolio);
    }
  };

  return (
    <StyledCard
      sx={{
        height: { mobile: "210px", tablet: "300px", desktop: "380px" },
      }}
    >
      <StyledCardActionArea onClick={handleCardClick}>
        <Box sx={{ position: "relative", width: "100%", flex: 1, overflow: "hidden" }}>
          <CardMedia
            component="img"
            image={image}
            alt={title}
            className="portfolio-thumbnail"
            onError={e => {
              e.target.onerror = null;
              e.target.src = DEFAULT_IMAGE;
            }}
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
              padding: { mobile: 1.5, desktop: 2.5 },
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
                fontSize: { mobile: "0.7rem", tablet: "0.8rem", desktop: "0.875rem" },
                mb: 0.5,
                color: "#3B82F6",
                letterSpacing: "0.5px",
              }}
            >
              AI 요약
            </Text>

            <Text
              variant="body2"
              sx={{
                fontSize: { mobile: "0.75rem", tablet: "0.8rem", desktop: "0.875rem" },
                color: "#E5E7EB",
                lineHeight: 1.4,
                wordBreak: "keep-all",
                display: "-webkit-box",
                WebkitLineClamp: { mobile: 3, tablet: 4, desktop: 5 },
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {content}
            </Text>
          </Box>
        </Box>
        <Box
          sx={{
            padding: { mobile: "10px 12px", desktop: "14px 16px" },
            backgroundColor: "#FFFFFF",
            borderTop: "1px solid #F3F4F6",
          }}
        >
          <Text
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: { mobile: "0.85rem", tablet: "0.95rem", desktop: "1.05rem" },
              color: "#111827",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Text>
        </Box>
      </StyledCardActionArea>
    </StyledCard>
  );
}
