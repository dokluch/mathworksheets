import { describe, it, expect } from 'vitest'
import { WORKSHEETS } from '../worksheets.js'
import { PAGES } from '../pages.js'
import {
  LOCALES, LOCALE_META, DEFAULT_LOCALE, MESSAGES, t, lookup, interpolate,
  localizeWorksheet, localizedWorksheets, localizePage, localizedPages,
  splitLocale, localizePath, localePrefix, isLocale,
} from './index.js'

const OTHERS = LOCALES.filter(l => l !== DEFAULT_LOCALE)

/** Flatten a message tree to dot keys; plural objects and arrays are leaves. */
function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v) && !('other' in v)) flatten(v, key, out)
    else out[key] = v
  }
  return out
}

function placeholders(value) {
  const s = typeof value === 'string' ? value : Array.isArray(value) ? value.join(' ') : Object.values(value).join(' ')
  // `label` and `labelLower` are interchangeable (German keeps nouns capitalised).
  return new Set([...s.matchAll(/\{(\w+)\}/g)].map(m => (m[1] === 'labelLower' ? 'label' : m[1])))
}

describe('locales', () => {
  it('lists English first and describes every locale', () => {
    expect(LOCALES[0]).toBe('en')
    expect(new Set(LOCALES).size).toBe(LOCALES.length)
    expect(LOCALES).toEqual(['en', 'fr', 'es', 'de', 'it', 'ru', 'zh'])
    for (const l of LOCALES) {
      const meta = LOCALE_META[l]
      expect(meta.lang).toBeTruthy()
      expect(meta.hreflang).toBeTruthy()
      expect(meta.og).toMatch(/^[a-z]{2}_[A-Z]{2}$/)
      expect(meta.name.length).toBeGreaterThan(1)
      expect(meta.englishName.length).toBeGreaterThan(1)
      expect(isLocale(l)).toBe(true)
    }
    expect(isLocale('xx')).toBe(false)
    expect(isLocale(undefined)).toBe(false)
  })

  it('splits and rebuilds locale-prefixed paths; /en is never a prefix', () => {
    expect(splitLocale('/fr/worksheets/x')).toEqual({ locale: 'fr', rest: '/worksheets/x' })
    expect(splitLocale('/fr')).toEqual({ locale: 'fr', rest: '/' })
    expect(splitLocale('/worksheets/x')).toEqual({ locale: 'en', rest: '/worksheets/x' })
    expect(splitLocale('/')).toEqual({ locale: 'en', rest: '/' })
    expect(splitLocale('/en/x')).toEqual({ locale: 'en', rest: '/en/x' })
    expect(splitLocale('/frx/y')).toEqual({ locale: 'en', rest: '/frx/y' })
    expect(splitLocale('/xx/y')).toEqual({ locale: 'en', rest: '/xx/y' })
    expect(localePrefix('en')).toBe('')
    expect(localePrefix('de')).toBe('/de')
    expect(localizePath('/', 'fr')).toBe('/fr')
    expect(localizePath('/', 'en')).toBe('/')
    expect(localizePath('/privacy', 'zh')).toBe('/zh/privacy')
    for (const l of LOCALES) {
      for (const rest of ['/', '/developers', '/worksheets/rounding', '/privacy']) {
        expect(splitLocale(localizePath(rest, l))).toEqual({ locale: l, rest })
      }
    }
  })
})

describe('t()', () => {
  it('interpolates, falls back to English and then to the key', () => {
    expect(t('en', 'common.within', { n: 20 })).toBe('Within 20')
    expect(t('fr', 'common.within', { n: 20 })).not.toBe('Within 20')
    expect(t('fr', 'does.not.exist')).toBe('does.not.exist')
    expect(lookup('xx', 'common.print')).toBe('Print')
    expect(t('en', 'common.within')).toBe('Within {n}')
    expect(interpolate('{a} and {b}', { a: 1 })).toBe('1 and {b}')
  })

  it('selects plural forms with Intl.PluralRules', () => {
    expect(t('en', 'eq.streak', { n: 2 })).toBe('2 in a row')
    expect(t('en', 'eq.streak', { n: 1 })).toBe('1 in a row')
    const ru = [1, 2, 5, 21].map(n => t('ru', 'eq.streak', { n }))
    expect(ru.every(s => s.length > 2)).toBe(true)
    expect(ru[0].replace(/^1 /, '')).toBe(ru[3].replace(/^21 /, ''))
    expect(t('ru', 'eq.streak', { n: 2 })).not.toBe(t('ru', 'eq.streak', { n: 5 }).replace(/^5/, '2'))
    expect(t('zh', 'eq.streak', { n: 3 })).toContain('3')
    expect(t('fr', 'eq.streak')).toBe(MESSAGES.fr.eq.streak.other)
  })
})

describe('message files', () => {
  const en = flatten(MESSAGES.en)
  const enKeys = Object.keys(en).filter(k => !k.startsWith('worksheets.') && !k.startsWith('pages.'))

  it('English has no worksheet or page blocks (those live in src/worksheets.js and src/pages.js)', () => {
    expect(MESSAGES.en.worksheets).toBeUndefined()
    expect(MESSAGES.en.pages).toBeUndefined()
    expect(enKeys.length).toBeGreaterThan(150)
  })

  for (const locale of OTHERS) {
    describe(locale, () => {
      const m = flatten(MESSAGES[locale])
      const keys = Object.keys(m).filter(k => !k.startsWith('worksheets.') && !k.startsWith('pages.'))

      it('has exactly the English key set with the same placeholders and non-empty values', () => {
        expect(keys.sort()).toEqual([...enKeys].sort())
        for (const k of enKeys) {
          expect(placeholders(m[k]), `${locale}:${k}`).toEqual(placeholders(en[k]))
          const v = m[k]
          if (typeof v === 'string') expect(v.trim().length, `${locale}:${k}`).toBeGreaterThan(0)
          else if (!Array.isArray(v)) expect(typeof v.other, `${locale}:${k}.other`).toBe('string')
        }
      })

      it('translates every worksheet with matching skills and settings counts', () => {
        for (const ws of WORKSHEETS) {
          const w = MESSAGES[locale].worksheets?.[ws.id]
          expect(w, `${locale}:worksheets.${ws.id}`).toBeTruthy()
          for (const f of ['label', 'shortDesc', 'longDesc']) expect(typeof w[f], `${locale}:${ws.id}.${f}`).toBe('string')
          // CJK text carries more meaning per character than Latin or Cyrillic script.
          expect(w.longDesc.length).toBeGreaterThan(locale === 'zh' ? 40 : 80)
          expect(w.skills.length, `${locale}:${ws.id}.skills`).toBe(ws.skills.length)
          expect(w.settings.length, `${locale}:${ws.id}.settings`).toBe(ws.settings.length)
        }
        const labels = localizedWorksheets(locale).map(w => w.label)
        expect(new Set(labels).size).toBe(labels.length)
      })

      it('translates every static page section by section', () => {
        for (const page of PAGES) {
          const p = MESSAGES[locale].pages?.[page.id]
          expect(p, `${locale}:pages.${page.id}`).toBeTruthy()
          for (const f of ['title', 'navLabel', 'description']) expect(typeof p[f], `${locale}:${page.id}.${f}`).toBe('string')
          expect(p.sections.length, `${locale}:${page.id}.sections`).toBe(page.sections.length)
          page.sections.forEach((s, i) => {
            const ts = p.sections[i]
            expect(typeof ts.heading).toBe('string')
            expect(ts.paragraphs?.length ?? 0, `${locale}:${page.id}.sections[${i}].paragraphs`).toBe(s.paragraphs?.length ?? 0)
            expect(ts.items?.length ?? 0, `${locale}:${page.id}.sections[${i}].items`).toBe(s.items?.length ?? 0)
          })
          const localized = localizePage(page, locale)
          const all = [localized.title, localized.description, ...localized.sections.flatMap(s => [s.heading, ...(s.paragraphs || []), ...(s.items || [])])]
          for (const text of all) expect(text, `${locale}:${page.id} leaves a placeholder`).not.toMatch(/\{\w+\}/)
          expect(all.join(' ')).toContain('contact@')
        }
        const navLabels = localizedPages(locale).map(p => p.navLabel)
        expect(new Set(navLabels).size).toBe(navLabels.length)
      })
    })
  }
})

describe('localizeWorksheet / localizePage', () => {
  it('returns the English source object untouched and never translates identity fields', () => {
    const ws = WORKSHEETS.find(w => w.id === 'rounding')
    expect(localizeWorksheet(ws, 'en')).toBe(ws)
    expect(localizeWorksheet(ws)).toBe(ws)
    const fr = localizeWorksheet(ws, 'fr')
    expect(fr).not.toBe(ws)
    expect(fr.label).not.toBe(ws.label)
    expect(fr.longDesc).not.toBe(ws.longDesc)
    expect(fr).toMatchObject({ id: ws.id, slug: ws.slug, grades: ws.grades, color: ws.color, interactive: ws.interactive })
    expect(localizePage(PAGES[0], 'en')).toBe(PAGES[0])
    const de = localizePage(PAGES[0], 'de')
    expect(de.title).not.toBe(PAGES[0].title)
    expect(de).toMatchObject({ id: PAGES[0].id, slug: PAGES[0].slug, updated: PAGES[0].updated })
  })
})
