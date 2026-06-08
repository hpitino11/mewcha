import { useState, useEffect } from 'react';
import styles from './IntroAnimation.module.css';

interface Props {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: Props) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    const holdTimer  = setTimeout(() => setPhase('hold'), 1050);
    const exitTimer  = setTimeout(() => setPhase('out'),  1150);
    const doneTimer  = setTimeout(onComplete,              1650);
    return () => { clearTimeout(holdTimer); clearTimeout(exitTimer); clearTimeout(doneTimer); };
  }, [onComplete]);

  return (
    <div
      className={`${styles.overlay} ${phase === 'out' ? styles.exiting : ''}`}
      aria-hidden="true"
    >
      <div className={styles.stage}>
        {/* Cup SVG */}
        <svg
          viewBox="0 0 120 180"
          className={styles.cup}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="intro-cup-clip">
              <polygon points="22,52 98,52 85,165 35,165" />
            </clipPath>
          </defs>

          {/* Straw */}
          <rect
            x="53" y="5" width="8" height="50" rx="4"
            fill="#b7b7a4"
            className={styles.cupPart}
          />

          {/* Lid */}
          <rect
            x="12" y="37" width="96" height="16" rx="8"
            fill="#d4c7b0"
            stroke="#b7b7a4" strokeWidth="0.75"
            className={styles.cupPart}
          />

          {/* Cup body */}
          <polygon
            points="18,52 102,52 88,168 32,168"
            fill="#f5f0ea"
            stroke="#b7b7a4" strokeWidth="1"
            className={styles.cupPart}
          />

          {/* Bottom */}
          <ellipse
            cx="60" cy="168" rx="28" ry="5"
            fill="#e8e0d8"
            stroke="#b7b7a4" strokeWidth="0.75"
            className={styles.cupPart}
          />

          {/* Liquid fill — clipped to cup interior */}
          <rect
            x="0" y="0" width="120" height="180"
            fill="#8aaa94"
            clipPath="url(#intro-cup-clip)"
            className={styles.liquid}
          />

          {/* Liquid surface shimmer */}
          <ellipse
            cx="60" cy="52" rx="32" ry="3.5"
            fill="rgba(255,255,255,0.22)"
            clipPath="url(#intro-cup-clip)"
            className={styles.liquidShimmer}
          />
        </svg>

        {/* Wordmark */}
        <span className={styles.wordmark}>mewcha</span>
      </div>
    </div>
  );
}
