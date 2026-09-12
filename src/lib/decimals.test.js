import { describe, it, expect } from 'vitest'
import { mulberry32 } from './rng.js'
import {
  ANSWER_CHARS, ANSWER_SQUARES, INT_MAX, INT_SQUARES, MAX_RESULT_PLACES, MODES, OPERAND_CHARS, OPERAND_SQUARES, OPS, PLACES, POWERS, SHEET_SPACING,
  alignTo, columnCells, columnOptionsFor, decimalDigits, formatDecimal, fracSquares, generateSheet, sheetFrame, sheetShape,
} from './decimals'
import { hasCarry, needsBorrow } from './columnArithmetic'
import { PRINT_SQUARE, PRINT_WIDTH, notebookLayout, rowsPerPage } from '../hooks/useNotebookGrid'

const whole = d => Math.floor(d.scaled / 10 ** d.places)
const COMBOS = ['mul', 'div'].flatMap(op => POWERS.map(power => `${op}${power}`))

/** Every places setting × operation × offered column count, a column sheet of the size the page holds, `runs` times. */
function columnSheets(fn, runs = 20) {
  for (const places of PLACES) {
    for (const ops of OPS) {
      const { columnOptions } = sheetShape({ mode: 'column', places, columns: 3 })
      for (const columns of columnOptions) {
        const { count } = sheetShape({ mode: 'column', places, columns })
        for (let run = 0; run < runs; run++) {
          fn({ problems: generateSheet({ mode: 'column', places, ops, count }), places, ops, count })
        }
      }
    }
  }
}

function powersSheets(fn, runs = 200) {
  const { count } = sheetShape({ mode: 'powers', places: 'two', columns: 2 })
  for (let run = 0; run < runs; run++) fn(generateSheet({ mode: 'powers', count }), count)
}

describe('writing a decimal', () => {
  it('keeps at least one digit before the mark and writes it in the mark asked for', () => {
    expect(formatDecimal({ scaled: 1275, places: 2 })).toBe('12.75')
    expect(formatDecimal({ scaled: 27, places: 3 })).toBe('0.027')
    expect(formatDecimal({ scaled: 5, places: 2 })).toBe('0.05')
    expect(formatDecimal({ scaled: 345, places: 0 })).toBe('345')
    expect(formatDecimal({ scaled: 1655, places: 2 }, ',')).toBe('16,55')
  })

  it('aligns a value to more places without changing it', () => {
    expect(alignTo({ scaled: 38, places: 1 }, 2)).toEqual({ scaled: 380, places: 2 })
    expect(alignTo({ scaled: 1275, places: 2 }, 2)).toEqual({ scaled: 1275, places: 2 })
  })

  it('splits a decimal into its digits and the place of its mark', () => {
    expect(decimalDigits({ scaled: 1275, places: 2 })).toEqual({ digits: ['1', '2', '7', '5'], markAt: 2 })
    expect(decimalDigits({ scaled: 5, places: 2 })).toEqual({ digits: ['0', '0', '5'], markAt: 1 })
    expect(decimalDigits({ scaled: 27, places: 3 })).toEqual({ digits: ['0', '0', '2', '7'], markAt: 1 })
    expect(decimalDigits({ scaled: 345, places: 0 })).toEqual({ digits: ['3', '4', '5'], markAt: null })
  })

  it('lays a row out one digit per square, the mark on the grid line before the tenths', () => {
    expect(columnCells({ scaled: 1275, places: 2 }, 3, 2)).toEqual(['', '1', '2', '7', '5'])
    // 3.8 under 12.75: the 3 under the 2, the 8 under the 7, and an empty hundredths square.
    expect(columnCells({ scaled: 38, places: 1 }, 3, 2)).toEqual(['', '', '3', '8', ''])
    expect(columnCells({ scaled: 16, places: 0 }, 3, 2)).toEqual(['', '1', '6', '', ''])
  })
})

describe('column sheets', () => {
  it('adds and subtracts on aligned places, and never asks for a difference of zero or less', () => {
    columnSheets(({ problems }) => {
      for (const p of problems) {
        const width = Math.max(p.a.places, p.b.places)
        const x = alignTo(p.a, width).scaled
        const y = alignTo(p.b, width).scaled
        expect(p.result).toEqual({ scaled: p.op === 'add' ? x + y : x - y, places: width })
        if (p.op === 'sub') expect(p.result.scaled).toBeGreaterThan(0)
      }
    })
  })

  it('draws whole parts of 1–99 and never ends an operand in a zero', () => {
    columnSheets(({ problems }) => {
      for (const p of problems) {
        for (const o of [p.a, p.b]) {
          expect(whole(o)).toBeGreaterThanOrEqual(1)
          expect(whole(o)).toBeLessThanOrEqual(INT_MAX)
          expect(o.scaled % 10).not.toBe(0)
        }
      }
    })
  })

  it('uses the places asked for, and both on a mixed page', () => {
    columnSheets(({ problems, places }) => {
      const seen = new Set(problems.flatMap(p => [p.a.places, p.b.places]))
      if (places === 'one') expect([...seen]).toEqual([1])
      if (places === 'two') expect([...seen]).toEqual([2])
      if (places === 'mixed') expect([...seen].sort()).toEqual([1, 2])
    })
  })

  it('deals the operation asked for, and exactly half of each on a page set to both', () => {
    columnSheets(({ problems, ops, count }) => {
      if (ops === 'both') expect(problems.filter(p => p.op === 'add')).toHaveLength(count / 2)
      else expect(problems.every(p => p.op === ops)).toBe(true)
    })
  })

  it('leaves regrouping to chance, which still means most problems and never all', () => {
    let regrouped = 0
    let total = 0
    for (let i = 0; i < 100; i++) {
      for (const p of generateSheet({ mode: 'column', places: 'mixed', ops: 'both', count: 24 })) {
        const width = Math.max(p.a.places, p.b.places)
        const x = alignTo(p.a, width).scaled
        const y = alignTo(p.b, width).scaled
        total++
        if (p.op === 'add' ? hasCarry(x, y) : needsBorrow(x, y)) regrouped++
      }
    }
    expect(regrouped / total).toBeGreaterThan(0.5)
    expect(regrouped).toBeLessThan(total)
  })

  it('does not repeat a problem on a page', () => {
    columnSheets(({ problems }) => {
      const keys = problems.map(p => `${p.op}|${p.a.scaled}/${p.a.places}|${p.b.scaled}/${p.b.places}`)
      expect(new Set(keys).size).toBe(keys.length)
    })
  })

  it('fits every row, the carry included, in the squares budgeted for it', () => {
    columnSheets(({ problems, places }) => {
      const squares = INT_SQUARES + fracSquares(places)
      for (const p of problems) {
        for (const d of [p.a, p.b, p.result]) {
          expect(String(whole(d)).length).toBeLessThanOrEqual(INT_SQUARES)
          expect(d.places).toBeLessThanOrEqual(fracSquares(places))
          expect(columnCells(d, INT_SQUARES, fracSquares(places))).toHaveLength(squares)
        }
      }
    })
  })
})

describe('powers of ten sheets', () => {
  it('moves the point the right number of places', () => {
    powersSheets(sheet => {
      for (const p of sheet) {
        const e = Math.log10(p.power)
        // value(result) = value(a) × or ÷ 10^e, cross-multiplied into integers.
        if (p.op === 'mul') expect(p.result.scaled * 10 ** p.a.places).toBe(p.a.scaled * 10 ** (e + p.result.places))
        else expect(p.result.scaled * 10 ** (p.a.places + e)).toBe(p.a.scaled * 10 ** p.result.places)
      }
    })
  })

  it('keeps every operand and answer within its boxes', () => {
    powersSheets(sheet => {
      for (const p of sheet) {
        expect(formatDecimal(p.a).length).toBeLessThanOrEqual(OPERAND_CHARS)
        expect(formatDecimal(p.result).length).toBeLessThanOrEqual(ANSWER_CHARS)
        expect(decimalDigits(p.a).digits.length).toBeLessThanOrEqual(OPERAND_SQUARES)
        expect(decimalDigits(p.result).digits.length).toBeLessThanOrEqual(ANSWER_SQUARES)
        expect(p.result.places).toBeLessThanOrEqual(MAX_RESULT_PLACES)
        expect(p.a.scaled % 10).not.toBe(0)
        const row = decimalDigits(p.a).digits.length + 1 + String(p.power).length + 1 + decimalDigits(p.result).digits.length
        expect(row).toBeLessThanOrEqual(sheetFrame({ mode: 'powers' }).cellsWide)
      }
    })
  })

  it('multiplies and divides by all three powers on every page', () => {
    powersSheets((sheet, count) => {
      const tally = new Map()
      for (const p of sheet) tally.set(`${p.op}${p.power}`, (tally.get(`${p.op}${p.power}`) ?? 0) + 1)
      // 26 problems dealt from a deck of six: at least four of each, less a retry or two for repeats.
      for (const combo of COMBOS) expect(tally.get(combo) ?? 0, combo).toBeGreaterThanOrEqual(Math.floor(count / COMBOS.length) - 2)
      expect(new Set(sheet.map(p => `${p.op}|${p.a.scaled}/${p.a.places}|${p.power}`)).size).toBe(sheet.length)
    }, 100)
  })
})

describe('decimals sheet geometry', () => {
  it('budgets a column as operator, whole part with carry and places, and a powers line as fourteen squares', () => {
    expect(PLACES.map(places => sheetFrame({ mode: 'column', places }))).toEqual([
      { rows: 3, cellsWide: 5 }, { rows: 3, cellsWide: 6 }, { rows: 3, cellsWide: 6 },
    ])
    expect(sheetFrame({ mode: 'powers' })).toEqual({ rows: 1, cellsWide: 14 })
  })

  it('offers four columns for column sums and two for the long powers line', () => {
    expect(columnOptionsFor(5)).toEqual([2, 3, 4])
    expect(columnOptionsFor(6)).toEqual([2, 3, 4])
    expect(columnOptionsFor(14)).toEqual([2])
    expect(sheetShape({ mode: 'powers', places: 'two', columns: 4 }).columns).toBe(2)
  })

  it('fills exactly one printed page in either mode', () => {
    expect(rowsPerPage(3, SHEET_SPACING)).toBe(6)
    expect(rowsPerPage(1, SHEET_SPACING)).toBe(13)
    for (const mode of MODES) {
      for (const places of PLACES) {
        const { columnOptions, frame } = sheetShape({ mode, places, columns: 3 })
        for (const columns of columnOptions) {
          expect(sheetShape({ mode, places, columns }).count).toBe(columns * (mode === 'powers' ? 13 : 6))
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
    for (const mode of MODES) {
      const args = { mode, places: 'mixed', ops: 'both', count: 18 }
      expect(generateSheet(args, mulberry32(123)), mode).toEqual(generateSheet(args, mulberry32(123)))
      expect(generateSheet(args, mulberry32(123)), mode).not.toEqual(generateSheet(args, mulberry32(124)))
    }
  })
})
