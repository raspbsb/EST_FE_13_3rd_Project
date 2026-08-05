import { Link } from "react-router-dom";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import AuthorInfoCard from "./AuthorInfoCard";
import AuthorInfoPortfolios from "./AuthorInfoPortfplios";

export default function AuthorInfoSection({}) {
  return (
    <Box component={"section"}>
      <Text component={"h2"} variant="h4">
        작성자 정보
      </Text>
      <Grid container spacing={3}>
        <Grid size={4}>
          <AuthorInfoCard />
        </Grid>
        <Grid size={8}>
          <AuthorInfoPortfolios />
        </Grid>
      </Grid>
    </Box>
  );
}
