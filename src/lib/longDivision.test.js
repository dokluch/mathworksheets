import { describe, it, expect } from 'vitest'
import { mulberry32 } from './rng.js'
import {
  rowsPerPage, notebookLayout, HEADER_BAND, PRINT_HEIGHT, PRINT_SQUARE, PRINT_WIDTH,
} from '../hooks/useNotebookGrid.js'

/** ColumnDivision.jsx packs the rows: the spare square per item is the separator. */
const SPACING = { rowGap: 0, headerGap: 0 }
import { frameLayout, generateProblem, generateProblems, MAX_QUOTIENT_DIGITS } from './longDivision.js'

const PRESETS = [
  { dividendDigits: 3, divisorDigits: 1 },
  { dividendDigits: 4, divisorDigits: 1 },
  { dividendDigits: 4, divisorDigits: 2 },
  { dividendDigits: 5, divisorDigits: 2 },
]

describe('generateProblem', () => {
  for (const { dividendDigits, divisorDigits } of PRESETS) {
    for (const allowRemainder of [false, true]) {
      it(`${dividendDigits} / ${divisorDigits} digits${allowRemainder ? ' with a remainder' : ''} is well formed`, () => {
        for (let i = 0; i < 400; i++) {
          const { dividend, divisor, quotient, remainder } = generateProblem(dividendDigits, divisorDigits, allowRemainder)

          expect(String(dividend)).toHaveLength(dividendDigits)
          expect(String(divisor)).toHaveLength(divisorDigits)
          expect(divisor).toBeGreaterThanOrEqual(2)
          expect(quotient * divisor + remainder).toBe(dividend)

          if (allowRemainder) {
            expect(remainder).toBeGreaterThan(0)
            expect(remainder).toBeLessThan(divisor)
          } else {
            expect(remainder).toBe(0)
          }

          // A one-digit quotient would leave the frame mostly empty and the
          // division over in a single step; a longer one would not fit the
          // boxes the frame reserves.
          expect(String(quotient).length).toBeGreaterThanOrEqual(2)
          expect(String(quotient).length).toBeLessThanOrEqual(
            Math.min(dividendDigits - divisorDigits + 1, MAX_QUOTIENT_DIGITS),
          )
        }
      })
    }
  }

  it('uses the whole divisor range rather than favouring small divisors', () => {
    const seen = new Set()
    for (let i = 0; i < 500; i++) seen.add(generateProblem(3, 1, false).divisor)
    expect([...seen].sort((a, b) => a - b)).toEqual([2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('skips the divisors whose quotient would not fit the frame', () => {
    // A 5-digit dividend over 10 asks for a 4-digit quotient, and the frame
    // draws three boxes. Dividing by 10 is not long division anyway.
    for (const allowRemainder of [false, true]) {
      const seen = new Set()
      for (let i = 0; i < 3000; i++) seen.add(generateProblem(5, 2, allowRemainder).divisor)
      expect(Math.min(...seen)).toBe(11)
      expect(Math.max(...seen)).toBe(99)
    }

    // The bound is derived, so the presets that came before it are untouched.
    for (const [dividendDigits, divisorDigits, lowest] of [[3, 1, 2], [4, 1, 2], [4, 2, 10]]) {
      const seen = new Set()
      for (let i = 0; i < 2000; i++) seen.add(generateProblem(dividendDigits, divisorDigits, false).divisor)
      expect(Math.min(...seen), `${dividendDigits}/${divisorDigits}`).toBe(lowest)
    }
  })
})

describe('frameLayout', () => {
  // Verified against useNotebookGrid: letter landscape at 1/4in is 41 squares
  // across and 31 down.
  const EXPECTED = [
    ['bracket', 3, 1, 5, 8],
    ['bracket', 4, 1, 6, 8],
    ['bracket', 4, 2, 7, 8],
    ['bracket', 5, 2, 8, 8],
    ['corner', 3, 1, 7, 7],
    ['corner', 4, 1, 8, 7],
    ['corner', 4, 2, 8, 7],
    ['corner', 5, 2, 9, 7],
  ]

  for (const [notation, dividendDigits, divisorDigits, cols, rows] of EXPECTED) {
    it(`sizes the ${notation} frame for ${dividendDigits} / ${divisorDigits} digits`, () => {
      const frame = frameLayout(notation, dividendDigits, divisorDigits)
      expect(frame.cols).toBe(cols)
      expect(frame.rows).toBe(rows)
      expect(frame.maxQuotient).toBe(Math.min(dividendDigits - divisorDigits + 1, MAX_QUOTIENT_DIGITS))
    })
  }

  for (const [notation, dividendDigits, divisorDigits] of EXPECTED) {
    it(`keeps every ${notation} block and rule inside the ${dividendDigits} / ${divisorDigits} frame`, () => {
      const frame = frameLayout(notation, dividendDigits, divisorDigits)

      for (const block of [frame.dividend, frame.divisor, frame.quotient]) {
        expect(block.col).toBeGreaterThanOrEqual(0)
        expect(block.col + (block.width ?? 1)).toBeLessThanOrEqual(frame.cols)
        expect(block.row).toBeGreaterThanOrEqual(0)
        expect(block.row).toBeLessThan(frame.rows)
      }

      // Both the divisor and the widest possible quotient must fit their block.
      expect(frame.quotient.width ?? frame.maxQuotient).toBeGreaterThanOrEqual(frame.maxQuotient)
      expect(frame.divisor.width ?? divisorDigits).toBeGreaterThanOrEqual(divisorDigits)

      expect(frame.vRule.x).toBeGreaterThan(0)
      expect(frame.vRule.x).toBeLessThan(frame.cols)
      expect(frame.vRule.y1).toBeGreaterThan(frame.vRule.y0)
      expect(frame.vRule.y1).toBeLessThanOrEqual(frame.rows)
      expect(frame.hRule.x1).toBeLessThanOrEqual(frame.cols)
      expect(frame.hRule.x1).toBeGreaterThan(frame.hRule.x0)
      expect(frame.hRule.y).toBeLessThanOrEqual(frame.rows)
    })
  }

  it('separates the dividend from the divisor with the rule column, both ways round', () => {
    const bracket = frameLayout('bracket', 4, 2)
    expect(bracket.divisor.col + bracket.divisor.width).toBeLessThanOrEqual(bracket.vRule.x - 1)
    expect(bracket.dividend.col).toBe(bracket.vRule.x)

    const corner = frameLayout('corner', 4, 2)
    expect(corner.dividend.col + 4).toBe(corner.vRule.x)
    // The divisor sits directly against the rule, with no empty column.
    expect(corner.divisor.col).toBe(corner.vRule.x)
    // A full square of gutter on the left for the minus signs.
    expect(corner.dividend.col).toBe(1)
  })
})

describe('generateProblems', () => {
  it('fills a sheet and keeps some exact divisions in the mix when remainders are allowed', () => {
    expect(generateProblems(6, 3, 1, false)).toHaveLength(6)
    expect(generateProblems(200, 3, 1, false).every(p => p.remainder === 0)).toBe(true)

    const mixed = generateProblems(400, 3, 1, true)
    expect(mixed.some(p => p.remainder === 0)).toBe(true)
    expect(mixed.some(p => p.remainder > 0)).toBe(true)
  })
})

describe('one printed page', () => {
  // The budget is the shorter of the two supported papers. Landscape A4 is
  // 8.27in tall against Letter's 8.5in, which is one square less of working
  // room: the taller `bracket` frame needs 30 squares for three rows and A4
  // offers 29, so it takes two. Rounding that up is what used to put a sliced
  // third row on a second sheet for every A4 printer in Europe.
  const EXPECTED_ROWS = { bracket: 2, corner: 3 }

  it('fits its rows on the shorter of the two supported papers', () => {
    for (const notation of ['bracket', 'corner']) {
      for (const [dividendDigits, divisorDigits] of [[3, 1], [4, 1], [4, 2], [5, 2]]) {
        const frame = frameLayout(notation, dividendDigits, divisorDigits)
        const label = `${notation} ${dividendDigits}/${divisorDigits}`
        const rows = rowsPerPage(frame.rows, SPACING)
        expect(rows, label).toBe(EXPECTED_ROWS[notation])
        // Those rows plus the header band must still clear the printed page.
        const squares = HEADER_BAND + rows * (frame.rows + 1)
        expect(squares, label).toBeLessThanOrEqual(Math.floor(PRINT_HEIGHT / PRINT_SQUARE))
        // And one more row must not fit, or the budget is leaving a row unused.
        expect(HEADER_BAND + (rows + 1) * (frame.rows + 1), label)
          .toBeGreaterThan(Math.floor(PRINT_HEIGHT / PRINT_SQUARE))
        // Widest frame four to a row must not overflow the printed page.
        expect(notebookLayout({
          width: PRINT_WIDTH, columns: 4, cellsWide: frame.cols,
          square: PRINT_SQUARE, minSquare: PRINT_SQUARE,
        }).overflow, label).toBe(false)
      }
    }
  })
})

describe('seeded generation', () => {
  it('deals the same problems for the same seed and different ones for another', () => {
    expect(generateProblems(12, 4, 2, true, mulberry32(123))).toEqual(generateProblems(12, 4, 2, true, mulberry32(123)))
    expect(generateProblems(12, 4, 2, true, mulberry32(123))).not.toEqual(generateProblems(12, 4, 2, true, mulberry32(124)))
  })
})
