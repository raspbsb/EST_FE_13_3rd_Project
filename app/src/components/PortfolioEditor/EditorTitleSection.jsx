/**
 * 포트폴리오 등록/수정 페이지 상단 제목, 임시저장 안내 영역
 * @param {{ isEdit: boolean, temp: Array<{ id: unknown }> }} props - 수정 모드 여부, 임시저장 데이터 배열
 * @returns {JSX.Element} 페이지 제목, 설명, 임시저장 안내 박스 포함 상단 UI
 */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Text from "@mui/material/Typography";

export default function EditorTitleSection({ isEdit, temp }) {
  return (
    <Stack spacing={2} sx={{ mt: { xs: 4, tablet: 6 }, mb: 4 }}>
      {/* 타이틀 & 페이지 설명 */}
      <Box>
        <Text component="h1" variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          포트폴리오 {isEdit ? "수정" : "등록"}
        </Text>
        <Text color="text.secondary">
          프로젝트 정보를
          {isEdit
            ? " 최신으로 유지하고 AI 분석을 통해 디테일을 강화하세요."
            : " 입력하고 AI 분석을 통해 포트폴리오를 완성하세요."}
        </Text>
      </Box>

      {/* 임시저장 */}
      {temp[0].id ? (
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: 464,
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: 2,
            p: 2,
          }}
        >
          {/* 텍스트 그룹 */}
          <Stack spacing={1}>
            <Text>이전에 임시저장한 내용이 있습니다.</Text>
            <Text>최신 저장 : 2026.08.02 18:30</Text>
          </Stack>
          {/* 버튼 그룹 */}
          <Stack spacing={1}>
            <Button type="submit" variant="contained" size="small">
              최신 저장 내용 적용
            </Button>
            <Button type="button" variant="outlined" size="small">
              전체 저장 목록 확인
            </Button>
          </Stack>
        </Stack>
      ) : null}
    </Stack>
  );
}
