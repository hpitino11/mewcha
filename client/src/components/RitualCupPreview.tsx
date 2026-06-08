import styles from './RitualCupPreview.module.css';
import type { Option } from '../types';

interface Props {
  categorySlug: string;
  itemName: string;
  size: Option | null;
  ice: Option | null;
  sweetness: Option | null;
  toppings: Option[];
  isSeasonal?: boolean;
  isCoffee?: boolean;
}

/* ─── Color palette per drink ─────────────────────────── */
function getLiquidColor(categorySlug: string, itemName: string): string {
  const name = itemName.toLowerCase();
  if (name.includes('taro'))       return '#b09abf';
  if (name.includes('strawberry')) return '#d48a96';
  if (name.includes('lychee'))     return '#c2d898';
  if (name.includes('hojicha'))    return '#c09055';
  if (name.includes('chai'))       return '#bf8840';
  if (name.includes('brown sugar'))return '#c4965a';
  if (categorySlug === 'matcha')   return '#86ad96';
  if (categorySlug === 'coffee')   return '#8a6040';
  if (categorySlug === 'boba')     return '#c4966a';
  return '#c0a878';
}

/* ─── Ice cube count ──────────────────────────────────── */
function getIceCount(label: string | undefined): number {
  if (!label) return 4;
  if (label.startsWith('No'))    return 0;
  if (label.startsWith('Light')) return 2;
  if (label.startsWith('Extra')) return 6;
  return 4;
}

/* ─── Sweetness cream overlay opacity ─────────────────── */
function getSweetnessOpacity(label: string | undefined): number {
  if (!label) return 0.2;
  const pct = parseInt(label);
  return pct / 100 * 0.45;
}

/* ─── Cup scale from size ─────────────────────────────── */
function getCupScale(label: string | undefined): number {
  if (!label) return 1;
  if (label.startsWith('Small'))  return 0.82;
  if (label.startsWith('Large'))  return 1.15;
  return 1;
}

/* ─── Liquid fill height (y coord where liquid starts) ── */
function getLiquidTop(label: string | undefined): number {
  if (!label) return 128;
  if (label.startsWith('Small'))  return 158;
  if (label.startsWith('Large'))  return 108;
  return 128;
}

/* ─── Pre-set ice cube positions (inside cup clip) ─────── */
const ICE = [
  { x: 56,  y: 155, w: 32, h: 20, r: -14 },
  { x: 108, y: 170, w: 29, h: 19, r: 10  },
  { x: 140, y: 150, w: 27, h: 18, r: -9  },
  { x: 72,  y: 198, w: 30, h: 20, r: 16  },
  { x: 118, y: 205, w: 27, h: 18, r: -12 },
  { x: 48,  y: 200, w: 25, h: 17, r: 6   },
];

/* ─── Pre-set boba positions ──────────────────────────── */
const BOBA = [
  { cx: 62,  cy: 238 },
  { cx: 82,  cy: 246 },
  { cx: 102, cy: 240 },
  { cx: 122, cy: 247 },
  { cx: 141, cy: 239 },
  { cx: 72,  cy: 250 },
  { cx: 112, cy: 251 },
];

const ALOE = [
  { x: 64,  y: 232, w: 6, h: 14, r: -8  },
  { x: 82,  y: 238, w: 5, h: 13, r: 5   },
  { x: 100, y: 234, w: 6, h: 14, r: -12 },
  { x: 118, y: 240, w: 5, h: 12, r: 8   },
  { x: 136, y: 233, w: 6, h: 14, r: -5  },
];

const RED_BEAN = [
  { cx: 65, cy: 240 }, { cx: 78, cy: 246 }, { cx: 92,  cy: 242 },
  { cx: 106,cy: 248 }, { cx: 119,cy: 243 }, { cx: 133, cy: 247 },
  { cx: 72, cy: 250 }, { cx: 86, cy: 250 }, { cx: 100, cy: 251 },
];

const LYCHEE = [
  { x: 62, y: 232, r: -8  },
  { x: 82, y: 238, r: 10  },
  { x: 102,y: 234, r: -12 },
  { x: 122,y: 239, r: 6   },
  { x: 140,y: 233, r: -7  },
];

export default function RitualCupPreview({
  categorySlug, itemName, size, ice, sweetness, toppings, isSeasonal, isCoffee,
}: Props) {
  const liquidColor    = getLiquidColor(categorySlug, itemName);
  const iceCount       = getIceCount(ice?.label);
  const sweetnessAlpha = getSweetnessOpacity(sweetness?.label);
  const scale          = getCupScale(size?.label);
  const liquidTop      = getLiquidTop(size?.label);

  const hasBoba    = toppings.some(t => t.label.toLowerCase().includes('boba'));
  const hasLychee  = toppings.some(t => t.label.toLowerCase().includes('lychee'));
  const hasRedBean = toppings.some(t => t.label.toLowerCase().includes('red bean'));
  const hasAloe    = toppings.some(t => t.label.toLowerCase().includes('aloe'));
  const hasPudding = toppings.some(t => t.label.toLowerCase().includes('pudding'));

  const showSteam = isCoffee || categorySlug === 'coffee';

  const cupId = `cup-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <div className={styles.wrapper} aria-label="Cup preview">
      <svg
        viewBox="0 0 200 300"
        className={styles.svg}
        style={{ transform: `scale(${scale})`, transformOrigin: 'center bottom' }}
        aria-hidden="true"
      >
        <defs>
          {/* Cup interior clip path */}
          <clipPath id={`${cupId}-clip`}>
            <polygon points="33,70 167,70 144,256 56,256" />
          </clipPath>

          {/* Cup body gradient for paper effect */}
          <linearGradient id={`${cupId}-body`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"   stopColor="#e8e0d8" />
            <stop offset="35%"  stopColor="#f5f0ea" />
            <stop offset="100%" stopColor="#e0d8d0" />
          </linearGradient>

          {/* Liquid highlight */}
          <linearGradient id={`${cupId}-liquid`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"   stopColor={liquidColor} stopOpacity="0.9" />
            <stop offset="60%"  stopColor={liquidColor} stopOpacity="1"   />
            <stop offset="100%" stopColor={liquidColor} stopOpacity="0.75" />
          </linearGradient>

          {/* Lid gradient */}
          <linearGradient id={`${cupId}-lid`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#d8d0c8" />
            <stop offset="100%" stopColor="#c8c0b8" />
          </linearGradient>

          {/* Pudding layer gradient */}
          <linearGradient id={`${cupId}-pudding`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#f0d898" />
            <stop offset="100%" stopColor="#e0c880" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* ── Steam (coffee/hot drinks) ── */}
        {showSteam && (
          <g className={styles.steam}>
            <path d="M82,32 Q78,22 82,12 Q86,2 82,-8"  className={styles.steamLine} style={{ animationDelay: '0ms' }} />
            <path d="M100,28 Q96,18 100,8 Q104,-2 100,-12" className={styles.steamLine} style={{ animationDelay: '300ms' }} />
            <path d="M118,32 Q122,22 118,12 Q114,2 118,-8" className={styles.steamLine} style={{ animationDelay: '150ms' }} />
          </g>
        )}

        {/* ── Straw ── */}
        <rect
          x="91" y="-8" width="11" height="102" rx="5.5"
          fill={liquidColor}
          opacity="0.7"
          className={styles.straw}
        />
        <rect
          x="91" y="-8" width="5" height="102" rx="5.5"
          fill="white"
          opacity="0.25"
        />

        {/* ── Lid body ── */}
        <rect x="24" y="50" width="152" height="22" rx="4" fill={`url(#${cupId}-lid)`} />
        {/* Lid dome */}
        <path d={`M24,50 Q100,28 176,50`} fill="none" stroke="#c0b8b0" strokeWidth="1.5" />
        <path d={`M24,50 Q100,34 176,50 L176,54 Q100,38 24,54 Z`} fill="#ccc4bc" />

        {/* ── Cup body (paper cup style) ── */}
        <polygon points="24,70 176,70 152,258 48,258" fill={`url(#${cupId}-body)`} />
        {/* Cup bottom ellipse */}
        <ellipse cx="100" cy="258" rx="52" ry="8" fill="#ddd5cc" />
        {/* Cup shadow */}
        <ellipse cx="100" cy="268" rx="44" ry="4" fill="rgba(63,66,56,0.06)" />

        {/* ── Mewcha brand stripe on cup ── */}
        <polygon
          points="34,72 166,72 162,85 38,85"
          fill="var(--color-accent-pale)"
          opacity="0.6"
        />

        {/* ────── Contents (clipped to cup interior) ── */}
        <g clipPath={`url(#${cupId}-clip)`}>

          {/* Liquid base */}
          <rect
            x="0" y={liquidTop} width="200" height="300"
            fill={`url(#${cupId}-liquid)`}
            className={styles.liquid}
          />

          {/* Cream sweetness overlay */}
          {sweetnessAlpha > 0 && (
            <rect
              x="0" y={liquidTop} width="200" height="300"
              fill="var(--color-accent-cream)"
              opacity={sweetnessAlpha}
              className={styles.sweetnessLayer}
            />
          )}

          {/* Pudding layer */}
          {hasPudding && (
            <rect
              x="0" y="230" width="200" height="40"
              fill={`url(#${cupId}-pudding)`}
              opacity="0.85"
              className={styles.topping}
            />
          )}

          {/* Ice cubes */}
          {ICE.slice(0, iceCount).map((ice, i) => (
            <g key={i} transform={`rotate(${ice.r},${ice.x + ice.w / 2},${ice.y + ice.h / 2})`} className={styles.iceCube}>
              <rect
                x={ice.x} y={ice.y} width={ice.w} height={ice.h} rx="3"
                fill="rgba(255,255,255,0.82)"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="0.5"
              />
              {/* Ice highlight */}
              <rect
                x={ice.x + 3} y={ice.y + 3} width={ice.w * 0.4} height={ice.h * 0.35} rx="1"
                fill="rgba(255,255,255,0.5)"
              />
            </g>
          ))}

          {/* Red bean */}
          {hasRedBean && RED_BEAN.map((b, i) => (
            <circle key={i} cx={b.cx} cy={b.cy} r="4.5"
              fill="#7a3a2a"
              opacity="0.85"
              className={styles.topping}
            />
          ))}

          {/* Aloe */}
          {hasAloe && ALOE.map((a, i) => (
            <g key={i} transform={`rotate(${a.r},${a.x + a.w / 2},${a.y + a.h / 2})`} className={styles.topping}>
              <rect
                x={a.x} y={a.y} width={a.w} height={a.h} rx="2"
                fill="rgba(180,220,170,0.7)"
                stroke="rgba(120,180,110,0.4)"
                strokeWidth="0.5"
              />
            </g>
          ))}

          {/* Lychee jelly */}
          {hasLychee && LYCHEE.map((l, i) => (
            <g key={i} transform={`rotate(${l.r},${l.x + 6},${l.y + 6})`} className={styles.topping}>
              <rect
                x={l.x} y={l.y} width="12" height="12" rx="2"
                fill="rgba(210,230,160,0.6)"
                stroke="rgba(170,200,120,0.4)"
                strokeWidth="0.5"
              />
            </g>
          ))}

          {/* Boba pearls */}
          {hasBoba && BOBA.map((b, i) => (
            <circle key={i} cx={b.cx} cy={b.cy} r="8.5"
              fill="#3a2820"
              className={styles.topping}
            />
          ))}
          {hasBoba && BOBA.map((b, i) => (
            <circle key={`hl-${i}`} cx={b.cx - 2} cy={b.cy - 2} r="2.5"
              fill="rgba(255,255,255,0.15)"
            />
          ))}

          {/* Liquid surface shimmer */}
          <ellipse
            cx="100" cy={liquidTop + 3} rx="60" ry="4"
            fill="rgba(255,255,255,0.18)"
          />
        </g>

        {/* ── Cup wall edges (front) ── */}
        <line x1="24"  y1="70" x2="48"  y2="258" stroke="#ccc4bc" strokeWidth="1.5" />
        <line x1="176" y1="70" x2="152" y2="258" stroke="#ccc4bc" strokeWidth="1.5" />
        {/* Cup top edge */}
        <line x1="24" y1="70" x2="176" y2="70" stroke="#ccc4bc" strokeWidth="1" />

        {/* Seasonal stamp */}
        {isSeasonal && (
          <g transform="translate(136, 90) rotate(12)">
            <circle cx="0" cy="0" r="18" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="2,3" opacity="0.6" />
            <text x="0" y="-5" textAnchor="middle" fontSize="5.5" fill="var(--color-accent)" fontFamily="var(--font-body)" fontWeight="600" letterSpacing="0.08em">SEASONAL</text>
            <text x="0" y="5" textAnchor="middle" fontSize="8" fill="var(--color-accent)" opacity="0.8">✿</text>
          </g>
        )}
      </svg>
    </div>
  );
}
