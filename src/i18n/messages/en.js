/**
 * English messages: the reference key set. Every other locale file must have
 * exactly the same keys (minus `worksheets.*`, whose English source of truth
 * is src/worksheets.js) with the same `{param}` placeholders; a test enforces it.
 *
 * Values are plain text. They feed both HTML and Markdown, so callers escape
 * the template before injecting trusted fragments (links, code) as params.
 */
import { TAGLINE, DESCRIPTION, BRAND_ALT } from '../../seo/site.js'

export default {
  site: {
    tagline: TAGLINE,
    description: DESCRIPTION,
    brandAlt: BRAND_ALT,
  },

  seo: {
    homeTitle: '{brand} – {tagline}',
    worksheetTitle: '{label} Worksheets · {brand}',
    worksheetDescription: 'Free printable {labelLower} worksheets for grades {grades}. {shortDesc}. Randomized every time, prints on one page.',
    gradeOne: 'Grade {grades}',
    gradeRange: 'Grades {grades}',
    ogAltHome: '{brand} – {tagline}',
    ogAltWorksheet: '{label} worksheet preview – {brand}',
    worksheetHeading: '{label} Worksheets',
    worksheetName: '{brand} {label}',
    worksheetList: '{brand} worksheets',
    learningResourceWorksheet: 'Worksheet',
    learningResourceInteractive: 'Interactive exercise',
    featureItem: '{label}: {shortDesc}',
  },

  static: {
    breadcrumb: 'Breadcrumb',
    worksheetTypes: 'Worksheet types',
    lastUpdated: 'Last updated {date}',
    footerSite: 'Site',
    home: {
      subtitle: 'Free, randomized practice sheets you can print in one click.',
      intro1: '{brand} is a free, open-source generator of printable math worksheets for grades 1–3 (ages 6–9). Each sheet is randomized every time you open or regenerate it, so children get fresh practice instead of memorising one page. Pick a worksheet, adjust the difficulty (number range, digits, layout, columns) and print it from your browser; your settings are remembered on this device for next time.',
      intro2: 'The catalog covers multiplication tables, addition and subtraction drills with missing numbers, vertical column addition with carrying, long multiplication, long division, comparing numbers with >, < and =, rounding to the nearest 10, 100 and 1000, and number patterns. The Equation Explorer is an on-screen activity where children move terms across the equals sign and check their answer on a number line.',
      worksheets: 'Worksheets',
      howItWorks: 'How it works',
      step1: 'Choose a worksheet from the list above.',
      step2: 'Set the difficulty: number limit, digits, columns or level.',
      step3: 'Press Regenerate for a new random set, then Print. Sheets are laid out to fit an A4 or Letter page.',
      audienceHeading: 'For teachers, parents and AI agents',
      audienceText: 'Worksheets are generated in the browser: nothing is uploaded, there is no account and no cost. {brand} was built by a parent to supplement a grade 1–3 math curriculum and is free to use and adapt for non-commercial purposes.',
    },
    worksheet: {
      skills: 'Skills',
      format: 'Format',
      formatInteractive: 'interactive, on screen',
      formatPrintable: 'printable, randomized on every load',
      settings: 'Settings',
      examples: 'Example problems',
      faq: 'Frequently asked questions',
      howToUseWorksheet: 'How to use this worksheet',
      howToUseActivity: 'How to use this activity',
      step1: 'Open {url}.',
      step2: 'Adjust the settings above; they are saved in your browser.',
      step3Printable: 'Press Regenerate for a new random set, then Print.',
      step3Interactive: 'Type the answer and press Check; press Next for a new equation.',
      others: 'Other {brand} worksheets',
      partOf: 'Part of {link}.',
      url: 'URL',
    },
  },

  md: {
    agentIntro: 'Every page is also available as Markdown: append `.md` to the path or request it with `Accept: text/markdown`.',
    llmsNote: 'index for language models',
    catalogNote: 'machine-readable worksheet catalog',
    sitemapLink: 'Sitemap',
    homeIntro: '{brand} is a free, open-source generator of printable math worksheets for grades 1–3 (ages 6–9). Each sheet is randomized every time it is opened or regenerated. Pick a worksheet, adjust the difficulty (number range, digits, layout, columns) and print it from the browser; settings are remembered per device. Worksheets are generated client-side: no account, no upload, no cost.',
    worksheetItem: '{link}: {shortDesc} (grades {grades})',
    howItWorks: 'How it works',
    step1: 'Choose a worksheet.',
    step2: 'Set the difficulty: number limit, digits, columns or level.',
    step3: 'Press Regenerate for a new random set, then Print. Sheets fit an A4 or Letter page.',
    forDevelopers: 'For developers and AI agents',
    howToUse: 'How to use',
    wsStep1: 'Open {url}.',
    wsStep2: 'Adjust the settings; they are saved in the browser.',
    devLlmsNote: 'llmstxt.org index',
    devLlmsFullNote: "every page's Markdown in one file",
    devIndexNote: 'the home page as Markdown',
    negotiationText: 'Every page URL answers `Accept: text/markdown` with `Content-Type: text/markdown; charset=utf-8` and `Vary: Accept` (acceptmarkdown.com convention). HTML responses carry `Link: <…md>; rel="alternate"; type="text/markdown"`. Requests that accept neither HTML nor Markdown get `406 Not Acceptable`. Unknown paths return HTTP 404 with a Markdown body that lists where to look next.',
    languagesText: 'English pages live at the site root; the same pages are available in {languages} under a two-letter prefix (for example {example}). Every page links its translations with hreflang.',
    adding1: 'Add an entry to `src/worksheets.js` (id, slug, label, descriptions, grades, skills, settings) and its translations to `src/i18n/messages/<locale>.js`.',
    adding2: 'Create the component in `src/components/` and register it in the `COMPONENTS` and `ICONS` maps in `src/App.jsx`.',
    adding3: 'Run `npm test` and `npm run build`; static pages, Markdown twins, sitemap, llms.txt and the catalog JSON are regenerated from the catalog.',
    markdownLink: 'Markdown',
    lastUpdated: 'Last updated',
    moreFrom: 'More from {brand}',
    homeLink: '{brand} home',
  },

  llms: {
    optionalLocale: 'Home page in {language}',
  },

  notFound: {
    title: '404 – Page not found',
    body: 'The path {path}does not exist on {site}. This response has HTTP status 404.',
    whereNext: 'Where to look next',
    home: '{brand} home',
    worksheet: '{label} worksheets',
    sitemap: 'Sitemap',
    llms: 'llms.txt',
    catalog: 'Worksheet catalog (JSON)',
    twinMd: 'Every HTML page also has a Markdown twin (append `.md` or send `Accept: text/markdown`).',
    twinHtml: 'Every page also has a Markdown twin: append {code} or send {accept}.',
  },

  app: {
    subtitle: 'Printable math worksheets for grades 1–3',
    allSheets: 'All sheets',
    worksheetTypes: 'Worksheet types',
    sourceOnGitHub: 'Source on GitHub',
    language: 'Language',
    resume: 'Pick up where you left off',
    skipToContent: 'Skip to content',
  },

  common: {
    regenerate: 'Regenerate',
    print: 'Print',
    printWorksheet: 'Print worksheet',
    printFooterTagline: 'Free printable math resources',
    screenOnly: "The Equation Explorer is made for the screen, so there is nothing to print. Pick any other worksheet for a sheet you can print.",
    answerKey: "Answer key",
    answerKeyOption: "Print an answer key",
    columns: 'Columns',
    limit: 'Limit',
    range: 'Range',
    operation: 'Operation',
    layout: 'Layout',
    difficulty: 'Difficulty',
    numberSize: 'Number size',
    options: 'Options',
    within: 'Within {n}',
    withinMeta: 'within {n}',
    fieldName: 'Name',
    fieldDate: 'Date',
    fieldSet: 'Set',
  },

  multiply: {
    to: 'to',
    rangeStart: 'Range start',
    rangeEnd: 'Range end',
    fillDiagonal: 'Fill diagonal',
    shuffleHeaders: 'Shuffle rows and columns',
    emptyRange: "The range runs backwards, so there is nothing to print. Set the second number higher than the first — 1 to 10, for example.",
    tooWide: "That range makes a table too wide to print on one page. Keep the two numbers within 15 of each other — 1 to 12, for example.",
    prefill: 'Pre-fill {pct}%',
    tableAria: 'Multiplication table',
    title: "Multiplication",
    meta: "{start} to {end}",
  },

  addsub: {
    inline: 'Inline',
    stacked: 'Stacked',
    sixtySeven: '67 mode',
    title: 'Addition & Subtraction',
  },

  coladd: {
    digitPreset: '{d}-digit',
    preferCarry: 'Prefer carry practice',
    title: 'Column Addition',
    meta: '{d}-digit numbers',
  },

  colmul: {
    preset: '{a} x {b} digits',
    title: 'Column Multiplication',
    meta: 'long multiplication · {preset}',
    problemAria: '{a} times {b}',
  },

  coldiv: {
    preset: '{a} ÷ {b} digits',
    title: 'Long Division',
    meta: 'long division · {preset}',
    notation: 'Notation',
    bracket: 'Bracket',
    corner: 'Corner',
    allowRemainder: 'Allow remainders',
    // Which frame this language's schools use; the setting overrides it once chosen.
    defaultNotation: 'bracket',
    problemAria: '{dividend} divided by {divisor}',
    quotientAria: { one: 'quotient: {n} empty box', other: 'quotient: {n} empty boxes' },
  },

  compare: {
    title: 'Comparison',
  },

  rounding: {
    roundTo: 'Round to',
    nearest: 'Nearest {n}',
    title: 'Rounding',
    meta: 'to the nearest {n}',
  },

  patterns: {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    title: 'Number Patterns',
    instructions: 'Fill in the missing numbers in each sequence.',
  },

  eq: {
    newProblem: 'New',
    streak: { one: '{n} in a row', other: '{n} in a row' },
    hint: 'Tip: drag a number across the = sign to rearrange',
    reset: 'Reset equation',
    check: 'Check',
    next: 'Next',
    keypad: 'Numeric keypad',
    backspace: 'Backspace',
    clear: 'Clear',
    yourAnswer: 'Your answer',
    drag: 'Drag {n} to rearrange equation',
    numberLineAria: 'Number line showing {a} {op} {b} = {result}',
    correct: 'Correct!',
    wrong: 'Not quite — try again or see how it works below',
    numberLine: 'Number Line',
    tenFrame: 'Ten Frame',
    replay: 'Replay',
    gotIt: 'Got it',
  },

  error: {
    title: 'Something went wrong',
    hint: 'Try refreshing the page.',
    reload: 'Reload',
  },
}
