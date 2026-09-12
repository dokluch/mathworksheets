import { mulberry32, rngHelpers } from './rng.js'

/**
 * The set number is the seed.
 *
 * A sheet used to be stamped with a hash of its problems, which told two
 * printed pages apart but could not bring a page back. Now the number comes
 * first and the problems follow from it, so "set 451" is something a parent
 * can type, or send to a friend, and get exactly that page (with the same
 * settings). Printing several copies deals further sets drawn from the first
 * one, so the pile looks like what it is — different pages — while the batch
 * itself still follows from the number in the URL, and every stamp on the
 * pile is one that could be typed back in.
 */

export const MIN_SET = 1
export const MAX_SET = 99999
export const MAX_COPIES = 20

/** A fresh set on open or Regenerate: three digits, as the stamp has always shown. */
export function randomSet(rng = Math.random) {
  return Math.floor(rng() * 900) + 100
}

/** Typed text → a set number, or null when it is not one. */
export function parseSet(text) {
  const trimmed = String(text ?? '').trim()
  if (!/^\d+$/.test(trimmed)) return null
  const n = Number(trimmed)
  return n >= MIN_SET && n <= MAX_SET ? n : null
}

export function clampCopies(value) {
  const n = Number.parseInt(value, 10)
  if (!Number.isFinite(n)) return 1
  return Math.min(MAX_COPIES, Math.max(1, n))
}

/**
 * The sets a print run deals: `set` first, then `copies - 1` distinct
 * three-digit numbers drawn from a source seeded by `set`. Derived, not
 * random, so the batch survives a re-render and a reload; a stranger to the
 * pile could not tell the extra sheets came from the same batch.
 */
export function setSequence(set, copies) {
  const r = rngHelpers(mulberry32(set * 2654435761))
  const sets = [set]
  const used = new Set(sets)
  while (sets.length < copies) {
    const next = randomSet(r.rng)
    if (!used.has(next)) { used.add(next); sets.push(next) }
  }
  return sets
}

/** The source a sheet with this set number draws from. */
export function sheetRng(set) {
  return mulberry32(set)
}
