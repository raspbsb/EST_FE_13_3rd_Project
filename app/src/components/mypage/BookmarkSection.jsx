import { useNavigate } from 'react-router-dom';
import BookmarkCard from './BookmarkCard';

import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Text from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';

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
    <Box component="section" sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Text variant="h6">북마크</Text>

        <Link href="/mypage/collections" underline="hover" variant="subtitle2">
          View all
        </Link>
      </Box>
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
    </Box>
  );
}
