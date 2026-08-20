import { useSelector } from "react-redux";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";

import { AiIcon } from "../../lib/icons";
import { alpha, useTheme } from "@mui/material/styles";
import { useAiSummary } from "./AiSummaryContext";

export default function HeroAiSummary({}) {
  const theme = useTheme();
  const { data } = useSelector(state => state.portfolio);
  const aiCreated = data?.portfolio_ai_created;
  const { openAndScroll } = useAiSummary();

  return (
    <Box
      sx={{
        px: 3,
        py: 1.5,
        width: "100%",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "primary.main",
        borderRadius: "12px",
        bgcolor: alpha(theme.palette.primary.light, 0.1),
      }}
    >
      <Text component={"h3"} variant="subtitle2" color="primary" sx={{ display: "flex", alignItems: "center" }}>
        <AiIcon fontSize="small" sx={{ mr: 0.5 }} />
        AI 분석 미리보기
      </Text>
      {aiCreated ? (
        <>
          <Text component={"p"} variant="body1" sx={{ my: 1 }}>
            {aiCreated?.ai_short_summary}
          </Text>
          <Text align="right" variant="body2">
            <MuiLink
              href="#ai-analysis"
              onClick={e => {
                e.preventDefault();
                openAndScroll();
              }}
            >
              전체 AI 분석 보기
            </MuiLink>
          </Text>
        </>
      ) : (
        <Text component={"p"} variant="body1" sx={{ my: 1 }}>
          포트폴리오의 AI 분석결과가 없습니다.
        </Text>
      )}
    </Box>
  );
}
