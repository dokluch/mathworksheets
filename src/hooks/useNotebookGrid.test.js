import { describe, it, expect } from 'vitest'
import { notebookLayout, PRINT_WIDTH, PRINT_SQUARE, PAD, SCREEN_SQUARE, MIN_SQUARE } from './useNotebookGrid'

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
