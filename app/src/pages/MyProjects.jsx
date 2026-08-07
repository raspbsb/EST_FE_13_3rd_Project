import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Text from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function MyProjects() {
  return (
    <Box component='section' sx={{}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Text variant='h6'>내 프로젝트</Text>
      </Box>
      <List>
        <p>프로젝트 카드 영역</p>
      </List>
    </Box>
  );
}
