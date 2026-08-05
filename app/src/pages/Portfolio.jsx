import { useState } from "react";
import { Link } from "react-router-dom";

import Text from "@mui/material/Typography";

import HeroSection from "../components/Portfolio/HeroSection";
import DescriptionSection from "../components/Portfolio/DescriptionSection";
import AiSummarySection from "../components/Portfolio/AiSummarySection";
import AuthorInfoSection from "../components/Portfolio/AuthorInfoSection";

export default function Portfolio() {
  return (
    <>
      <Text component={"p"} variant="h4">
        포트폴리오 상세
      </Text>
      <HeroSection />
      <DescriptionSection />
      <AiSummarySection />
      <AuthorInfoSection />
    </>
  );
}
