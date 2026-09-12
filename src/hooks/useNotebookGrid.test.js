import { describe, it, expect } from 'vitest'
import {
  notebookLayout, rowsPerPage, problemsPerPage,
  PRINT_WIDTH, PRINT_HEIGHT, PRINT_SQUARE, PAD, SCREEN_SQUARE, MIN_SQUARE, HEADER_BAND, ROW_GAP, headerRows
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

  it('fits nine squares four to a row, but not ten', () => {
    // Nine squares is the widest a problem can be and still print four to a
    // row; ColumnDivision.jsx offers its column counts on this basis rather
    // than shrinking the square below 1/4in.
    const fits = (columns, cellsWide) => !notebookLayout({
      width: PRINT_WIDTH, columns, cellsWide, square: PRINT_SQUARE, minSquare: PRINT_SQUARE,
    }).overflow

    expect(fits(4, 9)).toBe(true)
    expect(fits(4, 10)).toBe(false)
    expect(fits(3, 10)).toBe(true)
    expect(fits(2, 10)).toBe(true)
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

  it('fills one landscape page without spilling over', () => {
    for (const rows of [3, 4, 5, 6]) {
      for (const spacing of [{}, { rowGap: 0, headerGap: 0 }, { rowGap: 2, headerGap: 1 }]) {
        const n = rowsPerPage(rows, spacing)
        expect(pageSquares(rows, n, spacing.rowGap, spacing.headerGap) * PRINT_SQUARE).toBeLessThanOrEqual(PRINT_HEIGHT)
        expect(pageSquares(rows, n + 1, spacing.rowGap, spacing.headerGap) * PRINT_SQUARE).toBeGreaterThan(PRINT_HEIGHT)
      }
    }
  })

  it('gives 3 rows of long multiplication and 6 rows of packed column addition per page', () => {
    expect(rowsPerPage(5)).toBe(3)
    expect(rowsPerPage(3, { rowGap: 0, headerGap: 0 })).toBe(6)
    expect(problemsPerPage({ columns: 3, rows: 5 })).toBe(9)
    expect(problemsPerPage({ columns: 4, rows: 3, rowGap: 0, headerGap: 0 })).toBe(24)
  })

  // Regression: the budget used to assume symmetric 0.3in margins while @page
  // reserved 0.5in at the bottom, so column addition generated 21 problems and
  // printed 18 plus three orphans on a sliced second page.
  it('never budgets more rows than the shortest supported paper holds', () => {
    const usable = (8.27 - 0.3 - 0.5) * 96
    expect(PRINT_HEIGHT).toBeLessThanOrEqual(usable)
    const n = rowsPerPage(3, { rowGap: 0, headerGap: 0 })
    expect(pageSquares(3, n, 0, 0) * PRINT_SQUARE).toBeLessThanOrEqual(PRINT_HEIGHT)
  })
})

describe('headerRows', () => {
  it('rounds a header up to whole squares so the problems under it stay on the ruling', () => {
    expect(headerRows(72, 18, 4)).toBe(4)
    // 4.74 and 6.08 squares: the bands that knocked sheets off the grid on phones.
    expect(headerRows(85.3, 18, 4)).toBe(5)
    expect(headerRows(109.4, 18, 4)).toBe(7)
    expect(headerRows(90, 18, 4)).toBe(5)
  })

  it('never drops below the minimum, and ignores sub-pixel noise', () => {
    expect(headerRows(40, 26, 3)).toBe(3)
    expect(headerRows(0, 18, 4)).toBe(4)
    expect(headerRows(72.4, 18, 4)).toBe(4)
  })

  it('falls back to the minimum before the grid has a square size', () => {
    expect(headerRows(100, 0, 4)).toBe(4)
  })
})
