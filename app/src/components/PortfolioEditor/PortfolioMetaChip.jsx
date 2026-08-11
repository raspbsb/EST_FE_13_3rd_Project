import Chip from "@mui/material/Chip";
import styles from "./PortfolioMetaChip.module.css";

export default function PortfolioMetaChip({ label, variant = "tech", onDelete }) {
  const variantClassName = variant === "category" ? styles.category : styles.tech;

  return (
    <Chip className={`${styles.chip} ${variantClassName}`} label={label} size="small" clickable onDelete={onDelete} />
  );
}
