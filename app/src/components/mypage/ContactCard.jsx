import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmailIcon from '@mui/icons-material/Email';

export default function ContactCard({ item }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (item.type === 'like') {
      navigate(`/portfolios/${item.projectId}`);
      return;
    }
    if (item.type === 'message') {
      // 메세지 모달 띄우기
    }
  };

  return (
    <article onClick={handleClick}>
      <div>{item.type === 'like' ? <FavoriteIcon color='primary' /> : <EmailIcon />}</div>
      <div>
        <p>
          <strong>{item.sender}</strong>
          {item.type === 'like' ? '님이 회원님의 프로젝트를 좋아합니다' : '님이 회원님에게 메세지를 보냈습니다.'}
        </p>
        {item.type === 'like' && <h4>{item.projectTitle}</h4>}
      </div>
      <span>{item.createAt}</span>
    </article>
  );
}
