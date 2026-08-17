/**
 * GitHub AI 분석 결과 단일 요약 카드 렌더링
 * @param {{ title: string, description: string, isAnalysisCompleted: boolean }} props - title: 카드 상단 파란 제목, description: 카드 본문 설명, isAnalysisCompleted: 저장소 분석이 완료됐는지 여부
 * @returns {JSX.Element} 분석 결과 한 항목을 표시하는 카드 UI
 */
import Stack from "@mui/material/Stack";
import Text from "@mui/material/Typography";

// 분석은 끝났는데 AI가 이 항목에 근거가 부족하다고 판단해 빈 문자열을 준 경우에만 보여줄 안내 문구
const EMPTY_DESCRIPTION_TEXT = "AI가 이 항목에 대한 분석 근거를 찾지 못했습니다.";

export default function AnalysisResultCard({ title, description, isAnalysisCompleted = false }) {
  const hasDescription = Boolean(description && description.trim());
  // 분석 전 기본 빈 상태와, 분석 후 AI가 근거 없이 빈 값을 준 상태를 구분한다.
  const showEmptyNotice = isAnalysisCompleted && !hasDescription;

  return (
    <Stack className="portfolio-editor-analysis-card" spacing={0.75}>
      <Text className="portfolio-editor-analysis-card__title">{title}</Text>
      <Text
        className="portfolio-editor-analysis-card__description"
        color={showEmptyNotice ? "text.disabled" : "text.primary"}
      >
        {hasDescription ? description : showEmptyNotice ? EMPTY_DESCRIPTION_TEXT : ""}
      </Text>
    </Stack>
  );
}
