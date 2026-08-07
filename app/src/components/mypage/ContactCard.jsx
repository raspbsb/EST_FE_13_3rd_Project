import { useNavigate } from 'react-router-dom';

import { FavoriteIcon, EmailIcon } from '../../lib/icons';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Text from '@mui/material/Typography';

export default function ContactCard({ item }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (item.type === 'like') {
      navigate(`/portfolios/${item.projectId}`);
    } else {
      // 메세지 모달 띄우기
    }
  };

  return (
    <ListItem>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          {item.type === 'like' ? <FavoriteIcon color='primary' /> : <EmailIcon color='primary' />}
        </ListItemIcon>
        <ListItemText
          primary={
            <>
              <Text component='span' fontWeight={700}>
                {item.sender}
              </Text>
              {item.type === 'like' ? '님이 회원님의 프로젝트를 좋아합니다' : '님이 회원님에게 메세지를 보냈습니다.'}
            </>
          }
          secondary={item.type === 'like' && <Text color='primary'>{item.projectTitle}</Text>}
        />
        <Text>{item.createdAt}</Text>
      </ListItemButton>
    </ListItem>
  );
}
