import { describe, it, expect } from 'vitest'
import { mulberry32 } from './rng.js'
import {
  EQUAL_SHARE, KINDS, LIMITS, PRACTICES, SHEET_SPACING,
  columnOptionsFor, equivalentPool, generateSheet, problemSquares, sheetFrame, sheetShape, simplifyPool,
} from './fractions'
import { compareFractions, gcd, reduce } from './fractionMath'
import { PRINT_SQUARE, PRINT_WIDTH, notebookLayout, rowsPerPage } from '../hooks/useNotebookGrid'

const proper = (f, limit) => f.n >= 1 && f.n < f.d && f.d >= 2 && f.d <= limit
const written = f => `${f.n}/${f.d}`
const STRATEGIES = ['equal', 'sameDenominator', 'sameNumerator', 'offByOne', 'straddleHalf']

/** Every limit × practice × offered column count, a sheet of the size the page holds, `runs` times. */
function sheets(fn, runs = 30) {
  for (const limit of LIMITS) {
    for (const practice of PRACTICES) {
      const { columnOptions } = sheetShape({ limit, columns: 3 })
      for (const columns of columnOptions) {
        const { count, frame } = sheetShape({ limit, columns })
        for (let run = 0; run < runs; run++) {
          fn({ problems: generateSheet({ practice, limit, count }), practice, limit, count, frame })
        }
      }
    }
  }
}

describe('problem pools', () => {
  it('draws simplify problems from every proper fraction that still cancels', () => {
    expect(LIMITS.map(limit => simplifyPool(limit).length)).toEqual([14, 21, 63])
    for (const limit of LIMITS) {
      for (const f of simplifyPool(limit)) {
        expect(proper(f, limit)).toBe(true)
        expect(gcd(f.n, f.d)).toBeGreaterThan(1)
      }
    }
  })

  it('draws equivalent problems only where the scaled denominator stays within the limit', () => {
    expect(LIMITS.map(limit => equivalentPool(limit).length)).toEqual([14, 21, 63])
    for (const limit of LIMITS) {
      for (const { n, d, k } of equivalentPool(limit)) {
        expect(gcd(n, d)).toBe(1)
        expect(k).toBeGreaterThanOrEqual(2)
        expect(k * d).toBeLessThanOrEqual(limit)
      }
    }
  })
})

describe('fractions sheets', () => {
  it('simplifies fractions that can be simplified, to lowest terms', () => {
    sheets(({ problems, limit }) => {
      for (const p of problems.filter(q => q.kind === 'simplify')) {
        expect(proper(p.a, limit)).toBe(true)
        expect(gcd(p.a.n, p.a.d)).toBeGreaterThan(1)
        expect(p.answer).toEqual(reduce(p.a))
      }
    })
  })

  it('scales a reduced fraction up to an equal one, with one number to find', () => {
    sheets(({ problems, limit }) => {
      for (const p of problems.filter(q => q.kind === 'equivalent')) {
        expect(proper(p.a, limit)).toBe(true)
        expect(gcd(p.a.n, p.a.d)).toBe(1)
        expect(proper(p.b, limit)).toBe(true)
        expect(p.b.d).toBeGreaterThan(p.a.d)
        expect(compareFractions(p.a, p.b)).toBe(0)
        expect(['n', 'd']).toContain(p.blank)
      }
    })
  })

  it('hides the numerator on some equivalent problems and the denominator on others', () => {
    const problems = generateSheet({ practice: 'equivalent', limit: 12, count: 32 })
    expect(problems.some(p => p.blank === 'n')).toBe(true)
    expect(problems.some(p => p.blank === 'd')).toBe(true)
  })

  it('keys every comparison by value, and never compares a fraction with itself', () => {
    sheets(({ problems, limit }) => {
      for (const p of problems.filter(q => q.kind === 'compare')) {
        expect(proper(p.a, limit)).toBe(true)
        expect(proper(p.b, limit)).toBe(true)
        const c = compareFractions(p.a, p.b)
        expect(p.answer).toBe(c < 0 ? '<' : c > 0 ? '>' : '=')
        expect(written(p.a)).not.toBe(written(p.b))
      }
    })
  })

  it('does not repeat a comparison on a page', () => {
    sheets(({ problems }) => {
      const keys = problems.filter(p => p.kind === 'compare').map(p => `${written(p.a)}|${written(p.b)}`)
      expect(new Set(keys).size).toBe(keys.length)
    })
  })

  it('repeats a simplify or equivalent problem only once the pool is spent', () => {
    sheets(({ problems, limit }) => {
      for (const [kind, pool] of [['simplify', simplifyPool(limit)], ['equivalent', equivalentPool(limit)]]) {
        const items = problems.filter(p => p.kind === kind)
        if (!items.length) continue
        const tally = new Map()
        for (const p of items) {
          const key = kind === 'simplify' ? written(p.a) : `${written(p.a)}→${p.b.d}`
          tally.set(key, (tally.get(key) ?? 0) + 1)
        }
        expect(Math.max(...tally.values())).toBeLessThanOrEqual(Math.ceil(items.length / pool.length))
      }
    })
  })

  it('sets every kind of comparison trap, and an equal pair about as often as asked', () => {
    let equal = 0
    let total = 0
    const seen = new Set()
    for (let i = 0; i < 300; i++) {
      for (const p of generateSheet({ practice: 'compare', limit: 12, count: 24 })) {
        total++
        if (p.answer === '=') equal++
        seen.add(p.strategy)
      }
    }
    expect(equal / total).toBeGreaterThan(EQUAL_SHARE - 0.05)
    expect(equal / total).toBeLessThan(EQUAL_SHARE + 0.05)
    for (const strategy of STRATEGIES) expect(seen, strategy).toContain(strategy)
  })

  it('keeps a single-practice page to that practice, and a mixed page to even thirds', () => {
    sheets(({ problems, practice, count }) => {
      if (practice !== 'mixed') {
        expect(problems.every(p => p.kind === practice)).toBe(true)
        return
      }
      for (const kind of KINDS) {
        const n = problems.filter(p => p.kind === kind).length
        expect(Math.abs(n - count / KINDS.length)).toBeLessThanOrEqual(1)
      }
    })
  })
})

describe('fractions sheet geometry', () => {
  it('budgets two squares for each fraction and one for the sign', () => {
    expect(LIMITS.map(limit => sheetFrame({ limit }))).toEqual(LIMITS.map(() => ({ rows: 2, cellsWide: 5 })))
  })

  it('fits every problem in the squares budgeted for it', () => {
    sheets(({ problems, frame }) => {
      for (const p of problems) expect(problemSquares(p)).toBeLessThanOrEqual(frame.cellsWide)
    })
  })

  it('fills exactly one printed page at two, three or four columns', () => {
    expect(columnOptionsFor(5)).toEqual([2, 3, 4])
    expect(rowsPerPage(2, SHEET_SPACING)).toBe(8)
    for (const limit of LIMITS) {
      for (const columns of [2, 3, 4]) {
        const { count, frame } = sheetShape({ limit, columns })
        expect(count).toBe(columns * 8)
        expect(notebookLayout({
          width: PRINT_WIDTH, columns, cellsWide: frame.cellsWide, square: PRINT_SQUARE, minSquare: PRINT_SQUARE,
        }).overflow).toBe(false)
      }
    }
  })
})

describe('seeded generation', () => {
  it('deals the same sheet for the same seed and a different one for another', () => {
    for (const practice of PRACTICES) {
      const args = { practice, limit: 12, count: 24 }
      expect(generateSheet(args, mulberry32(123)), practice).toEqual(generateSheet(args, mulberry32(123)))
      expect(generateSheet(args, mulberry32(123)), practice).not.toEqual(generateSheet(args, mulberry32(124)))
    }
  })
})
