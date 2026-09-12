import { describe, it, expect } from 'vitest'
import { asHelpers, mulberry32 } from './rng.js'
import { COLUMN_OPTIONS, TIGHT_SPACING, columnOptionsFor, dealUnique, dealer, makeSheetShape } from './sheet.js'
import { fitsPrint, rowsPerPage } from '../hooks/useNotebookGrid'

describe('dealer', () => {
  it('deals every card once before reshuffling', () => {
    const deal = dealer([1, 2, 3, 4, 5], asHelpers(mulberry32(7)))
    const first = Array.from({ length: 5 }, deal)
    expect([...first].sort()).toEqual([1, 2, 3, 4, 5])
    const second = Array.from({ length: 5 }, deal)
    expect([...second].sort()).toEqual([1, 2, 3, 4, 5])
  })
})

describe('columnOptionsFor', () => {
  it('keeps the column counts that print at full size', () => {
    expect(columnOptionsFor(5)).toEqual(COLUMN_OPTIONS)
    expect(columnOptionsFor(12)).toEqual([2, 3])
    expect(columnOptionsFor(15)).toEqual([2])
    expect(columnOptionsFor(7, [2, 3])).toEqual([2, 3])
    for (const width of [5, 9, 10, 12, 13, 19]) {
      for (const columns of columnOptionsFor(width)) expect(fitsPrint(columns, width)).toBe(true)
    }
  })
})

describe('makeSheetShape', () => {
  const sheetShape = makeSheetShape({ sheetFrame: ({ wide }) => ({ rows: 2, cellsWide: wide ? 12 : 5 }) })

  it('fills one page at the chosen column count', () => {
    const shape = sheetShape({ wide: false, columns: 3 })
    expect(shape.columnOptions).toEqual([2, 3, 4])
    expect(shape.columns).toBe(3)
    expect(shape.count).toBe(3 * rowsPerPage(2, TIGHT_SPACING))
    expect(shape.spacing).toBe(TIGHT_SPACING)
  })

  it('falls back to the widest column count that still prints', () => {
    expect(sheetShape({ wide: true, columns: 4 }).columns).toBe(3)
    expect(sheetShape({ wide: false, columns: 7 }).columns).toBe(4)
  })

  it('honours its own spacing and column list', () => {
    const spaced = makeSheetShape({ sheetFrame: () => ({ rows: 2, cellsWide: 5 }), spacing: { rowGap: 1, headerGap: 1 }, columnOptions: [2, 3] })
    const shape = spaced({ columns: 4 })
    expect(shape.columnOptions).toEqual([2, 3])
    expect(shape.columns).toBe(3)
    expect(shape.count).toBe(3 * rowsPerPage(2, { rowGap: 1, headerGap: 1 }))
  })
})

describe('dealUnique', () => {
  it('redraws a repeat, and accepts one once the tries run out', () => {
    const draws = [1, 1, 2, 2, 2, 2]
    let calls = 0
    const items = dealUnique(3, () => draws[Math.min(calls++, draws.length - 1)], x => x, 2)
    expect(items).toEqual([1, 2, 2])
    expect(calls).toBe(6)
  })

  it('passes the position to the generator', () => {
    expect(dealUnique(4, i => i * 10, x => x)).toEqual([0, 10, 20, 30])
  })
})
