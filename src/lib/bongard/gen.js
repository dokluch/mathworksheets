/**
 * Building blocks the problem generators share: random figures built around
 * the origin, then sized and dropped into the box.
 *
 * Everything takes the helper bundle from rngHelpers() as `r`, never
 * Math.random directly, so a test can replay a problem from a seed.
 */
import {
  BOX, polygon, curve, circle, ellipse, outline, bbox, convexity, translate, scale, rotate,
} from './shapes.js'

const TAU = Math.PI * 2

/** Keeps every figure clear of the panel frame. */
export const MARGIN = 8

/**
 * Points at jittered, evenly spread angles around the origin with random
 * radii. Sorted by angle around a centre they never cross, so the polygon is
 * simple whatever the radii do.
 */
export function starPoints(r, n, rmin, rmax, radii = null) {
  const base = r.num(0, TAU)
  const spacing = TAU / n
  return Array.from({ length: n }, (_, i) => {
    const a = base + i * spacing + r.num(-0.3, 0.3) * spacing
    const rad = radii ? radii[i] : r.num(rmin, rmax)
    return [Math.cos(a) * rad, Math.sin(a) * rad]
  })
}

/**
 * Star points with `dents` vertices pulled in towards the centre and their
 * neighbours pinched in around them, so the dent is a real notch whatever
 * the vertex count: a pulled-in vertex between two far-apart neighbours is
 * still on the hull, and the four-sided case is exactly that.
 */
export function dentedStar(r, n, radius, dents) {
  const base = r.num(0, TAU)
  const spacing = TAU / n
  const angles = Array.from({ length: n }, (_, i) => base + i * spacing + r.num(-0.15, 0.15) * spacing)
  const radii = Array.from({ length: n }, () => r.num(radius * 0.8, radius))
  const stride = Math.floor(n / dents)
  const start = r.int(0, n - 1)
  for (let k = 0; k < dents; k++) {
    const i = (start + k * stride) % n
    radii[i] = r.num(radius * 0.25, radius * 0.4)
    const pinch = r.num(0.35, 0.5) * spacing
    angles[(i - 1 + n) % n] = angles[i] - pinch
    angles[(i + 1) % n] = angles[i] + pinch
  }
  return angles.map((a, i) => [Math.cos(a) * radii[i], Math.sin(a) * radii[i]])
}

/** A random simple polygon with exactly `n` vertices, convex or clearly not. */
export function randomPolygon(r, n, { convex = true, radius = 20 } = {}) {
  let pts = null
  for (let tries = 0; tries < 80; tries++) {
    if (convex) {
      pts = starPoints(r, n, radius * 0.65, radius)
      if (n === 3 || convexity(pts) >= 0.995) return pts
    } else {
      pts = dentedStar(r, n, radius, Math.max(1, Math.round(n / 4)))
      if (convexity(pts) <= 0.85) return pts
    }
  }
  return pts
}

/** A smooth blob: a closed spline through star points. */
export function randomBlob(r, { convex = true, radius = 20 } = {}) {
  let pts = null
  for (let tries = 0; tries < 80; tries++) {
    const n = r.int(6, 8)
    if (convex) {
      pts = starPoints(r, n, radius * 0.82, radius)
      if (convexity(outline(curve(pts))) >= 0.985) return pts
    } else {
      pts = dentedStar(r, n, radius, r.int(1, 2))
      if (convexity(outline(curve(pts))) <= 0.85) return pts
    }
  }
  return pts
}

/** A meandering open line, like a scribble that never crosses itself badly. */
export function squiggle(r, { length = 40, amp = 8, n = 6 } = {}) {
  const step = length / (n - 1)
  const pts = Array.from({ length: n }, (_, i) => [-length / 2 + i * step, r.num(-amp, amp)])
  return rotate(curve(pts, { closed: false }), r.num(0, 180))
}

export const CONVEX_KINDS = ['triangle', 'quad', 'rect', 'polygon', 'circle', 'ellipse', 'blob']
export const CONCAVE_KINDS = ['concave', 'concaveBlob']
export const STRAIGHT_KINDS = ['triangle', 'quad', 'rect', 'polygon', 'concave']
export const CURVED_KINDS = ['circle', 'ellipse', 'blob', 'concaveBlob']
export const ALL_KINDS = [...CONVEX_KINDS, ...CONCAVE_KINDS]

/** One figure of the named kind, centred on the origin at the given size. */
export function figure(r, kind, { fill = 'none', size = 30 } = {}) {
  let s
  switch (kind) {
    case 'triangle': s = polygon(randomPolygon(r, 3), { fill }); break
    case 'quad': s = polygon(randomPolygon(r, 4), { fill }); break
    case 'rect': {
      const w = r.num(10, 20)
      const h = r.num(6, 20)
      s = rotate(polygon([[-w, -h], [w, -h], [w, h], [-w, h]], { fill }), r.num(0, 180))
      break
    }
    case 'polygon': s = polygon(randomPolygon(r, r.int(5, 7)), { fill }); break
    case 'circle': s = circle(0, 0, 20, { fill }); break
    case 'ellipse': s = ellipse(0, 0, 20, r.num(8, 14), { fill, rotate: r.num(0, 180) }); break
    case 'blob': s = curve(randomBlob(r), { fill }); break
    case 'concave': s = polygon(randomPolygon(r, r.int(4, 7), { convex: false }), { fill }); break
    case 'concaveBlob': s = curve(randomBlob(r, { convex: false }), { fill }); break
    default: throw new Error(`unknown figure kind ${kind}`)
  }
  return sized(s, size)
}

/** Scales a shape so its longest side is `size`, and centres it on the origin. */
export function sized(shape, size) {
  const b = bbox(outline(shape))
  const k = size / Math.max(b.w, b.h)
  const scaled = scale(shape, k)
  const c = bbox(outline(scaled))
  return translate(scaled, -c.cx, -c.cy)
}

/**
 * Drops an origin-centred shape at a random spot inside the box.
 * `region` limits where its centre may land: 'any', or the 'left'/'right'
 * half, each kept clear of the middle so the placement reads at a glance.
 */
export function placeRandom(r, shape, region = 'any') {
  const b = bbox(outline(shape))
  const lo = MARGIN + b.w / 2
  const hi = BOX - MARGIN - b.w / 2
  let x0 = lo
  let x1 = hi
  if (region === 'left') x1 = Math.min(hi, 40 - b.w / 2)
  if (region === 'right') x0 = Math.max(lo, 60 + b.w / 2)
  const cx = x1 > x0 ? r.num(x0, x1) : (x0 + x1) / 2
  const cy = hi > lo ? r.num(MARGIN + b.h / 2, BOX - MARGIN - b.h / 2) : BOX / 2
  return translate(shape, cx, cy)
}

/** Moves an origin-centred shape so its centre lands on (x, y). */
export const placeAt = (shape, x, y) => translate(shape, x, y)

/** Places several origin-centred shapes together, as one group, at random. */
export function placeGroup(r, shapes, region = 'any') {
  const b = bbox(shapes.flatMap(s => outline(s)))
  const w = b.w, h = b.h
  const lo = MARGIN + w / 2
  const hi = BOX - MARGIN - w / 2
  let x0 = lo
  let x1 = hi
  if (region === 'left') x1 = Math.min(hi, 40 - w / 2)
  if (region === 'right') x0 = Math.max(lo, 60 + w / 2)
  const cx = x1 > x0 ? r.num(x0, x1) : (x0 + x1) / 2
  const cy = hi > lo ? r.num(MARGIN + h / 2, BOX - MARGIN - h / 2) : BOX / 2
  return shapes.map(s => translate(s, cx - b.cx, cy - b.cy))
}

/** Picks a spot for a small shape that keeps clear of the ones already placed. */
export function scatter(r, count, size, minGap = 4) {
  const placed = []
  for (let i = 0; i < count; i++) {
    for (let tries = 0; tries < 40; tries++) {
      const x = r.num(MARGIN + size, BOX - MARGIN - size)
      const y = r.num(MARGIN + size, BOX - MARGIN - size)
      if (placed.every(([px, py]) => Math.hypot(px - x, py - y) >= 2 * size + minGap)) {
        placed.push([x, y])
        break
      }
    }
  }
  return placed
}

/**
 * A serrated outline in the proportions of Bongard's own drawings: teeth
 * about a fortieth of the figure high and a twentieth apart, so the edge
 * reads as a fine zigzag and the shape underneath stays plain to see. Sizes
 * below TEXTURED_MIN are left smooth, where even that would blur into a smudge.
 */
export const TEXTURED_MIN = 24
export const zigzag = (r, size) => ({
  amp: Math.min(1.6, Math.max(1, size * r.num(0.024, 0.03))),
  step: Math.min(3.2, Math.max(1.8, size * r.num(0.05, 0.06))),
})

/** Points on a circle from angle a0 to a1, in degrees either way round, at most `step` degrees apart. */
export function arc(cx, cy, rad, a0, a1, step = 6) {
  const n = Math.max(1, Math.ceil(Math.abs(a1 - a0) / step))
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)]
  })
}

/**
 * A transform for raw points: turn them by `deg` about the origin, scale so
 * their longest side is `size`, and centre them there. `size` may be a
 * function of the raw longest side, for figures whose proportions (a neck's
 * width, say) only read at about the scale they were built. Returned as a
 * function so marks that belong to a figure (dots on its outline) move with it.
 */
export function fitter(points, size, deg = 0) {
  const a = (deg * Math.PI) / 180
  const ca = Math.cos(a)
  const sa = Math.sin(a)
  const turn = ([x, y]) => [x * ca - y * sa, x * sa + y * ca]
  const b = bbox(points.map(turn))
  const raw = Math.max(b.w, b.h)
  const k = (typeof size === 'function' ? size(raw) : size) / raw
  return p => {
    const [x, y] = turn(p)
    return [(x - b.cx) * k, (y - b.cy) * k]
  }
}

/**
 * The outline of a band around an open centre line: `half` is its half-width,
 * a number or a function of the position 0–1 along the line, and the ends are
 * round or flat. The line must bend gently compared with the width.
 */
export function band(center, half, { caps = 'round' } = {}) {
  const n = center.length
  const hw = i => (typeof half === 'function' ? half(i / (n - 1)) : half)
  const dir = i => {
    const a = center[Math.max(0, i - 1)]
    const b = center[Math.min(n - 1, i + 1)]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    return [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
  }
  const side = sgn => center.map(([x, y], i) => {
    const [tx, ty] = dir(i)
    return [x - ty * hw(i) * sgn, y + tx * hw(i) * sgn]
  })
  // Round the end from one side to the other: forward past the last point, backward past the first.
  const cap = (i, f) => {
    if (caps !== 'round') return []
    const [x, y] = center[i]
    const [tx, ty] = dir(i)
    const h = hw(i) * f
    return Array.from({ length: 11 }, (_, k) => {
      const t = (Math.PI * (k + 1)) / 12
      return [x + h * (-ty * Math.cos(t) + tx * Math.sin(t)), y + h * (tx * Math.cos(t) + ty * Math.sin(t))]
    })
  }
  return [...side(1), ...cap(n - 1, 1), ...side(-1).reverse(), ...cap(0, -1)]
}

/**
 * A closed figure grown round a horizontal axis. Each part covers a stretch
 * [x0, x1] of the axis: a round part is an ellipse of half-height `h`, a
 * straight part runs from half-height `h0` to `h1`. Where parts overlap the
 * taller one shows, so two round lobes on a thin straight part make a
 * dumbbell. `top` and `bottom` stretch the two halves apart from each other.
 * Returns the outline and `at(x, side)`, the point of the outline above
 * (side -1) or below (side 1) a place on the axis.
 */
export function body(parts, { top = 1, bottom = 1 } = {}) {
  const heightAt = x => {
    let h = 0
    for (const p of parts) {
      if (x < p.x0 || x > p.x1) continue
      let ph
      if (p.round) {
        const a = (p.x1 - p.x0) / 2
        const u = (x - p.x0 - a) / a
        ph = p.h * Math.sqrt(Math.max(0, 1 - u * u))
      } else {
        ph = p.h0 + ((p.h1 - p.h0) * (x - p.x0)) / (p.x1 - p.x0 || 1)
      }
      h = Math.max(h, ph)
    }
    return h
  }
  const xs = new Set()
  for (const p of parts) {
    if (p.round) {
      const a = (p.x1 - p.x0) / 2
      for (let i = 0; i <= 36; i++) xs.add(p.x0 + a - a * Math.cos((Math.PI * i) / 36))
    } else {
      const n = Math.max(1, Math.ceil((p.x1 - p.x0) / 2))
      for (let i = 0; i <= n; i++) xs.add(p.x0 + ((p.x1 - p.x0) * i) / n)
    }
  }
  // Where a straight part of even height meets a round one, the corner lands exactly.
  for (const p of parts.filter(q => q.round)) {
    for (const q of parts.filter(q => !q.round && q.h0 === q.h1 && q.h0 < p.h)) {
      const a = (p.x1 - p.x0) / 2
      const u = a * Math.sqrt(1 - (q.h0 / p.h) ** 2)
      for (const x of [p.x0 + a - u, p.x0 + a + u]) if (x >= q.x0 && x <= q.x1) xs.add(x)
    }
  }
  const sorted = [...xs].sort((a, b) => a - b)
  const hs = sorted.map(heightAt)
  const pts = sorted.map((x, i) => [x, -hs[i] * top])
  for (let i = sorted.length - 1; i >= 0; i--) if (hs[i] > 1e-9) pts.push([sorted[i], hs[i] * bottom])
  return {
    points: dropStraight(pts),
    at: (x, side) => [x, heightAt(x) * (side < 0 ? -top : bottom)],
  }
}

/** Removes points that sit on a straight run, so a long flat side is one segment. */
function dropStraight(points) {
  const out = []
  const n = points.length
  for (let i = 0; i < n; i++) {
    const a = out.length ? out[out.length - 1] : points[n - 1]
    const b = points[i]
    const c = points[(i + 1) % n]
    const e1 = [b[0] - a[0], b[1] - a[1]]
    const e2 = [c[0] - b[0], c[1] - b[1]]
    const l1 = Math.hypot(...e1)
    const l2 = Math.hypot(...e2)
    if (l1 < 1e-6) continue
    if (l2 > 1e-6 && Math.abs(e1[0] * e2[1] - e1[1] * e2[0]) / (l1 * l2) < 1e-3 && e1[0] * e2[0] + e1[1] * e2[1] > 0) continue
    out.push(b)
  }
  return out
}

/**
 * A spiral from its centre outwards: control points of a smooth curve for
 * 'round', corners for 'square', 'triangle' and 'pentagon'. `inward` is 1
 * when the line, followed from its outer end in, turns clockwise on screen,
 * and -1 when it turns counterclockwise.
 */
export function spiralPoints(r, style, inward) {
  if (style === 'round') {
    const total = 360 * r.num(2, 3.25)
    const start = r.num(0, 360)
    const pts = []
    for (let a = 0; a <= total + 1e-9; a += 30) {
      const rad = 0.12 + (0.88 * a) / total
      const t = ((start - inward * a) * Math.PI) / 180
      pts.push([rad * Math.cos(t), rad * Math.sin(t)])
    }
    return pts
  }
  const sides = { square: 4, triangle: 3, pentagon: 5 }[style]
  const growth = { square: 0.5, triangle: 1, pentagon: 0.25 }[style]
  const steps = r.int(2 * sides, Math.min(3 * sides, 12))
  let heading = r.num(0, 360)
  let x = 0
  let y = 0
  const pts = [[0, 0]]
  for (let k = 0; k < steps; k++) {
    const t = (heading * Math.PI) / 180
    x += (1 + growth * k) * Math.cos(t)
    y += (1 + growth * k) * Math.sin(t)
    pts.push([x, y])
    heading -= (inward * 360) / sides
  }
  return pts
}

/**
 * Scatters origin-centred shapes over the box so none touch: every pair keeps
 * `gap` units between their bounding circles. A shape that finds no room is
 * left out; checkers count what was actually drawn.
 */
export function placeApart(r, shapes, gap = 5) {
  const placed = []
  const discs = []
  for (const s of shapes) {
    const b = bbox(outline(s))
    const rad = Math.hypot(b.w, b.h) / 2
    for (let tries = 0; tries < 60; tries++) {
      const x = r.num(MARGIN + b.w / 2, BOX - MARGIN - b.w / 2)
      const y = r.num(MARGIN + b.h / 2, BOX - MARGIN - b.h / 2)
      if (discs.every(([dx, dy, dr]) => Math.hypot(dx - x, dy - y) >= dr + rad + gap)) {
        discs.push([x, y, rad])
        placed.push(translate(s, x - b.cx, y - b.cy))
        break
      }
    }
  }
  return placed
}
