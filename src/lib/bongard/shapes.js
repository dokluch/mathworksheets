/**
 * Shape vocabulary for Bongard panels.
 *
 * A panel is a 100 × 100 box holding plain-data shapes. Generators build the
 * shapes, checkers measure them and render.jsx paints them; nothing here
 * touches the DOM, so every problem and its check runs in node.
 *
 * Every shape reduces to an outline — a list of points — through `outline()`,
 * and the geometry below (bounding box, area, convexity, point-in-polygon)
 * works on that list. A checker therefore measures what is actually drawn,
 * never a label the generator attached.
 */
export const BOX = 100

const TAU = Math.PI * 2
const round = n => Math.round(n * 100) / 100

/* ── Constructors ── */

export function polygon(points, opts = {}) {
  return { kind: 'polygon', points, closed: opts.closed ?? true, fill: opts.fill ?? 'none', jagged: opts.jagged ?? null }
}

/** Smooth closed or open curve through control points (Catmull-Rom). */
export function curve(points, opts = {}) {
  return { kind: 'curve', points, closed: opts.closed ?? true, fill: opts.fill ?? 'none', jagged: opts.jagged ?? null }
}

export function circle(cx, cy, r, opts = {}) {
  return { kind: 'circle', cx, cy, r, fill: opts.fill ?? 'none', jagged: opts.jagged ?? null }
}

export function ellipse(cx, cy, rx, ry, opts = {}) {
  return { kind: 'ellipse', cx, cy, rx, ry, rotate: opts.rotate ?? 0, fill: opts.fill ?? 'none', jagged: opts.jagged ?? null }
}

export const dot = (cx, cy, r = 2) => circle(cx, cy, r, { fill: 'solid' })

export const panel = (shapes = []) => ({ shapes })

export function isClosed(shape) {
  return shape.kind === 'circle' || shape.kind === 'ellipse' || shape.closed
}

/* ── Sampling ── */

/** Uniform Catmull-Rom spline through `points`, sampled to a polyline. */
export function catmullRom(points, closed, samples = 8) {
  const n = points.length
  if (n < 3) return points.map(p => p.slice())
  const at = i => points[closed ? ((i % n) + n) % n : Math.min(Math.max(i, 0), n - 1)]
  const out = []
  const segs = closed ? n : n - 1
  for (let i = 0; i < segs; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2)
    for (let s = 0; s < samples; s++) {
      const t = s / samples
      const t2 = t * t
      const t3 = t2 * t
      out.push([0, 1].map(k => 0.5 * (
        2 * p1[k]
        + (-p0[k] + p2[k]) * t
        + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2
        + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3
      )))
    }
  }
  if (!closed) out.push(points[n - 1].slice())
  return out
}

function arcPoints(cx, cy, rx, ry, rotate, n) {
  const a = (rotate * Math.PI) / 180
  const ca = Math.cos(a)
  const sa = Math.sin(a)
  return Array.from({ length: n }, (_, i) => {
    const t = (TAU * i) / n
    const x = rx * Math.cos(t)
    const y = ry * Math.sin(t)
    return [cx + x * ca - y * sa, cy + x * sa + y * ca]
  })
}

/** The drawn outline as points, before any zigzag texture is applied. */
export function outline(shape, samples = 8) {
  switch (shape.kind) {
    case 'polygon': return shape.points.map(p => p.slice())
    case 'curve': return catmullRom(shape.points, shape.closed, samples)
    case 'circle': return arcPoints(shape.cx, shape.cy, shape.r, shape.r, 0, 48)
    case 'ellipse': return arcPoints(shape.cx, shape.cy, shape.rx, shape.ry, shape.rotate, 48)
    default: throw new Error(`unknown shape kind ${shape.kind}`)
  }
}

/* ── Measures ── */

export function bbox(points) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const [x, y] of points) {
    if (x < x0) x0 = x
    if (y < y0) y0 = y
    if (x > x1) x1 = x
    if (y > y1) y1 = y
  }
  if (x0 === Infinity) return { x: 0, y: 0, w: 0, h: 0, cx: 0, cy: 0 }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 }
}

export const shapeBbox = shape => bbox(outline(shape))

export const panelBbox = p => bbox(p.shapes.flatMap(s => outline(s)))

/** Largest side of a shape's bounding box: its "size" in the everyday sense. */
export function shapeSize(shape) {
  const b = shapeBbox(shape)
  return Math.max(b.w, b.h)
}

/** Shoelace area of a closed polygon. */
export function area(points) {
  let a = 0
  for (let i = 0, n = points.length; i < n; i++) {
    const [x1, y1] = points[i]
    const [x2, y2] = points[(i + 1) % n]
    a += x1 * y2 - x2 * y1
  }
  return Math.abs(a) / 2
}

/** Andrew's monotone chain. */
export function convexHull(points) {
  const pts = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1])
  if (pts.length < 3) return pts
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lower = []
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop()
    lower.push(p)
  }
  const upper = []
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i]
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop()
    upper.push(p)
  }
  lower.pop()
  upper.pop()
  return lower.concat(upper)
}

/** 1 for a convex outline; the deeper the dent, the smaller the ratio. */
export function convexity(points) {
  const hull = area(convexHull(points))
  return hull > 0 ? area(points) / hull : 1
}

export function pointInPolygon([x, y], points) {
  let inside = false
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i]
    const [xj, yj] = points[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

/* ── Transforms (about the origin; shapes are built centred there, then placed) ── */

function mapPoints(shape, fn) {
  return { ...shape, points: shape.points.map(fn) }
}

export function translate(shape, dx, dy) {
  if (shape.kind === 'circle' || shape.kind === 'ellipse') return { ...shape, cx: shape.cx + dx, cy: shape.cy + dy }
  return mapPoints(shape, ([x, y]) => [x + dx, y + dy])
}

export function scale(shape, k) {
  if (shape.kind === 'circle') return { ...shape, cx: shape.cx * k, cy: shape.cy * k, r: shape.r * k }
  if (shape.kind === 'ellipse') return { ...shape, cx: shape.cx * k, cy: shape.cy * k, rx: shape.rx * k, ry: shape.ry * k }
  return mapPoints(shape, ([x, y]) => [x * k, y * k])
}

export function rotate(shape, deg) {
  const a = (deg * Math.PI) / 180
  const ca = Math.cos(a)
  const sa = Math.sin(a)
  const rot = ([x, y]) => [x * ca - y * sa, x * sa + y * ca]
  if (shape.kind === 'circle') {
    const [cx, cy] = rot([shape.cx, shape.cy])
    return { ...shape, cx, cy }
  }
  if (shape.kind === 'ellipse') {
    const [cx, cy] = rot([shape.cx, shape.cy])
    return { ...shape, cx, cy, rotate: shape.rotate + deg }
  }
  return mapPoints(shape, rot)
}

/* ── Paths ── */

/**
 * Points along a closed or open polyline at even arc-length spacing, so a
 * sampled curve gets a steady tooth cadence whatever its sampling was.
 */
export function resample(points, closed, spacing) {
  const pts = closed ? [...points, points[0]] : points
  const lens = []
  let total = 0
  for (let i = 0; i < pts.length - 1; i++) {
    const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1])
    lens.push(l)
    total += l
  }
  const count = Math.max(3, Math.round(total / spacing))
  const h = total / count
  const out = [pts[0].slice()]
  let seg = 0
  let segStart = 0
  for (let k = 1; k < (closed ? count : count + 1); k++) {
    const d = Math.min(k * h, total)
    while (seg < lens.length - 1 && segStart + lens[seg] < d) segStart += lens[seg++]
    const t = lens[seg] ? (d - segStart) / lens[seg] : 0
    const [x1, y1] = pts[seg]
    const [x2, y2] = pts[seg + 1]
    out.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t])
  }
  return out
}

/**
 * A serrated outline: every segment keeps its endpoints on the true line, so
 * a polygon's corners stay sharp and the figure underneath stays readable,
 * and carries a whole number of tooth pairs of height `amp` between them,
 * about one tooth per `step` units, alternating sides all the way round.
 */
export function jaggedPoints(points, closed, amp, step) {
  const pts = closed ? [...points, points[0]] : points
  const out = []
  let sign = 1
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i]
    const [x2, y2] = pts[i + 1]
    const len = Math.hypot(x2 - x1, y2 - y1)
    if (len === 0) continue
    const ux = (x2 - x1) / len
    const uy = (y2 - y1) / len
    const pairs = Math.max(1, Math.round(len / (2 * step)))
    const h = len / (2 * pairs)
    out.push([x1, y1])
    for (let k = 0; k < 2 * pairs; k++) {
      const d = (k + 0.5) * h
      out.push([x1 + ux * d - uy * amp * sign, y1 + uy * d + ux * amp * sign])
      sign = -sign
    }
  }
  if (!closed) out.push(pts[pts.length - 1].slice())
  return out
}

const pt = ([x, y]) => `${round(x)} ${round(y)}`

function linePath(points, closed) {
  return points.map((p, i) => `${i ? 'L' : 'M'}${pt(p)}`).join(' ') + (closed ? ' Z' : '')
}

/** Catmull-Rom control points as cubic Béziers, so the curve prints as a curve. */
function splinePath(points, closed) {
  const n = points.length
  if (n < 3) return linePath(points, closed)
  const at = i => points[closed ? ((i % n) + n) % n : Math.min(Math.max(i, 0), n - 1)]
  const segs = closed ? n : n - 1
  let d = `M${pt(points[0])}`
  for (let i = 0; i < segs; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2)
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${pt(c1)} ${pt(c2)} ${pt(p2)}`
  }
  return closed ? `${d} Z` : d
}

function ellipsePath(cx, cy, rx, ry) {
  return `M${round(cx - rx)} ${round(cy)} a${round(rx)} ${round(ry)} 0 1 0 ${round(2 * rx)} 0 a${round(rx)} ${round(ry)} 0 1 0 ${round(-2 * rx)} 0 Z`
}

/** SVG path data (and transform, for a tilted ellipse) for one shape. */
export function toPath(shape) {
  const closed = isClosed(shape)
  if (shape.jagged) {
    const { amp, step } = shape.jagged
    // A polygon is serrated edge by edge; a curve is first resampled to one
    // tooth pair per sample, so the teeth run evenly round the smooth line.
    const base = shape.kind === 'polygon' ? shape.points : resample(outline(shape, 8), closed, 2 * step)
    return { d: linePath(jaggedPoints(base, closed, amp, step), closed) }
  }
  switch (shape.kind) {
    case 'polygon': return { d: linePath(shape.points, shape.closed) }
    case 'curve': return { d: splinePath(shape.points, shape.closed) }
    case 'circle': return { d: ellipsePath(shape.cx, shape.cy, shape.r, shape.r) }
    case 'ellipse': return {
      d: ellipsePath(shape.cx, shape.cy, shape.rx, shape.ry),
      transform: shape.rotate ? `rotate(${round(shape.rotate)} ${round(shape.cx)} ${round(shape.cy)})` : undefined,
    }
    default: throw new Error(`unknown shape kind ${shape.kind}`)
  }
}
