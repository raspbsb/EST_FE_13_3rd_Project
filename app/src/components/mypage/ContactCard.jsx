import { useNavigate } from 'react-router-dom';
import { FavoriteIcon, EmailIcon } from '../../lib/icons';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Text from '@mui/material/Typography';

export default function ContactCard({ item, onMessageClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (item.type === 'like') {
      navigate(`/portfolios/${item.projectId}`);
      return;
    }

    onMessageClick(item);
  };

  return (
    <>
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
          <ListItemIcon>
            {item.type === 'like' ? <FavoriteIcon color="primary" /> : <EmailIcon sx={{ color: 'text.primary' }} />}
          </ListItemIcon>
          <ListItemText
            primary={
              <>
                <Text component="span" fontWeight={700}>
                  {item.sender}
                </Text>
                {item.type === 'like' ? '님이 회원님의 프로젝트를 좋아합니다' : '님이 회원님에게 메세지를 보냈습니다.'}
              </>
            }
            secondary={item.type === 'like' ? item.projectTitle : null}
          />
          <Text>{item.createdAt}</Text>
        </ListItemButton>
      </ListItem>
    </>
  );
}
