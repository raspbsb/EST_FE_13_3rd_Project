import Chip from '@mui/material/Chip';
import styles from './TagChip.module.scss';

export default function TagChip({ label, color = 'primary' }) {
  return <Chip label={label} color={color} className={styles['tag-chip']} />;
}
