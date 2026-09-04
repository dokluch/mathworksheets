#!/usr/bin/env node
/**
 * Post-build step: derive every crawlable file from the worksheet catalog.
 *
 *   node scripts/prerender.mjs [distDir]
 *
 * Writes per-route HTML (from the built index.html template), Markdown twins,
 * llms.txt, llms-full.txt, sitemap.xml, robots.txt, worksheets.json, 404.html.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { buildSiteFiles } from '../src/seo/render.js'

export async function prerender(distDir, { now = new Date(), log = console.log } = {}) {
  const template = await readFile(resolve(distDir, 'index.html'), 'utf8')
  const files = buildSiteFiles(template, { now })
  const written = []
  for (const [rel, content] of Object.entries(files)) {
    const target = resolve(distDir, rel)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, content, 'utf8')
    written.push(rel)
  }
  log(`prerender: wrote ${written.length} files to ${distDir}\n  ${written.join('\n  ')}`)
  return written
}

const isMain = process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname
if (isMain) {
  const dist = resolve(process.argv[2] || 'dist')
  prerender(dist).catch(err => {
    console.error(err)
    process.exit(1)
  })
}
