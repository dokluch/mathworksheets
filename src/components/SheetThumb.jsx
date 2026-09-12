/**
 * A miniature of the sheet each worksheet actually prints.
 *
 * The catalog used to show a stock line icon in a tinted rounded square, which
 * told a parent nothing about what would come out of the printer. These are
 * drawn from the real thing: squared paper, the same digit forms, and the
 * arrangement that worksheet uses — a stacked sum for column addition, a
 * division frame for long division, a sequence with gaps for patterns.
 *
 * Everything is placed in the ruling's own coordinates, never in free pixels:
 * a digit is centred in a cell, a rule falls on a grid line, a blank is ink
 * inside a cell. That is the whole claim the preview makes — this is a page of
 * squared paper with marks on it — and the marks used to sit at arbitrary
 * offsets that broke it. Use `cx`/`cy`/`ln` below and it cannot drift again.
 */

/* Drawing coordinates: 13 × 8 squares. The rendered size is set in CSS and the
   viewBox scales to it, so the marks keep their positions at any display size.
   8 is the largest pitch that divides both W and H exactly. */
const SQ = 8
const COLS = 13
const ROWS = 8
const W = COLS * SQ
const H = ROWS * SQ

/** Centre of column `c` / row `r`, and the grid line at index `n`. */
const cx = c => c * SQ + SQ / 2
const cy = r => r * SQ + SQ / 2
const ln = n => n * SQ
/** Centre of a run of cells, for a table column two squares wide. */
const span = (c0, c1) => (ln(c0) + ln(c1)) / 2

/* The sheet sets its digits at 0.77 of a square (`.colarith-problem`); the
   preview uses the same ratio so the miniature is to scale, not just to shape. */
const DIGIT = SQ * 0.77

/** Squared-paper ruling, drawn once and reused by every thumbnail. */
function Ruling({ id }) {
  return (
    <pattern id={id} width={SQ} height={SQ} patternUnits="userSpaceOnUse">
      <path d={`M ${SQ} 0 L 0 0 0 ${SQ}`} fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.28" />
    </pattern>
  )
}

/**
 * One glyph, dead centre in cell (c, r). `dominant-baseline: central` rather
 * than a hand-tuned baseline offset: the fallback stack is not metrically
 * identical to JetBrains Mono, and a tuned offset would only be centred on the
 * machines that happen to have the webfont.
 */
const digit = (c, r, text, opts = {}) => (
  <text
    // A glyph placed by an `x` override shares its cell with its siblings, so the offset keys it.
    key={`d${opts.x ?? c}-${r}`}
    x={opts.x ?? cx(c)}
    y={opts.y ?? cy(r)}
    fontFamily="'JetBrains Mono', ui-monospace, monospace"
    fontSize={opts.size ?? DIGIT}
    fontWeight={opts.weight ?? 600}
    textAnchor="middle"
    dominantBaseline="central"
    fill="currentColor"
    opacity={opts.opacity ?? 1}
  >
    {text}
  </text>
)

/** A blank a child writes into: ink inside the cell, so it reads over the ruling. */
const blank = (c, r, span = 1) => (
  <line
    key={`b${c}-${r}`}
    x1={ln(c) + 1.5}
    y1={ln(r) + SQ - 1.5}
    x2={ln(c + span) - 1.5}
    y2={ln(r) + SQ - 1.5}
    stroke="currentColor"
    strokeWidth="1.2"
    opacity="0.6"
  />
)

/** An answer bar, table head, or overbar: always on a grid line. */
const rule = (c0, c1, r, weight = 1.3) => (
  <line key={`h${c0}-${r}`} x1={ln(c0)} y1={ln(r)} x2={ln(c1)} y2={ln(r)} stroke="currentColor" strokeWidth={weight} />
)

const vrule = (c, r0, r1, weight = 1.3) => (
  <line key={`v${c}-${r0}`} x1={ln(c)} y1={ln(r0)} x2={ln(c)} y2={ln(r1)} stroke="currentColor" strokeWidth={weight} />
)

/** An empty box to fill in — one cell, inset so the ruling still shows around it. */
const box = (c, r) => (
  <rect
    key={`x${c}-${r}`}
    x={ln(c) + 1.5}
    y={ln(r) + 1.5}
    width={SQ - 3}
    height={SQ - 3}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.1"
    opacity="0.7"
  />
)

/* Which products the times table prints and which it leaves to the child:
   roughly the half-filled scatter the prefill slider defaults to. */
const MULT_FILLED = new Set(['0-0', '0-3', '1-1', '1-2'])

/* Each mark set mirrors the arrangement of the sheet it stands for. */
const MARKS = {
  // A times table. The real sheet is a bordered table of square cells wider than
  // a notebook square — a two-digit product has to fit one — so each product
  // here gets a 2 × 2 cell. The table is ruled in its own lines over a paper
  // ground that hides the squares beneath it, because the ruling would run
  // straight through the centre of every cell. The factor column stays one
  // square wide, which keeps the 9 × 6 table centred on the 13 × 8 page.
  multiply: () => {
    const factors = [2, 3, 4, 5]
    const multipliers = [2, 3]
    // The factor column is squares 2–3 and the head row 1–3; the cells follow.
    const colX = i => ln(4 + i * 2)
    const rowY = r => ln(4 + r * 2)
    const cellLines = { fill: 'none', stroke: 'currentColor', strokeWidth: 0.6, opacity: 0.5 }
    return (
      <>
        <rect x={ln(2)} y={ln(1)} width={9 * SQ} height={6 * SQ} style={{ fill: 'var(--paper)' }} />
        <rect x={ln(2)} y={ln(1)} width={9 * SQ} height={6 * SQ} {...cellLines} />
        <path d={`M ${ln(5)} ${ln(1)} V ${ln(7)} M ${ln(7)} ${ln(1)} V ${ln(7)} M ${ln(9)} ${ln(1)} V ${ln(7)} M ${ln(2)} ${ln(5)} H ${ln(11)}`} {...cellLines} />
        {rule(2, 11, 3, 1)}
        {vrule(3, 1, 7, 1)}
        {digit(2, 1, '×', { y: ln(2), opacity: 0.7 })}
        {factors.map((n, i) => digit(3 + i * 2, 1, String(n), { x: colX(i), y: ln(2), opacity: 0.8 }))}
        {multipliers.map((n, r) => digit(2, 3 + r * 2, String(n), { y: rowY(r), opacity: 0.8 }))}
        {multipliers.flatMap((m, r) => factors.map((f, c) => (
          MULT_FILLED.has(`${r}-${c}`)
            ? digit(c, 3 + r * 2, String(m * f), { x: colX(c), y: rowY(r), opacity: 0.5 })
            : null
        )))}
      </>
    )
  },
  // A single horizontal sum with the answer left blank.
  addsub: () => (
    <>
      {digit(3, 2, '7')}{digit(4, 2, '+')}{digit(5, 2, '5')}{digit(6, 2, '=')}{blank(7, 2, 2)}
      {digit(3, 5, '9')}{digit(4, 5, '−')}{digit(5, 5, '4')}{digit(6, 5, '=')}{blank(7, 5, 2)}
    </>
  ),
  // Two addends stacked over a rule, the sum blank.
  coladd: () => (
    <>
      {digit(6, 2, '2')}{digit(7, 2, '4')}{digit(8, 2, '8')}
      {digit(5, 3, '+')}
      {digit(6, 3, '1')}{digit(7, 3, '7')}{digit(8, 3, '5')}
      {rule(5, 9, 4, 1.5)}
      {blank(6, 4)}{blank(7, 4)}{blank(8, 4)}
    </>
  ),
  // Multiplicand over multiplier, then a partial product and the total.
  colmul: () => (
    <>
      {digit(6, 2, '3')}{digit(7, 2, '6')}{digit(8, 2, '4')}
      {digit(5, 3, '×')}{digit(7, 3, '2')}{digit(8, 3, '7')}
      {rule(5, 9, 4, 1.5)}
      {[5, 6, 7, 8].map(c => blank(c, 4))}
      {[4, 5, 6, 7, 8].map(c => blank(c, 5))}
    </>
  ),
  // Division facts on one line: an exact one, then one ending in the remainder
  // mark and its box, the mark two squares wide as on the sheet.
  divide: () => (
    <>
      {digit(2, 2, '1')}{digit(3, 2, '2')}{digit(4, 2, '÷')}{digit(5, 2, '3')}{digit(6, 2, '=')}{blank(7, 2)}
      {digit(2, 5, '1')}{digit(3, 5, '4')}{digit(4, 5, '÷')}{digit(5, 5, '4')}{digit(6, 5, '=')}{blank(7, 5)}
      {digit(8, 5, 'r', { x: span(8, 10), opacity: 0.7 })}{blank(10, 5)}
    </>
  ),
  // The long-division frame: the divisor, the upright, and the overbar with the
  // quotient boxes above it — the shape frameLayout() actually renders. The
  // boxes are the sheet's tinted .colarith-blank without its underline, which
  // sat just above the overbar and read as a second rule. Upright and overbar
  // are one path, so the corner is a mitred join rather than two butt ends.
  coldiv: () => (
    <>
      {[6, 7, 8].map(c => (
        <rect key={`q${c}`} x={ln(c) + 1.5} y={ln(3) + 1.5} width={SQ - 3} height={SQ - 3} fill="currentColor" opacity="0.12" />
      ))}
      <path d={`M ${ln(6)} ${ln(5)} V ${ln(4)} H ${ln(9)}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter" />
      {digit(4, 4, '8')}
      {digit(6, 4, '4')}{digit(7, 4, '9')}{digit(8, 4, '6')}
    </>
  ),
  // Two numbers with the comparison sign left open.
  compare: () => (
    <>
      {digit(3, 2, '2')}{digit(4, 2, '3')}{box(6, 2)}{digit(8, 2, '3')}{digit(9, 2, '2')}
      {digit(3, 5, '9')}{digit(4, 5, '1')}{box(6, 5)}{digit(8, 5, '8')}{digit(9, 5, '9')}
    </>
  ),
  // A number and its rounded form, with the arrow between.
  rounding: () => (
    <>
      {digit(2, 2, '4')}{digit(3, 2, '7')}
      <path d={`M ${ln(5)} ${cy(2)} H ${ln(7)} m -3 -3 l 3 3 l -3 3`} fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
      {blank(9, 2, 2)}
      {digit(2, 5, '8')}{digit(3, 5, '3')}
      <path d={`M ${ln(5)} ${cy(5)} H ${ln(7)} m -3 -3 l 3 3 l -3 3`} fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
      {blank(9, 5, 2)}
    </>
  ),
  // A sequence that runs out into blanks.
  patterns: () => (
    <>
      {digit(2, 2, '2')}{digit(4, 2, '4')}{digit(6, 2, '6')}{blank(8, 2)}{blank(10, 2)}
      {digit(2, 5, '3')}{digit(4, 5, '6')}{digit(6, 5, '9')}{blank(8, 5)}{blank(10, 5)}
    </>
  ),
  // Two expressions whose answer depends on what is done first: a bracket on
  // the top row, a multiplication waiting inside a subtraction on the bottom.
  order: () => (
    <>
      {digit(1, 2, '3')}{digit(2, 2, '0')}{digit(3, 2, '−')}
      {digit(4, 2, '(')}{digit(5, 2, '1')}{digit(6, 2, '7')}{digit(7, 2, '+')}{digit(8, 2, '9')}{digit(9, 2, ')')}
      {digit(10, 2, '=')}{box(11, 2)}
      {digit(1, 5, '7')}{digit(2, 5, '0')}{digit(3, 5, '−')}
      {digit(4, 5, '7')}{digit(5, 5, '·')}{digit(6, 5, '9')}
      {digit(7, 5, '=')}{box(8, 5)}
    </>
  ),
  // Two groups of six boxes with a rule between them: triangles on the left,
  // four-sided shapes on the right, the first problem a child usually meets.
  bongard: () => {
    const cell = (c, r, mark) => (
      <g key={`p${c}-${r}`}>
        <rect x={ln(c) + 1} y={ln(r) + 1} width={2 * SQ - 2} height={2 * SQ - 2} fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
        {mark}
      </g>
    )
    const tri = (c, r, k) => (
      <path d={`M ${ln(c + 1)} ${ln(r) + 4 + k} L ${ln(c) + 4 + k} ${ln(r + 2) - 4} L ${ln(c + 2) - 4 - k} ${ln(r + 2) - 4} Z`} fill="none" stroke="currentColor" strokeWidth="1" />
    )
    const quad = (c, r, k) => (
      <rect x={ln(c) + 4 + k} y={ln(r) + 4 + k} width={2 * SQ - 8 - 2 * k} height={2 * SQ - 8 - 2 * k} fill={k ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1" />
    )
    const rows = [1, 3, 5]
    return (
      <>
        {rows.flatMap((r, i) => [cell(1, r, tri(1, r, i)), cell(3, r, tri(3, r, 2 - i))])}
        {vrule(6.5, 1, 7, 1)}
        {rows.flatMap((r, i) => [cell(8, r, quad(8, r, i)), cell(10, r, quad(10, r, (i + 1) % 3))])}
      </>
    )
  },
  // Fractions as a squared book writes them: numerator over denominator with
  // the bar on the grid line between, and the sign on that line. A fractional
  // row (1.5, 5.5) centres a glyph or box on the line itself.
  fractions: () => (
    <>
      {digit(5, 1, '6')}{rule(5, 6, 2, 1.1)}{digit(5, 2, '8')}
      {digit(6, 1.5, '=')}
      {box(7, 1)}{rule(7, 8, 2, 1.1)}{box(7, 2)}
      {digit(5, 5, '3')}{rule(5, 6, 6, 1.1)}{digit(5, 6, '4')}
      {box(6, 5.5)}
      {digit(7, 5, '5')}{rule(7, 8, 6, 1.1)}{digit(7, 6, '8')}
    </>
  ),
  // A mixed-number sum on the top line and a plain difference under it, each
  // with its answer boxed: whole part on the bar line, then numerator over denominator.
  fracaddsub: () => (
    <>
      {digit(2, 1.5, '1')}{digit(3, 1, '3')}{rule(3, 4, 2, 1.1)}{digit(3, 2, '4')}
      {digit(4, 1.5, '+')}
      {digit(5, 1.5, '2')}{digit(6, 1, '5')}{rule(6, 7, 2, 1.1)}{digit(6, 2, '6')}
      {digit(7, 1.5, '=')}
      {box(8, 1.5)}{box(9, 1)}{rule(9, 10, 2, 1.1)}{box(9, 2)}
      {digit(3, 5, '5')}{rule(3, 4, 6, 1.1)}{digit(3, 6, '6')}
      {digit(4, 5.5, '−')}
      {digit(5, 5, '1')}{rule(5, 6, 6, 1.1)}{digit(5, 6, '4')}
      {digit(6, 5.5, '=')}
      {box(7, 5)}{rule(7, 8, 6, 1.1)}{box(7, 6)}
    </>
  ),
  // A decimal column sum with the point in its own column, 3.8 set under 12.75
  // by the point and the answer row's point already printed; a powers line under it.
  decimals: () => (
    <>
      {digit(5, 2, '1')}{digit(6, 2, '2')}{digit(7, 2, '.')}{digit(8, 2, '7')}{digit(9, 2, '5')}
      {digit(3, 3, '+')}{digit(6, 3, '3')}{digit(7, 3, '.')}{digit(8, 3, '8')}
      {rule(3, 10, 4)}
      {blank(5, 4)}{blank(6, 4)}{digit(7, 4, '.')}{blank(8, 4)}{blank(9, 4)}
      {digit(3, 6, '3')}{digit(4, 6, '.')}{digit(5, 6, '4')}{digit(6, 6, '×')}{digit(7, 6, '1')}{digit(8, 6, '0')}{digit(9, 6, '=')}
      {blank(10, 6)}{blank(11, 6)}
    </>
  ),
  // The one screen-only sheet: an equation with a movable term.
  eqexplore: () => (
    <>
      {box(4, 2)}{digit(5, 2, '+')}{digit(6, 2, '3')}{digit(7, 2, '=')}{digit(8, 2, '8')}
      {rule(3, 10, 5, 1)}
      <circle cx={ln(6)} cy={ln(5)} r="2.6" fill="currentColor" opacity="0.85" />
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
