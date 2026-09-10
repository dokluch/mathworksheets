#!/usr/bin/env node
/**
 * Screenshots the Bongard worksheet as it prints, for eyeballing a batch of
 * problems against the originals:
 *
 *   node scripts/bongard/snapshot.mjs [outDir] [seed] [band]
 *
 * Writes <outDir>/bongard-<perPage>.png for 2, 4 and 6 problems per page,
 * rendered in print media with the answer key on, plus the screen preview.
 * Math.random is seeded so a run is reproducible. Dev-only: needs the
 * Playwright Chromium build (`npx playwright install chromium`).
 */
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createServer } from 'vite'
import { chromium } from 'playwright'

const outDir = resolve(process.argv[2] || 'scripts/bongard/out')
const seed = Number(process.argv[3] || 1)
const band = process.argv[4] || 'all'
const PORT = 5199

function initScript(perPage, answerKey) {
  return `(() => {
    let s = ${seed >>> 0} || 1;
    Math.random = () => {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    try { localStorage.setItem('mathsheets', JSON.stringify({ bongard: { perPage: ${perPage}, answerKey: ${answerKey}, band: '${band}' } })) } catch {}
  })();`
}

await mkdir(outDir, { recursive: true })
const server = await createServer({ server: { port: PORT, strictPort: true }, logLevel: 'silent' })
await server.listen()
const browser = await chromium.launch()
try {
  for (const perPage of [2, 4, 6]) {
    const context = await browser.newContext({ viewport: { width: 1400, height: 1100 }, deviceScaleFactor: 2 })
    const page = await context.newPage()
    await page.addInitScript(initScript(perPage, true))
    await page.goto(`http://localhost:${PORT}/worksheets/bongard-problems`, { waitUntil: 'networkidle' })
    await page.waitForSelector('.bongard-figure')
    if (perPage === 4) await page.locator('.print-area').screenshot({ path: resolve(outDir, 'bongard-screen.png') })
    await page.emulateMedia({ media: 'print' })
    await page.locator('.tool-panel').screenshot({ path: resolve(outDir, `bongard-${perPage}.png`) })
    await page.pdf({ path: resolve(outDir, `bongard-${perPage}.pdf`), landscape: true, format: 'A4', printBackground: true })
    await context.close()
    console.log(`wrote bongard-${perPage}.png / .pdf`)
  }
} finally {
  await browser.close()
  await server.close()
}
