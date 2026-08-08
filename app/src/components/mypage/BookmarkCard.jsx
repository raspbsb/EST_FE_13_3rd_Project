import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Text from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { ChevronRightIcon } from '../../lib/icons';

export default function BookmarkCard({ title, total, handleClick }) {
  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={handleClick}
        sx={{
          border: '1px solid',
          borderColor: '#c4c7c7',
          borderRadius: 1,
          mb: '10px',
        }}
      >
        <Box
          component="img"
          src={''}
          alt="최근 북마크 한 프로젝트 썸네일"
          sx={{
            maxWidth: `262px`,
            height: `100%`,
            borderRadius: 2,
            objectFit: 'cover',
          }}
        ></Box>
        <ListItemText
          sx={{
            width: `100%`,
            height: `100%`,
            ml: 2,
          }}
          primary={<Text>{title}</Text>}
          secondary={<Text>총 {total}개</Text>}
        />
        <Box>
          <ChevronRightIcon />
        </Box>
      </ListItemButton>
    </ListItem>
  );
}
