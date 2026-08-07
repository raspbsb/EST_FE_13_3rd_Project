import { Link } from "react-router-dom";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

export default function AuthorInfoPortfolios({}) {
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Text component={"h3"} variant="h5">
          author의 다른 프로젝트
        </Text>
        <Text component={Link} to="/profiles/:userId">
          View all 4
        </Text>
      </Box>
      <Stack component={"ul"} direction={"row"}>
        <Box component={"li"}>
          <Box component={"article"}></Box>
        </Box>
        <Box component={"li"}>
          <Box component={"article"}></Box>
        </Box>
      </Stack>
    </Box>
  );
}
