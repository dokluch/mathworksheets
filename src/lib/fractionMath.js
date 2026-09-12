/**
 * Exact fraction arithmetic for the fraction sheets. A fraction is `{ n, d }`
 * with a positive denominator; a mixed number is `{ w, n, d }` with a proper
 * fractional part. Everything is integers — no floats, so no 0.1 + 0.2.
 *
 * Pure functions with no rng, shared by src/lib/fractions.js and
 * src/lib/fracAddSub.js.
 */

export function gcd(a, b) {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y) [x, y] = [y, x % y]
  return x
}

export function lcm(a, b) {
  return (Math.abs(a) / gcd(a, b)) * Math.abs(b)
}

/** Lowest terms. 0/d reduces to 0/1. */
export function reduce({ n, d }) {
  if (n === 0) return { n: 0, d: 1 }
  const g = gcd(n, d)
  return { n: n / g, d: d / g }
}

export function isReduced({ n, d }) {
  return gcd(n, d) === 1
}

/** -1, 0 or 1, by cross-multiplication. */
export function compareFractions(a, b) {
  const left = a.n * b.d
  const right = b.n * a.d
  return left < right ? -1 : left > right ? 1 : 0
}

/** Sum over the least common denominator, reduced. */
export function addFractions(a, b) {
  const d = lcm(a.d, b.d)
  return reduce({ n: a.n * (d / a.d) + b.n * (d / b.d), d })
}

/** Difference over the least common denominator, reduced. May be negative. */
export function subFractions(a, b) {
  const d = lcm(a.d, b.d)
  return reduce({ n: a.n * (d / a.d) - b.n * (d / b.d), d })
}

/** An improper fraction as a mixed number: 7/2 → 3 1/2. A proper one has w = 0. */
export function toMixed({ n, d }) {
  return { w: Math.floor(n / d), n: n % d, d }
}

/** A mixed number as an improper fraction: 3 1/2 → 7/2. */
export function fromMixed({ w = 0, n, d }) {
  return { n: w * d + n, d }
}

/** Squares a fraction's block takes on the grid: the longer of its two numbers. */
export function fractionSquares({ n, d }) {
  return Math.max(String(n).length, String(d).length)
}

/** Squares a mixed number takes: its whole part, if any, beside the fraction. */
export function mixedSquares({ w = 0, n, d }) {
  return (w > 0 ? String(w).length : 0) + fractionSquares({ n, d })
}
