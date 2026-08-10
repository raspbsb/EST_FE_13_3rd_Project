import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Text from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { EditIcon } from "../../lib/icons";

export default function HeroHeading({}) {
  const { data, status } = useSelector(state => state.portfolio);

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
          작성일:{" "}
          <time dateTime={data?.created_at}>
            {data?.created_at ? new Date(data.created_at).toISOString().slice(0, 10) : "-"}
          </time>
        </Text>

        <Text component={"p"}>
          작업기간:{" "}
          {data?.started_at === null && data?.ended_at === null ? (
            <>
              <time dateTime={data?.started_at}>
                {data?.started_at ? new Date(data.started_at).toISOString().slice(0, 10) : ""}
              </time>
              <span> ~ </span>
              <time dateTime={data?.ended_at}>
                {data?.ended_at ? new Date(data.ended_at).toISOString().slice(0, 10) : ""}
              </time>
            </>
          ) : (
            "-"
          )}
        </Text>
      </Box>
    </Box>
  );
}
