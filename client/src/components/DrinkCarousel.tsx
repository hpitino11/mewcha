import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, type TargetAndTransition, type Variants } from 'framer-motion';
import styles from './DrinkCarousel.module.css';

interface Drink {
  name:        string;
  label:       string;
  tagline:     string;
  description: string;
  image:       string;
  bg:          string;
  accent:      string;
  price:       string;
  link:        string;
  stamp?:      string;
}

const DRINKS: Drink[] = [
  {
    name:        'Ceremonial Matcha',
    label:       'signature',
    tagline:     'stone-ground · oat milk · earthy finish',
    description: 'Stone-ground ceremonial grade matcha with steamed oat milk. Earthy, smooth, and beautifully green.',
    image:       '/boba/matcha.png',
    bg:          '#3d4830',
    accent:      '#8fc47c',
    price:       '6.50',
    link:        '/menu/1',
    stamp:       'neko pick',
  },
  {
    name:        'Classic Milk Tea',
    label:       'timeless',
    tagline:     'black tea · whole milk · boba',
    description: 'Strong black tea softened with whole milk and lightly sweetened. The one that started it all.',
    image:       '/boba/milk_tea.png',
    bg:          '#2e2318',
    accent:      '#d4b896',
    price:       '5.50',
    link:        '/menu/7',
  },
  {
    name:        'Taro Milk Tea',
    label:       'earthy',
    tagline:     'taro root · oat milk · boba pearls',
    description: 'Creamy taro root blended with oat milk and chewy boba pearls. Subtly sweet with a nutty, floral depth.',
    image:       '/boba/taro.png',
    bg:          '#3b2e4a',
    accent:      '#c4a8e0',
    price:       '6.50',
    link:        '/menu/2',
    stamp:       'seasonal',
  },
  {
    name:        'Brown Sugar Boba',
    label:       'classic',
    tagline:     'brown sugar · boba pearls · milk foam',
    description: 'Slow-caramelized brown sugar, ceremonial matcha, chewy tapioca pearls, and a velvety oat milk foam.',
    image:       '/boba/brown_sugar.png',
    bg:          '#3a2215',
    accent:      '#ddbea9',
    price:       '6.75',
    link:        '/menu/5',
    stamp:       'house favorite',
  },
  {
    name:        'Strawberry Boba',
    label:       'fruity',
    tagline:     'fresh strawberry · milk tea · boba',
    description: 'Fresh strawberry, creamy milk tea base, and chewy tapioca pearls. Bright, sweet, and refreshing.',
    image:       '/boba/strawberry.png',
    bg:          '#5c2d38',
    accent:      '#d48a96',
    price:       '6.25',
    link:        '/menu/3',
  },
  {
    name:        'Thai Milk Tea',
    label:       'roasted',
    tagline:     'thai tea · condensed milk · bold spice',
    description: 'Bold, spiced Thai tea with creamy condensed milk and a warm amber finish that lingers.',
    image:       '/boba/thai_tea.png',
    bg:          '#4a3020',
    accent:      '#c09055',
    price:       '5.75',
    link:        '/menu/6',
  },
  {
    name:        'Honeydew Boba',
    label:       'fresh',
    tagline:     'honeydew · milk tea · boba',
    description: 'Light and cooling honeydew blended into a silky milk tea base with chewy boba. Summer in a cup.',
    image:       '/boba/honeydew.png',
    bg:          '#2a3d2e',
    accent:      '#a8d4a0',
    price:       '6.00',
    link:        '/menu/4',
  },
  {
    name:        'Coffee Boba',
    label:       'bold',
    tagline:     'cold brew · oat milk · boba pearls',
    description: 'Cold brew coffee meets creamy oat milk with chewy boba pearls. Rich, smooth, and a little unexpected.',
    image:       '/boba/coffee.png',
    bg:          '#1e1810',
    accent:      '#c8a96e',
    price:       '6.75',
    link:        '/menu/8',
  },
];

/* ── Slot helpers ────────────────────────────────────── */
function getSlot(idx: number, active: number, total: number): number {
  const raw = ((idx - active) % total + total) % total;
  return raw > Math.floor(total / 2) ? raw - total : raw;
}

function slotAnimate(slot: number): TargetAndTransition {
  if (slot === 0)  return { x: '12vw',  y: '-8vh',  scale: 1.00, opacity: 1,    zIndex: 5 };
  if (slot === 1)  return { x: '30vw',  y: '-3vh',  scale: 0.62, opacity: 0.60, zIndex: 4 };
  if (slot === 2)  return { x: '42vw',  y: '0vh',   scale: 0.38, opacity: 0.36, zIndex: 3 };
  if (slot === -1) return { x: '-12vw', y: '-3vh',  scale: 0.62, opacity: 0,    zIndex: 4 };
  if (slot === -2) return { x: '-24vw', y: '0vh',   scale: 0.38, opacity: 0,    zIndex: 3 };
  const side = slot < 0 ? -1 : 1;
  return { x: `${side * 72}vw`, y: '0vh', scale: 0.10, opacity: 0, zIndex: 1 };
}

const CUP_SPRING = { type: 'spring', stiffness: 210, damping: 28, mass: 0.85 } as const;

const textVar: Variants = {
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0,   transition: { duration: 0.52, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.26, ease: [0.4, 0, 1, 1]    as [number, number, number, number] } },
};

/* ── Component ───────────────────────────────────────── */
export default function DrinkCarousel() {
  const [active, setActive] = useState(0);
  const total = DRINKS.length;

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setActive(i => (i + 1 + total) % total), 10000);
  }, [total]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const go   = useCallback((dir: number) => { setActive(i => (i + dir + total) % total); resetTimer(); }, [total, resetTimer]);
  const goTo = useCallback((idx: number) => { setActive(idx); resetTimer(); }, [resetTimer]);

  const drink  = DRINKS[active];
  const padded = (n: number) => String(n).padStart(2, '0');

  return (
    <motion.section
      className={styles.hero}
      animate={{ backgroundColor: drink.bg }}
      transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.noise} aria-hidden="true" />

      {/* ════ Right: image carousel — absolutely fills the right half of hero ════ */}
      <div className={styles.cupsCol} aria-hidden="true">
        <div className={styles.cupsTrack}>
          {DRINKS.map((d, i) => {
            const slot     = getSlot(i, active, total);
            const isActive = slot === 0;
            return (
              <motion.div
                key={i}
                className={styles.cupSlot}
                animate={slotAnimate(slot)}
                transition={CUP_SPRING}
                onClick={() => !isActive && goTo(i)}
                style={{ cursor: isActive ? 'default' : undefined }}
              >
                <img
                  src={d.image}
                  alt={d.name}
                  className={styles.drinkImg}
                  draggable={false}
                  loading={Math.abs(slot) <= 1 ? 'eager' : 'lazy'}
                  fetchPriority={slot === 0 ? 'high' : 'auto'}
                />
              </motion.div>
            );
          })}

        </div>
      </div>

      <div className={styles.inner}>

        {/* ════ Left: editorial text ════ */}
        <div className={styles.textCol}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              variants={textVar}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.textContent}
            >
              <div className={styles.counter}>
                <span style={{ color: drink.accent }}>{padded(active + 1)}</span>
                <span className={styles.counterRule} />
                <span>{padded(total)}</span>
              </div>

              <span
                className={styles.drinkLabel}
                style={{ color: drink.accent, borderColor: `${drink.accent}50` }}
              >
                {drink.label}
              </span>

              <h1 className={styles.heading}>{drink.name}</h1>

              <p className={styles.tagline} style={{ color: `${drink.accent}bb` }}>
                {drink.tagline}
              </p>

              <div className={styles.descRow}>
                <p className={styles.description}>{drink.description}</p>
                {drink.stamp && (
                  <motion.div
                    key={`stamp-${active}`}
                    className={styles.drinkStamp}
                    initial={{ opacity: 0, rotate: -22, scale: 0.6 }}
                    animate={{ opacity: 1, rotate: -14, scale: 1 }}
                    exit={{ opacity: 0, rotate: -8, scale: 0.75 }}
                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span>{drink.stamp}</span>
                  </motion.div>
                )}
              </div>

              <div className={styles.actions}>
                <span className={styles.price} style={{ color: drink.accent }}>
                  ${drink.price}
                </span>
                <Link
                  to={drink.link}
                  className={styles.btnPrimary}
                  style={{ backgroundColor: drink.accent, color: drink.bg }}
                >
                  Order now <span aria-hidden="true">→</span>
                </Link>
                <Link to="/menu" className={styles.btnGhost}>
                  view menu
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className={styles.controls}>
            <button className={styles.navBtn} onClick={() => go(-1)} aria-label="Previous drink">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.75"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className={styles.dots}>
              {DRINKS.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${DRINKS[i].name}`}
                  style={i === active ? { backgroundColor: drink.accent } : undefined}
                />
              ))}
            </div>
            <button className={styles.navBtn} onClick={() => go(1)} aria-label="Next drink">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.75"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

      </div>

    </motion.section>
  );
}
