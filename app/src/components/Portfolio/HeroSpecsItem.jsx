import { memo } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Text from "@mui/material/Typography";
import styles from "./HeroSpecsItem.module.css";

function HeroSpecsItem({ label = "", half, children, noBox }) {
  return (
    <>
      <Grid component={"dt"} size={{ mobile: 12, tablet: 3, desktop: 2 }} className={`${styles["hero-specs-item"]}`}>
        <Text component={"p"} variant="subtitle2" noWrap>
          {label}
        </Text>
      </Grid>
      <Grid
        component={"dd"}
        size={{ mobile: 12, tablet: 9, desktop: half ? 4 : 10 }}
        className={`${styles["hero-specs-item"]} ${noBox ? styles["no-box"] : ""}`}
      >
        <Box component={"div"}>{children}</Box>
      </Grid>
    </>
  );
}

export default memo(HeroSpecsItem);
