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

/* ── Drink liquid color ─────────────────────────────────── */
function getLiquidColor(slug: string, name: string): string {
  const n = name.toLowerCase();
  if (n.includes('taro'))         return '#c4a8d4';
  if (n.includes('strawberry'))   return '#e8a0aa';
  if (n.includes('honeydew'))     return '#a8cc8c';
  if (n.includes('thai'))         return '#d4904a';
  if (n.includes('brown sugar'))  return '#c89656';
  if (n.includes('classic'))      return '#c8a87a';
  if (slug === 'matcha')          return '#8aad82';
  if (slug === 'coffee')          return '#9a6848';
  return '#c4a87a';
}

/* ── Liquid fill level (Y where liquid starts in 0-300 space) */
function getLiquidTop(label: string | undefined): number {
  if (!label) return 138;
  if (label.startsWith('Small'))  return 168;
  if (label.startsWith('Large'))  return 112;
  return 138;
}

/* ── Cup scale from size ──────────────────────────────────── */
function getCupScale(label: string | undefined): number {
  if (!label) return 1;
  if (label.startsWith('Small'))  return 0.84;
  if (label.startsWith('Large'))  return 1.14;
  return 1;
}

/* ── Ice cube count ───────────────────────────────────────── */
function getIceCount(label: string | undefined): number {
  if (!label) return 4;
  if (label.startsWith('No'))    return 0;
  if (label.startsWith('Light')) return 2;
  if (label.startsWith('Extra')) return 6;
  return 4;
}

/* ── Sweetness cream overlay opacity ──────────────────────── */
function getSweetnessOpacity(label: string | undefined): number {
  if (!label) return 0.2;
  return (parseInt(label) / 100) * 0.38;
}

/* ── Fixed positions (calibrated to cup interior) ─────────── */
const ICE = [
  { x: 54,  y: 162, w: 32, h: 20, r: -14 },
  { x: 108, y: 175, w: 29, h: 19, r:  10 },
  { x: 136, y: 156, w: 27, h: 18, r:  -9 },
  { x: 68,  y: 204, w: 30, h: 20, r:  16 },
  { x: 116, y: 210, w: 27, h: 18, r: -12 },
  { x: 50,  y: 208, w: 25, h: 17, r:   6 },
];

const BOBA = [
  { cx: 62,  cy: 244 },
  { cx: 83,  cy: 252 },
  { cx: 104, cy: 246 },
  { cx: 124, cy: 253 },
  { cx: 143, cy: 245 },
  { cx: 72,  cy: 258 },
  { cx: 113, cy: 258 },
];

const ALOE = [
  { x: 62,  y: 238, w: 6, h: 14, r:  -8 },
  { x: 80,  y: 244, w: 5, h: 13, r:   5 },
  { x: 98,  y: 240, w: 6, h: 14, r: -12 },
  { x: 116, y: 245, w: 5, h: 12, r:   8 },
  { x: 134, y: 239, w: 6, h: 14, r:  -5 },
];

const RED_BEAN = [
  { cx: 63, cy: 244 }, { cx: 77, cy: 251 }, { cx: 91,  cy: 246 },
  { cx: 105,cy: 252 }, { cx: 119,cy: 247 }, { cx: 133, cy: 252 },
  { cx: 70, cy: 257 }, { cx: 84, cy: 257 }, { cx: 98,  cy: 258 },
];

const LYCHEE = [
  { x: 60, y: 238, r:  -8 },
  { x: 80, y: 244, r:  10 },
  { x: 100,y: 240, r: -12 },
  { x: 120,y: 244, r:   6 },
  { x: 138,y: 239, r:  -7 },
];

export default function RitualCupPreview({
  categorySlug, itemName, size, ice, sweetness, toppings, isSeasonal, isCoffee,
}: Props) {
  const uid          = useId().replace(/:/g, '');
  const liquidColor  = getLiquidColor(categorySlug, itemName);
  const liquidTop    = getLiquidTop(size?.label);
  const scale        = getCupScale(size?.label);
  const iceCount     = getIceCount(ice?.label);
  const sweetAlpha   = getSweetnessOpacity(sweetness?.label);

  const hasBoba    = toppings.some(t => t.label.toLowerCase().includes('boba'));
  const hasLychee  = toppings.some(t => t.label.toLowerCase().includes('lychee'));
  const hasRedBean = toppings.some(t => t.label.toLowerCase().includes('red bean'));
  const hasAloe    = toppings.some(t => t.label.toLowerCase().includes('aloe'));
  const hasPudding = toppings.some(t => t.label.toLowerCase().includes('pudding'));
  const showSteam  = isCoffee || categorySlug === 'coffee';

  /* Cup geometry — trapezoid, slight taper, clear plastic feel */
  const TY = 86,  BY = 272;   /* top / bottom Y */
  const TL = 31,  TR = 169;   /* top left / right X */
  const BL = 50,  BR = 150;   /* bottom left / right X */
  const CX = 100;             /* horizontal centre */

  /* Inner clip (1-2px inside the walls) */
  const clip = `${TL+2},${TY} ${TR-2},${TY} ${BR-1},${BY} ${BL+1},${BY}`;

  return (
    <div className={styles.wrapper} aria-label="Cup preview">
      <svg
        viewBox="0 0 200 300"
        className={styles.svg}
        style={{ transform: `scale(${scale})`, transformOrigin: 'center bottom' }}
        aria-hidden="true"
      >
        <defs>
          {/* Interior clip */}
          <clipPath id={`${uid}c`}>
            <polygon points={clip} />
          </clipPath>

          {/* Liquid */}
          <linearGradient id={`${uid}liq`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"   stopColor={liquidColor} stopOpacity="0.88" />
            <stop offset="55%"  stopColor={liquidColor} stopOpacity="1"    />
            <stop offset="100%" stopColor={liquidColor} stopOpacity="0.82" />
          </linearGradient>

          {/* Cup wall sheen — cylindrical highlight left, shadow right */}
          <linearGradient id={`${uid}wall`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"   stopColor="white"  stopOpacity="0.28" />
            <stop offset="12%"  stopColor="white"  stopOpacity="0"    />
            <stop offset="88%"  stopColor="black"  stopOpacity="0"    />
            <stop offset="100%" stopColor="black"  stopOpacity="0.07" />
          </linearGradient>

          {/* Lid */}
          <linearGradient id={`${uid}lid`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#eae4dc" />
            <stop offset="100%" stopColor="#d0cab8" />
          </linearGradient>

          {/* Straw — dark green, cylindrical */}
          <linearGradient id={`${uid}str`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"   stopColor="#4a5040" />
            <stop offset="28%"  stopColor="#3a4230" stopOpacity="0.95" />
            <stop offset="70%"  stopColor="#3a4230" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2c3224" />
          </linearGradient>

          {/* Boba pearl — 3D radial */}
          <radialGradient id={`${uid}pearl`} cx="38%" cy="36%" r="58%">
            <stop offset="0%"   stopColor="#4a3828" />
            <stop offset="55%"  stopColor="#241408" />
            <stop offset="100%" stopColor="#140c04" />
          </radialGradient>

          {/* Pudding */}
          <linearGradient id={`${uid}pud`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#f4e09a" />
            <stop offset="100%" stopColor="#e2c878" stopOpacity="0.88" />
          </linearGradient>

          {/* Cup bottom ellipse */}
          <linearGradient id={`${uid}bot`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#ccc4ba" />
            <stop offset="100%" stopColor="#b8b0a6" />
          </linearGradient>
        </defs>

        {/* ── Steam (hot drinks) ── */}
        {showSteam && (
          <g className={styles.steam}>
            <path d="M86,30 Q82,20 86,10 Q90,0 86,-10"  className={styles.steamLine} style={{ animationDelay: '0ms' }} />
            <path d="M100,26 Q96,16 100,6 Q104,-4 100,-14" className={styles.steamLine} style={{ animationDelay: '280ms' }} />
            <path d="M114,30 Q118,20 114,10 Q110,0 114,-10" className={styles.steamLine} style={{ animationDelay: '140ms' }} />
          </g>
        )}

        {/* ── Straw ── */}
        <rect x="93" y="-22" width="14" height="112" rx="7"
          fill={`url(#${uid}str)`}
          className={styles.straw}
        />
        {/* Straw left-edge highlight */}
        <rect x="94" y="-22" width="4" height="112" rx="2"
          fill="rgba(255,255,255,0.18)"
        />

        {/* ── Dome lid ── */}
        {/* Dome arc fill */}
        <path d={`M${TL-3},${TY} Q${CX},54 ${TR+3},${TY}`}
          fill={`url(#${uid}lid)`}
        />
        {/* Dome sheen */}
        <path d={`M${TL+18},${TY-8} Q${CX},58 ${TR-18},${TY-8}`}
          fill="rgba(255,255,255,0.22)"
          stroke="none"
        />
        {/* Lid rim ellipse */}
        <ellipse cx={CX} cy={TY} rx={72} ry={9}
          fill={`url(#${uid}lid)`}
          stroke="#c8c0b4"
          strokeWidth="0.6"
        />
        {/* Dome centre bubble (straw socket) */}
        <ellipse cx={CX} cy={65} rx={14} ry={5}
          fill="rgba(255,255,255,0.14)"
        />

        {/* ── Cup body (base polygon, nearly transparent — contents show through) ── */}
        <polygon
          points={`${TL},${TY} ${TR},${TY} ${BR},${BY} ${BL},${BY}`}
          fill="rgba(234,228,218,0.06)"
        />

        {/* ── Contents (clipped to cup interior) ── */}
        <g clipPath={`url(#${uid}c)`}>

          {/* Liquid base */}
          <rect x="0" y={liquidTop} width="200" height="300"
            fill={`url(#${uid}liq)`}
            className={styles.liquid}
          />

          {/* Sweetness cream tint */}
          {sweetAlpha > 0 && (
            <rect x="0" y={liquidTop} width="200" height="300"
              fill="#f0e8d8"
              opacity={sweetAlpha}
              className={styles.sweetnessLayer}
            />
          )}

          {/* Pudding layer */}
          {hasPudding && (
            <rect x="0" y="232" width="200" height="44"
              fill={`url(#${uid}pud)`}
              opacity="0.9"
              className={styles.topping}
            />
          )}

          {/* Liquid surface shimmer */}
          <ellipse cx={CX} cy={liquidTop + 4} rx={62} ry={5}
            fill="rgba(255,255,255,0.22)"
          />

          {/* Ice cubes */}
          {ICE.slice(0, iceCount).map((cube, i) => (
            <g key={i}
              transform={`rotate(${cube.r},${cube.x + cube.w/2},${cube.y + cube.h/2})`}
              className={styles.iceCube}
            >
              <rect x={cube.x} y={cube.y} width={cube.w} height={cube.h} rx="3"
                fill="rgba(255,255,255,0.76)"
                stroke="rgba(255,255,255,0.32)"
                strokeWidth="0.5"
              />
              {/* Facet highlight */}
              <rect x={cube.x+3} y={cube.y+3} width={cube.w*0.38} height={cube.h*0.32} rx="1"
                fill="rgba(255,255,255,0.52)"
              />
            </g>
          ))}

          {/* Red bean */}
          {hasRedBean && RED_BEAN.map((b, i) => (
            <circle key={i} cx={b.cx} cy={b.cy} r="4.5"
              fill="#6e3022"
              opacity="0.92"
              className={styles.topping}
            />
          ))}

          {/* Aloe */}
          {hasAloe && ALOE.map((a, i) => (
            <g key={i}
              transform={`rotate(${a.r},${a.x+a.w/2},${a.y+a.h/2})`}
              className={styles.topping}
            >
              <rect x={a.x} y={a.y} width={a.w} height={a.h} rx="2"
                fill="rgba(168,214,154,0.72)"
                stroke="rgba(108,172,92,0.36)"
                strokeWidth="0.5"
              />
            </g>
          ))}

          {/* Lychee jelly */}
          {hasLychee && LYCHEE.map((l, i) => (
            <g key={i}
              transform={`rotate(${l.r},${l.x+6},${l.y+6})`}
              className={styles.topping}
            >
              <rect x={l.x} y={l.y} width="12" height="12" rx="3"
                fill="rgba(202,228,150,0.62)"
                stroke="rgba(154,196,98,0.36)"
                strokeWidth="0.5"
              />
            </g>
          ))}

          {/* Boba pearls */}
          {hasBoba && BOBA.map((b, i) => (
            <circle key={i} cx={b.cx} cy={b.cy} r="9"
              fill={`url(#${uid}pearl)`}
              className={styles.topping}
            />
          ))}
          {/* Pearl specular highlight */}
          {hasBoba && BOBA.map((b, i) => (
            <circle key={`s${i}`} cx={b.cx - 3} cy={b.cy - 3} r="2.2"
              fill="rgba(255,255,255,0.18)"
            />
          ))}
        </g>

        {/* ── Cup wall overlay (cylindrical sheen over contents) ── */}
        <polygon
          points={`${TL},${TY} ${TR},${TY} ${BR},${BY} ${BL},${BY}`}
          fill={`url(#${uid}wall)`}
        />

        {/* ── Cup edge lines ── */}
        <line x1={TL} y1={TY} x2={BL} y2={BY} stroke="rgba(190,182,170,0.55)" strokeWidth="1.5" />
        <line x1={TR} y1={TY} x2={BR} y2={BY} stroke="rgba(148,140,130,0.45)" strokeWidth="1.5" />

        {/* ── Cup bottom ── */}
        <ellipse cx={CX} cy={BY} rx={51} ry={7}
          fill={`url(#${uid}bot)`}
          stroke="rgba(168,160,150,0.5)"
          strokeWidth="0.75"
        />

        {/* ── Mewcha brand band — thin engraved stripe near top ── */}
        <polygon
          points={`${TL+1},${TY+2} ${TR-1},${TY+2} ${TR-3},${TY+11} ${TL+3},${TY+11}`}
          fill="none"
          stroke="rgba(148,140,130,0.28)"
          strokeWidth="0.5"
        />

        {/* Mewcha wordmark on cup */}
        <text
          x={CX} y={TY + 32}
          textAnchor="middle"
          fontSize="7.5"
          fontFamily="var(--font-display)"
          fontStyle="italic"
          fontWeight="300"
          fill="rgba(100,95,85,0.25)"
          letterSpacing="0.12em"
        >
          mewcha
        </text>

        {/* Drop shadow */}
        <ellipse cx={CX} cy={BY + 10} rx={42} ry={4}
          fill="rgba(46,36,24,0.1)"
        />

        {/* ── Seasonal stamp ── */}
        {isSeasonal && (
          <g transform="translate(140, 124) rotate(14)">
            <circle cx="0" cy="0" r="15"
              fill="none"
              stroke="rgba(203,153,126,0.45)"
              strokeWidth="1"
              strokeDasharray="2,2.5"
            />
            <text x="0" y="-4"
              textAnchor="middle"
              fontSize="4"
              fontFamily="var(--font-body)"
              fontWeight="700"
              letterSpacing="0.12em"
              fill="rgba(203,153,126,0.6)"
            >SEASONAL</text>
            <text x="0" y="6"
              textAnchor="middle"
              fontSize="8"
              fill="rgba(203,153,126,0.5)"
            >✿</text>
          </g>
        )}
      </svg>
    </div>
  );
}
