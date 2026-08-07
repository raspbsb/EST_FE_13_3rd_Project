import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Text from "@mui/material/Typography";

export default function HeroSpecsItem({ label = "", size = 7, children, noBox }) {
  return (
    <>
      <Grid component={"dt"} size={1}>
        <Text variant="subtitle1">{label}</Text>
      </Grid>
      <Grid component={"dd"} size={size}>
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
