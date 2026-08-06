import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 768,
      desktop: 1440,
      desktopContainer: 1272,

      // 깨짐 방지용 (사용을 권장하지 않음)
      xs: 0,
      sm: 768,
      md: 768,
      lg: 1272,
      xl: 1440,
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
