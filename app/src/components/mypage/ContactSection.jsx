import { NavLink } from 'react-router-dom';
import ContactCard from './ContactCard';

import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Text from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function ContactSection() {
  //임시데이터
  const notifications = [
    {
      id: 1,
      type: 'message',
      sender: 'employer (Job position)',
      createdAt: '1d ago',
      message: '회원님에게 메세지를 보냈습니다.',
      roomId: 'room1',
    },
    {
      id: 2,
      type: 'like',
      sender: 'employer (Job position)',
      projectId: 10,
      projectTitle: 'Nexus Dashboard',
      createdAt: '2h ago',
    },
  ];

  return (
    <Box component='section' sx={{}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Text variant='h6'>관심 & 연락</Text>
        <Link component='button' underline='hover' variant='subtitle2'>
          View all
        </Link>
      </Box>
      <List>
        {notifications.map(item => (
          <ContactCard key={item.id} item={item} />
        ))}
      </List>
    </Box>
  );
}
