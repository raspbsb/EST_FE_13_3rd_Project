import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import MuiLink from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";

import { resetPortfolio, fetchPortfolio, fetchOtherPortfolios } from "../components/Portfolio/portfolioSlice";
import { HeroSection, DescriptionSection, AiSummarySection, AuthorInfoSection } from "../components/Portfolio";

export default function Portfolio() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, status, error, otherPortfolios } = useSelector(state => state.portfolio);

  useEffect(() => {
    dispatch(fetchPortfolio(id));
    return () => {
      dispatch(resetPortfolio());
    };
  }, [id]);

  useEffect(() => {
    if (status !== "succeeded") return;
    if (!data?.author_id) return;
    dispatch(fetchOtherPortfolios({ id, authorId: data?.author_id }));
  }, [status]);

  if (status === "idle" || status === "loading") {
    return (
      <Container>
        <Text component={"p"} variant="h4">
          포트폴리오 상세
        </Text>
        <Box sx={{ display: "flex", justifyContent: "center", pt: window.innerHeight / 32 }}>
          <CircularProgress size={40} />
        </Box>
      </Container>
    );
  }

  if (status === "failed") {
    return (
      <Container>
        <Text component={"p"} variant="h4">
          포트폴리오 상세
        </Text>
        <Text component={"h1"} variant="h3" sx={{ my: 6 }}>
          DB와 통신에 실패했습니다.
        </Text>
        <Text component={"p"} variant="h5">
          {error?.message}
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

  return (
    <Container>
      <Stack sx={{ gap: { mobile: 4, tablet: 5, desktop: 6 } }}>
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
