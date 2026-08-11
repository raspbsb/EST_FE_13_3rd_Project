import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 768,
      desktopContainer: 1272,
      desktop: 1440,
    },
  },
  palette: {
    background: {
      default: "#FBFCFD",
    },
    primary: {
      main: "#0D6EFD",
      light: "#569AFE",
    },
    secondary: {
      main: "#EDEDED",
    },
    text: {
      primary: "#212121",
    },
  },
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: "desktopContainer",
        sx: {
          minHeight: (window.innerHeight * 4) / 5,
          py: { mobile: 3, tablet: 4, desktop: 6 },
        },
      },
    },
  },
});

export default theme;
