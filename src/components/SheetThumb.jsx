/**
 * A miniature of the sheet each worksheet actually prints.
 *
 * The catalog used to show a stock line icon in a tinted rounded square, which
 * told a parent nothing about what would come out of the printer. These are
 * drawn from the real thing: squared paper, the same digit forms, and the
 * arrangement that worksheet uses — a stacked sum for column addition, a
 * division bracket for long division, a sequence with gaps for patterns.
 *
 * One consistent stroke weight and one grid pitch across all nine, so the row
 * reads as a set of sheets rather than a set of illustrations.
 */

/* Drawing coordinates. The rendered size is set in CSS and the viewBox scales
   to it, so the marks keep their positions at any display size. */
const W = 104
const H = 64
const SQ = 8

/** Squared-paper ruling, drawn once and reused by every thumbnail. */
function Ruling({ id }) {
  return (
    <pattern id={id} width={SQ} height={SQ} patternUnits="userSpaceOnUse">
      <path d={`M ${SQ} 0 L 0 0 0 ${SQ}`} fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.28" />
    </pattern>
  )
}

const digit = (x, y, text, opts = {}) => (
  <text
    key={`${x}-${y}-${text}`}
    x={x}
    y={y}
    fontFamily="'JetBrains Mono', ui-monospace, monospace"
    fontSize={opts.size ?? 9}
    fontWeight={opts.weight ?? 600}
    textAnchor={opts.anchor ?? 'middle'}
    fill="currentColor"
    opacity={opts.opacity ?? 1}
  >
    {text}
  </text>
)

/** A blank a child writes into: a short rule, never a filled box. */
const blank = (x, y, w = 9) => (
  <line key={`b-${x}-${y}`} x1={x} y1={y} x2={x + w} y2={y} stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
)

const rule = (x1, y, x2, weight = 1.2) => (
  <line key={`r-${x1}-${y}`} x1={x1} y1={y} x2={x2} y2={y} stroke="currentColor" strokeWidth={weight} />
)

/* Each mark set mirrors the arrangement of the sheet it stands for. */
const MARKS = {
  // A times-table grid with its header row and column.
  multiply: () => (
    <>
      {rule(20, 20, 88, 1)}
      <line x1="20" y1="12" x2="20" y2="56" stroke="currentColor" strokeWidth="1" />
      {[0, 1, 2, 3].map(i => digit(32 + i * 16, 18, String(i + 2), { size: 8, opacity: 0.75 }))}
      {[0, 1, 2].map(i => digit(14, 32 + i * 12, String(i + 2), { size: 8, opacity: 0.75 }))}
      {[6, 8, 10, 12, 9, 12, 15, 18, 12, 16, 20, 24].map((v, i) =>
        digit(32 + (i % 4) * 16, 32 + Math.floor(i / 4) * 12, String(v), { size: 8, opacity: 0.5 }))}
    </>
  ),
  // A single horizontal sum with the answer left blank.
  addsub: () => (
    <>
      {digit(26, 30, '7')}
      {digit(38, 30, '+')}
      {digit(50, 30, '5')}
      {digit(62, 30, '=')}
      {blank(70, 32, 12)}
      {digit(26, 50, '9')}
      {digit(38, 50, '−')}
      {digit(50, 50, '4')}
      {digit(62, 50, '=')}
      {blank(70, 52, 12)}
    </>
  ),
  // Two addends stacked over a rule, the sum blank.
  coladd: () => (
    <>
      {digit(52, 22, '2')}{digit(64, 22, '4')}{digit(76, 22, '8')}
      {digit(40, 38, '+')}
      {digit(52, 38, '1')}{digit(64, 38, '7')}{digit(76, 38, '5')}
      {rule(44, 44, 84, 1.6)}
      {blank(48, 56, 10)}{blank(60, 56, 10)}{blank(72, 56, 10)}
    </>
  ),
  // Multiplicand over multiplier, two partial-product rules.
  colmul: () => (
    <>
      {digit(56, 18, '3')}{digit(68, 18, '6')}{digit(80, 18, '4')}
      {digit(44, 32, '×')}
      {digit(68, 32, '2')}{digit(80, 32, '7')}
      {rule(48, 38, 88, 1.6)}
      {blank(52, 48, 32)}
      {blank(44, 58, 40)}
    </>
  ),
  // The long-division bracket: the shape that names the method.
  coldiv: () => (
    <>
      {digit(26, 40, '8', { size: 10 })}
      <path d="M 34 22 q 8 0 8 9 v 12 q 0 9 -8 9" fill="none" stroke="currentColor" strokeWidth="1.4" />
      {rule(42, 22, 88, 1.4)}
      {digit(54, 40, '4')}{digit(66, 40, '9')}{digit(78, 40, '6')}
      {blank(50, 16, 10)}{blank(62, 16, 10)}{blank(74, 16, 10)}
    </>
  ),
  // Two numbers with the comparison sign left open.
  compare: () => (
    <>
      {digit(28, 28, '2')}{digit(40, 28, '3')}
      <rect x="50" y="18" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
      {digit(72, 28, '3')}{digit(84, 28, '2')}
      {digit(28, 52, '9')}{digit(40, 52, '1')}
      <rect x="50" y="42" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
      {digit(72, 52, '8')}{digit(84, 52, '9')}
    </>
  ),
  // A number and its rounded form, with the arrow between.
  rounding: () => (
    <>
      {digit(28, 30, '4')}{digit(40, 30, '7')}
      <path d="M 52 26 h 14 m -4 -4 l 4 4 l -4 4" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      {blank(72, 32, 16)}
      {digit(28, 52, '8')}{digit(40, 52, '3')}
      <path d="M 52 48 h 14 m -4 -4 l 4 4 l -4 4" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      {blank(72, 54, 16)}
    </>
  ),
  // A sequence that runs out into blanks.
  patterns: () => (
    <>
      {digit(22, 30, '2')}{digit(38, 30, '4')}{digit(54, 30, '6')}
      {blank(64, 32, 10)}{blank(80, 32, 10)}
      {digit(22, 52, '5')}{digit(38, 52, '10')}{digit(58, 52, '15')}
      {blank(72, 54, 10)}{blank(86, 54, 10)}
    </>
  ),
  // The one screen-only sheet: an equation with a movable term.
  eqexplore: () => (
    <>
      <rect x="22" y="20" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.3" />
      {digit(45, 30, '+')}
      {digit(58, 30, '3')}
      {digit(70, 30, '=')}
      {digit(84, 30, '8')}
      {rule(22, 48, 88, 1)}
      <circle cx="46" cy="48" r="4" fill="currentColor" opacity="0.85" />
    </>
  ),
}

export default function SheetThumb({ id, className = '' }) {
  const marks = MARKS[id]
  const patternId = `ruling-${id}`
  return (
    <svg
      className={`sheet-thumb ${className}`.trim()}
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs><Ruling id={patternId} /></defs>
      <rect width={W} height={H} fill={`url(#${patternId})`} />
      {marks ? marks() : null}
    </svg>
  )
}
