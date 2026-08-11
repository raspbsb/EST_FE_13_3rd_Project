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

      <Grid
        container
        rowSpacing={2}
        size={{ mobile: 4, tablet: 5, desktop: 8 }}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <HeroHeading />
        <HeroMeta />
        <HeroSpecs />
        <HeroAiSummary />
      </Grid>
    </Grid>
  );
}
