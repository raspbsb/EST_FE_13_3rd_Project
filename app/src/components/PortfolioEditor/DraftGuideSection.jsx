/**
 * 프로젝트 설명, AI 추천 초안, 한 줄 요약 확인 섹션
 * @param {{ sectionCardSx: object, formInputSx: object, draftGuide: object }} props - sectionCardSx: 섹션 외곽 박스 sx, formInputSx: OutlinedInput 공통 sx, draftGuide: AI 초안 생성 상태 객체
 * @returns {JSX.Element} 현재 설명 비교 카드, AI 추천 초안 카드, AI 추천 한 줄 요약 입력 영역
 */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Text from "@mui/material/Typography";
import { memo } from "react";
import { AwesomeIcon, EditIcon } from "../../lib/icons";
import DraftSummaryField from "./DraftSummaryField";

function DraftGuideSection({
  sectionCardSx,
  formInputSx,
  draftGuide,
  summary,
  onGenerateDraftGuide,
  onApplyCurrentDescription,
  onApplyDraftDescription,
  onApplyDraftSummary,
}) {
  const isDraftGenerated = Boolean(draftGuide.generatedAt);
  const isCurrentDescriptionApplied = draftGuide.appliedDescriptionSource === "current";
  const isAiDescriptionApplied = draftGuide.appliedDescriptionSource === "ai";
  const isSummaryApplied = draftGuide.isSummaryApplied;

  return (
    <Box>
      <Box
        className="portfolio-editor-draft-guide"
        component="section"
        aria-labelledby="draft-guide-title"
        sx={sectionCardSx}
      >
        <Stack
          className="portfolio-editor-section-header"
          direction={{ xs: "column", tablet: "row" }}
          spacing={2}
          sx={{
            mb: 3,
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <EditIcon aria-hidden="true" />

            <Text id="draft-guide-title" component="h2" variant="h5" fontWeight={700}>
              프로젝트 설명 초안 가이드 생성
            </Text>
          </Stack>

          <Stack className="portfolio-editor-section-header__actions" direction={{ xs: "column", tablet: "row" }}>
            {draftGuide.generatedAt ? (
              <Text className="portfolio-editor-ai-section__analyzed-at">최종 생성: {draftGuide.generatedAt}</Text>
            ) : null}
            <Button
              className="portfolio-editor-ai-action-button"
              type="button"
              variant="contained"
              disabled={isDraftGenerated}
              startIcon={isDraftGenerated ? null : <AwesomeIcon aria-hidden="true" />}
              onClick={onGenerateDraftGuide}
            >
              {isDraftGenerated ? "생성 완료" : "초안 생성"}
            </Button>
          </Stack>
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

            <Button
              className="portfolio-editor-ai-action-button portfolio-editor-draft-guide__card-button"
              type="button"
              variant="contained"
              disabled={!isDraftGenerated || isCurrentDescriptionApplied}
              onClick={onApplyCurrentDescription}
            >
              {isCurrentDescriptionApplied ? "되돌림" : "되돌리기"}
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

            <Button
              className="portfolio-editor-ai-action-button portfolio-editor-draft-guide__card-button"
              type="button"
              variant="contained"
              disabled={!isDraftGenerated || isAiDescriptionApplied}
              onClick={onApplyDraftDescription}
            >
              {isAiDescriptionApplied ? "적용됨" : "적용하기"}
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

          <DraftSummaryField
            formInputSx={formInputSx}
            summary={summary}
            isDraftGenerated={isDraftGenerated}
            isSummaryApplied={isSummaryApplied}
            onApplyDraftSummary={onApplyDraftSummary}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default memo(DraftGuideSection);
