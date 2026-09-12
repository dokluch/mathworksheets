import { fitsPrint, problemsPerPage } from '../hooks/useNotebookGrid'

/**
 * Page geometry shared by the notebook sheets.
 *
 * Each generator lib describes only its own frame: how many rows and squares
 * one problem takes for a setting. What follows from a frame is the same on
 * every sheet and lives here: which column counts still print at 1/4in, which
 * one a persisted choice falls back to, how many problems fill one page, and
 * dealing problems without repeating one on the page.
 */

export const COLUMN_OPTIONS = [2, 3, 4]
/** Problems sit one empty square apart (the spare row each item carries), with nothing extra under the header. */
export const TIGHT_SPACING = { rowGap: 0, headerGap: 0 }
/** Redraws before a problem already on the page is allowed to repeat. */
export const DEDUPE_TRIES = 12

/** Deals without replacement and reshuffles only once the deck is spent, so a page repeats nothing while the pool lasts. */
export function dealer(pool, r) {
  let deck = []
  return () => {
    if (!deck.length) deck = r.shuffle(pool)
    return deck.pop()
  }
}

/** Column counts that print at 1/4in squares without shrinking the grid. */
export function columnOptionsFor(cellsWide, options = COLUMN_OPTIONS) {
  return options.filter(columns => fitsPrint(columns, cellsWide))
}

/**
 * A lib's sheetShape(settings): everything that follows from the settings.
 * `sheetFrame(settings)` gives `{ rows, cellsWide }`; the shape adds the column
 * counts on offer, the columns actually used (a persisted count that no longer
 * fits falls back to the widest that does), how many problems fill one page,
 * and the spacing the grid is laid out with.
 */
export function makeSheetShape({ sheetFrame, spacing = TIGHT_SPACING, columnOptions = COLUMN_OPTIONS }) {
  return function sheetShape(settings) {
    const frame = sheetFrame(settings)
    const options = columnOptionsFor(frame.cellsWide, columnOptions)
    const columns = options.includes(settings.columns) ? settings.columns : options[options.length - 1]
    const count = problemsPerPage({ columns, rows: frame.rows, ...spacing })
    return { columnOptions: options, columns, frame, count, spacing }
  }
}

/**
 * `count` problems from `next(i)`. A problem whose `key` is already on the page
 * is drawn again, up to `tries` times, and then allowed: a small pool must
 * still fill the page.
 */
export function dealUnique(count, next, key, tries = DEDUPE_TRIES) {
  const seen = new Set()
  return Array.from({ length: count }, (_, i) => {
    let item = next(i)
    for (let attempt = 0; attempt < tries && seen.has(key(item)); attempt++) item = next(i)
    seen.add(key(item))
    return item
  })
}
