import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Text from "@mui/material/Typography";

export default function HeroSpecsItem({ label = "", half, children, noBox }) {
  return (
    <>
      <Grid component={"dt"} size={{ mobile: 12, tablet: 3, desktop: 2 }} sx={{ mb: -0.5, minWidth: "0px" }}>
        <Text variant="subtitle2" noWrap sx={{ minWidth: "0px" }}>
          {label}
        </Text>
      </Grid>
      <Grid component={"dd"} size={{ mobile: 12, tablet: 9, desktop: half ? 4 : 10 }} sx={{ minWidth: "0px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: noBox ? 0 : 2,
            py: 0.5,
            minWidth: "0px",
            maxWidth: "100%",
            minHeight: "40px",
            borderStyle: "solid",
            borderWidth: noBox ? "0px" : "1px",
            borderColor: "divider",
            borderRadius: "12px",
            bgcolor: "surface",
            overflowX: "scroll",
            scrollbarWidth: "none",
          }}
        >
          {children}
        </Box>
      </Grid>
    </>
  );
}
