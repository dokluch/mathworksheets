import { describe, it, expect } from 'vitest'
import { mulberry32 } from './rng.js'
import { PRESETS, digitColumns, generateSheet, problemRows } from './columnMultiplication'
import {
  PRINT_SQUARE, PRINT_WIDTH, notebookLayout, problemsPerPage, rowsPerPage,
} from '../hooks/useNotebookGrid'

const COLUMN_OPTIONS = [2, 3, 4]
/** ColumnMultiplication.jsx uses the default spacing: a gap row between problems. */
const SPACING = { rowGap: 1, headerGap: 1 }

function sheets(fn, runs = 30) {
  for (const { value, aDigits, bDigits } of PRESETS) {
    for (let run = 0; run < runs; run++) {
      fn({ problems: generateSheet({ count: 12, aDigits, bDigits }), value, aDigits, bDigits })
    }
  }
}

describe('long multiplication problems', () => {
  it('writes both factors at the length the preset asks for', () => {
    sheets(({ problems, aDigits, bDigits }) => {
      for (const p of problems) {
        expect(String(p.a)).toHaveLength(aDigits)
        expect(String(p.b)).toHaveLength(bDigits)
      }
    })
  })

  it('never puts a zero in the multiplier, so no partial product is a bare 0', () => {
    sheets(({ problems }) => {
      for (const p of problems) expect(String(p.b)).not.toMatch(/0/)
    })
  })

  it('gives one partial product per multiplier digit, and they sum to the product', () => {
    sheets(({ problems, bDigits }) => {
      for (const p of problems) {
        expect(p.partialProducts).toHaveLength(bDigits)
        const digits = String(p.b).split('').reverse().map(Number)
        p.partialProducts.forEach((partial, idx) => {
          expect(partial.shift).toBe(idx)
          expect(partial.value).toBe(p.a * digits[idx])
        })
        const total = p.partialProducts.reduce((sum, { value, shift }) => sum + value * 10 ** shift, 0)
        expect(total).toBe(p.product)
        expect(p.product).toBe(p.a * p.b)
      }
    })
  })
})

describe('long multiplication geometry', () => {
  it('fits the product and every shifted partial in the digit columns it budgets', () => {
    sheets(({ problems, aDigits, bDigits }) => {
      const width = digitColumns(aDigits, bDigits)
      for (const p of problems) {
        expect(String(p.product).length).toBeLessThanOrEqual(width)
        for (const { value, shift } of p.partialProducts) {
          expect(String(value).length + shift).toBeLessThanOrEqual(width)
        }
      }
    })
  })

  it('fits three rows of problems on one printed page, for every preset', () => {
    for (const { value, aDigits, bDigits } of PRESETS) {
      const rows = problemRows(bDigits)
      expect(rowsPerPage(rows, SPACING), value).toBe(3)
      for (const columns of COLUMN_OPTIONS) {
        expect(problemsPerPage({ columns, rows, ...SPACING }), value).toBe(columns * 3)
        expect(notebookLayout({
          width: PRINT_WIDTH,
          columns,
          // The operator column sits beside the digits.
          cellsWide: digitColumns(aDigits, bDigits) + 1,
          square: PRINT_SQUARE,
          minSquare: PRINT_SQUARE,
        }).overflow, `${value} × ${columns}`).toBe(false)
      }
    }
  })

  it('sizes 3 × 3 like the presets it sits between', () => {
    // Three partial products instead of two is one more row, and the same six
    // digit columns as 4 × 2 — so it needed no new layout, only the entry.
    expect(problemRows(3)).toBe(6)
    expect(digitColumns(3, 3)).toBe(6)
    expect(digitColumns(4, 2)).toBe(6)
  })
})

describe('seeded generation', () => {
  it('deals the same sheet for the same seed and a different one for another', () => {
    for (const { value, aDigits, bDigits } of PRESETS) {
      const args = { count: 9, aDigits, bDigits }
      expect(generateSheet(args, mulberry32(123)), value).toEqual(generateSheet(args, mulberry32(123)))
      expect(generateSheet(args, mulberry32(123)), value).not.toEqual(generateSheet(args, mulberry32(124)))
    }
  })
})
