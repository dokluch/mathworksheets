#!/usr/bin/env node
/**
 * Post-deploy smoke test for SEO / agent-readiness surfaces.
 *
 *   node scripts/verify-live.mjs https://mathworksheets-eight.vercel.app
 *   npm run verify:live -- https://my-preview.vercel.app
 *
 * Exits 1 if any check fails. Read-only: only GET requests.
 */
import { WORKSHEETS } from '../src/worksheets.js'

const base = (process.argv[2] || process.env.SITE_URL || 'https://mathworksheets-eight.vercel.app').replace(/\/+$/, '')

const results = []
function record(name, ok, detail = '') {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`)
}

async function get(path, headers = {}) {
  const res = await fetch(base + path, { headers, redirect: 'manual' })
  const text = await res.text()
  return { status: res.status, headers: res.headers, text }
}

/** GET a binary asset; returns status, content-type and the first bytes. */
async function head(path) {
  const res = await fetch(base + path, { redirect: 'manual' })
  const buf = new Uint8Array(await res.arrayBuffer())
  return { status: res.status, type: res.headers.get('content-type') || '', bytes: buf }
}

function isPng(bytes) {
  return bytes.length > 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
}

async function checkOgImage(pagePath, html) {
  const m = html.match(/<meta property="og:image" content="(https?:\/\/[^"]+)"/)
  if (!m) return record(`${pagePath} has an absolute og:image`, false, 'missing')
  const path = new URL(m[1]).pathname
  const img = await head(path)
  record(`GET ${path} (og:image of ${pagePath}) → 200 image/png`, img.status === 200 && /^image\/png/.test(img.type) && isPng(img.bytes), `${img.status} ${img.type} ${img.bytes.length}B`)
}

function textLength(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim().length
}

function headingsSequential(html) {
  const levels = [...html.matchAll(/<h([1-6])\b/gi)].map(m => Number(m[1]))
  let prev = 0
  for (const l of levels) {
    if (l > prev + 1) return false
    prev = l
  }
  return true
}

async function main() {
  console.log(`Verifying ${base}\n`)

  // 1. Content without JavaScript
  const home = await get('/', { accept: 'text/html' })
  record('GET / is 200 HTML', home.status === 200 && /text\/html/.test(home.headers.get('content-type') || ''), `${home.status} ${home.headers.get('content-type')}`)
  const len = textLength(home.text)
  record('GET / has >= 500 chars of text without JS', len >= 500, `${len} chars`)
  record('GET / has exactly one <h1>', (home.text.match(/<h1\b/gi) || []).length === 1)
  record('GET / heading levels are sequential', headingsSequential(home.text))
  record('GET / has canonical + JSON-LD', /rel="canonical"/.test(home.text) && /application\/ld\+json/.test(home.text))
  record('GET / HTML has Vary: Accept', /accept/i.test(home.headers.get('vary') || ''), `Vary: ${home.headers.get('vary')}`)
  record('GET / HTML has Link rel=alternate markdown', /rel="alternate"/.test(home.headers.get('link') || ''), `Link: ${home.headers.get('link')}`)
  await checkOgImage('/', home.text)

  // 2. Markdown negotiation
  const md = await get('/', { accept: 'text/markdown' })
  record('Accept: text/markdown on / → 200 text/markdown', md.status === 200 && /^text\/markdown/.test(md.headers.get('content-type') || ''), `${md.status} ${md.headers.get('content-type')}`)
  record('Markdown response has Vary: Accept', /accept/i.test(md.headers.get('vary') || ''), `Vary: ${md.headers.get('vary')}`)
  record('Markdown body starts with H1', /^# /.test(md.text.trimStart()))
  const q = await get('/', { accept: 'text/html;q=0.5, text/markdown;q=0.9' })
  record('q-values honoured (markdown q=0.9 beats html q=0.5)', /^text\/markdown/.test(q.headers.get('content-type') || ''), q.headers.get('content-type'))
  const na = await get('/', { accept: 'application/json' })
  record('Unacceptable Accept → 406', na.status === 406, String(na.status))

  for (const ws of WORKSHEETS) {
    const p = `/worksheets/${ws.slug}`
    const r = await get(p, { accept: 'text/html' })
    record(`GET ${p} → 200 with title`, r.status === 200 && r.text.includes(`${ws.label} Worksheets`), String(r.status))
    await checkOgImage(p, r.text)
    const m = await get(`${p}.md`)
    record(`GET ${p}.md → 200 text/markdown`, m.status === 200 && /^text\/markdown/.test(m.headers.get('content-type') || ''), `${m.status} ${m.headers.get('content-type')}`)
  }

  // 3. Discovery files
  for (const [path, re] of [
    ['/llms.txt', /^# MathSheets/],
    ['/llms-full.txt', /^# MathSheets/],
    ['/index.md', /^# MathSheets/],
    ['/developers', /Developer Resources/],
    ['/favicon.svg', /^<svg/],
    ['/developers.md', /^# MathSheets Developer Resources/],
    ['/sitemap.xml', /<urlset/],
    ['/robots.txt', /Sitemap: /],
  ]) {
    const r = await get(path)
    record(`GET ${path} → 200 and looks right`, r.status === 200 && re.test(r.text.trimStart()), String(r.status))
  }
  for (const path of ['/og/developers.png', '/favicon.png', '/apple-touch-icon.png']) {
    const img = await head(path)
    record(`GET ${path} → 200 image/png`, img.status === 200 && /^image\/png/.test(img.type) && isPng(img.bytes), `${img.status} ${img.type}`)
  }
  const cat = await get('/worksheets.json')
  let catOk = false
  try { catOk = cat.status === 200 && JSON.parse(cat.text).worksheets.length === WORKSHEETS.length } catch { catOk = false }
  record('GET /worksheets.json → valid catalog', catOk, String(cat.status))

  // 4. Agent-friendly 404s
  const nf = await get('/some-path-that-does-not-exist')
  record('Unknown path → HTTP 404', nf.status === 404, String(nf.status))
  record('404 body is Markdown with links', /^text\/markdown/.test(nf.headers.get('content-type') || '') && /sitemap\.xml/.test(nf.text) && /llms\.txt/.test(nf.text), nf.headers.get('content-type'))
  const nfHtml = await get('/some-path-that-does-not-exist', { accept: 'text/html' })
  record('Unknown path with Accept: text/html → 404 HTML', nfHtml.status === 404 && /text\/html/.test(nfHtml.headers.get('content-type') || ''), `${nfHtml.status} ${nfHtml.headers.get('content-type')}`)
  const nfAsset = await get('/assets/does-not-exist.js')
  record('Unknown asset → HTTP 404', nfAsset.status === 404, String(nfAsset.status))
  const nfSlug = await get('/worksheets/does-not-exist')
  record('Unknown worksheet slug → HTTP 404', nfSlug.status === 404, String(nfSlug.status))

  const failed = results.filter(r => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
  if (failed.length) process.exit(1)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
