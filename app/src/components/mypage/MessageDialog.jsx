import { supabase } from "../../utils/supabase";
import { useTheme } from "@mui/material/styles";

import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";

import { CloseIcon } from "../../lib/icons";

export default function MessageDialog({ open, onClose, message, onMessageRead }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleMarkAsRead = async () => {
    if (!message?.id) return;

    const { error } = await supabase
      .from("messages")
      .update({
        is_read: true,
      })
      .eq("id", message.id);

    if (error) {
      console.error("메시지 읽음 처리 실패:", error);
      return;
    }

    console.log("메시지 읽음 처리 성공");

    onMessageRead?.(message.id);

    onClose();
  };

  if (!message) return null;

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={onClose} maxWidth="sm" fullWidth aria-labelledby="메세지">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        메세지
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          px: 3,
        }}
        dividers
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mb: 2,
            }}
          >
            <Text component="h3" variant="body1" sx={{ width: 100 }}>
              {message.sender}
            </Text>

            <Text component="h4" variant="subtitle2">
              {message.job}
            </Text>
          </Box>

          <Box
            sx={{
              display: "flex",
              mb: 3,
            }}
          >
            <Text component="span" variant="body1">
              {message.createdAt}
            </Text>
          </Box>
        </Box>

        <Box sx={{ border: "1px solid #ccc", p: 2, bgcolor: "#fff" }}>
          <Text
            component="p"
            variant="subtitle2"
            sx={{
              whiteSpace: "pre-line",
            }}
          >
            {message.content}
          </Text>
        </Box>

        <Box sx={{ pt: 2 }}>
          <Text component="span" variant="subtitle2" sx={{ color: "primary.main" }}>
            ⓘ 이 메시지는 비공개 제안을 포함하고 있습니다.
          </Text>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="contained" color="error" onClick={onClose}>
          삭제
        </Button>
        <Button variant="contained" sx={{ bgcolor: "text.primary" }} onClick={handleMarkAsRead}>
          읽음 표시
        </Button>
      </DialogActions>
    </Dialog>
  );
}
