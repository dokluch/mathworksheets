/**
 * A figure's inside as a raster distance field: each cell within a closed
 * outline holds its distance to the outline. Where that distance dips between
 * two thicker places the figure has a neck, which is what BP18–BP20 ask
 * about and what no single measure of the outline gives directly.
 */
import { bbox } from './shapes.js'

export const CELL = 0.5
const FAR = 1e10

/** Felzenszwalb–Huttenlocher squared distance transform of one row or column, in place. */
function edt1d(grid, offset, stride, length, f, d, v, z) {
  for (let q = 0; q < length; q++) f[q] = grid[offset + q * stride]
  let k = 0
  v[0] = 0
  z[0] = -Infinity
  z[1] = Infinity
  for (let q = 1; q < length; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * (q - v[k]))
    while (s <= z[k]) {
      k--
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * (q - v[k]))
    }
    k++
    v[k] = q
    z[k] = s
    z[k + 1] = Infinity
  }
  k = 0
  for (let q = 0; q < length; q++) {
    while (z[k + 1] < q) k++
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]]
  }
  for (let q = 0; q < length; q++) grid[offset + q * stride] = d[q]
}

/** Distance to the outline for every cell inside a closed outline; 0 outside. */
export function distanceField(points, cell = CELL) {
  const b = bbox(points)
  const x0 = b.x - cell
  const y0 = b.y - cell
  const cols = Math.ceil(b.w / cell) + 3
  const rows = Math.ceil(b.h / cell) + 3
  const grid = new Float64Array(cols * rows)
  const n = points.length
  for (let row = 0; row < rows; row++) {
    const y = y0 + (row + 0.5) * cell
    const xs = []
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const [xi, yi] = points[i]
      const [xj, yj] = points[j]
      if (yi > y !== yj > y) xs.push(xi + ((y - yi) * (xj - xi)) / (yj - yi))
    }
    xs.sort((a, c) => a - c)
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const c0 = Math.max(0, Math.ceil((xs[k] - x0) / cell - 0.5))
      const c1 = Math.min(cols - 1, Math.floor((xs[k + 1] - x0) / cell - 0.5))
      for (let c = c0; c <= c1; c++) grid[row * cols + c] = FAR
    }
  }
  const len = Math.max(cols, rows)
  const f = new Float64Array(len)
  const d = new Float64Array(len)
  const v = new Int32Array(len)
  const z = new Float64Array(len + 1)
  for (let c = 0; c < cols; c++) edt1d(grid, c, cols, rows, f, d, v, z)
  for (let row = 0; row < rows; row++) edt1d(grid, row * cols, 1, cols, f, d, v, z)
  // Distance between cell centres overshoots the outline by half a cell on average.
  const dist = new Float32Array(cols * rows)
  for (let i = 0; i < dist.length; i++) dist[i] = grid[i] > 0 ? Math.max(cell / 4, Math.sqrt(grid[i]) * cell - cell / 2) : 0
  return { x0, y0, cols, rows, cell, dist }
}

export const cellCentre = (field, i) => [
  field.x0 + ((i % field.cols) + 0.5) * field.cell,
  field.y0 + (Math.floor(i / field.cols) + 0.5) * field.cell,
]

/**
 * Union-find over the cells in `order`, eight neighbours each, joined in that
 * order. `onJoin(a, b, cell)` picks which of two roots hangs under the other,
 * returning [child, root]; by default the newer one hangs under the older.
 */
function joinCells(field, order, onJoin = (a, b) => [a, b]) {
  const { cols, rows } = field
  const parent = new Int32Array(field.dist.length).fill(-1)
  const find = i => {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]]
      i = parent[i]
    }
    return i
  }
  for (const i of order) {
    parent[i] = i
    const c = i % cols
    const row = (i - c) / cols
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nc = c + dx
        const nr = row + dy
        if ((!dx && !dy) || nc < 0 || nr < 0 || nc >= cols || nr >= rows) continue
        const j = nr * cols + nc
        if (parent[j] === -1) continue
        const a = find(i)
        const b = find(j)
        if (a === b) continue
        const [child, root] = onJoin(a, b, i)
        parent[child] = root
      }
    }
  }
  return find
}

/**
 * The places where a figure narrows between two thicker parts, deepest first.
 * Cells join from the thickest inwards; when two separate thick parts first
 * touch, the distance there is the neck's half-width (`level`) and the
 * thinner part's own peak (`low`) says how thick the smaller side is.
 * `peaks` are the cells at the middle of the thicker and the thinner part.
 */
export function necks(field, minDrop = 1) {
  const { dist } = field
  const order = []
  for (let i = 0; i < dist.length; i++) if (dist[i] > 0) order.push(i)
  order.sort((a, b) => dist[b] - dist[a])
  const peak = new Int32Array(dist.length)
  for (const i of order) peak[i] = i
  const found = []
  joinCells(field, order, (a, b, at) => {
    const [hi, lo] = dist[peak[a]] >= dist[peak[b]] ? [a, b] : [b, a]
    const low = dist[peak[lo]]
    const level = dist[at]
    if (low - level >= minDrop) {
      found.push({ level, low, drop: low - level, ratio: low / Math.max(level, field.cell), peaks: [peak[hi], peak[lo]] })
    }
    return [lo, hi]
  })
  return found.sort((x, y) => y.drop - x.drop)
}

/** The deepest neck, or null for a figure without one. */
export const mainNeck = (field, minDrop = 1) => necks(field, minDrop)[0] ?? null

/**
 * Which thick part each cell belongs to once every cell at or below `level`
 * is taken away: a part id per cell, -1 for cells taken away.
 */
export function partsAbove(field, level) {
  const order = []
  for (let i = 0; i < field.dist.length; i++) if (field.dist[i] > level) order.push(i)
  const find = joinCells(field, order)
  const labels = new Int32Array(field.dist.length).fill(-1)
  for (const i of order) labels[i] = find(i)
  return labels
}

/** The part id of the labelled cell nearest a point. */
export function partNear(field, labels, [x, y]) {
  let best = -1
  let bestD = Infinity
  for (let i = 0; i < labels.length; i++) {
    if (labels[i] < 0) continue
    const [cx, cy] = cellCentre(field, i)
    const d = (cx - x) ** 2 + (cy - y) ** 2
    if (d < bestD) {
      bestD = d
      best = labels[i]
    }
  }
  return best
}
