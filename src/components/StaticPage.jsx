import { useEffect } from 'react'
import { staticBody, pageTitle } from '../seo/render'
import { useInAppLinks } from '../hooks/useInAppLinks'

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

  const onClick = useInAppLinks(navigate)

  return (
    <main
      className="catalog catalog--full static-page"
      aria-label={pageTitle(route)}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: staticBody(route) }}
    />
  )
}
