import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";

import HeroHeading from "./HeroHeading";
import HeroMeta from "./HeroMeta";
import HeroSpecs from "./HeroSpecs";
import HeroAiSummary from "./HeroAiSummary";

export default function HeroSection({}) {
  return (
    <Grid component={"section"} container columnSpacing={3} columns={12} sx={{ position: "relative" }}>
      <Grid size={4}></Grid>

      <Grid size={8}>
        <HeroHeading />
        <HeroMeta />
        <HeroSpecs />
        <HeroAiSummary />
      </Grid>
    </Grid>
  );
}
