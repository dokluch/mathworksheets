import { asHelpers } from './rng.js'
import { COLUMN_OPTIONS, TIGHT_SPACING, columnOptionsFor, dealer, makeSheetShape } from './sheet.js'

/**
 * Problem generation and notebook geometry for the Division sheet: division
 * facts written on one line, 12 ÷ 3 = □, optionally with a remainder box.
 *
 * Every problem is a times-table fact read backwards (divisor 2–10, quotient
 * 1–10), so the sheet practises recall rather than a written method — Long
 * Division is the step after it. Like Add & Subtract, the problems sit on the
 * notebook grid one symbol per square, so the sheet's size on paper is fixed
 * by the widest problem a setting can produce.
 */

export const LIMITS = [20, 50, 100]
export { COLUMN_OPTIONS, columnOptionsFor }
/** Problems sit one empty square apart (the next problem's spare row), as on inline Add & Subtract. */
export const SHEET_SPACING = TIGHT_SPACING

export const DIVISOR_MIN = 2
export const DIVISOR_MAX = 10
export const QUOTIENT_MAX = 10
/** With remainders on, some problems still divide exactly, so a remainder is checked for rather than assumed. */
export const REMAINDER_SHARE = 0.7
/** Squares for the remainder mark: "r" sits centred in them, and the longer "ост." or "……" still fit. */
export const MARK_SQUARES = 2

/**
 * The (divisor, quotient) facts a sheet draws from: every pair whose dividend
 * stays within the limit, leaving room for a remainder of at least 1 when one
 * is wanted.
 *
 * A sheet deals *pairs* and only then picks a remainder, rather than dealing
 * from every distinct remainder problem: ÷ 10 has nine remainders per quotient
 * and ÷ 2 has one, so a flat pool would fill a page with divisions by 9 and 10.
 */
export function factPairs(limit, withRemainder) {
  const headroom = withRemainder ? 1 : 0
  const pairs = []
  for (let divisor = DIVISOR_MIN; divisor <= DIVISOR_MAX; divisor++) {
    for (let quotient = 1; quotient <= QUOTIENT_MAX; quotient++) {
      if (divisor * quotient + headroom <= limit) pairs.push({ divisor, quotient })
    }
  }
  return pairs
}

export function generateSheet({ limit, allowRemainder, count }, rng = Math.random) {
  const r = asHelpers(rng)
  const exact = dealer(factPairs(limit, false), r)
  const leftover = dealer(factPairs(limit, true), r)
  const items = []
  for (let i = 0; i < count; i++) {
    if (allowRemainder && r.chance(REMAINDER_SHARE)) {
      const { divisor, quotient } = leftover()
      const remainder = r.int(1, Math.min(divisor - 1, limit - divisor * quotient))
      items.push({ dividend: divisor * quotient + remainder, divisor, quotient, remainder })
    } else {
      const { divisor, quotient } = exact()
      items.push({ dividend: divisor * quotient, divisor, quotient, remainder: 0 })
    }
  }
  return items
}

/**
 * Squares a problem occupies: the dividend, the sign, a two-digit divisor
 * (÷ 10), "=" and a two-digit quotient (10), plus the mark and a one-digit
 * remainder when remainders are on.
 */
export function sheetFrame({ limit, allowRemainder }) {
  const base = String(limit).length + 1 + String(DIVISOR_MAX).length + 1 + String(QUOTIENT_MAX).length
  const tail = allowRemainder ? MARK_SQUARES + String(DIVISOR_MAX - 1).length : 0
  return { rows: 1, cellsWide: base + tail }
}

/**
 * Everything that follows from the settings: the column counts on offer, the
 * columns actually used (a persisted 4 falls back once the remainder box makes
 * the problems too wide), the geometry and how many problems fill one page.
 */
export const sheetShape = makeSheetShape({ sheetFrame, spacing: SHEET_SPACING })
