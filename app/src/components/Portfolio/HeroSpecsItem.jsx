import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Text from "@mui/material/Typography";

export default function HeroSpecsItem({ label = "", half, children, noBox }) {
  return (
    <>
      <Grid component={"dt"} size={{ mobile: 4, tablet: 3, desktop: 2 }}>
        <Text variant="subtitle2">{label}</Text>
      </Grid>
      <Grid component={"dd"} size={{ mobile: 8, tablet: 9, desktop: half ? 4 : 10 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1,
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
