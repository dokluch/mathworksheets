import { describe, it, expect } from 'vitest'
import { asHelpers, mulberry32, rngHelpers } from './rng.js'

describe('mulberry32', () => {
  it('deals the same sequence for the same seed and stays in [0, 1)', () => {
    const a = mulberry32(7), b = mulberry32(7), c = mulberry32(8)
    const seqA = Array.from({ length: 50 }, a)
    const seqB = Array.from({ length: 50 }, b)
    const seqC = Array.from({ length: 50 }, c)
    expect(seqA).toEqual(seqB)
    expect(seqA).not.toEqual(seqC)
    for (const x of seqA) expect(x >= 0 && x < 1).toBe(true)
  })

  it('treats seed 0 as a valid seed', () => {
    expect(typeof mulberry32(0)()).toBe('number')
  })
})

describe('rngHelpers / asHelpers', () => {
  it('int, pick and shuffle draw only from the given source', () => {
    const r = rngHelpers(mulberry32(3))
    const ints = Array.from({ length: 200 }, () => r.int(2, 5))
    expect(Math.min(...ints)).toBe(2)
    expect(Math.max(...ints)).toBe(5)
    const items = [1, 2, 3, 4, 5, 6]
    const shuffled = r.shuffle(items)
    expect(shuffled.slice().sort()).toEqual(items)
    expect(items).toEqual([1, 2, 3, 4, 5, 6]) // not in place
    expect(items).toContain(r.pick(items))
  })

  it('accepts a source, a helpers object, or nothing', () => {
    const fn = mulberry32(1)
    expect(asHelpers(fn).rng).toBe(fn)
    const helpers = rngHelpers(fn)
    expect(asHelpers(helpers)).toBe(helpers)
    expect(asHelpers().rng).toBe(Math.random)
    expect(asHelpers(undefined).rng).toBe(Math.random)
  })
})
