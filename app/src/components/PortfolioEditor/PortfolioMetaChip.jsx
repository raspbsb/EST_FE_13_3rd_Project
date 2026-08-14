import Chip from "@mui/material/Chip";
import styles from "./PortfolioMetaChip.module.css";

export default function PortfolioMetaChip({ label, variant = "tech", onDelete }) {
  // 카테고리/기술 스택 칩은 같은 컴포넌트를 쓰고 variant에 따라 색상만 다르게 적용한다.
  const variantClassName = variant === "category" ? styles.category : styles.tech;

  return (
    <Chip
      className={`${styles.chip} ${variantClassName}`}
      label={label}
      size="small"
      clickable
      aria-label={`${label} 삭제 가능`}
      onDelete={onDelete}
    />
  );
}
