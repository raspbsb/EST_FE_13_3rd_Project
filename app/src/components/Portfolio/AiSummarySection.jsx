import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { AiIcon } from "../icons";

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
