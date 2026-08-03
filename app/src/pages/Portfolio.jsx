import { Link } from "react-router-dom";

import Button from "@mui/material/Button";

import EditIcon from "@mui/icons-material/Edit";
import ViewsIcon from "@mui/icons-material/VisibilityOutlined";
import LikeIcon from "@mui/icons-material/FavoriteBorder";
import LikeIconActive from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/StarBorder";
import StarIconActive from "@mui/icons-material/Star";
import LinkIcon from "@mui/icons-material/Link";
import CodeIcon from "@mui/icons-material/Code";
import AiIcon from "@mui/icons-material/AutoAwesome";
import EmailIcon from "@mui/icons-material/EmailOutlined";

export default function Portfolio() {
  return (
    <>
      <h1>포트폴리오 상세</h1>
      <section>
        <h2>Project Title</h2>
        <Link to="/portfolios/:id/edit">
          <Button color="secondary" variant="contained" startIcon={<EditIcon />}>
            수정하기
          </Button>
        </Link>
        <div>
          <p>
            작성일: <time>2026/08/04</time>
          </p>
          <p>
            작업기간: <time>2026/04/07</time> ~ <time>2026/08/21</time>
          </p>
        </div>
        <div>
          <div>
            <img src={null} alt="author" />
            <p>author</p>
          </div>
          <div>
            <ViewsIcon fontSize="small" />
            65535
          </div>
          <Button color="secondary" variant="contained" startIcon={<LikeIcon />}>
            1972
          </Button>
          <Button color="secondary" variant="contained" startIcon={<StarIcon />}>
            북마크
          </Button>
        </div>
        <ul>
          <li>
            카테고리
            <ul></ul>
          </li>
          <li>
            기술 스택
            <ul></ul>
          </li>
          <li>배포 링크</li>
          <li>Repo 주소</li>
          <li>담당 역할</li>
          <li>프로젝트 형태</li>
        </ul>
        <div>
          <h3>
            <AiIcon />
            AI 요약 미리보기
          </h3>
          <p></p>
          <a href="#ai-analysis">전체 AI 분석 보기</a>
        </div>
      </section>
      <section>
        <h2>프로젝트 설명</h2>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
      </section>
      <section id="ai-analysis">
        <h2>
          <AiIcon />
          AI 분석결과
        </h2>
        <p>AI로 생성된 내용입니다.</p>
        <div>
          <ul>
            <li>프로젝트 요약</li>
            <li>주요 기능</li>
            <li>기술적 특징</li>
            <li>프로젝트 구조 및 복잡도</li>
            <li>담당 역할</li>
            <li>참여 내역</li>
          </ul>
        </div>
      </section>
      <section>
        <h2>작성자 정보</h2>
        <div>
          <h4>author</h4>
          <p>Frontend Developer</p>
          <Link to="/profiles/:userId">
            <Button color="secondary" variant="contained">
              View Profile
            </Button>
          </Link>
          <ul>
            <li>
              <EmailIcon fontSize="small" />
              Email
            </li>
            <li>
              <CodeIcon fontSize="small" />
              GitHub
            </li>
            <li>
              <LinkIcon fontSize="small" />
              Linkedin
            </li>
          </ul>
        </div>
        <div>
          <div>
            <h3>author의 다른 프로젝트</h3>
            <Link to="/profiles/:userId">View all 4</Link>
          </div>
          <ul>
            <li>
              <article></article>
            </li>
            <li>
              <article></article>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
