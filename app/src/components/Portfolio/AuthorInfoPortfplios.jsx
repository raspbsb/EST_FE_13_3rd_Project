import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import ProjectCard from "../ProjectCard";

export default function AuthorInfoPortfolios({}) {
  const { data, status, otherPortfolios } = useSelector(state => state.portfolio);
  const author = data?.profiles;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { mobile: "column", tablet: "row", desktop: "row" },
          justifyContent: "space-between",
        }}
      >
        <Text component={"h3"} variant="h5">
          {author?.user_name ?? "-"}의 다른 프로젝트
        </Text>
        <Text component={"p"} variant="body1" align="right">
          <MuiLink component={Link} to={`/profiles/${author?.user_id ?? ""}`}>
            View all {otherPortfolios?.count + 1}
          </MuiLink>
        </Text>
      </Box>
      <Grid component={"ul"} container columns={{ mobile: 1, tablet: 2, desktop: 2 }}>
        {otherPortfolios.status === "succeeded" ? (
          <>
            <Grid component={"li"} size={1}>
              <ProjectCard project={otherPortfolios?.data?.[0]} />
            </Grid>
            <Grid component={"li"} size={1}>
              <ProjectCard project={otherPortfolios?.data?.[1]} />
            </Grid>
          </>
        ) : (
          <Grid component={"li"} size={{ mobile: 1, tablet: 2, desktop: 2 }}>
            <Text component={"p"} color="textDisabled" variant="h6" align="center">
              다른 프로젝트가 없습니다.
            </Text>
          </Grid>
        )}
      </Grid>
    </>
  );
}
