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
      <ellipse cx="16" cy="23" rx="7" ry="6" />
      <ellipse cx="7"    cy="16"   rx="2.6" ry="3.6" transform="rotate(-28 7 16)"/>
      <ellipse cx="12.5" cy="9.5"  rx="2.6" ry="3.6" transform="rotate(-8 12.5 9.5)"/>
      <ellipse cx="19.5" cy="9.5"  rx="2.6" ry="3.6" transform="rotate(8 19.5 9.5)"/>
      <ellipse cx="25"   cy="16"   rx="2.6" ry="3.6" transform="rotate(28 25 16)"/>
    </svg>
  );
}
