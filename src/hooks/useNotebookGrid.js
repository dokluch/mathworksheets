import { useLayoutEffect, useRef, useState } from 'react'

/**
 * Lays a column-arithmetic worksheet out on a squared ("notebook") grid so
 * that every digit cell, operator, header and gap is a whole number of
 * squares. The background pattern then lines up with the content exactly,
 * on screen and on paper.
 */

/** Square size on screen when there is room for it. */
export const SCREEN_SQUARE = 26
/** Smallest square we shrink to on narrow screens before allowing horizontal scroll. */
export const MIN_SQUARE = 18
/** 1/4 inch at 96 dpi: standard quad ruling on printed sheets. */
export const PRINT_SQUARE = 24
/** Letter landscape (11in) minus the 0.3in margins declared by `@page` in index.css. */
export const PRINT_WIDTH = (11 - 0.6) * 96
/** Squares of padding on each side of the sheet. */
export const PAD = 1
/** Width assumed until the sheet has been measured (also used in jsdom). */
const DEFAULT_WIDTH = 910

/**
 * Pure layout maths, exported for tests.
 *
 * @param {object} o
 * @param {number} o.width      available padding-box width in px
 * @param {number} o.columns    problems per row
 * @param {number} o.cellsWide  squares per problem (digits + operator column)
 * @param {number} [o.square]   preferred square size
 * @param {number} [o.minSquare] smallest square allowed before overflowing
 * @returns {{ square: number, gap: number, offset: number, overflow: boolean }}
 *   square: px, gap/offset: whole squares (gap between problems, left offset that centres the block)
 */
export function notebookLayout({ width, columns, cellsWide, square = SCREEN_SQUARE, minSquare = MIN_SQUARE }) {
  const minBlock = PAD * 2 + columns * cellsWide + Math.max(0, columns - 1)
  let sq = square
  if (minBlock * sq > width) sq = Math.max(minSquare, Math.floor(width / minBlock))

  const across = Math.floor(width / sq)
  const free = across - PAD * 2 - columns * cellsWide
  const gap = columns > 1 ? Math.min(cellsWide, Math.max(1, Math.floor(free / (columns - 1)))) : 0
  const leftover = free - Math.max(0, columns - 1) * gap
  const offset = Math.max(0, Math.floor(leftover / 2))

  return { square: sq, gap, offset, overflow: minBlock * sq > width }
}

/**
 * @param {{ columns: number, cellsWide: number, rows: number }} o
 *   rows: digit rows per problem (rules between rows take no space)
 * @returns {[import('react').RefObject, object]}
 *   attach the ref and the style object to the `.worksheet.colarith-notebook` element
 */
export function useNotebookGrid({ columns, cellsWide, rows }) {
  const ref = useRef(null)
  const [width, setWidth] = useState(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined
    const measure = () => setWidth(el.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const screen = notebookLayout({ width: width ?? DEFAULT_WIDTH, columns, cellsWide })
  const print = notebookLayout({
    width: PRINT_WIDTH,
    columns,
    cellsWide,
    square: PRINT_SQUARE,
    minSquare: PRINT_SQUARE,
  })

  const style = {
    '--nb-sq-screen': `${screen.square}px`,
    '--nb-gap-screen': screen.gap,
    '--nb-offset-screen': screen.offset,
    '--nb-sq-print': `${print.square}px`,
    '--nb-gap-print': print.gap,
    '--nb-offset-print': print.offset,
    '--nb-cols': columns,
    '--nb-cell-w': cellsWide,
    '--nb-rows': rows,
  }

  return [ref, style]
}
