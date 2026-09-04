#!/usr/bin/env node
/**
 * Generate the Open Graph preview image for every page from the real app:
 *
 *   npm run og            # writes public/og/<slug>.png, home.png, developers.png
 *   npm run og -- rounding   # only the pages whose slug matches
 *
 * Each worksheet is opened in headless Chromium (Playwright), its printable
 * area is screenshotted and composed into a 1200×630 card with the brand,
 * title and description. Math.random is seeded per page so re-running the
 * script only changes an image when the worksheet itself changed.
 *
 * The same run rasterises public/favicon.svg into favicon.png and
 * apple-touch-icon.png (see ICONS).
 *
 * Images are committed, not built on Vercel: the build stays free of a
 * browser download and the previews are identical across deployments.
 * Requires the Chromium build once: `npx playwright install chromium`.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { WORKSHEETS } from '../src/worksheets.js'
import { BRAND, TAGLINE, THEME_COLOR } from '../src/seo/site.js'
import { escapeHtml, homeRoute, worksheetRoute, developersRoute, ogImagePath, brandIcon } from '../src/seo/render.js'

export const OG_WIDTH = 1200
export const OG_HEIGHT = 630
export const OUT_DIR = resolve('public')
/** PNG renderings of public/favicon.svg, for browsers and home screens that ignore SVG icons. */
export const ICONS = [
  { file: 'favicon.png', size: 32 },
  { file: 'apple-touch-icon.png', size: 180 },
]

/** Selector of the element that shows "what's inside" for a page. */
export function previewSelector(route) {
  if (route.kind === 'home') return '.catalog--full .catalog-grid'
  if (route.worksheet?.id === 'multiply') return '.mult-table'
  if (route.worksheet?.interactive) return '.eq-explorer, .print-area'
  return '.print-area'
}

/** Everything the generator needs per page, independent of the browser. */
export function ogTargets(filter = '') {
  const all = [
    {
      route: homeRoute(),
      title: BRAND,
      subtitle: 'Printable math worksheets for grades 1–3',
      badges: ['Free', 'Randomized', 'Print-ready'],
      color: THEME_COLOR,
    },
    ...WORKSHEETS.map(ws => ({
      route: worksheetRoute(ws),
      title: ws.label,
      subtitle: ws.shortDesc,
      badges: [`Grades ${ws.grades}`, ws.interactive ? 'Interactive' : 'Printable', ...ws.skills.slice(0, 2)],
      color: ws.color,
    })),
    {
      route: developersRoute(),
      title: 'Developer Resources',
      subtitle: 'Markdown twins, llms.txt and a JSON catalog for agents and crawlers',
      badges: ['llms.txt', 'worksheets.json', 'Markdown'],
      color: '#0f766e',
      lines: ['GET /llms.txt', 'GET /worksheets.json', 'GET /worksheets/<slug>.md', 'Accept: text/markdown'],
    },
  ]
  return all
    .map(t => ({ ...t, file: ogImagePath(t.route).replace(/^\//, '') }))
    .filter(t => !filter || t.route.path.includes(filter) || t.file.includes(filter))
}

/** The 1200×630 card. `shot` is a PNG data URI of the page preview (optional). */
export function renderCard({ title, subtitle, badges, color, lines = [] }, shot) {
  const badgeHtml = badges.map(b => `<span class="badge">${escapeHtml(b)}</span>`).join('')
  const preview = shot
    ? `<img class="shot" src="${shot}" alt="" />`
    : `<pre class="lines">${lines.map(escapeHtml).join('\n')}</pre>`
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${OG_WIDTH}px; height: ${OG_HEIGHT}px; overflow: hidden; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
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
    color: ${THEME_COLOR};
  }
  .brand svg { width: 26px; height: 26px; }
  h1 { font-size: 56px; line-height: 1.05; font-weight: 800; letter-spacing: -0.03em; color: ${color}; }
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
    position: absolute; right: 28px; bottom: 24px;
    font-size: 15px; font-weight: 600; color: #334155; letter-spacing: 0.01em;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 999px; padding: 8px 16px;
    box-shadow: 0 6px 20px -8px rgba(15, 23, 42, 0.35);
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
  <div class="tagline">${escapeHtml(TAGLINE)}</div>
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
      if (target.route.kind !== 'developers') {
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
      written.push(target.file)
      log(`og: ${target.file}`)
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
