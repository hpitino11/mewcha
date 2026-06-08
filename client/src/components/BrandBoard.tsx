import PawStamp from './shared/PawStamp';
import styles from './BrandBoard.module.css';

export default function BrandBoard() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.sectionLabel}>
          <span className={styles.num}>03</span>
          <span className={styles.slash}>/</span>
          <span className={styles.label}>identity</span>
        </div>

        <div className={styles.grid}>
          {/* Wordmark card */}
          <div className={`${styles.card} ${styles.cardWordmark}`}>
            <PawStamp size={18} color="var(--color-accent)" />
            <span className={styles.wordmark}>mewcha</span>
            <span className={styles.wordmarkSub}>neko café · portland</span>
          </div>

          {/* Typography card */}
          <div className={`${styles.card} ${styles.cardType}`}>
            <span className={styles.bigAa}>Aa</span>
            <span className={styles.typeName}>Fraunces</span>
          </div>

          {/* Color swatches card */}
          <div className={`${styles.card} ${styles.cardSwatches}`}>
            <div className={styles.swatches}>
              <div className={styles.swatch} style={{ background: '#3f4238' }} title="kombu" />
              <div className={styles.swatch} style={{ background: '#6b705c' }} title="moss" />
              <div className={styles.swatch} style={{ background: '#a5a58d' }} title="sage" />
              <div className={styles.swatch} style={{ background: '#cb997e' }} title="clay" />
              <div className={styles.swatch} style={{ background: '#ffe8d6' }} title="bone" />
            </div>
            <span className={styles.swatchLabel}>palette</span>
          </div>

          {/* Paw card */}
          <div className={`${styles.card} ${styles.cardPaw}`}>
            <PawStamp size={48} color="rgba(255,232,214,0.15)" />
            <span className={styles.pawLabel}>neko café</span>
          </div>

          {/* Quote card — large */}
          <div className={`${styles.card} ${styles.cardQuote}`}>
            <span className={styles.quoteText}>slow sips,<br /><em>soft rituals</em></span>
          </div>

          {/* Matcha texture card */}
          <div className={`${styles.card} ${styles.cardMatcha}`}>
            <span className={styles.matchaLabel}>抹茶</span>
            <span className={styles.matchaSub}>matcha</span>
          </div>

          {/* Cup card */}
          <div className={`${styles.card} ${styles.cardCup}`}>
            <svg viewBox="0 0 160 220" className={styles.miniCup} aria-hidden="true">
              <defs>
                <clipPath id="bb-clip">
                  <polygon points="22,74 138,74 122,206 38,206" />
                </clipPath>
              </defs>
              <rect x="72" y="0" width="10" height="82" rx="5" fill="#b7b7a4" opacity="0.6" />
              <rect x="12" y="56" width="136" height="20" rx="10" fill="#c8bfb0" />
              <polygon points="18,74 142,74 126,208 34,208" fill="#d8d0c5" />
              <ellipse cx="80" cy="208" rx="46" ry="7" fill="#c8bfb0" />
              <g clipPath="url(#bb-clip)">
                <rect x="0" y="0" width="160" height="220" fill="#6b705c" />
                <rect x="0" y="0" width="160" height="40" fill="rgba(255,232,214,0.22)" />
                <circle cx="44"  cy="196" r="8.5" fill="#2e3028" />
                <circle cx="62"  cy="200" r="8.5" fill="#2e3028" />
                <circle cx="80"  cy="197" r="8.5" fill="#2e3028" />
                <circle cx="98"  cy="201" r="8.5" fill="#2e3028" />
                <circle cx="116" cy="196" r="8.5" fill="#2e3028" />
              </g>
              <polygon points="18,74 142,74 126,208 34,208" fill="none" stroke="#b7b7a4" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Label card */}
          <div className={`${styles.card} ${styles.cardLabel}`}>
            <span className={styles.labelText}>matcha</span>
            <span className={styles.labelDot}>·</span>
            <span className={styles.labelText}>boba</span>
            <span className={styles.labelDot}>·</span>
            <span className={styles.labelText}>coffee</span>
          </div>
        </div>
      </div>
    </section>
  );
}
