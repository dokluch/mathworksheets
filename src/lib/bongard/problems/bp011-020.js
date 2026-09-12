/**
 * Bongard's original problems 11–20, on the same contract as 1–10. A checker
 * may also return null for a panel too close to call; index.js redraws it
 * whichever side it was drawn for, so no printed panel is borderline.
 *
 * Rules follow M. M. Bongard (1967) as indexed by H. Foundalis; the figures
 * are our own.
 */
import {
  panel, polygon, curve, ellipse, circle, dot, outline, bbox, isClosed, shapeBbox, lineLength, roundness,
  hullProportions, selfContact, totalTurning, sharpestInwardTurn, resample, rotate,
} from '../shapes.js'
import {
  figure, sized, placeRandom, placeGroup, randomPolygon, zigzag, arc, band, body, fitter, spiralPoints, walk,
} from '../gen.js'
import { distanceField, mainNeck, partsAbove, partNear, cellCentre } from '../field.js'

const one = p => (p.shapes.length === 1 ? p.shapes[0] : null)
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
/** true at or below `left`, false at or above `right`, null in between. */
const split = (v, left, right) => (v <= left ? true : v >= right ? false : null)
const isDot = s => s.kind === 'circle' && s.fill === 'solid' && s.r <= 3
const regular = (n, rad, deg) => Array.from({ length: n }, (_, i) => {
  const a = ((deg + (360 * i) / n) * Math.PI) / 180
  return [rad * Math.cos(a), rad * Math.sin(a)]
})
const box = (w, h) => polygon([[-w, -h], [w, -h], [w, h], [-w, h]])
/** Top and bottom halves of a body, stretched a little apart so it is not mirror-true. */
const stretch = r => ({ top: r.num(0.85, 1.15), bottom: r.num(0.85, 1.15) })

/* ── BP11, BP12: thin, long and compact figures ── */

const L = 30

function thinFigure(r) {
  switch (r.pick(['rect', 'ellipse', 'lozenge', 'needle', 'arc', 'wave'])) {
    case 'rect': return rotate(box(L, L / r.num(5.5, 9)), r.num(0, 180))
    case 'ellipse': return ellipse(0, 0, L, L / r.num(5.5, 9), { rotate: r.num(0, 180) })
    case 'lozenge': {
      const T = L / r.num(4.5, 7)
      return rotate(polygon([[-L, 0], [0, -T], [L, 0], [0, T]]), r.num(0, 180))
    }
    case 'needle': {
      const T = L / r.num(3.5, 5)
      return rotate(polygon([[-L, -T], [L, 0], [-L, T]]), r.num(0, 360))
    }
    case 'arc': {
      const a0 = r.num(0, 360)
      return polygon(band(arc(0, 0, 20, a0, a0 + r.num(180, 280), 8), r.num(2.6, 3.6)))
    }
    default: {
      const A = r.num(6, 9)
      const periods = r.num(1, 1.4)
      const c = Array.from({ length: 25 }, (_, i) => [-L + (2 * L * i) / 24, A * Math.sin((2 * Math.PI * periods * i) / 24)])
      return rotate(polygon(band(c, r.num(2.5, 3.5))), r.num(0, 180))
    }
  }
}

function plumpFigure(r) {
  switch (r.pick(['circle', 'square', 'regular', 'ellipse', 'blob'])) {
    case 'circle': return circle(0, 0, 20)
    case 'square': return rotate(box(20, 20), r.num(0, 90))
    case 'regular': return polygon(regular(r.int(5, 8), 20, r.num(0, 360)))
    case 'ellipse': return ellipse(0, 0, 20, 20 / r.num(1.05, 1.3), { rotate: r.num(0, 180) })
    default: return figure(r, 'blob')
  }
}

function longFigure(r) {
  switch (r.pick(['needle', 'wave', 'lens', 'rect', 'ellipse', 'zigzag'])) {
    case 'needle': {
      const T = L / r.num(3.5, 5)
      return rotate(polygon([[-L, -T], [L, 0], [-L, T]]), r.num(0, 360))
    }
    case 'wave': {
      const A = r.num(3, 4)
      const periods = r.num(1.5, 2.1)
      const c = Array.from({ length: 41 }, (_, i) => [-L + (2 * L * i) / 40, A * Math.sin((2 * Math.PI * periods * i) / 40)])
      return rotate(polygon(band(c, r.num(2, 2.8))), r.num(0, 180))
    }
    case 'lens': {
      const T = L / r.num(3.5, 6)
      const top = Array.from({ length: 17 }, (_, i) => {
        const x = -L + (2 * L * i) / 16
        return [x, -T * (1 - (x / L) ** 2)]
      })
      return rotate(polygon([...top, ...top.slice(1, -1).reverse().map(([x, y]) => [x, -y])]), r.num(0, 180))
    }
    case 'rect': return rotate(box(L, L / r.num(3.5, 7)), r.num(0, 180))
    case 'ellipse': return ellipse(0, 0, L, L / r.num(3.5, 7), { rotate: r.num(0, 180) })
    default: {
      const n = 2 * r.int(4, 6)
      const h = r.num(3, 4.5)
      const z = r.num(1.8, 2.6)
      const xs = Array.from({ length: n + 1 }, (_, i) => -L + (2 * L * i) / n)
      const top = xs.map((x, i) => [x, -h + (i % 2 ? -z : z)])
      const bottom = xs.map((x, i) => [x, h + (i % 2 ? -z : z)]).reverse()
      return rotate(polygon([...top, ...bottom]), r.num(0, 180))
    }
  }
}

function compactFigure(r) {
  switch (r.pick(['circle', 'square', 'star', 'ring', 'castle', 'cross', 'regular'])) {
    case 'circle': return circle(0, 0, 20)
    case 'square': return rotate(box(20, 20), r.num(0, 90))
    case 'star': {
      const n = r.int(5, 8)
      const inner = r.num(0.4, 0.55)
      const deg = r.num(0, 360)
      return polygon(regular(2 * n, 20, deg).map(([x, y], i) => (i % 2 ? [x * inner, y * inner] : [x, y])))
    }
    case 'ring': {
      const a0 = r.num(0, 360)
      return polygon(band(arc(0, 0, 16, a0, a0 + r.num(290, 320), 8), r.num(3, 4.5)))
    }
    case 'castle': {
      const W = 20
      const H = r.num(19, 21)
      const d = H * r.num(0.25, 0.4)
      const m = 2 * r.int(2, 3) + 1
      const pts = [[-W, H]]
      for (let i = 0; i < m; i++) {
        const y = i % 2 ? -H + d : -H
        pts.push([-W + (2 * W * i) / m, y], [-W + (2 * W * (i + 1)) / m, y])
      }
      pts.push([W, H])
      return rotate(polygon(pts), r.pick([0, 90, 180, 270]))
    }
    case 'cross': {
      const t = r.num(5, 8)
      const a = 20
      return rotate(polygon([[-t, -a], [t, -a], [t, -t], [a, -t], [a, t], [t, t], [t, a], [-t, a], [-t, t], [-a, t], [-a, -t], [-t, -t]]), r.num(0, 90))
    }
    default: return polygon(regular(r.int(5, 8), 20, r.num(0, 360)))
  }
}

/* ── BP14: much or little line ── */

/** A line of loops, like a stretched telephone cord: `a` per radian forward, loops of radius `b`. */
function coil(loops, a, b) {
  const pts = []
  for (let t = 0; t <= loops * 2 * Math.PI + 1e-9; t += Math.PI / 6) pts.push([a * t - b * Math.sin(t), -b * Math.cos(t)])
  return curve(pts, { closed: false })
}

const segment = (x1, y1, x2, y2) => polygon([[x1, y1], [x2, y2]], { closed: false })

function muchLine(r) {
  switch (r.pick(['walk', 'coil', 'comb', 'rings', 'concave', 'meander'])) {
    case 'walk': return [placeRandom(r, sized(curve(walk(r, r.int(11, 14), 70), { closed: false }), r.num(64, 80)))]
    case 'coil': return [placeRandom(r, sized(rotate(coil(r.int(5, 6), 2.2, 7), r.num(-30, 30)), r.num(66, 80)))]
    case 'comb': {
      const half = r.num(28, 36)
      const ticks = r.int(7, 10)
      const T = r.num(9, 13)
      const shapes = [segment(-half, 0, half, 0)]
      for (let i = 0; i < ticks; i++) {
        const x = -half + (2 * half * (i + 0.5)) / ticks
        shapes.push(segment(x, -T, x, T))
      }
      const deg = r.pick([0, 90])
      return placeGroup(r, shapes.map(s => rotate(s, deg)))
    }
    case 'rings': {
      const R = r.num(25, 34)
      return placeGroup(r, Array.from({ length: r.int(2, 3) }, (_, i) => circle(0, 0, R * (1 - 0.36 * i))))
    }
    case 'concave': return [placeRandom(r, figure(r, 'concave', { size: r.num(66, 80) }))]
    default: {
      const periods = r.int(4, 6)
      const A = r.num(9, 12)
      const half = r.num(30, 36)
      const n = periods * 4
      const pts = Array.from({ length: n + 1 }, (_, i) => [-half + (2 * half * i) / n, A * Math.sin((Math.PI * i) / 2)])
      return [placeRandom(r, rotate(curve(pts, { closed: false }), r.num(-20, 20)))]
    }
  }
}

function littleLine(r) {
  switch (r.pick(['dash', 'triangle', 'zigzag', 'crossed', 'bits', 'spring'])) {
    case 'dash': return [placeRandom(r, sized(rotate(segment(-1, 0, 1, 0), r.num(0, 180)), r.num(8, 16)))]
    case 'triangle': return [placeRandom(r, figure(r, 'triangle', { size: r.num(11, 16) }))]
    case 'zigzag': {
      const n = r.int(4, 6)
      const pts = Array.from({ length: n }, (_, i) => [i * 3.5, i % 2 ? 2.5 : -2.5])
      return [placeRandom(r, sized(rotate(polygon(pts, { closed: false }), r.num(-30, 30)), r.num(16, 22)))]
    }
    case 'crossed': {
      const tri = figure(r, 'triangle', { size: r.num(11, 14) })
      return placeGroup(r, [tri, rotate(segment(-9, 0, 9, 0), r.num(0, 180))])
    }
    case 'bits': {
      const out = []
      const count = r.int(3, 4)
      for (let i = 0; i < count; i++) out.push(figure(r, r.pick(['triangle', 'circle']), { size: r.num(6, 7.5) }))
      return spreadWide(r, out)
    }
    default: return [placeRandom(r, sized(coil(3, 0.9, 2.4), r.num(18, 22)))]
  }
}

/** Tiny shapes flung far apart, so the little that is drawn still spans the box. */
function spreadWide(r, shapes) {
  const spots = []
  return shapes.map(s => {
    let x = 50
    let y = 50
    for (let tries = 0; tries < 40; tries++) {
      x = r.num(12, 88)
      y = r.num(12, 88)
      if (spots.every(([px, py]) => Math.hypot(px - x, py - y) >= 24)) break
    }
    spots.push([x, y])
    return { ...s, ...(s.kind === 'circle' ? { cx: x, cy: y } : {}), ...(s.kind === 'polygon' ? { points: s.points.map(([px, py]) => [px + x, py + y]) } : {}) }
  })
}

/* ── BP15: closed and open ── */

function closedFigure(r, size) {
  const kind = r.pick(['ellipse', 'blob', 'concaveBlob', 'polygon', 'triangle', 'quad', 'peanut'])
  if (kind !== 'peanut') return figure(r, kind, { size })
  const shape = body([{ round: true, x0: -30, x1: 2, h: r.num(12, 16) }, { round: true, x0: -2, x1: 30, h: r.num(12, 16) }])
  return sized(rotate(polygon(shape.points), r.num(0, 180)), size)
}

/** The same figure with a piece of its outline taken out. */
function withGap(r, s) {
  if (s.kind === 'polygon' && s.points.length <= 8) {
    const pts = s.points
    const n = pts.length
    let k = 0
    let longest = 0
    pts.forEach((a, i) => {
      const b = pts[(i + 1) % n]
      const len = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (len > longest) [k, longest] = [i, len]
    })
    const g = Math.min(0.6, r.num(8, 12) / longest)
    const t0 = r.num(0.1, 0.9 - g)
    const a = pts[k]
    const b = pts[(k + 1) % n]
    const at = t => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
    const path = [at(t0 + g)]
    for (let i = 1; i <= n; i++) path.push(pts[(k + i) % n])
    path.push(at(t0))
    return polygon(path, { closed: false })
  }
  const dense = resample(outline(s, 8), true, 2)
  const n = dense.length
  const skip = Math.ceil(r.num(8, 13) / 2)
  const s0 = r.int(0, n - 1)
  return polygon(Array.from({ length: n - skip + 1 }, (_, i) => dense[(s0 + skip + i) % n]), { closed: false })
}

/* ── BP17: corners that point in ── */

/** Replaces the chosen edges with curves bowed towards the middle of the figure, `sag` of their length deep. */
function bowIn(pts, which, sag) {
  const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length
  const cy = pts.reduce((a, p) => a + p[1], 0) / pts.length
  const out = []
  pts.forEach((a, i) => {
    out.push(a)
    if (!which.includes(i)) return
    const b = pts[(i + 1) % pts.length]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    let nx = -(b[1] - a[1]) / len
    let ny = (b[0] - a[0]) / len
    const mx = (a[0] + b[0]) / 2
    const my = (a[1] + b[1]) / 2
    if (nx * (cx - mx) + ny * (cy - my) < 0) [nx, ny] = [-nx, -ny]
    const k = [mx + nx * 2 * sag * len, my + ny * 2 * sag * len]
    for (let s = 1; s < 16; s++) {
      const t = s / 16
      out.push([0, 1].map(j => (1 - t) ** 2 * a[j] + 2 * (1 - t) * t * k[j] + t * t * b[j]))
    }
  })
  return out
}

const deg = (y, x) => (Math.atan2(y, x) * 180) / Math.PI

function inwardCorner(r) {
  switch (r.pick(['pacman', 'dart', 'flag', 'notches', 'heart', 'eight', 'star'])) {
    case 'pacman': {
      const m = r.num(40, 100)
      const b = r.num(0, 360)
      return [[0, 0], ...arc(0, 0, 20, b + m / 2, b + 360 - m / 2)]
    }
    case 'dart': {
      const w = r.num(12, 20)
      return [[-w, -14], [0, 14], [w, -14], [0, -14 + r.num(8, 16)]]
    }
    case 'flag': {
      const W = r.num(14, 22)
      const H = r.num(9, 14)
      return [[-W, -H], [W, -H], [W - r.num(0.5, 0.9) * H, 0], [W, H], [-W, H]]
    }
    case 'notches': {
      const W = r.num(10, 14)
      const H = r.num(16, 22)
      const e = W * r.num(0.3, 0.5)
      const d = H * r.num(0.3, 0.5)
      return [[-W, -H], [-e, -H], [0, -H + d], [e, -H], [W, -H], [W, H], [e, H], [0, H - d], [-e, H], [-W, H]]
    }
    case 'heart': {
      const R = 12
      const d = R * r.num(0.6, 0.8)
      const s = Math.sqrt(R * R - d * d)
      return [...arc(d, 0, R, deg(-s, -d), 25), [0, R * 2.3], ...arc(-d, 0, R, 155, deg(-s, d) + 360).slice(0, -1)]
    }
    case 'eight': {
      const R = 14
      const d = R * r.num(0.6, 0.85)
      const s = Math.sqrt(R * R - d * d)
      return [...arc(d, 0, R, deg(-s, -d), deg(s, -d)).slice(0, -1), ...arc(-d, 0, R, deg(s, d), deg(-s, d) + 360).slice(0, -1)]
    }
    default: return randomPolygon(r, r.int(5, 7), { convex: false })
  }
}

function noInwardCorner(r) {
  switch (r.pick(['convex', 'house', 'oval', 'bowed', 'bowed', 'bite', 'crescent'])) {
    case 'convex': return randomPolygon(r, r.int(4, 6))
    case 'house': {
      const W = r.num(10, 16)
      const H = r.num(8, 14)
      return [[-W, H], [-W, -H], [0, -H - r.num(7, 12)], [W, -H], [W, H]]
    }
    case 'oval': {
      const k = r.num(0.55, 1)
      return arc(0, 0, 20, 0, 354).map(([x, y]) => [x, y * k])
    }
    case 'bowed': {
      const n = r.pick([3, 4, 4, 5])
      const which = r.shuffle([...Array(n).keys()]).slice(0, r.int(1, n))
      return bowIn(regular(n, 20, r.num(0, 360)), which, n === 3 ? r.num(0.06, 0.1) : r.num(0.1, 0.2))
    }
    case 'bite':
    case 'crescent': {
      const crescent = r.chance(0.5)
      const g = crescent ? r.num(60, 100) : r.num(35, 70)
      const b = r.num(0, 360)
      const pts = arc(0, 0, 20, b + g, b + 360 - g)
      return bowIn(pts, [pts.length - 1], crescent ? r.num(0.3, 0.42) : r.num(0.15, 0.3))
    }
    default: return randomPolygon(r, 4)
  }
}

/* ── BP18–BP20: necks ── */

/**
 * Two round lobes on a straight bar along the x axis, every proportion random
 * within what reads as a neck: the bar is visibly two lines, and each lobe is
 * well over twice as thick as the bar. One time in three the lobes stand
 * tall across the bar, an H, so the figure as a whole is longer across its
 * neck than along it. `lobes` locate each lobe on the axis and say which way
 * its bar leaves it.
 */
function dumbbell(r) {
  const across = r.chance(1 / 3)
  const w = across ? r.num(2.8, 3.3) : r.num(2.8, 3.8)
  const lobe = across
    ? () => ({ a: r.num(7.5, 9.5), h: r.num(18, 22) })
    : () => ({ a: r.num(Math.max(9, 2.5 * w), 16), h: r.num(Math.max(10, 2.5 * w), 17) })
  const A = lobe()
  const B = lobe()
  const gap = across ? r.num(5, 9) : r.num(6, 14)
  return {
    parts: [
      { round: true, x0: -gap / 2 - 2 * A.a, x1: -gap / 2, h: A.h },
      { x0: -gap / 2 - A.a, x1: gap / 2 + B.a, h0: w, h1: w },
      { round: true, x0: gap / 2, x1: gap / 2 + 2 * B.a, h: B.h },
    ],
    lobes: [{ c: -gap / 2 - A.a, a: A.a, toward: 1 }, { c: gap / 2 + B.a, a: B.a, toward: -1 }],
  }
}

function neckOutline(r) {
  switch (r.pick(['dumbbell', 'dumbbell', 'bowtie', 'balloon', 'fish'])) {
    case 'bowtie': {
      const len = r.num(18, 26)
      const h = r.num(13, 18)
      const w = r.num(2.6, 3.4)
      return body([{ x0: -len, x1: 0, h0: h, h1: w }, { x0: 0, x1: len, h0: w, h1: h * r.num(0.8, 1.2) }], stretch(r)).points
    }
    case 'balloon': {
      const R = r.num(13, 17)
      const stem = r.num(10, 16)
      const k = r.num(7, 8.5)
      return body([
        { round: true, x0: -2 * R, x1: 0, h: R * r.num(0.9, 1.1) },
        { x0: -R, x1: stem + k, h0: r.num(2.4, 3), h1: r.num(2.4, 3) },
        { round: true, x0: stem, x1: stem + 2 * k, h: k },
      ], stretch(r)).points
    }
    case 'fish': {
      const a = r.num(16, 22)
      const w = r.num(2.6, 3)
      return body([
        { x0: -r.num(16, 20), x1: 0, h0: r.num(14, 17), h1: w },
        { x0: 0, x1: a, h0: w, h1: w },
        { round: true, x0: 0, x1: 2 * a, h: r.num(10, 14) },
      ], stretch(r)).points
    }
    default: return body(dumbbell(r).parts, stretch(r)).points
  }
}

function plainOutline(r) {
  switch (r.pick(['rect', 'oval', 'ell', 'banana', 'dee', 'bean'])) {
    case 'rect': {
      const w = r.num(14, 24)
      return box(w, w / r.num(1.5, 3.5)).points
    }
    case 'oval': {
      const k = r.num(0.4, 0.7)
      return arc(0, 0, 20, 0, 354).map(([x, y]) => [x, y * k])
    }
    case 'ell': {
      const t = r.num(10, 15)
      const a = r.num(28, 40)
      const b = r.num(22, 34)
      return [[0, 0], [t, 0], [t, a - t], [b, a - t], [b, a], [0, a]]
    }
    case 'banana': {
      const a0 = r.num(0, 360)
      const hmax = r.num(6, 9)
      return band(arc(0, 0, r.num(22, 30), a0, a0 + r.num(100, 150), 6), u => hmax * (0.3 + 0.7 * Math.sin(Math.PI * u)))
    }
    case 'dee': {
      const e = r.num(0, 12)
      return [[-e, -20], ...arc(0, 0, 20, -90, 90), [-e, 20]]
    }
    default: {
      const a0 = r.num(0, 360)
      const hmax = r.num(8, 11)
      return band(arc(0, 0, r.num(16, 20), a0, a0 + r.num(110, 160), 6), u => hmax * (0.6 + 0.4 * Math.sin(Math.PI * u)))
    }
  }
}

/** Built at about the scale it is printed, so a neck stays a neck. */
const nearRaw = r => raw => clamp(raw * r.num(0.95, 1.2), 44, 82)

/** A clear neck: much thinner than both sides, and deep enough to see. */
const clearNeck = n => n && n.ratio >= 2 && n.drop >= 2.5

export const problems = [
  {
    id: 'bp011',
    number: 11,
    band: 2,
    // Left: thin figures, even bent ones. Right: plump figures.
    gen(r, side) {
      const s = side === 'left' ? thinFigure(r) : plumpFigure(r)
      return panel([placeRandom(r, sized(s, r.num(side === 'left' ? 34 : 18, 72)))])
    },
    check(p) {
      const s = one(p)
      return s && isClosed(s) ? split(roundness(s), 0.45, 0.7) : null
    },
  },
  {
    id: 'bp012',
    number: 12,
    band: 3,
    // Left: the whole figure is long and narrow. Right: it is about as wide as long, spikes and gaps included.
    gen(r, side) {
      const s = side === 'left' ? longFigure(r) : compactFigure(r)
      return panel([placeRandom(r, sized(s, r.num(30, 72)))])
    },
    check(p) {
      const s = one(p)
      if (!s) return null
      const { width, diameter } = hullProportions(outline(s))
      return split(width / diameter, 0.34, 0.6)
    },
  },
  {
    id: 'bp013',
    number: 13,
    band: 3,
    // Left: upright rectangles and flat ellipses. Right: flat rectangles and upright ellipses.
    gen(r, side) {
      const rect = r.chance(0.5)
      const long = r.num(22, 56)
      const short = long / r.num(1.8, 3.2)
      const [w, h] = rect === (side === 'left') ? [short, long] : [long, short]
      return panel([placeRandom(r, rect ? box(w / 2, h / 2) : ellipse(0, 0, w / 2, h / 2))])
    },
    check(p) {
      const s = one(p)
      if (!s) return null
      const b = shapeBbox(s)
      const tall = b.h >= 1.5 * b.w
      const wide = b.w >= 1.5 * b.h
      const rect = s.kind === 'polygon' && s.points.length === 4
      if ((!tall && !wide) || (!rect && s.kind !== 'ellipse')) return null
      return rect === tall
    },
  },
  {
    id: 'bp014',
    number: 14,
    band: 2,
    // Left: a lot of line is drawn. Right: only a little.
    gen(r, side) {
      return panel(side === 'left' ? muchLine(r) : littleLine(r))
    },
    check(p) {
      if (!p.shapes.length) return null
      const total = p.shapes.reduce((a, s) => a + lineLength(s), 0)
      return total >= 180 ? true : total <= 75 ? false : null
    },
  },
  {
    id: 'bp015',
    number: 15,
    band: 1,
    // Left: closed figures. Right: figures with a gap in the outline.
    gen(r, side) {
      const size = r.num(24, 62)
      if (side === 'left') return panel([placeRandom(r, closedFigure(r, size))])
      if (r.chance(0.15)) return panel([placeRandom(r, sized(curve(spiralPoints(r, 'round', r.sign()), { closed: false }), size))])
      return panel([placeRandom(r, withGap(r, closedFigure(r, size)))])
    },
    check(p) {
      const s = one(p)
      if (!s) return null
      if (isClosed(s)) return true
      const pts = outline(s)
      return Math.hypot(pts[0][0] - pts.at(-1)[0], pts[0][1] - pts.at(-1)[1]) >= 6 ? false : null
    },
  },
  {
    id: 'bp016',
    number: 16,
    band: 2,
    // Left: followed from the outer end in, the spiral turns counterclockwise. Right: clockwise.
    gen(r, side) {
      const style = r.pick(['round', 'round', 'square', 'triangle', 'pentagon'])
      const pts = spiralPoints(r, style, side === 'left' ? -1 : 1)
      const size = r.num(34, 62)
      const s = sized(style === 'round' ? curve(pts, { closed: false }) : polygon(pts, { closed: false }), size)
      const jagged = style === 'round' && size >= 50 && r.chance(0.35) ? zigzag(r, size) : null
      return panel([placeRandom(r, { ...s, jagged })])
    },
    check(p) {
      const s = one(p)
      if (!s || isClosed(s)) return null
      const { crossAngle, gap } = selfContact(s)
      if (crossAngle > 0 || gap < (s.jagged ? 6 : 2.5)) return null
      let pts = outline(s)
      const b = bbox(pts)
      const far = q => Math.hypot(q[0] - b.cx, q[1] - b.cy)
      if (far(pts[0]) < far(pts.at(-1))) pts = pts.slice().reverse()
      const t = totalTurning(pts)
      return t <= -450 ? true : t >= 450 ? false : null
    },
  },
  {
    id: 'bp017',
    number: 17,
    band: 3,
    // Left: a corner of the outline points into the figure. Right: no corner points in, though sides may curve in.
    gen(r, side) {
      const pts = side === 'left' ? inwardCorner(r) : noInwardCorner(r)
      return panel([placeRandom(r, sized(rotate(polygon(pts), r.num(0, 360)), r.num(30, 62)))])
    },
    check(p) {
      const s = one(p)
      if (!s || !isClosed(s)) return null
      const turn = sharpestInwardTurn(outline(s))
      return turn >= 45 ? true : turn <= 22 ? false : null
    },
  },
  {
    id: 'bp018',
    number: 18,
    band: 2,
    // Left: the figure narrows to a neck. Right: no neck.
    gen(r, side) {
      const pts = side === 'left' ? neckOutline(r) : plainOutline(r)
      const t = fitter(pts, side === 'left' ? nearRaw(r) : r.num(40, 70), r.num(0, 360))
      return panel([placeRandom(r, polygon(pts.map(t)))])
    },
    check(p) {
      const s = one(p)
      if (!s || !isClosed(s)) return null
      const n = mainNeck(distanceField(outline(s)))
      if (clearNeck(n)) return true
      return !n || n.drop < 1.5 ? false : null
    },
  },
  {
    id: 'bp019',
    number: 19,
    band: 3,
    // Left: the neck runs side to side. Right: the neck runs up and down.
    gen(r, side) {
      const pts = body(dumbbell(r).parts, stretch(r)).points
      const t = fitter(pts, nearRaw(r), (side === 'left' ? 0 : 90) + r.num(-10, 10))
      return panel([placeRandom(r, polygon(pts.map(t)))])
    },
    check(p) {
      const s = one(p)
      if (!s || !isClosed(s)) return null
      const field = distanceField(outline(s))
      const n = mainNeck(field)
      if (!clearNeck(n)) return null
      const [a, b] = n.peaks.map(i => cellCentre(field, i))
      const angle = Math.abs(deg(b[1] - a[1], b[0] - a[0])) % 180
      return split(Math.min(angle, 180 - angle), 25, 65)
    },
  },
  {
    id: 'bp020',
    number: 20,
    band: 3,
    // Left: both dots on the same part of the figure. Right: a neck separates the dots.
    gen(r, side) {
      const { parts, lobes } = dumbbell(r)
      const shape = body(parts, stretch(r))
      // A spot on a lobe's outline, near the bar or anywhere clear of it.
      const onLobe = (lobe, near, sideOf = r.sign()) => {
        const psi = ((near ? r.num(55, 85) : r.num(60, 180)) * Math.PI) / 180
        return shape.at(lobe.c + lobe.toward * lobe.a * Math.cos(psi), sideOf)
      }
      let marks
      if (side === 'left') {
        const lobe = r.pick(lobes)
        const first = onLobe(lobe, false)
        let second = onLobe(lobe, false)
        for (let i = 0; i < 20 && Math.hypot(second[0] - first[0], second[1] - first[1]) < 0.8 * lobe.a; i++) second = onLobe(lobe, false)
        marks = [first, second]
      } else {
        const near = r.chance(0.4)
        const sideOf = r.sign()
        marks = lobes.map(l => onLobe(l, near, near ? sideOf : r.sign()))
      }
      const t = fitter(shape.points, nearRaw(r), r.num(0, 360))
      return panel(placeGroup(r, [polygon(shape.points.map(t)), ...marks.map(m => dot(...t(m), 2.4))]))
    },
    check(p) {
      const dots = p.shapes.filter(isDot)
      const figs = p.shapes.filter(s => !isDot(s))
      if (dots.length !== 2 || figs.length !== 1 || !isClosed(figs[0])) return null
      const field = distanceField(outline(figs[0]))
      const n = mainNeck(field)
      if (!clearNeck(n)) return null
      const labels = partsAbove(field, n.level)
      const sides = n.peaks.map(i => labels[i])
      const [a, b] = dots.map(d => partNear(field, labels, [d.cx, d.cy]))
      if (!sides.includes(a) || !sides.includes(b)) return null
      return a === b
    },
  },
]
