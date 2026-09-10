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
