import { useNavigate } from "react-router-dom";
import { toUrl } from "../services/toUrl";

import TagChip from "./TagChip";

import Text from "@mui/material/Typography";

import { AccountCircleIcon, FavoriteBorderIcon, VisibilityOutlinedIcon } from "../lib/icons";

import "./ProjectCard.scss";

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  if (!project) {
    return <></>;
  }

  const thumbnail = project.portfolio_images?.find(image => image.is_thumbnail);
  const thumbnailUrl = thumbnail?.image_path ? toUrl("portfolio_images", thumbnail.image_path) : null;

  // 프로젝트 카드 클릭-> 포트폴리오 상세 페이지로 이동
  const handleClick = () => {
    navigate(`/portfolios/${project.project_id}`);
  };
  // 날짜 출력
  const formatDate = date => {
    if (!date) return "";

    const dateObj = new Date(date);

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  };

  return (
    <article className="project-card" onClick={handleClick}>
      {/* 썸네일 */}
      <div className="project-card-thumbnail">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={thumbnail?.alt_text || project.title} />
        ) : (
          <div className="project-card-thumbnail-placeholder">이미지 없음</div>
        )}

        {project.project_type === "Team" && <span className="project-card-type">Team</span>}
      </div>

      {/* 카드 내용 */}
      <div className="project-card-content">
        {/* 기술 스택 + 난이도 */}
        <div className="project-card-top">
          <div className="project-card-skills">
            {project.portfolio_tech_stacks?.map(({ tech_stack }) => (
              <TagChip key={tech_stack} label={tech_stack} />
            ))}
          </div>

          <span className="project-card-project-level">{/* 프로젝트 난이도 */}중</span>
        </div>

        {/* 제목 + 날짜 */}
        <div className="project-card-title-row">
          <Text component="h3" variant="h6" className="project-card-title">
            {project.title}
          </Text>

          <Text component="time" variant="overline" className="project-card-date">
            {formatDate(project.created_at)}
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
            <span>{project.profiles?.user_name || "Unknown"}</span>
          </div>

          <div className="project-card-stats">
            <span className="project-card-like">
              <FavoriteBorderIcon />0
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
