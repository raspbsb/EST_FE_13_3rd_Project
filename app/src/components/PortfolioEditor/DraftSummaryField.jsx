import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import { memo, useCallback, useEffect, useState } from "react";

function DraftSummaryField({ formInputSx, summary, isDraftGenerated, isSummaryApplied, onApplyDraftSummary }) {
  const [localSummary, setLocalSummary] = useState(summary);
  const isSummaryChanged = localSummary !== summary;
  const isApplyDisabled = !isDraftGenerated || (isSummaryApplied && !isSummaryChanged);

  useEffect(() => {
    setLocalSummary(summary);
  }, [summary]);

  const handleChange = useCallback(e => {
    setLocalSummary(e.target.value);
  }, []);

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
        inputProps={{
          "aria-label": "AI 추천 한 줄 요약",
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
