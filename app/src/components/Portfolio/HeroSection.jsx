import Box from "@mui/material/Box";

import HeroHeading from "./HeroHeading";
import HeroMeta from "./HeroMeta";
import HeroSpecs from "./HeroSpecs";
import HeroAiSummary from "./HeroAiSummary";
import HeroImage from "./HeroImage";

export default function HeroSection({}) {
  return (
    <Box
      component={"section"}
      sx={{
        display: "grid",
        gridTemplateAreas: {
          mobile: `"h" "i" "m" "s" "a"`,
          tablet: `"i h" "i m" "i s" "i a"`,
          desktop: `"i h" "i m" "i s" "i a"`,
        },
        gridTemplateColumns: { mobile: "1fr", tablet: "3fr 5fr", desktop: "1fr 2fr" },
        rowGap: 2,
        columnGap: 3,
        position: "relative",
        minWidth: "0px",
        maxWidth: "100%",
      }}
    >
      <Box sx={{ gridArea: "i", minWidth: "0px", maxWidth: "100%", height: "100%" }}>
        <HeroImage />
      </Box>
      <Box sx={{ gridArea: "h", minWidth: "0px", maxWidth: "100%" }}>
        <HeroHeading />
      </Box>
      <Box sx={{ gridArea: "m", minWidth: "0px", maxWidth: "100%" }}>
        <HeroMeta />
      </Box>
      <Box sx={{ gridArea: "s", minWidth: "0px", maxWidth: "100%" }}>
        <HeroSpecs />
      </Box>
      <Box sx={{ gridArea: "a", minWidth: "0px", maxWidth: "100%" }}>
        <HeroAiSummary />
      </Box>
    </Box>
  );
}
