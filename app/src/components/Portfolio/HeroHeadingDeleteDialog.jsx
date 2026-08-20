import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

export default function HeroHeadingDeleteDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>포트폴리오 삭제</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ py: 1, textAlign: "center" }}>
          <Text component={"p"} variant="body1">
            포트폴리오를 삭제하시겠습니까?
          </Text>
          <Text component={"p"} variant="body1" color="error" sx={{ fontWeight: "700" }}>
            한번 삭제하면 복구할 수 없습니다!
          </Text>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="text">
          취소
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          삭제
        </Button>
      </DialogActions>
    </Dialog>
  );
}
