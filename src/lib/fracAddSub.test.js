import { describe, it, expect } from 'vitest'
import { mulberry32 } from './rng.js'
import {
  ANSWER_FORMS, LEVELS, LIMITS, OPS, REGROUP_SHARE, SHEET_SPACING, WHOLE_MAX,
  answerOf, columnOptionsFor, denominatorPairs, generateSheet, problemPool, problemSquares, sheetFrame, sheetShape,
} from './fracAddSub'
import { addFractions, compareFractions, fromMixed, isReduced, lcm, subFractions } from './fractionMath'
import { PRINT_SQUARE, PRINT_WIDTH, notebookLayout, rowsPerPage } from '../hooks/useNotebookGrid'

const ONE = { n: 1, d: 1 }
const fraction = o => ({ n: o.n, d: o.d })
const exact = p => (p.op === 'add' ? addFractions : subFractions)(fromMixed(p.a), fromMixed(p.b))
/** A sum that passes a whole, or a difference whose fractional parts need a whole borrowed. */
const regroups = p => (p.op === 'add'
  ? compareFractions(addFractions(fraction(p.a), fraction(p.b)), ONE) > 0
  : compareFractions(fraction(p.a), fraction(p.b)) < 0)
const key = p => `${p.op}|${p.a.w} ${p.a.n}/${p.a.d}|${p.b.w} ${p.b.n}/${p.b.d}`

/** Every level × operation × limit × answer form × offered column count, `runs` times. */
function sheets(fn, runs = 20) {
  for (const level of LEVELS) {
    for (const op of OPS) {
      for (const limit of LIMITS) {
        for (const answerForm of ANSWER_FORMS) {
          const { columnOptions } = sheetShape({ level, limit, answerForm, columns: 3 })
          for (const columns of columnOptions) {
            const { count, frame } = sheetShape({ level, limit, answerForm, columns })
            for (let run = 0; run < runs; run++) {
              fn({ problems: generateSheet({ level, op, limit, count }), level, op, limit, answerForm, count, frame })
            }
          }
        }
      }
    }
  }
}

describe('denominators and pools', () => {
  it('pairs like denominators from 3, and unlike ones whose common denominator fits the limit', () => {
    expect(LEVELS.map(level => LIMITS.map(limit => denominatorPairs(level, limit).length)))
      .toEqual([[8, 10, 18], [20, 32, 74], [29, 43, 93]])
    for (const limit of LIMITS) {
      for (const [b, d] of denominatorPairs('like', limit)) {
        expect(b).toBe(d)
        expect(b).toBeGreaterThanOrEqual(3)
      }
      for (const [b, d] of denominatorPairs('unlike', limit)) {
        expect(b).not.toBe(d)
        expect(lcm(b, d)).toBeLessThanOrEqual(limit)
      }
      // Mixed numbers use both, halves included: a whole part leaves room for them.
      expect(denominatorPairs('mixed', limit).length)
        .toBe(denominatorPairs('like', limit).length + 1 + denominatorPairs('unlike', limit).length)
    }
  })

  it('keeps every sum below 1 and every difference above 0', () => {
    expect(['like', 'unlike'].map(level => LIMITS.map(limit => problemPool(level, 'add', limit).length)))
      .toEqual([[120, 220, 1140], [98, 228, 1204]])
    for (const level of ['like', 'unlike']) {
      for (const limit of LIMITS) {
        for (const [x, y] of problemPool(level, 'add', limit)) expect(compareFractions(addFractions(x, y), ONE)).toBe(-1)
        for (const [x, y] of problemPool(level, 'sub', limit)) expect(compareFractions(x, y)).toBe(1)
      }
    }
  })
})

describe('add and subtract fractions sheets', () => {
  it('works out every answer exactly, in lowest terms, and never at or below zero', () => {
    sheets(({ problems, limit }) => {
      for (const p of problems) {
        expect(compareFractions(p.result, exact(p))).toBe(0)
        expect(isReduced(p.result)).toBe(true)
        expect(p.result.n).toBeGreaterThan(0)
        for (const o of [p.a, p.b]) {
          expect(o.n).toBeGreaterThanOrEqual(1)
          expect(o.n).toBeLessThan(o.d)
          expect(o.d).toBeLessThanOrEqual(limit)
        }
      }
    })
  })

  it('keeps like and unlike problems to plain fractions with answers below 1', () => {
    sheets(({ problems, level, limit }) => {
      if (level === 'mixed') return
      for (const p of problems) {
        expect(p.a.w).toBe(0)
        expect(p.b.w).toBe(0)
        expect(p.mixed.w).toBe(0)
        if (level === 'like') expect(p.a.d).toBe(p.b.d)
        if (level === 'unlike') expect(p.a.d).not.toBe(p.b.d)
        // The common denominator was bounded, so the answer's is too.
        expect(p.result.d).toBeLessThanOrEqual(limit)
      }
    })
  })

  it('gives mixed-number answers a whole part from 1 to 9 and a fractional part', () => {
    sheets(({ problems, level }) => {
      if (level !== 'mixed') return
      for (const p of problems) {
        expect(p.a.w).toBeGreaterThanOrEqual(1)
        expect(p.b.w).toBeGreaterThanOrEqual(1)
        expect(p.mixed.w).toBeGreaterThanOrEqual(1)
        expect(p.mixed.w).toBeLessThanOrEqual(WHOLE_MAX)
        expect(p.mixed.n).toBeGreaterThan(0)
      }
    })
  })

  it('deals the operation asked for, and exactly half of each on a page set to both', () => {
    sheets(({ problems, op, count }) => {
      if (op === 'both') {
        expect(problems.filter(p => p.op === 'add')).toHaveLength(count / 2)
      } else {
        expect(problems.every(p => p.op === op)).toBe(true)
      }
    })
  })

  it('carries past a whole, or borrows one, on about half the mixed-number problems', () => {
    for (const op of ['add', 'sub']) {
      let regrouped = 0
      let total = 0
      for (let i = 0; i < 200; i++) {
        for (const p of generateSheet({ level: 'mixed', op, limit: 12, count: 18 })) {
          total++
          if (regroups(p)) regrouped++
        }
      }
      expect(regrouped / total, op).toBeGreaterThan(REGROUP_SHARE - 0.08)
      expect(regrouped / total, op).toBeLessThan(REGROUP_SHARE + 0.08)
    }
  })

  it('does not repeat a problem on a page', () => {
    sheets(({ problems }) => {
      expect(new Set(problems.map(key)).size).toBe(problems.length)
    })
  })
})

describe('answers', () => {
  it('writes an answer below 1 as a fraction, and one above 1 in the form the sheet is set to', () => {
    const proper = { mixed: { w: 0, n: 3, d: 4 }, result: { n: 3, d: 4 } }
    const above = { mixed: { w: 2, n: 3, d: 4 }, result: { n: 11, d: 4 } }
    expect(answerOf(proper, 'mixed')).toEqual({ w: 0, n: 3, d: 4 })
    expect(answerOf(proper, 'improper')).toEqual({ w: 0, n: 3, d: 4 })
    expect(answerOf(above, 'mixed')).toEqual({ w: 2, n: 3, d: 4 })
    expect(answerOf(above, 'improper')).toEqual({ w: 0, n: 11, d: 4 })
  })
})

describe('add and subtract fractions geometry', () => {
  it('budgets fractions as wide as the limit, whole parts as one square, improper answers as their widest numerator', () => {
    for (const limit of LIMITS) {
      expect(sheetFrame({ level: 'like', limit, answerForm: 'mixed' }).cellsWide).toBe(8)
      expect(sheetFrame({ level: 'unlike', limit, answerForm: 'improper' }).cellsWide).toBe(8)
      expect(sheetFrame({ level: 'mixed', limit, answerForm: 'mixed' }).cellsWide).toBe(11)
    }
    // Below 10 wholes, a numerator over 10 reaches 99; over 12 or 20 it reaches three digits.
    expect(LIMITS.map(limit => sheetFrame({ level: 'mixed', limit, answerForm: 'improper' }).cellsWide)).toEqual([10, 11, 11])
  })

  it('fits every problem in the squares budgeted for it, in both answer forms', () => {
    sheets(({ problems, frame, answerForm }) => {
      for (const p of problems) expect(problemSquares(p, answerForm)).toBeLessThanOrEqual(frame.cellsWide)
    })
  })

  it('drops to three columns for mixed numbers, and falls back from a remembered four', () => {
    expect(columnOptionsFor(8)).toEqual([2, 3, 4])
    expect(columnOptionsFor(10)).toEqual([2, 3])
    expect(columnOptionsFor(11)).toEqual([2, 3])
    expect(sheetShape({ level: 'mixed', limit: 12, answerForm: 'mixed', columns: 4 }).columns).toBe(3)
    expect(sheetShape({ level: 'like', limit: 12, answerForm: 'mixed', columns: 4 }).columns).toBe(4)
  })

  it('fills exactly one printed page, with a line of working under every problem', () => {
    expect(rowsPerPage(2, SHEET_SPACING)).toBe(6)
    for (const level of LEVELS) {
      for (const limit of LIMITS) {
        for (const answerForm of ANSWER_FORMS) {
          const { columnOptions, frame } = sheetShape({ level, limit, answerForm, columns: 3 })
          for (const columns of columnOptions) {
            expect(sheetShape({ level, limit, answerForm, columns }).count).toBe(columns * 6)
            expect(notebookLayout({
              width: PRINT_WIDTH, columns, cellsWide: frame.cellsWide, square: PRINT_SQUARE, minSquare: PRINT_SQUARE,
            }).overflow).toBe(false)
          }
        }
      }
    }
  })
})

describe('seeded generation', () => {
  it('deals the same sheet for the same seed and a different one for another', () => {
    for (const level of LEVELS) {
      const args = { level, op: 'both', limit: 12, count: 18 }
      expect(generateSheet(args, mulberry32(123)), level).toEqual(generateSheet(args, mulberry32(123)))
      expect(generateSheet(args, mulberry32(123)), level).not.toEqual(generateSheet(args, mulberry32(124)))
    }
  })
})
