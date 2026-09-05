#!/usr/bin/env node
/**
 * Local emulation of the Vercel routing used in production, for verifying the
 * build without deploying:
 *
 *   npm run build && node scripts/serve-local.mjs [port] [distDir]
 *   npm run verify:live -- http://localhost:4173
 *
 * Emulates: middleware.js on extensionless paths (x-middleware-next /
 * x-middleware-rewrite semantics of @vercel/functions), cleanUrls (/foo →
 * foo.html, so /fr → fr.html and /fr/privacy → fr/privacy.html),
 * trailingSlash: false (308), vercel.json headers, 404.html fallback.
 * Not a substitute for the real deployment: run verify:live against the
 * Vercel URL as well.
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'
import middleware, { MATCHER } from '../middleware.js'

const port = Number(process.argv[2] || 4173)
const dist = resolve(process.argv[3] || 'dist')
const matcher = new RegExp(`^${MATCHER}$`)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
}

async function fileExists(p) {
  try { return (await stat(p)).isFile() } catch { return false }
}

async function resolveStatic(pathname) {
  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '')
  const direct = join(dist, safe)
  if (await fileExists(direct)) return direct
  if (!extname(safe)) {
    const clean = join(dist, `${safe}.html`)
    if (await fileExists(clean)) return clean
    const index = join(dist, safe, 'index.html')
    if (await fileExists(index)) return index
  }
  return null
}

async function sendFile(res, file, extraHeaders = {}, status = 200) {
  const body = await readFile(file)
  const type = MIME[extname(file)] || 'application/octet-stream'
  const headers = { 'content-type': type, 'x-content-type-options': 'nosniff' }
  for (const [k, v] of Object.entries(extraHeaders)) headers[k.toLowerCase()] = v
  res.writeHead(status, headers)
  res.end(body)
}

async function sendNotFound(res, extraHeaders = {}) {
  const file = join(dist, '404.html')
  if (await fileExists(file)) return sendFile(res, file, extraHeaders, 404)
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('NOT_FOUND')
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${port}`)
    let pathname = url.pathname

    // trailingSlash: false
    if (pathname.length > 1 && pathname.endsWith('/')) {
      res.writeHead(308, { Location: pathname.replace(/\/+$/, '') + url.search })
      return res.end()
    }
    // cleanUrls: redirect explicit .html
    if (pathname.endsWith('.html')) {
      const target = pathname === '/index.html' ? '/' : pathname.slice(0, -5)
      res.writeHead(308, { Location: target })
      return res.end()
    }

    let extra = {}
    if (matcher.test(pathname)) {
      const request = new Request(url.toString(), { method: req.method, headers: req.headers })
      const out = middleware(request)
      const isNext = out.headers.get('x-middleware-next') === '1'
      const rewriteTo = out.headers.get('x-middleware-rewrite')
      if (!isNext && !rewriteTo) {
        // A real response from middleware (404 / 406).
        res.writeHead(out.status, Object.fromEntries(out.headers))
        return res.end(Buffer.from(await out.arrayBuffer()))
      }
      for (const [k, v] of out.headers) {
        if (!k.startsWith('x-middleware-')) extra[k] = v
      }
      if (rewriteTo) pathname = new URL(rewriteTo).pathname
    }

    const file = await resolveStatic(pathname)
    if (!file) return sendNotFound(res, extra)
    return sendFile(res, file, extra)
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end(String(err && err.stack || err))
  }
}).listen(port, () => {
  console.log(`serve-local: ${dist} on http://localhost:${port}`)
})
