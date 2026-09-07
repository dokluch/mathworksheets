/**
 * Short identifying stamp for one generated sheet.
 *
 * Derived from the problems themselves rather than from a counter, so it is
 * stable across a reload of the same sheet and changes exactly when the
 * content changes. That is what makes Regenerate visible: the highest
 * frequency action in the product used to swap one grid of random digits for
 * another with no confirmation that anything had happened.
 *
 * It also gives a parent printing two sheets a way to tell them apart, and a
 * child a way to say which page they are on.
 */
export function setStamp(value) {
  const text = JSON.stringify(value) ?? ''
  // FNV-1a: tiny, dependency-free, and well spread over a 3-digit range.
  let hash = 2166136261
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return String(((hash >>> 0) % 900) + 100)
}
