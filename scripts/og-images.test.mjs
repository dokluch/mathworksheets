import { describe, it, expect } from 'vitest'
import { access } from 'node:fs/promises'
import { resolve } from 'node:path'
import { ogTargets, renderCard, previewSelector, OUT_DIR, ICONS } from './og-images.mjs'
import { WORKSHEETS } from '../src/worksheets.js'
import { routes, ogImagePath } from '../src/seo/render.js'

describe('scripts/og-images.mjs', () => {
  it('has one target per route, mapped to the path renderHead links to', () => {
    const targets = ogTargets()
    expect(targets.length).toBe(WORKSHEETS.length + 2)
    for (const route of routes()) {
      const t = targets.find(x => x.route.path === route.path)
      expect(t, route.path).toBeTruthy()
      expect('/' + t.file).toBe(ogImagePath(route))
      expect(t.title.length).toBeGreaterThan(0)
      expect(t.subtitle.length).toBeGreaterThan(0)
    }
  })

  it('filters targets by slug', () => {
    expect(ogTargets('rounding').map(t => t.file)).toEqual(['og/rounding.png'])
  })

  it('chooses a preview element for every page kind', () => {
    for (const t of ogTargets()) {
      if (t.route.kind === 'developers') continue
      expect(previewSelector(t.route)).toMatch(/\.(print-area|eq-explorer|catalog-grid|mult-table)/)
    }
  })

  it('renders a 1200×630 card that escapes text and embeds the screenshot', () => {
    const t = { ...ogTargets('column-addition')[0], subtitle: 'a <b> & "c"' }
    const html = renderCard(t, 'data:image/png;base64,AAAA')
    expect(html).toContain('width: 1200px; height: 630px')
    expect(html).toContain('a &lt;b&gt; &amp; &quot;c&quot;')
    expect(html).toContain('<img class="shot" src="data:image/png;base64,AAAA"')
    expect(html).not.toContain('<pre class="lines">')
    const dev = renderCard(ogTargets('developers')[0], null)
    expect(dev).toContain('<pre class="lines">GET /llms.txt')
  })

  it('the PNG icons rendered from favicon.svg are committed (run `npm run og`)', async () => {
    expect(ICONS.map(i => i.file)).toEqual(['favicon.png', 'apple-touch-icon.png'])
    for (const icon of ICONS) {
      await expect(access(resolve(OUT_DIR, icon.file)), `${icon.file} is missing – run npm run og`).resolves.toBeUndefined()
    }
  })

  it('every page has its generated image committed under public/ (run `npm run og`)', async () => {
    for (const route of routes()) {
      const file = resolve(OUT_DIR, ogImagePath(route).replace(/^\//, ''))
      await expect(access(file), `${ogImagePath(route)} is missing – run npm run og`).resolves.toBeUndefined()
    }
  })
})
