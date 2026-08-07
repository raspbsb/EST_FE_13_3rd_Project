/**
 * GitHub 저장소 분석 결과, 수정 제한 안내, 분석 근거 아코디언 섹션
 * @param {{ cardSx: object }} props - 섹션 외곽 카드 공통 MUI sx 스타일 객체
 * @returns {JSX.Element} AI 분석 결과 카드 목록, 분석 근거 아코디언 포함 섹션 UI
 */
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Text from "@mui/material/Typography";
import { AwesomeIcon, DropDownIcon } from "../../lib/icons";
import AnalysisResultCard from "./AnalysisResultCard";

const analysisResultItems = [
  {
    title: "프로젝트 요약",
    description:
      "프로젝트 등록과 작품 탐색, 제작자 프로필 확인, 채용·협업 문의 과정을 하나의 흐름으로 연결한 포트폴리오 갤러리 플랫폼입니다.",
  },
  {
    title: "주요 기능",
    description:
      "포트폴리오 등록·수정·삭제, 이미지 업로드, 카테고리·기술 스택 기반 탐색, 좋아요·북마크, 제작자 프로필, GitHub 저장소 분석 기능을 제공합니다.",
  },
  {
    title: "기술적 특징",
    description:
      "Next.js 기반으로 페이지와 공통 UI를 컴포넌트화하고, Supabase를 이용해 사용자 인증과 프로젝트 데이터 및 이미지 파일을 관리합니다.",
  },
  {
    title: "프로젝트 구조 및 복잡도",
    description:
      "인증, 콘텐츠 CRUD, 이미지 저장소, 검색·필터링, 외부 API 통신을 함께 처리하는 다중 기능 웹 애플리케이션 구조입니다.",
  },
  {
    title: "담당 역할",
    description:
      "서비스의 핵심 사용자 흐름과 페이지별 요구사항을 정의하고, 등록·수정 페이지를 포함한 스토리보드와 공통 UI 구조를 설계했습니다.",
  },
  {
    title: "참여 내역",
    description:
      "기획 문서와 화면 설계 자료를 기준으로 정보 구조, AI 분석 결과 표시 정책, 입력 항목 및 예외 상태를 구체화했습니다.",
  },
];

export default function GithubAiAnalysisSection({ cardSx }) {
  return (
    <Box
      component="section"
      sx={{
        ...cardSx,
        borderColor: "primary.main",
        borderStyle: "dashed",
        background: "linear-gradient(117deg, #f0f7ff 0%, #ffffff 100%)",
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
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <AwesomeIcon color="primary" sx={{ fontSize: 24 }} aria-hidden="true" />
          <Text component="h2" variant="h5" color="primary" fontWeight={700}>
            GitHub AI 분석 결과
          </Text>
        </Stack>

        <Stack spacing={0.5} sx={{ alignItems: { xs: "flex-start", tablet: "flex-end" } }}>
          <Text color="text.secondary" fontSize={12}>
            최종 분석: 2026-07-26 14:30
          </Text>
          <Button variant="contained" disabled size="medium">
            분석 완료
          </Button>
        </Stack>
      </Stack>

      <Alert
        severity="info"
        sx={{
          mb: 2,
          bgcolor: "transparent",
          px: 0,
          color: "text.primary",
          "& .MuiAlert-message": { p: 0 },
        }}
      >
        <Text>※ AI로 생성된 내용 중 일부는 임의로 수정할 수 없습니다.</Text>
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
        defaultExpanded
        elevation={0}
        sx={{
          bgcolor: "#f2f3ff",
          borderRadius: "8px !important",
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
          <Text component="h3" variant="h6" fontWeight={700}>
            분석 근거
          </Text>
        </AccordionSummary>

        <AccordionDetails sx={{ px: 2, pt: 0, pb: 2 }}>
          <Stack direction="row" spacing={1} useFlexGap sx={{ mb: 2, flexWrap: "wrap" }}>
            <Button type="button" variant="outlined" sx={{ px: 3, py: 1, bgcolor: "background.paper" }}>
              프로젝트 구조
            </Button>

            <Button type="button" variant="contained" sx={{ px: 3, py: 1 }}>
              커밋 기록
            </Button>
          </Stack>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              bgcolor: "rgba(255, 255, 255, 0.6)",
              borderColor: "rgba(0, 87, 205, 0.2)",
              borderRadius: 1,
            }}
          >
            <Text color="primary" fontWeight={500}>
              영역을 펼쳐 분석 근거를 확인하세요.
            </Text>
          </Paper>

          <Alert severity="warning" sx={{ bgcolor: "#fff4e0", color: "#8a4b00" }}>
            <Text fontSize={12} fontWeight={500} lineHeight={1.5}>
              분석 한계 : 커밋 작성자 정보가 실제 작업자와 다르거나 하나의 계정을 공동으로 사용했다면, 개인별 참여
              내역을 정확하게 구분하기 어렵습니다.
            </Text>
          </Alert>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
