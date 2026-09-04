import { useState, useEffect, useCallback } from 'react'
import { findWorksheetById, findWorksheetBySlug } from '../worksheets.js'
import { homeRoute, worksheetRoute, pageTitle } from '../seo/render.js'
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

function syncDocument(id) {
  if (typeof document === 'undefined') return
  const ws = id ? findWorksheetById(id) : null
  const route = ws ? worksheetRoute(ws) : homeRoute()
  document.title = pageTitle(route)
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) canonical.setAttribute('href', absoluteUrl(route.path))
  const alternate = document.querySelector('link[rel="alternate"][type="text/markdown"]')
  if (alternate) alternate.setAttribute('href', absoluteUrl(route.md))
}

/**
 * Tiny history-based router for the active worksheet.
 *
 * - The URL wins: /worksheets/<slug> selects that sheet.
 * - On "/" with a remembered sheet (fallbackId) the sheet is restored and the
 *   URL is replaced silently, preserving the old "pick up where you left off".
 * - navigate(id) pushes a history entry; Back/Forward work via popstate.
 */
export function useRoute(fallbackId = null) {
  const [activeSheet, setActiveSheet] = useState(() => {
    if (typeof window === 'undefined') return null
    const fromPath = pathToSheetId(window.location.pathname)
    if (fromPath) return fromPath
    if (window.location.pathname.replace(/\/+$/, '') === '' && fallbackId && findWorksheetById(fallbackId)) return fallbackId
    return null
  })

  // Reflect a restored sheet in the URL without adding a history entry.
  useEffect(() => {
    const expected = sheetIdToPath(activeSheet)
    if (window.location.pathname.replace(/\/+$/, '') !== expected.replace(/\/+$/, '')) {
      window.history.replaceState(window.history.state, '', expected)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onPop = () => setActiveSheet(pathToSheetId(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    syncDocument(activeSheet)
    trackPageView(sheetIdToPath(activeSheet), titleForSheet(activeSheet))
  }, [activeSheet])

  const navigate = useCallback((id) => {
    const next = id && findWorksheetById(id) ? id : null
    const path = sheetIdToPath(next)
    if (window.location.pathname !== path) window.history.pushState({ sheet: next }, '', path)
    setActiveSheet(next)
  }, [])

  return [activeSheet, navigate]
}
