import { useSelector } from "react-redux";
import { alpha, useTheme } from "@mui/material/styles";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import { AiIcon, DropDownIcon, DropUpIcon } from "../../lib/icons";
import AiSummaryItem from "./AiSummaryItem";

export default function AiSummarySection({}) {
  const theme = useTheme();
  const { data, status, error, dataAiCreated } = useSelector(state => state.portfolio);

  if (!dataAiCreated) {
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
            분석 시점: <time dateTime={dataAiCreated?.github_analyzed_at}>{dataAiCreated?.github_analyzed_at}</time>
          </Text>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box component={"dl"} sx={{ pt: 1 }}>
          <AiSummaryItem label="프로젝트 요약">{dataAiCreated?.project_summary}</AiSummaryItem>
          <AiSummaryItem label="주요 기능">{dataAiCreated?.main_features}</AiSummaryItem>
          <AiSummaryItem label="기술적 특징">{dataAiCreated?.technical_features}</AiSummaryItem>
          <AiSummaryItem label="프로젝트 구조">{dataAiCreated?.project_structure}</AiSummaryItem>
          <AiSummaryItem label="담당 역할">{dataAiCreated?.analyzed_role}</AiSummaryItem>
          <AiSummaryItem label="참여 내역">{dataAiCreated?.participation_details}</AiSummaryItem>
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
