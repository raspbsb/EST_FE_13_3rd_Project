/**
 * GitHub AI 분석 결과 단일 요약 카드 렌더링
 * @param {{ title: string, description: string }} props - title: 카드 상단 파란 제목, description: 카드 본문 설명
 * @returns {JSX.Element} 분석 결과 한 항목을 표시하는 카드 UI
 */
import Stack from "@mui/material/Stack";
import Text from "@mui/material/Typography";

export default function AnalysisResultCard({ title, description }) {
  return (
    <Stack
      className="portfolio-editor-analysis-card"
      spacing={0.75}
      sx={{
        border: "1px solid rgba(0, 87, 205, 0.2)",
        borderRadius: "8px",
        bgcolor: "rgba(255, 255, 255, 0.6)",
        p: "17px",
        minHeight: 136,
      }}
    >
      <Text
        className="portfolio-editor-analysis-card__title"
        sx={{
          color: "#0d6efd",
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: "0.28px",
          lineHeight: "27px",
        }}
      >
        {title}
      </Text>
      <Text
        className="portfolio-editor-analysis-card__description"
        sx={{
          color: "#212121",
          fontSize: 14,
          fontWeight: 400,
          lineHeight: "22px",
        }}
      >
        {description}
      </Text>
    </Stack>
  );
}
