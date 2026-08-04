import { NavLink } from 'react-router-dom';
import ContactCard from './ContactCard';
import List from '@mui/material/List';

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
    <section>
      <div>
        <h2>관심 & 연락</h2>
        <nav>
          <NavLink to=''>View all</NavLink>
        </nav>
      </div>
      <List>
        {notifications.map(item => (
          <ContactCard key={item.id} item={item} />
        ))}
      </List>
    </section>
  );
}
