import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";

import { AiIcon } from "../../lib/icons";

export default function HeroAiSummary({}) {
  return (
    <Box>
      <Text component={"h3"} variant="subtitle2">
        <AiIcon fontSize="small" />
        AI 요약 미리보기
      </Text>
      <Text component={"p"} variant="body2">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </Text>
      <MuiLink href="#ai-analysis">전체 AI 분석 보기</MuiLink>
    </Box>
  );
}
