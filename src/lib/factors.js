import { fitsPrint, problemsPerPage } from '../hooks/useNotebookGrid'
import { asHelpers } from './rng.js'
import { gcd } from './fractionMath.js'

/**
 * Problem generation and notebook geometry for the Factors, Multiples & Primes
 * sheet. Three practices:
 *  - factorize: write a number as a product of primes, smallest first;
 *  - gcdlcm: find the greatest common divisor and least common multiple of a pair;
 *  - primes: mark each number prime or composite.
 *
 * Numbers start at 10: whether 7 is prime is not grade 4–6 work, but whether
 * 51 or 91 is certainly is.
 */

export const PRACTICES = ['factorize', 'gcdlcm', 'primes']
/** Largest number on a factorize or primes page: within 100, or within 500. */
export const RANGES = [99, 499]
export const MIN_NUMBER = 10
/** Prime factors a factorize problem may have, counted with repeats: 48 = 2·2·2·2·3 stays, 64 = 2⁶ does not. */
export const MAX_FACTORS = 5
/** Squares for the GCD and LCM labels ("GCD", "PGCD", "ggT", "НОД"). */
export const LABEL_SQUARES = 4
/** Squares between the two numbers of a pair: an empty one, the separator, an empty one. */
export const PAIR_GAP = 3
/** A pair is g·a and g·b with a and b coprime: g is the GCD, g·a·b the LCM. */
export const GCD_MAX = 12
export const COFACTOR_MAX = 9
export const PAIR_MAX = 99
export const LCM_MAX = 999
/** Share of pairs where one number divides the other, so the GCD is the smaller and the LCM the larger. */
export const DIVIDES_SHARE = 0.15
/** Share of a primes page that is prime, and share of its composites that are odd and not multiples of 5. */
export const PRIME_SHARE = 0.5
export const TRICKY_SHARE = 0.6
export const COLUMN_OPTIONS = [2, 3, 4]
/** Problems sit one empty square apart, as on the one-line sheets. */
export const SHEET_SPACING = { rowGap: 0, headerGap: 0 }
const DEDUPE_TRIES = 12

/** Prime factors, smallest first, repeated as often as they divide. */
export function primeFactors(n) {
  const out = []
  let rest = n
  for (let p = 2; p * p <= rest; p++) {
    while (rest % p === 0) {
      out.push(p)
      rest /= p
    }
  }
  if (rest > 1) out.push(rest)
  return out
}

export function isPrime(n) {
  if (n < 2) return false
  for (let p = 2; p * p <= n; p++) if (n % p === 0) return false
  return true
}

/** Odd and not ending in 5: the composites that look prime to a child checking 2 and 5 first. */
export const looksPrime = n => n % 2 === 1 && n % 5 !== 0

const memo = new Map()
function memoised(key, build) {
  if (!memo.has(key)) memo.set(key, build())
  return memo.get(key)
}

const numbers = max => Array.from({ length: max - MIN_NUMBER + 1 }, (_, i) => MIN_NUMBER + i)

/** Composites in range with at most MAX_FACTORS prime factors. */
export const factorPool = max => memoised(`factor${max}`, () => numbers(max).filter(n => !isPrime(n) && primeFactors(n).length <= MAX_FACTORS))
export const primePool = max => memoised(`prime${max}`, () => numbers(max).filter(isPrime))
export const trickyPool = max => memoised(`tricky${max}`, () => numbers(max).filter(n => !isPrime(n) && looksPrime(n)))
export const plainPool = max => memoised(`plain${max}`, () => numbers(max).filter(n => !isPrime(n) && !looksPrime(n)))

/** Every GCD/LCM pair the sheet can deal, split by whether one number divides the other. */
export const pairPool = () => memoised('pairs', () => {
  const divides = []
  const coprime = []
  for (let g = 2; g <= GCD_MAX; g++) {
    for (let b = 2; b <= COFACTOR_MAX; b++) {
      for (let a = 1; a < b; a++) {
        if (gcd(a, b) !== 1 || g * b > PAIR_MAX || g * a * b > LCM_MAX) continue
        const pair = { a: g * a, b: g * b, gcd: g, lcm: g * a * b }
        ;(a === 1 ? divides : coprime).push(pair)
      }
    }
  }
  return { divides, coprime }
})

/** Deals without replacement and reshuffles only once the deck is spent. */
function dealer(pool, r) {
  let deck = []
  return () => {
    if (!deck.length) deck = r.shuffle(pool)
    return deck.pop()
  }
}

const key = p => (p.kind === 'gcdlcm' ? `${Math.min(p.a, p.b)}|${Math.max(p.a, p.b)}` : String(p.n))

export function generateSheet({ practice, range, count }, rng = Math.random) {
  const r = asHelpers(rng)
  let next
  if (practice === 'factorize') {
    const deal = dealer(factorPool(range), r)
    next = () => {
      const n = deal()
      return { kind: 'factorize', n, factors: primeFactors(n) }
    }
  } else if (practice === 'gcdlcm') {
    const { divides, coprime } = pairPool()
    const dealDivides = dealer(divides, r)
    const dealCoprime = dealer(coprime, r)
    next = () => {
      const pair = r.chance(DIVIDES_SHARE) ? dealDivides() : dealCoprime()
      // Either number may come first: the smaller is not always on the left.
      const [a, b] = r.chance(0.5) ? [pair.a, pair.b] : [pair.b, pair.a]
      return { kind: 'gcdlcm', a, b, gcd: pair.gcd, lcm: pair.lcm }
    }
  } else {
    const dealPrime = dealer(primePool(range), r)
    const dealTricky = dealer(trickyPool(range), r)
    const dealPlain = dealer(plainPool(range), r)
    next = () => {
      const n = r.chance(PRIME_SHARE) ? dealPrime() : r.chance(TRICKY_SHARE) ? dealTricky() : dealPlain()
      return { kind: 'primes', n, prime: isPrime(n) }
    }
  }

  const seen = new Set()
  return Array.from({ length: count }, () => {
    let item = next()
    for (let tries = 0; tries < DEDUPE_TRIES && seen.has(key(item)); tries++) item = next()
    seen.add(key(item))
    return item
  })
}

const digits = n => String(n).length

/** Squares a factorization takes: the number, =, one box per digit of each factor, and a sign between factors. */
export function factorizeSquares(n) {
  const factors = primeFactors(n)
  return digits(n) + 1 + factors.reduce((sum, f) => sum + digits(f), 0) + (factors.length - 1)
}

/** Squares an item takes on its widest row. */
export function problemSquares(p) {
  if (p.kind === 'factorize') return factorizeSquares(p.n)
  if (p.kind === 'gcdlcm') return Math.max(digits(p.a) + PAIR_GAP + digits(p.b), LABEL_SQUARES + digits(p.gcd), LABEL_SQUARES + digits(p.lcm))
  return digits(p.n) + 2
}

/**
 * Squares a problem is budgeted. A factorization is as wide as the widest in its
 * pool: a factor gets a box per digit, so 496 = 2 × 2 × 2 × 2 × 31 is wider
 * than any count of factors suggests. A pair is its two numbers either side of a
 * spaced separator, over a labelled GCD and LCM; a primes item is the number, a
 * gap and one box.
 */
export function sheetFrame({ practice, range }) {
  if (practice === 'factorize') {
    return { rows: 1, cellsWide: memoised(`width${range}`, () => Math.max(...factorPool(range).map(factorizeSquares))) }
  }
  if (practice === 'gcdlcm') {
    return { rows: 3, cellsWide: Math.max(digits(PAIR_MAX) + PAIR_GAP + digits(PAIR_MAX), LABEL_SQUARES + digits(LCM_MAX)) }
  }
  return { rows: 1, cellsWide: digits(range) + 2 }
}

/** Column counts that print at 1/4in squares without shrinking the grid. */
export function columnOptionsFor(cellsWide) {
  return COLUMN_OPTIONS.filter(columns => fitsPrint(columns, cellsWide))
}

/** Everything that follows from the settings, as in src/lib/division.js. */
export function sheetShape({ practice, range, columns }) {
  const frame = sheetFrame({ practice, range })
  const columnOptions = columnOptionsFor(frame.cellsWide)
  const active = columnOptions.includes(columns) ? columns : columnOptions[columnOptions.length - 1]
  const count = problemsPerPage({ columns: active, rows: frame.rows, ...SHEET_SPACING })
  return { columnOptions, columns: active, frame, count }
}
