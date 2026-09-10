/**
 * Bongard's original problems 1–10, as generator + checker pairs.
 *
 * `gen(r, side)` draws one random panel meant for that side. `check(panel)`
 * says whether a panel belongs on the left. index.js pairs them: a left panel
 * must pass, a right panel must fail, and anything else is redrawn. So the
 * checker, which measures the drawn geometry, is what guarantees a printed
 * problem is correct — the generator only has to be right most of the time.
 *
 * Rules follow M. M. Bongard (1967) as indexed by H. Foundalis; the figures
 * are our own.
 */
import {
  panel, polygon, curve, ellipse, dot, outline, convexity, isClosed, shapeSize, panelBbox, rotate,
} from '../shapes.js'
import {
  figure, sized, placeRandom, placeAt, placeGroup, scatter, squiggle, zigzag, TEXTURED_MIN,
  ALL_KINDS, CONVEX_KINDS, CONCAVE_KINDS, STRAIGHT_KINDS, CURVED_KINDS,
} from '../gen.js'

const every = (p, f) => p.shapes.length > 0 && p.shapes.every(f)
const anyFill = r => (r.chance(0.5) ? 'solid' : 'none')

/** Kinds that still read as a figure, not a smudge, when drawn small. */
const SIMPLE_KINDS = ['triangle', 'quad', 'rect', 'circle', 'ellipse']
const SMALL = 18

/** A kind that suits the size: anything when large, only simple ones when small. */
function kindFor(r, size, kinds = ALL_KINDS) {
  const usable = size < SMALL ? kinds.filter(k => SIMPLE_KINDS.includes(k)) : kinds
  return r.pick(usable.length ? usable : kinds)
}

/** One random figure of any kind, sized and placed. */
function anyFigure(r, { kinds = ALL_KINDS, fill = anyFill(r), size = r.num(15, 55), region = 'any' } = {}) {
  return placeRandom(r, figure(r, kindFor(r, size, kinds), { fill, size }), region)
}

/* ── BP7 helpers: a figure long along the x axis, later turned upright ── */

function elongated(r, length, thick) {
  const L = length / 2
  const T = thick / 2
  switch (r.pick(['ellipse', 'rect', 'wave', 'zigzag', 'lozenge', 'comb'])) {
    case 'ellipse': return [ellipse(0, 0, L, T)]
    case 'rect': return [polygon([[-L, -T], [L, -T], [L, T], [-L, T]])]
    case 'lozenge': return [polygon([[-L, 0], [0, -T], [L, 0], [0, T]])]
    case 'wave': {
      const n = r.int(5, 9)
      const pts = Array.from({ length: n }, (_, i) => [-L + (i * length) / (n - 1), (i % 2 ? T : -T)])
      return [curve(pts, { closed: false })]
    }
    case 'zigzag': {
      const n = r.int(6, 12)
      const pts = Array.from({ length: n }, (_, i) => [-L + (i * length) / (n - 1), (i % 2 ? T : -T)])
      return [polygon(pts, { closed: false })]
    }
    case 'comb': {
      const teeth = r.int(6, 12)
      const shapes = [polygon([[-L, 0], [L, 0]], { closed: false })]
      for (let i = 0; i < teeth; i++) {
        const x = -L + (i * length) / (teeth - 1)
        shapes.push(polygon([[x, -T], [x, T]], { closed: false }))
      }
      return shapes
    }
    default: return [ellipse(0, 0, L, T)]
  }
}

export const problems = [
  {
    id: 'bp001',
    number: 1,
    band: 1,
    // Left: nothing. Right: something.
    gen(r, side) {
      if (side === 'left') return panel([])
      switch (r.pick(['figure', 'dots', 'squiggle', 'several'])) {
        case 'dots': return panel(scatter(r, r.int(5, 9), 1.8).map(([x, y]) => dot(x, y, 1.8)))
        case 'squiggle': return panel([placeRandom(r, sized(squiggle(r), r.num(30, 50)))])
        case 'several': return panel(scatter(r, 3, 7).map(([x, y]) => (
          placeAt(figure(r, r.pick(['triangle', 'quad', 'circle']), { fill: anyFill(r), size: r.num(8, 14) }), x, y)
        )))
        default: return panel([anyFigure(r, { size: r.num(20, 55) })])
      }
    },
    check: p => p.shapes.length === 0,
  },
  {
    id: 'bp002',
    number: 2,
    band: 1,
    // Left: large figures. Right: small figures.
    gen(r, side) {
      return panel([anyFigure(r, { size: side === 'left' ? r.num(48, 74) : r.num(7, 16) })])
    },
    check: p => every(p, s => shapeSize(s) >= 40),
  },
  {
    id: 'bp003',
    number: 3,
    band: 1,
    // Left: outline figures. Right: filled figures.
    gen(r, side) {
      const fill = side === 'left' ? 'none' : 'solid'
      if (r.chance(0.3)) {
        return panel(scatter(r, 2, 10).map(([x, y]) => {
          const size = r.num(8, 18)
          return placeAt(figure(r, kindFor(r, size), { fill, size }), x, y)
        }))
      }
      return panel([anyFigure(r, { fill, size: r.num(10, 55) })])
    },
    check: p => every(p, s => s.fill === 'none'),
  },
  {
    id: 'bp004',
    number: 4,
    band: 2,
    // Left: convex figures. Right: figures with a dent.
    gen(r, side) {
      return panel([anyFigure(r, { kinds: side === 'left' ? CONVEX_KINDS : CONCAVE_KINDS, size: r.num(20, 55) })])
    },
    check: p => every(p, s => isClosed(s) && convexity(outline(s)) >= 0.97),
  },
  {
    id: 'bp005',
    number: 5,
    band: 2,
    // Left: straight sides. Right: curves.
    gen(r, side) {
      if (side === 'left') return panel([anyFigure(r, { kinds: STRAIGHT_KINDS, fill: 'none', size: r.num(18, 55) })])
      if (r.chance(0.25)) return panel([placeRandom(r, sized(squiggle(r, { n: r.int(4, 6), amp: 6 }), r.num(30, 55)))])
      return panel([anyFigure(r, { kinds: CURVED_KINDS, fill: 'none', size: r.num(12, 55) })])
    },
    check: p => every(p, s => s.kind === 'polygon'),
  },
  {
    id: 'bp006',
    number: 6,
    band: 1,
    // Left: triangles. Right: quadrilaterals.
    gen(r, side) {
      const kind = side === 'left' ? 'triangle' : r.pick(['quad', 'quad', 'rect', 'dart'])
      const size = r.num(12, 60)
      const fill = anyFill(r)
      const s = kind === 'dart'
        ? sized(polygon(dartPoints(r), { fill }), size)
        : figure(r, kind, { fill, size })
      return panel([placeRandom(r, s)])
    },
    check: p => p.shapes.length === 1 && p.shapes[0].kind === 'polygon' && p.shapes[0].closed && p.shapes[0].points.length === 3,
  },
  {
    id: 'bp007',
    number: 7,
    band: 2,
    // Left: stretched top to bottom. Right: stretched sideways.
    gen(r, side) {
      const length = r.num(40, 72)
      const thick = r.num(4, Math.min(14, length / 3.5))
      let shapes = elongated(r, length, thick)
      if (side === 'left') shapes = shapes.map(s => rotate(s, 90))
      return panel(placeGroup(r, shapes))
    },
    check: p => {
      const b = panelBbox(p)
      return p.shapes.length > 0 && b.h >= 1.8 * b.w
    },
  },
  {
    id: 'bp008',
    number: 8,
    band: 1,
    // Left: the figure sits on the right of its box. Right: on the left.
    gen(r, side) {
      return panel([anyFigure(r, { size: r.num(8, 16), region: side === 'left' ? 'right' : 'left' })])
    },
    check: p => p.shapes.length > 0 && panelBbox(p).cx >= 55,
  },
  {
    id: 'bp009',
    number: 9,
    band: 2,
    // Left: smooth outline. Right: zigzag outline.
    gen(r, side) {
      const size = r.num(TEXTURED_MIN, 66)
      // Teeth pile up inside a dent, so only convex figures take the texture.
      const kinds = side === 'left' ? ALL_KINDS : CONVEX_KINDS
      const s = figure(r, r.pick(kinds), { fill: 'none', size })
      const jagged = side === 'left' ? null : zigzag(r, size)
      return panel([placeRandom(r, { ...s, jagged })])
    },
    check: p => every(p, s => !s.jagged),
  },
  {
    id: 'bp010',
    number: 10,
    band: 3,
    // Left: triangles. Right: quadrilaterals — with the outline texture as a decoy.
    gen(r, side) {
      const kind = side === 'left' ? 'triangle' : r.pick(['quad', 'quad', 'rect'])
      // Texture is the decoy, so it is drawn at sizes where it can be seen.
      const textured = r.chance(0.5)
      const size = textured ? r.num(TEXTURED_MIN, 60) : r.num(10, 60)
      const s = figure(r, kind, { fill: 'none', size })
      return panel([placeRandom(r, { ...s, jagged: textured ? zigzag(r, size) : null })])
    },
    check: p => p.shapes.length === 1 && p.shapes[0].kind === 'polygon' && p.shapes[0].closed && p.shapes[0].points.length === 3,
  },
]

/** A concave quadrilateral: an arrowhead. */
function dartPoints(r) {
  const w = r.num(12, 20)
  const notch = r.num(4, 9)
  return [[-w, -14], [0, 14], [w, -14], [0, -14 + notch]]
}
