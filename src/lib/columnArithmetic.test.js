import { describe, it, expect } from 'vitest'
import { mulberry32 } from './rng.js'
import {
  DIGIT_PRESETS, OPS, PROBLEM_ROWS, SHEET_SPACING, REGROUP_SHARE,
  digitColumns, generateSheet, hasCarry, needsBorrow,
} from './columnArithmetic'
import { PRINT_SQUARE, PRINT_WIDTH, notebookLayout, problemsPerPage, rowsPerPage } from '../hooks/useNotebookGrid'

const COLUMN_OPTIONS = [2, 3, 4]
const regrouped = p => (p.op === 'add' ? hasCarry(p.a, p.b) : needsBorrow(p.a, p.b))

/** Every digit preset × operation × prefer-regrouping mode × column count, `runs` times. */
function sheets(fn, runs = 30) {
  for (const digits of DIGIT_PRESETS) {
    for (const op of OPS) {
      for (const preferCarry of [false, true]) {
        for (const columns of COLUMN_OPTIONS) {
          const count = problemsPerPage({ columns, rows: PROBLEM_ROWS, ...SHEET_SPACING })
          for (let run = 0; run < runs; run++) {
            fn({ problems: generateSheet({ count, digits, preferCarry, op }), digits, op, preferCarry, count })
          }
        }
      }
    }
  }
}

describe('regrouping', () => {
  it('spots a carry in any column', () => {
    expect(hasCarry(348, 275)).toBe(true)
    expect(hasCarry(123, 456)).toBe(false)
    // The carry is out of the tens, not the ones.
    expect(hasCarry(180, 130)).toBe(true)
    expect(hasCarry(0, 0)).toBe(false)
  })

  it('spots a borrow in any column', () => {
    expect(needsBorrow(503, 268)).toBe(true)
    expect(needsBorrow(568, 123)).toBe(false)
    // A chain that starts in the ones and runs through a zero.
    expect(needsBorrow(110, 11)).toBe(true)
    expect(needsBorrow(100, 1)).toBe(true)
    expect(needsBorrow(99, 99)).toBe(false)
  })
})

describe('column arithmetic sheets', () => {
  it('writes both operands at the digit length the setting asks for', () => {
    sheets(({ problems, digits, count }) => {
      expect(problems).toHaveLength(count)
      for (const p of problems) {
        expect(String(p.a)).toHaveLength(digits)
        expect(String(p.b)).toHaveLength(digits)
      }
    })
  })

  it('adds and subtracts correctly, and never asks for a negative difference', () => {
    sheets(({ problems, op }) => {
      for (const p of problems) {
        if (op !== 'mixed') expect(p.op).toBe(op === 'subtract' ? 'subtract' : 'add')
        if (p.op === 'add') {
          expect(p.result).toBe(p.a + p.b)
        } else {
          expect(p.a).toBeGreaterThan(p.b)
          expect(p.result).toBe(p.a - p.b)
          // A difference of zero would print a row of boxes that only holds 0.
          expect(p.result).toBeGreaterThan(0)
        }
      }
    })
  })

  it('deals both operations on a mixed sheet', () => {
    for (const digits of DIGIT_PRESETS) {
      const problems = generateSheet({ count: 18, digits, preferCarry: true, op: 'mixed' })
      expect(problems.some(p => p.op === 'add')).toBe(true)
      expect(problems.some(p => p.op === 'subtract')).toBe(true)
    }
  })

  it('regroups on most problems, but not all, when the option is on', () => {
    for (const op of OPS) {
      const share = preferCarry => {
        let needing = 0
        let total = 0
        for (let i = 0; i < 100; i++) {
          const problems = generateSheet({ count: 18, digits: 3, preferCarry, op })
          total += problems.length
          needing += problems.filter(regrouped).length
        }
        return needing / total
      }
      const on = share(true)
      // At least the share asked for, and never all of them: a quarter of the
      // problems are drawn without the constraint, for variety.
      expect(on, op).toBeGreaterThan(REGROUP_SHARE / 100)
      expect(on, op).toBeLessThan(0.99)
      // Two- and three-digit pairs regroup often by chance, so the option is
      // read against the rate without it rather than against a flat threshold.
      expect(on, op).toBeGreaterThan(share(false))
    }
  })
})

describe('column arithmetic geometry', () => {
  it('budgets one square per digit plus one for the carry', () => {
    expect(DIGIT_PRESETS.map(digitColumns)).toEqual([3, 4, 5])
  })

  it('fills exactly one printed page, at every column count', () => {
    expect(rowsPerPage(PROBLEM_ROWS, SHEET_SPACING)).toBe(6)
    for (const digits of DIGIT_PRESETS) {
      for (const columns of COLUMN_OPTIONS) {
        expect(problemsPerPage({ columns, rows: PROBLEM_ROWS, ...SHEET_SPACING })).toBe(columns * 6)
        expect(notebookLayout({
          width: PRINT_WIDTH,
          columns,
          // The operator column sits beside the digits.
          cellsWide: digitColumns(digits) + 1,
          square: PRINT_SQUARE,
          minSquare: PRINT_SQUARE,
        }).overflow).toBe(false)
      }
    }
  })

  it('fits every problem in the squares budgeted for it', () => {
    sheets(({ problems, digits }) => {
      for (const p of problems) {
        expect(String(p.result).length).toBeLessThanOrEqual(digitColumns(digits))
      }
    })
  })
})

describe('seeded generation', () => {
  it('deals the same sheet for the same seed and a different one for another', () => {
    for (const op of OPS) {
      const args = { count: 18, digits: 3, preferCarry: true, op }
      expect(generateSheet(args, mulberry32(123))).toEqual(generateSheet(args, mulberry32(123)))
      expect(generateSheet(args, mulberry32(123))).not.toEqual(generateSheet(args, mulberry32(124)))
    }
  })

  it('deals an addition sheet exactly as it did before subtraction existed', () => {
    // The op is drawn only on a mixed sheet, so an add sheet consumes the rng
    // in the old order and a shared ?set= link still prints the same page.
    const sheet = generateSheet({ count: 4, digits: 3, preferCarry: true, op: 'add' }, mulberry32(7))
    expect(sheet.map(p => [p.a, p.b])).toEqual([[155, 979], [569, 464], [315, 597], [787, 566]])
  })
})
