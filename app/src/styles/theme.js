import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class",
  },
  breakpoints: {
    values: {
      xs: 0,
      mobile: 0,
      sm: 600,
      tablet: 768,
      md: 900,
      lg: 1200,
      desktopContainer: 1272,
      desktop: 1440,
      xl: 1536,
    },
  },
  colorSchemes: {
    light: {
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
