import { describe, it, expect } from 'vitest'
import { mulberry32 } from './rng.js'
import {
  SHAPES, LEVELS, MAX_VALUE, MIN_FACTOR, MAX_FACTOR, NOTATIONS,
  num, op, isLeaf, evaluate, steps, isCanonical, renderTokens, renderKey,
  glyph, isValid, shapesFor, generateSheet, fallbackExpression,
} from './orderOfOperations.js'
import { listRowsPerPage, PRINT_ORDER_ROW, PRINT_WIDTH, PRINT_HEIGHT, SHEET_PAD_TOP } from '../hooks/useNotebookGrid.js'
import { ORDER_HEADER_PX, ORDER_CHAR_PX, ORDER_BOX_PX, ORDER_BOX_GAP } from '../components/OrderOfOperations.jsx'

/** The printed string, exactly as the component paints it. */
const printed = (tokens, notation) =>
  tokens.map(k => (k.t === 'n' ? k.v : k.t === 'op' ? glyph(k.v, notation) : k.t)).join(' ')

/**
 * Shunting-yard, written from the precedence rules rather than from the
 * generator, so a bug in renderTokens cannot hide behind evaluate(). It also
 * reports every intermediate it computes: those are the numbers a child
 * actually writes down, and they are what the 2..100 promise is about.
 */
function parsePrinted(s) {
  const tokens = s.match(/\d+|[()+\-−·:×÷]/g)
  const vals = []
  const ops = []
  const intermediates = []
  const prec = t => ('+-−'.includes(t) ? 1 : 2)
  const apply = () => {
    const o = ops.pop()
    const b = vals.pop()
    const a = vals.pop()
    const v = o === '+' ? a + b
      : o === '-' || o === '−' ? a - b
        : o === '·' || o === '×' ? a * b
          : a / b
    intermediates.push(v)
    vals.push(v)
  }
  for (const tk of tokens) {
    if (/^\d+$/.test(tk)) vals.push(Number(tk))
    else if (tk === '(') ops.push(tk)
    else if (tk === ')') {
      while (ops.at(-1) !== '(') apply()
      ops.pop()
    } else {
      while (ops.length && ops.at(-1) !== '(' && prec(ops.at(-1)) >= prec(tk)) apply()
      ops.push(tk)
    }
  }
  while (ops.length) apply()
  return { value: vals[0], intermediates }
}

/** Every level × bracket mode, with a decent sample of each. */
const CASES = LEVELS.flatMap(level => [true, false].map(brackets => ({ level, brackets })))
const sample = (level, brackets, n = 400) =>
  Array.from({ length: n }, () => generateSheet(1, level, brackets)[0])

describe('the parser this file checks the generator with', () => {
  it('agrees with hand-worked arithmetic, including brackets', () => {
    expect(parsePrinted('2 · 7 + 30 : 5').value).toBe(20)
    expect(parsePrinted('30 − ( 17 + 9 )').value).toBe(4)
    expect(parsePrinted('38 − ( 80 − 76 ) · 7').value).toBe(10)
    expect(parsePrinted('30 : ( 43 − 33 ) · 2').value).toBe(6)
    // Order matters, not just the total: these are the child's working.
    expect(parsePrinted('2 · 7 + 30 : 5').intermediates).toEqual([14, 6, 20])
  })
})

describe('the expression model', () => {
  it('evaluates and reports its steps in the order a child performs them', () => {
    const tree = op('+', op('*', num(2), num(7)), op('/', num(30), num(5)))
    expect(evaluate(tree)).toBe(20)
    expect(steps(tree).map(s => s.value)).toEqual([14, 6, 20])
    expect(isLeaf(num(3))).toBe(true)
  })

  it('rejects trees that precedence alone cannot reproduce', () => {
    // The trap this guard exists for: 7 · (30 : 5) prints as 7 · 30 : 5, whose
    // first step is 210 — a number the generator never checked.
    const reassociating = op('*', num(7), op('/', num(30), num(5)))
    expect(evaluate(reassociating)).toBe(42)
    expect(renderKey(reassociating)).toBe('7 * 30 / 5')
    expect(isCanonical(reassociating)).toBe(false)
    expect(isValid(reassociating)).toBe(false)

    // Same shape under a minus or a divide is fine, because it gets brackets.
    expect(isCanonical(op('-', num(30), op('+', num(17), num(9))))).toBe(true)
    expect(renderKey(op('-', num(30), op('+', num(17), num(9))))).toBe('30 - ( 17 + 9 )')
  })

  it('keeps glyphs out of the model so notation is a display choice', () => {
    const tree = op('/', num(30), num(5))
    expect(printed(renderTokens(tree), 'dot')).toBe('30 : 5')
    expect(printed(renderTokens(tree), 'cross')).toBe('30 ÷ 5')
    expect(glyph('-', 'dot')).toBe('−') // U+2212, as everywhere else on the site
  })
})

describe.each(CASES)('level $level, brackets $brackets', ({ level, brackets }) => {
  const items = sample(level, brackets)

  it('prints a string that evaluates to the answer stored beside it', () => {
    for (const notation of NOTATIONS) {
      for (const { tokens, answer } of items) {
        expect(parsePrinted(printed(tokens, notation)).value).toBe(answer)
      }
    }
  })

  it('never makes a child pass through a number outside 2..100', () => {
    for (const { tokens } of items) {
      for (const v of parsePrinted(printed(tokens, 'dot')).intermediates) {
        expect(Number.isInteger(v)).toBe(true)
        expect(v).toBeGreaterThanOrEqual(2)
        expect(v).toBeLessThanOrEqual(MAX_VALUE)
      }
    }
  })

  it('works the printed expression in the same order as the tree', () => {
    // Closes the re-association hole independently of isCanonical: if the
    // printed form regrouped, these two step lists would diverge.
    for (const { tree, tokens } of items) {
      expect(steps(tree).map(s => s.value)).toEqual(parsePrinted(printed(tokens, 'dot')).intermediates)
    }
  })

  it('is canonical and valid', () => {
    for (const { tree } of items) {
      expect(isCanonical(tree)).toBe(true)
      expect(isValid(tree)).toBe(true)
    }
  })

  it('keeps × and ÷ inside the times tables and divides exactly', () => {
    for (const { tree } of items) {
      for (const { op: o, a, b, value } of steps(tree)) {
        if (o === '*') {
          expect(a).toBeGreaterThanOrEqual(MIN_FACTOR)
          expect(a).toBeLessThanOrEqual(MAX_FACTOR)
          expect(b).toBeGreaterThanOrEqual(MIN_FACTOR)
          expect(b).toBeLessThanOrEqual(MAX_FACTOR)
        }
        if (o === '/') {
          expect(a % b).toBe(0)
          expect(b).toBeGreaterThanOrEqual(MIN_FACTOR)
          expect(b).toBeLessThanOrEqual(MAX_FACTOR)
          expect(value).toBeGreaterThanOrEqual(MIN_FACTOR)
          expect(value).toBeLessThanOrEqual(MAX_FACTOR)
        }
      }
    }
  })

  it('gives an answer that fits one, two or three boxes', () => {
    for (const { answer } of items) {
      expect(Number.isInteger(answer)).toBe(true)
      expect(answer).toBeGreaterThanOrEqual(2)
      expect(answer).toBeLessThanOrEqual(MAX_VALUE)
      expect(String(answer).length).toBeGreaterThanOrEqual(1)
      expect(String(answer).length).toBeLessThanOrEqual(3)
    }
  })

  it('reads the same in either notation', () => {
    for (const { tokens, answer } of items.slice(0, 50)) {
      const dot = printed(tokens, 'dot')
      const cross = printed(tokens, 'cross')
      expect(parsePrinted(cross).value).toBe(answer)
      expect(cross.replace(/×/g, '·').replace(/÷/g, ':')).toBe(dot)
    }
  })

  it('ramps by structure: easy is one precedence class, medium spans both, hard is three operations', () => {
    for (const { tree } of items) {
      const ops = steps(tree).map(s => s.op)
      const multiplicative = ops.filter(o => o === '*' || o === '/')
      if (level === 'easy') {
        expect(ops).toHaveLength(2)
        expect(multiplicative).toHaveLength(0)
      } else if (level === 'medium') {
        expect(ops).toHaveLength(2)
        expect(multiplicative).toHaveLength(1)
      } else {
        expect(ops).toHaveLength(3)
        expect(multiplicative.length).toBeGreaterThanOrEqual(1)
      }
    }
  })

  if (brackets) {
    it('only prints a bracket that changes the answer', () => {
      const bracketed = items.filter(i => i.tokens.some(t => t.t === '('))
      expect(bracketed.length).toBeGreaterThan(0)
      for (const { tokens, answer } of bracketed) {
        const flattened = printed(tokens, 'dot').replace(/[()]/g, '')
        expect(parsePrinted(flattened).value).not.toBe(answer)
      }
    })
  } else {
    it('prints no brackets at all', () => {
      const bracketFree = new Set(shapesFor(level, false).map(s => s.id))
      for (const { tokens, shape } of items) {
        expect(tokens.some(t => t.t === '(' || t.t === ')')).toBe(false)
        expect(bracketFree.has(shape)).toBe(true)
      }
    })
  }
})

describe('the shape catalogue', () => {
  it('files every shape under a real level and builds canonical trees', () => {
    for (const shape of SHAPES) {
      expect(LEVELS).toContain(shape.level)
      // A shape added later that re-associates fails here, not on a child's page.
      for (let i = 0; i < 200; i++) {
        const tree = shape.build()
        if (tree) expect(isCanonical(tree), shape.id).toBe(true)
      }
    }
  })

  it('accepts often enough that the sampler never has to reach for the fallback', () => {
    for (const shape of SHAPES) {
      let ok = 0
      for (let i = 0; i < 500; i++) {
        const tree = shape.build()
        if (tree && isValid(tree)) ok++
      }
      expect(ok / 500, `${shape.id} acceptance`).toBeGreaterThan(0.3)
    }
  })

  it('leaves every level playable with brackets turned off', () => {
    for (const level of LEVELS) {
      expect(shapesFor(level, false).length, level).toBeGreaterThanOrEqual(4)
      expect(shapesFor(level, true).length).toBeGreaterThan(shapesFor(level, false).length)
    }
  })

  it('has a valid, stable fallback for every level', () => {
    for (const level of LEVELS) {
      const first = fallbackExpression(level)
      expect(isValid(first.tree), level).toBe(true)
      expect(first.shape).toBe('fallback')
      expect(fallbackExpression(level).key).toBe(first.key)
    }
  })
})

describe('generateSheet', () => {
  it.each(CASES)('fills a full page at level $level, brackets $brackets', ({ level, brackets }) => {
    for (const count of [12, 24]) {
      const sheet = generateSheet(count, level, brackets)
      expect(sheet).toHaveLength(count)
      // No expression printed twice, and no answer more than twice, or the page
      // reads as one problem repeated rather than a set.
      expect(new Set(sheet.map(i => i.key)).size).toBe(count)
      const answers = new Map()
      for (const { answer } of sheet) answers.set(answer, (answers.get(answer) ?? 0) + 1)
      expect(Math.max(...answers.values())).toBeLessThanOrEqual(2)
      expect(sheet.some(i => i.shape === 'fallback')).toBe(false)
    }
  })

  it('spreads the catalogue rather than leaning on one shape', () => {
    for (const level of LEVELS) {
      const shapes = new Set(generateSheet(24, level, true).map(i => i.shape))
      expect(shapes.size, level).toBeGreaterThanOrEqual(6)
    }
  })

  it('degrades instead of hanging when asked for more than it can vary', () => {
    // Far more problems than the narrowest setting has distinct sensible forms.
    const sheet = generateSheet(60, 'easy', false)
    expect(sheet).toHaveLength(60)
    for (const { tree } of sheet) expect(isValid(tree)).toBe(true)
  })
})

describe('one printed page', () => {
  it('derives its row count from the height the stylesheet pins', () => {
    // PRINT_ORDER_ROW and the `.order-item` height in OrderOfOperations.css are
    // one number in two files; this is what stops them drifting apart.
    expect(listRowsPerPage(PRINT_ORDER_ROW, ORDER_HEADER_PX)).toBe(13)
    expect(listRowsPerPage(PRINT_ORDER_ROW + 6, ORDER_HEADER_PX)).toBeLessThan(13)
  })

  it('leaves the sheet inside the page box, which is the promise being kept', () => {
    // The row gap is zero in print, so a row's pitch is exactly its height and
    // the whole sheet is the padding, the header band and the rows.
    const rows = listRowsPerPage(PRINT_ORDER_ROW, ORDER_HEADER_PX)
    const sheet = SHEET_PAD_TOP + ORDER_HEADER_PX + rows * PRINT_ORDER_ROW
    expect(sheet).toBeLessThanOrEqual(PRINT_HEIGHT)
    // …and uses it: one more row would not fit.
    expect(sheet + PRINT_ORDER_ROW).toBeGreaterThan(PRINT_HEIGHT)
  })

  it('keeps the widest expression inside one of two columns', () => {
    let widest = 0
    for (const level of LEVELS) {
      for (const { tokens } of sample(level, true, 800)) {
        widest = Math.max(widest, printed(tokens, 'dot').length)
      }
    }
    expect(widest).toBeLessThanOrEqual(30)
    // Sheet padding is 0.5in a side; the grid gap between two columns is 24px.
    const column = (PRINT_WIDTH - 96 - 24) / 2
    expect(widest * ORDER_CHAR_PX + 3 * ORDER_BOX_PX + 2 * ORDER_BOX_GAP).toBeLessThan(column)
  })
})

describe('seeded generation', () => {
  it('deals the same expressions for the same seed and different ones for another', () => {
    for (const level of LEVELS) {
      expect(generateSheet(20, level, true, mulberry32(123))).toEqual(generateSheet(20, level, true, mulberry32(123)))
      expect(generateSheet(20, level, true, mulberry32(123))).not.toEqual(generateSheet(20, level, true, mulberry32(124)))
    }
  })
})

describe('a bracket a child could ignore', () => {
  it('is refused even when every number is at least 2', () => {
    // 73 − (6 − 2) · 3 is 61, and so is 73 − 6 − 2 · 3.
    const ignorable = op('-', num(73), op('*', op('-', num(6), num(2)), num(3)))
    expect(evaluate(ignorable)).toBe(61)
    expect(isValid(ignorable)).toBe(false)
    expect(isValid(op('-', num(73), op('*', op('-', num(7), num(2)), num(3))))).toBe(true)
  })

  it('never reaches a sheet from the seeds that used to deal one', () => {
    for (const seed of [415, 5380, 8230, 10224, 14752, 16056]) {
      const [{ tokens, answer }] = generateSheet(1, 'hard', true, mulberry32(seed))
      if (!tokens.some(k => k.t === '(')) continue
      expect(parsePrinted(printed(tokens, 'dot').replace(/[()]/g, '')).value, String(seed)).not.toBe(answer)
    }
  })
})
