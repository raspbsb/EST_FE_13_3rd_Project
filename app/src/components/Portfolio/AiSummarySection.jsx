import { useState } from "react";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { AiIcon, DropDownIcon, DropUpIcon } from "../../lib/icons";

export default function AiSummarySection({}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box component={"section"} id="ai-analysis">
      <Box component={"div"} onClick={() => setIsOpen(prev => !prev)}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Text component={"h2"} variant="h4">
            <AiIcon />
            AI 분석결과
          </Text>
          {isOpen ? <DropUpIcon /> : <DropDownIcon />}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Text component={"p"} variant="caption">
            &#8251; AI로 생성된 내용입니다.
          </Text>
          <Text component={"p"} variant="caption">
            분석 시점: <time dateTime="2026-07-23 02:13">2026-07-23 02:13</time>
          </Text>
        </Box>
      </Box>
      <Box sx={{ maxHeight: `${isOpen ? "2048px" : "0px"}`, overflow: "hidden" }}>
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
        <Box>
          <Text>분석 근거</Text>
        </Box>
      </Box>
    </Box>
  );
}
