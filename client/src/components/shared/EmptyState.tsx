import { Link } from 'react-router-dom';
import PawStamp from './PawStamp';
import styles from './EmptyState.module.css';

interface Props {
  title: string;
  body?: string;
  action?: { label: string; to: string };
}

export default function EmptyState({ title, body, action }: Props) {
  return (
    <div className={styles.wrapper}>
      <PawStamp size={36} color="var(--color-accent-sand)" />
      <h3 className={styles.title}>{title}</h3>
      {body && <p className={styles.body}>{body}</p>}
      {action && (
        <Link to={action.to} className={styles.link}>
          {action.label} →
        </Link>
      )}
    </div>
  );
}
