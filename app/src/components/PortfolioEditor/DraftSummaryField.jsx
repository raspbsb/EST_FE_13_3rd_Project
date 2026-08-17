import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import { memo, useCallback, useEffect, useState } from "react";

function DraftSummaryField({ formInputSx, summary, isDraftGenerated, isSummaryApplied, onApplyDraftSummary }) {
  // 적용 전까지 사용자가 자유롭게 수정하는 한 줄 요약 임시 입력값
  const [localSummary, setLocalSummary] = useState(summary);
  // 현재 입력값이 마지막으로 적용된 summary와 다른지 확인해 적용 버튼 상태를 결정한다.
  const isSummaryChanged = localSummary !== summary;
  // 초안 생성 전이거나 이미 적용된 값이면 적용 버튼을 비활성화한다.
  const isApplyDisabled = !isDraftGenerated || (isSummaryApplied && !isSummaryChanged);

  useEffect(() => {
    setLocalSummary(summary);
  }, [summary]);

  // 입력 중에는 로컬 요약만 갱신하고, 실제 formData.summary는 적용 버튼에서 반영한다.
  const handleChange = useCallback(e => {
    setLocalSummary(e.target.value);
  }, []);

  // 현재 로컬 요약을 부모 상태에 적용한다.
  const handleApply = useCallback(() => {
    onApplyDraftSummary(localSummary);
  }, [localSummary, onApplyDraftSummary]);

  return (
    <Box className="portfolio-editor-draft-guide__summary-field">
      <OutlinedInput
        id="summary"
        name="summary"
        className="portfolio-editor-draft-guide__summary-input"
        fullWidth
        multiline
        minRows={4}
        value={localSummary}
        onChange={handleChange}
        sx={{
          ...formInputSx,
        }}
        slotProps={{
          input: {
            "aria-label": "AI 추천 한 줄 요약",
          },
        }}
      />

      <Button
        className="portfolio-editor-ai-action-button portfolio-editor-draft-guide__summary-button"
        type="button"
        variant="contained"
        disabled={isApplyDisabled}
        onClick={handleApply}
      >
        {isSummaryApplied && !isSummaryChanged ? "적용됨" : "적용하기"}
      </Button>
    </Box>
  );
}

export default memo(DraftSummaryField);
