import { asHelpers } from './rng.js'
import { TIGHT_SPACING, columnOptionsFor as printableColumns, dealer, makeSheetShape } from './sheet.js'

/**
 * Problem generation and notebook geometry for the Solve for x sheet.
 *
 * Every equation is built backwards from its answer: x is drawn first, then
 * the numbers around it, so every step of the solution is a whole number and
 * x is always a positive integer within the chosen range.
 *
 * An equation is a list of tokens rather than a string, so it can be painted
 * one symbol per notebook square with the language's own × and ÷ signs, and so
 * a tiny parser (evaluateSides) can check it without trusting the builder:
 *   { t: 'n', v }   a number
 *   { t: 'x', c }   c·x, written "x" when c is 1
 *   { t: 'op', v }  '+', '-', '*' or '/'
 *   { t: '(' }, { t: ')' }, { t: '=' }
 * A number directly before a bracket multiplies it: 3(x + 2).
 *
 * Under every equation sit empty rows for the child's working, more for the
 * harder levels.
 */

export const LEVELS = ['one', 'two', 'both']
/** The answer x is drawn from 1 to the range. */
export const RANGES = [10, 20, 100]
/** Empty notebook rows under each equation, for the working. */
export const WORK_ROWS = { one: 2, two: 3, both: 4 }
export const COEF_MIN = 2
export const COEF_MAX = 9
/** The number added inside a bracket stays one digit, so 3(x + 2) never becomes 3(x + 47). */
export const BRACKET_ADDEND_MAX = 9
/** Constants on the left of an x-on-both-sides equation stay small; the right side carries the size. */
export const BOTH_CONST_MAX = 20
export const COLUMN_OPTIONS = [2, 3]
/** The working rows are the separator; problems need no gap of their own. */
export const SHEET_SPACING = TIGHT_SPACING
/** The same answer at most this often on a page, so a child cannot copy x down the column. */
export const SAME_ANSWER_MAX = 2
const STRICT_TRIES = 40
const LOOSE_TRIES = 200

/**
 * How often one answer may appear on a page. Twice, unless the range is too
 * small to fill the page that way with room to spare: eighteen problems with
 * answers from 1 to 10 would leave the last few draws hunting for the one or
 * two answers still allowed, so there a third use is permitted.
 */
export function answerCap(count, range) {
  return Math.max(SAME_ANSWER_MAX, Math.ceil((count * 1.5) / range))
}

const num = v => ({ t: 'n', v })
const xs = (c = 1) => ({ t: 'x', c })
const op = v => ({ t: 'op', v })
const EQ = { t: '=' }
const OPEN = { t: '(' }
const CLOSE = { t: ')' }

/**
 * Every equation shape, grouped by level. `draw` builds one from a random x (or
 * null when the numbers it drew leave no valid equation); `widest` builds the
 * widest one the range allows, which is what the sheet budgets squares for.
 */
export const SHAPES = [
  // One step.
  {
    id: 'add', level: 'one',
    draw: (r, range) => {
      const x = r.int(1, range)
      const b = r.int(1, range)
      return { x, tokens: [xs(), op('+'), num(b), EQ, num(x + b)] }
    },
    widest: range => [xs(), op('+'), num(range), EQ, num(2 * range)],
  },
  {
    id: 'sub', level: 'one',
    draw: (r, range) => {
      const x = r.int(2, range)
      const b = r.int(1, x - 1)
      return { x, tokens: [xs(), op('-'), num(b), EQ, num(x - b)] }
    },
    widest: range => [xs(), op('-'), num(range - 1), EQ, num(range - 1)],
  },
  {
    id: 'mul', level: 'one',
    draw: (r, range) => {
      const x = r.int(1, range)
      const a = r.int(COEF_MIN, COEF_MAX)
      return { x, tokens: [xs(a), EQ, num(a * x)] }
    },
    widest: range => [xs(COEF_MAX), EQ, num(COEF_MAX * range)],
  },
  {
    id: 'div', level: 'one',
    draw: (r, range) => {
      // Quotient first, so x is a multiple of the divisor and still within range.
      const a = r.int(COEF_MIN, COEF_MAX)
      const quotient = r.int(1, Math.max(1, Math.floor(range / a)))
      return { x: a * quotient, tokens: [xs(), op('/'), num(a), EQ, num(quotient)] }
    },
    widest: range => [xs(), op('/'), num(COEF_MAX), EQ, num(range)],
  },
  // Two steps.
  {
    id: 'mulAdd', level: 'two',
    draw: (r, range) => {
      const x = r.int(1, range)
      const a = r.int(COEF_MIN, COEF_MAX)
      const b = r.int(1, range)
      return { x, tokens: [xs(a), op('+'), num(b), EQ, num(a * x + b)] }
    },
    widest: range => [xs(COEF_MAX), op('+'), num(range), EQ, num(COEF_MAX * range + range)],
  },
  {
    id: 'mulSub', level: 'two',
    draw: (r, range) => {
      const x = r.int(1, range)
      const a = r.int(COEF_MIN, COEF_MAX)
      const b = r.int(1, Math.min(range, a * x - 1))
      return { x, tokens: [xs(a), op('-'), num(b), EQ, num(a * x - b)] }
    },
    widest: range => [xs(COEF_MAX), op('-'), num(range), EQ, num(COEF_MAX * range - 1)],
  },
  {
    id: 'bracketAdd', level: 'two',
    draw: (r, range) => {
      const x = r.int(1, range)
      const a = r.int(COEF_MIN, COEF_MAX)
      const b = r.int(1, BRACKET_ADDEND_MAX)
      return { x, tokens: [num(a), OPEN, xs(), op('+'), num(b), CLOSE, EQ, num(a * (x + b))] }
    },
    widest: range => [num(COEF_MAX), OPEN, xs(), op('+'), num(BRACKET_ADDEND_MAX), CLOSE, EQ, num(COEF_MAX * (range + BRACKET_ADDEND_MAX))],
  },
  {
    id: 'bracketSub', level: 'two',
    draw: (r, range) => {
      const x = r.int(2, range)
      const a = r.int(COEF_MIN, COEF_MAX)
      const b = r.int(1, Math.min(BRACKET_ADDEND_MAX, x - 1))
      return { x, tokens: [num(a), OPEN, xs(), op('-'), num(b), CLOSE, EQ, num(a * (x - b))] }
    },
    widest: range => [num(COEF_MAX), OPEN, xs(), op('-'), num(BRACKET_ADDEND_MAX), CLOSE, EQ, num(COEF_MAX * (range - 1))],
  },
  {
    id: 'divAdd', level: 'two',
    draw: (r, range) => {
      const a = r.int(COEF_MIN, COEF_MAX)
      const quotient = r.int(1, Math.max(1, Math.floor(range / a)))
      const b = r.int(1, range)
      return { x: a * quotient, tokens: [xs(), op('/'), num(a), op('+'), num(b), EQ, num(quotient + b)] }
    },
    widest: range => [xs(), op('/'), num(COEF_MAX), op('+'), num(range), EQ, num(2 * range)],
  },
  {
    id: 'divSub', level: 'two',
    draw: (r, range) => {
      const a = r.int(COEF_MIN, COEF_MAX)
      const most = Math.floor(range / a)
      if (most < 2) return null
      const quotient = r.int(2, most)
      const b = r.int(1, quotient - 1)
      return { x: a * quotient, tokens: [xs(), op('/'), num(a), op('-'), num(b), EQ, num(quotient - b)] }
    },
    widest: range => [xs(), op('/'), num(COEF_MAX), op('-'), num(range), EQ, num(range)],
  },
  // x on both sides.
  {
    id: 'bothAdd', level: 'both',
    draw: (r, range) => {
      const x = r.int(1, range)
      const a = r.int(COEF_MIN + 1, COEF_MAX)
      const c = r.int(1, a - 1)
      const b = r.int(1, BOTH_CONST_MAX)
      return { x, tokens: [xs(a), op('+'), num(b), EQ, xs(c), op('+'), num((a - c) * x + b)] }
    },
    widest: range => [xs(COEF_MAX), op('+'), num(BOTH_CONST_MAX), EQ, xs(COEF_MAX - 1), op('+'), num((COEF_MAX - 1) * range + BOTH_CONST_MAX)],
  },
  {
    id: 'bothSub', level: 'both',
    draw: (r, range) => {
      const x = r.int(1, range)
      const a = r.int(COEF_MIN + 1, COEF_MAX)
      const c = r.int(1, a - 1)
      const most = Math.min(BOTH_CONST_MAX, (a - c) * x - 1)
      if (most < 1) return null
      const b = r.int(1, most)
      return { x, tokens: [xs(a), op('-'), num(b), EQ, xs(c), op('+'), num((a - c) * x - b)] }
    },
    widest: range => [xs(COEF_MAX), op('-'), num(BOTH_CONST_MAX), EQ, xs(COEF_MAX - 1), op('+'), num((COEF_MAX - 1) * range - 1)],
  },
  {
    id: 'bothZero', level: 'both',
    draw: (r, range) => {
      const x = r.int(1, range)
      const a = r.int(COEF_MIN + 1, COEF_MAX)
      const c = r.int(1, a - 1)
      return { x, tokens: [xs(a), EQ, xs(c), op('+'), num((a - c) * x)] }
    },
    widest: range => [xs(COEF_MAX), EQ, xs(COEF_MAX - 1), op('+'), num((COEF_MAX - 1) * range)],
  },
]

/** Squares an equation takes: a digit per square, x in one, each sign and bracket in one. */
export function widthOf(tokens) {
  return tokens.reduce((sum, tok) => {
    if (tok.t === 'n') return sum + String(tok.v).length
    if (tok.t === 'x') return sum + (tok.c > 1 ? String(tok.c).length : 0) + 1
    return sum + 1
  }, 0)
}

/** A readable key for an equation, to keep a page free of repeats. */
export function renderKey(tokens) {
  return tokens.map(tok => {
    if (tok.t === 'n') return tok.v
    if (tok.t === 'x') return tok.c > 1 ? `${tok.c}x` : 'x'
    return tok.t === 'op' ? tok.v : tok.t
  }).join(' ')
}

/**
 * Both sides of an equation evaluated at x = value, by a small recursive-descent
 * parser: × and ÷ before + and −, brackets first, and a number directly before
 * a bracket multiplying it. Tests use it as an oracle independent of the shapes.
 */
export function evaluateSides(tokens, value) {
  const eq = tokens.findIndex(tok => tok.t === '=')
  return [evaluate(tokens.slice(0, eq), value), evaluate(tokens.slice(eq + 1), value)]
}

function evaluate(tokens, value) {
  let i = 0
  const peek = () => tokens[i]
  const factor = () => {
    const tok = tokens[i++]
    if (tok.t === 'n') return tok.v
    if (tok.t === 'x') return tok.c * value
    if (tok.t === '(') {
      const inner = expr()
      i++ // the closing bracket
      return inner
    }
    throw new Error(`unexpected token ${tok.t}`)
  }
  const term = () => {
    let v = factor()
    for (;;) {
      const tok = peek()
      if (tok?.t === 'op' && (tok.v === '*' || tok.v === '/')) {
        i++
        const rhs = factor()
        v = tok.v === '*' ? v * rhs : v / rhs
      } else if (tok?.t === '(') {
        v *= factor()
      } else {
        return v
      }
    }
  }
  const expr = () => {
    let v = term()
    for (;;) {
      const tok = peek()
      if (tok?.t === 'op' && (tok.v === '+' || tok.v === '-')) {
        i++
        const rhs = term()
        v = tok.v === '+' ? v + rhs : v - rhs
      } else {
        return v
      }
    }
  }
  return expr()
}

export function generateSheet({ level, range, count }, rng = Math.random) {
  const r = asHelpers(rng)
  // Shapes are dealt like cards, so every shape of the level appears on a page.
  const deal = dealer(SHAPES.filter(shape => shape.level === level), r)
  const seen = new Set()
  const answers = new Map()
  const cap = answerCap(count, range)

  // 'strict' keeps both rules. 'fresh' lets an answer appear once more than the
  // cap but still refuses a repeated equation, which a page must never show.
  // 'any' is the backstop that keeps the page full; it is not reached in practice.
  const draw = rule => {
    const shape = deal()
    const drawn = shape.draw(r, range)
    if (!drawn) return null
    const key = renderKey(drawn.tokens)
    if (rule !== 'any' && seen.has(key)) return null
    if (rule === 'strict' && (answers.get(drawn.x) ?? 0) >= cap) return null
    return { shape: shape.id, x: drawn.x, tokens: drawn.tokens, key }
  }

  return Array.from({ length: count }, () => {
    let item = null
    for (let tries = 0; !item && tries < STRICT_TRIES; tries++) item = draw('strict')
    for (let tries = 0; !item && tries < LOOSE_TRIES; tries++) item = draw('fresh')
    while (!item) item = draw('any')
    seen.add(item.key)
    answers.set(item.x, (answers.get(item.x) ?? 0) + 1)
    return { shape: item.shape, x: item.x, tokens: item.tokens }
  })
}

/** Squares a level's equations are budgeted: the widest any of its shapes can be at this range. */
export function sheetFrame({ level, range }) {
  const widest = Math.max(...SHAPES.filter(shape => shape.level === level).map(shape => widthOf(shape.widest(range))))
  return { rows: 1 + WORK_ROWS[level], cellsWide: widest }
}

/** Column counts that print at 1/4in squares without shrinking the grid. */
export function columnOptionsFor(cellsWide) {
  return printableColumns(cellsWide, COLUMN_OPTIONS)
}

/** Everything that follows from the settings (see makeSheetShape in src/lib/sheet.js). */
export const sheetShape = makeSheetShape({ sheetFrame, spacing: SHEET_SPACING, columnOptions: COLUMN_OPTIONS })
