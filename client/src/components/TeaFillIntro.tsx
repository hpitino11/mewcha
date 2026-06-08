import { useState, useEffect } from 'react';
import styles from './TeaFillIntro.module.css';

interface Props {
  onComplete: () => void;
}

/* Boba pearl positions inside the cup clip area */
const PEARLS = [
  { cx: 44,  cy: 196, delay: 1200 },
  { cx: 62,  cy: 200, delay: 1270 },
  { cx: 80,  cy: 197, delay: 1340 },
  { cx: 98,  cy: 201, delay: 1410 },
  { cx: 116, cy: 196, delay: 1480 },
];

export default function TeaFillIntro({ onComplete }: Props) {
  const [phase, setPhase] = useState<'fill' | 'text' | 'exit'>('fill');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'), 1900);
    const t2 = setTimeout(() => setPhase('exit'), 2600);
    const t3 = setTimeout(onComplete,              3100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div className={`${styles.overlay} ${phase === 'exit' ? styles.exiting : ''}`} aria-hidden="true">

      {/* Cup + liquid */}
      <div className={styles.stage}>
        <svg
          viewBox="0 0 160 220"
          className={styles.cupSvg}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="tf-clip">
              {/* Interior of cup, slightly inset from outline */}
              <polygon points="22,74 138,74 122,206 38,206" />
            </clipPath>
          </defs>

          {/* ── Straw ── */}
          <rect
            x="72" y="0" width="10" height="82" rx="5"
            fill="#b7b7a4"
            opacity="0.7"
            className={styles.cupPart}
          />
          {/* Straw highlight */}
          <rect x="72" y="0" width="4" height="82" rx="2" fill="rgba(255,255,255,0.2)" className={styles.cupPart} />

          {/* ── Lid ── */}
          <rect
            x="12" y="56" width="136" height="20" rx="10"
            fill="#c8bfb0"
            className={styles.cupPart}
          />
          {/* Lid top sheen */}
          <rect x="12" y="56" width="136" height="8" rx="4" fill="rgba(255,255,255,0.12)" className={styles.cupPart} />

          {/* ── Cup body ── */}
          <polygon
            points="18,74 142,74 126,208 34,208"
            fill="#d8d0c5"
            className={styles.cupPart}
          />

          {/* ── Bottom ellipse ── */}
          <ellipse
            cx="80" cy="208" rx="46" ry="7"
            fill="#c8bfb0"
            className={styles.cupPart}
          />
          {/* Cup shadow under */}
          <ellipse cx="80" cy="218" rx="38" ry="4" fill="rgba(0,0,0,0.2)" className={styles.cupPart} />

          {/* ── Liquid fill (clipped to cup interior) ── */}
          <g clipPath="url(#tf-clip)">
            {/* Base liquid — olive */}
            <rect
              x="0" y="0" width="160" height="220"
              fill="#6b705c"
              className={styles.liquid}
            />
            {/* Cream sweetness overlay near top — makes it richer */}
            <rect
              x="0" y="0" width="160" height="40"
              fill="rgba(255,232,214,0.25)"
              className={styles.liquidFoam}
            />
            {/* Liquid surface shimmer */}
            <ellipse
              cx="80" cy="74" rx="50" ry="5"
              fill="rgba(255,255,255,0.15)"
              className={styles.liquidSurface}
            />
            {/* Boba pearls */}
            {PEARLS.map((p, i) => (
              <g key={i} style={{ '--pearl-delay': `${p.delay}ms` } as React.CSSProperties}>
                <circle
                  cx={p.cx} cy={p.cy} r="9"
                  fill="#2e3028"
                  className={styles.pearl}
                />
                <circle
                  cx={p.cx - 2.5} cy={p.cy - 2.5} r="2.5"
                  fill="rgba(255,255,255,0.12)"
                  className={styles.pearl}
                />
              </g>
            ))}
          </g>

          {/* ── Cup outline over liquid ── */}
          <polygon
            points="18,74 142,74 126,208 34,208"
            fill="none"
            stroke="#b7b7a4"
            strokeWidth="1.5"
            strokeLinejoin="round"
            className={styles.cupPart}
          />
          <line x1="18" y1="74" x2="142" y2="74" stroke="#b7b7a4" strokeWidth="1" className={styles.cupPart} />
          {/* Mewcha brand stripe on cup */}
          <polygon
            points="19,76 141,76 139,90 21,90"
            fill="rgba(203,153,126,0.18)"
            className={styles.cupStripe}
          />
        </svg>

        {/* ── Text reveal ── */}
        <div className={`${styles.textBlock} ${phase !== 'fill' ? styles.textVisible : ''}`}>
          <span className={styles.wordmark}>mewcha</span>
          <span className={styles.tagline}>build your ritual</span>
        </div>
      </div>

    </div>
  );
}
