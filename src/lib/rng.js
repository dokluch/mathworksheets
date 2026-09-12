/**
 * Random helpers over a plain `() => number in [0, 1)` source.
 *
 * Every generator draws through these rather than from Math.random, so a
 * sheet is a pure function of its settings and its set number: the same
 * number typed on another machine deals the same page (see hooks/useSheetSet).
 * Tests and scripts pass their own seeded source.
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

/** A source, an existing helpers object, or nothing → helpers. */
export function asHelpers(rng) {
  if (rng == null) return rngHelpers()
  return typeof rng === 'function' ? rngHelpers(rng) : rng
}

/**
 * Small seeded generator (mulberry32). Integer arithmetic only, so a seed
 * deals the same sequence in every JavaScript engine.
 */
export function mulberry32(seed) {
  let s = seed >>> 0 || 1
  return () => {
    s = (s + 0x6D2B79F5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
