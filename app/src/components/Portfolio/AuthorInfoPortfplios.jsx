import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

export default function AuthorInfoPortfolios({}) {
  const { data, status } = useSelector(state => state.portfolio);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { mobile: "column", tablet: "row", desktop: "row" },
          justifyContent: "space-between",
        }}
      >
        <Text component={"h3"} variant="h5">
          author의 다른 프로젝트
        </Text>
        <Text component={"p"} variant="body2" align="right">
          <MuiLink component={Link} to={`/profiles/${data?.author_id}`}>
            View all 4
          </MuiLink>
        </Text>
      </Box>
      <Grid component={"ul"} container columns={2} sx={{ width: "100%" }}>
        <Grid component={"li"} size={1}>
          <Box component={"article"}></Box>
        </Grid>
        <Grid component={"li"} size={1}>
          <Box component={"article"}></Box>
        </Grid>
      </Grid>
    </Box>
  );
}
