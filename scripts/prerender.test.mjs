import { describe, it, expect } from 'vitest'
import { mkdtemp, readFile, writeFile, readdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { prerender } from './prerender.mjs'
import { WORKSHEETS } from '../src/worksheets.js'
import { PAGES } from '../src/pages.js'
import { routes, worksheetRoute, pageTitle } from '../src/seo/render.js'
import { BRAND } from '../src/seo/site.js'
import { LOCALES } from '../src/i18n/index.js'

const TEMPLATE = `<!doctype html><html><head><!-- seo:head --><!-- /seo:head --></head>
<body><div id="root"></div><!-- seo:content --><!-- /seo:content --><script src="/assets/app.js"></script></body></html>`

describe('scripts/prerender.mjs', () => {
  it('writes every derived file next to the built index.html', async () => {
    const dist = await mkdtemp(join(tmpdir(), 'mathsheets-dist-'))
    await writeFile(join(dist, 'index.html'), TEMPLATE)
    const logs = []
    const written = await prerender(dist, { now: new Date('2026-09-04T00:00:00Z'), log: m => logs.push(m) })

    expect(written.length).toBe(2 * routes().length + 7)
    expect(logs[0]).toContain(`wrote ${written.length} files`)

    const root = await readdir(dist)
    for (const f of ['index.html', 'index.md', 'llms.txt', 'llms-full.txt', 'sitemap.xml', 'robots.txt', 'worksheets.json', 'agents.md', '404.html', 'about.html', 'about.md', 'privacy.html', 'privacy.md', 'terms.html', 'terms.md']) {
      expect(root).toContain(f)
    }
    const ws = await readdir(join(dist, 'worksheets'))
    for (const w of WORKSHEETS) {
      expect(ws).toContain(`${w.slug}.html`)
      expect(ws).toContain(`${w.slug}.md`)
    }

    const rounding = await readFile(join(dist, 'worksheets', 'rounding.html'), 'utf8')
    expect(rounding).toContain(`<title>Rounding Worksheets · ${BRAND}</title>`)
    expect(rounding).toContain('/assets/app.js')
    const llms = await readFile(join(dist, 'llms.txt'), 'utf8')
    expect(llms.startsWith(`# ${BRAND}\n\n> `)).toBe(true)
    const json = JSON.parse(await readFile(join(dist, 'worksheets.json'), 'utf8'))
    expect(json.worksheets.length).toBe(WORKSHEETS.length)
    const privacy = await readFile(join(dist, 'privacy.html'), 'utf8')
    expect(privacy).toContain(`<title>Privacy Policy · ${BRAND}</title>`)
    expect(privacy).toContain('<footer class="site-footer no-print">')

    // Every locale: <locale>.html/.md at the root, the rest under <locale>/
    // Per locale: html + md for home, every worksheet and every static page, plus 7 shared files.
    expect(written.length).toBe(2 * LOCALES.length * (WORKSHEETS.length + 1 + PAGES.length) + 7)
    for (const l of LOCALES.filter(x => x !== 'en')) {
      expect(root).toContain(`${l}.html`)
      expect(root).toContain(`${l}.md`)
      const lws = await readdir(join(dist, l, 'worksheets'))
      for (const w of WORKSHEETS) {
        expect(lws).toContain(`${w.slug}.html`)
        expect(lws).toContain(`${w.slug}.md`)
      }
      const ldir = await readdir(join(dist, l))
      for (const f of ['about.html', 'about.md', 'privacy.md', 'terms.html', 'terms.md']) expect(ldir).toContain(f)
    }
    const roundingWs = WORKSHEETS.find(w => w.id === 'rounding')
    const fr = await readFile(join(dist, 'fr', 'worksheets', 'rounding.html'), 'utf8')
    expect(fr).toContain('<html lang="fr">')
    expect(fr).toContain(`<title>${pageTitle(worksheetRoute(roundingWs, 'fr'))}</title>`)
    expect(fr).toContain('/assets/app.js')
    expect(await readFile(join(dist, 'zh.html'), 'utf8')).toContain('<html lang="zh-Hans">')
  })
})
