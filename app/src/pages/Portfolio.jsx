import Text from "@mui/material/Typography";

import * as Sections from "../components/Portfolio/index";

export default function Portfolio() {
  return (
    <>
      <Text component={"p"} variant="h4">
        포트폴리오 상세
      </Text>
      <Sections.HeroSection />
      <Sections.DescriptionSection />
      <Sections.AiSummarySection />
      <Sections.AuthorInfoSection />
    </>
  );
}
