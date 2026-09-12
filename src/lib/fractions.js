import { asHelpers } from './rng.js'
import { COLUMN_OPTIONS, DEDUPE_TRIES, TIGHT_SPACING, columnOptionsFor, dealer, makeSheetShape } from './sheet.js'
import { compareFractions, fractionSquares, gcd, reduce } from './fractionMath.js'

/**
 * Problem generation and notebook geometry for the Fractions sheet: simplify a
 * fraction, complete an equivalent one, or compare two with >, < or =.
 *
 * A fraction is written the way it is in a squared exercise book: numerator in
 * one row of squares, denominator in the row under it, the bar on the grid line
 * between. Every problem is therefore two rows tall, and with every number at
 * most two digits every problem is five squares wide.
 */

export const LIMITS = [10, 12, 20]
export const KINDS = ['simplify', 'equivalent', 'compare']
export const PRACTICES = [...KINDS, 'mixed']
export { COLUMN_OPTIONS, columnOptionsFor }
/** Problems sit one empty square apart — the spare row each item carries above it. */
export const SHEET_SPACING = TIGHT_SPACING
export const PROBLEM_ROWS = 2
/** Share of comparisons that come out equal, so = is an answer that has to be checked for. */
export const EQUAL_SHARE = 0.15

/** Every proper fraction up to the limit that still has a common factor to cancel. */
export function simplifyPool(limit) {
  const pool = []
  for (let d = 2; d <= limit; d++) {
    for (let n = 1; n < d; n++) if (gcd(n, d) > 1) pool.push({ n, d })
  }
  return pool
}

/**
 * Every (reduced fraction, multiplier) pair whose scaled denominator stays
 * within the limit: 2/3 × 4 = 8/12 at limit 12, but not at 10.
 */
export function equivalentPool(limit) {
  const pool = []
  for (let d = 2; d <= limit; d++) {
    for (let n = 1; n < d; n++) {
      if (gcd(n, d) !== 1) continue
      for (let k = 2; k * d <= limit; k++) pool.push({ n, d, k })
    }
  }
  return pool
}

const SIGNS = { '-1': '<', 0: '=', 1: '>' }

/**
 * The traps a comparison can set. Each returns a pair or null when the limit
 * leaves it no room; the sheet tries them in a shuffled order so no trap
 * dominates a page.
 */
function compareStrategies(limit, r) {
  return [
    // Same denominator: only the numerators matter (3/8 vs 5/8).
    ['sameDenominator', () => {
      const d = r.int(3, limit)
      const a = r.int(1, d - 1)
      const c = r.int(1, d - 1)
      return a === c ? null : [{ n: a, d }, { n: c, d }]
    }],
    // Same numerator: the bigger denominator is the smaller fraction (2/5 vs 2/9).
    ['sameNumerator', () => {
      const n = r.int(1, limit - 2)
      const b = r.int(n + 1, limit)
      const d = r.int(n + 1, limit)
      return b === d ? null : [{ n, d: b }, { n, d }]
    }],
    // One more on top and bottom is closer to 1, not equal (3/4 vs 4/5).
    ['offByOne', () => {
      const n = r.int(1, limit - 2)
      const d = r.int(n + 1, limit - 1)
      return [{ n, d }, { n: n + 1, d: d + 1 }]
    }],
    // One either side of a half, with unlike denominators (3/7 vs 5/9).
    ['straddleHalf', () => {
      const b = r.int(3, limit)
      const d = r.int(3, limit)
      if (b === d) return null
      const below = r.int(1, Math.ceil(b / 2) - 1)
      const above = r.int(Math.floor(d / 2) + 1, d - 1)
      if (below < 1 || above >= d) return null
      return [{ n: below, d: b }, { n: above, d }]
    }],
  ]
}

/** Two proper fractions with different denominators and different values. */
function unlikePair(limit, r) {
  for (;;) {
    const b = r.int(2, limit)
    const d = r.int(2, limit)
    if (b === d) continue
    const a = { n: r.int(1, b - 1), d: b }
    const c = { n: r.int(1, d - 1), d }
    if (compareFractions(a, c) !== 0) return [a, c]
  }
}

/**
 * Two different spellings of one value (2/4 vs 3/6). One side may be the
 * reduced form itself. Null only when no reduced fraction has two spellings
 * under the limit, which never happens from limit 4 up.
 */
function equalPair(limit, r) {
  const bases = []
  for (let d = 2; d * 2 <= limit; d++) {
    for (let n = 1; n < d; n++) if (gcd(n, d) === 1) bases.push({ n, d })
  }
  if (!bases.length) return null
  const base = r.pick(bases)
  const multipliers = []
  for (let k = 1; k * base.d <= limit; k++) multipliers.push(k)
  const [k1, k2] = r.shuffle(multipliers)
  return [{ n: base.n * k1, d: base.d * k1 }, { n: base.n * k2, d: base.d * k2 }]
}

function comparison(limit, r) {
  let pair = null
  let strategy = 'equal'
  if (r.chance(EQUAL_SHARE)) pair = equalPair(limit, r)
  if (!pair) {
    for (const [name, build] of r.shuffle(compareStrategies(limit, r))) {
      pair = build()
      if (pair) {
        strategy = name
        break
      }
    }
  }
  if (!pair) {
    pair = unlikePair(limit, r)
    strategy = 'unlike'
  }
  const [a, b] = r.chance(0.5) ? pair : [pair[1], pair[0]]
  return { kind: 'compare', strategy, a, b, answer: SIGNS[compareFractions(a, b)] }
}

const compareKey = p => `${p.a.n}/${p.a.d}|${p.b.n}/${p.b.d}`

export function generateSheet({ practice, limit, count }, rng = Math.random) {
  const r = asHelpers(rng)
  const simplify = dealer(simplifyPool(limit), r)
  const equivalent = dealer(equivalentPool(limit), r)
  const seen = new Set()

  // A mixed page is a third of each kind, shuffled, so no kind is left out.
  const kinds = practice === 'mixed'
    ? r.shuffle(Array.from({ length: count }, (_, i) => KINDS[i % KINDS.length]))
    : Array.from({ length: count }, () => practice)

  return kinds.map(kind => {
    if (kind === 'simplify') {
      const a = simplify()
      return { kind, a, answer: reduce(a) }
    }
    if (kind === 'equivalent') {
      const { n, d, k } = equivalent()
      return { kind, a: { n, d }, b: { n: n * k, d: d * k }, blank: r.chance(0.5) ? 'n' : 'd' }
    }
    let item = comparison(limit, r)
    for (let tries = 0; tries < DEDUPE_TRIES && seen.has(compareKey(item)); tries++) item = comparison(limit, r)
    seen.add(compareKey(item))
    return item
  })
}

/** The two fractions an item prints, left and right of its sign. */
export function itemFractions(item) {
  return item.kind === 'simplify' ? [item.a, item.answer] : [item.a, item.b]
}

/** Squares an item takes: a fraction, the sign, a fraction. */
export function problemSquares(item) {
  const [left, right] = itemFractions(item)
  return fractionSquares(left) + 1 + fractionSquares(right)
}

/** Squares a problem is budgeted: two fractions as wide as the limit, and the sign. */
export function sheetFrame({ limit }) {
  const width = String(limit).length
  return { rows: PROBLEM_ROWS, cellsWide: width + 1 + width }
}

/** Everything that follows from the settings (see makeSheetShape in src/lib/sheet.js). */
export const sheetShape = makeSheetShape({ sheetFrame, spacing: SHEET_SPACING })
