import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Text from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function Collections() {
  return (
    <Box component='section' sx={{}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Text variant='h6'>북마크</Text>
        <Link component='button' underline='hover' variant='subtitle2'>
          컬렉션 관리
        </Link>
      </Box>
      <List>
        <p>컬렉션 카드 영역</p>
      </List>
    </Box>
  );
}
