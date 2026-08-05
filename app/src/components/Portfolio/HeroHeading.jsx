import { Link } from "react-router-dom";

import Text from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { EditIcon } from "../icons";

export default function HeroHeading({}) {
  return (
    <Box>
      <Text component={"h1"} variant="h3">
        Project Title
      </Text>
      <Button
        component={Link}
        to="/portfolios/:id/edit"
        sx={{ position: "absolute", top: "0px", right: "0px" }}
        color="secondary"
        variant="contained"
        startIcon={<EditIcon />}
      >
        수정하기
      </Button>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Text component={"p"}>
          작성일: <time dateTime="2026-08-04">2026/08/04</time>
        </Text>
        <Text component={"p"}>
          작업기간: <time dateTime="2026-04-07">2026/04/07</time> ~ <time dateTime="2026-08-21">2026/08/21</time>
        </Text>
      </Box>
    </Box>
  );
}
