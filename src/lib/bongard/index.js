/**
 * The Bongard problem set and the sheet generator.
 *
 * A problem is a rule with a generator and a checker (see problems/). This
 * module turns one into twelve concrete panels — six that satisfy the rule
 * on the left, six that break it on the right — by drawing panels until the
 * checker agrees, and assembles a page of distinct problems.
 */
import { rngHelpers } from './rng.js'
import { problems as first } from './problems/bp001-010.js'

export const PROBLEMS = [...first]
export const PROBLEM_BY_ID = Object.fromEntries(PROBLEMS.map(p => [p.id, p]))

export const BANDS = ['easy', 'medium', 'hard']
export const BAND_LEVEL = { easy: 1, medium: 2, hard: 3 }
export const PER_PAGE = [2, 4, 6]
export const PANELS_PER_SIDE = 6
/** Redraws allowed before a panel is accepted as drawn. */
export const MAX_ATTEMPTS = 100

export const ruleKey = problem => `bongard.rules.${problem.id}`

/**
 * One panel for a side. Draws until the checker classifies it correctly;
 * the count of attempts is returned so a test can prove the budget is ample.
 */
export function generatePanel(problem, side, r) {
  const wantLeft = side === 'left'
  let p = null
  for (let attempts = 1; attempts <= MAX_ATTEMPTS; attempts++) {
    p = problem.gen(r, side)
    if (problem.check(p) === wantLeft) return { panel: p, attempts }
  }
  return { panel: p, attempts: MAX_ATTEMPTS + 1 }
}

export function generateProblem(problem, rng = Math.random) {
  const r = typeof rng === 'function' ? rngHelpers(rng) : rng
  const side = name => Array.from({ length: PANELS_PER_SIDE }, () => generatePanel(problem, name, r).panel)
  return { id: problem.id, number: problem.number, rule: ruleKey(problem), left: side('left'), right: side('right') }
}

/** Problems of one band, or every problem for 'all'. */
export function problemsInBand(band) {
  const level = BAND_LEVEL[band]
  return level ? PROBLEMS.filter(p => p.band === level) : PROBLEMS
}

/**
 * `count` problems for one sheet, all different while the band has enough,
 * topped up from the other bands rather than repeating a rule on the page.
 */
export function generateSheet(count, band = 'all', rng = Math.random) {
  const r = rngHelpers(rng)
  const inBand = problemsInBand(band)
  const pool = r.shuffle(inBand)
  if (pool.length < count) pool.push(...r.shuffle(PROBLEMS.filter(p => !inBand.includes(p))))
  return Array.from({ length: count }, (_, i) => generateProblem(pool[i % pool.length], r))
}
