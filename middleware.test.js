import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@vercel/functions', () => ({
  next: vi.fn((init = {}) => new Response(null, { status: 200, headers: { 'x-mock': 'next', ...(init.headers || {}) } })),
  rewrite: vi.fn((dest, init = {}) => new Response(null, { status: 200, headers: { 'x-mock': 'rewrite', 'x-rewrite-to': String(dest), ...(init.headers || {}) } })),
}))

import { next, rewrite } from '@vercel/functions'
import middleware, { config, MATCHER, notFoundResponse } from './middleware.js'
import { SITE_URL } from './src/seo/site.js'

const BASE = 'https://example.test'
const req = (path, accept, method = 'GET') =>
  new Request(BASE + path, { method, headers: accept == null ? {} : { accept } })

beforeEach(() => {
  next.mockClear()
  rewrite.mockClear()
})

describe('matcher', () => {
  const re = new RegExp(`^${MATCHER}$`)
  it('runs for extensionless page paths only', () => {
    expect(config.matcher).toEqual([MATCHER])
    for (const p of ['/', '/developers', '/worksheets/rounding', '/nope', '/a/b/c']) expect(re.test(p)).toBe(true)
    for (const p of ['/assets/index-abc.js', '/llms.txt', '/index.md', '/worksheets/rounding.md', '/sitemap.xml', '/favicon.svg', '/worksheets.json']) {
      expect(re.test(p)).toBe(false)
    }
  })
})

describe('known routes', () => {
  it('browser Accept → passes through with Vary: Accept and a markdown alternate Link', () => {
    const res = middleware(req('/', 'text/html,application/xhtml+xml,*/*;q=0.8'))
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.headers.get('vary')).toBe('Accept')
    expect(res.headers.get('link')).toBe('</index.md>; rel="alternate"; type="text/markdown"')
  })

  it('no Accept header → HTML', () => {
    middleware(req('/worksheets/rounding', null))
    expect(next).toHaveBeenCalledTimes(1)
    expect(rewrite).not.toHaveBeenCalled()
  })

  it('Accept: text/markdown → rewrite to the .md twin with markdown headers', () => {
    const res = middleware(req('/worksheets/rounding', 'text/markdown'))
    expect(rewrite).toHaveBeenCalledTimes(1)
    expect(res.headers.get('x-rewrite-to')).toBe(`${BASE}/worksheets/rounding.md`)
    expect(res.headers.get('content-type')).toBe('text/markdown; charset=utf-8')
    expect(res.headers.get('vary')).toBe('Accept')
    expect(res.headers.get('content-location')).toBe('/worksheets/rounding.md')
  })

  it('home markdown twin is /index.md and trailing slashes are tolerated', () => {
    let res = middleware(req('/', 'text/markdown'))
    expect(res.headers.get('x-rewrite-to')).toBe(`${BASE}/index.md`)
    res = middleware(req('/developers/', 'text/markdown;q=0.9, text/html;q=0.1'))
    expect(res.headers.get('x-rewrite-to')).toBe(`${BASE}/developers.md`)
    res = middleware(req('/privacy', 'text/markdown'))
    expect(res.headers.get('x-rewrite-to')).toBe(`${BASE}/privacy.md`)
  })

  it('q-values are honoured', () => {
    middleware(req('/', 'text/html;q=0.5, text/markdown;q=0.9'))
    expect(rewrite).toHaveBeenCalledTimes(1)
    middleware(req('/', 'text/html;q=0.9, text/markdown;q=0.5'))
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('nothing acceptable → 406 listing both representations', async () => {
    const res = middleware(req('/worksheets/patterns', 'application/json'))
    expect(res.status).toBe(406)
    expect(res.headers.get('vary')).toBe('Accept')
    expect(res.headers.get('content-type')).toBe('text/plain; charset=utf-8')
    const body = await res.text()
    expect(body).toContain(`${SITE_URL}/worksheets/patterns`)
    expect(body).toContain(`${SITE_URL}/worksheets/patterns.md`)
  })

  it('non-GET requests pass through untouched', () => {
    middleware(req('/', 'text/markdown', 'POST'))
    expect(next).toHaveBeenCalledWith()
    expect(rewrite).not.toHaveBeenCalled()
  })
})

describe('locale prefixes', () => {
  it('matcher runs for prefixed pages but not their markdown twins', () => {
    const re = new RegExp(`^${MATCHER}$`)
    for (const p of ['/fr', '/fr/worksheets/rounding', '/zh/developers', '/de/privacy']) expect(re.test(p)).toBe(true)
    for (const p of ['/fr.md', '/fr/worksheets/rounding.md', '/de/privacy.md']) expect(re.test(p)).toBe(false)
  })

  it('HTML responses carry Content-Language and the localized markdown twin', () => {
    let res = middleware(req('/fr', 'text/html'))
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.headers.get('content-language')).toBe('fr')
    expect(res.headers.get('link')).toBe('</fr.md>; rel="alternate"; type="text/markdown"')
    expect(res.headers.get('vary')).toBe('Accept')
    res = middleware(req('/zh/privacy', 'text/html'))
    expect(res.headers.get('content-language')).toBe('zh-Hans')
    expect(res.headers.get('link')).toBe('</zh/privacy.md>; rel="alternate"; type="text/markdown"')
    res = middleware(req('/', 'text/html'))
    expect(res.headers.get('content-language')).toBe('en')
  })

  it('Accept: text/markdown rewrites to the prefixed .md file', () => {
    const res = middleware(req('/fr/worksheets/rounding/', 'text/markdown'))
    expect(rewrite).toHaveBeenCalledTimes(1)
    expect(res.headers.get('x-rewrite-to')).toBe(`${BASE}/fr/worksheets/rounding.md`)
    expect(res.headers.get('content-location')).toBe('/fr/worksheets/rounding.md')
    expect(res.headers.get('content-language')).toBe('fr')
    expect(res.headers.get('link')).toBe('</fr/worksheets/rounding>; rel="canonical"; type="text/html"')
  })

  it('unknown localized paths get a 404 in that language; /en is not a page', async () => {
    let res = middleware(req('/fr/nope', 'text/html'))
    expect(res.status).toBe(404)
    expect(res.headers.get('content-language')).toBe('fr')
    let body = await res.text()
    expect(body).toContain('<html lang="fr">')
    expect(body).toContain('href="/fr/worksheets/multiplication"')
    res = middleware(req('/ru/worksheets/nope', '*/*'))
    expect(res.status).toBe(404)
    body = await res.text()
    expect(body).toContain(`${SITE_URL}/ru/worksheets/multiplication`)
    expect(body).not.toContain('Page not found')
    for (const p of ['/en', '/en/developers', '/xx/developers']) expect(middleware(req(p, 'text/html')).status).toBe(404)
    expect(next).not.toHaveBeenCalled()
  })

  it('406 lists the localized representations', async () => {
    const res = middleware(req('/it/worksheets/patterns', 'application/json'))
    expect(res.status).toBe(406)
    const body = await res.text()
    expect(body).toContain(`${SITE_URL}/it/worksheets/patterns`)
    expect(body).toContain(`${SITE_URL}/it/worksheets/patterns.md`)
  })
})

describe('unknown paths', () => {
  it('return a real 404 with a Markdown body by default', async () => {
    const res = middleware(req('/some-path-that-does-not-exist', '*/*'))
    expect(res.status).toBe(404)
    expect(res.headers.get('content-type')).toBe('text/markdown; charset=utf-8')
    expect(res.headers.get('vary')).toBe('Accept')
    const body = await res.text()
    expect(body.startsWith('# 404')).toBe(true)
    expect(body).toContain('`/some-path-that-does-not-exist`')
    expect(body).toContain(`${SITE_URL}/sitemap.xml`)
    expect(body).toContain(`${SITE_URL}/llms.txt`)
    expect(next).not.toHaveBeenCalled()
  })

  it('return the HTML 404 page for browsers', async () => {
    const res = middleware(req('/worksheets/does-not-exist', 'text/html,*/*;q=0.8'))
    expect(res.status).toBe(404)
    expect(res.headers.get('content-type')).toBe('text/html; charset=utf-8')
    expect(await res.text()).toContain('<h1>404 – Page not found</h1>')
  })

  it('notFoundResponse is exported for reuse', () => {
    expect(notFoundResponse('/x', 'text/markdown').status).toBe(404)
  })
})
