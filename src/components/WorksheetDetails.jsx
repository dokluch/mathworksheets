import { worksheetDetailsHtml } from '../seo/render'
import { useInAppLinks } from '../hooks/useInAppLinks'

/**
 * The descriptive half of a worksheet page — description, settings, how to use,
 * sibling worksheets and agent links — rendered from the same HTML string the
 * prerender step emits, so the crawlable fallback and the hydrated view cannot
 * drift apart. Without this, src/main.jsx removes the static content and any
 * crawler that executes JavaScript sees a page with no prose at all.
 *
 * Screen only: the sheet itself is what gets printed.
 */
export default function WorksheetDetails({ route, navigate }) {
  const onClick = useInAppLinks(navigate)
  return (
    <section
      className="worksheet-details static-page no-print"
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: worksheetDetailsHtml(route) }}
    />
  )
}
