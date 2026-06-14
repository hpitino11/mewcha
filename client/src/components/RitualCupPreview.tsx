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

/* ── Per-drink liquid gradient stops ──────────────────────── */
interface GStop { offset: string; color: string; opacity: number; }

function getDrinkGradient(slug: string, name: string): GStop[] {
  const n = name.toLowerCase();
  if (n.includes('matcha')) return [
    { offset: '0%',   color: '#d8ecc0', opacity: 0.48 },
    { offset: '16%',  color: '#9ecc74', opacity: 0.84 },
    { offset: '40%',  color: '#58a040', opacity: 0.95 },
    { offset: '72%',  color: '#367028', opacity: 0.98 },
    { offset: '100%', color: '#1e4c18', opacity: 1.00 },
  ];
  if (n.includes('taro')) return [
    { offset: '0%',   color: '#ecddf4', opacity: 0.44 },
    { offset: '28%',  color: '#c4a0d8', opacity: 0.86 },
    { offset: '70%',  color: '#9068bc', opacity: 0.97 },
    { offset: '100%', color: '#684898', opacity: 1.00 },
  ];
  if (n.includes('honeydew')) return [
    { offset: '0%',   color: '#d8f0cc', opacity: 0.40 },
    { offset: '30%',  color: '#8cd878', opacity: 0.85 },
    { offset: '100%', color: '#429a30', opacity: 0.98 },
  ];
  if (n.includes('thai')) return [
    { offset: '0%',   color: '#f4e2c0', opacity: 0.44 },
    { offset: '26%',  color: '#e09c48', opacity: 0.88 },
    { offset: '65%',  color: '#b86018', opacity: 0.97 },
    { offset: '100%', color: '#7e380a', opacity: 1.00 },
  ];
  if (n.includes('brown sugar')) return [
    { offset: '0%',   color: '#f4e2c0', opacity: 0.40 },
    { offset: '26%',  color: '#d09c58', opacity: 0.86 },
    { offset: '65%',  color: '#a46028', opacity: 0.97 },
    { offset: '100%', color: '#6a360e', opacity: 1.00 },
  ];
  if (slug === 'coffee') return [
    { offset: '0%',   color: '#e8d8c0', opacity: 0.38 },
    { offset: '24%',  color: '#b88858', opacity: 0.86 },
    { offset: '62%',  color: '#784828', opacity: 0.97 },
    { offset: '100%', color: '#482208', opacity: 1.00 },
  ];
  /* classic milk tea + catch-all */
  return [
    { offset: '0%',   color: '#f0e8d8', opacity: 0.38 },
    { offset: '28%',  color: '#d4b888', opacity: 0.84 },
    { offset: '68%',  color: '#a88048', opacity: 0.96 },
    { offset: '100%', color: '#785428', opacity: 1.00 },
  ];
}

/* ── Helpers ───────────────────────────────────────────────── */

/* Cup interior top Y — cup body runs y=74→y=289, range=215 */
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

function getIceCount(label: string | undefined): number {
  if (!label) return 4;
  if (label.startsWith('No'))    return 0;
  if (label.startsWith('Light')) return 2;
  if (label.startsWith('Extra')) return 6;
  return 4;
}

function getSweetnessOpacity(label: string | undefined): number {
  if (!label) return 0.18;
  return (parseInt(label) / 100) * 0.34;
}

/* ── Topping positions — calibrated to clip "14,74 186,74 164,289 36,289" ── */

/* 20 boba pearls in 3 natural rows with varied radii */
const BOBA_PEARLS = [
  /* bottom row */ { cx: 44, cy: 274, r: 7.0 }, { cx: 59, cy: 271, r: 7.5 },
  { cx: 74, cy: 275, r: 7.0 }, { cx: 89, cy: 271, r: 7.5 },
  { cx: 104, cy: 275, r: 7.0 }, { cx: 119, cy: 271, r: 7.5 },
  { cx: 134, cy: 275, r: 7.0 }, { cx: 149, cy: 271, r: 7.0 },
  /* second row */ { cx: 52, cy: 260, r: 6.5 }, { cx: 67, cy: 263, r: 6.0 },
  { cx: 82, cy: 259, r: 6.5 }, { cx: 97, cy: 263, r: 6.0 },
  { cx: 112, cy: 259, r: 6.5 }, { cx: 127, cy: 263, r: 6.0 },
  { cx: 143, cy: 259, r: 6.0 },
  /* top row */    { cx: 59, cy: 249, r: 5.5 }, { cx: 77, cy: 252, r: 5.0 },
  { cx: 95, cy: 249, r: 5.5 }, { cx: 113, cy: 252, r: 5.0 },
  { cx: 130, cy: 249, r: 5.5 },
];

const ICE = [
  { x: 32,  y: 166, w: 40, h: 24, r: -14 },
  { x: 106, y: 180, w: 36, h: 22, r:  10 },
  { x: 138, y: 160, w: 34, h: 22, r:  -9 },
  { x: 50,  y: 216, w: 38, h: 24, r:  16 },
  { x: 112, y: 222, w: 34, h: 22, r: -12 },
  { x: 30,  y: 220, w: 32, h: 21, r:   6 },
];

const ALOE = [
  { x: 44, y: 264, w: 8, h: 18, r: -8  },
  { x: 68, y: 268, w: 7, h: 17, r:  5  },
  { x: 92, y: 263, w: 8, h: 18, r: -12 },
  { x: 116, y: 268, w: 7, h: 16, r:  8 },
  { x: 140, y: 263, w: 8, h: 18, r: -5 },
];

/* oval beans */
const RED_BEAN = [
  { cx: 46, cy: 268 }, { cx: 62, cy: 273 }, { cx: 78, cy: 268 },
  { cx: 94, cy: 272 }, { cx: 110, cy: 267 }, { cx: 126, cy: 272 },
  { cx: 54, cy: 279 }, { cx: 70, cy: 278  }, { cx: 88, cy: 280  },
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

/* ── Component ─────────────────────────────────────────────── */
export default function RitualCupPreview({
  categorySlug, itemName, size, ice, sweetness, toppings, isSeasonal, isCoffee,
}: Props) {
  const uid        = useId().replace(/:/g, '');
  const liquidTop  = getLiquidTop(size?.label);
  const scale      = getCupScale(size?.label);
  const iceCount   = getIceCount(ice?.label);
  const sweetAlpha = getSweetnessOpacity(sweetness?.label);
  const gradStops  = getDrinkGradient(categorySlug, itemName);

  const hasBoba    = toppings.some(t => t.label.toLowerCase().includes('boba'));
  const hasLychee  = toppings.some(t => t.label.toLowerCase().includes('lychee'));
  const hasRedBean = toppings.some(t => t.label.toLowerCase().includes('red bean'));
  const hasAloe    = toppings.some(t => t.label.toLowerCase().includes('aloe'));
  const hasPudding = toppings.some(t => t.label.toLowerCase().includes('pudding'));
  const showSteam  = isCoffee || categorySlug === 'coffee';

  /* Cup geometry — centred on x=100 */
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
          {/* Clip to cup interior */}
          <clipPath id={`${uid}c`}>
            <polygon points="14,74 186,74 164,289 36,289" />
          </clipPath>

          {/* Liquid gradient — objectBoundingBox so it always spans the liquid rect */}
          <linearGradient id={`${uid}liq`} x1="0" x2="0" y1="0" y2="1">
            {gradStops.map((s, i) => (
              <stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity} />
            ))}
          </linearGradient>

          {/* Foam / milk layer at liquid surface */}
          <linearGradient id={`${uid}foam`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#ede8da" stopOpacity="0.60" />
            <stop offset="100%" stopColor="#ede8da" stopOpacity="0"    />
          </linearGradient>

          {/* Cup wall sheen — left bright, right dark */}
          <linearGradient id={`${uid}wall`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"   stopColor="white" stopOpacity="0.38" />
            <stop offset="13%"  stopColor="white" stopOpacity="0"    />
            <stop offset="87%"  stopColor="black" stopOpacity="0"    />
            <stop offset="100%" stopColor="black" stopOpacity="0.09" />
          </linearGradient>

          {/* Pearl 3-D radial */}
          <radialGradient id={`${uid}pearl`} cx="38%" cy="34%" r="58%">
            <stop offset="0%"   stopColor="#5a3e28" />
            <stop offset="42%"  stopColor="#1c0c04" />
            <stop offset="100%" stopColor="#0c0602" />
          </radialGradient>

          {/* Pudding golden gradient */}
          <linearGradient id={`${uid}pud`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#f6e098" />
            <stop offset="100%" stopColor="#dab850" stopOpacity="0.92" />
          </linearGradient>

          {/* Lid gradient — top light, bottom shaded */}
          <linearGradient id={`${uid}lid`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#d8d0c6" />
            <stop offset="100%" stopColor="#b8b0a4" />
          </linearGradient>

          {/* Bottom ellipse gradient */}
          <linearGradient id={`${uid}bot`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#ccc4ba" />
            <stop offset="100%" stopColor="#aaa29a" />
          </linearGradient>
        </defs>

        {/* ── Drop shadow ── */}
        <ellipse cx={CX} cy={300} rx={60} ry={7}   fill="rgba(46,36,24,0.16)" />
        <ellipse cx={CX} cy={302} rx={46} ry={4.5} fill="rgba(46,36,24,0.09)" />

        {/* ── Steam (hot drinks) ── */}
        {showSteam && (
          <g className={styles.steam}>
            <path d="M86,30 Q82,20 86,10 Q90,0 86,-10"      className={styles.steamLine} style={{ animationDelay: '0ms'   }} />
            <path d="M100,26 Q96,16 100,6 Q104,-4 100,-14"  className={styles.steamLine} style={{ animationDelay: '280ms' }} />
            <path d="M114,30 Q118,20 114,10 Q110,0 114,-10" className={styles.steamLine} style={{ animationDelay: '140ms' }} />
          </g>
        )}

        {/* ── Straw ── */}
        <rect x="94" y="-28" width="12" height="110" rx="6"
          fill="#b7b7a4" opacity="0.72" className={styles.straw} />
        <rect x="95" y="-28" width="4"  height="110" rx="2"
          fill="rgba(255,255,255,0.19)" />

        {/* ── Lid ── */}
        <rect x="8"  y="52" width="184" height="26" rx="13" fill={`url(#${uid}lid)`} />
        {/* Lid top shine */}
        <rect x="8"  y="52" width="184" height="10" rx="5"  fill="rgba(255,255,255,0.16)" />
        {/* Lid bottom inner shadow */}
        <rect x="8"  y="70" width="184" height="8"  rx="0"  fill="rgba(80,74,66,0.08)" />
        {/* Straw socket */}
        <ellipse cx={CX} cy="60" rx="9" ry="4"
          fill="#b8b0a8"
          stroke="rgba(140,134,124,0.5)"
          strokeWidth="0.6"
        />

        {/* ── Cup body — barely-there tint, contents show through ── */}
        <polygon
          points="10,74 190,74 168,291 32,291"
          fill="rgba(215,210,200,0.08)"
        />

        {/* ── Contents (clipped to cup interior) ── */}
        <g clipPath={`url(#${uid}c)`}>

          {/* Liquid base */}
          <rect x="0" y={liquidTop} width="200" height="300"
            fill={`url(#${uid}liq)`}
            className={styles.liquid}
          />

          {/* Sweetness cream overlay */}
          {sweetAlpha > 0 && (
            <rect x="0" y={liquidTop} width="200" height="300"
              fill="#f0e8d8"
              opacity={sweetAlpha}
              className={styles.sweetnessLayer}
            />
          )}

          {/* Foam / milk layer at surface */}
          <rect x="0" y={liquidTop} width="200" height="26"
            fill={`url(#${uid}foam)`}
            className={styles.liquid}
          />

          {/* Meniscus shimmer */}
          <ellipse cx={CX} cy={liquidTop + 4} rx={82} ry={4.5}
            fill="rgba(255,255,255,0.17)"
            className={styles.liquid}
          />

          {/* Interior left wall reflection — inside glass effect */}
          <rect x="14" y="74" width="12" height="215"
            fill="rgba(255,255,255,0.07)"
          />

          {/* Pudding */}
          {hasPudding && PUDDING.map((p, i) => (
            <g key={i} className={styles.topping} style={{ animationDelay: `${i * 35}ms` }}>
              <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="5"
                fill={`url(#${uid}pud)`}
                opacity="0.92"
              />
              <rect x={p.x + 2} y={p.y + 2} width={p.w * 0.55} height={p.h * 0.38} rx="2"
                fill="rgba(255,255,255,0.22)"
              />
            </g>
          ))}

          {/* Ice cubes */}
          {ICE.slice(0, iceCount).map((cube, i) => (
            <g key={i}
              transform={`rotate(${cube.r},${cube.x + cube.w / 2},${cube.y + cube.h / 2})`}
              className={styles.iceCube}
              style={{ animationDelay: `${i * 45}ms` }}
            >
              <rect x={cube.x} y={cube.y} width={cube.w} height={cube.h} rx="4"
                fill="rgba(255,255,255,0.78)"
                stroke="rgba(200,220,240,0.4)"
                strokeWidth="0.6"
              />
              <rect x={cube.x + 4} y={cube.y + 3} width={cube.w * 0.38} height={cube.h * 0.32} rx="2"
                fill="rgba(255,255,255,0.50)"
              />
              <rect x={cube.x + 2} y={cube.y + cube.h - 6} width={cube.w - 4} height="3" rx="1"
                fill="rgba(180,210,240,0.18)"
              />
            </g>
          ))}

          {/* Red bean — oval pieces */}
          {hasRedBean && RED_BEAN.map((b, i) => (
            <g key={i} className={styles.topping} style={{ animationDelay: `${i * 28}ms` }}>
              <ellipse cx={b.cx} cy={b.cy} rx="5.5" ry="4.2"
                fill="#6e2e1e" opacity="0.94"
              />
              <ellipse cx={b.cx - 1} cy={b.cy - 1.2} rx="2" ry="1.5"
                fill="rgba(255,255,255,0.12)"
              />
            </g>
          ))}

          {/* Aloe — translucent green pieces */}
          {hasAloe && ALOE.map((a, i) => (
            <g key={i}
              transform={`rotate(${a.r},${a.x + a.w / 2},${a.y + a.h / 2})`}
              className={styles.topping}
              style={{ animationDelay: `${i * 32}ms` }}
            >
              <rect x={a.x} y={a.y} width={a.w} height={a.h} rx="2.5"
                fill="rgba(152,210,140,0.65)"
                stroke="rgba(96,168,80,0.32)"
                strokeWidth="0.6"
              />
              <rect x={a.x + 1} y={a.y + 2} width={a.w * 0.5} height={a.h * 0.42} rx="1"
                fill="rgba(200,240,190,0.30)"
              />
            </g>
          ))}

          {/* Lychee jelly — translucent pale cubes */}
          {hasLychee && LYCHEE.map((l, i) => (
            <g key={i}
              transform={`rotate(${l.r},${l.x + 7},${l.y + 7})`}
              className={styles.topping}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <rect x={l.x} y={l.y} width="14" height="14" rx="3.5"
                fill="rgba(218,238,175,0.58)"
                stroke="rgba(170,210,110,0.36)"
                strokeWidth="0.6"
              />
              <rect x={l.x + 2} y={l.y + 2} width="6" height="5" rx="1.5"
                fill="rgba(240,255,215,0.32)"
              />
            </g>
          ))}

          {/* Boba pearls — shadow + pearl + highlight grouped so they animate together */}
          {hasBoba && BOBA_PEARLS.map((b, i) => {
            /* stagger: top row first (drops from above), bottom row last */
            const row = i < 15 ? (i < 8 ? 2 : 1) : 0;
            const delay = row * 55 + (i % 8) * 10;
            return (
              <g key={i} className={styles.topping} style={{ animationDelay: `${delay}ms` }}>
                <ellipse
                  cx={b.cx + 0.5} cy={b.cy + b.r * 0.58}
                  rx={b.r * 0.88} ry={b.r * 0.27}
                  fill="rgba(0,0,0,0.22)"
                />
                <circle cx={b.cx} cy={b.cy} r={b.r}
                  fill={`url(#${uid}pearl)`}
                />
                <circle
                  cx={b.cx - b.r * 0.28} cy={b.cy - b.r * 0.30}
                  r={b.r * 0.30}
                  fill="rgba(255,255,255,0.15)"
                />
              </g>
            );
          })}

        </g>

        {/* ── Cup wall sheen — drawn over contents for clear-plastic look ── */}
        <polygon
          points="10,74 190,74 168,291 32,291"
          fill={`url(#${uid}wall)`}
        />

        {/* ── Cup rim (lip at top of cup body) ── */}
        <ellipse cx={CX} cy={74} rx={90} ry={8}
          fill="rgba(210,204,194,0.22)"
          stroke="rgba(175,168,158,0.52)"
          strokeWidth="1.1"
        />

        {/* ── Cup outline ── */}
        <polygon
          points="10,74 190,74 168,291 32,291"
          fill="none"
          stroke="rgba(172,165,154,0.50)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* ── Cup bottom ── */}
        <ellipse cx={CX} cy={291} rx={68} ry={10}
          fill={`url(#${uid}bot)`}
          stroke="rgba(155,148,138,0.45)"
          strokeWidth="0.75"
        />

        {/* ── Brand stripe ── */}
        <polygon
          points="11,76 189,76 187,94 13,94"
          fill="rgba(203,153,126,0.17)"
        />

        {/* Mewcha wordmark */}
        <text
          x={CX} y="114"
          textAnchor="middle"
          fontSize="7.5"
          fontFamily="var(--font-display)"
          fontStyle="italic"
          fontWeight="300"
          fill="rgba(100,95,85,0.20)"
          letterSpacing="0.12em"
        >
          mewcha
        </text>

        {/* ── Seasonal stamp ── */}
        {isSeasonal && (
          <g transform="translate(150,140) rotate(14)">
            <circle cx="0" cy="0" r="15"
              fill="none"
              stroke="rgba(203,153,126,0.48)"
              strokeWidth="1"
              strokeDasharray="2,2.5"
            />
            <text x="0" y="-4"
              textAnchor="middle"
              fontSize="4"
              fontFamily="var(--font-body)"
              fontWeight="700"
              letterSpacing="0.12em"
              fill="rgba(203,153,126,0.65)"
            >SEASONAL</text>
            <text x="0" y="6"
              textAnchor="middle"
              fontSize="8"
              fill="rgba(203,153,126,0.52)"
            >✿</text>
          </g>
        )}
      </svg>
    </div>
  );
}
