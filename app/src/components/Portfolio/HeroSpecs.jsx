import { useSelector } from "react-redux";

import Text from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

import { LinkIcon, CodeIcon } from "../../lib/icons";

import HeroSpecsItem from "./HeroSpecsItem";
import TagChip from "../TagChip";

export default function HeroSpecs({}) {
  const { data } = useSelector(state => state.portfolio);
  const categories = data?.portfolio_categories;
  const techStacks = data?.portfolio_tech_stacks;

  return (
    <Grid
      component={"dl"}
      container
      rowSpacing={1}
      columnSpacing={{ mobile: 0, tablet: 1, desktop: 1 }}
      columns={12}
      sx={{ alignItems: "center", minWidth: "0px", maxWidth: "100%" }}
    >
      <HeroSpecsItem label="카테고리" noBox>
        <Stack
          component={"ul"}
          direction="row"
          sx={{ gap: 1, overflow: "scroll", scrollbarWidth: "none", minWidth: "0px" }}
        >
          {categories?.map((c, idx) => (
            <TagChip key={idx} component={"li"} label={c.category} />
          ))}
        </Stack>
      </HeroSpecsItem>

      <HeroSpecsItem label="기술 스택" noBox>
        <Stack
          component={"ul"}
          direction="row"
          sx={{ gap: 1, overflow: "scroll", scrollbarWidth: "none", minWidth: "0px" }}
        >
          {techStacks?.map((ts, idx) => (
            <TagChip key={idx} component={"li"} label={ts.tech_stack} />
          ))}
        </Stack>
      </HeroSpecsItem>

      <HeroSpecsItem label="배포 링크">
        <LinkIcon />
        <MuiLink href={data?.deploy_url ?? ""} variant="body1" color="textPrimary" noWrap>
          {data?.deploy_url ?? ""}
        </MuiLink>
      </HeroSpecsItem>

      <HeroSpecsItem label="Repo 주소">
        <CodeIcon />
        <MuiLink href={data?.repository_url ?? ""} variant="body1" color="textPrimary" noWrap>
          {data?.repository_url ?? ""}
        </MuiLink>
      </HeroSpecsItem>

      <HeroSpecsItem label="담당 역할" half>
        <Text variant="body1">{data?.author_role ?? "-"}</Text>
      </HeroSpecsItem>

      <HeroSpecsItem label="프로젝트 형태" half>
        <Text variant="body1">{data?.project_type ?? "-"}</Text>
      </HeroSpecsItem>

      <HeroSpecsItem label="개발 환경" half>
        <Text variant="body1">{data?.environment ?? "-"}</Text>
      </HeroSpecsItem>

      <HeroSpecsItem label="팀 규모" half>
        <Text variant="body1">{data?.team_size ?? "-"}</Text>
      </HeroSpecsItem>
    </Grid>
  );
}
