import { describe, it, expect } from 'vitest'
import { mulberry32 } from './rng.js'
import {
  DIVIDES_SHARE, LCM_MAX, MAX_FACTORS, MIN_NUMBER, PAIR_MAX, PRACTICES, PRIME_SHARE, RANGES, SHEET_SPACING, TRICKY_SHARE,
  columnOptionsFor, factorPool, factorizeSquares, generateSheet, isPrime, looksPrime, pairPool, plainPool, primeFactors,
  primePool, problemSquares, sheetFrame, sheetShape, trickyPool,
} from './factors'
import { gcd, lcm } from './fractionMath'
import { PRINT_SQUARE, PRINT_WIDTH, notebookLayout, rowsPerPage } from '../hooks/useNotebookGrid'

const product = list => list.reduce((a, b) => a * b, 1)
const pairKey = p => `${Math.min(p.a, p.b)}|${Math.max(p.a, p.b)}`

/** Every practice × range × offered column count, a sheet of the size the page holds, `runs` times. */
function sheets(fn, runs = 20) {
  for (const practice of PRACTICES) {
    for (const range of RANGES) {
      const { columnOptions } = sheetShape({ practice, range, columns: 3 })
      for (const columns of columnOptions) {
        const { count, frame } = sheetShape({ practice, range, columns })
        for (let run = 0; run < runs; run++) {
          fn({ problems: generateSheet({ practice, range, count }), practice, range, columns, count, frame })
        }
      }
    }
  }
}

describe('number helpers', () => {
  it('factorizes into primes, smallest first', () => {
    expect(primeFactors(84)).toEqual([2, 2, 3, 7])
    expect(primeFactors(48)).toEqual([2, 2, 2, 2, 3])
    expect(primeFactors(97)).toEqual([97])
    expect(primeFactors(496)).toEqual([2, 2, 2, 2, 31])
    for (let n = 2; n <= 600; n++) {
      const factors = primeFactors(n)
      expect(product(factors)).toBe(n)
      expect(factors.every(isPrime)).toBe(true)
      expect(factors).toEqual([...factors].sort((a, b) => a - b))
    }
  })

  it('agrees with a sieve on which numbers are prime', () => {
    const sieve = Array(601).fill(true)
    sieve[0] = sieve[1] = false
    for (let p = 2; p * p <= 600; p++) for (let m = p * p; m <= 600; m += p) sieve[m] = false
    for (let n = 0; n <= 600; n++) expect(isPrime(n), String(n)).toBe(sieve[n])
  })

  it('calls the odd composites that do not end in 5 the ones that look prime', () => {
    expect([51, 57, 91, 119].every(looksPrime)).toBe(true)
    expect([45, 50, 64].some(looksPrime)).toBe(false)
  })
})

describe('pools', () => {
  it('draws from every number in range, from 10 up', () => {
    expect(RANGES.map(range => factorPool(range).length)).toEqual([67, 376])
    expect(RANGES.map(range => primePool(range).length)).toEqual([21, 91])
    expect(RANGES.map(range => trickyPool(range).length)).toEqual([15, 105])
    expect(RANGES.map(range => plainPool(range).length)).toEqual([54, 294])
    for (const range of RANGES) {
      for (const n of factorPool(range)) {
        expect(n).toBeGreaterThanOrEqual(MIN_NUMBER)
        expect(isPrime(n)).toBe(false)
        expect(primeFactors(n).length).toBeLessThanOrEqual(MAX_FACTORS)
      }
      expect(trickyPool(range).every(n => !isPrime(n) && looksPrime(n))).toBe(true)
      expect(plainPool(range).every(n => !isPrime(n) && !looksPrime(n))).toBe(true)
    }
  })

  it('builds every GCD and LCM pair from a common factor and two coprime cofactors', () => {
    const { divides, coprime } = pairPool()
    expect([divides.length, coprime.length]).toEqual([87, 204])
    for (const pair of [...divides, ...coprime]) {
      expect(gcd(pair.a, pair.b)).toBe(pair.gcd)
      expect(lcm(pair.a, pair.b)).toBe(pair.lcm)
      expect(pair.gcd).toBeGreaterThanOrEqual(2)
      expect(Math.max(pair.a, pair.b)).toBeLessThanOrEqual(PAIR_MAX)
      expect(pair.lcm).toBeLessThanOrEqual(LCM_MAX)
    }
    expect(divides.every(p => Math.max(p.a, p.b) % Math.min(p.a, p.b) === 0)).toBe(true)
    expect(coprime.some(p => Math.max(p.a, p.b) % Math.min(p.a, p.b) === 0)).toBe(false)
  })
})

describe('factors sheets', () => {
  it('factorizes composites in range into at most five primes, smallest first', () => {
    sheets(({ problems, practice, range }) => {
      if (practice !== 'factorize') return
      for (const p of problems) {
        expect(p.n).toBeGreaterThanOrEqual(MIN_NUMBER)
        expect(p.n).toBeLessThanOrEqual(range)
        expect(p.factors).toEqual(primeFactors(p.n))
        expect(p.factors.length).toBeGreaterThanOrEqual(2)
        expect(p.factors.length).toBeLessThanOrEqual(MAX_FACTORS)
      }
      // Both pools are larger than any page, so nothing repeats.
      expect(new Set(problems.map(p => p.n)).size).toBe(problems.length)
    })
  })

  it('works out every GCD and LCM correctly and never repeats a pair on a page', () => {
    sheets(({ problems, practice }) => {
      if (practice !== 'gcdlcm') return
      for (const p of problems) {
        expect(gcd(p.a, p.b)).toBe(p.gcd)
        expect(lcm(p.a, p.b)).toBe(p.lcm)
      }
      expect(new Set(problems.map(pairKey)).size).toBe(problems.length)
    })
  })

  it('makes one number divide the other on about one pair in seven, and puts either first', () => {
    let divides = 0
    let smallerFirst = 0
    let total = 0
    for (let i = 0; i < 300; i++) {
      for (const p of generateSheet({ practice: 'gcdlcm', range: 99, count: 18 })) {
        total++
        if (Math.max(p.a, p.b) % Math.min(p.a, p.b) === 0) divides++
        if (p.a < p.b) smallerFirst++
      }
    }
    expect(divides / total).toBeGreaterThan(DIVIDES_SHARE - 0.05)
    expect(divides / total).toBeLessThan(DIVIDES_SHARE + 0.05)
    expect(smallerFirst / total).toBeGreaterThan(0.4)
    expect(smallerFirst / total).toBeLessThan(0.6)
  })

  it('marks primes correctly, about half the page, with composites leaning to the ones that look prime', () => {
    let primes = 0
    let composites = 0
    let tricky = 0
    let total = 0
    for (let i = 0; i < 300; i++) {
      for (const p of generateSheet({ practice: 'primes', range: 499, count: 39 })) {
        expect(p.prime).toBe(isPrime(p.n))
        total++
        if (p.prime) primes++
        else {
          composites++
          if (looksPrime(p.n)) tricky++
        }
      }
    }
    expect(primes / total).toBeGreaterThan(PRIME_SHARE - 0.06)
    expect(primes / total).toBeLessThan(PRIME_SHARE + 0.06)
    expect(tricky / composites).toBeGreaterThan(TRICKY_SHARE - 0.08)
    expect(tricky / composites).toBeLessThan(TRICKY_SHARE + 0.08)
  })

  it('repeats a number on a primes page only once its deck is spent', () => {
    sheets(({ problems, practice, range }) => {
      if (practice !== 'primes') return
      const tally = new Map()
      for (const p of problems) tally.set(p.n, (tally.get(p.n) ?? 0) + 1)
      // Within 500 every deck outlasts a page; within 100 a page of 52 can go round the 21 primes twice.
      expect(Math.max(...tally.values())).toBeLessThanOrEqual(range === 499 ? 1 : 3)
    })
  })
})

describe('factors sheet geometry', () => {
  it('budgets a factorization as wide as the widest in its pool, digit by digit', () => {
    expect(factorizeSquares(84)).toBe(10)
    expect(factorizeSquares(80)).toBe(12)
    expect(factorizeSquares(496)).toBe(14)
    for (const range of RANGES) {
      expect(sheetFrame({ practice: 'factorize', range }).cellsWide).toBe(Math.max(...factorPool(range).map(factorizeSquares)))
    }
    expect(RANGES.map(range => sheetFrame({ practice: 'factorize', range }))).toEqual([{ rows: 1, cellsWide: 12 }, { rows: 1, cellsWide: 14 }])
    expect(sheetFrame({ practice: 'gcdlcm', range: 99 })).toEqual({ rows: 3, cellsWide: 7 })
    expect(RANGES.map(range => sheetFrame({ practice: 'primes', range }).cellsWide)).toEqual([4, 5])
  })

  it('fits every problem in the squares budgeted for it', () => {
    sheets(({ problems, frame }) => {
      for (const p of problems) expect(problemSquares(p)).toBeLessThanOrEqual(frame.cellsWide)
    })
  })

  it('offers only the column counts that print without shrinking the grid', () => {
    expect(columnOptionsFor(12)).toEqual([2, 3])
    expect(columnOptionsFor(14)).toEqual([2])
    expect(columnOptionsFor(7)).toEqual([2, 3, 4])
    expect(columnOptionsFor(5)).toEqual([2, 3, 4])
    expect(sheetShape({ practice: 'factorize', range: 499, columns: 3 }).columns).toBe(2)
  })

  it('fills exactly one printed page', () => {
    expect(rowsPerPage(1, SHEET_SPACING)).toBe(13)
    expect(rowsPerPage(3, SHEET_SPACING)).toBe(6)
    for (const practice of PRACTICES) {
      for (const range of RANGES) {
        const { columnOptions, frame } = sheetShape({ practice, range, columns: 3 })
        for (const columns of columnOptions) {
          expect(sheetShape({ practice, range, columns }).count).toBe(columns * (frame.rows === 3 ? 6 : 13))
          expect(notebookLayout({
            width: PRINT_WIDTH, columns, cellsWide: frame.cellsWide, square: PRINT_SQUARE, minSquare: PRINT_SQUARE,
          }).overflow).toBe(false)
        }
      }
    }
  })
})

describe('seeded generation', () => {
  it('deals the same sheet for the same seed and a different one for another', () => {
    for (const practice of PRACTICES) {
      const args = { practice, range: 99, count: 18 }
      expect(generateSheet(args, mulberry32(123)), practice).toEqual(generateSheet(args, mulberry32(123)))
      expect(generateSheet(args, mulberry32(123)), practice).not.toEqual(generateSheet(args, mulberry32(124)))
    }
  })
})
