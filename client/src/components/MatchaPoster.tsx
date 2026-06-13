import { useRef, useEffect } from 'react';
import EditorialKicker from './shared/EditorialKicker';
import styles from './MatchaPoster.module.css';

export default function MatchaPoster() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible');
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={`${styles.section} reveal-section`}>

      <div className={styles.textCol}>
        <EditorialKicker number="02" label="matcha origin" />

        <h2 className={styles.heading}>
          Grown in shade, ground in stone.
        </h2>

        <p className={styles.body}>
          Our matcha comes from Uji, the region south of Kyoto that has produced
          Japan's finest green tea for over 800 years. Weeks before harvest, the
          tea plants are covered to block direct sunlight. Shade forces the leaves
          to produce more chlorophyll and L-theanine, which gives ceremonial matcha
          its vivid color, deep umami, and the calm, sustained focus it is known for.
        </p>

        <p className={styles.body}>
          Only the youngest leaves from the first spring harvest (ichiban-cha) make
          the cut. They're dried flat, never rolled, then slowly stone-ground in
          granite mills that turn just fast enough to keep the leaves cool. Heat
          destroys flavor. Patience preserves it.
        </p>

        <div className={styles.specs}>
          {[
            { label: 'origin',    value: 'Uji, Kyoto prefecture' },
            { label: 'harvest',   value: 'First flush, May' },
            { label: 'process',   value: 'Shade-grown, stone-ground' },
            { label: 'grade',     value: 'Ceremonial, ichiban-cha' },
          ].map(s => (
            <div key={s.label} className={styles.specRow}>
              <span className={styles.specLabel}>{s.label}</span>
              <span className={styles.specValue}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.imgCol}>
        <img
          src="/boba/cer_matcha.png"
          alt="Ceremonial grade matcha being prepared"
          className={styles.img}
          loading="lazy"
        />
      </div>

    </section>
  );
}
