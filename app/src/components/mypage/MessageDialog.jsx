import { supabase } from "../../utils/supabase";
import { useState } from "react";
import { useSelector } from "react-redux";
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

export default function MessageDialog({ open, onClose, message, onMessageRead, onMessageDelete }) {
  const { user } = useSelector(state => state.user);

  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  // 메세지 읽음 처리 DB에 업데이트
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

    onMessageRead?.(message.id);

    onClose();
  };

  // 메세지 삭제
  const handleDelete = async () => {
    if (!message?.id) return;

    try {
      // 현재 로그인한 사용자 확인
      if (!user?.id) {
        console.error("로그인한 사용자가 없습니다.");
        return;
      }

      const { error } = await supabase.from("messages").delete().eq("id", message.id).eq("receiver_id", user.id);

      if (error) {
        throw error;
      }

      // ContactSection의 목록에서도 제거
      onMessageDelete?.(message.id);

      // Dialog 닫기
      onClose();
    } catch (error) {
      console.error("메시지 삭제 실패:", error);
    }
  };

  if (!message) return null;

  return (
    <>
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
          <Button variant="contained" color="error" onClick={() => setOpenDeleteConfirm(true)}>
            삭제
          </Button>
          <Button variant="contained" sx={{ bgcolor: "text.primary" }} onClick={handleMarkAsRead}>
            읽음 표시
          </Button>
        </DialogActions>
      </Dialog>
      {/* 메세지 삭제 확인 모달 */}
      <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)} maxWidth="xs" fullWidth>
        <DialogTitle>메시지를 삭제하시겠습니까?</DialogTitle>

        <DialogContent>
          <Text variant="body2" color="text.secondary">
            삭제한 메시지는 다시 복구할 수 없습니다.
          </Text>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirm(false)}>취소</Button>

          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              await handleDelete();
              setOpenDeleteConfirm(false);
            }}
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
