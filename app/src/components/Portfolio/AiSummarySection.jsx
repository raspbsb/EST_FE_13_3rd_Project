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

export default function AiSummarySection({}) {
  return (
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
  );
}
