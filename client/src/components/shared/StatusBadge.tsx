import styles from './StatusBadge.module.css';

type Status = 'pending' | 'in_progress' | 'ready' | 'completed' | 'bestseller' | 'seasonal' | 'neko-pick';

const LABELS: Record<Status, string> = {
  pending:     'Pending',
  in_progress: 'In Progress',
  ready:       'Ready',
  completed:   'Completed',
  bestseller:  'Bestseller',
  seasonal:    'Seasonal',
  'neko-pick': 'Neko Pick',
};

interface Props {
  status: Status;
  className?: string;
}

export default function StatusBadge({ status, className }: Props) {
  return (
    <span className={`${styles.badge} ${styles[status.replace('-', '_') as keyof typeof styles]} ${className ?? ''}`}>
      {LABELS[status]}
    </span>
  );
}
