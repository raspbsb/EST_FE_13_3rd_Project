/**
 * 포트폴리오 등록/수정 페이지 상단 제목, 임시저장 안내 영역
 * @param {{ isEdit: boolean, temporaryDrafts: Array<{ id: unknown, title?: string, savedAt?: string }>, onApplyDraft: function }} props
 * @returns {JSX.Element} 등록/수정 제목, 안내 문구, 임시저장 불러오기 박스
 */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Text from "@mui/material/Typography";
import { memo, useState } from "react";

const formatDraftSavedAt = savedAt => {
  if (!savedAt) return "";

  const date = new Date(savedAt);

  if (Number.isNaN(date.getTime())) return "";

  const pad = value => String(value).padStart(2, "0");

  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`;
};

function EditorTitleSection({ isEdit, temporaryDrafts, onApplyDraft, onDeleteDraft }) {
  const [isDraftListOpen, setIsDraftListOpen] = useState(false);
  const latestDraft = temporaryDrafts[0];
  const latestSavedAt = formatDraftSavedAt(latestDraft?.savedAt);

  const handleOpenDraftList = () => {
    setIsDraftListOpen(true);
  };

  const handleCloseDraftList = () => {
    setIsDraftListOpen(false);
  };

  const handleApplySelectedDraft = draftId => {
    const didApply = onApplyDraft(draftId);

    if (didApply) {
      handleCloseDraftList();
    }
  };

  const handleDeleteSelectedDraft = draftId => {
    if (!confirm("이 임시저장 데이터를 삭제할까요?")) return;

    onDeleteDraft(draftId);
  };

  return (
    <Stack className="portfolio-editor-title" spacing={2} sx={{ mt: { xs: 4, tablet: 6 }, mb: 4 }}>
      <Box>
        <Text component="h1" variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          포트폴리오 {isEdit ? "수정" : "등록"}
        </Text>
        <Text className="portfolio-editor-title__description" color="text.secondary">
          프로젝트 정보를{" "}
          {isEdit
            ? "최신으로 유지하고 AI 분석을 통해 디테일을 강화하세요."
            : "입력하고 AI 분석을 통해 포트폴리오를 완성하세요."}
        </Text>
      </Box>

      {latestDraft?.id ? (
        <>
          <Stack className="portfolio-editor-temporary-draft" direction={{ xs: "column", tablet: "row" }}>
            <Stack className="portfolio-editor-temporary-draft__text" spacing={2}>
              <Text className="portfolio-editor-temporary-draft__line">이전에 임시저장한 내용이 있습니다.</Text>
              <Text className="portfolio-editor-temporary-draft__line">최신 저장 : {latestSavedAt}</Text>
            </Stack>

            <Stack className="portfolio-editor-temporary-draft__actions" spacing={1}>
              <Button
                className="portfolio-editor-temporary-draft__button portfolio-editor-temporary-draft__button--primary"
                type="button"
                variant="contained"
                size="small"
                onClick={() => onApplyDraft(latestDraft.id)}
              >
                최신 저장 내용 적용
              </Button>

              <Button
                className="portfolio-editor-temporary-draft__button portfolio-editor-temporary-draft__button--secondary"
                type="button"
                variant="outlined"
                size="small"
                onClick={handleOpenDraftList}
              >
                전체 저장 목록 확인
              </Button>
            </Stack>
          </Stack>

          <Dialog open={isDraftListOpen} onClose={handleCloseDraftList} fullWidth maxWidth="xs">
            <DialogTitle>전체 저장 목록 확인</DialogTitle>
            <DialogContent>
              <Stack className="portfolio-editor-temporary-draft-dialog__list" spacing={1}>
                {temporaryDrafts.map(draft => (
                  <Stack
                    className="portfolio-editor-temporary-draft-dialog__item"
                    key={draft.id}
                    direction="row"
                    spacing={1}
                  >
                    <Button
                      className="portfolio-editor-temporary-draft-dialog__apply-button"
                      type="button"
                      variant="outlined"
                      onClick={() => handleApplySelectedDraft(draft.id)}
                    >
                      <Box className="portfolio-editor-temporary-draft-dialog__item-text">
                        <Text className="portfolio-editor-temporary-draft-dialog__item-title">
                          {draft.title || "제목 없는 임시저장"}
                        </Text>
                        <Text className="portfolio-editor-temporary-draft-dialog__item-date">
                          {formatDraftSavedAt(draft.savedAt)}
                        </Text>
                      </Box>
                    </Button>

                    <Button
                      className="portfolio-editor-temporary-draft-dialog__delete-button"
                      type="button"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteSelectedDraft(draft.id)}
                    >
                      삭제
                    </Button>
                  </Stack>
                ))}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button type="button" onClick={handleCloseDraftList}>
                닫기
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : null}
    </Stack>
  );
}

export default memo(EditorTitleSection);
