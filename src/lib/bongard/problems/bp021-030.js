/**
 * Bongard's original problems 21–30, on the same contract as 11–20: `check`
 * returns true for the left, false for the right, and null for a panel too
 * close to call.
 *
 * Rules follow M. M. Bongard (1967) as indexed by H. Foundalis; the figures
 * are our own.
 */
import {
  BOX, panel, polygon, curve, circle, outline, bbox, shapeSize, pointInPolygon, distToOutline, selfContact, rotate,
} from '../shapes.js'
import { figure, sized, placeRandom, placeApart, arc, MARGIN } from '../gen.js'

const one = p => (p.shapes.length === 1 ? p.shapes[0] : null)
const isBlack = s => s.fill === 'solid'

/* ── BP21–BP28: small upright tokens ── */

const TOKENS = ['circle', 'triangle', 'square']

/** An upright circle, triangle or square `size` across, as Bongard scatters them. */
function token(r, kind, size, fill = 'none') {
  if (kind === 'circle') return circle(0, 0, size / 2, { fill })
  if (kind === 'square') {
    const h = (size * 0.92) / 2
    return polygon([[-h, -h], [h, -h], [h, h], [-h, h]], { fill })
  }
  const f = r.chance(0.25) ? -1 : 1
  return sized(polygon([[0, -f], [0.866, 0.5 * f], [-0.866, 0.5 * f]], { fill }), size)
}

function kindOf(s) {
  if (s.kind === 'circle') return 'circle'
  if (s.kind !== 'polygon' || !s.closed) return 'other'
  return { 3: 'triangle', 4: 'square' }[s.points.length] ?? 'other'
}

/** Tokens for a list of { kind, fill } scattered apart, largest placed first. */
const scatterTokens = (r, items, size, gap = 7) =>
  placeApart(r, r.shuffle(items).map(it => token(r, it.kind, size(), it.fill)), gap)

const count = (p, f) => p.shapes.filter(f).length
const majority = (a, b) => (a > b ? true : b > a ? false : null)

/** `n` fills, `black` of them solid, in random order. */
const fills = (r, n, black) => r.shuffle(Array.from({ length: n }, (_, i) => (i < black ? 'solid' : 'none')))

/* ── BP30: lines that cross themselves or not ── */

/** A wandering line: steps of 10 units, each turning up to `turn` degrees. */
function walk(r, n, turn) {
  let x = 0
  let y = 0
  let h = r.num(0, 360)
  const pts = [[0, 0]]
  for (let i = 1; i < n; i++) {
    h += r.num(-turn, turn)
    x += 10 * Math.cos((h * Math.PI) / 180)
    y += 10 * Math.sin((h * Math.PI) / 180)
    pts.push([x, y])
  }
  return pts
}

function crossingLine(r) {
  switch (r.pick(['walk', 'loops', 'overshoot', 'star', 'bowtie', 'eight'])) {
    case 'walk': return curve(walk(r, r.int(6, 8), 150), { closed: false })
    case 'loops': {
      const a = r.num(3, 4.5)
      const b = r.num(8, 11)
      const pts = []
      for (let t = -Math.PI / 2; t <= 2 * Math.PI * r.int(1, 2) + Math.PI / 2 + 1e-9; t += Math.PI / 5) pts.push([a * t - b * Math.sin(t), -b * Math.cos(t)])
      return curve(pts, { closed: false })
    }
    case 'overshoot': {
      const A = [r.num(-24, -16), r.num(-14, -6)]
      const B = [r.num(16, 24), r.num(-14, -6)]
      const C = [r.num(-8, 8), r.num(14, 22)]
      const t = r.num(0.3, 0.7)
      const M = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]
      const k = r.num(1.3, 1.7)
      return polygon([A, B, C, [C[0] + (M[0] - C[0]) * k, C[1] + (M[1] - C[1]) * k]], { closed: false })
    }
    case 'star': {
      const pts = arc(0, 0, 20, -90, 270, 72).slice(0, 5)
      return polygon([0, 2, 4, 1, 3].map(i => pts[i]), { closed: r.chance(0.6) })
    }
    case 'bowtie': {
      const w = r.num(14, 20)
      const h = r.num(10, 16)
      return polygon([[-w, -h], [w, h], [w, -h], [-w, h]])
    }
    default: {
      const pts = Array.from({ length: 8 }, (_, i) => {
        const t = Math.PI / 8 + (Math.PI * i) / 4
        const d = 1 + Math.sin(t) ** 2
        return [(20 * Math.cos(t)) / d, (20 * r.num(0.9, 1.4) * Math.sin(t) * Math.cos(t)) / d]
      })
      return curve(pts)
    }
  }
}

function plainLine(r) {
  switch (r.pick(['angle', 'zed', 'zigzag', 'closed', 'hook', 'wave', 'walk'])) {
    case 'angle': {
      const w = r.num(8, 16)
      const h = r.num(14, 20)
      return polygon([[-w, h], [0, -h], [r.num(-0.2, 1) * w, h]], { closed: false })
    }
    case 'zed': {
      const w = r.num(12, 18)
      const h = r.num(10, 18)
      return polygon([[-w, -h], [w, -h], [-w, h], [w, h]], { closed: false })
    }
    case 'zigzag': {
      const n = r.int(4, 6)
      return polygon(Array.from({ length: n }, (_, i) => [i * 9, i % 2 ? 10 : -10]), { closed: false })
    }
    case 'closed': return figure(r, r.pick(['triangle', 'quad', 'polygon', 'blob', 'concaveBlob', 'circle']))
    case 'hook': {
      const a0 = r.num(0, 360)
      const pts = arc(0, 0, 14, a0, a0 + r.num(200, 290), 45)
      const [x, y] = pts.at(-1)
      return curve([...pts, [x * 0.4, y * 0.4]], { closed: false })
    }
    case 'wave': {
      const periods = r.num(1, 1.5)
      return curve(Array.from({ length: 9 }, (_, i) => [i * 6, 12 * Math.sin((2 * Math.PI * periods * i) / 8)]), { closed: false })
    }
    default: return curve(walk(r, r.int(4, 5), 60), { closed: false })
  }
}

export const problems = [
  {
    id: 'bp021',
    number: 21,
    band: 2,
    // Left: there is a small figure. Right: no small figures.
    gen(r, side) {
      const small = () => r.num(5, 9)
      const big = () => r.num(22, 36)
      let sizes
      if (side === 'right') sizes = Array.from({ length: r.int(1, 3) }, big)
      else {
        sizes = r.pick([
          () => [small(), ...Array.from({ length: r.int(1, 2) }, big)],
          () => Array.from({ length: r.int(2, 3) }, small),
          () => [small(), small(), big()],
        ])()
      }
      sizes.sort((a, b) => b - a)
      return panel(placeApart(r, sizes.map(size => token(r, r.pick(['circle', 'triangle']), size)), 6))
    },
    check(p) {
      if (!p.shapes.length) return null
      const smallest = Math.min(...p.shapes.map(shapeSize))
      return smallest <= 10 ? true : smallest >= 18 ? false : null
    },
  },
  {
    id: 'bp022',
    number: 22,
    band: 2,
    // Left: all figures the same size. Right: figures of different sizes.
    gen(r, side) {
      const n = r.int(2, 4)
      let sizes
      if (side === 'left') {
        const size = r.num(6, n >= 4 ? 24 : 32)
        sizes = Array.from({ length: n }, () => size * r.num(0.97, 1.03))
      } else {
        const small = r.num(6, 13)
        const big = Math.min(36, small * r.num(2.2, 4))
        sizes = [small, big, ...Array.from({ length: n - 2 }, () => r.num(small, big))]
      }
      sizes.sort((a, b) => b - a)
      return panel(placeApart(r, sizes.map(size => token(r, r.pick(TOKENS), size)), 6))
    },
    check(p) {
      if (p.shapes.length < 2) return null
      const sizes = p.shapes.map(shapeSize)
      const ratio = Math.max(...sizes) / Math.min(...sizes)
      return ratio <= 1.2 ? true : ratio >= 1.7 ? false : null
    },
  },
  {
    id: 'bp023',
    number: 23,
    band: 1,
    // Left: one figure. Right: two figures.
    gen(r, side) {
      const shape = size => {
        const kind = r.pick(['circle', 'triangle', 'quad', 'rect', 'cross'])
        if (kind !== 'cross') return figure(r, kind, { size })
        const t = r.num(4, 7)
        // A cross drawn small is a smudge, so it keeps to sizes where its arms read.
        return sized(rotate(polygon([[-t, -20], [t, -20], [t, -t], [20, -t], [20, t], [t, t], [t, 20], [-t, 20], [-t, t], [-20, t], [-20, -t], [-t, -t]]), r.num(0, 90)), Math.max(size, 20))
      }
      if (side === 'left') return panel([placeRandom(r, shape(r.num(12, 50)))])
      return panel(placeApart(r, [shape(r.num(10, 36)), shape(r.num(10, 36))], 6))
    },
    check(p) {
      return p.shapes.length === 1 ? true : p.shapes.length === 2 ? false : null
    },
  },
  {
    id: 'bp024',
    number: 24,
    band: 1,
    // Left: there is a circle. Right: no circles.
    gen(r, side) {
      const n = side === 'left' ? r.int(2, 5) : r.int(1, 5)
      const kinds = Array.from({ length: n }, () => r.pick(['triangle', 'square']))
      if (side === 'left') kinds.fill('circle', 0, r.int(1, Math.min(2, n)))
      return panel(scatterTokens(r, kinds.map(kind => ({ kind })), () => r.num(9, 12)))
    },
    check(p) {
      return p.shapes.length ? p.shapes.some(s => kindOf(s) === 'circle') : null
    },
  },
  {
    id: 'bp025',
    number: 25,
    band: 1,
    // Left: the black figure is a triangle. Right: the black figure is a circle.
    gen(r, side) {
      const items = [{ kind: side === 'left' ? 'triangle' : 'circle', fill: 'solid' }]
      for (let i = r.int(3, 5); i > 0; i--) items.push({ kind: r.pick(TOKENS) })
      return panel(scatterTokens(r, items, () => r.num(9, 11)))
    },
    check(p) {
      const blacks = p.shapes.filter(isBlack)
      if (blacks.length !== 1) return null
      const kind = kindOf(blacks[0])
      return kind === 'triangle' ? true : kind === 'circle' ? false : null
    },
  },
  {
    id: 'bp026',
    number: 26,
    band: 2,
    // Left: there is a black triangle. Right: no black triangles.
    gen(r, side) {
      const items = Array.from({ length: r.int(4, 6) }, () => ({ kind: r.pick(['circle', 'triangle']), fill: r.chance(0.35) ? 'solid' : 'none' }))
      if (side === 'left') {
        if (!items.some(it => it.kind === 'triangle' && it.fill === 'solid')) items[0] = { kind: 'triangle', fill: 'solid' }
      } else {
        for (const it of items) if (it.kind === 'triangle') it.fill = 'none'
        // Black circles on the right too, so "something black" is not the answer.
        if (r.chance(0.8) && !items.some(it => it.fill === 'solid')) items[0] = { kind: 'circle', fill: 'solid' }
      }
      return panel(scatterTokens(r, items, () => r.num(9, 11)))
    },
    check(p) {
      return p.shapes.length ? p.shapes.some(s => isBlack(s) && kindOf(s) === 'triangle') : null
    },
  },
  {
    id: 'bp027',
    number: 27,
    band: 2,
    // Left: more black figures than white. Right: more white figures than black.
    gen(r, side) {
      const n = r.int(3, 7)
      const black = side === 'left' ? r.int(Math.floor(n / 2) + 1, n - 1) : r.int(1, Math.ceil(n / 2) - 1)
      return panel(scatterTokens(r, fills(r, n, black).map(fill => ({ kind: r.pick(TOKENS), fill })), () => r.num(9, 11)))
    },
    check(p) {
      return p.shapes.length ? majority(count(p, isBlack), count(p, s => !isBlack(s))) : null
    },
  },
  {
    id: 'bp028',
    number: 28,
    band: 3,
    // Left: more black circles than white circles. Right: more white circles than black.
    gen(r, side) {
      const circles = r.int(2, 5)
      const black = side === 'left' ? r.int(Math.floor(circles / 2) + 1, circles) : r.int(0, Math.ceil(circles / 2) - 1)
      // Triangles lean the other way, so counting every black figure misleads.
      const tris = r.int(1, 3)
      const blackTris = side === 'left' ? r.int(0, Math.floor(tris / 2)) : r.int(Math.ceil(tris / 2), tris)
      const items = [
        ...fills(r, circles, black).map(fill => ({ kind: 'circle', fill })),
        ...fills(r, tris, blackTris).map(fill => ({ kind: 'triangle', fill })),
      ]
      return panel(scatterTokens(r, items, () => r.num(9, 11)))
    },
    check(p) {
      const circles = p.shapes.filter(s => kindOf(s) === 'circle')
      return circles.length ? majority(circles.filter(isBlack).length, circles.filter(s => !isBlack(s)).length) : null
    },
  },
  {
    id: 'bp029',
    number: 29,
    band: 2,
    // Left: more small circles inside the figure than outside it. Right: more outside than inside.
    gen(r, side) {
      const kind = r.pick(['circle', 'ellipse', 'triangle', 'quad', 'rect', 'blob', 'polygon'])
      const big = placeRandom(r, figure(r, kind, { size: r.num(46, 66) }))
      const pts = outline(big)
      const many = r.int(1, kind === 'triangle' ? 3 : 5)
      const few = r.int(0, many - 1)
      const [inside, outside] = side === 'left' ? [many, few] : [few, many]
      const R = 2.6
      const spots = []
      const clear = q => distToOutline(q, pts) >= R + 3 && spots.every(s => Math.hypot(s[0] - q[0], s[1] - q[1]) >= 2 * R + 4)
      const b = bbox(pts)
      for (let i = 0, tries = 0; i < inside && tries < 300; tries++) {
        const q = [r.num(b.x, b.x + b.w), r.num(b.y, b.y + b.h)]
        if (pointInPolygon(q, pts) && clear(q)) spots.push(q) && i++
      }
      for (let i = 0, tries = 0; i < outside && tries < 300; tries++) {
        const q = [r.num(MARGIN + R, BOX - MARGIN - R), r.num(MARGIN + R, BOX - MARGIN - R)]
        if (!pointInPolygon(q, pts) && clear(q)) spots.push(q) && i++
      }
      return panel([big, ...spots.map(([x, y]) => circle(x, y, R))])
    },
    check(p) {
      const small = p.shapes.filter(s => s.kind === 'circle' && s.r <= 4)
      const big = p.shapes.filter(s => !small.includes(s))
      if (big.length !== 1 || !small.length) return null
      const pts = outline(big[0])
      let inside = 0
      for (const c of small) {
        if (distToOutline([c.cx, c.cy], pts) < c.r + 1) return null
        if (pointInPolygon([c.cx, c.cy], pts)) inside++
      }
      return majority(inside, small.length - inside)
    },
  },
  {
    id: 'bp030',
    number: 30,
    band: 2,
    // Left: the line crosses itself. Right: it never does.
    gen(r, side) {
      const s = side === 'left' ? crossingLine(r) : plainLine(r)
      return panel([placeRandom(r, sized(rotate(s, r.num(0, 360)), r.num(36, 64)))])
    },
    check(p) {
      const s = one(p)
      if (!s) return null
      const { crossAngle, gap } = selfContact(s)
      return crossAngle >= 25 ? true : crossAngle === 0 && gap >= 3 ? false : null
    },
  },
]
