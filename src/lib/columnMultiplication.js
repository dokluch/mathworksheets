import { asHelpers } from './rng.js'
import { makeSheetShape } from './sheet.js'

/**
 * Problem generation and notebook geometry for the Column Multiplication sheet:
 * long multiplication with a row of working for every multiplier digit.
 *
 * Pure functions, kept out of the component so they can be unit-tested and so
 * the file exports components only (react-refresh).
 */

export const PRESETS = [
  { value: '2x2', aDigits: 2, bDigits: 2 },
  { value: '3x2', aDigits: 3, bDigits: 2 },
  { value: '3x3', aDigits: 3, bDigits: 3 },
  { value: '4x2', aDigits: 4, bDigits: 2 },
]

/** A number whose digits are all 1–9, so every partial product fills a full row. */
export function randNoZeroDigits(digits, r) {
  let n = 0
  for (let i = 0; i < digits; i++) n = n * 10 + r.int(1, 9)
  return n
}

export function generateProblem(aDigits, bDigits, r) {
  const aMin = 10 ** (aDigits - 1)
  const aMax = 10 ** aDigits - 1

  const a = r.int(aMin, aMax)
  // A zero digit in the multiplier would give a partial product of "0" with a
  // single placeholder in an otherwise blank row, which reads as a mistake.
  const b = randNoZeroDigits(bDigits, r)

  const bDigitsArr = String(b).split('').reverse().map(Number)
  const partialProducts = bDigitsArr.map((digit, shift) => ({
    value: a * digit,
    shift,
  }))

  return { a, b, partialProducts, product: a * b }
}

export function generateSheet({ count, aDigits, bDigits }, rng = Math.random) {
  const r = asHelpers(rng)
  return Array.from({ length: count }, () => generateProblem(aDigits, bDigits, r))
}

/**
 * Every problem of a preset is laid out on the same number of digit columns
 * (a product of an m-digit by an n-digit number has at most m + n digits, and
 * so does the widest shifted partial product), so columns line up on the grid.
 */
export function digitColumns(aDigits, bDigits) {
  return aDigits + bDigits
}

/** Rows: multiplicand, multiplier, one row per partial product, and the product. */
export function problemRows(bDigits) {
  return 3 + bDigits
}

/** Problems are tall, so a blank row separates them and another sits under the header. */
export const SHEET_SPACING = { rowGap: 1, headerGap: 1 }

/** Squares a problem is budgeted: its digit columns and the operator square beside them. */
export function sheetFrame({ aDigits, bDigits }) {
  return { rows: problemRows(bDigits), cellsWide: digitColumns(aDigits, bDigits) + 1 }
}

/** Everything that follows from the settings (see makeSheetShape in src/lib/sheet.js). */
export const sheetShape = makeSheetShape({ sheetFrame, spacing: SHEET_SPACING })
