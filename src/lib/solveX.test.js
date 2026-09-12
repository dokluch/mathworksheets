import { describe, it, expect } from 'vitest'
import { mulberry32 } from './rng.js'
import {
  COEF_MAX, COEF_MIN, LEVELS, RANGES, SAME_ANSWER_MAX, SHAPES, SHEET_SPACING, WORK_ROWS,
  answerCap, columnOptionsFor, evaluateSides, generateSheet, renderKey, sheetFrame, sheetShape, widthOf,
} from './solveX'
import { PRINT_SQUARE, PRINT_WIDTH, notebookLayout, rowsPerPage } from '../hooks/useNotebookGrid'

const num = v => ({ t: 'n', v })
const xs = (c = 1) => ({ t: 'x', c })
const op = v => ({ t: 'op', v })
const EQ = { t: '=' }
const OPEN = { t: '(' }
const CLOSE = { t: ')' }

const sides = tokens => {
  const eq = tokens.findIndex(tok => tok.t === '=')
  return [tokens.slice(0, eq), tokens.slice(eq + 1)]
}
/** Operations written on a side: signs, a coefficient before x, and a number multiplying a bracket. */
const operations = side => side.filter(tok => tok.t === 'op' || tok.t === '(' || (tok.t === 'x' && tok.c > 1)).length

/** Every level × range × offered column count, a sheet of the size the page holds, `runs` times. */
function sheets(fn, runs = 30) {
  for (const level of LEVELS) {
    for (const range of RANGES) {
      const { columnOptions } = sheetShape({ level, range, columns: 3 })
      for (const columns of columnOptions) {
        const { count, frame } = sheetShape({ level, range, columns })
        for (let run = 0; run < runs; run++) {
          fn({ problems: generateSheet({ level, range, count }), level, range, count, frame })
        }
      }
    }
  }
}

describe('equation helpers', () => {
  it('evaluates both sides with brackets, implicit multiplication and × ÷ before + −', () => {
    expect(evaluateSides([num(3), OPEN, xs(), op('+'), num(2), CLOSE, EQ, num(18)], 4)).toEqual([18, 18])
    expect(evaluateSides([xs(), op('/'), num(4), op('+'), num(3), EQ, num(9)], 24)).toEqual([9, 9])
    expect(evaluateSides([xs(5), op('-'), num(3), EQ, xs(2), op('+'), num(9)], 4)).toEqual([17, 17])
    expect(evaluateSides([xs(), op('+'), num(2), op('*'), num(3), EQ, num(10)], 4)).toEqual([10, 10])
  })

  it('counts a square per digit, per x and per sign', () => {
    expect(widthOf([xs(3), op('+'), num(4), EQ, num(19)])).toBe(7)
    // 1 2 ( x + 3 ) = 6 0: ten squares.
    expect(widthOf([num(12), OPEN, xs(), op('+'), num(3), CLOSE, EQ, num(60)])).toBe(10)
    expect(renderKey([num(3), OPEN, xs(), op('+'), num(2), CLOSE, EQ, num(18)])).toBe('3 ( x + 2 ) = 18')
  })
})

describe('solve for x sheets', () => {
  it('makes every equation true at its answer, a whole number within the range', () => {
    sheets(({ problems, range }) => {
      for (const p of problems) {
        const [left, right] = evaluateSides(p.tokens, p.x)
        expect(left, renderKey(p.tokens)).toBe(right)
        expect(Number.isInteger(p.x)).toBe(true)
        expect(p.x).toBeGreaterThanOrEqual(1)
        expect(p.x).toBeLessThanOrEqual(range)
        for (const tok of p.tokens) if (tok.t === 'n') expect(Number.isInteger(tok.v) && tok.v >= 1, renderKey(p.tokens)).toBe(true)
      }
    })
  })

  it('writes one operation around x at the first level, two at the second, and x on both sides at the third', () => {
    sheets(({ problems, level }) => {
      for (const p of problems) {
        const [left, right] = sides(p.tokens)
        const key = renderKey(p.tokens)
        if (level === 'one') expect(operations(left), key).toBe(1)
        if (level === 'two') expect(operations(left), key).toBe(2)
        if (level === 'both') {
          expect(left.some(tok => tok.t === 'x'), key).toBe(true)
          expect(right.some(tok => tok.t === 'x'), key).toBe(true)
        }
        // Nothing but the constants on the right at the first two levels.
        if (level !== 'both') expect(right.every(tok => tok.t === 'n'), key).toBe(true)
      }
    })
  })

  it('keeps coefficients to single digits, with the larger one on the left when x is on both sides', () => {
    sheets(({ problems, level }) => {
      for (const p of problems) {
        const coefficients = p.tokens.filter(tok => tok.t === 'x').map(tok => tok.c)
        for (const c of coefficients) expect(c).toBeLessThanOrEqual(COEF_MAX)
        if (level === 'both') {
          const [a, c] = coefficients
          expect(a).toBeGreaterThan(c)
        } else {
          for (const c of coefficients.filter(c => c > 1)) expect(c).toBeGreaterThanOrEqual(COEF_MIN)
        }
      }
    })
  })

  it('uses every shape of a level, and only that level’s shapes', () => {
    for (const level of LEVELS) {
      const own = SHAPES.filter(shape => shape.level === level).map(shape => shape.id)
      const seen = new Set()
      for (let i = 0; i < 20; i++) for (const p of generateSheet({ level, range: 20, count: 15 })) seen.add(p.shape)
      expect([...seen].sort(), level).toEqual([...own].sort())
    }
  })

  it('allows an answer twice on a page, or three times when the range is too small for the page', () => {
    expect(answerCap(18, 100)).toBe(SAME_ANSWER_MAX)
    expect(answerCap(18, 20)).toBe(2)
    expect(answerCap(12, 10)).toBe(2)
    expect(answerCap(15, 10)).toBe(3)
    expect(answerCap(18, 10)).toBe(3)
  })

  it('never repeats an equation on a page, and keeps each answer within its cap', () => {
    sheets(({ problems, range }) => {
      expect(new Set(problems.map(p => renderKey(p.tokens))).size).toBe(problems.length)
      const tally = new Map()
      for (const p of problems) tally.set(p.x, (tally.get(p.x) ?? 0) + 1)
      expect(Math.max(...tally.values())).toBeLessThanOrEqual(answerCap(problems.length, range))
    })
  })
})

describe('solve for x geometry', () => {
  it('budgets each level as wide as its widest shape allows at that range', () => {
    expect(LEVELS.map(level => RANGES.map(range => sheetFrame({ level, range }).cellsWide)))
      .toEqual([[7, 7, 9], [10, 10, 11], [12, 12, 12]])
    expect(LEVELS.map(level => sheetFrame({ level, range: 20 }).rows)).toEqual(LEVELS.map(level => 1 + WORK_ROWS[level]))
  })

  it('fits every equation in the squares budgeted for it', () => {
    sheets(({ problems, frame }) => {
      for (const p of problems) expect(widthOf(p.tokens), renderKey(p.tokens)).toBeLessThanOrEqual(frame.cellsWide)
    })
  })

  it('prints two or three across, with more working room and fewer problems as the level rises', () => {
    for (const level of LEVELS) {
      for (const range of RANGES) expect(columnOptionsFor(sheetFrame({ level, range }).cellsWide)).toEqual([2, 3])
    }
    expect(LEVELS.map(level => rowsPerPage(1 + WORK_ROWS[level], SHEET_SPACING))).toEqual([6, 5, 4])
    for (const level of LEVELS) {
      for (const range of RANGES) {
        const { frame } = sheetShape({ level, range, columns: 3 })
        for (const columns of [2, 3]) {
          expect(sheetShape({ level, range, columns }).count).toBe(columns * rowsPerPage(frame.rows, SHEET_SPACING))
          expect(notebookLayout({
            width: PRINT_WIDTH, columns, cellsWide: frame.cellsWide, square: PRINT_SQUARE, minSquare: PRINT_SQUARE,
          }).overflow).toBe(false)
        }
      }
    }
  })
})

describe('seeded generation', () => {
  it('deals the same sheet for the same seed and a different one for another', () => {
    for (const level of LEVELS) {
      const args = { level, range: 20, count: 15 }
      expect(generateSheet(args, mulberry32(123)), level).toEqual(generateSheet(args, mulberry32(123)))
      expect(generateSheet(args, mulberry32(123)), level).not.toEqual(generateSheet(args, mulberry32(124)))
    }
  })
})
