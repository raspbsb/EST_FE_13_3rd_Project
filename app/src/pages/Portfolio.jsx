import Text from "@mui/material/Typography";

import { HeroSection, DescriptionSection, AiSummarySection, AuthorInfoSection } from "../components/Portfolio";

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
