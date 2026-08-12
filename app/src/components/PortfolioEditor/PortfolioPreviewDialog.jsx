import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Text from "@mui/material/Typography";

export default function PortfolioPreviewDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>미리보기</DialogTitle>
      <DialogContent dividers>
        <Text color="text.secondary">현재 입력값 미리보기 영역입니다.</Text>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onClose}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
