import { useNavigate } from 'react-router-dom';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Text from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function BookmarkCard({ title, total }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/mypage/collections`);
  };

  return (
    <ListItem>
      <ListItemButton onClick={handleClick}>
        <Box
          sx={{
            width: `100%`,
            height: `100%`,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* <img src='' alt='' /> */}
        </Box>
        <ListItemText
          primary={title}
          secondary={
            <>
              <Text>총 {total}개</Text>
            </>
          }
        />
        <ListItemIcon>
          <ChevronRightIcon />
        </ListItemIcon>
      </ListItemButton>
    </ListItem>
  );
}
