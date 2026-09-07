import { useCallback } from 'react'
import { findRoute } from '../seo/render'

/**
 * Click handler for a block of server-rendered HTML: plain left-clicks on links
 * to other site pages are routed in-app, while modified clicks, new-tab links,
 * external sites and .md/.json/.txt files stay native.
 *
 * Shared by components/StaticPage.jsx and components/WorksheetDetails.jsx.
 */
export function useInAppLinks(navigate) {
  return useCallback((e) => {
    const a = e.target.closest?.('a[href]')
    if (!a || e.defaultPrevented) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    if (a.target && a.target !== '_self') return
    const url = new URL(a.getAttribute('href'), window.location.href)
    if (url.origin !== window.location.origin || !findRoute(url.pathname)) return
    e.preventDefault()
    navigate(url.pathname)
  }, [navigate])
}
