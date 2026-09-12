import { describe, it, expect } from 'vitest'
import { mulberry32 } from './rng.js'
import {
  FAMILIES, MIN_LEN, MAX_LEN, MAX_VALUE, RULE_CAP, BLANK_MODES,
  familiesFor, chooseBlanks, generateSheet,
} from './patterns.js'
import { listRowsPerPage } from '../hooks/useNotebookGrid.js'

const LEVELS = [1, 2, 3]
const ROWS = listRowsPerPage()
const SHEETS = 300

const sheets = (level, fn) => {
  for (let i = 0; i < SHEETS; i++) fn(generateSheet(ROWS, level))
}

describe('generateSheet', () => {
  it('fills the page', () => {
    for (const level of LEVELS) expect(generateSheet(ROWS, level)).toHaveLength(ROWS)
  })

  it('never prints the same sequence twice on a page', () => {
    for (const level of LEVELS) {
      sheets(level, rows => {
        const keys = rows.map(r => r.seq.join(','))
        expect(new Set(keys).size).toBe(ROWS)
      })
    }
  })

  it('keeps every term a whole number inside the level bound', () => {
    for (const level of LEVELS) {
      sheets(level, rows => {
        for (const { seq } of rows) {
          expect(seq.length).toBeGreaterThanOrEqual(MIN_LEN)
          expect(seq.length).toBeLessThanOrEqual(MAX_LEN)
          for (const v of seq) {
            expect(Number.isInteger(v)).toBe(true)
            expect(v).toBeGreaterThanOrEqual(0)
            expect(v).toBeLessThanOrEqual(MAX_VALUE[level])
          }
        }
      })
    }
  })

  it('only draws from the families of its level', () => {
    for (const level of LEVELS) {
      const allowed = new Set(familiesFor(level).map(f => f.id))
      sheets(level, rows => rows.forEach(r => expect(allowed.has(r.family)).toBe(true)))
    }
  })

  it('spreads the families across the page', () => {
    for (const level of LEVELS) {
      const families = familiesFor(level)
      const share = Math.ceil(ROWS / families.length)
      let starved = 0
      sheets(level, rows => {
        const counts = new Map()
        rows.forEach(r => counts.set(r.family, (counts.get(r.family) ?? 0) + 1))
        // The bag hands each family its share; a family that ran dry gives
        // the slot to its neighbour, so allow one extra per family.
        for (const n of counts.values()) expect(n).toBeLessThanOrEqual(share + 1)
        if (counts.size < families.length) starved++
      })
      // A page that misses a family should be rare, never the norm.
      expect(starved).toBeLessThan(SHEETS * 0.1)
    }
  })

  it('does not let one rule dominate a page', () => {
    for (const level of LEVELS) {
      sheets(level, rows => {
        const counts = new Map()
        rows.forEach(r => counts.set(r.rule, (counts.get(r.rule) ?? 0) + 1))
        // RULE_CAP is relaxed only in the closing attempts of a slot, so it
        // may be exceeded by a little, never by a page's worth.
        for (const n of counts.values()) expect(n).toBeLessThanOrEqual(RULE_CAP + 1)
      })
    }
  })

  it('places two or three gaps and leaves enough of the run visible', () => {
    for (const level of LEVELS) {
      sheets(level, rows => {
        for (const { seq, blanks } of rows) {
          expect(blanks.length === 2 || blanks.length === 3).toBe(true)
          expect([...blanks].sort((a, b) => a - b)).toEqual(blanks)
          for (const b of blanks) expect(b >= 0 && b < seq.length).toBe(true)
          expect(seq.length - blanks.length).toBeGreaterThanOrEqual(4)
        }
      })
    }
  })

  it('Easy only ever blanks the end of the run', () => {
    sheets(1, rows => rows.forEach(({ seq, blanks }) => {
      expect(blanks).toContain(seq.length - 1)
      expect(blanks).toContain(seq.length - 2)
      expect(blanks).not.toContain(0)
    }))
  })

  it('Hard uses every gap placement', () => {
    const seen = new Set()
    sheets(3, rows => rows.forEach(({ seq, blanks }) => {
      if (blanks[0] === 0) seen.add('head')
      else if (blanks.includes(seq.length - 1)) seen.add(blanks.length === 3 ? 'tailPlus' : 'tail')
      else seen.add('mid')
    }))
    expect([...seen].sort()).toEqual([...BLANK_MODES].sort())
  })
})

describe('chooseBlanks', () => {
  it('keeps three terms on each side of a middle gap', () => {
    for (let i = 0; i < 200; i++) {
      for (const length of [7, 8]) {
        const [a, b] = chooseBlanks(length, 3, 'mid')
        expect(b).toBe(a + 1)
        expect(a).toBeGreaterThanOrEqual(3)
        expect(b).toBeLessThanOrEqual(length - 3)
      }
    }
  })

  it('drops the inner gap on a short row', () => {
    expect(chooseBlanks(6, 3, 'tailPlus')).toEqual([4, 5])
  })
})

const constantStep = seq => seq.every((v, i) => i === 0 || v - seq[i - 1] === seq[1] - seq[0])

/** The rule each family promises, checked term by term on what it builds. */
const CHECKS = {
  add: seq => constantStep(seq) && seq[1] > seq[0],
  subtract: seq => constantStep(seq) && seq[1] < seq[0],
  addBig: seq => constantStep(seq) && Math.abs(seq[1] - seq[0]) >= 6,
  multiply: seq => seq.every((v, i) => i === 0 || v === seq[i - 1] * (seq[1] / seq[0])),
  divide: seq => seq.every((v, i) => i === 0 || v * (seq[0] / seq[1]) === seq[i - 1]),
  alternate: seq => {
    const [a, b] = [seq[1] - seq[0], seq[2] - seq[1]]
    return a !== b && seq.every((v, i) => i === 0 || v - seq[i - 1] === (i % 2 === 1 ? a : b))
  },
  squares: seq => seq.every((v, i) => i === 0 || v - seq[i - 1] === (seq[1] - seq[0]) + 2 * (i - 1)),
  cubes: seq => seq.every(v => Math.round(Math.cbrt(v)) ** 3 === v),
  growing: seq => {
    const d = seq.slice(1).map((v, i) => v - seq[i])
    const dd = d.slice(1).map((v, i) => v - d[i])
    return dd.every(x => x === dd[0]) && dd[0] !== 0
  },
  fibonacci: seq => seq.every((v, i) => i < 2 || v === seq[i - 1] + seq[i - 2]),
  affine: seq => {
    // v = m·prev + c for one fixed m, c
    const m = (seq[2] - seq[1]) / (seq[1] - seq[0])
    const c = seq[1] - m * seq[0]
    return Number.isInteger(m) && m !== 1 && c !== 0 && seq.every((v, i) => i === 0 || v === m * seq[i - 1] + c)
  },
  interleaved: seq => {
    const odd = seq.filter((_, i) => i % 2 === 0)
    const even = seq.filter((_, i) => i % 2 === 1)
    return constantStep(odd) && constantStep(even)
  },
}

describe('families', () => {
  it('each family builds what its rule says', () => {
    for (const family of FAMILIES) {
      expect(CHECKS[family.id], family.id).toBeDefined()
      for (const level of family.levels) {
        let built = 0
        for (let i = 0; i < 300; i++) {
          const made = family.build(level)
          if (!made) continue
          built++
          expect(CHECKS[family.id](made.seq), `${family.id} ${made.seq.join(',')}`).toBe(true)
          expect(made.seq.length).toBeGreaterThanOrEqual(MIN_LEN)
          expect(Math.max(...made.seq)).toBeLessThanOrEqual(MAX_VALUE[level])
          expect(Math.min(...made.seq)).toBeGreaterThanOrEqual(0)
        }
        // A family may reject a draw, but not most of them.
        expect(built, `${family.id} at level ${level}`).toBeGreaterThan(150)
      }
    }
  })

  it('the classics can appear', () => {
    const want = {
      fibonacci: '1,1,2,3,5,8,13,21',
      squares: '1,4,9,16,25,36,49,64',
      cubes: '1,8,27,64,125,216,343,512',
      multiply: '1,2,4,8,16,32,64,128',
      growing: '1,3,6,10,15,21,28,36',
    }
    for (const [id, key] of Object.entries(want)) {
      const family = FAMILIES.find(f => f.id === id)
      let hit = false
      for (let i = 0; i < 3000 && !hit; i++) hit = family.build(3)?.seq.join(',') === key
      expect(hit, `${id} → ${key}`).toBe(true)
    }
  })

  it('each level offers a different mix', () => {
    expect(familiesFor(1).map(f => f.id)).toEqual(['add', 'subtract'])
    expect(familiesFor(2).length).toBeGreaterThanOrEqual(5)
    expect(familiesFor(3).length).toBeGreaterThanOrEqual(8)
  })
})

describe('seeded generation', () => {
  it('deals the same rows for the same seed and different ones for another', () => {
    for (const level of LEVELS) {
      expect(generateSheet(ROWS, level, mulberry32(123))).toEqual(generateSheet(ROWS, level, mulberry32(123)))
      expect(generateSheet(ROWS, level, mulberry32(123))).not.toEqual(generateSheet(ROWS, level, mulberry32(124)))
    }
  })
})
