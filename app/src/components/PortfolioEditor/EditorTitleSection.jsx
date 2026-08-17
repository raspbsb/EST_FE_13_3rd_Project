/**
 * 포트폴리오 등록/수정 페이지 상단 제목, 임시저장 안내 영역
 * @param {{ isEdit: boolean, temporaryDrafts: Array<{ id: unknown, title?: string, savedAt?: string }>, onApplyDraft: function }} props
 * @returns {JSX.Element} 등록/수정 제목, 안내 문구, 임시저장 불러오기 박스
 */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
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
  // 전체 임시저장 목록 모달의 열림 상태
  const [isDraftListOpen, setIsDraftListOpen] = useState(false);
  // 임시저장 목록은 최신순으로 저장되므로 첫 번째 항목을 최신 저장본으로 사용
  const latestDraft = temporaryDrafts[0];
  const latestSavedAt = formatDraftSavedAt(latestDraft?.savedAt);

  // 전체 저장 목록 확인 버튼을 누르면 임시저장 목록 모달을 연다.
  const handleOpenDraftList = () => {
    setIsDraftListOpen(true);
  };

  // 모달 닫기 버튼 또는 바깥 클릭으로 임시저장 목록 모달을 닫는다.
  const handleCloseDraftList = () => {
    setIsDraftListOpen(false);
  };

  // 저장본 적용이 성공하면 모달을 닫고, 취소되면 그대로 둔다.
  const handleApplySelectedDraft = draftId => {
    const didApply = onApplyDraft(draftId);

    if (didApply) {
      handleCloseDraftList();
    }
  };

  // 삭제 전 확인창을 띄운 뒤 선택한 임시저장본만 삭제한다.
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

          <Dialog
            open={isDraftListOpen}
            onClose={handleCloseDraftList}
            aria-labelledby="temporary-draft-list-title"
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle id="temporary-draft-list-title">전체 저장 목록 확인</DialogTitle>
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
                      aria-label={`${draft.title || "제목 없는 임시저장"} 저장본 불러오기`}
                      onClick={() => handleApplySelectedDraft(draft.id)}
                      sx={{ flex: 1, justifyContent: "flex-start" }}
                    >
                      <Stack
                        className="portfolio-editor-temporary-draft-dialog__item-text"
                        direction="row"
                        spacing={1}
                        sx={{ width: "100%", alignItems: "center", justifyContent: "space-between" }}
                      >
                        <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                          <Text className="portfolio-editor-temporary-draft-dialog__item-title">
                            {draft.title || "제목 없는 임시저장"}
                          </Text>
                          <Text className="portfolio-editor-temporary-draft-dialog__item-date">
                            {formatDraftSavedAt(draft.savedAt)}
                          </Text>
                        </Stack>

                        <Stack
                          className="portfolio-editor-temporary-draft-dialog__item-status"
                          spacing={0.5}
                          sx={{ alignItems: "flex-end", flexShrink: 0 }}
                        >
                          <Chip
                            size="small"
                            variant={draft.aiAnalysisResult?.analyzedAt ? "filled" : "outlined"}
                            color={draft.aiAnalysisResult?.analyzedAt ? "primary" : "default"}
                            label={draft.aiAnalysisResult?.analyzedAt ? "분석완료" : "분석 전"}
                          />
                          <Chip
                            size="small"
                            variant={draft.draftGuide?.generatedAt ? "filled" : "outlined"}
                            color={draft.draftGuide?.generatedAt ? "primary" : "default"}
                            label={draft.draftGuide?.generatedAt ? "초안완료" : "초안 전"}
                          />
                        </Stack>
                      </Stack>
                    </Button>

                    <Button
                      className="portfolio-editor-temporary-draft-dialog__delete-button"
                      type="button"
                      variant="outlined"
                      color="error"
                      aria-label={`${draft.title || "제목 없는 임시저장"} 저장본 삭제`}
                      onClick={() => handleDeleteSelectedDraft(draft.id)}
                    >
                      삭제
                    </Button>
                  </Stack>
                ))}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button type="button" aria-label="전체 저장 목록 닫기" onClick={handleCloseDraftList}>
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
