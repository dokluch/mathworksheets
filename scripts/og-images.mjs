#!/usr/bin/env node
/**
 * Generate the Open Graph preview image for every page in every locale from
 * the real app:
 *
 *   npm run og                 # writes public/og/<slug>.png (English) and
 *                              # public/og/<locale>/<slug>.png, plus home.png
 *   npm run og -- rounding     # one page, every locale
 *   npm run og -- fr           # one locale, every page
 *   npm run og -- fr/rounding  # one page in one locale (en/rounding for English)
 *
 * Each worksheet is opened in headless Chromium (Playwright) at its localized
 * URL, its printable area is screenshotted and composed into a 1200×630 card
 * with the brand, translated title, description, badges and tagline.
 * Math.random is seeded per page so re-running the script only changes an
 * image when the worksheet itself changed.
 *
 * Cards are then quantised in place with pngquant when it is installed
 * (`brew install pngquant`); without it the lossless PNG is kept and a warning
 * is printed once.
 *
 * The same run rasterises public/favicon.svg into favicon.png and
 * apple-touch-icon.png (see ICONS).
 *
 * Images are committed, not built on Vercel: the build stays free of a
 * browser download and the previews are identical across deployments.
 * Requires the Chromium build once: `npx playwright install chromium`.
 */
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { resolve } from 'node:path'
import '../src/i18n/all.js'
import { WORKSHEETS } from '../src/worksheets.js'
import { BRAND, ACCENT_COLOR } from '../src/seo/site.js'
import { escapeHtml, homeRoute, worksheetRoute, ogImagePath, gradeLevelText, brandIcon } from '../src/seo/render.js'
import { LOCALES, LOCALE_META, t, localizeWorksheet } from '../src/i18n/index.js'

const exec = promisify(execFile)

export const OG_WIDTH = 1200
export const OG_HEIGHT = 630
export const OUT_DIR = resolve('public')
/** PNG renderings of public/favicon.svg, for browsers and home screens that ignore SVG icons. */
export const ICONS = [
  { file: 'favicon.png', size: 32 },
  { file: 'apple-touch-icon.png', size: 180 },
]

/** pngquant binary: $PNGQUANT, then the usual Homebrew locations, then PATH. */
export const PNGQUANT = process.env.PNGQUANT
  || ['/opt/homebrew/bin/pngquant', '/usr/local/bin/pngquant'].find(existsSync)
  || 'pngquant'
/** Lossy palette quantisation: 65–90 keeps the card visually identical at a fraction of the bytes. */
export const PNGQUANT_ARGS = ['--force', '--skip-if-larger', '--strip', '--speed', '1', '--quality', '65-90', '--ext', '.png']

/** Selector of the element that shows "what's inside" for a page. */
export function previewSelector(route) {
  if (route.kind === 'home') return '.catalog--full .catalog-sections'
  if (route.worksheet?.id === 'multiply') return '.mult-table'
  if (route.worksheet?.interactive) return '.eq-explorer, .print-area'
  return '.print-area'
}

/** 'home' or the worksheet slug: the locale-independent name of a card. */
export function targetSlug(route) {
  return route.kind === 'worksheet' ? route.worksheet.slug : 'home'
}

/**
 * Does a target match the CLI filter?
 *   ''            everything
 *   'rounding'    that page in every locale (substring of the slug)
 *   'fr'          every page of that locale
 *   'fr/round'    substring of '<locale>/<slug>' ('en/…' for English)
 */
export function matchesFilter(target, filter = '') {
  if (!filter) return true
  const slug = targetSlug(target.route)
  if (filter.includes('/')) return `${target.route.locale}/${slug}`.includes(filter)
  if (LOCALES.includes(filter)) return target.route.locale === filter
  return slug.includes(filter)
}

/** Everything the generator needs per page and locale, independent of the browser. */
export function ogTargets(filter = '', locales = LOCALES) {
  const all = locales.flatMap(locale => [
    {
      route: homeRoute(locale),
      title: BRAND,
      subtitle: t(locale, 'app.subtitle'),
      badges: ['ogBadgeFree', 'ogBadgeRandomized', 'ogBadgePrintReady'].map(k => t(locale, `seo.${k}`)),
      color: ACCENT_COLOR,
    },
    ...WORKSHEETS.map(source => {
      const ws = localizeWorksheet(source, locale)
      return {
        route: worksheetRoute(source, locale),
        title: ws.label,
        subtitle: ws.shortDesc,
        badges: [
          gradeLevelText(ws, locale),
          t(locale, ws.interactive ? 'seo.ogBadgeInteractive' : 'seo.ogBadgePrintable'),
          ...ws.skills.slice(0, 2),
        ],
        color: ws.color,
      }
    }),
  ])
  return all
    .map(target => ({
      ...target,
      locale: target.route.locale,
      lang: LOCALE_META[target.route.locale].lang,
      tagline: t(target.route.locale, 'site.tagline'),
      file: ogImagePath(target.route).replace(/^\//, ''),
    }))
    .filter(target => matchesFilter(target, filter))
}

/** Google Fonts request for a card: Inter covers Latin and Cyrillic; Chinese adds Noto Sans SC for the CJK glyphs. */
export function fontsHref(lang) {
  const families = ['Inter:wght@500;600;700;800', 'JetBrains+Mono:wght@500']
  if (/^zh/.test(lang)) families.push('Noto+Sans+SC:wght@500;700;800')
  return `https://fonts.googleapis.com/css2?${families.map(f => `family=${f}`).join('&')}&display=swap`
}

/** Title size that keeps two lines inside the 416px text column for long translated labels. */
export function titleSize(title) {
  const n = [...title].length
  if (n > 26) return 40
  if (n > 18) return 48
  return 56
}

/** The 1200×630 card. `shot` is a PNG data URI of the page preview (optional). */
export function renderCard({ title, subtitle, badges, color, lines = [], lang = 'en', tagline = t('en', 'site.tagline') }, shot) {
  const badgeHtml = badges.map(b => `<span class="badge">${escapeHtml(b)}</span>`).join('')
  const preview = shot
    ? `<img class="shot" src="${shot}" alt="" />`
    : `<pre class="lines">${lines.map(escapeHtml).join('\n')}</pre>`
  return `<!doctype html>
<html lang="${escapeHtml(lang)}"><head><meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${fontsHref(lang)}" rel="stylesheet" />
<style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${OG_WIDTH}px; height: ${OG_HEIGHT}px; overflow: hidden; }
  body {
    font-family: 'Inter', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #0f172a;
    background:
      radial-gradient(900px 500px at 100% 0%, color-mix(in srgb, ${color} 16%, white) 0%, transparent 60%),
      linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
    display: flex;
    align-items: stretch;
  }
  .text {
    width: 500px;
    padding: 56px 24px 56px 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 22px;
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 22px;
    letter-spacing: -0.01em;
    color: ${ACCENT_COLOR};
  }
  .brand svg { width: 26px; height: 26px; }
  h1 { font-size: ${titleSize(title)}px; line-height: 1.05; font-weight: 800; letter-spacing: -0.03em; color: ${color}; overflow-wrap: anywhere; }
  h1.plain { color: #0f172a; }
  p { font-size: 25px; line-height: 1.35; color: #475569; font-weight: 500; }
  .badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
  .badge {
    font-size: 15px; font-weight: 600; color: ${color};
    background: color-mix(in srgb, ${color} 10%, white);
    border: 1px solid color-mix(in srgb, ${color} 28%, white);
    border-radius: 999px; padding: 6px 12px;
  }
  .stage { position: relative; flex: 1; }
  .card {
    position: absolute; left: 12px; top: 52px; width: 760px; height: 640px;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 16px;
    box-shadow: 0 24px 60px -20px rgba(15, 23, 42, 0.28), 0 4px 16px -6px rgba(15, 23, 42, 0.12);
    overflow: hidden;
  }
  .shot { display: block; width: 100%; height: auto; }
  .lines {
    font-family: 'JetBrains Mono', monospace; font-size: 24px; line-height: 2;
    padding: 40px 44px; color: #0f172a;
  }
  .tagline {
    position: absolute; right: 28px; bottom: 24px; max-width: 640px;
    font-size: 15px; font-weight: 600; color: #334155; letter-spacing: 0.01em;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 999px; padding: 8px 16px;
    box-shadow: 0 6px 20px -8px rgba(15, 23, 42, 0.35);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
</style></head>
<body>
  <div class="text">
    <div class="brand">
      ${brandIcon(26)}
      ${escapeHtml(BRAND)}
    </div>
    <h1 class="${title === BRAND ? 'plain' : ''}">${escapeHtml(title)}</h1>
    <p>${escapeHtml(subtitle)}</p>
    <div class="badges">${badgeHtml}</div>
  </div>
  <div class="stage"><div class="card">${preview}</div></div>
  <div class="tagline">${escapeHtml(tagline)}</div>
</body></html>`
}

/** Deterministic Math.random for a page, so screenshots are reproducible. */
function seedScript(seed) {
  return `(() => {
    let s = ${seed >>> 0} || 1;
    Math.random = () => {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    try { localStorage.clear(); } catch {}
  })();`
}

function hashSeed(text) {
  let h = 2166136261
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return h >>> 0
}

let pngquantMissing = false

/**
 * Quantise a PNG in place with pngquant. Returns the bytes saved, 0 when the
 * file was left alone (pngquant missing, result would be larger, or the
 * quality floor could not be met — exit codes 98 and 99).
 */
export async function quantize(file, log = console.log) {
  if (pngquantMissing) return 0
  const before = (await stat(file)).size
  try {
    await exec(PNGQUANT, [...PNGQUANT_ARGS, file])
  } catch (err) {
    if (err.code === 'ENOENT') {
      pngquantMissing = true
      log(`pngquant not found (${PNGQUANT}); keeping lossless PNGs – install it with \`brew install pngquant\``)
      return 0
    }
    if (err.code === 98 || err.code === 99) return 0
    throw err
  }
  return before - (await stat(file)).size
}

async function renderIcons(browser, log) {
  const svg = await readFile(resolve(OUT_DIR, 'favicon.svg'), 'utf8')
  const written = []
  for (const icon of ICONS) {
    const context = await browser.newContext({ viewport: { width: icon.size, height: icon.size }, deviceScaleFactor: 1 })
    const page = await context.newPage()
    await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${svg.replace(/width="\d+" height="\d+"/, `width="${icon.size}" height="${icon.size}"`)}</body></html>`)
    await writeFile(resolve(OUT_DIR, icon.file), await page.screenshot({ type: 'png', omitBackground: true }))
    await context.close()
    written.push(icon.file)
    log(`icon: ${icon.file}`)
  }
  return written
}

async function settle(page) {
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(150)
}

export async function generate({ filter = '', log = console.log } = {}) {
  const [{ createServer }, { chromium }] = await Promise.all([import('vite'), import('playwright')])
  const server = await createServer({ server: { port: 5199, strictPort: false }, logLevel: 'silent' })
  await server.listen()
  const base = server.resolvedUrls.local[0].replace(/\/$/, '')
  const browser = await chromium.launch()
  const written = []
  try {
    if (!filter || 'icons'.includes(filter)) written.push(...await renderIcons(browser, log))
    for (const target of ogTargets(filter)) {
      let shot = null
      {
        const context = await browser.newContext({ viewport: { width: 1180, height: 900 }, deviceScaleFactor: 2 })
        await context.addInitScript(seedScript(hashSeed(target.route.path)))
        const page = await context.newPage()
        await page.goto(base + target.route.path)
        await settle(page)
        const el = page.locator(previewSelector(target.route)).first()
        await el.waitFor()
        const png = await el.screenshot({ type: 'png' })
        shot = `data:image/png;base64,${png.toString('base64')}`
        await context.close()
      }

      const context = await browser.newContext({ viewport: { width: OG_WIDTH, height: OG_HEIGHT }, deviceScaleFactor: 1 })
      const page = await context.newPage()
      await page.setContent(renderCard(target, shot))
      await settle(page)
      const out = resolve(OUT_DIR, target.file)
      await mkdir(resolve(out, '..'), { recursive: true })
      await writeFile(out, await page.screenshot({ type: 'png' }))
      await context.close()
      const saved = await quantize(out, log)
      written.push(target.file)
      log(`og: ${target.file}${saved ? ` (pngquant −${Math.round(saved / 1024)} KB)` : ''}`)
    }
  } finally {
    await browser.close()
    await server.close()
  }
  return written
}

const isMain = process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname
if (isMain) {
  generate({ filter: process.argv[2] || '' }).catch(err => {
    console.error(err)
    process.exit(1)
  })
}
