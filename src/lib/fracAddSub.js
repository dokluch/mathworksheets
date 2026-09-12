import { asHelpers } from './rng.js'
import { COLUMN_OPTIONS, columnOptionsFor, dealUnique, dealer, makeSheetShape } from './sheet.js'
import { addFractions, compareFractions, fromMixed, lcm, mixedSquares, subFractions, toMixed } from './fractionMath.js'

/**
 * Problem generation and notebook geometry for the Add & Subtract Fractions
 * sheet, written on the grid with the Fraction primitive: two rows of squares
 * per problem, the bar on the grid line between them.
 *
 * Three levels, in the order schools teach them:
 *  - like: the same denominator on both sides, results below 1;
 *  - unlike: different denominators whose common denominator stays within the
 *    limit, so the answer never needs a denominator wider than the limit;
 *  - mixed: mixed numbers, where half the sums carry past a whole and half the
 *    differences borrow one.
 *
 * Results are never negative and never zero, and the answer key always gives
 * the simplest form.
 */

export const LEVELS = ['like', 'unlike', 'mixed']
export const OPS = ['add', 'sub', 'both']
export const LIMITS = [10, 12, 20]
export const ANSWER_FORMS = ['mixed', 'improper']
export { COLUMN_OPTIONS, columnOptionsFor }
/** One line of working under every problem, for the common denominator. */
export const SHEET_SPACING = { rowGap: 1, headerGap: 0 }
export const PROBLEM_ROWS = 2
/** Largest whole part anywhere, so a whole part is always a single square. */
export const WHOLE_MAX = 9
/** Share of mixed-number problems that carry past a whole or borrow one. */
export const REGROUP_SHARE = 0.5
const MIXED_TRIES = 60

/**
 * Denominator pairs a level can use. Like denominators start at 3, because
 * halves admit no sum below 1 and no difference above 0. Unlike ones must have
 * a common denominator within the limit. Mixed numbers use either.
 */
export function denominatorPairs(level, limit) {
  const pairs = []
  for (let b = 2; b <= limit; b++) {
    for (let d = 2; d <= limit; d++) {
      const like = b === d
      const fits = like ? level !== 'unlike' && (level === 'mixed' || b >= 3) : level !== 'like' && lcm(b, d) <= limit
      if (fits) pairs.push([b, d])
    }
  }
  return pairs
}

/** Every like or unlike problem for one operation: sums stay below 1, differences stay above 0. */
export function problemPool(level, op, limit) {
  const pool = []
  for (const [b, d] of denominatorPairs(level, limit)) {
    for (let x = 1; x < b; x++) {
      for (let y = 1; y < d; y++) {
        const ok = op === 'add' ? x * d + y * b < b * d : x * d > y * b
        if (ok) pool.push([{ n: x, d: b }, { n: y, d }])
      }
    }
  }
  return pool
}

function build(level, op, a, b) {
  const exact = op === 'add' ? addFractions(fromMixed(a), fromMixed(b)) : subFractions(fromMixed(a), fromMixed(b))
  return { level, op, a, b, result: exact, mixed: toMixed(exact) }
}

/** A problem that always satisfies the rules, for the rare page where sixty draws in a row miss. */
const MIXED_FALLBACK = {
  add: [{ w: 1, n: 1, d: 4 }, { w: 1, n: 1, d: 2 }],
  sub: [{ w: 3, n: 1, d: 2 }, { w: 1, n: 1, d: 4 }],
}

/**
 * A mixed-number problem. Whether it regroups is decided first, so the share
 * holds whatever the denominators happen to be; the whole parts are then drawn
 * so the result stays between 1 and WHOLE_MAX and keeps a fractional part.
 */
function mixedProblem(op, pairs, r) {
  const regroup = r.chance(REGROUP_SHARE)
  for (let tries = 0; tries < MIXED_TRIES; tries++) {
    const [bd, dd] = r.pick(pairs)
    const x = { n: r.int(1, bd - 1), d: bd }
    const y = { n: r.int(1, dd - 1), d: dd }
    // A sum of exactly 1, or two equal fractions, leaves no fractional part.
    const cmp = op === 'add' ? compareFractions(addFractions(x, y), { n: 1, d: 1 }) : compareFractions(x, y)
    if (cmp === 0) continue
    if (op === 'add' ? (cmp > 0) !== regroup : (cmp < 0) !== regroup) continue

    const carry = regroup ? 1 : 0
    if (op === 'add') {
      const w = r.int(1, WHOLE_MAX - 1 - carry)
      const v = r.int(1, WHOLE_MAX - w - carry)
      return build('mixed', op, { w, ...x }, { w: v, ...y })
    }
    const v = r.int(1, WHOLE_MAX - 1 - carry)
    const w = r.int(v + 1 + carry, WHOLE_MAX)
    return build('mixed', op, { w, ...x }, { w: v, ...y })
  }
  const [a, b] = MIXED_FALLBACK[op]
  return build('mixed', op, a, b)
}

const key = p => `${p.op}|${p.a.w} ${p.a.n}/${p.a.d}|${p.b.w} ${p.b.n}/${p.b.d}`

export function generateSheet({ level, op, limit, count }, rng = Math.random) {
  const r = asHelpers(rng)
  // A page set to both operations is half each, shuffled.
  const ops = op === 'both'
    ? r.shuffle(Array.from({ length: count }, (_, i) => (i % 2 ? 'sub' : 'add')))
    : Array.from({ length: count }, () => op)

  let next
  if (level === 'mixed') {
    const pairs = denominatorPairs('mixed', limit)
    next = problemOp => mixedProblem(problemOp, pairs, r)
  } else {
    const decks = {}
    next = problemOp => {
      decks[problemOp] ??= dealer(problemPool(level, problemOp, limit), r)
      const [x, y] = decks[problemOp]()
      return build(level, problemOp, { w: 0, ...x }, { w: 0, ...y })
    }
  }

  return dealUnique(ops.length, i => next(ops[i]), key)
}

/**
 * The answer as the child writes it. Below 1 it is always a fraction; above 1
 * it is a mixed number or an improper fraction, as the sheet is set.
 */
export function answerOf(item, answerForm) {
  if (item.mixed.w > 0 && answerForm === 'mixed') return item.mixed
  return { w: 0, n: item.result.n, d: item.result.d }
}

/** Squares an item takes: operand, sign, operand, =, answer. */
export function problemSquares(item, answerForm) {
  return mixedSquares(item.a) + 1 + mixedSquares(item.b) + 1 + mixedSquares(answerOf(item, answerForm))
}

/**
 * Squares a problem is budgeted. A fraction is as wide as the limit; a mixed
 * number adds its one-square whole part; an improper answer is as wide as the
 * largest numerator a result below WHOLE_MAX + 1 can have.
 */
export function sheetFrame({ level, limit, answerForm }) {
  const fraction = String(limit).length
  if (level !== 'mixed') return { rows: PROBLEM_ROWS, cellsWide: fraction + 1 + fraction + 1 + fraction }
  const operand = String(WHOLE_MAX).length + fraction
  const answer = answerForm === 'mixed' ? operand : String((WHOLE_MAX + 1) * limit - 1).length
  return { rows: PROBLEM_ROWS, cellsWide: operand + 1 + operand + 1 + answer }
}

/** Everything that follows from the settings (see makeSheetShape in src/lib/sheet.js). */
export const sheetShape = makeSheetShape({ sheetFrame, spacing: SHEET_SPACING })
