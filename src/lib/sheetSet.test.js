import { describe, it, expect } from 'vitest'
import { MAX_COPIES, MAX_SET, clampCopies, parseSet, randomSet, setSequence, sheetRng } from './sheetSet.js'

describe('parseSet', () => {
  it('accepts whole numbers from 1 to 99999, with surrounding space', () => {
    expect(parseSet('123')).toBe(123)
    expect(parseSet(' 12 ')).toBe(12)
    expect(parseSet(451)).toBe(451)
    expect(parseSet('1')).toBe(1)
    expect(parseSet(String(MAX_SET))).toBe(MAX_SET)
  })

  it('rejects anything that is not a set number', () => {
    for (const bad of ['0', '-3', 'abc', '', null, undefined, '12.5', '1e3', String(MAX_SET + 1)]) {
      expect(parseSet(bad), String(bad)).toBeNull()
    }
  })
})

describe('randomSet', () => {
  it('draws three-digit numbers from the given source', () => {
    for (let i = 0; i < 1000; i++) {
      const n = randomSet()
      expect(Number.isInteger(n) && n >= 100 && n <= 999, String(n)).toBe(true)
    }
    expect(randomSet(() => 0)).toBe(100)
    expect(randomSet(() => 0.999999)).toBe(999)
  })
})

describe('clampCopies', () => {
  it('keeps the count between 1 and the maximum', () => {
    expect(clampCopies('3')).toBe(3)
    expect(clampCopies(0)).toBe(1)
    expect(clampCopies('')).toBe(1)
    expect(clampCopies('abc')).toBe(1)
    expect(clampCopies(25)).toBe(MAX_COPIES)
  })
})

describe('setSequence / sheetRng', () => {
  it('deals the given set first, then distinct three-digit sets that follow from it', () => {
    const sets = setSequence(200, 5)
    expect(sets[0]).toBe(200)
    expect(new Set(sets).size).toBe(5)
    for (const s of sets.slice(1)) expect(s >= 100 && s <= 999, String(s)).toBe(true)
    expect(sets.slice(1)).not.toEqual([201, 202, 203, 204])
    expect(setSequence(200, 5)).toEqual(sets) // derived, so stable
    expect(setSequence(201, 5).slice(1)).not.toEqual(sets.slice(1))
    expect(setSequence(5, 1)).toEqual([5])
    expect(setSequence(MAX_SET, 2)[0]).toBe(MAX_SET)
    expect(new Set(setSequence(450, 20)).size).toBe(20)
  })

  it('seeds a reproducible source per set', () => {
    expect(Array.from({ length: 5 }, sheetRng(42))).toEqual(Array.from({ length: 5 }, sheetRng(42)))
    expect(Array.from({ length: 5 }, sheetRng(42))).not.toEqual(Array.from({ length: 5 }, sheetRng(43)))
  })
})
