/**
 * 프로젝트 설명, AI 추천 초안, 한 줄 요약 확인 섹션
 * @param {{ sectionCardSx: object, formInputSx: object, draftGuide: object }} props - sectionCardSx: 섹션 외곽 박스 sx, formInputSx: OutlinedInput 공통 sx, draftGuide: AI 초안 생성 상태 객체
 * @returns {JSX.Element} 현재 설명 비교 카드, AI 추천 초안 카드, AI 추천 한 줄 요약 입력 영역
 */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Text from "@mui/material/Typography";
import { EditIcon } from "../../lib/icons";

export default function DraftGuideSection({ sectionCardSx, formInputSx, draftGuide }) {
  return (
    <Box>
      <Box
        className="portfolio-editor-draft-guide"
        component="section"
        aria-labelledby="draft-guide-title"
        sx={sectionCardSx}
      >
        <Stack
          direction={{ xs: "column", tablet: "row" }}
          spacing={2}
          sx={{
            mb: 3,
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", tablet: "center" },
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <EditIcon aria-hidden="true" />

            <Text id="draft-guide-title" component="h2" variant="h5" fontWeight={700}>
              프로젝트 설명 초안 가이드 생성
            </Text>
          </Stack>

          <Button type="button" variant="contained" disabled>
            생성 완료
          </Button>
        </Stack>

        <Stack direction={{ xs: "column", tablet: "row" }} spacing={3} sx={{ mb: 3 }}>
          <Paper
            className="portfolio-editor-draft-guide__card portfolio-editor-draft-guide__card--current"
            component="article"
            variant="outlined"
            sx={{
              flex: 1,
              minHeight: 270,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Text className="portfolio-editor-draft-guide__card-title" component="h3" variant="h6">
              현재 내용
            </Text>

            <Text
              className="portfolio-editor-draft-guide__card-body"
              component="p"
              sx={{ flex: 1, whiteSpace: "pre-line" }}
            >
              {draftGuide.originalDescription}
            </Text>

            <Button type="button" variant="contained" sx={{ alignSelf: "flex-end" }}>
              되돌리기
            </Button>
          </Paper>

          <Paper
            className="portfolio-editor-draft-guide__card portfolio-editor-draft-guide__card--ai"
            component="article"
            variant="outlined"
            sx={{
              flex: 1,
              minHeight: 270,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Text className="portfolio-editor-draft-guide__card-title" component="h3" variant="h6">
              AI 추천 초안 (미리보기)
            </Text>

            <Text className="portfolio-editor-draft-guide__card-body" component="p" sx={{ flex: 1 }}>
              {draftGuide.aiDraftDescription}
            </Text>

            <Button type="button" variant="contained" disabled sx={{ alignSelf: "flex-end" }}>
              적용됨
            </Button>
          </Paper>
        </Stack>

        <Box component="section" aria-labelledby="one-line-summary-title">
          <Text
            id="one-line-summary-title"
            component="h3"
            variant="subtitle1"
            color="primary"
            fontWeight={700}
            sx={{ mb: 1 }}
          >
            AI 추천 한 줄 요약 (미리보기)
          </Text>

          <OutlinedInput
            className="portfolio-editor-draft-guide__summary-input"
            fullWidth
            multiline
            minRows={4}
            value={draftGuide.aiShortSummary}
            sx={{
              ...formInputSx,
            }}
            inputProps={{
              "aria-label": "AI 추천 한 줄 요약",
              readOnly: true,
            }}
          />

          <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: "flex-end" }}>
            <Button type="button" variant="outlined">
              취소
            </Button>

            <Button type="button" variant="contained">
              적용하기
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
