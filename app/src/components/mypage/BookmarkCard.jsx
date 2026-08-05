import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Text from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function BookmarkCard({ title, total, handleClick }) {
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
          {/* <img src='{}' alt='{}' /> */}
        </Box>
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
