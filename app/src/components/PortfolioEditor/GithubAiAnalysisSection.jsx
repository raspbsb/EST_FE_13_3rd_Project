/**
 * GitHub 저장소 분석 결과, 수정 제한 안내, 분석 근거 섹션
 * @param {{ sectionCardSx: object, aiAnalysisResult: object, isAnalyzing: boolean }} props - sectionCardSx: 분석 결과 섹션 외곽 박스 sx, aiAnalysisResult: AI 분석 결과 상태 객체, isAnalyzing: 저장소 분석 요청 처리 중 여부
 * @returns {JSX.Element} GitHub AI 분석 결과 카드 목록, 수정 제한 안내, 분석 근거 섹션
 */
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Text from "@mui/material/Typography";
import { AwesomeIcon } from "../../lib/icons";
import AnalysisResultCard from "./AnalysisResultCard";
import { formatAiTimestamp, formatCooldownRemaining, getAiCooldownRemainingMs } from "../../utils/aiCooldown";
import { memo, useEffect, useState } from "react";

// 분석이 끝났는데 AI 응답에 분석 근거가 하나도 없을 때 보여줄 안내 문구
const EMPTY_EVIDENCE_TEXT = "AI가 분석 근거를 찾지 못했습니다.";
// 아직 분석을 실행하기 전 기본 상태에서 보여줄 안내 문구
const NOT_ANALYZED_EVIDENCE_TEXT = "저장소 분석을 실행하면 근거가 표시됩니다.";
// 분석 근거 탭 최대 개수. 프롬프트에서도 제한하지만, AI가 안 지킬 수도 있어 화면에서도 한 번 더 강제한다.
const MAX_ANALYSIS_EVIDENCE_COUNT = 10;
// 탭 라벨 최대 길이. 이것도 프롬프트 지시와 별개로 화면에서 한 번 더 강제한다.
const MAX_EVIDENCE_LABEL_LENGTH = 12;

function GithubAiAnalysisSection({ sectionCardSx, aiAnalysisResult, isAnalyzing = false, onCompleteAiAnalysis }) {
  // 분석 근거 내부 탭 선택값. false면 아직 아무 탭도 선택하지 않은 상태다.
  const [selectedEvidenceTab, setSelectedEvidenceTab] = useState(false);
  // 분석 완료 시점이 있으면 결과/근거 영역을 완료 상태로 표시한다 (쿨타임과는 별개로 계속 유지).
  const isAnalysisCompleted = Boolean(aiAnalysisResult.analyzedAt);

  // 쿨타임 남은 시간(ms). 1초마다 tick을 갱신해 화면이 자동으로 다시 계산되게 한다.
  const [, forceTick] = useState(0);
  const cooldownRemainingMs = getAiCooldownRemainingMs(aiAnalysisResult.analyzedAt);
  const isCoolingDown = cooldownRemainingMs > 0;

  useEffect(() => {
    if (!isCoolingDown) return undefined;

    const intervalId = setInterval(() => forceTick(prev => prev + 1), 1000);

    return () => clearInterval(intervalId);
  }, [isCoolingDown, aiAnalysisResult.analyzedAt]);

  // 새로 분석하면 근거 목록 자체가 바뀌므로, 이전 분석에서 선택했던 탭 값을 초기화한다.
  // 초기화 안 하면 이전 값이 새 근거 목록에 없어서 MUI Tabs가 "일치하는 탭이 없다"는 경고를 낸다.
  useEffect(() => {
    setSelectedEvidenceTab(false);
  }, [aiAnalysisResult.analyzedAt]);
  // AI 응답에 실제 근거가 있을 때만 탭을 만든다. 없으면 더미로 채우지 않고 빈 상태 문구를 보여준다.
  const hasAnalysisEvidence =
    Array.isArray(aiAnalysisResult.analysisEvidence) && aiAnalysisResult.analysisEvidence.length > 0;
  // 프롬프트에서 개수/글자수를 제한해두긴 했지만, AI가 안 지킬 수도 있어 화면에서 한 번 더 잘라낸다.
  const analysisEvidenceTabs = hasAnalysisEvidence
    ? aiAnalysisResult.analysisEvidence.slice(0, MAX_ANALYSIS_EVIDENCE_COUNT).map(evidence => ({
        ...evidence,
        label:
          evidence.label && evidence.label.length > MAX_EVIDENCE_LABEL_LENGTH
            ? `${evidence.label.slice(0, MAX_EVIDENCE_LABEL_LENGTH)}...`
            : evidence.label,
      }))
    : [];
  const selectedEvidence = analysisEvidenceTabs.find(evidence => evidence.value === selectedEvidenceTab);

  // 분석 근거 탭을 선택하면 아래 근거 텍스트 박스에 해당 탭 내용을 표시한다.
  const handleEvidenceTabChange = (_, nextEvidenceTab) => {
    setSelectedEvidenceTab(nextEvidenceTab);
  };

  // AI 분석 결과 객체를 화면 카드 렌더링에 쓰기 쉬운 배열로 변환한다.
  const analysisResultItems = [
    { title: "프로젝트 요약", description: aiAnalysisResult.projectSummary },
    { title: "주요 기능", description: aiAnalysisResult.mainFeatures },
    { title: "기술적 특징", description: aiAnalysisResult.technicalFeatures },
    { title: "프로젝트 구조 및 복잡도", description: aiAnalysisResult.projectStructure },
    { title: "담당 역할", description: aiAnalysisResult.analyzedRole },
    { title: "참여 내역", description: aiAnalysisResult.participationDetails },
  ];

  return (
    <Box
      className="portfolio-editor-ai-section"
      component="section"
      sx={{
        ...sectionCardSx,
        border: "1px dashed",
        borderColor: "primary.main",
        borderStyle: "dashed",
      }}
    >
      <Stack
        className="portfolio-editor-section-header"
        direction={{ xs: "column", tablet: "row" }}
        spacing={2}
        sx={{
          mb: 2,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Stack
          className="portfolio-editor-ai-section__heading"
          direction="row"
          spacing={1}
          sx={{ alignItems: "center" }}
        >
          <AwesomeIcon aria-hidden="true" />
          <Text className="portfolio-editor-ai-section__title" component="h2" variant="h5">
            GitHub AI 분석 결과
          </Text>
        </Stack>

        <Stack className="portfolio-editor-section-header__actions" direction={{ xs: "column", tablet: "row" }}>
          {aiAnalysisResult.analyzedAt ? (
            <Text className="portfolio-editor-ai-section__analyzed-at">
              최종 분석: {formatAiTimestamp(aiAnalysisResult.analyzedAt)}
            </Text>
          ) : null}
          <Button
            className="portfolio-editor-ai-action-button"
            type="button"
            variant="contained"
            size="medium"
            disabled={isCoolingDown || isAnalyzing}
            startIcon={
              isAnalyzing ? (
                <CircularProgress size={16} color="inherit" aria-hidden="true" />
              ) : isCoolingDown ? null : (
                <AwesomeIcon aria-hidden="true" />
              )
            }
            onClick={onCompleteAiAnalysis}
          >
            {isAnalyzing
              ? "분석 중..."
              : isCoolingDown
                ? `쿨타임 ${formatCooldownRemaining(cooldownRemainingMs)}`
                : "저장소 분석"}
          </Button>
        </Stack>
      </Stack>

      <Alert className="portfolio-editor-ai-section__notice" severity="info">
        <Text className="portfolio-editor-ai-section__notice-text">
          AI로 생성된 내용 중 일부는 임의로 수정할 수 없습니다.
        </Text>
      </Alert>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", tablet: "repeat(2, minmax(0, 1fr))" },
          gap: 2,
          mb: 3,
        }}
      >
        {analysisResultItems.map(item => (
          <AnalysisResultCard
            key={item.title}
            title={item.title}
            description={item.description}
            isAnalysisCompleted={isAnalysisCompleted}
          />
        ))}
      </Box>

      <Box className="portfolio-editor-analysis-evidence">
        <Text
          className="portfolio-editor-analysis-evidence__title"
          component="h3"
          variant="h6"
          fontWeight={700}
          sx={{ mb: 1 }}
        >
          분석 근거
        </Text>

        {hasAnalysisEvidence ? (
          <Tabs
            className="portfolio-editor-analysis-evidence__tabs"
            value={selectedEvidenceTab}
            onChange={handleEvidenceTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="분석 근거 카테고리"
            sx={{
              minHeight: 40,
              ml: -1,
              "& .MuiTab-root": { minHeight: 40, minWidth: "auto", px: 1.5 },
              "& .MuiTabs-scrollButtons": { width: 24 },
            }}
          >
            {analysisEvidenceTabs.map(evidence => (
              <Tab key={evidence.value} value={evidence.value} label={evidence.label} />
            ))}
          </Tabs>
        ) : null}

        <Paper
          className={
            selectedEvidence
              ? "portfolio-editor-analysis-evidence__content"
              : "portfolio-editor-analysis-evidence__prompt"
          }
          variant="outlined"
          sx={{
            p: 2,
            mt: 1,
            mb: 2,
          }}
        >
          {!hasAnalysisEvidence ? (
            <Text className="portfolio-editor-analysis-evidence__prompt-text" color="text.disabled">
              {isAnalysisCompleted ? EMPTY_EVIDENCE_TEXT : NOT_ANALYZED_EVIDENCE_TEXT}
            </Text>
          ) : selectedEvidence ? (
            <Stack spacing={1}>
              <Text className="portfolio-editor-analysis-evidence__content-title" component="h4">
                {selectedEvidence.label}
              </Text>
              <Text className="portfolio-editor-analysis-evidence__content-text" component="p">
                {selectedEvidence.description}
              </Text>
            </Stack>
          ) : (
            <Text className="portfolio-editor-analysis-evidence__prompt-text">탭을 눌러 분석 근거를 확인하세요.</Text>
          )}
        </Paper>

        {aiAnalysisResult.analysisLimitation ? (
          <Alert className="portfolio-editor-analysis-evidence__limit" severity="warning">
            <Text className="portfolio-editor-analysis-evidence__limit-text">
              {aiAnalysisResult.analysisLimitation}
            </Text>
          </Alert>
        ) : null}
      </Box>
    </Box>
  );
}

export default memo(GithubAiAnalysisSection);
