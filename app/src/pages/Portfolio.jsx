import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { supabase } from "../utils/supabase";

import Text from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { setLoading, setPortfolio, resetPortfolio } from "../components/Portfolio/portfolioSlice";
import { HeroSection, DescriptionSection, AiSummarySection, AuthorInfoSection } from "../components/Portfolio";

export default function Portfolio() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, status, error } = useSelector(state => state.portfolio);

  async function fetchPortfolio() {
    dispatch(setLoading());
    const result = await supabase.schema("public").from("portfolios").select().eq("project_id", id).maybeSingle();
    dispatch(setPortfolio(result));
  }

  useEffect(() => {
    fetchPortfolio();
    return () => {
      dispatch(resetPortfolio());
    };
  }, [id]);

  return (
    <Container maxWidth={"desktopContainer"}>
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
