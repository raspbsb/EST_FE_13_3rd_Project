import Chip from '@mui/material/Chip';
// import styles from './TagChip.module.css';

export default function TagChip({ label }) {
  return <Chip label={label} className={styles.tagChip} />;
}
