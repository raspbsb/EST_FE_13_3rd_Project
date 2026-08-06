import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Text from "@mui/material/Typography";

export default function HeroSpecsItem({ label = "", size = 7, children }) {
  return (
    <>
      <Grid component={"dt"} size={1}>
        <Text variant="subtitle1">{label}</Text>
      </Grid>
      <Grid component={"dd"} size={size}>
        <Box sx={{ display: "flex", gap: 1 }}>{children}</Box>
      </Grid>
    </>
  );
}
