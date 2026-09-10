import { describe, it, expect } from 'vitest'
import { mulberry32, rngHelpers } from './rng.js'
import {
  polygon, curve, circle, ellipse, outline, bbox, area, convexity, catmullRom, jaggedPoints, resample, toPath, rotate, translate, scale, isClosed, pointInPolygon,
} from './shapes.js'
import { figure, sized, placeRandom, randomPolygon, randomBlob, ALL_KINDS, MARGIN } from './gen.js'
import { PROBLEMS, PROBLEM_BY_ID, BANDS, BAND_LEVEL, PER_PAGE, MAX_ATTEMPTS, generatePanel, generateProblem, generateSheet, problemsInBand, ruleKey } from './index.js'
import { BOX } from './shapes.js'
import { PROBLEM_W, PROBLEM_H } from './layout.js'

const SEEDS = 200
const square = polygon([[0, 0], [10, 0], [10, 10], [0, 10]])
const arrow = polygon([[0, 0], [10, 5], [0, 10], [3, 5]])

describe('geometry', () => {
  it('measures a square', () => {
    expect(area(square.points)).toBe(100)
    expect(bbox(outline(square))).toMatchObject({ x: 0, y: 0, w: 10, h: 10, cx: 5, cy: 5 })
    expect(convexity(square.points)).toBe(1)
    expect(pointInPolygon([5, 5], square.points)).toBe(true)
    expect(pointInPolygon([15, 5], square.points)).toBe(false)
  })

  it('sees the dent in an arrowhead', () => {
    expect(convexity(arrow.points)).toBeLessThan(0.9)
  })

  it('samples circles, ellipses and splines as closed outlines', () => {
    const c = outline(circle(50, 50, 20))
    expect(c.length).toBe(48)
    expect(convexity(c)).toBeCloseTo(1, 3)
    const e = bbox(outline(ellipse(0, 0, 20, 5, { rotate: 90 })))
    expect(e.w).toBeCloseTo(10, 1)
    expect(e.h).toBeCloseTo(40, 1)
    const blob = curve([[10, 0], [0, 10], [-10, 0], [0, -10]])
    expect(catmullRom(blob.points, true, 8).length).toBe(32)
    expect(catmullRom(blob.points, false, 8).length).toBe(25)
    expect(isClosed(blob)).toBe(true)
    expect(isClosed(curve(blob.points, { closed: false }))).toBe(false)
  })

  it('transforms about the origin', () => {
    const r = rotate(polygon([[10, 0]]), 90)
    expect(r.points[0][0]).toBeCloseTo(0)
    expect(r.points[0][1]).toBeCloseTo(10)
    expect(translate(circle(0, 0, 5), 3, 4)).toMatchObject({ cx: 3, cy: 4, r: 5 })
    expect(scale(ellipse(1, 1, 2, 3), 2)).toMatchObject({ cx: 2, cy: 2, rx: 4, ry: 6 })
    expect(rotate(ellipse(0, 0, 2, 3, { rotate: 10 }), 20).rotate).toBe(30)
  })

  it('serrates each edge between sharp corners', () => {
    const teeth = jaggedPoints(square.points, true, 1, 2)
    // Each 10-unit edge: its corner, then three tooth pairs.
    expect(teeth.length).toBe(4 * 7)
    expect(teeth[0]).toEqual([0, 0])
    expect(teeth[7]).toEqual([10, 0])
    // Alternating sides: teeth on the top edge sit at y = ±1, corners on it.
    expect(teeth.slice(1, 7).map(p => Math.round(p[1]))).toEqual([1, -1, 1, -1, 1, -1])
    // A curve is resampled evenly first, so a circle gets a steady cadence.
    const ring = resample(outline(circle(0, 0, 10)), true, 4)
    expect(ring.length).toBe(16)
    const d = Math.hypot(ring[1][0] - ring[0][0], ring[1][1] - ring[0][1])
    expect(d).toBeCloseTo(Math.hypot(ring[9][0] - ring[8][0], ring[9][1] - ring[8][1]), 5)
  })

  it('writes path data for every kind', () => {
    expect(toPath(square).d).toBe('M0 0 L10 0 L10 10 L0 10 Z')
    expect(toPath(polygon(square.points, { closed: false })).d).not.toContain('Z')
    expect(toPath(circle(5, 5, 5)).d).toMatch(/^M0 5 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 Z$/)
    expect(toPath(ellipse(5, 5, 5, 2, { rotate: 30 })).transform).toBe('rotate(30 5 5)')
    expect(toPath(curve([[0, 0], [10, 0], [10, 10]])).d).toMatch(/^M0 0 C.* Z$/)
    expect(toPath({ ...square, jagged: { amp: 1, step: 2 } }).d.split('L').length).toBe(28)
  })
})

describe('figures', () => {
  const r = rngHelpers(mulberry32(7))

  it('builds every kind at the asked size, centred on the origin, inside the box once placed', () => {
    for (let i = 0; i < 100; i++) {
      for (const kind of ALL_KINDS) {
        const s = figure(r, kind, { size: 30 })
        const b = bbox(outline(s))
        expect(Math.max(b.w, b.h)).toBeCloseTo(30, 6)
        expect(Math.abs(b.cx)).toBeLessThan(1e-6)
        expect(Math.abs(b.cy)).toBeLessThan(1e-6)
        const placed = bbox(outline(placeRandom(r, s)))
        expect(placed.x).toBeGreaterThanOrEqual(MARGIN - 1e-6)
        expect(placed.x + placed.w).toBeLessThanOrEqual(BOX - MARGIN + 1e-6)
        expect(placed.y).toBeGreaterThanOrEqual(MARGIN - 1e-6)
        expect(placed.y + placed.h).toBeLessThanOrEqual(BOX - MARGIN + 1e-6)
      }
    }
  })

  it('makes convex polygons convex and concave ones clearly dented', () => {
    for (let i = 0; i < 200; i++) {
      for (const n of [3, 4, 5, 6, 7]) {
        expect(convexity(randomPolygon(r, n))).toBeGreaterThanOrEqual(0.995)
        if (n >= 4) expect(convexity(randomPolygon(r, n, { convex: false }))).toBeLessThanOrEqual(0.85)
      }
      expect(convexity(outline(curve(randomBlob(r))))).toBeGreaterThanOrEqual(0.985)
      expect(convexity(outline(curve(randomBlob(r, { convex: false }))))).toBeLessThanOrEqual(0.85)
    }
  })

  it('keeps left and right placement apart', () => {
    for (let i = 0; i < 100; i++) {
      const s = sized(figure(r, 'circle'), 16)
      expect(bbox(outline(placeRandom(r, s, 'left'))).cx).toBeLessThanOrEqual(40)
      expect(bbox(outline(placeRandom(r, s, 'right'))).cx).toBeGreaterThanOrEqual(60)
    }
  })
})

describe('problems', () => {
  it('are numbered, banded and keyed to a rule string', () => {
    expect(PROBLEMS.length).toBeGreaterThanOrEqual(10)
    const ids = PROBLEMS.map(p => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const p of PROBLEMS) {
      expect(p.id).toMatch(/^bp\d{3}$/)
      expect(p.number).toBe(Number(p.id.slice(2)))
      expect(Object.values(BAND_LEVEL)).toContain(p.band)
      expect(ruleKey(p)).toBe(`bongard.rules.${p.id}`)
      expect(PROBLEM_BY_ID[p.id]).toBe(p)
    }
    for (const band of BANDS) expect(problemsInBand(band).length).toBeGreaterThan(0)
    expect(problemsInBand('all')).toEqual(PROBLEMS)
  })

  for (const problem of PROBLEMS) {
    it(`${problem.id}: every left panel passes the check, every right panel fails it, within budget`, () => {
      let worst = 0
      for (let seed = 1; seed <= SEEDS; seed++) {
        const r = rngHelpers(mulberry32(seed * 7919 + problem.number))
        for (const side of ['left', 'right']) {
          const { panel, attempts } = generatePanel(problem, side, r)
          worst = Math.max(worst, attempts)
          expect(problem.check(panel), `${problem.id} ${side} seed ${seed}`).toBe(side === 'left')
          for (const s of panel.shapes) {
            const b = bbox(outline(s))
            expect(b.x, `${problem.id} ${side} seed ${seed} off the box`).toBeGreaterThanOrEqual(0)
            expect(b.y).toBeGreaterThanOrEqual(0)
            expect(b.x + b.w).toBeLessThanOrEqual(BOX)
            expect(b.y + b.h).toBeLessThanOrEqual(BOX)
            expect(toPath(s).d).toMatch(/^M/)
          }
        }
      }
      // Well inside MAX_ATTEMPTS: a generator that needs many redraws is a
      // generator drifting away from its own rule.
      expect(worst).toBeLessThanOrEqual(MAX_ATTEMPTS / 4)
    })
  }

  it('generateProblem is deterministic for a seed and yields six panels a side', () => {
    const a = generateProblem(PROBLEMS[3], mulberry32(42))
    const b = generateProblem(PROBLEMS[3], mulberry32(42))
    expect(JSON.stringify(a)).toBe(JSON.stringify(b))
    expect(a.left.length).toBe(6)
    expect(a.right.length).toBe(6)
    expect(a.rule).toBe('bongard.rules.bp004')
    expect(JSON.stringify(generateProblem(PROBLEMS[3], mulberry32(43)))).not.toBe(JSON.stringify(a))
  })

  it('generateSheet never repeats a problem while the band has enough, and tops up otherwise', () => {
    for (const count of PER_PAGE) {
      for (const band of ['all', ...BANDS]) {
        const sheet = generateSheet(count, band, mulberry32(count * 31 + band.length))
        expect(sheet.length).toBe(count)
        const ids = sheet.map(p => p.id)
        expect(new Set(ids).size).toBe(Math.min(count, PROBLEMS.length))
        const own = problemsInBand(band)
        const ownOnSheet = ids.filter(id => own.some(p => p.id === id)).length
        expect(ownOnSheet).toBe(Math.min(count, own.length))
      }
    }
  })

  it('lays the figure out wider than tall', () => {
    expect(PROBLEM_W).toBeGreaterThan(PROBLEM_H)
  })
})
