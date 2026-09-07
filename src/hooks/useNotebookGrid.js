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

/* Page margins declared by `@page` in index.css. The bottom is wider than the
   top because it reserves the band the print footer sits in — budgeting the
   symmetric 0.3in here is what used to overflow a row onto a second sheet. */
export const PAGE_MARGIN_X = 0.3
export const PAGE_MARGIN_TOP = 0.3
export const PAGE_MARGIN_BOTTOM = 0.5

/* The sheet must fit Letter *or* A4, because `@page` no longer forces a paper
   size and five of the seven locales are A4 countries. Landscape Letter is
   11 × 8.5in and landscape A4 is 11.69 × 8.27in, so the printable box is the
   intersection: Letter's width and A4's height. A sheet laid out to this fits
   either tray without scaling. */
const PAPER_WIDTH_IN = 11
const PAPER_HEIGHT_IN = 8.27

export const PRINT_WIDTH = (PAPER_WIDTH_IN - PAGE_MARGIN_X * 2) * 96
export const PRINT_HEIGHT = (PAPER_HEIGHT_IN - PAGE_MARGIN_TOP - PAGE_MARGIN_BOTTOM) * 96

/** Whole squares the printable box holds top to bottom: the page's row budget,
    and the height the ruling is stretched to so the sheet is squared paper all
    the way to the bottom margin rather than only as far as the last problem. */
export const PAGE_SQUARES = Math.floor(PRINT_HEIGHT / PRINT_SQUARE)

/**
 * Squares taken by the header band: the title line and the ruled
 * Name / Date / Set no. block sit side by side, so the band measures 72px —
 * exactly three squares — on a printed notebook sheet.
 */
export const HEADER_BAND = 3
/** Default empty squares below the header band and between rows of problems (each problem also has one spare square above it). */
export const ROW_GAP = 1
/** Squares of padding on each side of the sheet. */
export const PAD = 1
/** Width assumed until the sheet has been measured (also used in jsdom). */
const DEFAULT_WIDTH = 910

/** Top padding the sheet adds inside the @page box (`.worksheet` in AddSubtract.css). */
export const SHEET_PAD_TOP = 0.4 * 96
/** Fixed print height of one row in a flat list worksheet (`.pattern-row`). */
export const PRINT_LIST_ROW = 49

/**
 * Rows of a fixed-height list that fit one printed page, for worksheets laid
 * out as a flat list rather than on the notebook grid. `headerPx` must budget
 * the tallest translation of the header, since a wrapped instruction line in
 * German or Russian is what would otherwise spill a row onto a second sheet.
 */
export function listRowsPerPage(rowPx = PRINT_LIST_ROW, headerPx = 112) {
  return Math.max(1, Math.floor((PRINT_HEIGHT - SHEET_PAD_TOP - headerPx) / rowPx))
}

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
 * Rows of problems that fit on one printed page, given the digit rows per
 * problem: header band, headerGap, then n items of (rows + 1) squares
 * separated by rowGap, with no bottom padding in print.
 */
export function rowsPerPage(rows, { rowGap = ROW_GAP, headerGap = ROW_GAP } = {}) {
  return Math.max(1, Math.floor((PAGE_SQUARES - HEADER_BAND - headerGap + rowGap) / (rows + 1 + rowGap)))
}

/** Problems that fill exactly one printed page for a column count. */
export function problemsPerPage({ columns, rows, rowGap, headerGap }) {
  return columns * rowsPerPage(rows, { rowGap, headerGap })
}

/**
 * @param {{ columns: number, cellsWide: number, rows: number, rowGap?: number, headerGap?: number }} o
 *   rows: digit rows per problem (rules between rows take no space);
 *   rowGap / headerGap: empty squares between problem rows / below the header (default ROW_GAP)
 * @returns {[import('react').RefObject, object]}
 *   attach the ref and the style object to the `.worksheet.colarith-notebook` element
 */
export function useNotebookGrid({ columns, cellsWide, rows, rowGap = ROW_GAP, headerGap = ROW_GAP }) {
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
    '--nb-row-gap': rowGap,
    '--nb-header-gap': headerGap,
    '--nb-page-sq': PAGE_SQUARES,
  }

  return [ref, style]
}
