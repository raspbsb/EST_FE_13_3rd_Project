import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Text from '@mui/material/Typography';

import { CloseIcon } from '../../lib/icons';

export default function MessageDialog({ open, onClose, message }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  if (!message) return null;

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={onClose} maxWidth="sm" fullWidth aria-labelledby="메세지">
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        메세지
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',

              mb: 3,
            }}
          >
            <Text variant="body1" sx={{ width: 100 }}>
              {message.sender}
            </Text>

            <Text variant="subtitle2">{message.job}</Text>
          </Box>

          <Box
            sx={{
              display: 'flex',
              mb: 3,
            }}
          >
            <Text variant="body1">{message.createdAt}</Text>
          </Box>
        </Box>

        <Box>
          <Text variant="subtitle2" gutterBottom>
            Message
          </Text>

          <Text
            variant="body1"
            sx={{
              whiteSpace: 'pre-line',
              lineHeight: 1.8,
            }}
          >
            {message.content}
          </Text>
        </Box>

        <Divider sx={{ mb: 3 }} />
        <Box>
          <Text variant="subtitle2" sx={{ color: 'primary.main' }} gutterBottom>
            (아이콘 추가) 이 메시지는 비공개 제안을 포함하고 있습니다.
          </Text>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button variant="contained" color="error" onClick={onClose}>
          삭제
        </Button>
        <Button variant="contained" sx={{ bgcolor: 'text.primary' }} onClick={onClose}>
          읽음 표시
        </Button>
      </DialogActions>
    </Dialog>
  );
}
