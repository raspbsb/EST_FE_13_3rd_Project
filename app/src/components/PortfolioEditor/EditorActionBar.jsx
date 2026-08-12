/**
 * 등록/수정 폼 하단 고정 공개 설정, 저장 액션 버튼 영역
 * @param {{ isEdit: boolean, isPortfolioPublic: boolean, onVisibilityChange: function }} props - isEdit: 수정 페이지 여부, isPortfolioPublic: 포트폴리오 공개 여부, onVisibilityChange: 공개/비공개 스위치 변경 이벤트 핸들러
 * @returns {JSX.Element} 화면 하단 고정 공개 설정 토글과 임시저장/미리보기/작성 완료 버튼 바
 */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Text from "@mui/material/Typography";
import { LockIcon, PublicIcon, ViewsIcon } from "../../lib/icons";
import { memo } from "react";

function EditorActionBar({ isEdit, isPortfolioPublic, onVisibilityChange, onPreviewOpen, handleFormChange }) {
  return (
    <Box
      className="portfolio-editor-action-bar"
      sx={{
        position: "sticky",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: theme => theme.zIndex.appBar,
        bgcolor: "background.paper",
      }}
    >
      <Stack
        direction="row"
        sx={{
          maxWidth: 1272,
          mx: "auto",
          px: { xs: 2, tablet: 3 },
          py: 2,
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* 공개/비공개 토글 그룹 */}
        <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
          <Switch id="is_public" name="is_public" checked={isPortfolioPublic} onChange={onVisibilityChange} />
          {/* 공개/비공개 텍스트 */}
          <Box>
            <Text>{isPortfolioPublic ? "공개 설정" : "비공개 설정"}</Text>
            <Text>{isPortfolioPublic ? "모든 사용자가 " : "초대된 사람만 "}내 포트폴리오를 볼 수 있습니다.</Text>
          </Box>
          {isPortfolioPublic ? <PublicIcon /> : <LockIcon />}
        </Stack>

        {/* 임시저장/미리보기/수정완료 버튼 */}
        <Stack direction="row" sx={{ gap: 1.5, alignItems: "center" }}>
          <Button type="button" variant="outlined">
            임시저장
          </Button>
          <Button type="button" variant="outlined" onClick={onPreviewOpen}>
            <ViewsIcon />
            미리보기
          </Button>
          <Button type="submit" variant="contained">
            {isEdit ? "수정 완료" : "작성 완료"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default memo(EditorActionBar);
