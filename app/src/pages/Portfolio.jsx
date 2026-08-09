import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { supabase } from "../utils/supabase";

import Text from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import MuiLink from "@mui/material/Link";

import {
  setLoading,
  setPortfolio,
  resetPortfolio,
  setImages,
  setCategories,
  setTechStacks,
  setAiCreated,
} from "../components/Portfolio/portfolioSlice";
import { HeroSection, DescriptionSection, AiSummarySection, AuthorInfoSection } from "../components/Portfolio";

export default function Portfolio() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, status, error } = useSelector(state => state.portfolio);

  async function fetchPortfolio() {
    dispatch(setLoading());
    const result = await supabase.schema("public").from("portfolios").select().eq("project_id", id).maybeSingle();
    dispatch(setPortfolio(result));

    const resultImages = await supabase.schema("public").from("portfolio_images").select().eq("project_id", id);
    dispatch(setImages(resultImages));

    const resultCategories = await supabase.schema("public").from("portfolio_categories").select().eq("project_id", id);
    dispatch(setCategories(resultCategories));

    const resultTechStacks = await supabase
      .schema("public")
      .from("portfolio_tech_stacks")
      .select()
      .eq("project_id", id);
    dispatch(setTechStacks(resultTechStacks));

    const resultAiCreated = await supabase
      .schema("public")
      .from("portfolio_ai_created")
      .select()
      .eq("project_id", id)
      .maybeSingle();
    dispatch(setAiCreated(resultAiCreated));
  }

  useEffect(() => {
    fetchPortfolio();
    return () => {
      dispatch(resetPortfolio());
    };
  }, [id]);

  if (status === "failed") {
    return (
      <Container>
        <Text component={"p"} variant="h4">
          포트폴리오 상세
        </Text>
        <Text component={"h1"} variant="h3" sx={{ my: 6 }}>
          DB와 통신에 실패했습니다.
        </Text>
        {/*
        <Text component={"p"} variant="h5">
          {error}
        </Text>
        */}
        <Text component={"p"} variant="body1">
          <MuiLink component={Link} to={"/"}>
            홈으로 돌아가기
          </MuiLink>
        </Text>
        <Text component={"p"} variant="body1">
          <MuiLink component={Link} to={"/gallery"}>
            목록으로 돌아가기
          </MuiLink>
        </Text>
      </Container>
    );
  }
  /*
  if (status === "notFound") {
    return (
      <Container>
        <Text component={"p"} variant="h4">
          포트폴리오 상세
        </Text>
        <Text component={"h1"} variant="h3" sx={{ my: 6 }}>
          해당하는 포트폴리오가 없습니다.
        </Text>
        <Text component={"p"} variant="body1">
          <MuiLink component={Link} to={"/"}>
            홈으로 돌아가기
          </MuiLink>
        </Text>
        <Text component={"p"} variant="body1">
          <MuiLink component={Link} to={"/gallery"}>
            목록으로 돌아가기
          </MuiLink>
        </Text>
      </Container>
    );
  }
  */
  return (
    <Container>
      <Stack sx={{ gap: { mobile: 3, tablet: 4, desktop: 6 }, py: { mobile: 4, tablet: 4, desktop: 6 } }}>
        <Text component={"p"} variant="h4">
          포트폴리오 상세
        </Text>
        <HeroSection />
        <DescriptionSection />
        <AiSummarySection />
        <AuthorInfoSection />
      </Stack>
    </Container>
  );
}
