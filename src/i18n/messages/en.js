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
    developersTitle: 'Developer Resources · {brand}',
    worksheetTitle: '{label} Worksheets · {brand}',
    developersDescription: '{brand} developer resources: open-source repository, worksheet catalog JSON, Markdown content negotiation, llms.txt and sitemap.',
    worksheetDescription: 'Free printable {labelLower} worksheets for grades {grades}. {shortDesc}. Randomized every time, prints on one page.',
    gradeOne: 'Grade {grades}',
    gradeRange: 'Grades {grades}',
    ogAltHome: '{brand} – {tagline}',
    ogAltWorksheet: '{label} worksheet preview – {brand}',
    ogAltDevelopers: '{brand} developer resources',
    worksheetHeading: '{label} Worksheets',
    worksheetName: '{brand} {label}',
    developersHeading: '{brand} Developer Resources',
    developersCrumb: 'Developer Resources',
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
      intro2: 'The catalog covers multiplication tables, addition and subtraction drills with missing numbers, vertical column addition with carrying, long multiplication, comparing numbers with >, < and =, rounding to the nearest 10, 100 and 1000, and number patterns. The Equation Explorer is an on-screen activity where children move terms across the equals sign and check their answer on a number line.',
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
      howToUseWorksheet: 'How to use this worksheet',
      howToUseActivity: 'How to use this activity',
      step1: 'Open {url} (JavaScript required).',
      step2: 'Adjust the settings above; they are saved in your browser.',
      step3Printable: 'Press Regenerate for a new random set, then Print.',
      step3Interactive: 'Type the answer and press Check; press Next for a new equation.',
      others: 'Other {brand} worksheets',
      partOf: 'Part of {link}.',
      url: 'URL',
    },
    developers: {
      subtitle: 'Open source, machine-readable and agent-friendly.',
      intro: '{brand} (also known as “{brandAlt}”) is a React 19 + Vite single-page app. There is no server API: worksheets are generated client-side. Everything below is static and cacheable.',
      resources: 'Resources',
      sourceLink: 'Source code on GitHub',
      catalogDesc: 'machine-readable catalog of every worksheet with slugs, URLs, grades, skills and settings',
      llmsDesc: 'llmstxt.org index and full content for language models',
      indexMdDesc: 'this site as Markdown; every HTML page has a {code} twin',
      negotiationHeading: 'Markdown content negotiation',
      negotiationText: 'Every page URL answers {accept} with {contentType} and {vary}, following the acceptmarkdown.com convention. HTML responses carry a {link} header pointing at the twin. Unknown paths return HTTP 404 with a Markdown body listing where to look next.',
      languagesHeading: 'Languages',
      languagesText: 'English pages live at the site root. The same pages are available in {languages} under a two-letter path prefix (for example {example}); each page links every translation with hreflang and lists them in the sitemap. llms.txt and llms-full.txt are English only.',
      idsHeading: 'Worksheet ids and URLs',
      addingHeading: 'Adding a worksheet',
      adding1: 'Add an entry to {file} (id, slug, label, descriptions, grades, skills, settings) and its translations to {messages}.',
      adding2: 'Create the component in {dir} and register it in the {components} and {icons} maps in {app}.',
      adding3: 'Run {test} and {build}; the static pages, Markdown twins, sitemap, llms.txt and catalog JSON are regenerated from the catalog.',
    },
    agentLinks: {
      text: 'Every page is also available as Markdown: append {code} to the path or send {accept}. See {llms}, the {catalog}, the {sitemap} and the {developers}. Source code is on {github} under {license}.',
      llms: 'llms.txt',
      catalog: 'worksheet catalog (JSON)',
      sitemap: 'sitemap',
      developers: 'developer resources',
      github: 'GitHub',
    },
  },

  md: {
    agentIntro: 'Every page is also available as Markdown: append `.md` to the path or request it with `Accept: text/markdown`.',
    llmsNote: 'index for language models',
    catalogNote: 'machine-readable worksheet catalog',
    developersLink: 'Developer resources',
    sitemapLink: 'Sitemap',
    sourceLink: 'Source on GitHub',
    homeIntro: '{brand} is a free, open-source generator of printable math worksheets for grades 1–3 (ages 6–9). Each sheet is randomized every time it is opened or regenerated. Pick a worksheet, adjust the difficulty (number range, digits, layout, columns) and print it from the browser; settings are remembered per device. Worksheets are generated client-side: no account, no upload, no cost.',
    worksheetItem: '{link}: {shortDesc} (grades {grades})',
    howItWorks: 'How it works',
    step1: 'Choose a worksheet.',
    step2: 'Set the difficulty: number limit, digits, columns or level.',
    step3: 'Press Regenerate for a new random set, then Print. Sheets fit an A4 or Letter page.',
    forDevelopers: 'For developers and AI agents',
    howToUse: 'How to use',
    wsStep1: 'Open {url} (JavaScript required).',
    wsStep2: 'Adjust the settings; they are saved in the browser.',
    developersIntro: '{brand} (also known as “{brandAlt}”) is an open-source React 19 + Vite single-page app that generates printable math worksheets client-side. There is no server API; every resource below is a static file.',
    devCatalogNote: 'machine-readable catalog of every worksheet (slug, URL, Markdown URL, grades, skills, settings)',
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
    developers: 'Developer resources',
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
  },

  common: {
    regenerate: 'Regenerate',
    print: 'Print',
    printCta: {
      title: 'Ready to print?',
      hint: 'The sheet fits on one page. Regenerate first if you want a different set of problems.',
      button: 'Print worksheet',
    },
    columns: 'Columns',
    limit: 'Limit',
    range: 'Range',
    operation: 'Operation',
    layout: 'Layout',
    difficulty: 'Difficulty',
    numberSize: 'Number size',
    within: 'Within {n}',
    withinMeta: 'within {n}',
  },

  multiply: {
    to: 'to',
    rangeStart: 'Range start',
    rangeEnd: 'Range end',
    fillDiagonal: 'Fill diagonal',
    prefill: 'Pre-fill {pct}%',
    tableAria: 'Multiplication table',
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
