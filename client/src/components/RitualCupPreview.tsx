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

function getLiquidColor(slug: string, name: string): string {
  const n = name.toLowerCase();
  if (n.includes('taro'))         return '#c4a8d4';
  if (n.includes('strawberry'))   return '#e8a0aa';
  if (n.includes('honeydew'))     return '#a8cc8c';
  if (n.includes('thai'))         return '#d4904a';
  if (n.includes('brown sugar'))  return '#c89656';
  if (n.includes('classic'))      return '#c8a87a';
  if (slug === 'matcha')          return '#7aaa72';
  if (slug === 'coffee')          return '#9a6848';
  return '#c4a87a';
}

/* Liquid fill Y — cup interior runs ~101→281, 200px span */
function getLiquidTop(label: string | undefined): number {
  if (!label) return 144;
  if (label.startsWith('Small'))  return 177;
  if (label.startsWith('Large'))  return 119;
  return 144;
}

function getCupScale(label: string | undefined): number {
  if (!label) return 1;
  if (label.startsWith('Small'))  return 0.84;
  if (label.startsWith('Large'))  return 1.14;
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
  if (!label) return 0.2;
  return (parseInt(label) / 100) * 0.38;
}

/* ── Topping positions — calibrated to 200×300 cup interior ── */
const ICE = [
  { x: 50,  y: 176, w: 32, h: 20, r: -14 },
  { x: 111, y: 189, w: 29, h: 19, r:  10 },
  { x: 142, y: 170, w: 27, h: 18, r:  -9 },
  { x: 66,  y: 217, w: 30, h: 20, r:  16 },
  { x: 120, y: 223, w: 27, h: 18, r: -12 },
  { x: 45,  y: 221, w: 25, h: 17, r:   6 },
];

const BOBA = [
  { cx: 52,  cy: 264 },
  { cx: 76,  cy: 268 },
  { cx: 100, cy: 264 },
  { cx: 124, cy: 268 },
  { cx: 148, cy: 264 },
  { cx: 70,  cy: 252 },
  { cx: 127, cy: 252 },
];

const ALOE = [
  { x: 58,  y: 251, w: 6, h: 14, r:  -8 },
  { x: 78,  y: 257, w: 5, h: 13, r:   5 },
  { x: 98,  y: 253, w: 6, h: 14, r: -12 },
  { x: 118, y: 258, w: 5, h: 12, r:   8 },
  { x: 139, y: 252, w: 6, h: 14, r:  -5 },
];

const RED_BEAN = [
  { cx: 58, cy: 257 }, { cx: 74, cy: 263 }, { cx: 90,  cy: 259 },
  { cx: 106,cy: 264 }, { cx: 121,cy: 260 }, { cx: 137, cy: 264 },
  { cx: 66, cy: 269 }, { cx: 82, cy: 269 }, { cx: 98,  cy: 270 },
];

const LYCHEE = [
  { x: 56, y: 251, r:  -8 },
  { x: 78, y: 257, r:  10 },
  { x: 100,y: 253, r: -12 },
  { x: 123,y: 257, r:   6 },
  { x: 143,y: 252, r:  -7 },
];

export default function RitualCupPreview({
  categorySlug, itemName, size, ice, sweetness, toppings, isSeasonal, isCoffee,
}: Props) {
  const uid         = useId().replace(/:/g, '');
  const liquidColor = getLiquidColor(categorySlug, itemName);
  const liquidTop   = getLiquidTop(size?.label);
  const scale       = getCupScale(size?.label);
  const iceCount    = getIceCount(ice?.label);
  const sweetAlpha  = getSweetnessOpacity(sweetness?.label);

  const hasBoba    = toppings.some(t => t.label.toLowerCase().includes('boba'));
  const hasLychee  = toppings.some(t => t.label.toLowerCase().includes('lychee'));
  const hasRedBean = toppings.some(t => t.label.toLowerCase().includes('red bean'));
  const hasAloe    = toppings.some(t => t.label.toLowerCase().includes('aloe'));
  const hasPudding = toppings.some(t => t.label.toLowerCase().includes('pudding'));
  const showSteam  = isCoffee || categorySlug === 'coffee';

  /* Cup geometry — scaled from RitualLoader's 160×220 to 200×300 */
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
          {/* Interior clip */}
          <clipPath id={`${uid}c`}>
            <polygon points="28,101 172,101 152,281 48,281" />
          </clipPath>

          {/* Liquid */}
          <linearGradient id={`${uid}liq`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"   stopColor={liquidColor} stopOpacity="0.88" />
            <stop offset="55%"  stopColor={liquidColor} stopOpacity="1"    />
            <stop offset="100%" stopColor={liquidColor} stopOpacity="0.84" />
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
        </defs>

        {/* ── Steam (hot drinks) ── */}
        {showSteam && (
          <g className={styles.steam}>
            <path d="M86,30 Q82,20 86,10 Q90,0 86,-10"      className={styles.steamLine} style={{ animationDelay: '0ms'   }} />
            <path d="M100,26 Q96,16 100,6 Q104,-4 100,-14"  className={styles.steamLine} style={{ animationDelay: '280ms' }} />
            <path d="M114,30 Q118,20 114,10 Q110,0 114,-10" className={styles.steamLine} style={{ animationDelay: '140ms' }} />
          </g>
        )}

        {/* ── Straw — sage, same as loader ── */}
        <rect x="94" y="-22" width="12" height="115" rx="6"
          fill="#b7b7a4" opacity="0.7"
          className={styles.straw}
        />
        <rect x="95" y="-22" width="4" height="115" rx="2"
          fill="rgba(255,255,255,0.2)"
        />

        {/* ── Lid — rounded rect, same as loader ── */}
        <rect x="15" y="76" width="170" height="27" rx="13" fill="#c8bfb0" />
        <rect x="15" y="76" width="170" height="10" rx="5"  fill="rgba(255,255,255,0.12)" />

        {/* ── Cup body — opaque warm gray, same as loader ── */}
        <polygon points="23,101 178,101 158,284 43,284" fill="#d8d0c5" />
        <ellipse cx={CX} cy={284} rx="58" ry="10" fill="#c8bfb0" />
        <ellipse cx={CX} cy={294} rx="48" ry="6"  fill="rgba(0,0,0,0.1)" />

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

          {/* Foam layer near surface (matches loader) */}
          <rect x="0" y={liquidTop} width="200" height="48"
            fill="rgba(255,232,214,0.18)"
          />

          {/* Pudding layer */}
          {hasPudding && (
            <rect x="0" y="245" width="200" height="44"
              fill={`url(#${uid}pud)`}
              opacity="0.9"
              className={styles.topping}
            />
          )}

          {/* Liquid surface shimmer */}
          <ellipse cx={CX} cy={liquidTop + 5} rx={63} ry={5}
            fill="rgba(255,255,255,0.18)"
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
              <rect x={cube.x+3} y={cube.y+3} width={cube.w*0.38} height={cube.h*0.32} rx="1"
                fill="rgba(255,255,255,0.52)"
              />
            </g>
          ))}

          {/* Red bean */}
          {hasRedBean && RED_BEAN.map((b, i) => (
            <circle key={i} cx={b.cx} cy={b.cy} r="4.5"
              fill="#6e3022" opacity="0.92"
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
          {hasBoba && BOBA.map((b, i) => (
            <circle key={`s${i}`} cx={b.cx - 2.5} cy={b.cy - 2.5} r="2.5"
              fill="rgba(255,255,255,0.12)"
            />
          ))}
        </g>

        {/* ── Cup outline — same stroke as loader ── */}
        <polygon
          points="23,101 178,101 158,284 43,284"
          fill="none"
          stroke="#b7b7a4"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <line x1="23" y1="101" x2="178" y2="101" stroke="#b7b7a4" strokeWidth="1" />

        {/* ── Brand stripe — same as loader ── */}
        <polygon
          points="24,104 177,104 175,124 26,124"
          fill="rgba(203,153,126,0.18)"
        />

        {/* Mewcha wordmark */}
        <text
          x={CX} y="140"
          textAnchor="middle"
          fontSize="7.5"
          fontFamily="var(--font-display)"
          fontStyle="italic"
          fontWeight="300"
          fill="rgba(100,95,85,0.22)"
          letterSpacing="0.12em"
        >
          mewcha
        </text>

        {/* ── Seasonal stamp ── */}
        {isSeasonal && (
          <g transform="translate(145, 138) rotate(14)">
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
