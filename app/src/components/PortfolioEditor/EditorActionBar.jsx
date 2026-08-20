/**
 * 등록/수정 폼 하단 고정 공개 설정, 저장 액션 버튼 영역
 * @param {{ isEdit: boolean, isPortfolioPublic: boolean, onVisibilityChange: function }} props - isEdit: 수정 페이지 여부, isPortfolioPublic: 포트폴리오 공개 여부, onVisibilityChange: 공개/비공개 스위치 변경 이벤트 핸들러
 * @returns {JSX.Element} 화면 하단 고정 공개 설정 토글과 임시저장/작성 완료 버튼 바
 */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Text from "@mui/material/Typography";
import { LockIcon, PublicIcon } from "../../lib/icons";
import { memo } from "react";

function EditorActionBar({ isEdit, isPortfolioPublic, onVisibilityChange, onSaveDraft, handleFormChange }) {
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
          px: { xs: 1, tablet: 3 },
          py: 2,
          justifyContent: "space-between",
          alignItems: "center",
          gap: { xs: 1, tablet: 2 },
        }}
      >
        {/* 공개/비공개 토글 그룹 */}
        <Stack className="portfolio-editor-visibility-control" direction="row" sx={{ flexShrink: 0 }}>
          <Switch
            id="is_public"
            name="is_public"
            checked={isPortfolioPublic}
            onChange={onVisibilityChange}
            slotProps={{
              input: {
                "aria-label": isPortfolioPublic ? "포트폴리오 공개 설정 끄기" : "포트폴리오 공개 설정 켜기",
              },
            }}
          />

          <Box className="portfolio-editor-visibility-control__content">
            {isPortfolioPublic ? (
              <PublicIcon className="portfolio-editor-visibility-control__public-icon" aria-hidden="true" />
            ) : (
              <LockIcon aria-hidden="true" />
            )}
            {/* 공개/비공개 텍스트 */}
            <Box className="portfolio-editor-visibility-control__text">
              <Text className="portfolio-editor-visibility-control__title">
                {isPortfolioPublic ? "공개 설정" : "비공개 설정"}
              </Text>
              <Text className="portfolio-editor-visibility-control__description">
                {isPortfolioPublic ? "모든 사용자가 " : "초대된 사람만 "}내 포트폴리오를 볼 수 있습니다.
              </Text>
            </Box>
          </Box>
        </Stack>

        {/* 임시저장/수정완료 버튼 */}
        <Stack direction="row" sx={{ gap: { xs: 0.75, tablet: 1.5 }, alignItems: "center", minWidth: 0, flex: "1 1 auto", justifyContent: "flex-end" }}>
          <Button
            type="button"
            variant="outlined"
            aria-label="현재 작성 내용을 임시저장"
            onClick={onSaveDraft}
            sx={{
              minWidth: 0,
              flexShrink: 1,
              px: { xs: 1, tablet: 2 },
              py: { xs: 0.5, tablet: 1 },
              fontSize: { xs: 12, tablet: 14 },
              "@media (max-width: 300px)": {
                px: 0.5,
              },
            }}
          >
            <Box component="span" sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              임시저장
            </Box>
          </Button>
          <Button
            type="submit"
            variant="contained"
            aria-label={isEdit ? "포트폴리오 수정 완료" : "포트폴리오 작성 완료"}
            sx={{
              minWidth: 0,
              flexShrink: 1,
              px: { xs: 1, tablet: 2 },
              py: { xs: 0.5, tablet: 1 },
              fontSize: { xs: 12, tablet: 14 },
              "@media (max-width: 300px)": {
                px: 0.5,
              },
            }}
          >
            <Box component="span" sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {isEdit ? "수정 완료" : "작성 완료"}
            </Box>
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default memo(EditorActionBar);
