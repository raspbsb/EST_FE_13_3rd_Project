/**
 * GitHub AI 분석 결과 단일 요약 카드 렌더링
 * @param {{ title: string, description: string }} props - title: 카드 상단 파란 제목, description: 카드 본문 설명
 * @returns {JSX.Element} 분석 결과 한 항목을 표시하는 카드 UI
 */
import Stack from "@mui/material/Stack";
import Text from "@mui/material/Typography";

export default function AnalysisResultCard({ title, description }) {
  return (
    <Stack className="portfolio-editor-analysis-card" spacing={0.75}>
      <Text className="portfolio-editor-analysis-card__title">{title}</Text>
      <Text className="portfolio-editor-analysis-card__description">{description}</Text>
    </Stack>
  );
}
