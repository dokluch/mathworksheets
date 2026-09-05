import { useState, useEffect, useCallback, useRef } from 'react'
import { findWorksheetById, findWorksheetBySlug } from '../worksheets.js'
import { homeRoute, worksheetRoute, sameRouteIn, findRoute, normalizePath, pageTitle } from '../seo/render.js'
import { absoluteUrl } from '../seo/site.js'
import { splitLocale, isLocale, LOCALES, LOCALE_META, DEFAULT_LOCALE } from '../i18n/index.js'
import { trackPageView } from '../lib/analytics.js'

/** '/fr/…' → 'fr', anything without a known prefix → 'en'. */
export function localeFromPath(pathname) {
  return splitLocale(normalizePath(pathname)).locale
}

/** '/worksheets/<slug>' or '/<locale>/worksheets/<slug>' → worksheet id, anything else → null */
export function pathToSheetId(pathname) {
  const { rest } = splitLocale(normalizePath(pathname))
  const m = rest.match(/^\/worksheets\/([a-z0-9-]+)$/)
  if (!m) return null
  return findWorksheetBySlug(m[1])?.id ?? null
}

/** worksheet id → '/<locale>/worksheets/<slug>', null/unknown → the locale's home */
export function sheetIdToPath(id, locale = DEFAULT_LOCALE) {
  const ws = id ? findWorksheetById(id) : null
  return ws ? worksheetRoute(ws, locale).path : homeRoute(locale).path
}

export function titleForSheet(id, locale = DEFAULT_LOCALE) {
  const ws = id ? findWorksheetById(id) : null
  return pageTitle(ws ? worksheetRoute(ws, locale) : homeRoute(locale))
}

/** Any pathname → a known route; unknown paths fall back to the catalog of the path's locale. */
function routeForPath(pathname) {
  return findRoute(pathname) || homeRoute(localeFromPath(pathname))
}

/** Navigation target (worksheet id, '/path' or null) → route in the current locale. */
function resolveTarget(target, locale) {
  if (typeof target === 'string' && target.startsWith('/')) return routeForPath(target)
  const ws = target ? findWorksheetById(target) : null
  return ws ? worksheetRoute(ws, locale) : homeRoute(locale)
}

function syncDocument(route) {
  if (typeof document === 'undefined') return
  document.title = pageTitle(route)
  document.documentElement.lang = LOCALE_META[route.locale].lang
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) canonical.setAttribute('href', absoluteUrl(route.path))
  const alternate = document.querySelector('link[rel="alternate"][type="text/markdown"]')
  if (alternate) alternate.setAttribute('href', absoluteUrl(route.md))
  for (const l of LOCALES) {
    const link = document.querySelector(`link[rel="alternate"][hreflang="${LOCALE_META[l].hreflang}"]`)
    if (link) link.setAttribute('href', absoluteUrl(sameRouteIn(route, l).path))
  }
  const xDefault = document.querySelector('link[rel="alternate"][hreflang="x-default"]')
  if (xDefault) xDefault.setAttribute('href', absoluteUrl(sameRouteIn(route, DEFAULT_LOCALE).path))
}

/**
 * Tiny history-based router.
 *
 * - The URL wins: /worksheets/<slug> selects that sheet; /about, /privacy,
 *   /terms and /developers show that static page. A locale prefix (/fr/…)
 *   selects the language; English has no prefix.
 * - A remembered language (fallbackLocale, an explicit switcher choice) applies
 *   to every unprefixed URL: /worksheets/x becomes /fr/worksheets/x silently.
 *   A prefixed URL is an explicit request and always wins.
 * - On the catalog page the remembered sheet (fallbackId) is restored and the
 *   URL is replaced silently, preserving the old "pick up where you left off".
 * - navigate(target) pushes a history entry in the current locale; target is a
 *   worksheet id, a site path ('/privacy') or null for the catalog.
 *   setLocale(code) pushes the same page under the new locale prefix.
 *   Back/Forward work via popstate.
 *
 * Returns [activeSheet, navigate, activePage, locale, setLocale, pathInLocale]:
 * the worksheet id (or null), the static page route (or null), the current
 * locale and a helper giving the current page's path in another locale.
 */
export function useRoute(fallbackId = null, fallbackLocale = DEFAULT_LOCALE) {
  const [route, setRoute] = useState(() => {
    if (typeof window === 'undefined') return homeRoute()
    const pathname = normalizePath(window.location.pathname)
    let fromPath = routeForPath(pathname)
    if (fromPath.locale === DEFAULT_LOCALE && isLocale(fallbackLocale) && fallbackLocale !== DEFAULT_LOCALE) fromPath = sameRouteIn(fromPath, fallbackLocale)
    const fallback = fromPath.kind === 'home' && fallbackId ? findWorksheetById(fallbackId) : null
    return fallback ? worksheetRoute(fallback, fromPath.locale) : fromPath
  })

  const routeRef = useRef(route)
  routeRef.current = route

  // Reflect a restored sheet/locale (or an unknown path) in the URL without adding a history entry.
  useEffect(() => {
    if (normalizePath(window.location.pathname) !== route.path) {
      window.history.replaceState(window.history.state, '', route.path)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onPop = () => setRoute(routeForPath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    syncDocument(route)
    trackPageView(route.path, pageTitle(route))
  }, [route])

  const go = useCallback((next) => {
    if (normalizePath(window.location.pathname) !== next.path) window.history.pushState({ path: next.path }, '', next.path)
    setRoute(prev => (prev.path === next.path ? prev : next))
  }, [])

  const navigate = useCallback((target) => {
    go(resolveTarget(target, routeRef.current.locale))
  }, [go])

  const setLocale = useCallback((code) => {
    if (!isLocale(code)) return
    go(sameRouteIn(routeRef.current, code))
  }, [go])

  const pathInLocale = useCallback((code) => sameRouteIn(route, code).path, [route])

  const activeSheet = route.kind === 'worksheet' ? route.worksheet.id : null
  const activePage = route.kind === 'page' || route.kind === 'developers' ? route : null
  return [activeSheet, navigate, activePage, route.locale, setLocale, pathInLocale]
}
