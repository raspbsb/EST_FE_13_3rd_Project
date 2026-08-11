import { useState } from 'react';
import ContactCard from './ContactCard';
import MessageDialog from './MessageDialog';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import List from '@mui/material/List';
import Box from '@mui/material/Box';

import { CloseIcon } from '../../lib/icons';

export default function ContactDialog({ open, onClose }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [filter, setFilter] = useState('new');

  // 메세지 dialog 상태 관리
  const [openMessage, setOpenMessage] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleMessageClick = item => {
    setSelectedMessage(item);
    setOpenMessage(true);
  };

  //
  const handleChange = (e, value) => {
    if (value !== null) {
      setFilter(value);
    }
  };

  // 임시 데이터
  const contacts = [
    {
      id: 1,
      type: 'like',
      sender: 'employer',
      job: 'Job position',
      projectTitle: 'Nexus Dashboard',
      createdAt: '2h ago',
      isRead: false,
    },
    {
      id: 2,
      type: 'message',
      sender: 'employer',
      job: 'Job position',
      createdAt: '1d ago',
      isRead: false,
    },
    {
      id: 3,
      type: 'like',
      sender: 'employer',
      job: 'Job position',
      projectTitle: 'Nexus Dashboard',
      createdAt: '2h ago',
      isRead: true,
    },
  ];

  const filteredContacts = filter === 'new' ? contacts.filter(contact => !contact.isRead) : contacts;

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        aria-labelledby="알람 목록 모달"
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          관심 & 연락
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 4,
            }}
          >
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={handleChange}
              sx={{
                border: '1px solid',
                borderColor: '#fafafa',
                borderRadius: '999px',
                overflow: 'hidden',

                '& .MuiToggleButton-root': {
                  width: 120,
                  height: 45,

                  border: 0,
                  borderRadius: 6,

                  textTransform: 'none',
                  typography: 'h5',
                  color: 'text.primary',

                  '&:hover': {
                    bgcolor: 'transparent',
                  },
                },

                '& .Mui-selected': {
                  bgcolor: '#212121 !important',
                  color: '#fff !important',
                },
              }}
            >
              <ToggleButton value="new">New</ToggleButton>

              <ToggleButton value="all">All</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <List disablePadding>
            {filteredContacts.map(contact => (
              <ContactCard key={contact.id} item={contact} onMessageClick={handleMessageClick} />
            ))}
          </List>
        </DialogContent>
      </Dialog>
      <MessageDialog open={openMessage} onClose={() => setOpenMessage(false)} message={selectedMessage} />
    </>
  );
}
