import MyProjectsSection from "../components/mypage/MyProjectsSection";
import BookmarkSection from "../components/mypage/BookmarkSection";
import ContactSection from "../components/mypage/ContactSection";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Profile({ mode }) {
  const isMobile = useMediaQuery("(max-width:767px)");

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 9,
      }}
    >
      <MyProjectsSection mode={mode} />

      {mode === "mypage" && !isMobile && (
        <Container sx={{ display: "flex", gap: 3, justifyContent: "center" }} disableGutters>
          <BookmarkSection />
          <ContactSection />
        </Container>
      )}
    </Box>
  );
}
