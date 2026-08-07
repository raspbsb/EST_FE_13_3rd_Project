/**
 * GitHub AI 분석 결과 단일 요약 카드 렌더링
 * @param {{ title: string, description: string }} props - 카드 제목, 본문 텍스트
 * @returns {JSX.Element} 제목과 설명을 포함한 분석 결과 카드 UI
 */
import Stack from "@mui/material/Stack";
import Text from "@mui/material/Typography";

export default function AnalysisResultCard({ title, description }) {
  return (
    <Stack
      spacing={0.75}
      sx={{
        border: "1px solid rgba(0, 87, 205, 0.2)",
        borderRadius: 1,
        bgcolor: "rgba(255, 255, 255, 0.72)",
        p: 2,
        minHeight: 130,
      }}
    >
      <Text color="primary" fontWeight={700} fontSize={18}>
        {title}
      </Text>
      <Text color="text.primary" fontSize={16} lineHeight={1.5}>
        {description}
      </Text>
    </Stack>
  );
}
