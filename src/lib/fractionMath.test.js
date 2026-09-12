import { describe, it, expect } from 'vitest'
import {
  addFractions, compareFractions, fractionSquares, fromMixed, gcd, isReduced, lcm,
  mixedSquares, reduce, subFractions, toMixed,
} from './fractionMath'

describe('gcd and lcm', () => {
  it('matches worked cases', () => {
    expect(gcd(12, 18)).toBe(6)
    expect(gcd(7, 13)).toBe(1)
    expect(gcd(0, 5)).toBe(5)
    expect(lcm(4, 6)).toBe(12)
    expect(lcm(3, 5)).toBe(15)
  })

  it('satisfies gcd · lcm = a · b for every pair up to 30', () => {
    for (let a = 1; a <= 30; a++) {
      for (let b = 1; b <= 30; b++) {
        expect(gcd(a, b) * lcm(a, b)).toBe(a * b)
        expect(a % gcd(a, b)).toBe(0)
        expect(lcm(a, b) % a).toBe(0)
      }
    }
  })
})

describe('reduce', () => {
  it('matches worked cases', () => {
    expect(reduce({ n: 6, d: 8 })).toEqual({ n: 3, d: 4 })
    expect(reduce({ n: 5, d: 10 })).toEqual({ n: 1, d: 2 })
    expect(reduce({ n: 3, d: 7 })).toEqual({ n: 3, d: 7 })
    expect(reduce({ n: 0, d: 9 })).toEqual({ n: 0, d: 1 })
  })

  it('keeps the value and leaves nothing to cancel, for every fraction up to 20', () => {
    for (let d = 1; d <= 20; d++) {
      for (let n = 1; n <= 40; n++) {
        const r = reduce({ n, d })
        expect(isReduced(r)).toBe(true)
        expect(compareFractions(r, { n, d })).toBe(0)
      }
    }
  })
})

describe('compareFractions', () => {
  it('orders by value, not by the numbers on show', () => {
    expect(compareFractions({ n: 3, d: 4 }, { n: 5, d: 8 })).toBe(1)
    expect(compareFractions({ n: 1, d: 3 }, { n: 1, d: 2 })).toBe(-1)
    expect(compareFractions({ n: 2, d: 4 }, { n: 3, d: 6 })).toBe(0)
  })
})

describe('addFractions and subFractions', () => {
  it('work over the least common denominator and reduce the result', () => {
    expect(addFractions({ n: 3, d: 8 }, { n: 2, d: 8 })).toEqual({ n: 5, d: 8 })
    expect(addFractions({ n: 1, d: 4 }, { n: 1, d: 4 })).toEqual({ n: 1, d: 2 })
    expect(addFractions({ n: 2, d: 3 }, { n: 5, d: 6 })).toEqual({ n: 3, d: 2 })
    expect(subFractions({ n: 2, d: 3 }, { n: 1, d: 4 })).toEqual({ n: 5, d: 12 })
    expect(subFractions({ n: 1, d: 2 }, { n: 1, d: 2 })).toEqual({ n: 0, d: 1 })
  })

  it('agree with cross-multiplied arithmetic for every pair up to 12', () => {
    for (let b = 1; b <= 12; b++) {
      for (let d = 1; d <= 12; d++) {
        for (let a = 1; a < b; a++) {
          for (let c = 1; c < d; c++) {
            const sum = addFractions({ n: a, d: b }, { n: c, d })
            expect(sum.n * b * d).toBe((a * d + c * b) * sum.d)
            const diff = subFractions({ n: a, d: b }, { n: c, d })
            expect(diff.n * b * d).toBe((a * d - c * b) * diff.d)
          }
        }
      }
    }
  })
})

describe('mixed numbers', () => {
  it('convert both ways', () => {
    expect(toMixed({ n: 7, d: 2 })).toEqual({ w: 3, n: 1, d: 2 })
    expect(toMixed({ n: 3, d: 4 })).toEqual({ w: 0, n: 3, d: 4 })
    expect(toMixed({ n: 8, d: 4 })).toEqual({ w: 2, n: 0, d: 4 })
    expect(fromMixed({ w: 2, n: 3, d: 4 })).toEqual({ n: 11, d: 4 })
  })

  it('round-trip for every improper fraction up to 20', () => {
    for (let d = 1; d <= 20; d++) {
      for (let n = 0; n <= 200; n++) {
        const m = toMixed({ n, d })
        expect(m.n).toBeLessThan(d)
        expect(fromMixed(m)).toEqual({ n, d })
      }
    }
  })
})

describe('grid width', () => {
  it('counts the longer number of a fraction, and the whole part beside it', () => {
    expect(fractionSquares({ n: 3, d: 4 })).toBe(1)
    expect(fractionSquares({ n: 3, d: 10 })).toBe(2)
    expect(mixedSquares({ w: 0, n: 5, d: 12 })).toBe(2)
    expect(mixedSquares({ w: 2, n: 3, d: 4 })).toBe(2)
    expect(mixedSquares({ w: 12, n: 5, d: 16 })).toBe(4)
  })
})
