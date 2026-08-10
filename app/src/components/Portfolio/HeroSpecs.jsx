import { useSelector } from "react-redux";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

import { LinkIcon, CodeIcon } from "../../lib/icons";

import HeroSpecsItem from "./HeroSpecsItem";
import TagChip from "../TagChip";

export default function HeroSpecs({}) {
  const { data, status } = useSelector(state => state.portfolio);
  // const categories = data.portfolio_categories;
  const categories = [];
  // const techStacks = data.portfolio_tech_stacks;
  const techStacks = [];

  return (
    <Grid component={"dl"} container rowSpacing={1} columnSpacing={1} columns={12} sx={{ alignItems: "center" }}>
      <HeroSpecsItem label="카테고리" noBox>
        <Stack component={"ul"} direction="row" sx={{ gap: 1, overflow: "scroll", scrollbarWidth: "none" }}>
          {categories?.map(c => (
            <TagChip component={"li"} label={c.category} />
          ))}
        </Stack>
      </HeroSpecsItem>

      <HeroSpecsItem label="기술 스택" noBox>
        <Stack component={"ul"} direction="row" sx={{ gap: 1, overflow: "scroll", scrollbarWidth: "none" }}>
          {techStacks?.map(c => (
            <TagChip component={"li"} label={c.tech_stack} />
          ))}
        </Stack>
      </HeroSpecsItem>

      <HeroSpecsItem label="배포 링크">
        <LinkIcon />
        <MuiLink href="https://deploy-url.com/project" variant="body1" color="textPrimary">
          {data?.deploy_url ?? ""}
        </MuiLink>
      </HeroSpecsItem>

      <HeroSpecsItem label="Repo 주소">
        <CodeIcon />
        <MuiLink href="https://github.com/author/project" variant="body1" color="textPrimary">
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
