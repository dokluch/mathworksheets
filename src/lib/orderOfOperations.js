/**
 * Order-of-operations expression generator.
 *
 * Extracted from the component, unlike the other sheets' generators, because an
 * expression has something the others do not: a printed form that can disagree
 * with the answer stored beside it. Everything here exists to make that
 * disagreement impossible rather than unlikely.
 *
 * Three rules carry the design:
 *
 * 1. The tree holds no glyphs. Operators are the ASCII four; `·` `×` `:` `÷`
 *    are chosen at paint time, so switching notation re-renders and regenerates
 *    nothing.
 * 2. The tree holds no brackets. `renderTokens` derives them from precedence,
 *    so the printed string cannot claim an order the answer was not computed in.
 * 3. Only trees precedence alone can reproduce are allowed (`isCanonical`).
 *    Without it `a · (b : c)` would print as `a · b : c` — same answer, but a
 *    child computing left to right meets `a · b`, which the generator never
 *    checked and which can run well past 100.
 */
import { asHelpers, rngHelpers } from './rng.js'


const PREC = { '+': 1, '-': 1, '*': 2, '/': 2 }
const APPLY = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
}

/** Nothing on the sheet — operand, step or answer — leaves 2..100. */
export const MAX_VALUE = 100
/** Multiplication and division stay inside the times tables a grade 2–3 child knows. */
export const MIN_FACTOR = 2
export const MAX_FACTOR = 10

export const num = n => ({ n })
export const op = (o, l, r) => ({ op: o, l, r })
export const isLeaf = node => node.op === undefined

export function evaluate(node) {
  if (isLeaf(node)) return node.n
  return APPLY[node.op](evaluate(node.l), evaluate(node.r))
}

/**
 * Every application in the order a child performs them. These are the numbers
 * that get written down, so they — not just the answer — are what the 2..100
 * promise is about, and what `isValid` checks.
 */
export function steps(node, out = []) {
  if (isLeaf(node)) return out
  steps(node.l, out)
  steps(node.r, out)
  out.push({ op: node.op, a: evaluate(node.l), b: evaluate(node.r), value: evaluate(node) })
  return out
}

/**
 * Can precedence alone reproduce this tree?
 *
 * A same-precedence right child is only honest under `-` and `/`, which
 * `renderTokens` brackets. Anywhere else the printed string re-associates:
 * `a + (b - c)` prints as `a + b - c`, and the child works through different
 * intermediates than the ones the generator constrained.
 */
export function isCanonical(node) {
  if (isLeaf(node)) return true
  const r = node.r
  if (!isLeaf(r) && PREC[r.op] === PREC[node.op] && node.op !== '-' && node.op !== '/') return false
  return isCanonical(node.l) && isCanonical(node.r)
}

/**
 * Flat token stream: `{t:'n', v}` | `{t:'op', v}` | `{t:'('}` | `{t:')'}`.
 * Brackets appear exactly where precedence would otherwise lose them.
 */
export function renderTokens(node) {
  const out = []
  walk(node, null, false)
  return out

  function walk(n, parentOp, isRight) {
    if (isLeaf(n)) {
      out.push({ t: 'n', v: n.n })
      return
    }
    const needs = parentOp !== null && (
      PREC[n.op] < PREC[parentOp] ||
      (isRight && PREC[n.op] === PREC[parentOp] && (parentOp === '-' || parentOp === '/'))
    )
    if (needs) out.push({ t: '(' })
    walk(n.l, n.op, false)
    out.push({ t: 'op', v: n.op })
    walk(n.r, n.op, true)
    if (needs) out.push({ t: ')' })
  }
}

/** Notation-free identity of a printed expression, so a sheet can de-duplicate. */
export const renderKey = node => renderTokens(node).map(k => k.v ?? k.t).join(' ')

export const NOTATIONS = ['dot', 'cross']
const GLYPHS = {
  dot: { '*': '·', '/': ':' },
  cross: { '*': '×', '/': '÷' },
}

/** Minus is U+2212 across the site, as in AddSubtract; only × and ÷ vary by locale. */
export function glyph(o, notation) {
  if (o === '+') return '+'
  if (o === '-') return '−'
  return (GLYPHS[notation] ?? GLYPHS.dot)[o]
}

/* ── Validation ───────────────────────────────────────────────────────────── */

const leaves = (node, out = []) => {
  if (isLeaf(node)) out.push(node.n)
  else { leaves(node.l, out); leaves(node.r, out) }
  return out
}

/**
 * One gate, applied to the tree the renderer will print — which is safe only
 * because `isCanonical` guarantees the printed string reproduces this tree.
 *
 * It also refuses a bracket a child could ignore. Leaves of at least 2 make
 * most brackets matter — `a − (b ± c)` differs from `a − b ± c` unless c is 0,
 * and `(a + b)·c` from `a + b·c` unless a is 0 or c is 1 — but not every one:
 * 73 − (6 − 2)·3 and 73 − 6 − 2·3 are both 61. So the printed expression is
 * also read with its brackets taken out, and must then give another answer.
 */
export function isValid(node) {
  if (!node || !isCanonical(node)) return false
  if (!leaves(node).every(n => Number.isInteger(n) && n >= 2 && n <= MAX_VALUE)) return false

  const answer = evaluate(node)
  if (!Number.isInteger(answer) || answer < 2 || answer > MAX_VALUE) return false

  const inTables = n => n >= MIN_FACTOR && n <= MAX_FACTOR
  for (const { op: o, a, b, value } of steps(node)) {
    if (!Number.isInteger(value) || value < 2 || value > MAX_VALUE) return false
    // No ×1, no off-table facts, no remainders, no ÷1 — all of it lives here.
    if (o === '*' && !(inTables(a) && inTables(b))) return false
    if (o === '/' && !(inTables(b) && inTables(value) && a % b === 0)) return false
  }

  const tokens = renderTokens(node)
  return !tokens.some(k => k.t === '(') || valueWithoutBrackets(tokens) !== answer
}

/** Printed tokens read by precedence alone, as if the brackets were not there. */
function valueWithoutBrackets(tokens) {
  const flat = tokens.filter(k => k.t === 'n' || k.t === 'op')
  const terms = [flat[0].v]
  const signs = []
  for (let i = 1; i < flat.length; i += 2) {
    const o = flat[i].v
    const v = flat[i + 1].v
    if (o === '*') terms[terms.length - 1] *= v
    else if (o === '/') terms[terms.length - 1] /= v
    else { signs.push(o); terms.push(v) }
  }
  return terms.reduce((sum, v, i) => (signs[i - 1] === '-' ? sum - v : sum + v))
}

/* ── Shapes ───────────────────────────────────────────────────────────────── */

/** A times-table fact, chosen before the operands around it so it always fits. */
const fact = (r = rngHelpers()) => {
  const a = r.int(MIN_FACTOR, MAX_FACTOR)
  const b = r.int(MIN_FACTOR, MAX_FACTOR)
  return { a, b, p: a * b }
}

/** An exact division inside the tables: n : d = q. */
const divFact = (r = rngHelpers(), minQ = MIN_FACTOR) => {
  const d = r.int(MIN_FACTOR, MAX_FACTOR)
  const q = r.int(minQ, MAX_FACTOR)
  return { n: d * q, d, q }
}

/**
 * Every shape the sheet can print, sampled backwards — the fact or the
 * bracket's value is chosen first, then the operands around it from the range
 * that keeps the total in bounds. `isValid` is then a net rather than the
 * mechanism, and a `build(r)` (drawing from the helpers `r`) that cannot place
 * a number returns null instead of a bad tree.
 *
 * The ramp is structural, not by size: easy is two operations of one
 * precedence class, medium is two operations spanning both, hard is three. A
 * test pins exactly that, so a shape filed under the wrong level fails in CI.
 */
export const SHAPES = [
  /* Easy — + and − only. The only bracket that can matter here is one after a
     minus; `(a + b) − c` would print without brackets, so it is not a shape. */
  { id: 'e_add_add', level: 'easy', brackets: false, build(r = rngHelpers()) {
    const a = r.int(2, 60), b = r.int(2, 60)
    if (a + b > MAX_VALUE - 2) return null
    return op('+', op('+', num(a), num(b)), num(r.int(2, MAX_VALUE - a - b)))
  } },
  { id: 'e_sub_add', level: 'easy', brackets: false, build(r = rngHelpers()) {
    const b = r.int(2, 60), a = r.int(b + 2, MAX_VALUE)
    return op('+', op('-', num(a), num(b)), num(r.int(2, MAX_VALUE - (a - b))))
  } },
  { id: 'e_add_sub', level: 'easy', brackets: false, build(r = rngHelpers()) {
    const a = r.int(2, 60), b = r.int(2, MAX_VALUE - a)
    return op('-', op('+', num(a), num(b)), num(r.int(2, a + b - 2)))
  } },
  { id: 'e_sub_sub', level: 'easy', brackets: false, build(r = rngHelpers()) {
    const rest = r.int(2, 60), c = r.int(2, 20), b = r.int(2, 20)
    const a = rest + c + b
    if (a > MAX_VALUE) return null
    return op('-', op('-', num(a), num(b)), num(c))
  } },
  { id: 'e_sub_paren_add', level: 'easy', brackets: true, build(r = rngHelpers()) {
    const b = r.int(2, 45), c = r.int(2, 45), s = b + c
    if (s + 2 > MAX_VALUE) return null
    return op('-', num(r.int(s + 2, MAX_VALUE)), op('+', num(b), num(c)))
  } },
  { id: 'e_sub_paren_sub', level: 'easy', brackets: true, build(r = rngHelpers()) {
    const c = r.int(2, 30), b = r.int(c + 2, 60), inner = b - c
    return op('-', num(r.int(inner + 2, MAX_VALUE)), op('-', num(b), num(c)))
  } },

  /* Medium — three numbers, both precedence classes, exactly one × or ÷. */
  { id: 'm_add_mul', level: 'medium', brackets: false, build(r = rngHelpers()) {
    const { a, b, p } = fact(r)
    if (p + 2 > MAX_VALUE) return null
    return op('+', num(r.int(2, MAX_VALUE - p)), op('*', num(a), num(b)))
  } },
  { id: 'm_sub_mul', level: 'medium', brackets: false, build(r = rngHelpers()) {
    const { a, b, p } = fact(r)
    if (p + 2 > MAX_VALUE) return null
    return op('-', num(r.int(p + 2, MAX_VALUE)), op('*', num(a), num(b)))
  } },
  { id: 'm_mul_add', level: 'medium', brackets: false, build(r = rngHelpers()) {
    const { a, b, p } = fact(r)
    if (p + 2 > MAX_VALUE) return null
    return op('+', op('*', num(a), num(b)), num(r.int(2, MAX_VALUE - p)))
  } },
  { id: 'm_mul_sub', level: 'medium', brackets: false, build(r = rngHelpers()) {
    const { a, b, p } = fact(r)
    return op('-', op('*', num(a), num(b)), num(r.int(2, p - 2)))
  } },
  { id: 'm_add_div', level: 'medium', brackets: false, build(r = rngHelpers()) {
    const { n, d, q } = divFact(r)
    return op('+', num(r.int(2, MAX_VALUE - q)), op('/', num(n), num(d)))
  } },
  { id: 'm_sub_div', level: 'medium', brackets: false, build(r = rngHelpers()) {
    const { n, d, q } = divFact(r)
    return op('-', num(r.int(q + 2, MAX_VALUE)), op('/', num(n), num(d)))
  } },
  { id: 'm_div_add', level: 'medium', brackets: false, build(r = rngHelpers()) {
    const { n, d, q } = divFact(r)
    return op('+', op('/', num(n), num(d)), num(r.int(2, MAX_VALUE - q)))
  } },
  { id: 'm_div_sub', level: 'medium', brackets: false, build(r = rngHelpers()) {
    const { n, d, q } = divFact(r, 4)
    return op('-', op('/', num(n), num(d)), num(r.int(2, q - 2)))
  } },
  { id: 'm_paren_add_mul', level: 'medium', brackets: true, build(r = rngHelpers()) {
    // The bracket's value is a factor, so it has to land inside the tables too.
    const s = r.int(4, MAX_FACTOR), c = r.int(MIN_FACTOR, MAX_FACTOR)
    if (s * c > MAX_VALUE) return null
    const a = r.int(2, s - 2)
    return op('*', op('+', num(a), num(s - a)), num(c))
  } },
  { id: 'm_paren_sub_mul', level: 'medium', brackets: true, build(r = rngHelpers()) {
    const inner = r.int(MIN_FACTOR, MAX_FACTOR), c = r.int(MIN_FACTOR, MAX_FACTOR)
    if (inner * c > MAX_VALUE) return null
    const b = r.int(2, MAX_VALUE - inner)
    return op('*', op('-', num(b + inner), num(b)), num(c))
  } },
  { id: 'm_mul_paren_sub', level: 'medium', brackets: true, build(r = rngHelpers()) {
    const inner = r.int(MIN_FACTOR, MAX_FACTOR), c = r.int(MIN_FACTOR, MAX_FACTOR)
    if (inner * c > MAX_VALUE) return null
    const b = r.int(2, MAX_VALUE - inner)
    return op('*', num(c), op('-', num(b + inner), num(b)))
  } },
  { id: 'm_paren_add_div', level: 'medium', brackets: true, build(r = rngHelpers()) {
    const { n, d } = divFact(r)
    const a = r.int(2, n - 2)
    return op('/', op('+', num(a), num(n - a)), num(d))
  } },
  { id: 'm_div_paren_sub', level: 'medium', brackets: true, build(r = rngHelpers()) {
    const { n, d } = divFact(r)
    const c = r.int(2, MAX_VALUE - d)
    return op('/', num(n), op('-', num(c + d), num(c)))
  } },

  /* Hard — four numbers, three operations. */
  { id: 'h_mul_add_div', level: 'hard', brackets: false, build(r = rngHelpers()) {
    const { a, b, p } = fact(r), { n, d, q } = divFact(r)
    if (p + q > MAX_VALUE) return null
    return op('+', op('*', num(a), num(b)), op('/', num(n), num(d)))
  } },
  { id: 'h_div_sub_div', level: 'hard', brackets: false, build(r = rngHelpers()) {
    const first = divFact(r, 4)
    const d2 = r.int(MIN_FACTOR, MAX_FACTOR), q2 = r.int(2, first.q - 2)
    return op('-', op('/', num(first.n), num(first.d)), op('/', num(d2 * q2), num(d2)))
  } },
  { id: 'h_mul_sub_mul', level: 'hard', brackets: false, build(r = rngHelpers()) {
    const f1 = fact(r), f2 = fact(r)
    if (f1.p - f2.p < 2) return null
    return op('-', op('*', num(f1.a), num(f1.b)), op('*', num(f2.a), num(f2.b)))
  } },
  { id: 'h_sub_add_div', level: 'hard', brackets: false, build(r = rngHelpers()) {
    const { n, d, q } = divFact(r)
    const b = r.int(2, 60), a = r.int(b + 2, MAX_VALUE)
    if (a - b + q > MAX_VALUE) return null
    return op('+', op('-', num(a), num(b)), op('/', num(n), num(d)))
  } },
  { id: 'h_mul_mul_sub', level: 'hard', brackets: false, build(r = rngHelpers()) {
    // The inner product is itself a factor of the outer one, so it has to stay
    // inside the tables as well: 2·5·7 is fine, 6·8·2 is not.
    const a = r.int(2, 5), b = r.int(2, Math.floor(MAX_FACTOR / a))
    if (b < 2) return null
    const c = r.int(MIN_FACTOR, MAX_FACTOR), p = a * b * c
    if (p > MAX_VALUE) return null
    return op('-', op('*', op('*', num(a), num(b)), num(c)), num(r.int(2, p - 2)))
  } },
  { id: 'h_add_mul_paren', level: 'hard', brackets: true, build(r = rngHelpers()) {
    const inner = r.int(MIN_FACTOR, MAX_FACTOR), k = r.int(MIN_FACTOR, MAX_FACTOR)
    const p = inner * k
    if (p + 2 > MAX_VALUE) return null
    const d = r.int(2, MAX_VALUE - inner)
    return op('+', num(r.int(2, MAX_VALUE - p)), op('*', num(k), op('-', num(d + inner), num(d))))
  } },
  { id: 'h_sub_paren_mul', level: 'hard', brackets: true, build(r = rngHelpers()) {
    const inner = r.int(MIN_FACTOR, MAX_FACTOR), k = r.int(MIN_FACTOR, MAX_FACTOR)
    const p = inner * k
    if (p + 2 > MAX_VALUE) return null
    const c = r.int(2, MAX_VALUE - inner)
    return op('-', num(r.int(p + 2, MAX_VALUE)), op('*', op('-', num(c + inner), num(c)), num(k)))
  } },
  { id: 'h_div_paren_mul', level: 'hard', brackets: true, build(r = rngHelpers()) {
    const { n, d, q } = divFact(r), k = r.int(MIN_FACTOR, MAX_FACTOR)
    if (q * k > MAX_VALUE) return null
    const c = r.int(2, MAX_VALUE - d)
    return op('*', op('/', num(n), op('-', num(c + d), num(c))), num(k))
  } },
  { id: 'h_paren_add_mul_sub', level: 'hard', brackets: true, build(r = rngHelpers()) {
    const s = r.int(4, MAX_FACTOR), c = r.int(MIN_FACTOR, MAX_FACTOR), p = s * c
    if (p > MAX_VALUE) return null
    const a = r.int(2, s - 2)
    return op('-', op('*', op('+', num(a), num(s - a)), num(c)), num(r.int(2, p - 2)))
  } },
]

export const LEVELS = ['easy', 'medium', 'hard']

/** The shapes one setting of the panel can draw from. */
export function shapesFor(level, useBrackets) {
  return SHAPES.filter(s => s.level === level && (useBrackets || !s.brackets))
}

/* ── Sheets ───────────────────────────────────────────────────────────────── */

const ATTEMPTS_PER_SHAPE = 25

/**
 * The expression printed if every shape refuses, which the shipped catalogue
 * never does. Fixed rather than random: Patterns falls back to a different
 * level's generator, which cannot be tested and quietly changes the sheet. A
 * constant means a bug in the catalogue shows up as a repeated identical row —
 * visible — instead of as a hang.
 */
const FALLBACKS = {
  easy: () => op('+', op('-', num(45), num(17)), num(23)),
  medium: () => op('-', num(70), op('*', num(7), num(9))),
  hard: () => op('+', op('-', num(50), num(42)), op('/', num(40), num(5))),
}

const wrap = (tree, shape) => ({
  shape,
  tree,
  tokens: renderTokens(tree),
  answer: evaluate(tree),
  key: renderKey(tree),
})

export const fallbackExpression = level => wrap((FALLBACKS[level] ?? FALLBACKS.easy)(), 'fallback')

/** The catalogue cycled to `count` and shuffled, so no shape dominates a page. */
function shuffledBag(shapes, count, r) {
  const bag = []
  while (bag.length < count) bag.push(...shapes)
  return r.shuffle(bag)
}

/**
 * One page of expressions.
 *
 * Retrying a single shape until it yields would make the page's mix a random
 * walk and let de-duplication starve one shape, so a slot walks the bag: a
 * shape that cannot produce something fresh hands over to the next one.
 *
 * Three things keep a page from reading as one problem repeated — a printed
 * form never appears twice, the bag spreads the shapes evenly, and no answer
 * appears more than twice. The last is relaxed in the closing attempts so a
 * crowded page degrades into a repeated answer rather than a fallback row.
 */
export function generateSheet(count, level, useBrackets, rng = Math.random) {
  const r = asHelpers(rng)
  const shapes = shapesFor(level, useBrackets)
  const bag = shuffledBag(shapes, count, r)
  const seen = new Set()
  const answers = new Map()
  const items = []

  for (let i = 0; i < count; i++) {
    let picked = null
    for (let s = 0; s < shapes.length && !picked; s++) {
      const shape = bag[(i + s) % bag.length]
      for (let a = 0; a < ATTEMPTS_PER_SHAPE && !picked; a++) {
        const tree = shape.build(r)
        if (!isValid(tree)) continue
        const key = renderKey(tree)
        if (seen.has(key)) continue
        if (a < ATTEMPTS_PER_SHAPE - 5 && (answers.get(evaluate(tree)) ?? 0) >= 2) continue
        picked = wrap(tree, shape.id)
      }
    }
    const item = picked ?? fallbackExpression(level)
    seen.add(item.key)
    answers.set(item.answer, (answers.get(item.answer) ?? 0) + 1)
    items.push(item)
  }
  return items
}
