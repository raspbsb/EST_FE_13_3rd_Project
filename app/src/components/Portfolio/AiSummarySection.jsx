import { useSelector } from "react-redux";
import { alpha, useTheme } from "@mui/material/styles";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import { AiIcon, DropDownIcon } from "../../lib/icons";
import AiSummaryItem from "./AiSummaryItem";

export default function AiSummarySection({}) {
  const theme = useTheme();
  const { data } = useSelector(state => state.portfolio);
  const aiCreated = data?.portfolio_ai_created;

  if (!aiCreated) {
    return <></>;
  }

  return (
    <Accordion
      component={"section"}
      id="ai-analysis"
      sx={{
        px: 3,
        pb: 2,
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "primary.main",
        borderRadius: "12px",
        bgcolor: alpha(theme.palette.primary.light, 0.1),
      }}
    >
      <AccordionSummary
        component={"div"}
        sx={{
          borderStyle: "solid",
          borderWidth: "0px 0px 1px",
          borderColor: "primary.dark",
        }}
        expandIcon={<DropDownIcon color="primary" />}
      >
        <Box>
          <Text component={"h2"} variant="h4" sx={{ fontWeight: "700" }} color="primary">
            <AiIcon sx={{ mr: 1 }} />
            AI 분석결과
          </Text>
          <Text component={"p"} variant="caption">
            분석 시점: <time dateTime={aiCreated?.github_analyzed_at}>{aiCreated?.github_analyzed_at}</time>
          </Text>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box component={"dl"} sx={{ pt: 1 }}>
          <AiSummaryItem label="프로젝트 요약">{aiCreated?.project_summary}</AiSummaryItem>
          <AiSummaryItem label="주요 기능">{aiCreated?.main_features}</AiSummaryItem>
          <AiSummaryItem label="기술적 특징">{aiCreated?.technical_features}</AiSummaryItem>
          <AiSummaryItem label="프로젝트 구조">{aiCreated?.project_structure}</AiSummaryItem>
          <AiSummaryItem label="담당 역할">{aiCreated?.analyzed_role}</AiSummaryItem>
          <AiSummaryItem label="참여 내역">{aiCreated?.participation_details}</AiSummaryItem>
        </Box>
        {/*
          <Box>
            <Text>분석 근거</Text>
          </Box>
          */}
      </AccordionDetails>
    </Accordion>
  );
}
