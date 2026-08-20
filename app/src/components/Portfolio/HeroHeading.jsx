import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { supabase } from "../../utils/supabase";

import Text from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { DeleteIcon, EditIcon } from "../../lib/icons";
import HeroHeadingDeleteDialog from "./HeroHeadingDeleteDialog";

export default function HeroHeading({}) {
  const navigate = useNavigate();

  const { user } = useSelector(state => state.user);
  const { data } = useSelector(state => state.portfolio);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDeletePortfolio = async () => {
    const { error } = await supabase.schema("public").from("portfolios").delete().eq("project_id", data.project_id);

    if (!error) {
      navigate("/gallery");
    }
  };

  return (
    <>
      <Text component={"h1"} variant="h3" sx={{ fontWeight: "700", minWidth: "0px" }}>
        {data?.title ?? "제목 없음"}
      </Text>
      {data?.author_id === user?.id && (
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            top: { mobile: "unset", tablet: "0px", desktop: "0px" },
            bottom: { mobile: "100%", tablet: "unset", desktop: "unset" },
            right: "0px",
            gap: 2,
          }}
        >
          <Button
            component={Link}
            to={`/portfolios/${data?.project_id}/edit`}
            color="secondary"
            variant="contained"
            startIcon={<EditIcon />}
          >
            수정하기
          </Button>
          <Button color="error" variant="contained" startIcon={<DeleteIcon />} onClick={() => setIsDeleteOpen(true)}>
            삭제하기
          </Button>
        </Box>
      )}
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
            "-"
          ) : (
            <>
              <time dateTime={data?.started_at}>
                {data?.started_at ? new Date(data.started_at).toISOString().slice(0, 10) : ""}
              </time>
              <span> ~ </span>
              <time dateTime={data?.ended_at}>
                {data?.ended_at ? new Date(data.ended_at).toISOString().slice(0, 10) : ""}
              </time>
            </>
          )}
        </Text>
      </Box>
      <HeroHeadingDeleteDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeletePortfolio}
      />
    </>
  );
}
