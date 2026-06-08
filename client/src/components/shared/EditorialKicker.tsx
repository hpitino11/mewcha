import styles from './EditorialKicker.module.css';

interface Props {
  number?: string;
  label: string;
  className?: string;
}

export default function EditorialKicker({ number, label, className }: Props) {
  return (
    <div className={`${styles.kicker} ${className ?? ''}`}>
      {number && <span className={styles.num}>{number}</span>}
      {number && <span className={styles.slash}>/</span>}
      <span className={styles.label}>{label}</span>
    </div>
  );
}
