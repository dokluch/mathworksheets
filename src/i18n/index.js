/**
 * Tiny i18n runtime: dot-key lookup in nested message trees, `{param}`
 * interpolation, plural forms and catalog/page localisation.
 *
 * No DOM, no React, no Node APIs: like src/seo/render.js this runs in the Vite
 * config, the prerender script, the Vercel edge middleware and in tests.
 *
 * Only English is bundled here. The other catalogs are registered on demand:
 * the browser loads the one it needs (./load.js) so a visitor downloads one
 * language, not seven; Node, the edge and the tests register them all
 * (./all.js). A catalog that is not registered falls back to English.
 */
import { WORKSHEETS } from '../worksheets.js'
import { PAGES } from '../pages.js'
import { BRAND, OPERATOR, CONTACT_EMAIL, GITHUB_URL, LICENSE_NAME, LICENSE_URL, SITE_URL } from '../seo/site.js'
import { DEFAULT_LOCALE, LOCALE_META } from './locales.js'
import en from './messages/en.js'

export * from './locales.js'

export const MESSAGES = { en }

/** Adds a locale's catalog to the registry. */
export function registerMessages(locale, messages) {
  MESSAGES[locale] = messages
}

export function hasMessages(locale) {
  return Object.hasOwn(MESSAGES, locale)
}

export function getMessages(locale) {
  return MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE]
}

function getPath(obj, key) {
  let cur = obj
  for (const part of key.split('.')) {
    if (cur == null || typeof cur !== 'object') return undefined
    cur = cur[part]
  }
  return cur
}

/** Raw message value (string, plural object or array) with fallback to English, then to the key itself. */
export function lookup(locale, key) {
  return getPath(MESSAGES[locale], key) ?? getPath(MESSAGES[DEFAULT_LOCALE], key) ?? key
}

/** Replace `{name}` placeholders; unknown placeholders are left intact. */
export function interpolate(template, params = {}) {
  return String(template).replace(/\{(\w+)\}/g, (m, name) => (name in params ? String(params[name]) : m))
}

function pluralCategory(locale, n) {
  try {
    return new Intl.PluralRules(LOCALE_META[locale]?.lang || 'en').select(Number(n))
  } catch {
    return 'other'
  }
}

/**
 * Translate `key` for `locale`.
 * - Without `params` the raw template is returned (callers that escape HTML
 *   before interpolating rely on this).
 * - A plural message is an object `{ zero?, one?, two?, few?, many?, other }`
 *   selected with Intl.PluralRules on `params.n`.
 */
export function t(locale, key, params) {
  let value = lookup(locale, key)
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const category = params && 'n' in params ? pluralCategory(locale, params.n) : 'other'
    value = value[category] ?? value.other ?? key
  }
  return params ? interpolate(value, params) : String(value)
}

/**
 * The catalog entry with its display fields translated. English returns the
 * catalog object itself (src/worksheets.js is the English source of truth);
 * id, slug, grades, color and interactive are never translated.
 */
export function localizeWorksheet(ws, locale = DEFAULT_LOCALE) {
  if (locale === DEFAULT_LOCALE) return ws
  const m = getPath(MESSAGES[locale], `worksheets.${ws.id}`)
  if (!m) return ws
  return {
    ...ws,
    label: m.label ?? ws.label,
    shortDesc: m.shortDesc ?? ws.shortDesc,
    longDesc: m.longDesc ?? ws.longDesc,
    skills: m.skills ?? ws.skills,
    settings: m.settings ?? ws.settings,
    faq: m.faq ?? ws.faq,
  }
}

export function localizedWorksheets(locale = DEFAULT_LOCALE) {
  return WORKSHEETS.map(ws => localizeWorksheet(ws, locale))
}

/**
 * Placeholders available inside translated static-page text (src/pages.js
 * bakes the same values into the English source). Links use the `[label](url)`
 * syntax that render.js turns into HTML / Markdown.
 *
 * The machine-file links are absolute on purpose: inlineHtml/inlineMarkdown
 * run localizePath() over any `[label](/path)`, so a root-relative `/llms.txt`
 * would render as `/fr/llms.txt` on the French page and 404.
 */
export const PAGE_PARAMS = {
  brand: BRAND,
  operator: OPERATOR,
  contact: `[${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL})`,
  license: `[${LICENSE_NAME}](${LICENSE_URL})`,
  github: `[GitHub](${GITHUB_URL})`,
  llms: `[llms.txt](${SITE_URL}/llms.txt)`,
  agents: `[agents.md](${SITE_URL}/agents.md)`,
  catalog: `[worksheets.json](${SITE_URL}/worksheets.json)`,
}

/**
 * A static page (About, Privacy, Terms) with title, navLabel, description and
 * sections translated. English returns the src/pages.js object itself;
 * id, slug and updated are never translated.
 */
export function localizePage(page, locale = DEFAULT_LOCALE) {
  if (locale === DEFAULT_LOCALE) return page
  const m = getPath(MESSAGES[locale], `pages.${page.id}`)
  if (!m) return page
  const fill = s => interpolate(s, PAGE_PARAMS)
  return {
    ...page,
    title: m.title ? fill(m.title) : page.title,
    navLabel: m.navLabel ?? page.navLabel,
    description: m.description ? fill(m.description) : page.description,
    sections: m.sections
      ? m.sections.map(s => ({
          heading: fill(s.heading),
          ...(s.paragraphs ? { paragraphs: s.paragraphs.map(fill) } : {}),
          ...(s.items ? { items: s.items.map(fill) } : {}),
        }))
      : page.sections,
  }
}

export function localizedPages(locale = DEFAULT_LOCALE) {
  return PAGES.map(p => localizePage(p, locale))
}
