import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Text from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { EditIcon } from "../../lib/icons";

export default function HeroHeading({}) {
  const { data, status, error } = useSelector(state => state.portfolio);

  return (
    <Box>
      <Text component={"h1"} variant="h3" sx={{ fontWeight: "700" }}>
        {data?.title ?? "제목 없음"}
      </Text>
      {
        // 사용자가 작성자일때만 표시
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
      }
      <Box sx={{ display: "flex", gap: 3 }}>
        <Text component={"p"}>
          작성일: <time dateTime={data?.created_at}>{data?.created_at ?? "-"}</time>
        </Text>

        <Text component={"p"}>
          작업기간:{" "}
          {data?.started_at === null && data?.ended_at === null ? (
            <>
              <time dateTime={data?.started_at}>{data?.started_at}</time>
              <span> ~ </span>
              <time dateTime={data?.ended_at}>{data?.ended_at}</time>
            </>
          ) : (
            "-"
          )}
        </Text>
      </Box>
    </Box>
  );
}
