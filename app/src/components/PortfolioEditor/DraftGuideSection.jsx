/**
 * 프로젝트 설명, AI 추천 초안, 한 줄 요약 확인 섹션
 * @param {{ sectionCardSx: object, formInputSx: object, draftGuide: object, summary: string, isGenerating: boolean, onGenerateDraftGuide: function, onApplyCurrentDescription: function, onApplyDraftDescription: function, onApplyDraftSummary: function }} props
 *   sectionCardSx: 섹션 외곽 박스 sx, formInputSx: OutlinedInput 공통 sx, draftGuide: AI 초안 생성 상태 객체, summary: 현재 한 줄 요약 값,
 *   isGenerating: 초안 생성 요청 처리 중 여부, onGenerateDraftGuide: 초안 생성 버튼 클릭 핸들러,
 *   onApplyCurrentDescription/onApplyDraftDescription: 설명 되돌리기/적용 핸들러, onApplyDraftSummary: 한 줄 요약 적용 핸들러
 * @returns {JSX.Element} 현재 설명 비교 카드, AI 추천 초안 카드, AI 추천 한 줄 요약 입력 영역
 */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Text from "@mui/material/Typography";
import { memo, useEffect, useState } from "react";
import { AwesomeIcon, EditIcon } from "../../lib/icons";
import {
  DRAFT_COOLDOWN_MS,
  formatAiTimestamp,
  formatCooldownRemaining,
  getAiCooldownRemainingMs,
} from "../../utils/aiCooldown";
import DraftSummaryField from "./DraftSummaryField";

function DraftGuideSection({
  sectionCardSx,
  formInputSx,
  draftGuide,
  summary,
  isGenerating = false,
  onGenerateDraftGuide,
  onApplyCurrentDescription,
  onApplyDraftDescription,
  onApplyDraftSummary,
}) {
  // 초안 생성 시점이 있으면 생성 완료 상태로 보고, 되돌리기/적용하기 버튼을 활성화한다 (쿨타임과는 별개로 계속 유지).
  const isDraftGenerated = Boolean(draftGuide.generatedAt);
  // 현재 내용/AI 초안 중 어떤 설명이 프로젝트 설명에 적용됐는지 확인한다.
  const isCurrentDescriptionApplied = draftGuide.appliedDescriptionSource === "current";
  const isAiDescriptionApplied = draftGuide.appliedDescriptionSource === "ai";
  // AI 추천 한 줄 요약이 실제 summary에 적용됐는지 확인한다.
  const isSummaryApplied = draftGuide.isSummaryApplied;

  // 쿨타임 남은 시간(ms). 1초마다 tick을 갱신해 화면이 자동으로 다시 계산되게 한다.
  const [, forceTick] = useState(0);
  // 서버가 응답에 실어 보낸 실제 쿨타임 길이를 우선 쓰고, 아직 한 번도 생성한 적 없어 서버 값이 없을 때만
  // 프론트 기본값(DRAFT_COOLDOWN_MS)으로 표시한다.
  const cooldownRemainingMs = getAiCooldownRemainingMs(
    draftGuide.generatedAt,
    draftGuide.cooldownMs ?? DRAFT_COOLDOWN_MS,
  );
  const isCoolingDown = cooldownRemainingMs > 0;

  useEffect(() => {
    if (!isCoolingDown) return undefined;

    const intervalId = setInterval(() => forceTick(prev => prev + 1), 1000);

    return () => clearInterval(intervalId);
  }, [isCoolingDown, draftGuide.generatedAt]);

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

            <Text id="draft-guide-title" component="h2" variant="h5" sx={{ fontWeight: 700 }}>
              프로젝트 설명 초안 가이드 생성
            </Text>
          </Stack>

          <Stack className="portfolio-editor-section-header__actions" direction={{ xs: "column", tablet: "row" }}>
            {draftGuide.generatedAt ? (
              <Text className="portfolio-editor-ai-section__analyzed-at">
                최종 생성: {formatAiTimestamp(draftGuide.generatedAt)}
              </Text>
            ) : null}
            <Button
              className="portfolio-editor-ai-action-button"
              type="button"
              variant="contained"
              disabled={isCoolingDown || isGenerating}
              startIcon={
                isGenerating ? (
                  <CircularProgress size={16} color="inherit" aria-hidden="true" />
                ) : isCoolingDown ? null : (
                  <AwesomeIcon aria-hidden="true" />
                )
              }
              onClick={onGenerateDraftGuide}
            >
              {isGenerating
                ? "생성 중..."
                : isCoolingDown
                  ? `재생성까지 ${formatCooldownRemaining(cooldownRemainingMs)}`
                  : "초안 생성"}
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
            sx={{ fontWeight: 700, mb: 1 }}
          >
            AI 추천 한 줄 요약 (미리보기)
          </Text>

          <DraftSummaryField
            formInputSx={formInputSx}
            summary={summary}
            isSummaryApplied={isSummaryApplied}
            onApplyDraftSummary={onApplyDraftSummary}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default memo(DraftGuideSection);
