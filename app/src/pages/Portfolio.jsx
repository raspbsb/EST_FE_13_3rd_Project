import Text from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { HeroSection, DescriptionSection, AiSummarySection, AuthorInfoSection } from "../components/Portfolio";

export default function Portfolio() {
  return (
    <Container maxWidth={"desktopContainer"}>
      <Stack sx={{ gap: { mobile: 3, tablet: 4, desktop: 6 }, py: { mobile: 4, tablet: 4, desktop: 6 } }}>
        <Text component={"p"} variant="h4">
          포트폴리오 상세
        </Text>
        <HeroSection />
        <DescriptionSection />
        <AiSummarySection />
        <AuthorInfoSection />
      </Stack>
    </Container>
  );
}
