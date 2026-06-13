import EditorialKicker from '../components/shared/EditorialKicker';
import MatchaPoster from '../components/MatchaPoster';
import MenuPreview from '../components/MenuPreview';
import DrinkCarousel from '../components/DrinkCarousel';
import { useReveal } from '../hooks/useReveal';
import styles from './Landing.module.css';

const MARQUEE_WORDS = ['matcha', 'milk tea', 'taro', 'brown sugar', 'strawberry', 'thai tea', 'honeydew', 'coffee'];

export default function Landing() {
  const storeRef = useReveal(0);

  return (
    <main className={styles.page}>

      {/* ═══════════════════════════════════════════
          HERO — animated drink carousel
      ═══════════════════════════════════════════ */}
      <DrinkCarousel />

      {/* ═══════════════════════════════════════════
          MARQUEE
      ═══════════════════════════════════════════ */}
      <div className={styles.marqueeWrap} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, i) => (
            <span key={i} className={styles.marqueeItem}>
              <span className={styles.marqueeDot} />
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          STORE — location + in-person context
      ═══════════════════════════════════════════ */}
      <section ref={storeRef as React.RefObject<HTMLElement>} className={`${styles.store} reveal-section`}>
        <div className={styles.storeImgCol}>
          <img
            src="/boba/shop.png"
            alt="Inside Mewcha neko café, Portland"
            className={styles.storeImg}
            loading="lazy"
          />
        </div>

        <div className={styles.storeInfo}>
          <EditorialKicker number="01" label="find us" />

          <h2 className={styles.storeHeading}>
            A quiet corner<br />in Portland.
          </h2>

          <p className={styles.storeBody}>
            Mewcha sits on NW 23rd, one of Portland's most walkable streets.
            We built the space around slowness: warm light, natural wood, and
            resident cats Mochi and Soba keeping watch from the windowsill.
            No loud music. No rush. Just your drink and whatever you brought
            to read.
          </p>

          <div className={styles.storeHours}>
            {[
              { days: 'Mon – Fri', time: '8 am – 8 pm' },
              { days: 'Sat – Sun', time: '9 am – 9 pm' },
            ].map(h => (
              <div key={h.days} className={styles.storeHoursRow}>
                <span className={styles.storeHoursDays}>{h.days}</span>
                <span className={styles.storeHoursTime}>{h.time}</span>
              </div>
            ))}
          </div>

          <div className={styles.storeAddress}>
            <span>1234 NW 23rd Ave</span>
            <span>Portland, OR 97210</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MATCHA ORIGIN
      ═══════════════════════════════════════════ */}
      <MatchaPoster />

      {/* ═══════════════════════════════════════════
          03 / MENU PREVIEW
      ═══════════════════════════════════════════ */}
      <MenuPreview />


    </main>
  );
}

import type React from 'react';
