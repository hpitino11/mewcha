import { useId } from 'react';
import styles from './RitualCupPreview.module.css';
import type { Option } from '../types';

interface Props {
  categorySlug: string;
  itemName:     string;
  size:         Option | null;
  ice:          Option | null;
  sweetness:    Option | null;
  toppings:     Option[];
  isSeasonal?:  boolean;
  isCoffee?:    boolean;
}

function getDrinkColors(slug: string, name: string): [string, string] {
  const n = name.toLowerCase();
  if (n.includes('matcha'))      return ['#7a8070', '#525846'];
  if (n.includes('taro'))        return ['#9888aa', '#706080'];
  if (n.includes('honeydew'))    return ['#7a9268', '#527848'];
  if (n.includes('thai'))        return ['#b08040', '#886020'];
  if (n.includes('brown sugar')) return ['#a07848', '#785428'];
  if (slug === 'coffee')         return ['#806048', '#584028'];
  return ['#a89070', '#806850'];
}

function getLiquidTop(label: string | undefined): number {
  if (!label) return 132;
  if (label.startsWith('Small'))  return 164;
  if (label.startsWith('Large'))  return 102;
  return 132;
}

function getCupScale(label: string | undefined): number {
  if (!label) return 1;
  if (label.startsWith('Small'))  return 0.86;
  if (label.startsWith('Large'))  return 1.12;
  return 1;
}

function getSweetnessOpacity(label: string | undefined): number {
  if (!label) return 0.12;
  return (parseInt(label) / 100) * 0.26;
}

/* ── Topping positions — calibrated to clip "14,74 186,74 164,289 36,289" ── */

const BOBA_PEARLS = [
  { cx: 44, cy: 274, r: 7.0 }, { cx: 59, cy: 271, r: 7.5 },
  { cx: 74, cy: 275, r: 7.0 }, { cx: 89, cy: 271, r: 7.5 },
  { cx: 104, cy: 275, r: 7.0 }, { cx: 119, cy: 271, r: 7.5 },
  { cx: 134, cy: 275, r: 7.0 }, { cx: 149, cy: 271, r: 7.0 },
  { cx: 52, cy: 260, r: 6.5 }, { cx: 67, cy: 263, r: 6.0 },
  { cx: 82, cy: 259, r: 6.5 }, { cx: 97, cy: 263, r: 6.0 },
  { cx: 112, cy: 259, r: 6.5 }, { cx: 127, cy: 263, r: 6.0 },
  { cx: 143, cy: 259, r: 6.0 },
  { cx: 59, cy: 249, r: 5.5 }, { cx: 77, cy: 252, r: 5.0 },
  { cx: 95, cy: 249, r: 5.5 }, { cx: 113, cy: 252, r: 5.0 },
  { cx: 130, cy: 249, r: 5.5 },
];

const ALOE = [
  { x: 44, y: 264, w: 8, h: 18, r: -8  },
  { x: 68, y: 268, w: 7, h: 17, r:  5  },
  { x: 92, y: 263, w: 8, h: 18, r: -12 },
  { x: 116, y: 268, w: 7, h: 16, r:  8 },
  { x: 140, y: 263, w: 8, h: 18, r: -5 },
];

const RED_BEAN = [
  { cx: 46, cy: 268 }, { cx: 62, cy: 273 }, { cx: 78, cy: 268 },
  { cx: 94, cy: 272 }, { cx: 110, cy: 267 }, { cx: 126, cy: 272 },
  { cx: 54, cy: 279 }, { cx: 70, cy: 278 }, { cx: 88, cy: 280 },
];

const LYCHEE = [
  { x: 43, y: 263, r: -8  },
  { x: 67, y: 267, r:  10 },
  { x: 92, y: 263, r: -12 },
  { x: 116, y: 267, r:  6 },
  { x: 140, y: 263, r: -7 },
];

const PUDDING = [
  { x: 40,  y: 262, w: 24, h: 18 },
  { x: 68,  y: 266, w: 22, h: 16 },
  { x: 94,  y: 262, w: 25, h: 19 },
  { x: 122, y: 265, w: 22, h: 17 },
  { x: 148, y: 262, w: 23, h: 18 },
];

/* How many px each topping layer shifts upward to stack above the one below */
const LAYER_H = 20;

/* CSS transition shared by all layer wrapper <g> elements */
const LAYER_TRANSITION = 'transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)';

export default function RitualCupPreview({
  categorySlug, itemName, size, sweetness, toppings, isSeasonal, isCoffee,
}: Props) {
  const uid        = useId().replace(/:/g, '');
  const liquidTop  = getLiquidTop(size?.label);
  const scale      = getCupScale(size?.label);
  const sweetAlpha = getSweetnessOpacity(sweetness?.label);
  const [colorTop, colorBot] = getDrinkColors(categorySlug, itemName);

  const hasBoba    = toppings.some(t => t.label.toLowerCase().includes('boba'));
  const hasLychee  = toppings.some(t => t.label.toLowerCase().includes('lychee'));
  const hasRedBean = toppings.some(t => t.label.toLowerCase().includes('red bean'));
  const hasAloe    = toppings.some(t => t.label.toLowerCase().includes('aloe'));
  const hasPudding = toppings.some(t => t.label.toLowerCase().includes('pudding'));
  const showSteam  = isCoffee || categorySlug === 'coffee';

  /* ── Stacking offsets — each active layer pushes the ones above it up ── */
  let stack = 0;
  if (hasBoba)    stack++;   // boba is layer 0, counts as 1 occupied level

  const puddingY  = -(stack * LAYER_H);
  if (hasPudding) stack++;

  const redBeanY  = -(stack * LAYER_H);
  if (hasRedBean) stack++;

  const lycheeY   = -(stack * LAYER_H);
  if (hasLychee)  stack++;

  const aloeY     = -(stack * LAYER_H);

  const CX = 100;

  return (
    <div className={styles.wrapper} aria-label="Cup preview">
      <svg
        viewBox="0 0 200 300"
        className={styles.svg}
        style={{ transform: `scale(${scale})`, transformOrigin: 'center bottom' }}
        aria-hidden="true"
      >
        <defs>
          <clipPath id={`${uid}c`}>
            <polygon points="14,74 186,74 164,289 36,289" />
          </clipPath>

          <linearGradient id={`${uid}liq`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor={colorTop} stopOpacity="0.92" />
            <stop offset="100%" stopColor={colorBot} stopOpacity="1"    />
          </linearGradient>

          <radialGradient id={`${uid}pearl`} cx="38%" cy="34%" r="58%">
            <stop offset="0%"   stopColor="#3c2c1e" />
            <stop offset="50%"  stopColor="#160a04" />
            <stop offset="100%" stopColor="#0c0602" />
          </radialGradient>

          <linearGradient id={`${uid}pud`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#f2dc90" />
            <stop offset="100%" stopColor="#d4b048" stopOpacity="0.92" />
          </linearGradient>
        </defs>

        {/* Drop shadow */}
        <ellipse cx={CX} cy={298} rx={58} ry={6}  fill="rgba(0,0,0,0.22)" />
        <ellipse cx={CX} cy={300} rx={44} ry={4}  fill="rgba(0,0,0,0.12)" />

        {/* Steam */}
        {showSteam && (
          <g className={styles.steam}>
            <path d="M86,30 Q82,20 86,10 Q90,0 86,-10"      className={styles.steamLine} style={{ animationDelay: '0ms'   }} />
            <path d="M100,26 Q96,16 100,6 Q104,-4 100,-14"  className={styles.steamLine} style={{ animationDelay: '280ms' }} />
            <path d="M114,30 Q118,20 114,10 Q110,0 114,-10" className={styles.steamLine} style={{ animationDelay: '140ms' }} />
          </g>
        )}

        {/* Straw */}
        <rect x="94" y="-28" width="12" height="104" rx="6" fill="#b7b7a4" opacity="0.7" className={styles.straw} />
        <rect x="95" y="-28" width="4"  height="104" rx="2" fill="rgba(255,255,255,0.18)" />

        {/* Lid */}
        <rect x="8"  y="52" width="184" height="26" rx="13" fill="#c8bfb0" />
        <rect x="8"  y="52" width="184" height="10" rx="5"  fill="rgba(255,255,255,0.14)" />

        {/* Cup body */}
        <polygon points="10,74 190,74 168,291 32,291" fill="#d8d0c5" />
        <ellipse cx={CX} cy={291} rx={68} ry={10} fill="#c8bfb0" />
        <ellipse cx={CX} cy={299} rx={54} ry={5}  fill="rgba(0,0,0,0.14)" />

        {/* Contents (clipped) */}
        <g clipPath={`url(#${uid}c)`}>

          {/* Liquid */}
          <rect x="0" y={liquidTop} width="200" height="300"
            fill={`url(#${uid}liq)`} className={styles.liquid} />

          {/* Sweetness tint */}
          {sweetAlpha > 0 && (
            <rect x="0" y={liquidTop} width="200" height="300"
              fill="#f0e8d8" opacity={sweetAlpha} className={styles.sweetnessLayer} />
          )}

          {/* Surface shimmer */}
          <ellipse cx={CX} cy={liquidTop + 4} rx={80} ry={4}
            fill="rgba(255,255,255,0.12)" className={styles.liquid} />

          {/* ── Toppings — bottom to top: boba → pudding → red bean → lychee → aloe ── */}

          {/* 1. Boba pearls (bottom layer, rendered first) */}
          {hasBoba && BOBA_PEARLS.map((b, i) => {
            const row = i >= 15 ? 0 : i >= 8 ? 1 : 2;
            const delay = row * 55 + (i % 8) * 10;
            return (
              <g key={i} className={styles.topping} style={{ animationDelay: `${delay}ms` }}>
                <ellipse cx={b.cx + 0.5} cy={b.cy + b.r * 0.58} rx={b.r * 0.88} ry={b.r * 0.27} fill="rgba(0,0,0,0.28)" />
                <circle cx={b.cx} cy={b.cy} r={b.r} fill={`url(#${uid}pearl)`} />
                <circle cx={b.cx - b.r * 0.28} cy={b.cy - b.r * 0.30} r={b.r * 0.30} fill="rgba(255,255,255,0.14)" />
              </g>
            );
          })}

          {/* 2. Pudding */}
          {hasPudding && (
            <g style={{ transform: `translateY(${puddingY}px)`, transition: LAYER_TRANSITION }}>
              {PUDDING.map((p, i) => (
                <g key={i} className={styles.topping} style={{ animationDelay: `${i * 35}ms` }}>
                  <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="5" fill={`url(#${uid}pud)`} opacity="0.92" />
                  <rect x={p.x + 2} y={p.y + 2} width={p.w * 0.5} height={p.h * 0.36} rx="2" fill="rgba(255,255,255,0.20)" />
                </g>
              ))}
            </g>
          )}

          {/* 3. Red bean */}
          {hasRedBean && (
            <g style={{ transform: `translateY(${redBeanY}px)`, transition: LAYER_TRANSITION }}>
              {RED_BEAN.map((b, i) => (
                <g key={i} className={styles.topping} style={{ animationDelay: `${i * 28}ms` }}>
                  <ellipse cx={b.cx} cy={b.cy} rx="5.5" ry="4.2" fill="#6e2e1e" opacity="0.94" />
                  <ellipse cx={b.cx - 1} cy={b.cy - 1.2} rx="2" ry="1.5" fill="rgba(255,255,255,0.11)" />
                </g>
              ))}
            </g>
          )}

          {/* 4. Lychee jelly */}
          {hasLychee && (
            <g style={{ transform: `translateY(${lycheeY}px)`, transition: LAYER_TRANSITION }}>
              {LYCHEE.map((l, i) => (
                <g key={i}
                  transform={`rotate(${l.r},${l.x + 7},${l.y + 7})`}
                  className={styles.topping}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <rect x={l.x} y={l.y} width="14" height="14" rx="3.5"
                    fill="rgba(214,234,170,0.56)" stroke="rgba(166,206,106,0.34)" strokeWidth="0.6" />
                  <rect x={l.x + 2} y={l.y + 2} width="6" height="5" rx="1.5" fill="rgba(238,252,210,0.30)" />
                </g>
              ))}
            </g>
          )}

          {/* 5. Aloe (top layer, rendered last) */}
          {hasAloe && (
            <g style={{ transform: `translateY(${aloeY}px)`, transition: LAYER_TRANSITION }}>
              {ALOE.map((a, i) => (
                <g key={i}
                  transform={`rotate(${a.r},${a.x + a.w / 2},${a.y + a.h / 2})`}
                  className={styles.topping}
                  style={{ animationDelay: `${i * 32}ms` }}
                >
                  <rect x={a.x} y={a.y} width={a.w} height={a.h} rx="2.5"
                    fill="rgba(148,206,136,0.62)" stroke="rgba(92,162,76,0.30)" strokeWidth="0.6" />
                  <rect x={a.x + 1} y={a.y + 2} width={a.w * 0.5} height={a.h * 0.4} rx="1" fill="rgba(195,238,185,0.28)" />
                </g>
              ))}
            </g>
          )}

        </g>

        {/* Cup outline */}
        <polygon points="10,74 190,74 168,291 32,291"
          fill="none" stroke="#b7b7a4" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="10" y1="74" x2="190" y2="74" stroke="#b7b7a4" strokeWidth="1" />

        {/* Brand stripe */}
        <polygon points="11,76 189,76 187,94 13,94" fill="rgba(203,153,126,0.18)" />

        {/* Seasonal stamp */}
        {isSeasonal && (
          <g transform="translate(150,140) rotate(14)">
            <circle cx="0" cy="0" r="15"
              fill="none" stroke="rgba(203,153,126,0.50)" strokeWidth="1" strokeDasharray="2,2.5" />
            <text x="0" y="-4" textAnchor="middle" fontSize="4"
              fontFamily="var(--font-body)" fontWeight="700"
              letterSpacing="0.12em" fill="rgba(203,153,126,0.68)">SEASONAL</text>
            <text x="0" y="6" textAnchor="middle" fontSize="8" fill="rgba(203,153,126,0.54)">✿</text>
          </g>
        )}
      </svg>
    </div>
  );
}
