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

/** Shoelace area, positive when the outline runs clockwise on screen (y down). */
export function signedArea(points) {
  let a = 0
  for (let i = 0, n = points.length; i < n; i++) {
    const [x1, y1] = points[i]
    const [x2, y2] = points[(i + 1) % n]
    a += x1 * y2 - x2 * y1
  }
  return a / 2
}

/** Shoelace area of a closed polygon. */
export const area = points => Math.abs(signedArea(points))

/** How much line is drawn: a closed shape's perimeter, an open one's length. */
export function lineLength(shape) {
  const pts = outline(shape)
  const n = pts.length
  const segs = isClosed(shape) ? n : n - 1
  let len = 0
  for (let i = 0; i < segs; i++) {
    const [x1, y1] = pts[i]
    const [x2, y2] = pts[(i + 1) % n]
    len += Math.hypot(x2 - x1, y2 - y1)
  }
  return len
}

/**
 * Isoperimetric quotient: 1 for a circle, about 0.8 for a square, and near
 * zero for a long thin band however it bends.
 */
export function roundness(shape) {
  const p = lineLength(shape)
  return p > 0 ? (4 * Math.PI * area(outline(shape))) / (p * p) : 0
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

/**
 * The narrowest and the longest extent of the convex hull. Their ratio says
 * whether a figure as a whole is stretched out, whatever spikes or gaps it has.
 */
export function hullProportions(points) {
  const hull = convexHull(points)
  let diameter = 0
  for (let i = 0; i < hull.length; i++) {
    for (let j = i + 1; j < hull.length; j++) {
      diameter = Math.max(diameter, Math.hypot(hull[j][0] - hull[i][0], hull[j][1] - hull[i][1]))
    }
  }
  let width = hull.length < 3 ? 0 : Infinity
  for (let i = 0; i < hull.length && hull.length >= 3; i++) {
    const [ax, ay] = hull[i]
    const [bx, by] = hull[(i + 1) % hull.length]
    const len = Math.hypot(bx - ax, by - ay)
    if (len === 0) continue
    let far = 0
    for (const [px, py] of hull) far = Math.max(far, Math.abs((bx - ax) * (py - ay) - (by - ay) * (px - ax)) / len)
    width = Math.min(width, far)
  }
  return { width, diameter }
}

export function distToSegment([px, py], [ax, ay], [bx, by]) {
  const dx = bx - ax
  const dy = by - ay
  const len2 = dx * dx + dy * dy
  const t = len2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2)) : 0
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

/** Distance from a point to the nearest part of an outline. */
export function distToOutline(p, points, closed = true) {
  const n = points.length
  let best = Infinity
  for (let i = 0; i < (closed ? n : n - 1); i++) best = Math.min(best, distToSegment(p, points[i], points[(i + 1) % n]))
  return best
}

const cross3 = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

function segmentsCross(a, b, c, d) {
  const d1 = cross3(c, d, a)
  const d2 = cross3(c, d, b)
  const d3 = cross3(a, b, c)
  const d4 = cross3(a, b, d)
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
}

/**
 * How a line meets itself. `crossAngle` is the widest angle, in degrees, at
 * which it crosses itself (0 when it never does); `gap` is how close its
 * parts come where they do not cross. Parts less than `skip` units apart
 * along the line are neighbours and never count.
 */
export function selfContact(shape, skip = 6) {
  const pts = outline(shape)
  const closed = isClosed(shape)
  const n = pts.length
  const segs = closed ? n : n - 1
  const start = [0]
  for (let i = 0; i < segs; i++) {
    const [x1, y1] = pts[i]
    const [x2, y2] = pts[(i + 1) % n]
    start.push(start[i] + Math.hypot(x2 - x1, y2 - y1))
  }
  const total = start[segs]
  let crossAngle = 0
  let gap = Infinity
  for (let i = 0; i < segs; i++) {
    for (let j = i + 1; j < segs; j++) {
      let sep = start[j] - start[i + 1]
      if (closed) sep = Math.min(sep, total - start[j + 1] + start[i])
      if (sep < skip) continue
      const a = pts[i], b = pts[(i + 1) % n], c = pts[j], d = pts[(j + 1) % n]
      if (segmentsCross(a, b, c, d)) {
        const u = Math.atan2(b[1] - a[1], b[0] - a[0])
        const v = Math.atan2(d[1] - c[1], d[0] - c[0])
        let deg = Math.abs(((u - v) * 180) / Math.PI) % 180
        if (deg > 90) deg = 180 - deg
        crossAngle = Math.max(crossAngle, deg)
      } else {
        gap = Math.min(gap, distToSegment(a, c, d), distToSegment(b, c, d), distToSegment(c, a, b), distToSegment(d, a, b))
      }
    }
  }
  return { crossAngle, gap }
}

/** Turn at each vertex of a line, in degrees: positive turns clockwise on screen. */
function turns(points, closed) {
  const pts = []
  for (const p of points) {
    const q = pts[pts.length - 1]
    if (!q || Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-9) pts.push(p)
  }
  if (closed && pts.length > 1 && Math.hypot(pts[0][0] - pts.at(-1)[0], pts[0][1] - pts.at(-1)[1]) <= 1e-9) pts.pop()
  const n = pts.length
  const out = []
  for (let i = closed ? 0 : 1; i < (closed ? n : n - 1); i++) {
    const a = pts[(i - 1 + n) % n]
    const b = pts[i]
    const c = pts[(i + 1) % n]
    const e1 = [b[0] - a[0], b[1] - a[1]]
    const e2 = [c[0] - b[0], c[1] - b[1]]
    out.push((Math.atan2(e1[0] * e2[1] - e1[1] * e2[0], e1[0] * e2[0] + e1[1] * e2[1]) * 180) / Math.PI)
  }
  return out
}

/** Total turning along an open line, in degrees: positive turns clockwise on screen. */
export const totalTurning = points => turns(points, false).reduce((a, t) => a + t, 0)

/**
 * The sharpest corner of a closed outline that points into the figure, as
 * degrees of turn. A dent made of a smooth curve turns a little at every
 * sample and scores low; a notch cut to a point scores high.
 */
export function sharpestInwardTurn(points) {
  const s = Math.sign(signedArea(points))
  return Math.max(0, ...turns(points, true).map(t => -s * t))
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
