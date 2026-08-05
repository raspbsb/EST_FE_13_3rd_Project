import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 768,
      desktop: 1440,
      desktopContainer: 1272,
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
});

export default theme;
