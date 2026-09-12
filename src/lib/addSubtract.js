import { problemsPerPage } from '../hooks/useNotebookGrid'
import { asHelpers } from './rng.js'
import { COLUMN_OPTIONS, TIGHT_SPACING, columnOptionsFor } from './sheet.js'

/**
 * Problem generation and notebook geometry for the Add & Subtract sheet.
 *
 * Both layouts sit on the squared grid shared with the column sheets, one
 * symbol per square, so the sheet's size on paper is fixed by the widest
 * problem it can produce rather than by the problems it happened to draw.
 */

export const SIXTY_SEVEN_ANSWER = 67
export { COLUMN_OPTIONS, columnOptionsFor }
/** Problems sit one empty square apart (the next problem's spare row), as on Column Addition. */
export const SHEET_SPACING = TIGHT_SPACING

/** Blank positions: left operand, right operand, result. */
export const BLANK_A = 0
export const BLANK_B = 1
export const BLANK_RESULT = 2

function chooseOp(ops, r) {
  const opList = []
  if (ops === 'add' || ops === 'both') opList.push('+')
  if (ops === 'sub' || ops === 'both') opList.push('-')
  return r.pick(opList)
}

/** A stacked sum is solved downwards, so only its result is ever the unknown. */
function chooseBlank(stacked, r) {
  return stacked ? BLANK_RESULT : r.int(0, 2)
}

export function generateProblem(ops, maxVal, stacked = false, rng) {
  const r = asHelpers(rng)
  const op = chooseOp(ops, r)

  let a, b, result
  if (op === '+') {
    result = r.int(2, maxVal)
    a = r.int(1, result - 1)
    b = result - a
  } else {
    a = r.int(2, maxVal)
    b = r.int(1, a - 1)
    result = a - b
  }

  const blankPos = chooseBlank(stacked, r)
  // Inline only: sometimes written result-first (result = a op b).
  const reversed = r.chance(0.3)

  return { a, b, op, result, blankPos, reversed }
}

export function getBlankAnswer(problem) {
  if (problem.blankPos === BLANK_A) return problem.a
  if (problem.blankPos === BLANK_B) return problem.b
  return problem.result
}

export function generateProblemWithAnswer(answer, ops, maxVal, stacked = false, rng) {
  const r = asHelpers(rng)
  const op = chooseOp(ops, r)
  const blankPos = chooseBlank(stacked, r)
  const reversed = r.chance(0.3)
  const effectiveMax = Math.max(maxVal, answer + 1)

  let a, b, result

  if (op === '+') {
    if (blankPos === BLANK_A) {
      a = answer
      result = r.int(answer + 1, effectiveMax)
      b = result - a
    } else if (blankPos === BLANK_B) {
      b = answer
      result = r.int(answer + 1, effectiveMax)
      a = result - b
    } else {
      result = answer
      a = r.int(1, answer - 1)
      b = result - a
    }
  } else {
    if (blankPos === BLANK_A) {
      a = answer
      b = r.int(1, answer - 1)
      result = a - b
    } else if (blankPos === BLANK_B) {
      b = answer
      a = r.int(answer + 1, effectiveMax)
      result = a - b
    } else {
      result = answer
      a = r.int(answer + 1, effectiveMax)
      b = a - result
    }
  }

  return { a, b, op, result, blankPos, reversed }
}

function generateProblemAvoidingAnswer(answer, ops, maxVal, stacked, r) {
  for (let attempt = 0; attempt < 20; attempt++) {
    const problem = generateProblem(ops, maxVal, stacked, r)
    if (getBlankAnswer(problem) !== answer) return problem
  }

  return generateProblemWithAnswer(answer === 2 ? 3 : 2, ops, maxVal, stacked, r)
}

/** 67 mode hides one 67 per column: a small treasure hunt on 2- and 3-column sheets. */
export function sixtySevenApplies(enabled, columns) {
  return enabled && (columns === 2 || columns === 3)
}

/**
 * The largest number a sheet can show: the limit, or 68 once a 67 has to be
 * planted on a sheet within 10 or 20 (67 as an operand needs a result above it).
 */
export function largestValue(maxVal, sixtySeven) {
  return sixtySeven ? Math.max(maxVal, SIXTY_SEVEN_ANSWER + 1) : maxVal
}

/**
 * Squares a problem occupies on the notebook grid.
 *
 * Stacked: the operator column plus one square per digit of the largest number.
 * Inline: every digit, the operator and "=" in a square each. Of a, b and the
 * result at most one can reach the largest value — the other two are strictly
 * smaller — which is what keeps the within-100 sheet at 9 squares, not 11.
 */
export function sheetFrame({ stacked, maxVal, sixtySeven }) {
  const largest = largestValue(maxVal, sixtySeven)
  const digits = String(largest).length
  if (stacked) return { rows: 3, digits, cellsWide: digits + 1 }
  return { rows: 1, digits, cellsWide: digits + 2 * String(largest - 1).length + 2 }
}

/**
 * Everything that follows from the settings: the column counts on offer, the
 * columns actually used (a persisted 4 falls back when it no longer fits), the
 * geometry and how many problems fill one page.
 */
export function sheetShape({ stacked, maxVal, columns, sixtySevenMode }) {
  // Offer only what the widest possible problem prints at 1/4in: inline sums
  // within 1000 are 12 squares, too wide for four to a row.
  const columnOptions = columnOptionsFor(sheetFrame({ stacked, maxVal, sixtySeven: sixtySevenMode }).cellsWide)
  const active = columnOptions.includes(columns) ? columns : columnOptions[columnOptions.length - 1]
  const sixtySeven = sixtySevenApplies(sixtySevenMode, active)
  const frame = sheetFrame({ stacked, maxVal, sixtySeven })
  const count = problemsPerPage({ columns: active, rows: frame.rows, ...SHEET_SPACING })
  return { columnOptions, columns: active, sixtySeven, frame, count, spacing: SHEET_SPACING }
}

export function generateSheet({ ops, maxVal, columns, count, stacked, sixtySeven }, rng = Math.random) {
  const r = asHelpers(rng)
  const items = []
  for (let i = 0; i < count; i++) {
    items.push(
      sixtySeven
        ? generateProblemAvoidingAnswer(SIXTY_SEVEN_ANSWER, ops, maxVal, stacked, r)
        : generateProblem(ops, maxVal, stacked, r)
    )
  }
  if (sixtySeven) {
    const rows = Math.floor(count / columns)
    for (let column = 0; column < columns; column++) {
      const row = r.int(0, rows - 1)
      items[row * columns + column] = generateProblemWithAnswer(SIXTY_SEVEN_ANSWER, ops, maxVal, stacked, r)
    }
  }
  return items
}
