import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";

import styles from "./BookmarkCard.module.css";

import { ChevronRightIcon } from "../../lib/icons";

export default function BookmarkCard({ title, total, thumbnail, handleClick }) {
  return (
    <ListItem disablePadding className={styles.item}>
      <ListItemButton onClick={handleClick} className={styles.card}>
        <Box component="img" src={thumbnail} alt={`${title} 컬렉션 썸네일`} className={styles.thumbnail} />

        <ListItemText
          className={styles.info}
          primary={
            <Text component="h3" className={styles.title}>
              {title}
            </Text>
          }
          secondary={
            <Text component="span" className={styles.total}>
              총 {total}개
            </Text>
          }
        />

        <Box className={styles.arrow}>
          <ChevronRightIcon />
        </Box>
      </ListItemButton>
    </ListItem>
  );
}
