/**
 * Bongard's original problems 31–40, on the same contract as 11–30: `check`
 * returns true for the left, false for the right, and null for a panel too
 * close to call.
 *
 * Rules follow M. M. Bongard (1967) as indexed by H. Foundalis; the figures
 * are our own.
 */
import {
  BOX, panel, polygon, curve, circle, ellipse, dot, outline, isClosed, shapeSize, shapeBbox, pointInPolygon, distToOutline,
  straightest, sharpestOutwardTurn, sharpestTurn, principalAxis, overlap, rotate, translate, scale,
} from '../shapes.js'
import {
  figure, sized, placeRandom, placeAt, placeGroup, placeApart, placeInside, scatterWhere, spotsOnLine, spotOffLines,
  arc, token, tokenKind, walk, MARGIN,
} from '../gen.js'

const one = p => (p.shapes.length === 1 ? p.shapes[0] : null)
const isDot = s => s.kind === 'circle' && s.fill === 'solid' && s.r <= 3
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
const deg = (y, x) => (Math.atan2(y, x) * 180) / Math.PI
const rad = a => (a * Math.PI) / 180
const regular = (n, rad, deg) => Array.from({ length: n }, (_, i) => {
  const a = ((deg + (360 * i) / n) * Math.PI) / 180
  return [rad * Math.cos(a), rad * Math.sin(a)]
})
const box = (w, h, opts) => polygon([[-w, -h], [w, -h], [w, h], [-w, h]], opts)
/** Points on a circle from angle `from` to `to`, going the way round that passes `through`. */
function arcThrough(cx, cy, r, from, to, through) {
  const rel = a => (((a - from) % 360) + 360) % 360
  const sweep = rel(through) < rel(to) ? rel(to) : rel(to) - 360
  return arc(cx, cy, r, from, from + sweep)
}

/** The edge a→b replaced by a curve bowed `sag` of its length towards `toward`. */
function bowed(a, b, sag, toward) {
  const len = dist(a, b)
  let nx = -(b[1] - a[1]) / len
  let ny = (b[0] - a[0]) / len
  const mx = (a[0] + b[0]) / 2
  const my = (a[1] + b[1]) / 2
  if (nx * (toward[0] - mx) + ny * (toward[1] - my) < 0) [nx, ny] = [-nx, -ny]
  const k = [mx + nx * 2 * sag * len, my + ny * 2 * sag * len]
  return Array.from({ length: 15 }, (_, i) => {
    const t = (i + 1) / 16
    return [0, 1].map(j => (1 - t) ** 2 * a[j] + 2 * (1 - t) * t * k[j] + t * t * b[j])
  })
}

/* ── BP31: one line or two ── */

function aLine(r, closedToo = true) {
  const kinds = ['walk', 'loops', 'hook', 'wave']
  if (closedToo) kinds.push('closed', 'closed')
  switch (r.pick(kinds)) {
    case 'walk': return curve(walk(r, r.int(5, 8), 100), { closed: false })
    case 'loops': {
      const a = r.num(3, 4.5)
      const b = r.num(8, 11)
      const pts = []
      for (let t = -Math.PI / 2; t <= 2 * Math.PI * r.int(1, 2) + Math.PI / 2 + 1e-9; t += Math.PI / 5) pts.push([a * t - b * Math.sin(t), -b * Math.cos(t)])
      return curve(pts, { closed: false })
    }
    case 'hook': {
      const a0 = r.num(0, 360)
      const pts = arc(0, 0, 14, a0, a0 + r.num(200, 300), 45)
      const [x, y] = pts.at(-1)
      return curve([...pts, [x * 0.4, y * 0.4]], { closed: false })
    }
    case 'wave': {
      const periods = r.num(1, 1.6)
      return curve(Array.from({ length: 9 }, (_, i) => [i * 6, 12 * Math.sin((2 * Math.PI * periods * i) / 8)]), { closed: false })
    }
    default: return figure(r, r.pick(['circle', 'ellipse', 'blob', 'concaveBlob', 'quad', 'polygon']))
  }
}

/* ── BP32, BP33: sharp corners ── */

/** Outlines with an acute corner that points out of the figure. */
function sharpPoint(r) {
  switch (r.pick(['needle', 'crescent', 'star', 'drop', 'dart', 'kite', 'wedge'])) {
    case 'needle': {
      const T = 20 / r.num(3, 5)
      return [[-20, -T], [20, 0], [-20, T]]
    }
    case 'crescent': {
      const R = 20
      const gap = r.num(50, 80)
      const b = r.num(0, 360)
      const pts = arc(0, 0, R, b + gap, b + 360 - gap)
      const [p0, p1] = [pts[0], pts.at(-1)]
      const d = R * r.num(0.45, 0.7)
      const c = [d * Math.cos(rad(b)), d * Math.sin(rad(b))]
      const r2 = dist(p1, c)
      return [...pts, ...arcThrough(c[0], c[1], r2, deg(p1[1] - c[1], p1[0] - c[0]), deg(p0[1] - c[1], p0[0] - c[0]), b).slice(1, -1)]
    }
    case 'star': {
      const n = r.int(3, 5)
      const inner = n === 3 ? r.num(0.3, 0.4) : r.num(0.3, 0.45)
      const tips = regular(2 * n, 20, r.num(0, 360)).map(([x, y], i) => (i % 2 ? [x * inner, y * inner] : [x, y]))
      if (r.chance(0.5)) return tips
      // Sides bowed in towards the centre: a star of curves with the same tips.
      const out = []
      for (let i = 0; i < n; i++) {
        const a = tips[2 * i]
        const b = tips[(2 * i + 2) % (2 * n)]
        out.push(a, ...bowed(a, b, r.num(0.12, 0.2), [0, 0]))
      }
      return out
    }
    case 'drop': {
      const R = 12
      const D = R / r.num(0.42, 0.55)
      const beta = (Math.acos(R / D) * 180) / Math.PI
      return [...arc(0, 0, R, beta, 360 - beta), [D, 0]]
    }
    case 'dart': {
      const w = r.num(7, 12)
      return [[-w, -14], [0, 14], [w, -14], [0, -14 + r.num(6, 14)]]
    }
    case 'kite': {
      const w = r.num(6, 9)
      return [[0, -24], [w, 0], [0, r.num(6, 12)], [-w, 0]]
    }
    default: {
      const a = r.num(24, 34)
      return [[0, 0], [20, r.num(-8, 8)], [0, a]]
    }
  }
}

/**
 * Outlines whose corners, where they have any, are right angles or wider.
 * `cusps` allows dents that pinch to a point — a smooth bean, a clover —
 * which a child reads as an acute corner even where a curve turns gently.
 */
function noSharpPoint(r, { cusps = true } = {}) {
  const kinds = ['rect', 'regular', 'round', 'cee', 'notched']
  if (cusps) kinds.push('bean', 'clover')
  switch (r.pick(kinds)) {
    case 'rect': return box(20, 20 / r.num(1, 2.5)).points
    case 'regular': {
      const n = r.int(5, 8)
      return regular(n, 20, r.num(0, 360)).map(([x, y]) => {
        const k = r.num(0.9, 1)
        return [x * k, y * k]
      })
    }
    case 'round': return outline(figure(r, r.pick(['circle', 'ellipse', 'blob'])))
    case 'cee': {
      const W = 16
      const H = r.num(14, 20)
      const t = r.num(6, 9)
      return [[-W, -H], [W, -H], [W, -H + t], [-W + t, -H + t], [-W + t, H - t], [W, H - t], [W, H], [-W, H]]
    }
    case 'notched': {
      const W = 18
      const H = r.num(12, 18)
      const w = r.num(5, 8)
      const d = r.num(5, H - 4)
      return [[-W, -H], [-w, -H], [-w, -H + d], [w, -H + d], [w, -H], [W, -H], [W, H], [-W, H]]
    }
    case 'bean': return outline(figure(r, 'concaveBlob'))
    default: {
      const n = r.int(3, 4)
      const d = 10
      const rho = r.num(9.5, 12)
      const centres = regular(n, d, -90)
      const meets = regular(n, 1, -90 + 180 / n).map(([x, y]) => {
        const q = d * Math.cos(Math.PI / n) + Math.sqrt(rho * rho - (d * Math.sin(Math.PI / n)) ** 2)
        return [x * q, y * q]
      })
      const out = []
      for (let i = 0; i < n; i++) {
        const c = centres[i]
        const a = meets[(i - 1 + n) % n]
        const b = meets[i]
        out.push(...arcThrough(c[0], c[1], rho, deg(a[1] - c[1], a[0] - c[0]), deg(b[1] - c[1], b[0] - c[0]), -90 + (360 * i) / n).slice(0, -1))
      }
      return out
    }
  }
}

/** Outlines whose only acute corner points into the figure. */
function sharpNotch(r) {
  switch (r.pick(['peanut', 'vee', 'bite'])) {
    case 'peanut': {
      const R = 12
      const d = R * r.num(0.82, 0.92)
      const s = Math.sqrt(R * R - d * d)
      return [...arc(d, 0, R, deg(-s, -d), deg(s, -d)).slice(0, -1), ...arc(-d, 0, R, deg(s, d), deg(-s, d) + 360).slice(0, -1)]
    }
    case 'vee': {
      const W = 18
      const H = r.num(12, 18)
      const half = r.num(4, 7)
      const depth = half / Math.tan(rad(r.num(20, 32)))
      return [[-W, -H], [-half, -H], [0, -H + Math.min(depth, 2 * H - 4)], [half, -H], [W, -H], [W, H], [-W, H]]
    }
    default: {
      const m = r.num(35, 65)
      const b = r.num(0, 360)
      return [[0, 0], ...arc(0, 0, 20, b + m / 2, b + 360 - m / 2)]
    }
  }
}

const cornerFigure = (r, pts) => placeRandom(r, sized(rotate(polygon(pts), r.num(0, 360)), r.num(30, 62)))

/* ── BP34, BP35: holes ── */

/** A hole is inside its figure and clear of the outline, or the panel is no use. */
function holeIn(p) {
  if (p.shapes.length !== 2) return null
  const [fig, hole] = p.shapes
  if (fig.fill !== 'solid' || hole.fill !== 'hole') return null
  const pts = outline(fig)
  return outline(hole).every(q => pointInPolygon(q, pts) && distToOutline(q, pts) >= 1.5) ? { fig, hole } : null
}

/* ── BP36, BP37, BP38: a triangle and a circle ── */

const centre = s => {
  const b = shapeBbox(s)
  return [b.cx, b.cy]
}

/** Is the triangle above the circle: true, below: false, level: null. */
function triangleAbove(p) {
  const tri = p.shapes.find(s => tokenKind(s) === 'triangle')
  const cir = p.shapes.find(s => tokenKind(s) === 'circle')
  if (!tri || !cir) return null
  const dy = centre(cir)[1] - centre(tri)[1]
  return dy >= 6 ? true : dy <= -6 ? false : null
}

/* ── BP39, BP40: segments and dots ── */

const segment = len => polygon([[-len / 2, 0], [len / 2, 0]], { closed: false })
const isSegment = s => s.kind === 'polygon' && !s.closed && s.points.length === 2
const slope = s => (((deg(s.points[1][1] - s.points[0][1], s.points[1][0] - s.points[0][0]) % 180) + 180) % 180)
const between = (a, b) => {
  const d = Math.abs(a - b) % 180
  return Math.min(d, 180 - d)
}

/** Three of the spots on one line: true; none anywhere near one: false. */
const collinear = spots => (spots.length < 3 ? null : straightest(spots) <= 1.2 ? true : straightest(spots) >= 4.5 ? false : null)

export const problems = [
  {
    id: 'bp031',
    number: 31,
    band: 2,
    // Left: one line. Right: two lines.
    gen(r, side) {
      if (side === 'left') return panel([placeRandom(r, sized(rotate(aLine(r), r.num(0, 360)), r.num(32, 62)))])
      const pair = [aLine(r), aLine(r)].map(s => sized(rotate(s, r.num(0, 360)), r.num(20, 38)))
      if (r.chance(0.4)) {
        // Overlapping, as in Bongard's own: still two lines, however they cross.
        const [a, b] = pair
        const d = r.num(0.35, 0.6) * (shapeSize(a) + shapeSize(b)) / 2
        const t = rad(r.num(0, 360))
        return panel(placeGroup(r, [a, translate(b, d * Math.cos(t), d * Math.sin(t))]))
      }
      return panel(placeApart(r, pair, 5))
    },
    check(p) {
      return p.shapes.length === 1 ? true : p.shapes.length === 2 ? false : null
    },
  },
  {
    id: 'bp032',
    number: 32,
    band: 3,
    // Left: a sharp point sticks out of the figure. Right: nothing sharp sticks out, whatever the corners inside.
    gen(r, side) {
      return panel([cornerFigure(r, side === 'left' ? sharpPoint(r) : noSharpPoint(r))])
    },
    check(p) {
      const s = one(p)
      if (!s || !isClosed(s)) return null
      const turn = sharpestOutwardTurn(outline(s))
      return turn >= 108 ? true : turn <= 95 ? false : null
    },
  },
  {
    id: 'bp033',
    number: 33,
    band: 3,
    // Left: an acute corner somewhere, pointing in or out. Right: no acute corner.
    gen(r, side) {
      const pts = side === 'left' ? (r.chance(0.4) ? sharpNotch(r) : sharpPoint(r)) : noSharpPoint(r, { cusps: false })
      return panel([cornerFigure(r, pts)])
    },
    check(p) {
      const s = one(p)
      if (!s || !isClosed(s)) return null
      const turn = sharpestTurn(outline(s))
      return turn >= 108 ? true : turn <= 95 ? false : null
    },
  },
  {
    id: 'bp034',
    number: 34,
    band: 1,
    // Left: a large hole in the black figure. Right: a small hole.
    gen(r, side) {
      const kind = r.pick(['circle', 'ellipse', 'triangle', 'quad', 'rect', 'polygon', 'blob'])
      const size = r.num(38, 60)
      const fig = figure(r, kind, { fill: 'solid', size })
      const k = side === 'left' ? r.num(0.5, 0.68) : r.num(0.14, 0.24)
      const round = r.chance(0.5) && ['circle', 'ellipse', 'quad', 'rect', 'polygon', 'blob'].includes(kind)
      const hole = { ...(round ? circle(0, 0, (k * size) / 2) : scale(fig, k)), fill: 'hole' }
      const settled = placeInside(r, fig, hole, ((1 - k) * size) / 4) ?? placeInside(r, fig, { ...scale(fig, k), fill: 'hole' }, 0)
      return panel(placeGroup(r, settled ? [fig, settled] : [fig]))
    },
    check(p) {
      const h = holeIn(p)
      if (!h) return null
      const ratio = shapeSize(h.hole) / shapeSize(h.fig)
      return ratio >= 0.42 ? true : ratio <= 0.27 ? false : null
    },
  },
  {
    id: 'bp035',
    number: 35,
    band: 3,
    // Left: the slit runs along the figure. Right: the slit runs across it.
    gen(r, side) {
      const L = r.num(24, 34)
      const T = L / r.num(2, 3)
      let body
      switch (r.pick(['ellipse', 'rect', 'lozenge', 'hex', 'trapezoid'])) {
        case 'ellipse': body = ellipse(0, 0, L, T, { fill: 'solid' }); break
        case 'rect': body = box(L, T, { fill: 'solid' }); break
        case 'lozenge': body = polygon([[-L, 0], [0, -T], [L, 0], [0, T]], { fill: 'solid' }); break
        case 'hex': body = polygon([[-L, 0], [-L * 0.6, -T], [L * 0.6, -T], [L, 0], [L * 0.6, T], [-L * 0.6, T]], { fill: 'solid' }); break
        default: body = polygon([[-L, -T], [L, -T * 0.7], [L, T * 0.7], [-L, T]], { fill: 'solid' })
      }
      const hl = Math.min(r.num(0.2, 0.3) * L, T - 3)
      const hw = Math.max(2.2, hl / r.num(2.5, 3.2))
      const slit = r.pick([
        () => ellipse(0, 0, hl, hw, { fill: 'hole' }),
        () => box(hl, hw, { fill: 'hole' }),
        () => polygon([[-hl, 0], [0, -hw], [hl, 0], [0, hw]], { fill: 'hole' }),
      ])()
      const across = rotate(slit, (side === 'left' ? 0 : 90) + r.num(-8, 8))
      const hole = placeInside(r, body, across, 3) ?? across
      const tilt = r.num(0, 360)
      return panel(placeGroup(r, [rotate(body, tilt), rotate(hole, tilt)]))
    },
    check(p) {
      const h = holeIn(p)
      if (!h) return null
      const a = principalAxis(outline(h.fig))
      const b = principalAxis(outline(h.hole))
      if (a.elongation > 0.65 || b.elongation > 0.55) return null
      const d = between(a.angle, b.angle)
      return d <= 22 ? true : d >= 68 ? false : null
    },
  },
  {
    id: 'bp036',
    number: 36,
    band: 1,
    // Left: the triangle is above the circle. Right: the circle is above the triangle.
    gen(r, side) {
      const tri = token(r, 'triangle', r.num(8, 11))
      const cir = token(r, 'circle', r.num(8, 11))
      const [top, bottom] = side === 'left' ? [tri, cir] : [cir, tri]
      const yTop = r.num(14, 46)
      const yBottom = r.num(yTop + 14, 86)
      return panel(r.shuffle([placeAt(top, r.num(14, 86), yTop), placeAt(bottom, r.num(14, 86), yBottom)]))
    },
    check(p) {
      return p.shapes.length === 2 ? triangleAbove(p) : null
    },
  },
  {
    id: 'bp037',
    number: 37,
    band: 2,
    // Left: the triangle is above the circle, wherever the square is. Right: the circle is above the triangle.
    gen(r, side) {
      const shapes = ['triangle', 'circle', 'square'].map(kind => token(r, kind, r.num(8, 11)))
      const placed = scatterWhere(r, shapes, 4, ([t, c]) => (side === 'left' ? c[1] - t[1] >= 12 : t[1] - c[1] >= 12))
      return panel(placed ? r.shuffle(placed) : [])
    },
    check(p) {
      const kinds = p.shapes.map(tokenKind).sort()
      return kinds.join() === 'circle,square,triangle' ? triangleAbove(p) : null
    },
  },
  {
    id: 'bp038',
    number: 38,
    band: 1,
    // Left: the triangle is bigger than the circle. Right: the circle is bigger than the triangle.
    gen(r, side) {
      const big = r.num(30, 48)
      const small = r.num(9, 16)
      const tri = figure(r, 'triangle', { size: side === 'left' ? big : small })
      const cir = circle(0, 0, (side === 'left' ? small : big) / 2)
      if (r.chance(0.35)) {
        // The small one inside the big one, as Bongard often nests them.
        const [outer, inner] = side === 'left' ? [tri, cir] : [cir, tri]
        const nested = placeInside(r, outer, inner, big / 4)
        if (nested) return panel(placeGroup(r, [outer, nested]))
      }
      return panel(placeApart(r, [tri, cir], 4))
    },
    check(p) {
      if (p.shapes.length !== 2 || p.shapes.some(s => s.fill !== 'none')) return null
      const tri = p.shapes.find(s => tokenKind(s) === 'triangle')
      const cir = p.shapes.find(s => tokenKind(s) === 'circle')
      if (!tri || !cir || overlap(tri, cir).kind === 'partial') return null
      const ratio = shapeSize(tri) / shapeSize(cir)
      return ratio >= 1.6 ? true : ratio <= 1 / 1.6 ? false : null
    },
  },
  {
    id: 'bp039',
    number: 39,
    band: 2,
    // Left: the three segments run about the same way. Right: they run at wide angles to each other.
    gen(r, side) {
      const base = r.num(0, 180)
      let angles
      if (side === 'left') angles = [0, 1, 2].map(() => base + r.num(-8, 8))
      else if (r.chance(0.4)) angles = [base, base + r.num(-5, 5), base + r.sign() * r.num(45, 90)]
      else angles = [base, base + r.num(35, 70), base - r.num(35, 70)]
      const segs = angles.map(a => rotate(segment(r.num(18, 34)), a))
      return panel(placeApart(r, segs, 3))
    },
    check(p) {
      if (p.shapes.length !== 3 || !p.shapes.every(isSegment)) return null
      const slopes = p.shapes.map(slope)
      let widest = 0
      for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) widest = Math.max(widest, between(slopes[i], slopes[j]))
      return widest <= 15 ? true : widest >= 30 ? false : null
    },
  },
  {
    id: 'bp040',
    number: 40,
    band: 2,
    // Left: three of the dots lie on one straight line. Right: no three dots do.
    gen(r, side) {
      const spots = side === 'left' ? spotsOnLine(r) ?? [] : []
      const total = r.int(4, 5)
      while (spots.length < total) {
        const q = spots.length < 2 ? [r.num(MARGIN + 3, BOX - MARGIN - 3), r.num(MARGIN + 3, BOX - MARGIN - 3)] : spotOffLines(r, spots)
        if (!q) break
        spots.push(q)
      }
      return panel(spots.map(([x, y]) => dot(x, y, 2.2)))
    },
    check(p) {
      return p.shapes.every(isDot) ? collinear(p.shapes.map(s => [s.cx, s.cy])) : null
    },
  },
]
