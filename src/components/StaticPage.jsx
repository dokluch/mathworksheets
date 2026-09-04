import { useEffect } from 'react'
import { staticBody, findRoute, pageTitle } from '../seo/render'

/**
 * Renders a non-worksheet page (About, Privacy, Terms, Developer Resources)
 * from the same HTML string the prerender step emits, so the crawlable
 * fallback and the React view can never drift apart. The content is authored
 * in src/pages.js and escaped by the renderer.
 *
 * Plain left-clicks on links to other site pages are routed in-app; links to
 * .md/.json/.txt files and external sites stay native.
 */
export default function StaticPage({ route, navigate }) {
  useEffect(() => {
    try { window.scrollTo({ top: 0 }) } catch { /* not implemented in jsdom */ }
  }, [route.path])

  const onClick = (e) => {
    const a = e.target.closest?.('a[href]')
    if (!a || e.defaultPrevented) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    if (a.target && a.target !== '_self') return
    const url = new URL(a.getAttribute('href'), window.location.href)
    if (url.origin !== window.location.origin || !findRoute(url.pathname)) return
    e.preventDefault()
    navigate(url.pathname)
  }

  return (
    <main
      className="catalog catalog--full static-page"
      aria-label={pageTitle(route)}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: staticBody(route) }}
    />
  )
}
