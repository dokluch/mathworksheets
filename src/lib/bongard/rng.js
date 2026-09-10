/**
 * Random helpers over a plain `() => number in [0, 1)` source.
 *
 * The app draws from Math.random at render time on purpose: scripts/og-images.mjs
 * seeds the page by replacing Math.random, which is what keeps a worksheet's
 * preview image reproducible. Tests and scripts pass their own seeded source.
 */
export function rngHelpers(rng = Math.random) {
  const num = (min, max) => min + rng() * (max - min)
  const int = (min, max) => Math.floor(rng() * (max - min + 1)) + min
  const pick = arr => arr[Math.floor(rng() * arr.length)]
  const chance = p => rng() < p
  const sign = () => (rng() < 0.5 ? 1 : -1)
  const shuffle = arr => {
    const out = arr.slice()
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[out[i], out[j]] = [out[j], out[i]]
    }
    return out
  }
  return { rng, num, int, pick, chance, sign, shuffle }
}

/** Small seeded generator (mulberry32), for tests and offline rendering only. */
export function mulberry32(seed) {
  let s = seed >>> 0 || 1
  return () => {
    s = (s + 0x6D2B79F5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
