import { useState } from "react";
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

export default function Portfolio() {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <>
      <Text component={"p"} variant="h4">
        포트폴리오 상세
      </Text>
      <Box component={"section"}>
        <Text component={"h1"} variant="h3">
          Project Title
        </Text>
        <Button
          component={Link}
          to="/portfolios/:id/edit"
          color="secondary"
          variant="contained"
          startIcon={<EditIcon />}
        >
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
      <Box component={"section"}>
        <Text component={"h2"} variant="h4">
          프로젝트 설명
        </Text>
        <Box>
          <Text variant="body1">Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
        </Box>
      </Box>
      <Box component={"section"} id="ai-analysis">
        <Box>
          <Text component={"h2"} variant="h4">
            <AiIcon />
            AI 분석결과
          </Text>
          <Text component={"p"} variant="caption">
            &#8251; AI로 생성된 내용입니다.
          </Text>
        </Box>
        <Box>
          <Box component={"dl"}>
            <Text component={"dt"} variant="h6">
              프로젝트 요약
            </Text>
            <Box component={"dd"}>
              <Text variant="body1">Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
            </Box>

            <Text component={"dt"} variant="h6">
              주요 기능
            </Text>
            <Box component={"dd"}>
              <Text variant="body1">Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
            </Box>

            <Text component={"dt"} variant="h6">
              기술적 특징
            </Text>
            <Box component={"dd"}>
              <Text variant="body1">Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
            </Box>

            <Text component={"dt"} variant="h6">
              프로젝트 구조 및 복잡도
            </Text>
            <Box component={"dd"}>
              <Text variant="body1">Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
            </Box>

            <Text component={"dt"} variant="h6">
              담당 역할
            </Text>
            <Box component={"dd"}>
              <Text variant="body1">Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
            </Box>

            <Text component={"dt"} variant="h6">
              참여 내역
            </Text>
            <Box component={"dd"}>
              <Text variant="body1">Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
            </Box>
          </Box>
          <Box>분석 근거</Box>
        </Box>
      </Box>
      <Box component={"section"}>
        <Text component={"h2"} variant="h4">
          작성자 정보
        </Text>
        <Box>
          <Text component={"h3"} variant="h5">
            author
          </Text>
          <Text component={"p"} variant="subtitle1">
            Frontend Developer
          </Text>
          <Button component={Link} to="/profiles/:userId" color="secondary" variant="contained">
            View Profile
          </Button>
          <List>
            <ListItem>
              <EmailIcon fontSize="small" />
              <Text variant="body2">Email</Text>
            </ListItem>
            <ListItem>
              <CodeIcon fontSize="small" />
              <Text variant="body2">GitHub</Text>
            </ListItem>
            <ListItem>
              <LinkIcon fontSize="small" />
              <Text variant="body2">Linkedin</Text>
            </ListItem>
          </List>
        </Box>
        <Box>
          <Box>
            <Text component={"h3"} variant="h5">
              author의 다른 프로젝트
            </Text>
            <Text component={Link} to="/profiles/:userId">
              View all 4
            </Text>
          </Box>
          <Box component={"ul"}>
            <Box component={"li"}>
              <Box component={"article"}></Box>
            </Box>
            <Box component={"li"}>
              <Box component={"article"}></Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
