import { useState, useEffect, useCallback } from 'react'
import { findWorksheetById, findWorksheetBySlug } from '../worksheets.js'
import { homeRoute, worksheetRoute, findRoute, normalizePath, pageTitle } from '../seo/render.js'
import { absoluteUrl } from '../seo/site.js'
import { trackPageView } from '../lib/analytics.js'

/** '/worksheets/<slug>' → worksheet id, anything else → null */
export function pathToSheetId(pathname) {
  const m = (pathname || '/').replace(/\/+$/, '').match(/^\/worksheets\/([a-z0-9-]+)$/)
  if (!m) return null
  return findWorksheetBySlug(m[1])?.id ?? null
}

/** worksheet id → '/worksheets/<slug>', null/unknown → '/' */
export function sheetIdToPath(id) {
  const ws = id ? findWorksheetById(id) : null
  return ws ? worksheetRoute(ws).path : '/'
}

export function titleForSheet(id) {
  const ws = id ? findWorksheetById(id) : null
  return pageTitle(ws ? worksheetRoute(ws) : homeRoute())
}

/** Any pathname → a known route; unknown paths fall back to the catalog. */
function routeForPath(pathname) {
  return findRoute(pathname) || homeRoute()
}

/** Navigation target (worksheet id, '/path' or null) → route. */
function resolveTarget(target) {
  if (typeof target === 'string' && target.startsWith('/')) return routeForPath(target)
  const ws = target ? findWorksheetById(target) : null
  return ws ? worksheetRoute(ws) : homeRoute()
}

function syncDocument(route) {
  if (typeof document === 'undefined') return
  document.title = pageTitle(route)
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) canonical.setAttribute('href', absoluteUrl(route.path))
  const alternate = document.querySelector('link[rel="alternate"][type="text/markdown"]')
  if (alternate) alternate.setAttribute('href', absoluteUrl(route.md))
}

/**
 * Tiny history-based router.
 *
 * - The URL wins: /worksheets/<slug> selects that sheet; /about, /privacy,
 *   /terms and /developers show that static page.
 * - On "/" with a remembered sheet (fallbackId) the sheet is restored and the
 *   URL is replaced silently, preserving the old "pick up where you left off".
 * - navigate(target) pushes a history entry; target is a worksheet id, a
 *   site path ('/privacy') or null for the catalog. Back/Forward work via popstate.
 *
 * Returns [activeSheet, navigate, activePage]: the worksheet id (or null) and
 * the static page route (or null). At most one of them is set.
 */
export function useRoute(fallbackId = null) {
  const [route, setRoute] = useState(() => {
    if (typeof window === 'undefined') return homeRoute()
    const fromPath = routeForPath(window.location.pathname)
    const fallback = fromPath.kind === 'home' && fallbackId ? findWorksheetById(fallbackId) : null
    return fallback ? worksheetRoute(fallback) : fromPath
  })

  // Reflect a restored sheet (or an unknown path) in the URL without adding a history entry.
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

  const navigate = useCallback((target) => {
    const next = resolveTarget(target)
    if (normalizePath(window.location.pathname) !== next.path) window.history.pushState({ path: next.path }, '', next.path)
    setRoute(prev => (prev.path === next.path ? prev : next))
  }, [])

  const activeSheet = route.kind === 'worksheet' ? route.worksheet.id : null
  const activePage = route.kind === 'page' || route.kind === 'developers' ? route : null
  return [activeSheet, navigate, activePage]
}
