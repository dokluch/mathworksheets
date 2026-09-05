import { describe, it, expect } from 'vitest'
import {
  notebookLayout, rowsPerPage, problemsPerPage,
  PRINT_WIDTH, PRINT_HEIGHT, PRINT_SQUARE, PAD, SCREEN_SQUARE, MIN_SQUARE, HEADER_BAND, ROW_GAP,
} from './useNotebookGrid'

function blockSquares(columns, cellsWide, { gap, offset }) {
  return PAD * 2 + offset + columns * cellsWide + (columns - 1) * gap
}

describe('notebookLayout', () => {
  it('keeps the preferred square and centres the block when there is room', () => {
    const layout = notebookLayout({ width: 910, columns: 2, cellsWide: 8 })
    expect(layout.square).toBe(SCREEN_SQUARE)
    expect(layout.overflow).toBe(false)
    expect(Number.isInteger(layout.gap) && layout.gap >= 1).toBe(true)
    expect(blockSquares(2, 8, layout) * layout.square).toBeLessThanOrEqual(910)
  })

  it('shrinks the square to an integer size so 4 wide problems still fit', () => {
    const layout = notebookLayout({ width: 910, columns: 4, cellsWide: 8 })
    expect(layout.square).toBeLessThan(SCREEN_SQUARE)
    expect(Number.isInteger(layout.square)).toBe(true)
    expect(layout.overflow).toBe(false)
    expect(layout.gap).toBeGreaterThanOrEqual(1)
    expect(blockSquares(4, 8, layout) * layout.square).toBeLessThanOrEqual(910)
  })

  it('never goes below the minimum square and reports overflow on phones', () => {
    const layout = notebookLayout({ width: 300, columns: 2, cellsWide: 8 })
    expect(layout.square).toBe(MIN_SQUARE)
    expect(layout.overflow).toBe(true)
    expect(layout.gap).toBe(1)
    expect(layout.offset).toBe(0)
  })

  it('fits every print configuration on letter landscape with 1/4in squares', () => {
    for (const columns of [2, 3, 4]) {
      for (const cellsWide of [4, 5, 6, 7, 8]) {
        const layout = notebookLayout({
          width: PRINT_WIDTH, columns, cellsWide, square: PRINT_SQUARE, minSquare: PRINT_SQUARE,
        })
        expect(layout.square).toBe(PRINT_SQUARE)
        expect(layout.overflow).toBe(false)
        expect(blockSquares(columns, cellsWide, layout) * PRINT_SQUARE).toBeLessThanOrEqual(PRINT_WIDTH)
      }
    }
  })

  it('caps the gap at one problem width so two columns are not flung apart', () => {
    const layout = notebookLayout({ width: PRINT_WIDTH, columns: 2, cellsWide: 6, square: PRINT_SQUARE })
    expect(layout.gap).toBe(6)
    expect(layout.offset).toBeGreaterThan(0)
  })
})

describe('problemsPerPage', () => {
  function pageSquares(rows, n, rowGap = ROW_GAP, headerGap = ROW_GAP) {
    return HEADER_BAND + headerGap + n * (rows + 1) + (n - 1) * rowGap
  }

  it('fills a letter landscape page without spilling over', () => {
    for (const rows of [3, 4, 5, 6]) {
      for (const spacing of [{}, { rowGap: 0, headerGap: 0 }, { rowGap: 2, headerGap: 1 }]) {
        const n = rowsPerPage(rows, spacing)
        expect(pageSquares(rows, n, spacing.rowGap, spacing.headerGap) * PRINT_SQUARE).toBeLessThanOrEqual(PRINT_HEIGHT)
        expect(pageSquares(rows, n + 1, spacing.rowGap, spacing.headerGap) * PRINT_SQUARE).toBeGreaterThan(PRINT_HEIGHT)
      }
    }
  })

  it('gives 4 rows of long multiplication and 7 rows of packed column addition per page', () => {
    expect(rowsPerPage(5)).toBe(4)
    expect(rowsPerPage(3, { rowGap: 0, headerGap: 0 })).toBe(7)
    expect(problemsPerPage({ columns: 3, rows: 5 })).toBe(12)
    expect(problemsPerPage({ columns: 4, rows: 3, rowGap: 0, headerGap: 0 })).toBe(28)
  })
})
