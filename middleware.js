/**
 * Vercel Routing Middleware (edge runtime).
 *
 * - Accept: text/markdown on any page URL → the page's Markdown twin, with
 *   Content-Type: text/markdown; charset=utf-8 and Vary: Accept
 *   (acceptmarkdown.com convention, RFC 9110 q-values honoured).
 * - HTML responses get Vary: Accept and a Link: rel="alternate" header.
 * - Nothing acceptable → 406 with a plain-text list of representations.
 * - Unknown extensionless paths → real 404 with a Markdown (or HTML) body
 *   that points agents at the sitemap, llms.txt and developer resources.
 *
 * Static files with an extension (assets, .md, .txt, .xml, .json, images)
 * never hit this function thanks to the matcher.
 */
import { next, rewrite } from '@vercel/functions'
import { negotiate } from './src/seo/negotiate.js'
import { findRoute, normalizePath, renderNotFoundMarkdown, renderNotFoundHtml } from './src/seo/render.js'
import { absoluteUrl } from './src/seo/site.js'

export const MATCHER = '/((?!assets/|.*\\..*).*)'

export const config = {
  matcher: [MATCHER],
}

const MARKDOWN = 'text/markdown; charset=utf-8'
const HTML = 'text/html; charset=utf-8'

export function notFoundResponse(pathname, accept) {
  const chosen = negotiate(accept, ['text/markdown', 'text/html'])
  const body = chosen === 'text/html' ? renderNotFoundHtml(pathname) : renderNotFoundMarkdown(pathname)
  return new Response(body, {
    status: 404,
    headers: {
      'Content-Type': chosen === 'text/html' ? HTML : MARKDOWN,
      Vary: 'Accept',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

export default function middleware(request) {
  const url = new URL(request.url)
  const pathname = normalizePath(url.pathname)
  const accept = request.headers.get('accept')

  if (request.method !== 'GET' && request.method !== 'HEAD') return next()

  const route = findRoute(pathname)
  if (!route) return notFoundResponse(pathname, accept)

  const chosen = negotiate(accept, ['text/html', 'text/markdown'])

  if (chosen === 'text/markdown') {
    return rewrite(new URL(route.md, request.url), {
      headers: {
        'Content-Type': MARKDOWN,
        Vary: 'Accept',
        'Content-Location': route.md,
        Link: `<${route.path}>; rel="canonical"; type="text/html"`,
        'X-Content-Type-Options': 'nosniff',
      },
    })
  }

  if (chosen === 'text/html') {
    return next({
      headers: {
        Vary: 'Accept',
        Link: `<${route.md}>; rel="alternate"; type="text/markdown"`,
      },
    })
  }

  const body =
    `406 Not Acceptable\n\n` +
    `${absoluteUrl(route.path)} is available as:\n` +
    `- text/html: ${absoluteUrl(route.path)}\n` +
    `- text/markdown: ${absoluteUrl(route.md)}\n`
  return new Response(body, {
    status: 406,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', Vary: 'Accept', 'X-Content-Type-Options': 'nosniff' },
  })
}
