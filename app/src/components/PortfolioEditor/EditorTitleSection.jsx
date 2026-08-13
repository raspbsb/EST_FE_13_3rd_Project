/**
 * 포트폴리오 등록/수정 페이지 상단 제목, 임시저장 안내 영역
 * @param {{ isEdit: boolean, temporaryDrafts: Array<{ id: unknown }> }} props - isEdit: 수정 페이지 여부, temporaryDrafts: 임시저장 항목 목록
 * @returns {JSX.Element} 등록/수정 제목, 안내 문구, 임시저장 불러오기 박스
 */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Text from "@mui/material/Typography";
import { memo } from "react";

function EditorTitleSection({ isEdit, temporaryDrafts }) {
  return (
    <Stack className="portfolio-editor-title" spacing={2} sx={{ mt: { xs: 4, tablet: 6 }, mb: 4 }}>
      {/* 타이틀 & 페이지 설명 */}
      <Box>
        <Text component="h1" variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          포트폴리오 {isEdit ? "수정" : "등록"}
        </Text>
        <Text className="portfolio-editor-title__description" color="text.secondary">
          프로젝트 정보를
          {isEdit
            ? " 최신으로 유지하고 AI 분석을 통해 디테일을 강화하세요."
            : " 입력하고 AI 분석을 통해 포트폴리오를 완성하세요."}
        </Text>
      </Box>

      {/* 임시저장 */}
      {temporaryDrafts[0].id ? (
        <Stack className="portfolio-editor-temporary-draft" direction={{ xs: "column", tablet: "row" }}>
          <Stack className="portfolio-editor-temporary-draft__text" spacing={2}>
            <Text className="portfolio-editor-temporary-draft__line">이전에 임시저장한 내용이 있습니다.</Text>
            <Text className="portfolio-editor-temporary-draft__line">최신 저장 : 2026.08.02 18:30</Text>
          </Stack>

          <Stack className="portfolio-editor-temporary-draft__actions" spacing={1}>
            <Button
              className="portfolio-editor-temporary-draft__button portfolio-editor-temporary-draft__button--primary"
              type="submit"
              variant="contained"
              size="small"
            >
              최신 저장 내용 적용
            </Button>

            <Button
              className="portfolio-editor-temporary-draft__button portfolio-editor-temporary-draft__button--secondary"
              type="button"
              variant="outlined"
              size="small"
            >
              전체 저장 목록 확인
            </Button>
          </Stack>
        </Stack>
      ) : null}
    </Stack>
  );
}

export default memo(EditorTitleSection);
