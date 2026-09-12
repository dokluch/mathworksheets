import { describe, it, expect } from 'vitest'
import { mulberry32 } from './rng.js'
import {
  DIVISOR_MAX, DIVISOR_MIN, LIMITS, MARK_SQUARES, QUOTIENT_MAX, SHEET_SPACING,
  columnOptionsFor, factPairs, generateSheet, sheetFrame, sheetShape,
} from './division'
import { PRINT_SQUARE, PRINT_WIDTH, notebookLayout, rowsPerPage } from '../hooks/useNotebookGrid'

const MODES = [false, true]
const key = p => `${p.dividend}/${p.divisor}`

/** Every limit × remainder mode × offered column count, a sheet of the size the page holds, `runs` times. */
function sheets(fn, runs = 30) {
  for (const limit of LIMITS) {
    for (const allowRemainder of MODES) {
      const { columnOptions, frame } = sheetShape({ limit, allowRemainder, columns: 3 })
      for (const columns of columnOptions) {
        const { count } = sheetShape({ limit, allowRemainder, columns })
        for (let run = 0; run < runs; run++) {
          fn({ problems: generateSheet({ limit, allowRemainder, count }), limit, allowRemainder, count, frame })
        }
      }
    }
  }
}

describe('division facts', () => {
  it('writes every problem as a times-table fact within the limit', () => {
    sheets(({ problems, limit, allowRemainder }) => {
      expect(problems.length).toBeGreaterThan(0)
      for (const p of problems) {
        expect(p.divisor).toBeGreaterThanOrEqual(DIVISOR_MIN)
        expect(p.divisor).toBeLessThanOrEqual(DIVISOR_MAX)
        expect(p.quotient).toBeGreaterThanOrEqual(1)
        expect(p.quotient).toBeLessThanOrEqual(QUOTIENT_MAX)
        expect(p.divisor * p.quotient + p.remainder).toBe(p.dividend)
        expect(p.remainder).toBeGreaterThanOrEqual(0)
        expect(p.remainder).toBeLessThan(p.divisor)
        expect(p.dividend).toBeLessThanOrEqual(limit)
        if (!allowRemainder) expect(p.remainder).toBe(0)
      }
    })
  })

  it('divides by every number from 2 to 10', () => {
    for (const allowRemainder of MODES) {
      const seen = new Set()
      for (let i = 0; i < 20; i++) generateSheet({ limit: 100, allowRemainder, count: 39 }).forEach(p => seen.add(p.divisor))
      expect([...seen].sort((a, b) => a - b)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10])
    }
  })

  it('draws from every fact the limit allows', () => {
    expect([20, 50, 100].map(limit => factPairs(limit, false).length)).toEqual([36, 71, 90])
    // A remainder needs a unit of headroom: 10 × 10 = 100 is exact, 9 × 10 + r is not.
    expect([20, 50, 100].map(limit => factPairs(limit, true).length)).toEqual([32, 69, 89])
  })

  it('never repeats a problem on a page while the facts last', () => {
    sheets(({ problems, limit, allowRemainder }) => {
      const smallest = Math.min(factPairs(limit, false).length, ...(allowRemainder ? [factPairs(limit, true).length] : []))
      const tally = new Map()
      for (const p of problems) tally.set(key(p), (tally.get(key(p)) ?? 0) + 1)
      const most = Math.max(...tally.values())
      // Within 20 there are only 36 exact facts for 52 places, so the deck goes round again.
      expect(most).toBeLessThanOrEqual(problems.length <= smallest ? 1 : Math.ceil(problems.length / smallest))
    })
  })

  it('leaves a remainder on most problems, but not all, when remainders are on', () => {
    let leftover = 0
    let total = 0
    for (let i = 0; i < 300; i++) {
      const problems = generateSheet({ limit: 100, allowRemainder: true, count: 39 })
      total += problems.length
      leftover += problems.filter(p => p.remainder > 0).length
    }
    expect(leftover / total).toBeGreaterThan(0.6)
    expect(leftover / total).toBeLessThan(0.8)
  })
})

describe('division sheet geometry', () => {
  it('budgets a square per symbol, and room for the remainder', () => {
    const widths = LIMITS.flatMap(limit => MODES.map(allowRemainder => sheetFrame({ limit, allowRemainder }).cellsWide))
    // [20 exact, 20 r, 50 exact, 50 r, 100 exact, 100 r]
    expect(widths).toEqual([8, 11, 8, 11, 9, 12])
  })

  it('fits every problem in the squares budgeted for it', () => {
    sheets(({ problems, frame, allowRemainder }) => {
      for (const p of problems) {
        const squares = String(p.dividend).length + 1 + String(p.divisor).length + 1 + String(p.quotient).length
          + (allowRemainder ? MARK_SQUARES + String(p.remainder).length : 0)
        expect(squares).toBeLessThanOrEqual(frame.cellsWide)
      }
    })
  })

  it('offers four columns only while the problems are narrow enough to print them', () => {
    for (const limit of LIMITS) {
      expect(columnOptionsFor(sheetFrame({ limit, allowRemainder: false }).cellsWide)).toEqual([2, 3, 4])
      expect(columnOptionsFor(sheetFrame({ limit, allowRemainder: true }).cellsWide)).toEqual([2, 3])
    }
    expect(sheetShape({ limit: 100, allowRemainder: true, columns: 4 }).columns).toBe(3)
    expect(sheetShape({ limit: 100, allowRemainder: false, columns: 4 }).columns).toBe(4)
  })

  it('fills exactly one printed page', () => {
    expect(rowsPerPage(1, SHEET_SPACING)).toBe(13)
    for (const limit of LIMITS) {
      for (const allowRemainder of MODES) {
        const { columnOptions, frame } = sheetShape({ limit, allowRemainder, columns: 3 })
        for (const columns of columnOptions) {
          expect(sheetShape({ limit, allowRemainder, columns }).count).toBe(columns * 13)
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
    const args = { limit: 100, allowRemainder: true, count: 30 }
    expect(generateSheet(args, mulberry32(123))).toEqual(generateSheet(args, mulberry32(123)))
    expect(generateSheet(args, mulberry32(123))).not.toEqual(generateSheet(args, mulberry32(124)))
  })
})
