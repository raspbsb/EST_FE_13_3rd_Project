/**
 * GitHub 저장소 분석 결과, 수정 제한 안내, 분석 근거 아코디언 섹션
 * @param {{ sectionCardSx: object, aiAnalysisResult: object }} props - sectionCardSx: 분석 결과 섹션 외곽 박스 sx, aiAnalysisResult: AI 분석 결과 상태 객체
 * @returns {JSX.Element} GitHub AI 분석 결과 카드 목록, 수정 제한 안내, 분석 근거 아코디언
 */
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Text from "@mui/material/Typography";
import { AwesomeIcon, DropDownIcon } from "../../lib/icons";
import AnalysisResultCard from "./AnalysisResultCard";
import { developmentAnalysisEvidenceTabs } from "./portfolioEditorData";
import { memo, useState } from "react";

function GithubAiAnalysisSection({ sectionCardSx, aiAnalysisResult }) {
  const [isEvidenceExpanded, setIsEvidenceExpanded] = useState(false);
  const [selectedEvidenceTab, setSelectedEvidenceTab] = useState(false);
  const analysisEvidenceTabs =
    Array.isArray(aiAnalysisResult.analysisEvidence) && aiAnalysisResult.analysisEvidence.length > 0
      ? aiAnalysisResult.analysisEvidence
      : developmentAnalysisEvidenceTabs;
  const selectedEvidence = analysisEvidenceTabs.find(evidence => evidence.value === selectedEvidenceTab);

  const handleEvidenceAccordionChange = (_, isExpanded) => {
    setIsEvidenceExpanded(isExpanded);

    if (!isExpanded) {
      setSelectedEvidenceTab(false);
    }
  };

  const handleEvidenceTabChange = (_, nextEvidenceTab) => {
    setSelectedEvidenceTab(nextEvidenceTab);
  };

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
        direction={{ xs: "column", tablet: "row" }}
        spacing={2}
        sx={{
          mb: 2,
          width: "100%",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", tablet: "center" },
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

        <Stack spacing={0.5} sx={{ alignItems: { xs: "flex-start", tablet: "flex-end" } }}>
          {aiAnalysisResult.analyzedAt ? (
            <Text className="portfolio-editor-ai-section__analyzed-at">최종 분석: {aiAnalysisResult.analyzedAt}</Text>
          ) : null}
          <Button variant="contained" disabled size="medium">
            분석 완료
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
          <AnalysisResultCard key={item.title} title={item.title} description={item.description} />
        ))}
      </Box>

      <Accordion
        className="portfolio-editor-analysis-evidence"
        expanded={isEvidenceExpanded}
        onChange={handleEvidenceAccordionChange}
        elevation={0}
        sx={{
          overflow: "hidden",
          "&::before": {
            display: "none",
          },
        }}
      >
        <AccordionSummary
          expandIcon={<DropDownIcon aria-hidden="true" />}
          sx={{
            px: 2,
            py: 1,
            minHeight: 52,
            "& .MuiAccordionSummary-content": {
              m: 0,
              alignItems: "center",
              justifyContent: "space-between",
            },
          }}
        >
          <Text className="portfolio-editor-analysis-evidence__title" component="h3" variant="h6" fontWeight={700}>
            분석 근거
          </Text>
        </AccordionSummary>

        <AccordionDetails sx={{ px: 2, pt: 0, pb: 2 }}>
          <Tabs
            className="portfolio-editor-analysis-evidence__tabs"
            value={selectedEvidenceTab}
            onChange={handleEvidenceTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="분석 근거 카테고리"
          >
            {analysisEvidenceTabs.map(evidence => (
              <Tab key={evidence.value} value={evidence.value} label={evidence.label} />
            ))}
          </Tabs>

          <Paper
            className={
              selectedEvidence
                ? "portfolio-editor-analysis-evidence__content"
                : "portfolio-editor-analysis-evidence__prompt"
            }
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
            }}
          >
            {selectedEvidence ? (
              <Stack spacing={1}>
                <Text className="portfolio-editor-analysis-evidence__content-title" component="h4">
                  {selectedEvidence.label}
                </Text>
                <Text className="portfolio-editor-analysis-evidence__content-text" component="p">
                  {selectedEvidence.description}
                </Text>
              </Stack>
            ) : (
              <Text className="portfolio-editor-analysis-evidence__prompt-text">
                영역을 펼쳐 분석 근거를 확인하세요.
              </Text>
            )}
          </Paper>

          {aiAnalysisResult.analysisLimitation ? (
            <Alert className="portfolio-editor-analysis-evidence__limit" severity="warning">
              <Text className="portfolio-editor-analysis-evidence__limit-text">
                {aiAnalysisResult.analysisLimitation}
              </Text>
            </Alert>
          ) : null}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default memo(GithubAiAnalysisSection);
