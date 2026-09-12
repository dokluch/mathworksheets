import { fitsPrint, problemsPerPage } from '../hooks/useNotebookGrid'
import { asHelpers } from './rng.js'

/**
 * Problem generation and notebook geometry for the Decimals sheet.
 *
 * A decimal is never a float here: it is `{ scaled, places }`, meaning
 * scaled / 10^places, so 12.75 is { scaled: 1275, places: 2 }. Adding 0.1 and
 * 0.2 gives 0.3, and the answer key cannot print 0.30000000000000004.
 *
 * Two modes:
 *  - column: vertical addition and subtraction with the decimal mark in a
 *    square of its own, so the marks line up down the page and a child can see
 *    that 3.8 sits under 12.75 by its point, not by its last digit;
 *  - powers: one-line multiplication and division by 10, 100 and 1000, where
 *    the point moves and the answer has one box per character, the mark's too.
 *
 * Column problems are not steered towards carrying, unlike Column Addition:
 * two random decimals already carry or borrow on most problems, and forcing it
 * left a page with almost nothing easy on it.
 *
 * The mark itself is chosen at paint time (point or comma, per language), so
 * nothing in here knows which one a sheet will print.
 */

export const MODES = ['column', 'powers']
export const PLACES = ['one', 'two', 'mixed']
export const OPS = ['add', 'sub', 'both']
export const POWERS = [10, 100, 1000]
export const MARKS = { point: '.', comma: ',' }
export const COLUMN_OPTIONS = [2, 3, 4]
/** Problems sit one empty square apart, as on the column and one-line sheets. */
export const SHEET_SPACING = { rowGap: 0, headerGap: 0 }
/** Largest whole part of an operand; a sum of two can reach 198, hence a carry square. */
export const INT_MAX = 99
/** Whole-part squares in a column: two digits and the carry. */
export const INT_SQUARES = 3
/** Powers mode keeps answers to thousandths, and to five characters including the mark. */
export const MAX_RESULT_PLACES = 3
export const OPERAND_SQUARES = 4
export const ANSWER_SQUARES = 5
const DEDUPE_TRIES = 12

/** A decimal written out: digits, the mark, and at least one digit before it. */
export function formatDecimal({ scaled, places }, mark = MARKS.point) {
  const digits = String(scaled).padStart(places + 1, '0')
  if (places === 0) return digits
  return `${digits.slice(0, -places)}${mark}${digits.slice(-places)}`
}

/** The same value written to more places: 3.8 as 3.80 is { scaled: 380, places: 2 }. */
export function alignTo({ scaled, places }, target) {
  return { scaled: scaled * 10 ** (target - places), places: target }
}

/**
 * One row of a column problem, one character per square: `intSquares` digits
 * right-aligned before the mark, the mark, then the fractional digits
 * left-aligned after it. Empty squares are ''. A whole number (places 0) still
 * leaves its mark square empty, so a column never shifts.
 */
export function columnCells(dec, intSquares, fracSquares, mark = MARKS.point) {
  const text = formatDecimal(dec, mark)
  const whole = dec.places ? text.slice(0, -dec.places - 1) : text
  const frac = dec.places ? text.slice(-dec.places) : ''
  const cells = Array(intSquares + 1 + fracSquares).fill('')
  ;[...whole].forEach((char, i) => { cells[intSquares - whole.length + i] = char })
  if (dec.places) cells[intSquares] = mark
  ;[...frac].forEach((char, i) => { cells[intSquares + 1 + i] = char })
  return cells
}

const placesFor = (setting, r) => (setting === 'one' ? 1 : setting === 'two' ? 2 : r.pick([1, 2]))

/** A whole part of 1–99 and a fractional part whose last digit is not zero, so 2 places never reads as 1. */
function operand(places, r) {
  const frac = places === 1 ? r.int(1, 9) : r.int(0, 9) * 10 + r.int(1, 9)
  return { scaled: r.int(1, INT_MAX) * 10 ** places + frac, places }
}

/** Both operands are drawn per problem, so a mixed page puts 3.8 under 12.75. */
function columnProblem(places, op, r) {
  for (;;) {
    let a = operand(placesFor(places, r), r)
    let b = operand(placesFor(places, r), r)
    const width = Math.max(a.places, b.places)
    let x = alignTo(a, width).scaled
    let y = alignTo(b, width).scaled
    // A difference of zero leaves a row of boxes that only ever holds 0.
    if (op === 'sub' && x === y) continue
    // Larger on top: a difference is never negative.
    if (op === 'sub' && x < y) [a, b, x, y] = [b, a, y, x]
    return { op, a, b, result: { scaled: op === 'add' ? x + y : x - y, places: width } }
  }
}

/** Deals without replacement and reshuffles only once the deck is spent. */
function dealer(pool, r) {
  let deck = []
  return () => {
    if (!deck.length) deck = r.shuffle(pool)
    return deck.pop()
  }
}

/**
 * Multiply or divide by a power of ten. The operator and the power are dealt
 * from a deck of every combination, so a page of 26 sees each of the six
 * several times; the number is then drawn until the answer fits its boxes.
 */
function powersProblem([op, power], r) {
  const e = Math.log10(power)
  for (;;) {
    const places = r.int(0, 2)
    let m = r.int(1, 999)
    // A trailing zero would print 3.40, which is 3.4 written badly.
    if (m % 10 === 0) m += r.int(1, 9)
    const a = { scaled: m, places }
    if (formatDecimal(a).length > OPERAND_SQUARES) continue
    const result = op === 'mul'
      ? (places >= e ? { scaled: m, places: places - e } : { scaled: m * 10 ** (e - places), places: 0 })
      : { scaled: m, places: places + e }
    if (result.places > MAX_RESULT_PLACES || formatDecimal(result).length > ANSWER_SQUARES) continue
    return { op, power, a, result }
  }
}

const key = p => `${p.op}|${p.a.scaled}/${p.a.places}|${p.b ? `${p.b.scaled}/${p.b.places}` : p.power}`

export function generateSheet({ mode, places = 'two', ops = 'both', count }, rng = Math.random) {
  const r = asHelpers(rng)
  let next
  if (mode === 'powers') {
    const combos = dealer(['mul', 'div'].flatMap(op => POWERS.map(power => [op, power])), r)
    next = () => powersProblem(combos(), r)
  } else {
    // A page set to both operations is half each, shuffled.
    const opList = ops === 'both'
      ? r.shuffle(Array.from({ length: count }, (_, i) => (i % 2 ? 'sub' : 'add')))
      : Array.from({ length: count }, () => ops)
    next = i => columnProblem(places, opList[i], r)
  }
  const seen = new Set()
  return Array.from({ length: count }, (_, i) => {
    let item = next(i)
    for (let tries = 0; tries < DEDUPE_TRIES && seen.has(key(item)); tries++) item = next(i)
    seen.add(key(item))
    return item
  })
}

/** Fractional squares a column needs: one place, or two when two or mixed places can appear. */
export function fracSquares(places) {
  return places === 'one' ? 1 : 2
}

/**
 * Squares a problem is budgeted. A column is the operator, the whole part with
 * its carry, the mark and the fractional places. A powers line is the operand,
 * the sign, the power, = and the answer boxes.
 */
export function sheetFrame({ mode, places }) {
  if (mode === 'powers') {
    return { rows: 1, cellsWide: OPERAND_SQUARES + 1 + String(POWERS[POWERS.length - 1]).length + 1 + ANSWER_SQUARES }
  }
  return { rows: 3, cellsWide: 1 + INT_SQUARES + 1 + fracSquares(places) }
}

/** Column counts that print at 1/4in squares without shrinking the grid. */
export function columnOptionsFor(cellsWide) {
  return COLUMN_OPTIONS.filter(columns => fitsPrint(columns, cellsWide))
}

/** Everything that follows from the settings, as in src/lib/division.js. */
export function sheetShape({ mode, places, columns }) {
  const frame = sheetFrame({ mode, places })
  const columnOptions = columnOptionsFor(frame.cellsWide)
  const active = columnOptions.includes(columns) ? columns : columnOptions[columnOptions.length - 1]
  const count = problemsPerPage({ columns: active, rows: frame.rows, ...SHEET_SPACING })
  return { columnOptions, columns: active, frame, count }
}
