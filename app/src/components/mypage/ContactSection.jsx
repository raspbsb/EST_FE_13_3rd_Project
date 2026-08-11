import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ContactCard from './ContactCard';
import ContactDialog from './ContactDialog';
import MessageDialog from './MessageDialog';

import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Text from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function ContactSection() {
  const navigate = useNavigate;

  // dialog 상태 관리
  const [openContact, setOpenContact] = useState(false); //view all 클릭 시 띄우는 dialog
  const [openMessage, setOpenMessage] = useState(false); // 메세지 dialog
  const [selectedMessage, setSelectedMessage] = useState(null);

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

  // 메세지 클릭 (item 저장 -> dialog 오픈)
  const handleMessageClick = item => {
    setSelectedMessage(item);
    setOpenMessage(true);
  };

  return (
    <Box component="section" sx={{ width: '100%' }}>
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
          <ContactCard key={item.id} item={item} onMessageClick={handleMessageClick} />
        ))}
      </List>
      <MessageDialog open={openMessage} onClose={() => setOpenMessage(false)} message={selectedMessage} />
    </Box>
  );
}
