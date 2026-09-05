/**
 * Locale table shared by the app, the SEO renderer, the edge middleware, the
 * build scripts and the tests. Pure data and string helpers only.
 *
 * English lives at the site root; every other locale is served under a
 * two-letter path prefix (/fr, /fr/worksheets/<slug>, /fr/developers).
 */

export const DEFAULT_LOCALE = 'en'
export const LOCALES = ['en', 'fr', 'es', 'de', 'it', 'ru', 'zh']

export const LOCALE_META = {
  en: { lang: 'en', hreflang: 'en', og: 'en_US', name: 'English', englishName: 'English' },
  fr: { lang: 'fr', hreflang: 'fr', og: 'fr_FR', name: 'Français', englishName: 'French' },
  es: { lang: 'es', hreflang: 'es', og: 'es_ES', name: 'Español', englishName: 'Spanish' },
  de: { lang: 'de', hreflang: 'de', og: 'de_DE', name: 'Deutsch', englishName: 'German' },
  it: { lang: 'it', hreflang: 'it', og: 'it_IT', name: 'Italiano', englishName: 'Italian' },
  ru: { lang: 'ru', hreflang: 'ru', og: 'ru_RU', name: 'Русский', englishName: 'Russian' },
  zh: { lang: 'zh-Hans', hreflang: 'zh-Hans', og: 'zh_CN', name: '中文', englishName: 'Chinese (Simplified)' },
}

export function isLocale(code) {
  return typeof code === 'string' && LOCALES.includes(code)
}

/** '' for the default locale, '/fr' otherwise. */
export function localePrefix(locale) {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`
}

/**
 * Split a (normalised) pathname into its locale and the locale-free rest.
 *   '/fr/worksheets/x' → { locale: 'fr', rest: '/worksheets/x' }
 *   '/fr'              → { locale: 'fr', rest: '/' }
 *   '/worksheets/x'    → { locale: 'en', rest: '/worksheets/x' }
 *   '/en/x'            → { locale: 'en', rest: '/en/x' }   (so it 404s: English has no prefix)
 * Only codes listed in LOCALES are treated as a prefix.
 */
export function splitLocale(pathname) {
  const p = pathname || '/'
  const m = /^\/([a-z]{2})(?=\/|$)(.*)$/.exec(p)
  if (m && isLocale(m[1]) && m[1] !== DEFAULT_LOCALE) {
    return { locale: m[1], rest: m[2] || '/' }
  }
  return { locale: DEFAULT_LOCALE, rest: p }
}

/** Put a locale-free path under a locale prefix: ('/worksheets/x', 'fr') → '/fr/worksheets/x'; ('/', 'fr') → '/fr'. */
export function localizePath(rest, locale) {
  const base = rest === '/' ? '' : rest
  return `${localePrefix(locale)}${base}` || '/'
}
