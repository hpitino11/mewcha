import styles from './MatchaPoster.module.css';
import EditorialKicker from './shared/EditorialKicker';

export default function MatchaPoster() {
  return (
    <section className={styles.section}>
      <div className={styles.bgWord} aria-hidden="true">MATCHA</div>

      <div className={styles.inner}>
        <div className={styles.header}>
          <EditorialKicker number="02" label="matcha" />
          <p className={styles.caption}>
            ceremonial matcha · cloud milk · quiet energy
          </p>
        </div>

        <div className={styles.cups}>
          {/* Cup A — matcha */}
          <div className={styles.cupWrap}>
            <svg viewBox="0 0 160 220" className={styles.cupSvg} aria-hidden="true">
              <defs>
                <clipPath id="mp-clip-a">
                  <polygon points="22,74 138,74 122,206 38,206" />
                </clipPath>
              </defs>
              <rect x="72" y="0" width="10" height="82" rx="5" fill="#86ad96" opacity="0.75" />
              <rect x="72" y="0" width="4" height="82" rx="2" fill="rgba(255,255,255,0.2)" />
              <rect x="12" y="56" width="136" height="20" rx="10" fill="#c8bfb0" />
              <rect x="12" y="56" width="136" height="8" rx="4" fill="rgba(255,255,255,0.10)" />
              <polygon points="18,74 142,74 126,208 34,208" fill="#d8d0c5" />
              <ellipse cx="80" cy="208" rx="46" ry="7" fill="#c8bfb0" />
              <ellipse cx="80" cy="218" rx="38" ry="4" fill="rgba(0,0,0,0.10)" />
              <g clipPath="url(#mp-clip-a)">
                <rect x="0" y="0" width="160" height="220" fill="#86ad96" />
                <rect x="0" y="0" width="160" height="48" fill="rgba(255,248,240,0.30)" />
                <ellipse cx="80" cy="74" rx="52" ry="6" fill="rgba(255,255,255,0.18)" />
                <circle cx="44"  cy="196" r="9" fill="#2e3028" />
                <circle cx="62"  cy="200" r="9" fill="#2e3028" />
                <circle cx="80"  cy="197" r="9" fill="#2e3028" />
                <circle cx="98"  cy="201" r="9" fill="#2e3028" />
                <circle cx="116" cy="196" r="9" fill="#2e3028" />
              </g>
              <polygon points="18,74 142,74 126,208 34,208" fill="none" stroke="#b7b7a4" strokeWidth="1.5" strokeLinejoin="round" />
              <line x1="18" y1="74" x2="142" y2="74" stroke="#b7b7a4" strokeWidth="1" />
              <polygon points="19,76 141,76 139,90 21,90" fill="rgba(203,153,126,0.15)" />
            </svg>
            <div className={styles.cupLabel}>
              <span className={styles.cupName}>Ceremonial Matcha</span>
              <span className={styles.cupSub}>earthy · smooth · bright</span>
            </div>
          </div>

          {/* Cup B — hojicha */}
          <div className={`${styles.cupWrap} ${styles.cupWrapOffset}`}>
            <svg viewBox="0 0 160 220" className={styles.cupSvg} aria-hidden="true">
              <defs>
                <clipPath id="mp-clip-b">
                  <polygon points="22,74 138,74 122,206 38,206" />
                </clipPath>
              </defs>
              <rect x="72" y="0" width="10" height="82" rx="5" fill="#c09055" opacity="0.75" />
              <rect x="72" y="0" width="4" height="82" rx="2" fill="rgba(255,255,255,0.2)" />
              <rect x="12" y="56" width="136" height="20" rx="10" fill="#c8bfb0" />
              <rect x="12" y="56" width="136" height="8" rx="4" fill="rgba(255,255,255,0.10)" />
              <polygon points="18,74 142,74 126,208 34,208" fill="#d8d0c5" />
              <ellipse cx="80" cy="208" rx="46" ry="7" fill="#c8bfb0" />
              <ellipse cx="80" cy="218" rx="38" ry="4" fill="rgba(0,0,0,0.10)" />
              <g clipPath="url(#mp-clip-b)">
                <rect x="0" y="0" width="160" height="220" fill="#c09055" />
                <rect x="0" y="0" width="160" height="48" fill="rgba(255,248,230,0.25)" />
                <ellipse cx="80" cy="74" rx="52" ry="6" fill="rgba(255,255,255,0.14)" />
                <circle cx="44"  cy="196" r="9" fill="#2e3028" />
                <circle cx="62"  cy="200" r="9" fill="#2e3028" />
                <circle cx="80"  cy="197" r="9" fill="#2e3028" />
                <circle cx="98"  cy="201" r="9" fill="#2e3028" />
                <circle cx="116" cy="196" r="9" fill="#2e3028" />
              </g>
              <polygon points="18,74 142,74 126,208 34,208" fill="none" stroke="#b7b7a4" strokeWidth="1.5" strokeLinejoin="round" />
              <line x1="18" y1="74" x2="142" y2="74" stroke="#b7b7a4" strokeWidth="1" />
              <polygon points="19,76 141,76 139,90 21,90" fill="rgba(203,153,126,0.15)" />
            </svg>
            <div className={styles.cupLabel}>
              <span className={styles.cupName}>Hojicha Latte</span>
              <span className={styles.cupSub}>roasted · warm · toasty</span>
            </div>
          </div>
        </div>

        <div className={styles.tagStrip}>
          <span>ceremonial grade</span>
          <span className={styles.dot} aria-hidden="true">·</span>
          <span>stone ground</span>
          <span className={styles.dot} aria-hidden="true">·</span>
          <span>made to order</span>
          <span className={styles.dot} aria-hidden="true">·</span>
          <span>portland, or</span>
        </div>
      </div>
    </section>
  );
}
