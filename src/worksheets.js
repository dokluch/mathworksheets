/**
 * Single source of truth for the worksheet catalog.
 *
 * Pure data, no JSX or icons, so it can be imported by the React app, the
 * Vite HTML plugin, the post-build prerender script, the Vercel middleware
 * and the tests alike. Icons live in App.jsx (ICONS map keyed by id).
 */

export const WORKSHEETS = [
  {
    id: 'multiply',
    slug: 'multiplication',
    label: 'Multiplication',
    shortDesc: 'Times tables & grid practice',
    longDesc:
      'A multiplication table grid for any range of factors, with optional pre-filled cells so children can spot patterns before filling in the rest. ' +
      'Useful for learning the times tables by heart, checking recall speed and practising the commutative property (3 × 4 = 4 × 3).',
    grades: '2–3',
    skills: ['times tables', 'multiplication facts', 'number patterns'],
    settings: [
      'Table range: choose the first and last factor',
      'Pre-fill the diagonal squares (1×1, 2×2, …)',
      'Percentage of randomly pre-filled cells',
    ],
    color: '#2563eb',
    interactive: false,
  },
  {
    id: 'addsub',
    slug: 'add-subtract',
    label: 'Add & Subtract',
    shortDesc: 'Addition & subtraction drills',
    longDesc:
      'Randomized addition and subtraction problems within 10, 20, 100 or 1000, with the blank placed at a random position (a + □ = c, □ − b = c, a − b = □). ' +
      'Choose inline or stacked layout and 2 to 4 columns; the “67 mode” hides exactly one problem per column whose answer is 67 for a small treasure hunt.',
    grades: '1–3',
    skills: ['addition', 'subtraction', 'missing addend', 'mental arithmetic'],
    settings: [
      'Operation: addition, subtraction or both',
      'Limit: within 10, 20, 100 or 1000',
      'Layout: inline or stacked (vertical)',
      'Columns: 2, 3 or 4 (20–40 problems)',
      '67 mode: one hidden answer of 67 per column',
    ],
    color: '#059669',
    interactive: false,
  },
  {
    id: 'coladd',
    slug: 'column-addition',
    label: 'Column Addition',
    shortDesc: 'Vertical multi-digit addition',
    longDesc:
      'Vertical (column) addition of 2-, 3- or 4-digit numbers laid out on a notebook grid, one digit per cell, so children practise aligning place values and carrying. ' +
      'The “prefer carrying” option generates problems that need at least one carry.',
    grades: '2–3',
    skills: ['column addition', 'carrying / regrouping', 'place value'],
    settings: [
      'Digits: 2-digit, 3-digit or 4-digit numbers',
      'Columns: number of problem columns per page',
      'Prefer problems that require carrying',
    ],
    color: '#0f766e',
    interactive: false,
  },
  {
    id: 'colmul',
    slug: 'column-multiplication',
    label: 'Column Multiplication',
    shortDesc: 'Long multiplication practice',
    longDesc:
      'Long multiplication (3 × 2 digits or 4 × 2 digits) with room for the partial products and their place-value shifts, printed on a notebook grid. ' +
      'Designed for grade 3 students who already know their times tables and are learning the standard written algorithm.',
    grades: '3',
    skills: ['long multiplication', 'partial products', 'place value'],
    settings: [
      'Preset: 3 × 2 digits or 4 × 2 digits',
      'Columns: number of problem columns per page',
    ],
    color: '#7c2d12',
    interactive: false,
  },
  {
    id: 'compare',
    slug: 'comparison',
    label: 'Comparison',
    shortDesc: 'Greater than, less than, equal',
    longDesc:
      'Pairs of numbers to compare with >, < or =. The generator deliberately picks tricky pairs: swapped digits (43 vs 34), repeated digits, off-by-one neighbours and about 15% equal pairs, ' +
      'so children have to read every digit instead of guessing from the first one.',
    grades: '1–3',
    skills: ['comparing numbers', 'place value', 'inequality symbols'],
    settings: [
      'Limit: within 10, 20, 100 or 1000',
      'Columns: number of problem columns per page',
    ],
    color: '#d97706',
    interactive: false,
  },
  {
    id: 'rounding',
    slug: 'rounding',
    label: 'Rounding',
    shortDesc: 'Round to nearest 10, 100, 1000',
    longDesc:
      'Rounding practice to the nearest 10, 100 or 1000 with 20–40 randomized numbers per sheet. ' +
      'Numbers are chosen so that both “round up” and “round down” cases appear, including the tricky 5 boundary.',
    grades: '2–3',
    skills: ['rounding', 'estimation', 'place value'],
    settings: [
      'Place: nearest 10, 100 or 1000',
      'Columns: number of problem columns per page',
    ],
    color: '#dc2626',
    interactive: false,
  },
  {
    id: 'patterns',
    slug: 'patterns',
    label: 'Patterns',
    shortDesc: 'Number sequences & series',
    longDesc:
      'Number sequences with missing terms at three difficulty levels: constant steps (easy), multiplying or alternating steps (medium) and combined rules (hard). ' +
      'Children find the rule and fill in the blanks, which builds early algebraic thinking.',
    grades: '1–3',
    skills: ['number patterns', 'skip counting', 'sequences', 'algebraic thinking'],
    settings: [
      'Level: easy, medium or hard',
    ],
    color: '#7c3aed',
    interactive: false,
  },
  {
    id: 'eqexplore',
    slug: 'equation-explorer',
    label: 'Equation Explorer',
    shortDesc: 'Solve equations interactively',
    longDesc:
      'An on-screen (not printable) equation solver: drag terms across the equals sign and watch the sign flip, follow the jumps on a number line, then type the answer on the built-in keypad. ' +
      'Correct answers earn a streak and confetti; wrong ones replay an animated explanation.',
    grades: '2–3',
    skills: ['equations', 'inverse operations', 'number line', 'mental arithmetic'],
    settings: [
      'Operation: addition, subtraction or both',
      'Range: size of the numbers used',
    ],
    color: '#0891b2',
    interactive: true,
  },
]

export const WORKSHEET_BY_ID = Object.fromEntries(WORKSHEETS.map(w => [w.id, w]))
export const WORKSHEET_BY_SLUG = Object.fromEntries(WORKSHEETS.map(w => [w.slug, w]))

export function findWorksheetById(id) {
  return WORKSHEET_BY_ID[id] ?? null
}

export function findWorksheetBySlug(slug) {
  return WORKSHEET_BY_SLUG[slug] ?? null
}
