import { Link } from "react-router-dom";

import Text from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

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

export default function HeroSection({}) {
  const isLiked = false;
  const isBookmarked = false;

  return (
    <Box component={"section"}>
      <Text component={"h1"} variant="h3">
        Project Title
      </Text>
      <Button component={Link} to="/portfolios/:id/edit" color="secondary" variant="contained" startIcon={<EditIcon />}>
        수정하기
      </Button>
      <Box>
        <Text component={"p"}>
          작성일: <time dateTime="2026-08-04">2026/08/04</time>
        </Text>
        <Text component={"p"}>
          작업기간: <time dateTime="2026-04-07">2026/04/07</time> ~ <time dateTime="2026-08-21">2026/08/21</time>
        </Text>
      </Box>
      <Box>
        <Box>
          <img src={null} alt="author" />
          <Text component={"p"} variant="subtitle1">
            author
          </Text>
        </Box>
        <Box>
          <ViewsIcon fontSize="small" />
          <Text variant="body2">65535</Text>
        </Box>
        <Button
          color="secondary"
          variant="contained"
          startIcon={isLiked ? <LikeIconActive /> : <LikeIcon />}
          aria-pressed={isLiked}
          onClick={() => {}}
        >
          <Text component={"span"} variant="body2">
            1972
          </Text>
        </Button>
        <Button
          color="secondary"
          variant="contained"
          startIcon={isBookmarked ? <StarIconActive /> : <StarIcon />}
          aria-pressed={isBookmarked}
          onClick={() => {}}
        >
          <Text component={"span"} variant="body2">
            북마크
          </Text>
        </Button>
      </Box>
      <Box component={"dl"}>
        <Text component={"dt"} variant="subtitle1">
          카테고리
        </Text>
        <Box component={"dd"}>
          <Box component={"ul"}></Box>
        </Box>

        <Text component={"dt"} variant="subtitle1">
          기술 스택
        </Text>
        <Box component={"dd"}>
          <Box component={"ul"}></Box>
        </Box>

        <Text component={"dt"} variant="subtitle1">
          배포 링크
        </Text>
        <Box component={"dd"}>
          <LinkIcon />
          <Text variant="body1">https://deploy-url.com/project</Text>
        </Box>

        <Text component={"dt"} variant="subtitle1">
          Repo 주소
        </Text>
        <Box component={"dd"}>
          <CodeIcon />
          <Text variant="body1">https://github.com/author/project</Text>
        </Box>

        <Text component={"dt"} variant="subtitle1">
          담당 역할
        </Text>
        <Box component={"dd"}>
          <Text variant="body1">Frontend Lead</Text>
        </Box>

        <Text component={"dt"} variant="subtitle1">
          프로젝트 형태
        </Text>
        <Box component={"dd"}>
          <Text variant="body1">Team Project</Text>
        </Box>
      </Box>
      <Box>
        <Text component={"h3"} variant="subtitle2">
          <AiIcon fontSize="small" />
          AI 요약 미리보기
        </Text>
        <Text component={"p"} variant="body2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </Text>
        <Text component={"a"} href="#ai-analysis">
          전체 AI 분석 보기
        </Text>
      </Box>
    </Box>
  );
}
