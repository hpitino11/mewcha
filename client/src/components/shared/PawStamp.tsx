interface Props {
  size?: number;
  color?: string;
  className?: string;
  label?: string;
}

export default function PawStamp({ size = 24, color = 'var(--color-accent)', className, label }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill={color}
      aria-label={label ?? 'Mewcha paw stamp'}
      className={className}
      role="img"
    >
      <ellipse cx="16" cy="21" rx="7.5" ry="6.5" />
      <circle cx="8"  cy="14" r="3.5" />
      <circle cx="24" cy="14" r="3.5" />
      <circle cx="11" cy="8"  r="2.75" />
      <circle cx="21" cy="8"  r="2.75" />
    </svg>
  );
}
