#!/usr/bin/env node
/**
 * The README screenshots: the catalog and two worksheets, in English, at a
 * laptop width on a retina screen.
 *
 *   npm run screenshots
 *
 * Worksheets open at a fixed set number, which is the seed, so a rerun takes
 * the same pages. Needs Playwright's Chromium once
 * (`npx playwright install chromium`); PNGs are quantised with pngquant when it
 * is installed, as the OG cards are.
 */
import { execFile } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { promisify } from 'node:util'

const ROOT = resolve(new URL('..', import.meta.url).pathname)
const OUT = resolve(ROOT, 'screenshots')
const PORT = 5198
const SHOTS = [
  { file: 'catalog.png', path: '/', ready: '.catalog-section' },
  { file: 'multiplication.png', path: '/worksheets/multiplication?set=123', ready: '.print-area' },
  { file: 'add-subtract.png', path: '/worksheets/add-subtract?set=123', ready: '.print-area' },
]

async function quantise(file) {
  try {
    await promisify(execFile)('pngquant', ['--force', '--skip-if-larger', '--strip', '--quality', '65-90', '--ext', '.png', file])
  } catch { /* pngquant missing, or the result would be larger */ }
}

const [{ createServer }, { chromium }] = await Promise.all([import('vite'), import('playwright')])
const server = await createServer({ root: ROOT, server: { port: PORT, strictPort: true }, logLevel: 'error' })
await server.listen()
const browser = await chromium.launch()
try {
  await mkdir(OUT, { recursive: true })
  for (const shot of SHOTS) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 2 })
    await context.route(/googletagmanager|google-analytics/, route => route.abort())
    const page = await context.newPage()
    await page.goto(`http://localhost:${PORT}${shot.path}`, { waitUntil: 'load' })
    await page.locator(shot.ready).first().waitFor()
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(300)
    const file = resolve(OUT, shot.file)
    await page.screenshot({ path: file })
    await quantise(file)
    await context.close()
    console.log(`screenshots: ${shot.file}`)
  }
} finally {
  await browser.close()
  await server.close()
}
