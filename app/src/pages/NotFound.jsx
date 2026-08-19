import { Link } from "react-router-dom";
import Text from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import Container from "@mui/material/Container";

export default function NotFound() {
  return (
    <Container>
      <Text component={"h1"} variant="h2" sx={{ mt: 6 }}>
        404 ERROR
      </Text>
      <Text component={"h1"} variant="h4" sx={{ my: 2 }}>
        페이지가 없습니다.
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
