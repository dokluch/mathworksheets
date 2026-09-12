import { asHelpers } from './rng.js'

/**
 * Problem generation for the Column Addition & Subtraction sheet: vertical
 * multi-digit sums and differences written one digit per notebook square.
 *
 * Both operands of a problem have the same number of digits. That is what lets
 * every problem of a sheet sit on `digits + 1` columns (the extra one is the
 * carry), so the grid lines up down the page and the sheet's size on paper is
 * fixed by the setting rather than by the draw.
 *
 * Pure functions, kept out of the component so they can be unit-tested and so
 * the file exports components only (react-refresh).
 */

export const DIGIT_PRESETS = [2, 3, 4]
export const OPS = ['add', 'subtract', 'mixed']
/** Problems sit one blank row apart — the next problem's carry row. */
export const SHEET_SPACING = { rowGap: 0, headerGap: 0 }
/** Rows a problem occupies: two operands and the result. */
export const PROBLEM_ROWS = 3
/** Share of problems that must regroup when the option is on; the rest are variety. */
export const REGROUP_SHARE = 75

/** True when adding the two numbers carries out of at least one column. */
export function hasCarry(a, b) {
  let x = a
  let y = b
  while (x > 0 || y > 0) {
    if ((x % 10) + (y % 10) >= 10) return true
    x = Math.floor(x / 10)
    y = Math.floor(y / 10)
  }
  return false
}

/**
 * True when subtracting b from a borrows in at least one column.
 *
 * A borrow chain always starts at a column where the minuend's digit is the
 * smaller one, so testing the digits pairwise is enough: no chain can begin
 * without such a column, and one such column always begins a chain.
 */
export function needsBorrow(a, b) {
  let x = a
  let y = b
  while (y > 0) {
    if (x % 10 < y % 10) return true
    x = Math.floor(x / 10)
    y = Math.floor(y / 10)
  }
  return false
}

/**
 * One problem. `requireRegroup` is a preference, not a guarantee: after 40
 * draws the sheet takes what it has rather than looping, which matters at 2
 * digits where the pool is small.
 */
export function generateProblem({ digits, op, requireRegroup }, r) {
  const min = 10 ** (digits - 1)
  const max = 10 ** digits - 1

  if (op === 'subtract') {
    for (let attempt = 0; attempt < 40; attempt++) {
      const [a, b] = order(r.int(min, max), r.int(min, max))
      if (a === b) continue
      if (!requireRegroup || needsBorrow(a, b)) return { a, b, op, result: a - b }
    }
    const [a, b] = order(r.int(min, max), r.int(min, max))
    // A difference of zero leaves a row of blanks that only ever holds 0.
    const lower = a === b ? (a > min ? b - 1 : b + 1) : b
    const [hi, lo] = order(a, lower)
    return { a: hi, b: lo, op, result: hi - lo }
  }

  for (let attempt = 0; attempt < 40; attempt++) {
    const a = r.int(min, max)
    const b = r.int(min, max)
    if (!requireRegroup || hasCarry(a, b)) return { a, b, op: 'add', result: a + b }
  }

  const a = r.int(min, max)
  const b = r.int(min, max)
  return { a, b, op: 'add', result: a + b }
}

/** Larger first: a difference is never negative, and a sum does not care. */
function order(x, y) {
  return x >= y ? [x, y] : [y, x]
}

/** One page: mostly regrouping practice, with occasional plain problems for variety. */
export function generateSheet({ count, digits, preferCarry, op = 'add' }, rng = Math.random) {
  const r = asHelpers(rng)
  const items = []
  for (let i = 0; i < count; i++) {
    // On a mixed sheet the operation is drawn first, so the two operations
    // deal from the same stream and neither is the one that "comes second".
    const problemOp = op === 'mixed' ? (r.chance(0.5) ? 'add' : 'subtract') : op
    const requireRegroup = preferCarry && r.int(1, 100) <= REGROUP_SHARE
    items.push(generateProblem({ digits, op: problemOp, requireRegroup }, r))
  }
  return items
}

/** Squares a problem occupies: one column per digit, plus one for the carry. */
export function digitColumns(digits) {
  return digits + 1
}
