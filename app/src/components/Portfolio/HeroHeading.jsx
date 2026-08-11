import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { supabase } from "../../utils/supabase";

import Text from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { EditIcon } from "../../lib/icons";

export default function HeroHeading({}) {
  const { data, status } = useSelector(state => state.portfolio);

  return (
    <>
      <Text component={"h1"} variant="h3" sx={{ fontWeight: "700", minWidth: "0px" }}>
        {data?.title ?? "제목 없음"}
      </Text>
      {
        // 사용자가 작성자일때만 표시
        <Button
          component={Link}
          to={`/portfolios/${data?.project_id}/edit`}
          sx={{
            position: "absolute",
            top: { mobile: "unset", tablet: "0px", desktop: "0px" },
            bottom: { mobile: "100%", tablet: "unset", desktop: "unset" },
            right: "0px",
          }}
          color="secondary"
          variant="contained"
          startIcon={<EditIcon />}
        >
          수정하기
        </Button>
      }
      <Box
        sx={{
          display: "flex",
          gap: { mobile: 0, tablet: 2, desktop: 3 },
          flexDirection: { mobile: "column", tablet: "row", desktop: "row" },
          minWidth: "0px",
        }}
      >
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
    </>
  );
}
