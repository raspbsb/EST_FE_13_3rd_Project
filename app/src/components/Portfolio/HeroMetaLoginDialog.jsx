import { Link } from "react-router-dom";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

export default function HeroMetaLoginDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>로그인 필요</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ py: 1, textAlign: "center" }}>
          <Text component={"p"} variant="body1">
            로그인이 필요한 기능입니다
          </Text>
          <Button component={Link} to="/login" color="primary" variant="contained" sx={{ mt: 1 }}>
            로그인으로 이동
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="text">
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}
