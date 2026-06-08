import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { MenuItem } from '../types';
import EditorialKicker from '../components/shared/EditorialKicker';
import PawStamp from '../components/shared/PawStamp';
import MatchaPoster from '../components/MatchaPoster';
import BrandBoard from '../components/BrandBoard';
import MenuPreview from '../components/MenuPreview';
import { useReveal, useStaggerReveal } from '../hooks/useReveal';
import styles from './Landing.module.css';

const FEATURED_IDS = [5, 6, 1];
const MARQUEE_WORDS = ['matcha', 'hojicha', 'boba', 'taro', 'lychee', 'mewcha', 'ritual', 'coffee'];

/* Always-visible featured data — renders immediately, no skeletons */
const STATIC_FEATURED: MenuItem[] = [
  { id: 1, category_id: 1, name: 'Ceremonial Matcha Latte', description: 'Stone-ground ceremonial grade matcha with steamed oat milk. Earthy, smooth, and beautifully green.', base_price: '6.50', image_url: null, is_available: true, is_seasonal: false, is_bestseller: true,  category_name: 'Matcha',  category_slug: 'matcha'  },
  { id: 5, category_id: 1, name: 'Brown Sugar Matcha',      description: 'House-made brown sugar syrup, ceremonial matcha, boba pearls, and a velvety oat milk foam.',        base_price: '6.75', image_url: null, is_available: true, is_seasonal: true,  is_bestseller: false, category_name: 'Matcha',  category_slug: 'matcha'  },
  { id: 6, category_id: 2, name: 'Hojicha Milk Tea',        description: 'Roasted hojicha with creamy oat milk, a touch of honey sweetness, and a warm toasty finish.',       base_price: '5.75', image_url: null, is_available: true, is_seasonal: false, is_bestseller: false, category_name: 'Hojicha', category_slug: 'hojicha' },
];

const DRINK_TAGS: Record<number, string[]> = {
  1: ['oat milk', 'ceremonial', 'bestseller'],
  5: ['boba', 'brown sugar', 'seasonal'],
  6: ['roasted', 'warm', 'oat milk'],
};

const LIQUID_COLOR: Record<string, string> = {
  matcha:  '#86ad96',
  hojicha: '#c09055',
  boba:    '#c4966a',
  coffee:  '#8a6040',
};

export default function Landing() {
  const { data: allItems } = useQuery({
    queryKey: ['menu'],
    queryFn: () => api.menu.list(),
  });

  const featured: MenuItem[] = allItems
    ? (FEATURED_IDS.map(id => allItems.find(i => i.id === id)).filter(Boolean) as MenuItem[])
    : STATIC_FEATURED;

  const featuredRef  = useReveal(0);
  const featCardsRef = useStaggerReveal(3, 120);
  const ritualRef    = useReveal(0);

  return (
    <main className={styles.page}>

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className={styles.hero}>
        {/* Dark olive panel — with layered brand details */}
        <div className={styles.heroPanel} aria-hidden="true">
          <div className={styles.heroPanelBgWord}>MATCHA</div>
          <div className={styles.heroPanelLines}>
            <span /><span /><span />
          </div>
          <div className={styles.heroPanelVertLabel}>neko café · portland, or · est. 2021</div>
        </div>

        {/* Faint oversized word — cream side */}
        <div className={styles.heroBgWord} aria-hidden="true">RITUAL</div>

        <div className={styles.heroInner}>
          {/* ── Left: copy ── */}
          <div className={styles.heroContent}>
            <EditorialKicker label="shade-grown · made to order" className={styles.heroKicker} />

            <h1 className={styles.heroHeading}>
              Soft tea,<br />slow coffee,<br /><em>a little mew.</em>
            </h1>

            <p className={styles.heroSub}>
              Earthy matcha, cloud-soft milk tea, and boba made to order
              in a quiet Portland corner.
            </p>

            <div className={styles.heroCta}>
              <Link to="/menu" className={styles.btnBuild}>
                Order now
                <span className={styles.btnArrow} aria-hidden="true">→</span>
              </Link>
              <Link to="/menu" className={styles.btnGhost}>view full menu</Link>
            </div>

            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}>
                <PawStamp size={10} color="var(--color-accent)" />
                neko café · portland, or
              </span>
              <span className={styles.heroMetaDot} aria-hidden="true">·</span>
              <span className={styles.heroMetaItem}>mon–sun 8am–7pm</span>
            </div>
          </div>

          {/* ── Right: product composition ── */}
          <div className={styles.heroVisual}>

            {/* Mini menu ticket */}
            <div className={styles.heroMiniMenu} aria-hidden="true">
              <div className={styles.miniMenuHead}>MATCHA</div>
              <div className={styles.miniMenuDash}>— — — — — —</div>
              <div className={styles.miniMenuItems}>
                <div className={styles.miniMenuRow}><span>ceremonial latte</span><span>6.50</span></div>
                <div className={styles.miniMenuRow}><span>hojicha cold brew</span><span>6.25</span></div>
                <div className={styles.miniMenuRow}><span>strawberry lychee</span><span>6.75</span></div>
              </div>
            </div>

            {/* Product card */}
            <div className={styles.heroCupCard}>

              <div className={styles.cupCardTop}>
                <div className={styles.cupCardTopMeta}>
                  <span className={styles.cupCardNum}>#023</span>
                  <span className={styles.cupCardTagLine}>today's ritual</span>
                </div>
                <span className={styles.nekoBadge}>NEKO PICK</span>
              </div>

              <div className={styles.heroCupPreview}>
                <svg
                  viewBox="0 0 160 220"
                  className={styles.heroCupSvg}
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <defs>
                    <clipPath id="hero-cup-clip">
                      <polygon points="22,74 138,74 122,206 38,206" />
                    </clipPath>
                  </defs>
                  {/* Drop shadow */}
                  <ellipse cx="80" cy="218" rx="42" ry="5" fill="rgba(0,0,0,0.10)" />
                  {/* Cup body */}
                  <polygon points="18,74 142,74 126,208 34,208" fill="#cec6bb" />
                  <ellipse cx="80" cy="208" rx="46" ry="8" fill="#bfb8ae" />
                  {/* Liquid + internals */}
                  <g clipPath="url(#hero-cup-clip)">
                    <rect x="0" y="0" width="160" height="220" fill="#4e5a3a" />
                    {/* Foam ring at top */}
                    <ellipse cx="80" cy="74" rx="58" ry="7" fill="#7e8f61" opacity="0.55" />
                    <ellipse cx="80" cy="74" rx="50" ry="4" fill="rgba(255,255,255,0.07)" />
                    {/* Ice cubes */}
                    <rect x="28" y="100" width="22" height="18" rx="3" fill="rgba(255,255,255,0.22)" transform="rotate(-10,39,109)" />
                    <rect x="62" y="90" width="18" height="16" rx="3" fill="rgba(255,255,255,0.17)" transform="rotate(6,71,98)" />
                    <rect x="88" y="103" width="20" height="17" rx="3" fill="rgba(255,255,255,0.19)" transform="rotate(-5,98,111)" />
                    {/* Sleeve band */}
                    <rect x="22" y="130" width="116" height="26" rx="1" fill="rgba(63,66,56,0.42)" />
                    <rect x="26" y="136" width="48" height="8" rx="1" fill="rgba(255,255,255,0.04)" />
                    {/* Boba pearls */}
                    {([
                      {cx:40,cy:194},{cx:57,cy:199},{cx:76,cy:194},
                      {cx:96,cy:199},{cx:113,cy:193},
                    ] as {cx:number;cy:number}[]).map((p,i) => (
                      <g key={i}>
                        <circle cx={p.cx} cy={p.cy} r="9.5" fill="#211d12" />
                        <circle cx={p.cx-2.5} cy={p.cy-3} r="2.5" fill="rgba(255,255,255,0.08)" />
                      </g>
                    ))}
                  </g>
                  {/* Cup outline */}
                  <polygon points="18,74 142,74 126,208 34,208" fill="none" stroke="#b5ada4" strokeWidth="1.5" strokeLinejoin="round" />
                  <line x1="18" y1="74" x2="142" y2="74" stroke="#b5ada4" strokeWidth="1" />
                  {/* Lid dome */}
                  <path d="M12,60 Q80,46 148,60 L148,74 Q80,58 12,74 Z" fill="#c8bfb0" />
                  <path d="M12,60 Q80,46 148,60 L148,66 Q80,52 12,66 Z" fill="rgba(255,255,255,0.11)" />
                  {/* Straw */}
                  <rect x="72" y="0" width="10" height="76" rx="5" fill="#a5a58d" />
                  <rect x="72" y="0" width="4" height="76" rx="2" fill="rgba(255,255,255,0.18)" />
                </svg>
              </div>

              {/* Product label */}
              <div className={styles.cupCardLabel}>
                <div className={styles.cupCardLabelLeft}>
                  <span className={styles.cupCardName}>Ceremonial Matcha</span>
                  <span className={styles.cupCardIngredients}>shade-grown · cloud milk · 50% sweet</span>
                </div>
                <span className={styles.cupCardPrice}>$6.50</span>
              </div>

              {/* Footer strip — doubles as CTA */}
              <Link to="/menu/1" className={styles.cupCardFooter}>
                <span className={styles.cupCardFooterText}>ceremonial grade · uji style · made to order</span>
                <span className={styles.cupCardFooterCta}>customize →</span>
              </Link>

            </div>

            {/* Mini receipt */}
            <div className={styles.heroMiniReceipt} aria-hidden="true">
              <div className={styles.miniReceiptHead}>
                <span>ORDER</span><span>#023</span>
              </div>
              <div className={styles.miniReceiptDash}>— — — — — —</div>
              <div className={styles.miniReceiptRows}>
                <span>matcha latte</span>
                <span>boba pearls</span>
                <span>50% sweet</span>
              </div>
              <div className={styles.miniReceiptDash}>— — — — — —</div>
              <div className={styles.miniReceiptFooter}>pickup 8:42 ♡</div>
            </div>

            {/* Neko approved sticker */}
            <div className={styles.heroSticker} aria-hidden="true">
              <span className={styles.heroStickerLine}>neko</span>
              <span className={styles.heroStickerDivider}>✦</span>
              <span className={styles.heroStickerLine}>approved</span>
            </div>

            {/* Vertical label */}
            <div className={styles.heroVertLabel} aria-hidden="true">
              <span>shade-grown matcha · made to order</span>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MARQUEE
      ═══════════════════════════════════════════ */}
      <div className={styles.marqueeWrap} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, i) => (
            <span key={i} className={styles.marqueeItem}>
              <span className={styles.marqueeDot} />
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          01 / FEATURED DRINKS
      ═══════════════════════════════════════════ */}
      <section
        ref={featuredRef as React.RefObject<HTMLElement>}
        className={`${styles.featured} reveal-section`}
      >
        <div className={styles.featuredInner}>
          <div className={styles.featuredHead}>
            <EditorialKicker number="01" label="featured" className={styles.kickerLight} />
            <h2 className={styles.featuredTitle}>
              What we're<br /><em>known for.</em>
            </h2>
            <p className={styles.featuredSub}>
              Three drinks that define us — each built to order.
            </p>
          </div>

          <div
            ref={featCardsRef as React.RefObject<HTMLDivElement>}
            className={styles.featuredGrid}
          >
            {featured.map((item, i) => <FeaturedCard key={item.id} item={item} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          02 / MATCHA POSTER
      ═══════════════════════════════════════════ */}
      <MatchaPoster />

      {/* ═══════════════════════════════════════════
          03 / BRAND BOARD
      ═══════════════════════════════════════════ */}
      <BrandBoard />

      {/* ═══════════════════════════════════════════
          04 / MENU PREVIEW
      ═══════════════════════════════════════════ */}
      <MenuPreview />

      {/* ═══════════════════════════════════════════
          05 / RITUAL
      ═══════════════════════════════════════════ */}
      <section
        ref={ritualRef as React.RefObject<HTMLElement>}
        className={`${styles.ritual} reveal-section`}
      >
        <div className={styles.ritualInner}>
          <div className={styles.ritualText}>
            <EditorialKicker number="05" label="our way" />
            <h2 className={styles.ritualTitle}>
              More than a cup —<br /><em>a ritual.</em>
            </h2>
            <p className={styles.ritualBody}>
              We built Mewcha as a quiet place to slow down. Every drink is made
              to order with ingredients we actually care about. No rush, no noise —
              just you, your drink, and whatever you brought to read.
            </p>

            <div className={styles.pillars}>
              {[
                { n: '01', title: 'Sourced with care',  body: 'Ceremonial-grade matcha, single-origin espresso, and locally-foraged syrups.' },
                { n: '02', title: 'Made to order',      body: 'Every size, ice level, sweetness, and topping — exactly how you want it.' },
                { n: '03', title: 'Cat-approved',       body: 'Our resident cats Mochi and Soba have been quality-testing since day one.' },
                { n: '04', title: 'Seasonal menu',      body: 'We rotate offerings with the seasons. Always something worth returning for.' },
              ].map(p => (
                <div key={p.title} className={styles.pillar}>
                  <span className={styles.pillarNum}>{p.n}</span>
                  <span className={styles.pillarTitle}>{p.title}</span>
                  <p className={styles.pillarBody}>{p.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.quotePanel}>
            <div className={styles.quoteMark} aria-hidden="true">"</div>
            <blockquote className={styles.quoteText}>
              where every sip<br />is a small<br /><em>ceremony</em>
            </blockquote>
            <div className={styles.quoteDivider} />
            <p className={styles.quoteCredit}>— the mewcha way</p>

            <div className={styles.quoteDetails}>
              {[
                { n: '01', label: 'origin', val: 'Uji, Japan' },
                { n: '02', label: 'since',  val: '2021' },
                { n: '03', label: 'cats',   val: 'Mochi + Soba' },
              ].map(d => (
                <div key={d.n} className={styles.quoteDetailRow}>
                  <span className={styles.quoteDetailNum}>{d.n}</span>
                  <span className={styles.quoteDetailLabel}>{d.label}</span>
                  <span className={styles.quoteDetailVal}>{d.val}</span>
                </div>
              ))}
            </div>

            <div className={styles.quotePaws}>
              <PawStamp size={14} color="rgba(255,232,214,0.2)" />
              <PawStamp size={10} color="rgba(255,232,214,0.12)" />
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

/* ─────────────────────────────────── */

function FeaturedCard({ item, index }: { item: MenuItem; index: number }) {
  const isLarge = index === 0;
  const isOlive = index === 0;

  const BADGES: Record<number, string> = { 0: 'NEKO PICK', 1: 'HOUSE FAVORITE', 2: 'SEASONAL' };

  return (
    <Link
      to={`/menu/${item.id}`}
      className={`${styles.featCard} ${isLarge ? styles.featCardLarge : ''} ${isOlive ? styles.featCardOlive : ''}`}
      data-stagger=""
    >
      {BADGES[index] && (
        <span className={`${styles.featBadge} ${isOlive ? styles.featBadgeLight : ''}`}>
          {BADGES[index]}
        </span>
      )}

      <div className={styles.featCardContent}>
        <div className={styles.featCatRow}>
          <span
            className={styles.featLiquidDot}
            style={{ background: LIQUID_COLOR[item.category_slug] ?? '#a5a58d' }}
          />
          <span className={`${styles.featCat} ${isOlive ? styles.featCatLight : ''}`}>
            {item.category_name}
          </span>
        </div>
        <h3 className={`${styles.featName} ${isOlive ? styles.featNameLight : ''}`}>
          {item.name}
        </h3>
        <p className={`${styles.featDesc} ${isOlive ? styles.featDescLight : ''}`}>
          {item.description}
        </p>
        {(DRINK_TAGS[item.id] ?? []).length > 0 && (
          <div className={styles.featTagList}>
            {(DRINK_TAGS[item.id] ?? []).map(tag => (
              <span
                key={tag}
                className={`${styles.featTag} ${isOlive ? styles.featTagOlive : ''}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={styles.featCardFooter}>
        <span className={`${styles.featPrice} ${isOlive ? styles.featPriceLight : ''}`}>
          ${parseFloat(item.base_price).toFixed(2)}
        </span>
        <span className={`${styles.featCta} ${isOlive ? styles.featCtaLight : ''}`}>
          <PawStamp
            size={11}
            color={isOlive ? 'rgba(255,232,214,0.5)' : 'var(--color-accent)'}
            className={styles.featPaw}
          />
          customize
        </span>
      </div>
    </Link>
  );
}

function SkeletonCard({ index }: { index: number }) {
  const isLarge = index === 0;
  return (
    <div
      className={`${styles.featCard} ${isLarge ? styles.featCardLarge : ''} ${index === 0 ? styles.featCardOlive : ''}`}
      data-stagger=""
      style={{ pointerEvents: 'none' }}
    >
      <div className={styles.featCardContent}>
        <div className={styles.skel} style={{ height: 10, width: '30%', marginBottom: 14 }} />
        <div className={styles.skel} style={{ height: 26, width: '75%', marginBottom: 10 }} />
        <div className={styles.skel} style={{ height: 12, width: '90%', marginBottom: 6 }} />
        <div className={styles.skel} style={{ height: 12, width: '65%' }} />
      </div>
    </div>
  );
}

import type React from 'react';
