import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";

import HeroHeading from "./HeroHeading";
import HeroMeta from "./HeroMeta";
import HeroSpecs from "./HeroSpecs";
import HeroAiSummary from "./HeroAiSummary";

export default function HeroSection({}) {
  return (
    <Grid
      component={"section"}
      container
      columnSpacing={3}
      columns={{ mobile: 4, tablet: 8, desktop: 12 }}
      sx={{ position: "relative" }}
    >
      <Grid size={{ mobile: 4, tablet: 3, desktop: 4 }}></Grid>

      <Grid container rowSpacing={2} size={{ mobile: 4, tablet: 5, desktop: 8 }}>
        <HeroHeading />
        <HeroMeta />
        <HeroSpecs />
        <HeroAiSummary>
          프로젝트 등록과 작품 탐색, 제작자 프로필 확인, 채용·협업 문의 과정을 하나의 흐름으로 연결한 포트폴리오 갤러리
          플랫폼입니다.
        </HeroAiSummary>
      </Grid>
    </Grid>
  );
}
