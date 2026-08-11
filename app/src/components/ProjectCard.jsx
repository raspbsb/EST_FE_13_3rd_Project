import { useNavigate } from 'react-router-dom';
import TagChip from './TagChip';

// import Chip from '@mui/material/Chip';
import Text from '@mui/material/Typography';

import { AccountCircleIcon, FavoriteBorderIcon, VisibilityOutlinedIcon } from '../lib/icons';

import './ProjectCard.scss';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  const thumbnail = project.portfolio_images?.find(image => image.is_thumbnail);

  const handleClick = () => {
    navigate(`/portfolios/${project.project_id}`);
  };

  return (
    <article className="project-card" onClick={handleClick}>
      {/* 썸네일 */}
      <div className="project-card-thumbnail">
        {thumbnail?.image_path ? (
          <img src={thumbnail.image_path} alt={thumbnail.alt_text || project.title} />
        ) : (
          <div className="project-card-thumbnail-placeholder">이미지 없음</div>
        )}

        {project.project_type === 'Team' && <span className="project-card-type">Team</span>}
      </div>

      {/* 카드 내용 */}
      <div className="project-card-content">
        {/* 기술 스택 + 난이도 */}
        <div className="project-card-top">
          <div className="project-card-skills">
            {project.portfolio_tech_stacks?.map(({ tech_stack }) => (
              <TagChip key={tech_stack} label={tech_stack} />
            ))}

            {/* <TagChip label="React" />
            <TagChip label="D3.js" /> */}
          </div>

          <span className="project-card-project-level">{/* 프로젝트 난이도 */}중</span>
        </div>

        {/* 제목 + 날짜 */}
        <div className="project-card-title-row">
          <Text component="h3" variant="h6" className="project-card-title">
            {project.title}
          </Text>

          <Text component="time" variant="overline" className="project-card-date">
            {project.ended_at || project.started_at}
          </Text>
        </div>

        {/* 설명 */}
        <Text component="p" variant="overline" className="project-card-description">
          {project.summary || project.description}
        </Text>

        <div className="project-card-divider" />

        {/* 작성자 + 좋아요 + 조회수 */}
        <div className="project-card-footer">
          <div className="project-card-author">
            <AccountCircleIcon />
            <span>author</span>
          </div>

          <div className="project-card-stats">
            <span className="project-card-like">
              <FavoriteBorderIcon />
              120
            </span>

            <span className="project-card-view">
              <VisibilityOutlinedIcon />
              {project.view_count ?? 0}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
