import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";

import { AiIcon } from "../../lib/icons";
import { alpha, useTheme } from "@mui/material/styles";

export default function HeroAiSummary({ children }) {
  const theme = useTheme();

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
        AI 요약 미리보기
      </Text>
      <Text component={"p"} variant="body2" sx={{ my: 0.5 }} noWrap>
        {children}
      </Text>
      <Text align="right" variant="body2">
        <MuiLink href="#ai-analysis">전체 AI 분석 보기</MuiLink>
      </Text>
    </Box>
  );
}
