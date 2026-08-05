import { NavLink, useNavigate } from 'react-router-dom';
import BookmarkCard from './BookmarkCard';
import List from '@mui/material/List';

export default function BookmarkSection() {
  const navigate = useNavigate();

  // 임시데이터
  const collections = [
    {
      id: 1,
      title: 'Collection title',
      total: 10,
    },
    {
      id: 2,
      title: 'Collection title',
      total: 5,
    },
    {
      id: 3,
      title: 'Collection title',
      total: 6,
    },
  ];

  return (
    <section>
      <div>
        <h2>북마크</h2>
        <nav>
          <NavLink to='/mypage/collections'>View all</NavLink>
        </nav>
      </div>
      <List>
        {collections.map(c => (
          <BookmarkCard
            key={c.id}
            title={c.title}
            total={c.total}
            handleClick={() => navigate(`/mypage/collections/${c.id}`)}
          />
        ))}
      </List>
    </section>
  );
}
