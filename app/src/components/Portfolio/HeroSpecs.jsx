import { useSelector } from "react-redux";

import ScrollContainer from "react-indiana-drag-scroll";

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
        <ScrollContainer
          component={"ul"}
          vertical={false}
          hideScrollbars
          style={{ display: "flex", gap: "8px", minWidth: "0px", width: "100%" }}
        >
          {categories?.map((c, idx) => (
            <TagChip key={idx} component={"li"} label={c.category} />
          ))}
        </ScrollContainer>
      </HeroSpecsItem>

      <HeroSpecsItem label="기술 스택" noBox>
        <ScrollContainer
          component={"ul"}
          vertical={false}
          hideScrollbars
          style={{ display: "flex", gap: "8px", minWidth: "0px", width: "100%" }}
        >
          {techStacks?.map((ts, idx) => (
            <TagChip key={idx} component={"li"} label={ts.tech_stack} />
          ))}
        </ScrollContainer>
      </HeroSpecsItem>

      <HeroSpecsItem label="배포 링크">
        <LinkIcon />
        {data?.deploy_url ? (
          <MuiLink
            href={data?.deploy_url}
            target="_blank"
            rel="noopener noreferrer"
            variant="body1"
            color="textPrimary"
            noWrap
          >
            {data?.deploy_url}
          </MuiLink>
        ) : (
          <Text variant="body1" color="textDisabled">
            -
          </Text>
        )}
      </HeroSpecsItem>

      <HeroSpecsItem label="Repo 주소">
        <CodeIcon />
        {data?.repository_url ? (
          <MuiLink
            href={data?.repository_url}
            target="_blank"
            rel="noopener noreferrer"
            variant="body1"
            color="textPrimary"
            noWrap
          >
            {data?.repository_url}
          </MuiLink>
        ) : (
          <Text variant="body1" color="textDisabled">
            -
          </Text>
        )}
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
