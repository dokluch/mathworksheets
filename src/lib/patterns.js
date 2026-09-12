/**
 * Sequence generation for the Number Patterns sheet.
 *
 * A page is built as a whole rather than one row at a time. The old
 * component drew every row independently from a handful of tiny families
 * (the squares family could only ever print two different sequences), so
 * most Hard pages carried the same row three times. Here each level owns a
 * mix of families, a shuffled bag spreads them evenly down the page, and a
 * sequence that already appears on the page is never printed again.
 */

/** Terms per row. Shorter than this and the rule is a guess; longer no longer fits one printed line at five digits. */
export const MIN_LEN = 6
export const MAX_LEN = 8

/** Largest term a level prints. Easy stays within the hundred square. */
export const MAX_VALUE = { 1: 120, 2: 1000, 3: 10000 }

/** How often the same rule label (e.g. "+3") may appear on a page before a slot looks for another. */
export const RULE_CAP = 2

import { asHelpers, rngHelpers } from './rng.js'

const ATTEMPTS_PER_FAMILY = 20

/**
 * Rounds of the families, each round shuffled on its own, so every family
 * appears once before any appears twice: a page that has room for all of
 * them shows all of them.
 */
function shuffledBag(items, count, r) {
  const bag = []
  while (bag.length < count) bag.push(...r.shuffle(items))
  return bag
}

/**
 * Grow a sequence term by term until it leaves [0, max], stops being a whole
 * number, or reaches MAX_LEN. Null when fewer than MIN_LEN terms fit, so a
 * family that overshoots its level's bound simply yields nothing and the
 * slot draws again.
 */
function unfold(first, next, max) {
  const seq = [first]
  while (seq.length < MAX_LEN) {
    const v = next(seq)
    if (!Number.isInteger(v) || v < 0 || v > max) break
    seq.push(v)
  }
  return seq.length >= MIN_LEN ? seq : null
}

const arithmetic = (start, step, max) => unfold(start, s => s[s.length - 1] + step, max)

const signed = n => (n < 0 ? `−${-n}` : `+${n}`)

/**
 * Every family the sheet can print. `levels` lists where it belongs;
 * `build(level, r)` draws from the helpers `r` and returns `{ seq, rule }` or
 * null when the draw did not fit.
 */
export const FAMILIES = [
  {
    id: 'add',
    levels: [1],
    build(level, r = rngHelpers()) {
      const step = r.pick([1, 2, 3, 4, 5, 10])
      // Half the time the run is the skip count as children first meet it
      // (3, 6, 9…); the rest start anywhere, which is the same rule dressed up.
      const start = r.chance(0.5) ? step * r.int(0, 5) : r.int(0, 40)
      const seq = arithmetic(start, step, MAX_VALUE[level])
      return seq && { seq, rule: `+${step}` }
    },
  },
  {
    id: 'subtract',
    levels: [1],
    build(level, r = rngHelpers()) {
      const step = r.pick([1, 2, 3, 4, 5, 10])
      const start = r.int(step * (MAX_LEN - 1), 100)
      const seq = arithmetic(start, -step, MAX_VALUE[level])
      return seq && { seq, rule: `−${step}` }
    },
  },
  {
    id: 'addBig',
    levels: [2],
    build(level, r = rngHelpers()) {
      const step = r.pick([6, 7, 8, 9, 11, 12, 15, 20, 25, 50, 100])
      const down = r.chance(0.3)
      const start = down
        ? step * (MAX_LEN - 1) + r.int(0, step >= 50 ? 300 : 40)
        : r.int(0, step >= 50 ? 300 : 40)
      const seq = arithmetic(start, down ? -step : step, MAX_VALUE[level])
      return seq && { seq, rule: signed(down ? -step : step) }
    },
  },
  {
    id: 'multiply',
    levels: [2, 3],
    build(level, r = rngHelpers()) {
      const factor = level === 2 ? r.pick([2, 3]) : r.pick([2, 3, 4, 5])
      const start = r.int(1, level === 2 ? 5 : 9)
      const seq = unfold(start, s => s[s.length - 1] * factor, MAX_VALUE[level])
      return seq && { seq, rule: `×${factor}` }
    },
  },
  {
    id: 'divide',
    levels: [2, 3],
    build(level, r = rngHelpers()) {
      const divisor = level === 2 ? 2 : r.pick([2, 3])
      // Start at k·d^n so the run stays whole for n + 1 terms, then unfold
      // stops on its own at the first fraction. k stays a single digit so the
      // run lands on a number a child recognises (96, 48, 24…) rather than
      // starting from something like 3008.
      const n = divisor === 2 ? r.int(5, 7) : 5
      const k = r.int(1, Math.min(9, Math.floor(MAX_VALUE[level] / divisor ** n)))
      const seq = unfold(k * divisor ** n, s => s[s.length - 1] / divisor, MAX_VALUE[level])
      return seq && { seq, rule: `÷${divisor}` }
    },
  },
  {
    id: 'alternate',
    levels: [2],
    build(level, r = rngHelpers()) {
      const a = r.pick([2, 3, 4, 5, 10])
      // Either two different additions (+1, +3, +1, +3…) or a step forward
      // and a smaller step back (+5, −2, +5, −2…), never returning to the start.
      const b = r.chance(0.5) ? r.int(1, 5) : -r.int(1, a - 1)
      if (b === a) return null
      const start = r.int(1, 20)
      const seq = unfold(start, s => s[s.length - 1] + (s.length % 2 === 1 ? a : b), MAX_VALUE[level])
      return seq && { seq, rule: `${signed(a)}, ${signed(b)}` }
    },
  },
  {
    id: 'squares',
    levels: [2, 3],
    build(level, r = rngHelpers()) {
      const from = r.int(1, 4)
      const shift = level === 3 && r.chance(0.6) ? r.pick([-1, 1, 2, 3, 10]) : 0
      const seq = []
      for (let n = from; seq.length < MAX_LEN; n++) seq.push(n * n + shift)
      return { seq, rule: shift ? `n²${signed(shift)}` : 'n²' }
    },
  },
  {
    id: 'cubes',
    levels: [3],
    // Only three runs exist, so a second one on the same page is near-identical.
    maxPerPage: 1,
    build(_level, r = rngHelpers()) {
      const from = r.int(1, 3)
      const seq = []
      for (let n = from; seq.length < MAX_LEN; n++) seq.push(n ** 3)
      return { seq, rule: 'n³' }
    },
  },
  {
    id: 'growing',
    levels: [3],
    build(level, r = rngHelpers()) {
      // Steps that themselves grow by a constant: +1, +2, +3… (the triangular
      // numbers when it starts at 1) or +2, +5, +8… Sometimes run downhill
      // from a high start so the gaps widen as the numbers shrink.
      const firstStep = r.int(1, 5)
      const grow = r.int(1, 3)
      const down = r.chance(0.25)
      const start = down ? r.int(60, 99) : r.int(0, 10)
      const seq = unfold(start, s => {
        const step = firstStep + grow * (s.length - 1)
        return s[s.length - 1] + (down ? -step : step)
      }, MAX_VALUE[level])
      return seq && { seq, rule: `${signed(down ? -firstStep : firstStep)}, ${signed(down ? -(firstStep + grow) : firstStep + grow)}, …` }
    },
  },
  {
    id: 'fibonacci',
    levels: [3],
    build(level, r = rngHelpers()) {
      const a = r.int(1, 5)
      const b = r.int(1, 9)
      const seq = unfold(a, s => (s.length === 1 ? b : s[s.length - 1] + s[s.length - 2]), MAX_VALUE[level])
      return seq && { seq, rule: 'a + b' }
    },
  },
  {
    id: 'affine',
    levels: [3],
    build(level, r = rngHelpers()) {
      // Double or triple, then adjust: 1, 3, 7, 15, 31… A fixed point (1 → 1
      // under ×2 −1) would print a constant row, so the second term must move.
      const m = r.pick([2, 3])
      const c = r.pick([-2, -1, 1, 2, 3])
      const start = r.int(1, 5)
      if (m * start + c === start) return null
      const seq = unfold(start, s => m * s[s.length - 1] + c, MAX_VALUE[level])
      return seq && { seq, rule: `×${m} ${signed(c)}` }
    },
  },
  {
    id: 'interleaved',
    levels: [3],
    build(level, r = rngHelpers()) {
      // Two runs braided together: 1, 20, 2, 18, 3, 16… Each has only four
      // terms in the row, so both must be plain arithmetic to stay readable.
      const stepA = r.int(1, 5)
      const stepB = r.pick([-5, -3, -2, 2, 3, 5, 10])
      const startA = r.int(0, 10)
      const startB = stepB < 0 ? r.int(-stepB * 4, 60) : r.int(10, 60)
      const seq = []
      for (let i = 0; i < MAX_LEN; i++) {
        seq.push(i % 2 === 0 ? startA + stepA * (i / 2) : startB + stepB * ((i - 1) / 2))
      }
      if (seq.some(v => v < 0 || v > MAX_VALUE[level])) return null
      return { seq, rule: `${signed(stepA)} / ${signed(stepB)}` }
    },
  },
]

export function familiesFor(level) {
  return FAMILIES.filter(f => f.levels.includes(level))
}

/**
 * Where the gaps go. The last two terms are the classic form; the others
 * make two rows with the same rule read as different exercises and, from
 * Medium up, ask for a term before or inside the visible run so the child
 * has to run the rule backwards as well as forwards.
 */
export const BLANK_MODES = ['tail', 'tailPlus', 'mid', 'head']

const BLANK_WEIGHTS = {
  1: { tail: 6, tailPlus: 4, mid: 0, head: 0 },
  2: { tail: 5, tailPlus: 3, mid: 1, head: 1 },
  3: { tail: 4, tailPlus: 3, mid: 2, head: 1 },
}

function pickMode(level, length, r) {
  const weights = { ...BLANK_WEIGHTS[level] }
  if (length < 7) weights.mid = 0 // no room to keep three terms visible on each side
  const total = Object.values(weights).reduce((s, w) => s + w, 0)
  let draw = r.num(0, total)
  for (const mode of BLANK_MODES) {
    draw -= weights[mode]
    if (draw < 0) return mode
  }
  return 'tail'
}

/** Sorted blank indexes for a row of `length` terms. Exported for tests. */
export function chooseBlanks(length, level, mode, rng) {
  const r = asHelpers(rng)
  mode ??= pickMode(level, length, r)
  if (mode === 'head') return [0, length - 1]
  if (mode === 'mid') {
    const i = r.int(3, length - 4)
    return [i, i + 1]
  }
  const blanks = [length - 2, length - 1]
  // The inner gap keeps two terms visible before it and one between it and
  // the tail, so the row never ends in three blanks; it is skipped on a short
  // row where that would leave too little to go on.
  if (mode === 'tailPlus' && length >= 7) blanks.unshift(r.int(2, length - 4))
  return blanks
}

/** Any fresh constant-step run; used only when every family in the bag has run dry. */
function fallbackRow(level, seen, r) {
  for (let i = 0; i < 100; i++) {
    const step = r.int(1, 9)
    const seq = arithmetic(r.int(0, 50), step, MAX_VALUE[level])
    if (seq && !seen.has(seq.join(','))) return { seq, rule: `+${step}`, family: 'add' }
  }
  return { seq: arithmetic(0, 1, MAX_VALUE[level]), rule: '+1', family: 'add' }
}

/**
 * One page of sequences.
 *
 * A slot walks the bag: the family it lands on gets a few tries to produce
 * a sequence not already on the page, and hands over to the next family if
 * it cannot. A rule label is also held to RULE_CAP appearances until the
 * closing attempts, so a page of Easy is not five rows of "+2" with
 * different starts.
 */
export function generateSheet(count, level, rng = Math.random) {
  const r = asHelpers(rng)
  const families = familiesFor(level)
  const bag = shuffledBag(families, count, r)
  const seen = new Set()
  const rules = new Map()
  const used = new Map()
  const rows = []

  for (let i = 0; i < count; i++) {
    let picked = null
    for (let s = 0; s < families.length && !picked; s++) {
      const family = bag[(i + s) % bag.length]
      if ((used.get(family.id) ?? 0) >= (family.maxPerPage ?? Infinity)) continue
      for (let a = 0; a < ATTEMPTS_PER_FAMILY && !picked; a++) {
        const made = family.build(level, r)
        if (!made) continue
        if (seen.has(made.seq.join(','))) continue
        if (a < ATTEMPTS_PER_FAMILY - 5 && (rules.get(made.rule) ?? 0) >= RULE_CAP) continue
        picked = { ...made, family: family.id }
      }
    }
    const row = picked ?? fallbackRow(level, seen, r)
    seen.add(row.seq.join(','))
    rules.set(row.rule, (rules.get(row.rule) ?? 0) + 1)
    used.set(row.family, (used.get(row.family) ?? 0) + 1)
    rows.push({ ...row, blanks: chooseBlanks(row.seq.length, level, undefined, r) })
  }
  return rows
}
