/**
 * Long-division problem generation and frame geometry.
 *
 * Pure functions, kept out of the component so they can be unit-tested and so
 * the file exports components only (react-refresh).
 */

import { asHelpers } from './rng.js'
import { makeSheetShape } from './sheet.js'

export const PRESETS = [
  { value: '3x1', dividendDigits: 3, divisorDigits: 1 },
  { value: '4x1', dividendDigits: 4, divisorDigits: 1 },
  { value: '4x2', dividendDigits: 4, divisorDigits: 2 },
  { value: '5x2', dividendDigits: 5, divisorDigits: 2 },
]

/** The two ways long division is written; see frameLayout. */
export const NOTATIONS = ['bracket', 'corner']

/**
 * Frames are tall, so they sit directly under each other; the spare square
 * each item carries is the only separator. The one square below the header is
 * not decoration: a division frame grows *upward* into its quotient row
 * (.coldiv-item is flex-start, unlike the carry-space above a column sum), so
 * without it the first row's quotient boxes butt against the header rule. It
 * is free — rowsPerPage returns the same count for every preset and notation.
 */
export const SHEET_SPACING = { rowGap: 0, headerGap: 1 }

/**
 * Quotient digits a frame reserves room for.
 *
 * The algorithm costs two workspace rows per quotient digit, and three rows of
 * problems only fit a printed page while a frame stays at most eight squares
 * tall (see rowsPerPage in useNotebookGrid). Eight squares buys three quotient
 * digits, so a 4-digit dividend over a 1-digit divisor asks for a 3-digit
 * quotient (4164 ÷ 6) rather than a 4-digit one (8248 ÷ 2) — which is the more
 * useful exercise anyway.
 */
export const MAX_QUOTIENT_DIGITS = 3

/**
 * Frame geometry in whole notebook squares. `col`/`row` are 0-based cell
 * indices; `vRule`/`hRule` coordinates are grid *lines*, so a rule at x = 3 is
 * painted between column 2 and column 3.
 *
 * Two notations, because long division is written two ways around the world:
 *  - `bracket` (US, UK, China): divisor ) dividend, quotient above the overbar;
 *  - `corner` (France, Germany, Italy, Spain, Russia): dividend | divisor,
 *    quotient under the divisor on the right.
 */
export function frameLayout(notation, dividendDigits, divisorDigits) {
  // Upper bound only: 1024 / 8 = 128 has one digit fewer. Every frame on a
  // sheet reserves the maximum so the problems are all the same height.
  const maxQuotient = Math.min(dividendDigits - divisorDigits + 1, MAX_QUOTIENT_DIGITS)

  if (notation === 'corner') {
    // [minus gutter][dividend][rule col][divisor, with the quotient below it]
    // The quotient can be longer than the divisor it is written under.
    const right = Math.max(divisorDigits, maxQuotient)
    // The divisor's column: the rule is painted on its left edge, so the
    // divisor sits directly against the rule.
    const ruleCol = 1 + dividendDigits
    // The first partial product shares row 1 with the quotient, so the corner
    // frame is one row shorter than the bracket one.
    const rows = 1 + 2 * maxQuotient
    return {
      notation,
      maxQuotient,
      rows,
      cols: ruleCol + right,
      dividend: { col: 1, row: 0 },
      divisor: { col: ruleCol, row: 0 },
      quotient: { col: ruleCol, row: 1, width: right, align: 'left' },
      vRule: { x: ruleCol, y0: 0, y1: rows },
      hRule: { y: 1, x0: ruleCol, x1: ruleCol + right },
    }
  }

  // [divisor][rule col, which doubles as the minus gutter][dividend]
  const ruleCol = divisorDigits
  return {
    notation,
    maxQuotient,
    rows: 2 + 2 * maxQuotient,
    cols: ruleCol + 1 + dividendDigits,
    divisor: { col: 0, row: 1, width: divisorDigits, align: 'right' },
    dividend: { col: ruleCol + 1, row: 1 },
    quotient: { col: ruleCol + 1, row: 0, width: dividendDigits, align: 'right' },
    vRule: { x: ruleCol + 1, y0: 1, y1: 2 },
    hRule: { y: 1, x0: ruleCol + 1, x1: ruleCol + 1 + dividendDigits },
  }
}

/**
 * A problem whose dividend has exactly `dividendDigits` digits and whose
 * divisor has exactly `divisorDigits` (never 0 or 1).
 *
 * Exact mode samples the *quotient* uniformly over the multiples of the chosen
 * divisor that land in range. Sampling a dividend and rounding it down to a
 * multiple would over-represent the multiples nearest the ends of the range,
 * and rejection-sampling divisibility would waste up to 98 draws per problem.
 */
export function generateProblem(dividendDigits, divisorDigits, allowRemainder, rng) {
  const r = asHelpers(rng)
  const divisorMax = 10 ** divisorDigits - 1
  const dividendMin = 10 ** (dividendDigits - 1)
  const dividendMax = 10 ** dividendDigits - 1
  // The quotient must fit the boxes the frame reserves for it.
  const quotientMax = 10 ** Math.min(dividendDigits - divisorDigits + 1, MAX_QUOTIENT_DIGITS) - 1
  // A divisor small enough to push the quotient past those boxes is not a
  // problem this frame can hold: 10000 ÷ 10 wants four quotient digits where
  // three are drawn. The smallest divisor is therefore the one whose quotient
  // still fits, not simply the smallest number of the right length. The extra
  // unit is the remainder's headroom. Every preset before 5 ÷ 2 lands back on
  // 2, 2 and 10, so the sheets they deal are unchanged.
  const divisorMin = Math.max(2, 10 ** (divisorDigits - 1), Math.ceil((dividendMin + 1) / quotientMax))

  const divisor = r.int(divisorMin, divisorMax)

  if (allowRemainder) {
    // Leave a unit of headroom at each end so the dividend keeps its length
    // once the remainder is added.
    const quotient = r.int(
      Math.ceil((dividendMin + 1) / divisor),
      Math.min(quotientMax, Math.floor((dividendMax - 1) / divisor)),
    )
    const remainder = r.int(1, Math.min(divisor - 1, dividendMax - quotient * divisor))
    return { dividend: quotient * divisor + remainder, divisor, quotient, remainder }
  }

  const quotient = r.int(
    Math.ceil(dividendMin / divisor),
    Math.min(quotientMax, Math.floor(dividendMax / divisor)),
  )
  return { dividend: quotient * divisor, divisor, quotient, remainder: 0 }
}

/**
 * `count` problems for one sheet. With remainders allowed, some divisions are
 * still exact so a remainder has to be checked for rather than assumed.
 */
export function generateProblems(count, dividendDigits, divisorDigits, allowRemainder, rng = Math.random) {
  const r = asHelpers(rng)
  const items = []
  for (let i = 0; i < count; i++) {
    items.push(generateProblem(dividendDigits, divisorDigits, allowRemainder && r.int(1, 100) <= 70, r))
  }
  return items
}

/** Squares a frame takes for a setting; `layout` is the frameLayout its problems are painted from. */
export function sheetFrame({ notation, dividendDigits, divisorDigits }) {
  const layout = frameLayout(notation, dividendDigits, divisorDigits)
  return { rows: layout.rows, cellsWide: layout.cols, layout }
}

/**
 * Everything that follows from the settings (see makeSheetShape in
 * src/lib/sheet.js). Nine squares is the widest a frame can be and still print
 * four to a row; every preset clears that today, and a wider frame would narrow
 * the choice rather than spill onto a second page.
 */
export const sheetShape = makeSheetShape({ sheetFrame, spacing: SHEET_SPACING })
