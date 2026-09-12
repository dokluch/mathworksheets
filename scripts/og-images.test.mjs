import { describe, it, expect } from 'vitest'
import { access } from 'node:fs/promises'
import { resolve } from 'node:path'
import { ogTargets, renderCard, previewSelector, matchesFilter, fontsHref, titleSize, OUT_DIR, ICONS, PNGQUANT_ARGS } from './og-images.mjs'
import { WORKSHEETS } from '../src/worksheets.js'
import { routes, homeRoute, ogImagePath, gradeLevelText } from '../src/seo/render.js'
import { OG_IMAGE_PATH, BRAND } from '../src/seo/site.js'
import { LOCALES, LOCALE_META, t, localizeWorksheet } from '../src/i18n/index.js'

const OTHERS = LOCALES.filter(l => l !== 'en')

describe('scripts/og-images.mjs', () => {
  it('has one target per page and locale (static pages share their locale’s home card), mapped to the path renderHead links to', () => {
    const targets = ogTargets()
    expect(targets.length).toBe((WORKSHEETS.length + 1) * LOCALES.length)
    expect(new Set(targets.map(x => x.file)).size).toBe(targets.length)
    for (const route of routes()) {
      if (route.kind === 'page') {
        expect(ogImagePath(route)).toBe(ogImagePath(homeRoute(route.locale)))
        continue
      }
      const target = targets.find(x => x.route.path === route.path)
      expect(target, route.path).toBeTruthy()
      expect('/' + target.file).toBe(ogImagePath(route))
      expect(target.locale).toBe(route.locale)
      expect(target.lang).toBe(LOCALE_META[route.locale].lang)
      expect(target.title.length).toBeGreaterThan(0)
      expect(target.subtitle.length).toBeGreaterThan(0)
      expect(target.badges.length).toBeGreaterThanOrEqual(3)
      for (const b of target.badges) expect(b.trim().length).toBeGreaterThan(0)
    }
    expect(ogImagePath(homeRoute('en'))).toBe(OG_IMAGE_PATH)
    expect(ogImagePath(homeRoute('fr'))).toBe('/og/fr/home.png')
  })

  it('translates the card copy per locale and keeps the English card English', () => {
    const ws = WORKSHEETS.find(w => w.id === 'colmul')
    const en = ogTargets('en/column-multiplication')[0]
    expect(en.file).toBe('og/column-multiplication.png')
    expect(en.title).toBe(ws.label)
    expect(en.badges).toEqual([gradeLevelText(ws, 'en'), 'Printable', ...ws.skills.slice(0, 2)])
    expect(en.tagline).toBe(t('en', 'site.tagline'))
    for (const locale of OTHERS) {
      const target = ogTargets(`${locale}/column-multiplication`)[0]
      const localized = localizeWorksheet(ws, locale)
      expect(target.file).toBe(`og/${locale}/column-multiplication.png`)
      expect(target.title).toBe(localized.label)
      expect(target.subtitle).toBe(localized.shortDesc)
      expect(target.badges.slice(2)).toEqual(localized.skills.slice(0, 2))
      expect(target.badges[1]).toBe(t(locale, 'seo.ogBadgePrintable'))
      expect(target.badges[1]).not.toBe('Printable')
      expect(target.tagline).toBe(t(locale, 'site.tagline'))
      expect(target.tagline).not.toBe(en.tagline)
      const home = ogTargets(`${locale}/home`)[0]
      expect(home.title).toBe(BRAND)
      expect(home.subtitle).toBe(t(locale, 'app.subtitle'))
      expect(home.badges).toEqual(['ogBadgeFree', 'ogBadgeRandomized', 'ogBadgePrintReady'].map(k => t(locale, `seo.${k}`)))
    }
    const eq = ogTargets('de/equation-explorer')[0]
    expect(eq.badges[1]).toBe(t('de', 'seo.ogBadgeInteractive'))
  })

  it('filters by slug (every locale), by locale (every page) or by locale/slug', () => {
    expect(ogTargets('rounding').map(x => x.file)).toEqual(['og/rounding.png', ...OTHERS.map(l => `og/${l}/rounding.png`)])
    const fr = ogTargets('fr')
    expect(fr.length).toBe(WORKSHEETS.length + 1)
    expect(fr.every(x => x.file.startsWith('og/fr/'))).toBe(true)
    expect(ogTargets('fr/rounding').map(x => x.file)).toEqual(['og/fr/rounding.png'])
    expect(ogTargets('en/rounding').map(x => x.file)).toEqual(['og/rounding.png'])
    expect(ogTargets('en/home').map(x => x.file)).toEqual(['og/home.png'])
    // A locale code never matches a slug that happens to contain it (or-DE-r).
    expect(ogTargets('de').some(x => x.locale !== 'de')).toBe(false)
    expect(matchesFilter(ogTargets('en/order-of-operations')[0], 'de')).toBe(false)
    expect(ogTargets('nope')).toEqual([])
  })

  it('chooses a preview element for every page kind', () => {
    for (const target of ogTargets()) {
      expect(previewSelector(target.route)).toMatch(/\.(print-area|eq-explorer|catalog-sections|mult-table)/)
    }
  })

  it('renders a 1200×630 card that escapes text and embeds the screenshot', () => {
    const target = { ...ogTargets('en/column-addition')[0], subtitle: 'a <b> & "c"' }
    const html = renderCard(target, 'data:image/png;base64,AAAA')
    expect(html).toContain('<html lang="en">')
    expect(html).toContain('width: 1200px; height: 630px')
    expect(html).toContain('a &lt;b&gt; &amp; &quot;c&quot;')
    expect(html).toContain('<img class="shot" src="data:image/png;base64,AAAA"')
    expect(html).toContain(t('en', 'site.tagline'))
    expect(html).not.toContain('<pre class="lines">')
    expect(html).not.toContain('Noto+Sans+SC')
  })

  it('renders localized cards in the page language, loading a CJK font only for Chinese', () => {
    const rounding = WORKSHEETS.find(w => w.id === 'rounding')
    const fr = renderCard(ogTargets('fr/rounding')[0])
    expect(fr).toContain('<html lang="fr">')
    expect(fr).toContain(t('fr', 'site.tagline'))
    expect(fr).toContain(localizeWorksheet(rounding, 'fr').label)
    expect(fr).not.toContain('Noto+Sans+SC')
    const zh = renderCard(ogTargets('zh/rounding')[0])
    expect(zh).toContain('<html lang="zh-Hans">')
    expect(zh).toContain('Noto+Sans+SC')
    expect(zh).toContain(t('zh', 'site.tagline'))
    expect(fontsHref('ru')).toContain('Inter')
    expect(fontsHref('ru')).not.toContain('Noto')
  })

  it('shrinks long translated titles so they fit the text column', () => {
    expect(titleSize('Rounding')).toBe(56)
    expect(titleSize('Schriftliche Division')).toBe(48)
    expect(titleSize('Multiplicación en columna larga')).toBe(40)
    const de = ogTargets('de/long-division')[0]
    expect(renderCard(de)).toContain(`font-size: ${titleSize(de.title)}px`)
  })

  it('quantises in place, never writes a larger file and strips metadata', () => {
    expect(PNGQUANT_ARGS).toContain('--skip-if-larger')
    expect(PNGQUANT_ARGS).toContain('--strip')
    expect(PNGQUANT_ARGS).toContain('--force')
    expect(PNGQUANT_ARGS.slice(-2)).toEqual(['--ext', '.png'])
  })

  it('the PNG icons rendered from favicon.svg are committed (run `npm run og`)', async () => {
    expect(ICONS.map(i => i.file)).toEqual(['favicon.png', 'apple-touch-icon.png'])
    for (const icon of ICONS) {
      await expect(access(resolve(OUT_DIR, icon.file)), `${icon.file} is missing – run npm run og`).resolves.toBeUndefined()
    }
  })

  it('every page in every locale has its generated image committed under public/ (run `npm run og`)', async () => {
    for (const route of routes()) {
      const file = resolve(OUT_DIR, ogImagePath(route).replace(/^\//, ''))
      await expect(access(file), `${ogImagePath(route)} is missing – run npm run og`).resolves.toBeUndefined()
    }
  })
})
