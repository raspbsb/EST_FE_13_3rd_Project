import { NavLink } from 'react-router-dom';
import ContactCard from './ContactCard';
import ContactDialog from './ContactDialog';
import MessageDialog from './MessageDialog';

import Container from '@mui/material/Container';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Text from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useState } from 'react';

export default function ContactSection() {
  //임시데이터
  const notifications = [
    {
      id: 1,
      type: 'message',
      sender: 'employer',
      job: 'Job position',
      createdAt: '1d ago',
      message: '회원님에게 메세지를 보냈습니다.',
      roomId: 'room1',
    },
    {
      id: 2,
      type: 'like',
      sender: 'employer',
      job: 'Job position',
      projectId: 10,
      projectTitle: 'Nexus Dashboard',
      createdAt: '2h ago',
    },
  ];

  // dialog 열기
  const [openContact, setOpenContact] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // 메세지 클릭
  const handleMessage = item => {
    setSelectedMessage(item);
    setOpenMessage(true);
  };

  return (
    <Container component="section">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Text variant="h6">관심 & 연락</Text>
        <Link component="button" underline="hover" variant="subtitle2" onClick={() => setOpenContact(true)}>
          View all
        </Link>
        {/* Dialog 컴포넌트*/}
        <ContactDialog open={openContact} onClose={() => setOpenContact(false)} />
      </Box>
      <List>
        {notifications.map(item => (
          <ContactCard key={item.id} item={item} onClick={() => handleMessage(item)} />
        ))}
      </List>
      <MessageDialog open={openMessage} onClose={() => setOpenMessage(false)} message={selectedMessage} />
    </Container>
  );
}
