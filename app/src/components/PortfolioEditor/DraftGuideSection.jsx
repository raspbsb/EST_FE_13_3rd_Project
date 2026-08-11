/**
 * 프로젝트 설명, AI 추천 초안, 한 줄 요약 확인 섹션
 * @param {{ sectionCardSx: object, formInputSx: object }} props - sectionCardSx: 섹션 외곽 박스 sx, formInputSx: OutlinedInput 공통 sx
 * @returns {JSX.Element} 현재 설명 비교 카드, AI 추천 초안 카드, AI 추천 한 줄 요약 입력 영역
 */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Text from "@mui/material/Typography";
import { EditIcon } from "../../lib/icons";

export default function DraftGuideSection({ sectionCardSx, formInputSx }) {
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
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", tablet: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
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
              창작자와 개발자가 자신의 프로젝트를 등록하고, 방문자와 채용 담당자가 분야와 기술 스택을 기준으로 작품을
              탐색할 수 있는 AI 기반 포트폴리오 갤러리 플랫폼입니다. GitHub 저장소 분석을 통해 프로젝트의 주요 기능과
              기술적 특징, 참여 내역을 정리하여 제작자의 설명을 보완합니다.
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
              Portfolio+는 창작자와 개발자가 자신의 프로젝트를 전시하고, 방문자와 채용 담당자가 분야와 기술 스택을
              기준으로 작품을 탐색할 수 있는 AI 기반 포트폴리오 갤러리 플랫폼입니다. GitHub 저장소에서 확인 가능한
              프로젝트 구조와 참여 내역을 분석해 주요 기능과 기술적 특징을 정리하고, 제작자의 주관적인 소개를 보완하는
              정보를 제공합니다.
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
            defaultValue="GitHub 분석을 통해 프로젝트 정보를 보완하고 작품 탐색부터 채용·협업 문의까지 연결하는 포트폴리오 갤러리"
            sx={{
              ...formInputSx,
            }}
            inputProps={{
              "aria-label": "AI 추천 한 줄 요약",
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
