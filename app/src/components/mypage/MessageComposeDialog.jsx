import { useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../../utils/supabase";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";

import { CloseIcon } from "../../lib/icons";
import IconButton from "@mui/material/IconButton";

export default function MessageComposeDialog({ open, onClose, receiver }) {
  const { user } = useSelector(state => state.user);

  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const handleClose = () => {
    if (sending) return;

    setContent("");
    onClose();
  };

  const handleSubmit = async () => {
    const trimmedContent = content.trim();

    if (!user?.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!receiver?.user_id) {
      alert("받는 사용자 정보를 찾을 수 없습니다.");
      return;
    }

    if (!trimmedContent) {
      alert("메시지를 입력해주세요.");
      return;
    }

    if (user.id === receiver.user_id) {
      alert("자기 자신에게는 메시지를 보낼 수 없습니다.");
      return;
    }

    try {
      setSending(true);

      const { error } = await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: receiver.user_id,
        content: trimmedContent,
        is_read: false,
      });

      if (error) {
        throw error;
      }

      alert("메시지가 전송되었습니다.");

      setContent("");
      onClose();
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      alert("메시지 전송에 실패했습니다.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth aria-labelledby="message-compose-title">
      <DialogTitle
        id="message-compose-title"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        메시지 보내기
        <IconButton onClick={handleClose} disabled={sending}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Text variant="body2" color="text.secondary">
            받는 사람
          </Text>

          <Text variant="body1" fontWeight={600}>
            {receiver?.user_name ?? "알 수 없는 사용자"}
          </Text>
        </Box>

        <TextField
          fullWidth
          multiline
          minRows={6}
          maxRows={12}
          label="메시지"
          placeholder="전달하고 싶은 메시지를 입력해주세요."
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={sending}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={sending}>
          취소
        </Button>

        <Button variant="contained" onClick={handleSubmit} disabled={sending || !content.trim()}>
          {sending ? "전송 중..." : "보내기"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
