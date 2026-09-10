import { describe, it, expect } from 'vitest'
import {
  BLANK_RESULT, SHEET_SPACING, SIXTY_SEVEN_ANSWER,
  columnOptionsFor, generateSheet, getBlankAnswer, sheetFrame, sixtySevenApplies,
} from './addSubtract'
import { problemsPerPage, fitsPrint } from '../hooks/useNotebookGrid'

const LIMITS = [10, 20, 100, 1000]
const OPS = ['add', 'sub', 'both']

function sheets(stacked, fn) {
  for (const maxVal of LIMITS) {
    for (const ops of OPS) {
      for (const sixtySevenMode of [false, true]) {
        const options = columnOptionsFor(sheetFrame({ stacked, maxVal, sixtySeven: sixtySevenMode }).cellsWide)
        for (const columns of options) {
          const sixtySeven = sixtySevenApplies(sixtySevenMode, columns)
          const frame = sheetFrame({ stacked, maxVal, sixtySeven })
          const count = problemsPerPage({ columns, rows: frame.rows, ...SHEET_SPACING })
          for (let run = 0; run < 20; run++) {
            fn({ problems: generateSheet({ ops, maxVal, columns, count, stacked, sixtySeven }), frame, columns, count, sixtySeven, maxVal })
          }
        }
      }
    }
  }
}

describe('stacked add & subtract', () => {
  it('only ever leaves the result to fill in', () => {
    sheets(true, ({ problems }) => {
      for (const p of problems) expect(p.blankPos).toBe(BLANK_RESULT)
    })
  })

  it('fits every number in its digit columns', () => {
    sheets(true, ({ problems, frame }) => {
      for (const p of problems) {
        for (const n of [p.a, p.b, p.result]) expect(String(n).length).toBeLessThanOrEqual(frame.digits)
      }
    })
  })

  // Regression: the sheet hardcoded 18 problems in six rows of 102px items, but
  // only five rows fit a landscape page, so the sixth printed on a second sheet.
  it('fills exactly one printed page', () => {
    const frame = sheetFrame({ stacked: true, maxVal: 100, sixtySeven: true })
    expect(problemsPerPage({ columns: 3, rows: frame.rows, ...SHEET_SPACING })).toBe(18)
    expect(columnOptionsFor(frame.cellsWide)).toEqual([2, 3, 4])
  })
})

describe('inline add & subtract', () => {
  it('still hides the left operand, the right operand and the result', () => {
    const seen = new Set()
    sheets(false, ({ problems }) => problems.forEach(p => seen.add(p.blankPos)))
    expect([...seen].sort()).toEqual([0, 1, 2])
  })

  it('fits every problem in the squares budgeted for it', () => {
    sheets(false, ({ problems, frame }) => {
      for (const p of problems) {
        const squares = String(p.a).length + String(p.b).length + String(p.result).length + 2
        expect(squares).toBeLessThanOrEqual(frame.cellsWide)
      }
    })
  })

  it('offers only the column counts that print at 1/4in', () => {
    expect(sheetFrame({ stacked: false, maxVal: 100, sixtySeven: false }).cellsWide).toBe(9)
    expect(columnOptionsFor(sheetFrame({ stacked: false, maxVal: 100, sixtySeven: true }).cellsWide)).toEqual([2, 3, 4])
    expect(columnOptionsFor(sheetFrame({ stacked: false, maxVal: 1000, sixtySeven: true }).cellsWide)).toEqual([2, 3])
    for (const maxVal of LIMITS) {
      for (const stacked of [false, true]) {
        const { cellsWide } = sheetFrame({ stacked, maxVal, sixtySeven: true })
        for (const columns of columnOptionsFor(cellsWide)) expect(fitsPrint(columns, cellsWide)).toBe(true)
      }
    }
  })
})

describe('67 mode', () => {
  it('plants exactly one 67 in every column of a 2- or 3-column sheet', () => {
    for (const stacked of [false, true]) {
      sheets(stacked, ({ problems, columns, sixtySeven }) => {
        if (!sixtySeven) return
        for (let column = 0; column < columns; column++) {
          const hits = problems.filter((p, i) => i % columns === column && getBlankAnswer(p) === SIXTY_SEVEN_ANSWER)
          expect(hits).toHaveLength(1)
        }
      })
    }
  })
})
