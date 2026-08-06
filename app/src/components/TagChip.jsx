import Chip from '@mui/material/Chip';
import styles from './TagChip.module.scss';

export default function TagChip({ label, color = 'primary', onDelete }) {
  return <Chip label={label} color={color} onDelete={onDelete} className={styles['tag-chip']} />;
}
