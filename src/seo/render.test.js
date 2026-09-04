import { describe, it, expect } from 'vitest'
import { WORKSHEETS } from '../worksheets.js'
import { SITE_URL, BRAND } from './site.js'
import {
  routes, findRoute, normalizePath, homeRoute, worksheetRoute, developersRoute,
  renderHead, renderStaticContent, injectRoute, structuredData, pageTitle,
  renderMarkdown, renderLlmsTxt, renderLlmsFullTxt, renderSitemap, renderRobots,
  renderCatalogJson, renderNotFoundMarkdown, renderNotFoundHtml, buildSiteFiles,
} from './render.js'

const TEMPLATE = `<!doctype html><html><head><meta charset="UTF-8" />
<!-- seo:head --><!-- /seo:head -->
</head><body><div id="root"></div>
<!-- seo:content --><!-- /seo:content -->
<script type="module" src="/assets/index.js"></script></body></html>`

function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function headingLevels(html) {
  return [...html.matchAll(/<h([1-6])\b/gi)].map(m => Number(m[1]))
}

function assertSequential(levels) {
  let prev = 0
  for (const l of levels) {
    expect(l).toBeLessThanOrEqual(prev + 1)
    prev = l
  }
}

describe('catalog invariants', () => {
  it('every worksheet has the fields the SEO layer needs', () => {
    for (const ws of WORKSHEETS) {
      expect(ws.id).toMatch(/^[a-z]+$/)
      expect(ws.slug).toMatch(/^[a-z0-9-]+$/)
      expect(ws.label.length).toBeGreaterThan(2)
      expect(ws.shortDesc.length).toBeGreaterThan(5)
      expect(ws.longDesc.length).toBeGreaterThan(80)
      expect(ws.grades).toMatch(/^\d(–\d)?$/)
      expect(ws.skills.length).toBeGreaterThan(0)
      expect(ws.settings.length).toBeGreaterThan(0)
      expect(ws.color).toMatch(/^#[0-9a-f]{6}$/)
    }
    const slugs = new Set(WORKSHEETS.map(w => w.slug))
    expect(slugs.size).toBe(WORKSHEETS.length)
  })
})

describe('routes', () => {
  it('lists home, every worksheet and developers', () => {
    const r = routes()
    expect(r.length).toBe(WORKSHEETS.length + 2)
    expect(r[0].path).toBe('/')
    expect(r.at(-1).path).toBe('/developers')
    expect(r.map(x => x.md)).toContain('/worksheets/multiplication.md')
  })

  it('findRoute resolves known paths and rejects unknown ones', () => {
    expect(findRoute('/').kind).toBe('home')
    expect(findRoute('/index.html').kind).toBe('home')
    expect(findRoute('/developers/').kind).toBe('developers')
    expect(findRoute('/worksheets/rounding').worksheet.id).toBe('rounding')
    expect(findRoute('/worksheets/rounding/').worksheet.id).toBe('rounding')
    expect(findRoute('/worksheets/nope')).toBeNull()
    expect(findRoute('/worksheets')).toBeNull()
    expect(findRoute('/some-path-that-does-not-exist')).toBeNull()
    expect(normalizePath('/a/b//')).toBe('/a/b')
  })
})

describe('renderHead', () => {
  it('home has brand title, canonical, absolute OG image, markdown alternate and JSON-LD', () => {
    const head = renderHead(homeRoute())
    expect(head).toContain(`<title>${BRAND} – Printable Math Worksheets for Grades 1–3</title>`)
    expect(head).toContain(`<link rel="canonical" href="${SITE_URL}/" />`)
    expect(head).toContain(`<meta property="og:url" content="${SITE_URL}/" />`)
    expect(head).toContain(`<meta property="og:image" content="${SITE_URL}/og/home.png" />`)
    expect(head).toContain(`<meta property="og:site_name" content="${BRAND}" />`)
    expect(head).toContain(`type="text/markdown" href="${SITE_URL}/index.md"`)
    expect(head).toContain('<meta name="robots" content="index, follow')
    const json = JSON.parse(head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
    const types = json['@graph'].map(n => n['@type'])
    expect(types).toEqual(expect.arrayContaining(['WebSite', 'WebApplication', 'Person', 'ItemList']))
    const app = json['@graph'].find(n => n['@type'] === 'WebApplication')
    expect(app.applicationCategory).toBe('EducationalApplication')
    expect(app.isAccessibleForFree).toBe(true)
  })

  it('worksheet pages get LearningResource + BreadcrumbList', () => {
    const route = worksheetRoute(WORKSHEETS[0])
    const head = renderHead(route)
    expect(head).toContain(`<title>${pageTitle(route)}</title>`)
    expect(pageTitle(route)).toBe(`Multiplication Worksheets · ${BRAND}`)
    const sd = structuredData(route)
    const lr = sd['@graph'].find(n => n['@type'] === 'LearningResource')
    expect(lr.learningResourceType).toBe('Worksheet')
    expect(lr.teaches).toEqual(WORKSHEETS[0].skills)
    const bc = sd['@graph'].find(n => n['@type'] === 'BreadcrumbList')
    expect(bc.itemListElement.length).toBe(2)
    expect(bc.itemListElement[1].item).toBe(`${SITE_URL}/worksheets/multiplication`)
  })

  it('escapes HTML in attributes and never breaks out of the JSON-LD script', () => {
    const head = renderHead(developersRoute())
    expect(head).not.toMatch(/content="[^"]*<[^"]*"/)
    expect(head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]).not.toContain('</')
  })
})

describe('renderStaticContent', () => {
  it('home serves >= 500 chars of text, one H1 with the brand, sequential headings, links to every worksheet', () => {
    const html = renderStaticContent(homeRoute())
    expect(textOf(html).length).toBeGreaterThanOrEqual(500)
    expect((html.match(/<h1\b/g) || []).length).toBe(1)
    // The H1 carries the brand icon (inline SVG, aria-hidden) followed by the brand text.
    expect(html).toMatch(new RegExp(`<h1 class="catalog-title"><svg [^>]*aria-hidden="true"[^>]*>[\\s\\S]*?</svg>${BRAND} – Printable Math Worksheets for Grades 1–3</h1>`))
    assertSequential(headingLevels(html))
    for (const ws of WORKSHEETS) expect(html).toContain(`href="/worksheets/${ws.slug}"`)
    expect(html).toContain('href="/llms.txt"')
    expect(html).toContain('href="/developers"')
    expect(html.startsWith('<div id="static-content">')).toBe(true)
  })

  it('each worksheet page has one H1, its settings and links to the others', () => {
    for (const ws of WORKSHEETS) {
      const html = renderStaticContent(worksheetRoute(ws))
      expect((html.match(/<h1\b/g) || []).length).toBe(1)
      expect(html).toContain(`${ws.label.replace(/&/g, '&amp;')} Worksheets</h1>`)
      assertSequential(headingLevels(html))
      expect(textOf(html).length).toBeGreaterThanOrEqual(500)
      for (const s of ws.settings) expect(textOf(html)).toContain(s)
      for (const other of WORKSHEETS.filter(w => w !== ws)) expect(html).toContain(`href="/worksheets/${other.slug}"`)
    }
  })

  it('developers page names the product and lists resources', () => {
    const html = renderStaticContent(developersRoute())
    expect(html).toContain(`${BRAND} Developer Resources</h1>`)
    expect(html).toContain('href="/worksheets.json"')
    expect(html).toContain('github.com/dokluch/mathworksheets')
    assertSequential(headingLevels(html))
  })
})

describe('injectRoute', () => {
  it('fills both marker blocks and keeps the rest of the template', () => {
    const out = injectRoute(TEMPLATE, homeRoute())
    expect(out).toContain('<!-- seo:head -->')
    expect(out).toContain('<title>')
    expect(out).toContain('<div id="static-content">')
    expect(out).toContain('<div id="root"></div>')
    expect(out).toContain('/assets/index.js')
  })

  it('is idempotent (prerender re-runs on the already injected template)', () => {
    const once = injectRoute(TEMPLATE, homeRoute())
    const twice = injectRoute(once, worksheetRoute(WORKSHEETS[1]))
    expect((twice.match(/<title>/g) || []).length).toBe(1)
    expect(twice).toContain('Add &amp; Subtract Worksheets</h1>')
    expect(twice).not.toContain('Printable Math Worksheets for Grades 1–3</h1>')
  })

  it('throws when markers are missing', () => {
    expect(() => injectRoute('<html></html>', homeRoute())).toThrow(/seo:head/)
  })
})

describe('markdown twins', () => {
  it('every route renders markdown that starts with a single H1 and links absolute URLs', () => {
    for (const route of routes()) {
      const md = renderMarkdown(route)
      expect(md.startsWith('# ')).toBe(true)
      expect((md.match(/^# /gm) || []).length).toBe(1)
      expect(md).toContain(`](${SITE_URL}/`)
      expect(md).not.toContain('](/')
    }
  })

  it('worksheet markdown includes description, settings and other sheets', () => {
    const ws = WORKSHEETS.find(w => w.id === 'addsub')
    const md = renderMarkdown(worksheetRoute(ws))
    expect(md).toContain(ws.longDesc)
    for (const s of ws.settings) expect(md).toContain(`- ${s}`)
    expect(md).toContain(`${SITE_URL}/worksheets/multiplication.md`)
  })
})

describe('llms.txt (llmstxt.org format)', () => {
  const txt = renderLlmsTxt()
  const lines = txt.split('\n')

  it('starts with an H1 project name followed by a blockquote summary', () => {
    expect(lines[0]).toBe(`# ${BRAND}`)
    expect(lines[1]).toBe('')
    expect(lines[2].startsWith('> ')).toBe(true)
  })

  it('has only one H1 and H2 file-list sections whose items are "- [title](url): notes"', () => {
    expect((txt.match(/^# /gm) || []).length).toBe(1)
    expect(txt).not.toMatch(/^### /m)
    const sections = txt.split(/^## /m).slice(1)
    expect(sections.map(s => s.split('\n')[0])).toEqual(['Worksheets', 'Developers', 'Optional'])
    for (const section of sections) {
      const items = section.split('\n').slice(1).filter(l => l.trim() !== '')
      expect(items.length).toBeGreaterThan(0)
      for (const item of items) expect(item).toMatch(/^- \[[^\]]+\]\(https?:\/\/[^)]+\)(: .+)?$/)
    }
  })

  it('lists every worksheet markdown twin with absolute URLs', () => {
    for (const ws of WORKSHEETS) expect(txt).toContain(`](${SITE_URL}/worksheets/${ws.slug}.md)`)
    expect(txt).toContain(`${SITE_URL}/llms-full.txt`)
    expect(txt).toContain(`${SITE_URL}/worksheets.json`)
  })
})

describe('llms-full.txt', () => {
  it('contains every page in order, separated by horizontal rules', () => {
    const full = renderLlmsFullTxt()
    const h1s = full.match(/^# .+$/gm)
    expect(h1s.length).toBe(routes().length)
    expect(h1s[0]).toContain(BRAND)
    for (const ws of WORKSHEETS) expect(full).toContain(`# ${ws.label} Worksheets`)
    expect(full).toContain('\n---\n')
    expect(full.endsWith('\n')).toBe(true)
  })
})

describe('sitemap / robots / catalog', () => {
  it('sitemap lists each HTML route exactly once with absolute locs and a lastmod', () => {
    const xml = renderSitemap({ now: new Date('2026-09-04T12:00:00Z') })
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])
    expect(locs).toEqual(routes().map(r => `${SITE_URL}${r.path}`))
    expect(new Set(locs).size).toBe(locs.length)
    expect(xml).toContain('<lastmod>2026-09-04</lastmod>')
    expect(xml).not.toContain('.md</loc>')
  })

  it('robots allows everyone, names AI crawlers and points at the sitemap', () => {
    const robots = renderRobots()
    expect(robots).toMatch(/User-agent: \*\nAllow: \//)
    expect(robots).toContain('User-agent: GPTBot\nAllow: /')
    expect(robots).toContain('User-agent: ClaudeBot\nAllow: /')
    expect(robots.trim().endsWith(`Sitemap: ${SITE_URL}/sitemap.xml`)).toBe(true)
  })

  it('worksheets.json round-trips and mirrors the catalog', () => {
    const json = JSON.parse(renderCatalogJson({ now: new Date('2026-09-04T12:00:00Z') }))
    expect(json.name).toBe(BRAND)
    expect(json.worksheets.length).toBe(WORKSHEETS.length)
    expect(json.generatedAt).toBe('2026-09-04T12:00:00.000Z')
    const first = json.worksheets[0]
    expect(first).toMatchObject({
      id: 'multiply',
      slug: 'multiplication',
      url: `${SITE_URL}/worksheets/multiplication`,
      markdownUrl: `${SITE_URL}/worksheets/multiplication.md`,
      printable: true,
      interactive: false,
    })
    expect(json.worksheets.find(w => w.id === 'eqexplore').printable).toBe(false)
  })
})

describe('404 bodies', () => {
  it('markdown 404 mentions the path, status and recovery links', () => {
    const md = renderNotFoundMarkdown('/nope')
    expect(md.startsWith('# 404 – Page not found')).toBe(true)
    expect(md).toContain('`/nope`')
    expect(md).toContain('HTTP status 404')
    expect(md).toContain(`${SITE_URL}/sitemap.xml`)
    expect(md).toContain(`${SITE_URL}/llms.txt`)
    expect(md).toContain(`${SITE_URL}/worksheets/multiplication`)
  })

  it('html 404 is a standalone noindex document with the same links and escapes the path', () => {
    const html = renderNotFoundHtml('/<script>')
    expect(html).toContain('<meta name="robots" content="noindex" />')
    expect(html).toContain('&lt;script&gt;')
    expect(html).not.toContain('<script>')
    expect(html).toContain('href="/llms.txt"')
    expect(html).toContain('href="/sitemap.xml"')
  })
})

describe('buildSiteFiles', () => {
  it('produces every crawlable file from the template', () => {
    const files = buildSiteFiles(TEMPLATE, { now: new Date('2026-09-04T12:00:00Z') })
    const names = Object.keys(files)
    expect(names).toEqual(expect.arrayContaining([
      'index.html', 'index.md', 'developers.html', 'developers.md',
      'llms.txt', 'llms-full.txt', 'sitemap.xml', 'robots.txt', 'worksheets.json', '404.html',
      ...WORKSHEETS.flatMap(w => [`worksheets/${w.slug}.html`, `worksheets/${w.slug}.md`]),
    ]))
    expect(names.length).toBe(2 * routes().length + 6)
    expect(files['worksheets/rounding.html']).toContain(`<title>Rounding Worksheets · ${BRAND}</title>`)
    expect(files['worksheets/rounding.html']).toContain('/assets/index.js')
  })
})
