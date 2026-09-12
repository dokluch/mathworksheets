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
    examples: ['3 × 4 = □', '7 × 8 = □', '4 × 3 = □', '6 × 9 = □'],
    prerequisites: ['addsub'],
    nextSteps: ['divide', 'colmul'],
    updated: '2026-09-07',
    faq: [
      { q: 'What age are times tables worksheets for?', a: 'Most children meet the times tables in grade 2, around age 7, and are expected to recall them fluently by the end of grade 3. Start with a small range such as 1 to 5, and widen it once recall is quick rather than counted.' },
      { q: 'What do the pre-filled cells do?', a: 'Pre-filling the diagonal (1×1, 2×2, 3×3 …) or a percentage of random cells turns a blank grid into a puzzle. The visible answers give a child footholds to reason from, so a half-filled table is a gentler step than an empty one.' },
      { q: 'In what order should the tables be learned?', a: 'A common order is 2, 5 and 10 first, because their patterns are visible, then 3, 4 and 6, and finally 7, 8 and 9. Because 3 × 4 and 4 × 3 give the same answer, learning one table halves the work on another.' },
    ],
    color: '#2d6cb5',
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
    examples: ['8 + 5 = □', '□ + 6 = 14', '17 − 9 = □', '□ − 4 = 12'],
    prerequisites: [],
    nextSteps: ['coladd', 'compare'],
    updated: '2026-09-07',
    faq: [
      { q: 'What does the missing-number format practise?', a: 'Writing a problem as a + □ = c or □ − b = c asks a child to work backwards rather than just compute left to right. That is the first step towards algebra, and it is why the blank moves position from problem to problem.' },
      { q: 'Which number limit should I choose?', a: 'Within 10 and within 20 suit grade 1, within 100 suits grade 2, and within 1000 suits grade 3. If a child is counting on fingers rather than recalling, drop back one limit rather than adding more problems.' },
      { q: 'What is 67 mode?', a: 'It hides exactly one problem per column whose answer is 67, turning the sheet into a small treasure hunt. It is a way to keep a child scanning their own answers, which is a form of checking.' },
    ],
    color: '#2e7d5b',
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
    examples: ['348 + 275 = □', '67 + 9 = □', '1204 + 856 = □'],
    prerequisites: ['addsub'],
    nextSteps: ['colmul'],
    updated: '2026-09-07',
    faq: [
      { q: 'What grade is column addition for?', a: 'Vertical addition with 2-digit numbers usually starts in grade 2, and 3- and 4-digit numbers follow in grade 3. The skill it depends on is place value: knowing that the 4 in 348 means four tens.' },
      { q: 'What is carrying, or regrouping?', a: 'When a column adds to more than 9, the tens part moves into the next column to the left. 8 + 6 is 14, so the 4 is written and the 1 is carried. Turning on “prefer carrying” makes sure most problems need this step.' },
      { q: 'Why print on a notebook grid?', a: 'One digit per square keeps the ones under the ones and the tens under the tens. Most early column-addition mistakes are misalignment rather than arithmetic, and the grid removes that source of error.' },
    ],
    color: '#17706b',
    interactive: false,
  },
  {
    id: 'colmul',
    slug: 'column-multiplication',
    label: 'Column Multiplication',
    shortDesc: 'Long multiplication practice',
    longDesc:
      'Long multiplication (2 × 2, 3 × 2 or 4 × 2 digits) with room for the partial products and their place-value shifts, printed on a notebook grid. ' +
      'Designed for grade 3 students who already know their times tables and are learning the standard written algorithm.',
    grades: '3',
    skills: ['long multiplication', 'partial products', 'place value'],
    settings: [
      'Preset: 2 × 2, 3 × 2 or 4 × 2 digits',
      'Columns: number of problem columns per page',
    ],
    examples: ['34 × 26 = □', '218 × 47 = □', '1305 × 62 = □'],
    prerequisites: ['multiply'],
    nextSteps: ['coldiv'],
    updated: '2026-09-07',
    faq: [
      { q: 'When is a child ready for long multiplication?', a: 'Usually grade 3, and only once the times tables are recalled rather than worked out. Long multiplication is several small multiplications plus an addition, so shaky recall makes every step slower and harder to check.' },
      { q: 'What are partial products?', a: 'Multiplying 34 by 26 means multiplying 34 by 6 and then by 20, and adding the two results. Each of those results is a partial product, and each gets its own row on the sheet.' },
      { q: 'Why is the second row shifted left?', a: 'The second row multiplies by tens, not ones, so its result is ten times larger and starts one column further left. The shift is place value made visible, not a formatting rule to memorise.' },
    ],
    color: '#8a4b2a',
    interactive: false,
  },
  {
    id: 'divide',
    slug: 'division',
    label: 'Division',
    shortDesc: 'Division facts, with or without remainders',
    longDesc:
      'Short division problems written on one line, such as 12 ÷ 3 = □, with dividends within 20, 50 or 100 and divisors from 2 to 10, so every answer is a times-table fact read backwards. ' +
      'Turn on remainders for problems like 14 ÷ 4 = 3 r 2, where each line leaves a box for the quotient and one for what is left over. The sign prints as ÷ or as a colon, following the convention of each language.',
    grades: '2–3',
    skills: ['division facts', 'remainders', 'inverse of multiplication'],
    settings: [
      'Limit: dividends within 20, 50 or 100',
      'Sign: ÷ or :',
      'Columns: 2, 3 or 4 (26–52 problems)',
      'Allow remainders, with a remainder box on every line',
    ],
    examples: ['12 ÷ 3 = □', '45 ÷ 9 = □', '56 ÷ 7 = □', '20 ÷ 5 = □'],
    prerequisites: ['multiply'],
    nextSteps: ['coldiv'],
    updated: '2026-09-12',
    faq: [
      { q: 'When should children start division facts?', a: 'Division facts usually follow the times tables in grades 2 and 3. A child who knows that 3 × 4 = 12 already knows 12 ÷ 3 and 12 ÷ 4, so start once the matching tables are recalled rather than counted, and choose within 20 for the first sheets.' },
      { q: 'How is this different from long division?', a: 'These problems take one step, from memory or a quick count, and are written on a single line. Long division breaks a large number into several steps like these, so fluent division facts are what make the long division sheet manageable.' },
      { q: 'How should remainders be introduced?', a: 'Turn remainders on once exact division is quick. Most problems then leave something over, but a few still divide exactly and are answered with r 0, so a child has to check that the remainder is smaller than the divisor instead of assuming there is one.' },
    ],
    color: '#a63d2f',
    interactive: false,
  },
  {
    id: 'coldiv',
    slug: 'long-division',
    label: 'Long Division',
    shortDesc: 'Long division practice',
    longDesc:
      'Long division of 3- and 4-digit numbers by a 1- or 2-digit divisor, printed on a notebook grid with the frame drawn and empty squares for the working. ' +
      'The frame can be written the English way (divisor outside the bracket, quotient above the overbar) or the continental way (divisor top right, quotient beneath it), and problems can divide exactly or leave a remainder.',
    grades: '3',
    skills: ['long division', 'remainders', 'place value', 'estimation'],
    settings: [
      'Preset: 3 ÷ 1, 4 ÷ 1 or 4 ÷ 2 digits',
      'Notation: bracket or corner frame',
      'Columns: number of problem columns per page',
      'Allow remainders instead of exact division',
    ],
    examples: ['864 ÷ 6 = □', '3172 ÷ 4 = □', '4164 ÷ 12 = □'],
    prerequisites: ['divide', 'colmul'],
    nextSteps: ['order'],
    updated: '2026-09-07',
    faq: [
      { q: 'When do children learn long division?', a: 'Long division normally arrives at the end of grade 3 or in grade 4, after multiplication facts and subtraction are secure. Each step divides, multiplies, subtracts and brings down, so weakness in any of those shows up quickly.' },
      { q: 'What is the difference between the two notations?', a: 'The bracket form puts the divisor to the left of the dividend with the quotient on an overbar above; the corner form puts the divisor to the top right with the quotient beneath it. They are the same method written differently, and which one a child sees depends on the country they are taught in.' },
      { q: 'Should I allow remainders?', a: 'Start with problems that divide exactly, so the method itself is the only new thing. Turn remainders on once the four steps are automatic, because a leftover forces a child to check that it really is smaller than the divisor.' },
    ],
    color: '#a83a5b',
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
    examples: ['43 ? 34', '17 ? 17', '208 ? 280', '99 ? 100'],
    prerequisites: ['addsub'],
    nextSteps: ['rounding'],
    updated: '2026-09-07',
    faq: [
      { q: 'How do I help a child remember > and <?', a: 'The open end always faces the larger number, so the symbol widens towards “more”. Reading the whole statement aloud — "forty-three is greater than thirty-four" — fixes it faster than drilling the symbol on its own.' },
      { q: 'Why are the number pairs deliberately awkward?', a: 'Pairs like 43 and 34, or 208 and 280, use the same digits in a different order, and about one pair in seven is equal. A child who compares only the first digit gets those wrong, which is exactly the habit the sheet is meant to break.' },
      { q: 'Which limit suits which grade?', a: 'Within 10 and 20 for grade 1, within 100 for grade 2, and within 1000 for grade 3. Comparing longer numbers is really a place-value exercise, so raise the limit only once shorter pairs are quick.' },
    ],
    color: '#9a6212',
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
    examples: ['48 → 50', '350 → 400', '1249 → 1000', '95 → 100'],
    prerequisites: ['compare'],
    nextSteps: ['order'],
    updated: '2026-09-07',
    faq: [
      { q: 'What is the rule for rounding?', a: 'Look at the digit one place to the right of the one you are rounding to. If it is 5 or more, round up; if it is 4 or less, round down. Rounding 48 to the nearest ten gives 50 because the 8 is 5 or more.' },
      { q: 'Why does the sheet keep using numbers ending in 5?', a: 'The 5 boundary is the only case with a convention rather than an obvious answer, and it is where most mistakes happen. The generator deliberately includes those, along with a mix of round-up and round-down cases.' },
      { q: 'When do children learn rounding?', a: 'Rounding to the nearest 10 usually appears in grade 2, with 100 and 1000 following in grade 3. It is the basis of estimation, which is how a child learns to notice that an answer is far too big.' },
    ],
    color: '#8f3b6e',
    interactive: false,
  },
  {
    id: 'patterns',
    slug: 'patterns',
    label: 'Patterns',
    shortDesc: 'Number sequences & series',
    longDesc:
      'Number sequences with missing terms at three difficulty levels: skip counting up and down (easy); bigger steps, doubling and halving, alternating steps and square numbers (medium); ' +
      'geometric progressions, growing steps, Fibonacci-style sums, cubes, double-and-add rules and two sequences braided together (hard). ' +
      'Every page mixes the families of its level and never repeats a sequence. Children find the rule and fill in the blanks, which builds early algebraic thinking.',
    grades: '1–3',
    skills: ['number patterns', 'skip counting', 'sequences', 'algebraic thinking'],
    settings: [
      'Level: easy, medium or hard',
    ],
    examples: ['2, 4, 6, □, 10', '1, 2, 4, 8, □', '1, 1, 2, 3, 5, □', '1, 4, 9, 16, □'],
    prerequisites: [],
    nextSteps: ['multiply'],
    updated: '2026-09-10',
    faq: [
      { q: 'What do number patterns teach?', a: 'Finding the rule behind 2, 4, 6, □, 10 is early algebraic thinking: a child looks for a relationship rather than performing a given operation. It also reinforces skip counting, which supports the times tables.' },
      { q: 'What is the difference between the three levels?', a: 'Easy uses a constant step, such as adding 3 each time, counting up or down. Medium adds bigger steps, doubling and halving, alternating steps and the square numbers. Hard brings in geometric progressions, steps that grow each time, Fibonacci-style sums, cubes, double-and-add rules and two sequences braided together, so a child has to test a guess against several terms before trusting it. From Medium up a gap can also sit at the start or in the middle of the run.' },
      { q: 'My child is stuck on a sequence. What should I do?', a: 'Ask what changes from one number to the next and write the gaps underneath. Once the gaps are visible the rule usually becomes obvious, and the habit of writing them down transfers to harder sequences.' },
    ],
    color: '#5b4a91',
    interactive: false,
  },
  {
    id: 'order',
    slug: 'order-of-operations',
    label: 'Order of Operations',
    shortDesc: 'Which operation comes first',
    longDesc:
      'Multi-step expressions where the answer depends on doing the operations in the right order: multiplication and division before addition and subtraction, and brackets before either. ' +
      'Three levels run from chains of one kind (25 − 14 + 43) through mixed precedence (70 − 7 × 9) to four-term expressions with brackets (38 − (80 − 76) × 7). Every step lands on a whole number between 2 and 100, division is always exact, and the answer boxes show how many digits to expect.',
    grades: '2–3',
    skills: ['order of operations', 'brackets', 'mental arithmetic', 'multi-step problems'],
    settings: [
      'Level: easy, medium or hard',
      'Notation: × ÷ or · : signs',
      'Columns: 1 or 2 per page',
      'Use brackets, or leave them out',
      'Print an answer key',
    ],
    examples: ['25 − 14 + 43 = □□', '30 − (17 + 9) = □', '70 − 7 × 9 = □', '28 + 12 ÷ 2 = □□'],
    prerequisites: ['addsub', 'multiply'],
    nextSteps: ['eqexplore'],
    updated: '2026-09-07',
    faq: [
      { q: 'What is the order of operations?', a: 'Work out anything in brackets first, then all the multiplication and division from left to right, then the addition and subtraction from left to right. It is a convention rather than a discovery: everyone agrees to read 70 − 7 × 9 the same way, so the expression has one answer instead of two.' },
      { q: 'Why does my child get 567 for 70 − 7 × 9?', a: 'Because they worked strictly left to right: 70 − 7 is 63, and 63 × 9 is 567. The correct reading multiplies first, giving 70 − 63 = 7. This is the single most common mistake on these sheets, and the fastest cure is asking a child to underline the multiplication before they write anything.' },
      { q: 'What do the brackets change?', a: 'Brackets promote whatever is inside them to the front of the queue. 30 − 17 + 9 is 22, but 30 − (17 + 9) is 4, because the bracket makes the addition happen first. Every bracket on these sheets changes the answer, so none of them can be safely ignored.' },
      { q: 'Why does each answer have a row of boxes?', a: 'There is one box per digit of the answer, so a child can see whether they are looking for a single digit, a number in the tens, or one in the hundreds. It is a checking aid rather than a hint at the value: an answer that will not fit the boxes is a signal to go back and look at the order again.' },
    ],
    color: '#25457a',
    interactive: false,
  },
  {
    id: 'bongard',
    slug: 'bongard-problems',
    label: 'Bongard Problems',
    shortDesc: 'Find what the left boxes share and the right ones lack',
    longDesc:
      'Visual logic puzzles in the style of Mikhail Bongard: six boxes on the left all follow one rule, six on the right all break it, and the child has to say what the rule is. ' +
      'Every problem is redrawn fresh each time, so the rule stays the same while the figures change. Two, four or six problems per page, with the answers on a separate key.',
    grades: '1–3',
    skills: ['visual reasoning', 'sorting and classifying', 'shapes', 'explaining a rule'],
    settings: [
      'Problems per page: 2, 4 or 6',
      'Level: easy, medium, hard or mixed',
      'Print an answer key',
    ],
    examples: ['○ △ □ │ ● ▲ ■', '▲ ▲ ▲ │ ■ ■ ■', '■ ■ ■ │ ▪ ▪ ▪', '▯ ▯ ▯ │ ▭ ▭ ▭'],
    prerequisites: [],
    nextSteps: ['patterns'],
    updated: '2026-09-08',
    faq: [
      { q: 'What is a Bongard problem?', a: 'A puzzle invented by the Soviet scientist Mikhail Bongard in 1967. Twelve boxes are split into two groups of six: the ones on the left share a property (say, every figure is a triangle) and the ones on the right lack it. There is nothing to calculate; the task is to look, compare and put into words what makes the two groups different.' },
      { q: 'How should a child write the rule?', a: 'As a short phrase describing the left side, such as “filled-in shapes” or “the shape is at the top”. Any rule that is true of all six boxes on the left and none on the right is correct, even when the words differ from the answer key. If a child is stuck, ask what would have to change for a box on the right to belong on the left.' },
      { q: 'Why do the pictures change every time?', a: 'Each problem is generated from its rule rather than copied from a picture: the figures, their sizes and positions are drawn at random on every print and then checked against the rule. A child who has solved “triangles versus four-sided shapes” once meets the same idea again in new drawings, which is exactly the test of whether the rule was understood or the page memorised.' },
    ],
    color: '#6b7a1f',
    interactive: false,
  },
  {
    id: 'eqexplore',
    slug: 'equation-explorer',
    label: 'Equation Explorer',
    shortDesc: 'Solve equations interactively',
    longDesc:
      'An on-screen (not printable) equation solver: drag terms across the equals sign and watch the sign flip, follow the jumps on a number line, then type the answer on the built-in keypad. ' +
      'Correct answers build a streak; wrong ones replay an animated explanation.',
    grades: '2–3',
    skills: ['equations', 'inverse operations', 'number line', 'mental arithmetic'],
    settings: [
      'Operation: addition, subtraction or both',
      'Range: size of the numbers used',
    ],
    examples: ['x + 7 = 12', '15 − x = 8', 'x − 6 = 9'],
    prerequisites: ['addsub'],
    nextSteps: ['patterns'],
    updated: '2026-09-07',
    faq: [
      { q: 'Can I print the Equation Explorer?', a: 'No. It is the one activity on the site meant for the screen: terms are dragged across the equals sign, the number line animates, and answers are checked as they are typed. Every other worksheet here prints on one page.' },
      { q: 'What does moving a term across the equals sign mean?', a: 'An equation stays true as long as both sides change in the same way. Moving a term across flips its sign, so x + 7 = 12 becomes x = 12 − 7. Seeing the sign flip as it happens makes the rule concrete rather than memorised.' },
      { q: 'What age is it for?', a: 'Grades 2 and 3, roughly ages 7 to 9, once addition and subtraction within 100 are comfortable. It is usually a child\'s first sight of a letter standing for an unknown number.' },
    ],
    color: '#1f7a8c',
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
