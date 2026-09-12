/**
 * Bongard's original problems 41–50, on the same contract as 11–40: `check`
 * returns true for the left, false for the right, and null for a panel too
 * close to call.
 *
 * Rules follow M. M. Bongard (1967) as indexed by H. Foundalis; the figures
 * are our own.
 */
import {
  BOX, panel, polygon, curve, circle, ellipse, dot, outline, bbox, isClosed, panelBbox, shapeBbox, pointInPolygon,
  distToOutline, straightest, turns, overlap, translate, scale,
} from '../shapes.js'
import {
  figure, sized, placeRandom, placeAt, placeGroup, placeInside, scatterWhere, spotsOnLine, spotOffLines,
  fitter, arc, token, tokenKind, MARGIN,
} from '../gen.js'

const isDot = s => s.kind === 'circle' && s.fill === 'solid' && s.r <= 3
const isRing = s => s.kind === 'circle' && s.fill === 'none' && s.r <= 3.5
const isBlack = s => s.fill === 'solid'
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
const rad = a => (a * Math.PI) / 180
const inBox = ([x, y], pad = MARGIN) => x >= pad && x <= BOX - pad && y >= pad && y <= BOX - pad
const regular = (n, rad, deg) => Array.from({ length: n }, (_, i) => {
  const a = ((deg + (360 * i) / n) * Math.PI) / 180
  return [rad * Math.cos(a), rad * Math.sin(a)]
})
const box = (w, h, opts) => polygon([[-w, -h], [w, -h], [w, h], [-w, h]], opts)
const centre = s => {
  const b = shapeBbox(s)
  return [b.cx, b.cy]
}
/** Three of the spots on one line: true; none anywhere near one: false. */
const collinear = spots => (spots.length < 3 ? null : straightest(spots) <= 1.2 ? true : straightest(spots) >= 4.5 ? false : null)
/** Mean distance between pairs of spots: small for a huddle, large for a spread. */
const meanGap = spots => {
  let sum = 0
  let n = 0
  for (let i = 0; i < spots.length; i++) {
    for (let j = i + 1; j < spots.length; j++) {
      sum += dist(spots[i], spots[j])
      n++
    }
  }
  return n ? sum / n : 0
}

/* ── BP42, BP49: dots in and around a figure ── */

const OUTLINE_KINDS = ['circle', 'ellipse', 'triangle', 'quad', 'rect', 'polygon', 'blob']

/** The one closed outline figure of a panel and the dots sorted by side of it, or null when a dot sits on the line. */
function figureAndDots(p) {
  const dots = p.shapes.filter(isDot)
  const figs = p.shapes.filter(s => !isDot(s))
  if (figs.length !== 1 || !isClosed(figs[0]) || figs[0].fill !== 'none') return null
  const pts = outline(figs[0])
  const inside = []
  const outside = []
  for (const d of dots) {
    const q = [d.cx, d.cy]
    if (distToOutline(q, pts) < d.r + 1.5) return null
    ;(pointInPolygon(q, pts) ? inside : outside).push(q)
  }
  return { fig: figs[0], pts, inside, outside }
}

/** Random spots that satisfy `ok`, each at least `gap` from the others; as many as could be found. */
function spots(r, count, ok, gap, area, tries = 200) {
  const out = []
  for (let t = 0; t < tries && out.length < count; t++) {
    const q = [r.num(area.x, area.x + area.w), r.num(area.y, area.y + area.h)]
    if (ok(q) && out.every(s => dist(s, q) >= gap)) out.push(q)
  }
  return out
}

/** `count` spots huddled within `radius` of one spot that itself satisfies `ok` with room to spare. */
function huddle(r, count, ok, radius, area) {
  const roomy = q => ok(q) && Array.from({ length: 8 }, (_, i) => [q[0] + radius * Math.cos((Math.PI * i) / 4), q[1] + radius * Math.sin((Math.PI * i) / 4)]).every(ok)
  const [c] = spots(r, 1, roomy, 0, area, 300)
  if (!c) return []
  return spots(r, count, ok, 4, { x: c[0] - radius, y: c[1] - radius, w: 2 * radius, h: 2 * radius })
}

const WHOLE = { x: MARGIN + 3, y: MARGIN + 3, w: BOX - 2 * MARGIN - 6, h: BOX - 2 * MARGIN - 6 }

/* ── BP43: waves ── */

function wave(r, a0, a1) {
  const x0 = 12
  const x1 = 88
  const y0 = r.num(38, 62)
  const cap = Math.min(28, y0 - MARGIN - 1, BOX - MARGIN - 1 - y0)
  const amp = u => Math.min(cap, a0 + (a1 - a0) * u)
  const n = r.int(4, 6)
  const at = u => x0 + (x1 - x0) * u
  switch (r.pick(['sine', 'zigzag', 'square', 'spikes'])) {
    case 'sine': {
      const m = n * 8
      return curve(Array.from({ length: m + 1 }, (_, i) => [at(i / m), y0 - amp(i / m) * Math.sin(2 * Math.PI * n * (i / m))]), { closed: false })
    }
    case 'zigzag': {
      const m = 2 * n
      return polygon(Array.from({ length: m + 1 }, (_, i) => [at(i / m), y0 + (i % 2 ? -1 : 1) * amp(i / m)]), { closed: false })
    }
    case 'square': {
      const m = 2 * n
      const pts = []
      for (let i = 0; i < m; i++) {
        const sgn = i % 2 ? 1 : -1
        pts.push([at(i / m), y0 + sgn * amp(i / m)], [at((i + 1) / m), y0 + sgn * amp((i + 1) / m)])
      }
      return polygon(pts, { closed: false })
    }
    default: {
      const pts = [[at(0), y0]]
      for (let i = 0; i < n; i++) {
        const u = (i + 0.5) / n
        pts.push([at(u), y0 - amp(u)], [at((i + 1) / n), y0])
      }
      return polygon(pts, { closed: false })
    }
  }
}

/* ── BP44: bumps ── */

/** A chain of arcs that meet at cusps, like an m, and the arcs' geometry. */
function bumps(r, n) {
  const arcs = []
  const pts = []
  let P = [0, 0]
  for (let i = 0; i < n; i++) {
    const R = r.num(10, 17)
    const s = r.num(190, 215)
    const e = r.num(325, 350)
    const c = [P[0] - R * Math.cos(rad(s)), P[1] - R * Math.sin(rad(s))]
    const a = arc(c[0], c[1], R, s, e, 6)
    pts.push(...(i ? a.slice(1) : a))
    arcs.push({ c, R, s, e })
    P = a.at(-1)
  }
  return { pts, arcs }
}

const onArc = ({ c, R, s, e }, u) => [c[0] + R * Math.cos(rad(s + (e - s) * u)), c[1] + R * Math.sin(rad(s + (e - s) * u))]

/* ── BP45, BP46: one figure on top of another ── */

/** `top` shifted so it lies partly over `bottom`, both placed together. */
function stacked(r, bottom, top) {
  const b1 = shapeBbox(bottom)
  const b2 = shapeBbox(top)
  const d = r.num(0.4, 0.7) * (Math.max(b1.w, b1.h) + Math.max(b2.w, b2.h)) / 2
  const t = rad(r.num(0, 360))
  return placeGroup(r, [bottom, translate(top, d * Math.cos(t), d * Math.sin(t))])
}

/** The two figures of a panel, bottom first, when they clearly overlap in part. */
function stack(p) {
  if (p.shapes.length !== 2 || !p.shapes.every(isClosed)) return null
  const [bottom, top] = p.shapes
  const o = overlap(bottom, top)
  return o.kind === 'partial' && o.a >= 0.1 && o.b >= 0.1 ? { bottom, top } : null
}

/* ── BP50: mirror symmetry ── */

/** Rows of tokens mirrored about x = 0: a pair each side or one on the axis. */
function mirroredRows(r) {
  const n = r.int(2, 3)
  const ys = r.shuffle([-22, 0, 22]).slice(0, n)
  return ys.map(y => {
    const kind = r.pick(['circle', 'triangle', 'square'])
    const fill = r.chance(0.4) ? 'solid' : 'none'
    const size = r.num(8, 11)
    if (r.chance(0.35)) {
      const wide = r.chance(0.4)
      return { y, size, fill, pair: false, kind: wide ? 'bar' : kind, dx: 0 }
    }
    return { y, size, fill, pair: true, kind, dx: r.num(12, 22) }
  })
}

function rowsToShapes(r, rows) {
  return rows.flatMap(row => {
    if (row.kind === 'bar') return [translate(box(r.num(12, 18), 3, { fill: row.fill }), 0, row.y)]
    const t = token(r, row.kind, row.size, row.fill)
    if (!row.pair) return [translate(t, 0, row.y)]
    return [translate(t, -row.dx, row.y), translate(t, row.dx, row.y)]
  })
}

/** A trunk with branch pairs, mirrored unless `lopsided`. */
function tree(r, lopsided) {
  const H = 24
  const shapes = [polygon([[0, -H], [0, H]], { closed: false })]
  const levels = r.int(2, 3)
  for (let i = 0; i < levels; i++) {
    const y = -H + 8 + (i * (2 * H - 12)) / levels
    const len = r.num(8, 14)
    const up = r.num(6, 11)
    shapes.push(polygon([[0, y], [-len, y - up]], { closed: false }))
    const dy = lopsided && i === levels - 1 ? r.num(9, 14) * r.sign() : 0
    shapes.push(polygon([[0, y + dy], [len, y + dy - up]], { closed: false }))
  }
  if (lopsided && r.chance(0.5)) shapes.push(polygon([[0, r.num(-4, 10)], [r.sign() * r.num(8, 14), r.num(-14, -6)]], { closed: false }))
  return shapes
}

function symmetricFigure(r) {
  switch (r.pick(['isoceles', 'lozenge', 'house', 'ellipse', 'regular', 'trapezoid', 'cross', 'arrow'])) {
    case 'isoceles': {
      const w = r.num(10, 20)
      const f = r.sign()
      return polygon([[0, -20 * f], [w, 20 * f], [-w, 20 * f]])
    }
    case 'lozenge': {
      const w = r.num(8, 16)
      return polygon([[0, -20], [w, 0], [0, 20], [-w, 0]])
    }
    case 'house': {
      const w = r.num(10, 16)
      const h = r.num(8, 14)
      return polygon([[-w, h], [-w, -h], [0, -h - r.num(7, 12)], [w, -h], [w, h]])
    }
    case 'ellipse': return r.chance(0.5) ? ellipse(0, 0, 20, r.num(9, 15)) : ellipse(0, 0, r.num(9, 15), 20)
    case 'regular': return polygon(regular(r.int(3, 7), 20, r.pick([-90, 90])))
    case 'trapezoid': {
      const a = r.num(8, 12)
      const b = r.num(16, 20)
      return polygon([[-a, -12], [a, -12], [b, 12], [-b, 12]])
    }
    case 'cross': {
      const t = r.num(4, 7)
      return polygon([[-t, -20], [t, -20], [t, -t], [20, -t], [20, t], [t, t], [t, 20], [-t, 20], [-t, t], [-20, t], [-20, -t], [-t, -t]])
    }
    default: {
      const w = r.num(12, 18)
      const s = r.num(4, 7)
      return polygon([[0, -20], [w, 0], [s, 0], [s, 20], [-s, 20], [-s, 0], [-w, 0]])
    }
  }
}

function lopsidedFigure(r) {
  switch (r.pick(['parallelogram', 'scalene', 'flag', 'ell', 'turned', 'blob', 'leanHouse'])) {
    case 'parallelogram': {
      const s = r.num(7, 12) * r.sign()
      const w = r.num(10, 14)
      return polygon([[-w + s, -14], [w + s, -14], [w - s, 14], [-w - s, 14]])
    }
    case 'scalene': return polygon([[-20, 14], [r.num(4, 14), 14], [r.num(-14, -4) + r.num(8, 12) * r.sign(), -16]])
    case 'flag': {
      const W = r.num(14, 20)
      const H = r.num(9, 14)
      return polygon([[-W, -H], [W, -H], [W - r.num(0.5, 0.9) * H, 0], [W, H], [-W, H]])
    }
    case 'ell': {
      const t = r.num(8, 12)
      const a = r.num(24, 34)
      const b = r.num(18, 28)
      return polygon([[0, 0], [t, 0], [t, a - t], [b, a - t], [b, a], [0, a]])
    }
    case 'turned': {
      const n = r.int(3, 6)
      return polygon(regular(n, 20, -90 + r.num(12, 180 / n - 12)))
    }
    case 'blob': return figure(r, r.pick(['blob', 'concaveBlob', 'concave']))
    default: {
      const w = r.num(10, 16)
      const h = r.num(8, 14)
      return polygon([[-w, h], [-w, -h], [r.num(-0.7, -0.3) * w, -h - r.num(7, 12)], [w, -h], [w, h]])
    }
  }
}

/** The rows with one thing changed on one side, so the mirror no longer holds. */
function breakRows(r, rows) {
  const out = rows.map(row => ({ ...row }))
  const pairs = out.filter(row => row.pair)
  const row = pairs.length ? r.pick(pairs) : r.pick(out)
  if (!row.pair) {
    row.pair = true
    row.dx = r.num(12, 22)
    row.kind = row.kind === 'bar' ? 'square' : row.kind
    row.oddSide = r.pick(['kind', 'fill', 'shift'])
  } else row.oddSide = r.pick(['kind', 'fill', 'shift', 'drop'])
  return out
}

function brokenRowsToShapes(r, rows) {
  return rows.flatMap(row => {
    if (!row.oddSide) return rowsToShapes(r, [row])
    const t = token(r, row.kind, row.size, row.fill)
    const left = translate(t, -row.dx, row.y)
    switch (row.oddSide) {
      case 'kind': return [left, translate(token(r, r.pick(['circle', 'triangle', 'square'].filter(k => k !== row.kind)), row.size, row.fill), row.dx, row.y)]
      case 'fill': return [left, translate({ ...t, fill: row.fill === 'solid' ? 'none' : 'solid' }, row.dx, row.y)]
      case 'drop': return [left]
      default: return [left, translate(t, row.dx + r.num(6, 10) * r.sign(), row.y + r.num(9, 13) * r.sign())]
    }
  })
}

/** Rows with tokens too close together or too close to the edge, redrawn by the caller. */
const rowsFit = shapes => {
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      const a = shapeBbox(shapes[i])
      const b = shapeBbox(shapes[j])
      if (Math.abs(a.cx - b.cx) < (a.w + b.w) / 2 + 3 && Math.abs(a.cy - b.cy) < (a.h + b.h) / 2 + 3) return false
    }
  }
  return true
}

export const problems = [
  {
    id: 'bp041',
    number: 41,
    band: 3,
    // Left: the white circles lie on one straight line. Right: they do not, whatever the black dots do.
    gen(r, side) {
      const white = side === 'left' ? spotsOnLine(r) ?? [] : []
      while (white.length < 3) {
        const q = white.length < 2 ? [r.num(MARGIN + 3, BOX - MARGIN - 3), r.num(MARGIN + 3, BOX - MARGIN - 3)] : spotOffLines(r, white)
        if (!q) break
        white.push(q)
      }
      // Black dots go where they like; on the right they sometimes line up themselves, as a decoy.
      const black = side === 'right' && r.chance(0.4) ? spotsOnLine(r) ?? [] : []
      while (black.length < r.int(3, 4)) {
        const q = spotOffLines(r, [...white, ...black], 3, 8)
        if (!q) break
        black.push(q)
      }
      return panel(r.shuffle([...white.map(([x, y]) => circle(x, y, 2.6)), ...black.map(([x, y]) => dot(x, y, 2.4))]))
    },
    check(p) {
      const rings = p.shapes.filter(isRing)
      if (rings.length !== 3 || !p.shapes.every(s => isRing(s) || isDot(s))) return null
      return collinear(rings.map(s => [s.cx, s.cy]))
    },
  },
  {
    id: 'bp042',
    number: 42,
    band: 3,
    // Left: the dots inside the figure lie on one straight line. Right: they do not.
    gen(r, side) {
      const fig = placeRandom(r, figure(r, r.pick(OUTLINE_KINDS), { size: r.num(44, 64) }))
      const pts = outline(fig)
      const b = bbox(pts)
      const inside = q => pointInPolygon(q, pts) && distToOutline(q, pts) >= 4.5
      let dots = []
      for (let tries = 0; tries < 60 && dots.length < 3; tries++) {
        const a = [r.num(b.x, b.x + b.w), r.num(b.y, b.y + b.h)]
        const c = [r.num(b.x, b.x + b.w), r.num(b.y, b.y + b.h)]
        if (!inside(a) || !inside(c) || dist(a, c) < 16) continue
        if (side === 'left') {
          const t = r.num(0.3, 0.7)
          const m = [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t]
          if (inside(m)) dots = [a, m, c]
        } else {
          const m = spots(r, 1, q => inside(q) && dist(q, a) >= 7 && dist(q, c) >= 7 && straightest([a, q, c]) >= 5, 0, b, 40)[0]
          if (m) dots = [a, m, c]
        }
      }
      const outside = spots(r, r.int(1, 2), q => !pointInPolygon(q, pts) && distToOutline(q, pts) >= 5, 8, WHOLE, 80)
      return panel([fig, ...[...dots, ...outside].map(([x, y]) => dot(x, y, 2.2))])
    },
    check(p) {
      const f = figureAndDots(p)
      return f && f.inside.length === 3 ? collinear(f.inside) : null
    },
  },
  {
    id: 'bp043',
    number: 43,
    band: 2,
    // Left: the wave grows from left to right. Right: it shrinks from left to right.
    gen(r, side) {
      const [a0, a1] = [r.num(2, 4), r.num(18, 28)]
      return panel([side === 'left' ? wave(r, a0, a1) : wave(r, a1, a0)])
    },
    check(p) {
      const s = p.shapes.length === 1 ? p.shapes[0] : null
      if (!s || isClosed(s)) return null
      const pts = outline(s)
      const b = bbox(pts)
      const span = part => {
        const ys = part.map(q => q[1])
        return ys.length ? Math.max(...ys) - Math.min(...ys) : 0
      }
      const left = span(pts.filter(q => q[0] <= b.x + b.w / 4))
      const right = span(pts.filter(q => q[0] >= b.x + (3 * b.w) / 4))
      if (!left || !right) return null
      const ratio = right / left
      return ratio >= 1.6 ? true : ratio <= 1 / 1.6 ? false : null
    },
  },
  {
    id: 'bp044',
    number: 44,
    band: 3,
    // Left: the two small circles sit on different arcs of the line. Right: both sit on the same arc.
    gen(r, side) {
      const n = r.int(2, 3)
      const { pts, arcs } = bumps(r, n)
      let marks
      if (side === 'left') {
        const [i, j] = r.shuffle([...arcs.keys()]).slice(0, 2)
        marks = [onArc(arcs[i], r.num(0.25, 0.75)), onArc(arcs[j], r.num(0.25, 0.75))]
      } else {
        const a = r.pick(arcs)
        marks = [onArc(a, r.num(0.15, 0.4)), onArc(a, r.num(0.6, 0.85))]
      }
      const t = fitter(pts, r.num(n === 2 ? 44 : 56, 72), r.num(-35, 35))
      return panel(placeGroup(r, [polygon(pts.map(t), { closed: false }), ...marks.map(m => circle(...t(m), 2.6))]))
    },
    check(p) {
      const rings = p.shapes.filter(isRing)
      const lines = p.shapes.filter(s => !isRing(s))
      if (rings.length !== 2 || lines.length !== 1 || isClosed(lines[0])) return null
      const pts = outline(lines[0])
      // Cusps split the line into arcs; each ring belongs to the arc of its nearest vertex.
      const cusps = []
      turns(pts, false).forEach((t, i) => Math.abs(t) >= 60 && cusps.push(i + 1))
      if (!cusps.length) return null
      const arcOf = ring => {
        let best = 0
        let bestD = Infinity
        pts.forEach((q, i) => {
          const d = dist(q, [ring.cx, ring.cy])
          if (d < bestD) [best, bestD] = [i, d]
        })
        if (bestD > 2 || cusps.some(c => Math.abs(c - best) <= 2)) return null
        return cusps.filter(c => c < best).length
      }
      const [a, b] = rings.map(arcOf)
      return a === null || b === null ? null : a !== b
    },
  },
  {
    id: 'bp045',
    number: 45,
    band: 2,
    // Left: the outline figure lies on top of the black one. Right: the black figure lies on top of the outline one.
    gen(r, side) {
      const [a, b] = [0, 1].map(() => figure(r, r.pick(OUTLINE_KINDS), { size: r.num(24, 40) }))
      const [bottom, top] = side === 'left' ? [{ ...a, fill: 'solid' }, { ...b, fill: 'paper' }] : [{ ...a, fill: 'none' }, { ...b, fill: 'solid' }]
      return panel(stacked(r, bottom, top))
    },
    check(p) {
      const s = stack(p)
      if (!s) return null
      if (s.bottom.fill === 'solid' && s.top.fill === 'paper') return true
      if (s.bottom.fill === 'none' && s.top.fill === 'solid') return false
      return null
    },
  },
  {
    id: 'bp046',
    number: 46,
    band: 2,
    // Left: the triangle lies on top of the circle. Right: the circle lies on top of the triangle.
    gen(r, side) {
      const tri = figure(r, 'triangle', { size: r.num(24, 40) })
      const cir = circle(0, 0, r.num(11, 19))
      const [bottom, top] = side === 'left' ? [cir, tri] : [tri, cir]
      const bottomFill = r.chance(0.5) ? 'solid' : 'none'
      const topFill = bottomFill === 'solid' || r.chance(0.6) ? 'paper' : 'solid'
      return panel(stacked(r, { ...bottom, fill: bottomFill }, { ...top, fill: topFill }))
    },
    check(p) {
      const s = stack(p)
      if (!s) return null
      const kinds = [tokenKind(s.bottom), tokenKind(s.top)]
      if (kinds.join() === 'circle,triangle') return true
      if (kinds.join() === 'triangle,circle') return false
      return null
    },
  },
  {
    id: 'bp047',
    number: 47,
    band: 2,
    // Left: a triangle inside the circle. Right: a circle inside the triangle.
    gen(r, side) {
      const big = r.num(32, 48)
      const outer = side === 'left' ? circle(0, 0, big / 2) : figure(r, 'triangle', { size: big })
      let nested = null
      for (let small = r.num(9, 13); small >= 6 && !nested; small -= 1.5) {
        const inner = side === 'left' ? figure(r, 'triangle', { size: small }) : circle(0, 0, small / 2)
        nested = placeInside(r, outer, inner, big / 4)
      }
      const pair = placeGroup(r, nested ? [outer, nested] : [outer])
      const b = bbox(pair.flatMap(s => outline(s)))
      const keep = [[b.cx, b.cy, Math.hypot(b.w, b.h) / 2]]
      const extras = []
      for (let i = r.int(0, 3); i > 0; i--) {
        const size = r.num(7, 11)
        const t = token(r, r.pick(['circle', 'triangle']), size)
        for (let tries = 0; tries < 30; tries++) {
          const q = [r.num(MARGIN + size, BOX - MARGIN - size), r.num(MARGIN + size, BOX - MARGIN - size)]
          if (keep.every(([x, y, rad]) => dist(q, [x, y]) >= rad + size / 2 + 4)) {
            keep.push([q[0], q[1], size / 2])
            extras.push(placeAt(t, ...q))
            break
          }
        }
      }
      return panel([...pair, ...extras])
    },
    check(p) {
      if (!p.shapes.every(s => isClosed(s) && s.fill === 'none')) return null
      const nests = []
      for (let i = 0; i < p.shapes.length; i++) {
        for (let j = 0; j < p.shapes.length; j++) {
          if (i === j) continue
          const o = overlap(p.shapes[i], p.shapes[j])
          if (o.kind === 'partial') return null
          if (o.kind === 'contains') nests.push([tokenKind(p.shapes[i]), tokenKind(p.shapes[j])])
        }
      }
      if (nests.length !== 1) return null
      const [outer, inner] = nests[0]
      return outer === 'circle' && inner === 'triangle' ? true : outer === 'triangle' && inner === 'circle' ? false : null
    },
  },
  {
    id: 'bp048',
    number: 48,
    band: 2,
    // Left: every black figure is above every white one. Right: every white figure is above every black one.
    gen(r, side) {
      const items = [
        ...Array.from({ length: r.int(1, 3) }, () => 'solid'),
        ...Array.from({ length: r.int(1, 3) }, () => 'none'),
      ]
      const shapes = items.map(fill => token(r, r.pick(['circle', 'triangle', 'square']), r.num(8, 11), fill))
      const upper = side === 'left' ? 'solid' : 'none'
      const placed = scatterWhere(r, shapes, 4, centres => {
        const ys = fill => centres.filter((_, i) => items[i] === fill).map(c => c[1])
        return Math.max(...ys(upper)) < Math.min(...ys(upper === 'solid' ? 'none' : 'solid')) - 10
      })
      return panel(placed ?? [])
    },
    check(p) {
      const blacks = p.shapes.filter(isBlack).map(s => centre(s)[1])
      const whites = p.shapes.filter(s => !isBlack(s)).map(s => centre(s)[1])
      if (!blacks.length || !whites.length) return null
      if (Math.max(...blacks) < Math.min(...whites) - 5) return true
      if (Math.max(...whites) < Math.min(...blacks) - 5) return false
      return null
    },
  },
  {
    id: 'bp049',
    number: 49,
    band: 3,
    // Left: the dots inside the figure huddle together while those outside are spread out. Right: the other way round.
    gen(r, side) {
      const size = r.num(40, 58)
      const fig = placeRandom(r, figure(r, r.pick(OUTLINE_KINDS), { size }))
      const pts = outline(fig)
      const b = bbox(pts)
      const inside = q => pointInPolygon(q, pts) && distToOutline(q, pts) >= 4
      const outside = q => inBox(q, MARGIN + 3) && !pointInPolygon(q, pts) && distToOutline(q, pts) >= 4
      const [ins, outs] = side === 'left'
        ? [huddle(r, 3, inside, r.num(5, 7), b), spots(r, 3, outside, 26, WHOLE)]
        : [spots(r, 3, inside, size * 0.32, b), huddle(r, 3, outside, r.num(5, 7), WHOLE)]
      return panel([fig, ...[...ins, ...outs].map(([x, y]) => dot(x, y, 2.2))])
    },
    check(p) {
      const f = figureAndDots(p)
      if (!f || f.inside.length < 2 || f.outside.length < 2) return null
      const ratio = meanGap(f.outside) / meanGap(f.inside)
      return ratio >= 1.8 ? true : ratio <= 1 / 1.8 ? false : null
    },
  },
  {
    id: 'bp050',
    number: 50,
    band: 2,
    // Left: the drawing has a vertical axis of symmetry. Right: it has none.
    gen(r, side) {
      let shapes
      switch (r.pick(['figure', 'figure', 'rows', 'rows', 'tree'])) {
        case 'figure': {
          const s = side === 'left' ? symmetricFigure(r) : lopsidedFigure(r)
          return panel([placeRandom(r, sized(s, r.num(30, 60)))])
        }
        case 'rows': {
          const rows = mirroredRows(r)
          for (let tries = 0; tries < 20; tries++) {
            shapes = side === 'left' ? rowsToShapes(r, rows) : brokenRowsToShapes(r, breakRows(r, rows))
            if (rowsFit(shapes)) break
          }
          break
        }
        default: shapes = tree(r, side === 'right')
      }
      // Built about the origin, so one scale about the origin keeps the mirror.
      const b = bbox(shapes.flatMap(s => outline(s)))
      const k = Math.min(r.num(1, 1.5), (BOX - 2 * MARGIN - 2) / Math.max(b.w, b.h))
      return panel(placeGroup(r, shapes.map(s => scale(s, k))))
    },
    check(p) {
      if (!p.shapes.length) return null
      const ax = panelBbox(p).cx
      let worst = 0
      for (const s of p.shapes) {
        const same = p.shapes.filter(t => t.fill === s.fill && isClosed(t) === isClosed(s)).map(t => [outline(t), isClosed(t)])
        for (const [x, y] of outline(s)) {
          const m = [2 * ax - x, y]
          worst = Math.max(worst, Math.min(...same.map(([pts, closed]) => distToOutline(m, pts, closed))))
        }
      }
      return worst <= 1.2 ? true : worst >= 4 ? false : null
    },
  },
]
