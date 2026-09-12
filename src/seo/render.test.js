import { describe, it, expect } from 'vitest'
import { WORKSHEETS } from '../worksheets.js'
import { PAGES } from '../pages.js'
import { AGENT_GUIDANCE } from '../agents.js'
import { SITE_URL, BRAND, BRAND_ALT, OPERATOR, CONTACT_EMAIL, OG_IMAGE_PATH, GITHUB_URL, LICENSE_NAME, TAGLINE } from './site.js'
import { GRADES, GRADE_BAND } from '../lib/grades.js'
import { LOCALES, LOCALE_META, localizeWorksheet, localizePage } from '../i18n/index.js'
import {
  routes, findRoute, normalizePath, homeRoute, worksheetRoute, pageRoute, sameRouteIn,
  renderHead, renderStaticContent, footerHtml, siteFooterLinks, injectRoute, structuredData, pageTitle,
  ogImagePath, inlineHtml, inlineMarkdown,
  renderMarkdown, renderLlmsTxt, renderLlmsFullTxt, renderSitemap, renderRobots,
  renderCatalogJson, renderNotFoundMarkdown, renderNotFoundHtml, buildSiteFiles, renderAgentsMarkdown,
  worksheetDetailsHtml, agesForGrades, gradeNumbers, lastContentUpdate, escapeHtml,
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
      expect(ws.examples.length).toBeGreaterThanOrEqual(3)
      expect(ws.faq.length).toBeGreaterThanOrEqual(3)
      for (const { q, a } of ws.faq) {
        expect(q.trim().endsWith('?')).toBe(true)
        expect(a.length).toBeGreaterThan(80)
      }
      expect(ws.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(ws.updated <= new Date().toISOString().slice(0, 10)).toBe(true)
    }
    const slugs = new Set(WORKSHEETS.map(w => w.slug))
    expect(slugs.size).toBe(WORKSHEETS.length)
  })

  it('examples are mathematical notation only, so they need no translation', () => {
    // The moment someone writes "Add 348 and 275" here it becomes an English
    // string rendered on all seven locales' pages. This is the guard.
    for (const ws of WORKSHEETS) {
      for (const example of ws.examples) {
        // Geometric-shape glyphs are the Bongard sheet's notation: a picture, not a sentence.
        // The slash is a fraction bar written on one line, and reads the same in every language.
        expect(example).toMatch(/^[0-9x\s+\-−×÷=<>?□→.,()/○●△▲■▪▯▭│]+$/)
      }
    }
  })

  it('prerequisites and next steps reference real, other worksheets', () => {
    for (const ws of WORKSHEETS) {
      for (const id of [...ws.prerequisites, ...ws.nextSteps]) {
        expect(id).not.toBe(ws.id)
        expect(WORKSHEETS.some(w => w.id === id)).toBe(true)
      }
    }
  })

  it('lastContentUpdate is the newest date across worksheets and pages', () => {
    const all = [...WORKSHEETS.map(w => w.updated), ...PAGES.map(p => p.updated)]
    expect(lastContentUpdate()).toBe(all.sort().pop())
    expect(lastContentUpdate()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('agesForGrades derives an age band from every grade value', () => {
    expect(agesForGrades('2')).toBe('7-8')
    expect(agesForGrades('1–3')).toBe('6-9')
    expect(agesForGrades('4')).toBe('9-10')
    expect(agesForGrades('4–6')).toBe('9-12')
    expect(agesForGrades(GRADE_BAND)).toBe('6-12')
    for (const ws of WORKSHEETS) expect(agesForGrades(ws.grades)).toMatch(/^\d+-\d+$/)
  })

  it('offers no grade the catalog cannot answer', () => {
    // The filter lists every grade in GRADES; a grade with no sheet behind it
    // is an empty grid and a "0 sheets" count, with nothing to explain it.
    for (const grade of GRADES) {
      const matches = WORKSHEETS.filter(ws => gradeNumbers(ws.grades).includes(Number(grade)))
      expect(matches.length, `grade ${grade}`).toBeGreaterThan(0)
    }
  })

  it('gradeNumbers expands a band into every grade it covers', () => {
    expect(gradeNumbers('3')).toEqual([3])
    expect(gradeNumbers('1–3')).toEqual([1, 2, 3])
    for (const ws of WORKSHEETS) {
      const grades = gradeNumbers(ws.grades)
      expect(grades.length).toBeGreaterThan(0)
      for (const g of grades) expect(g).toBeGreaterThanOrEqual(1)
      for (const g of grades) expect(g).toBeLessThanOrEqual(GRADES.length)
    }
  })
})

describe('routes', () => {
  it('lists home, every worksheet and every static page', () => {
    const r = routes('en')
    expect(r.length).toBe(WORKSHEETS.length + 1 + PAGES.length)
    expect(routes().length).toBe(LOCALES.length * r.length)
    expect(routes().slice(0, r.length).map(x => x.path)).toEqual(r.map(x => x.path))
    expect(r[0].path).toBe('/')
    expect(r.slice(-PAGES.length).map(x => x.path)).toEqual(['/about', '/privacy', '/terms'])
    expect(r.map(x => x.md)).toContain('/worksheets/multiplication.md')
    expect(r.map(x => x.md)).toContain('/privacy.md')
    expect(new Set(r.map(x => x.path)).size).toBe(r.length)
  })

  it('static pages have the fields the renderer needs', () => {
    for (const p of PAGES) {
      expect(p.slug).toMatch(/^[a-z0-9-]+$/)
      expect(p.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(new Date(p.updated).getTime()).toBeLessThanOrEqual(Date.now())
      expect(p.description.length).toBeGreaterThan(40)
      expect(p.sections.length).toBeGreaterThan(2)
      for (const s of p.sections) expect((s.paragraphs?.length || 0) + (s.items?.length || 0)).toBeGreaterThan(0)
    }
  })

  it('findRoute resolves known paths and rejects unknown ones', () => {
    expect(findRoute('/').kind).toBe('home')
    expect(findRoute('/index.html').kind).toBe('home')
    expect(findRoute('/developers')).toBeNull()
    expect(findRoute('/about').kind).toBe('page')
    expect(findRoute('/privacy/').page.slug).toBe('privacy')
    expect(findRoute('/terms').path).toBe('/terms')
    expect(findRoute('/privacy.md')).toBeNull()
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
    expect(head).toContain(`<title>${BRAND} – ${TAGLINE}</title>`)
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

  it('static pages get a WebPage with dateModified, breadcrumbs and the home OG image', () => {
    for (const page of PAGES) {
      const route = pageRoute(page)
      const head = renderHead(route)
      expect(pageTitle(route)).toBe(`${page.title} · ${BRAND}`)
      expect(head).toContain(`<title>${page.title} · ${BRAND}</title>`)
      expect(head).toContain(`<link rel="canonical" href="${SITE_URL}/${page.slug}" />`)
      expect(head).toContain(`type="text/markdown" href="${SITE_URL}/${page.slug}.md"`)
      expect(ogImagePath(route)).toBe(OG_IMAGE_PATH)
      expect(head).toContain(`<meta property="og:image" content="${SITE_URL}${OG_IMAGE_PATH}" />`)
      const sd = structuredData(route)
      const wp = sd['@graph'].find(n => n['@type'] === 'WebPage')
      expect(wp.dateModified).toBe(page.updated)
      expect(wp.url).toBe(`${SITE_URL}/${page.slug}`)
      const bc = sd['@graph'].find(n => n['@type'] === 'BreadcrumbList')
      expect(bc.itemListElement.map(i => i.name)).toEqual([BRAND, page.navLabel])
    }
  })

  it('escapes HTML in attributes and never breaks out of the JSON-LD script', () => {
    const head = renderHead(pageRoute(PAGES[0]))
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
    expect(html).toMatch(new RegExp(`<h1 class="catalog-title"><svg [^>]*aria-hidden="true"[^>]*>[\\s\\S]*?</svg>${BRAND} – ${TAGLINE}</h1>`))
    assertSequential(headingLevels(html))
    for (const ws of WORKSHEETS) expect(html).toContain(`href="/worksheets/${ws.slug}"`)
    // Reader-facing pages no longer carry the agent-links paragraph; agents
    // find llms.txt at its root path and the .md twin via the Link header.
    expect(html).not.toContain('href="/llms.txt"')
    expect(html).not.toContain('href="/developers"')
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

  it('every worksheet page contains worksheetDetailsHtml verbatim', () => {
    // components/WorksheetDetails.jsx renders this exact string after hydration.
    // If the prerendered page and the shared fragment ever diverge, the React
    // view silently drops crawlable copy — which is the bug this guards.
    for (const locale of LOCALES) {
      for (const ws of WORKSHEETS) {
        const route = worksheetRoute(ws, locale)
        expect(renderStaticContent(route)).toContain(worksheetDetailsHtml(route))
      }
    }
  })

  it('worksheetDetailsHtml carries the prose and sibling links but no heading', () => {
    const ws = WORKSHEETS[0]
    const details = worksheetDetailsHtml(worksheetRoute(ws))
    expect(details).not.toContain('<h1')
    expect(textOf(details)).toContain(ws.longDesc)
    for (const s of ws.settings) expect(textOf(details)).toContain(s)
    for (const other of WORKSHEETS.filter(w => w !== ws)) {
      expect(details).toContain(`href="/worksheets/${other.slug}"`)
    }
    expect(details).not.toContain('href="/llms.txt"')
  })

  it('example problems reach the HTML and the Markdown twin in every locale', () => {
    for (const locale of LOCALES) {
      for (const ws of WORKSHEETS) {
        const route = worksheetRoute(ws, locale)
        const html = renderStaticContent(route)
        const md = renderMarkdown(route)
        for (const example of ws.examples) {
          expect(textOf(html)).toContain(example)
          expect(md).toContain(example)
        }
      }
    }
  })

  it('every worksheet page carries its FAQ in HTML, Markdown and JSON-LD', () => {
    for (const locale of LOCALES) {
      for (const ws of WORKSHEETS) {
        const route = worksheetRoute(ws, locale)
        const localized = localizeWorksheet(ws, locale)
        // Compared escaped: the comparison FAQ legitimately contains > and <.
        const html = renderStaticContent(route)
        const md = renderMarkdown(route)
        const faqNode = structuredData(route)['@graph'].find(n => n['@type'] === 'FAQPage')
        expect(faqNode.mainEntity.length).toBe(localized.faq.length)
        localized.faq.forEach((item, i) => {
          expect(html).toContain(escapeHtml(item.q))
          expect(html).toContain(escapeHtml(item.a))
          expect(md).toContain(item.q)
          expect(faqNode.mainEntity[i].name).toBe(item.q)
          expect(faqNode.mainEntity[i].acceptedAnswer.text).toBe(item.a)
        })
      }
    }
  })

  it('worksheetDetailsHtml escapes worksheet copy', () => {
    const hostile = { ...WORKSHEETS[0], longDesc: '<script>x</script> a "b"', settings: ['<img onerror=1>'] }
    const details = worksheetDetailsHtml({ ...worksheetRoute(WORKSHEETS[0]), worksheet: hostile })
    expect(details).not.toContain('<script>')
    expect(details).not.toContain('<img onerror')
    expect(details).toContain('&lt;script&gt;x&lt;/script&gt;')
    expect(details).toContain('&lt;img onerror=1&gt;')
  })

  it('each static page has one H1, sequential headings, a breadcrumb, its sections and the operator', () => {
    for (const page of PAGES) {
      const html = renderStaticContent(pageRoute(page))
      expect((html.match(/<h1\b/g) || []).length).toBe(1)
      expect(html).toContain(`<h1 class="catalog-title">${page.title}</h1>`)
      assertSequential(headingLevels(html))
      expect(textOf(html).length).toBeGreaterThanOrEqual(600)
      expect(html).toContain(`<nav aria-label="Breadcrumb"><a href="/">${BRAND}</a>`)
      expect(html).toContain(`Last updated ${new Date(`${page.updated}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}`)
      for (const s of page.sections) expect(html).toContain(`<h2>${s.heading}</h2>`)
      expect(textOf(html)).toContain(OPERATOR)
      expect(html).toContain(`href="mailto:${CONTACT_EMAIL}"`)
      expect(html).not.toContain('](')
    }
    expect(renderStaticContent(pageRoute(PAGES[0]))).toContain('href="/privacy"')
  })

  it('every kind of page carries the site header with a brand link home and the About page', () => {
    for (const route of routes()) {
      const html = renderStaticContent(route)
      const prefix = route.locale === 'en' ? '' : `/${route.locale}`
      expect(html).toContain('<header class="site-header no-print">')
      expect(html).toContain(`<a class="site-brand" href="${prefix || '/'}">`)
      expect(html).toContain(`<a class="site-nav-link" href="${prefix}/about">`)
      expect((html.match(/<h1\b/g) || []).length).toBe(1)
    }
  })

  it('every kind of page carries the site footer with links to the static pages', () => {
    for (const route of routes('en')) {
      const html = renderStaticContent(route)
      expect(html.startsWith('<div id="static-content">')).toBe(true)
      expect(html).toContain('<footer class="site-footer no-print">')
      for (const p of PAGES) expect(html).toContain(`href="/${p.slug}"`)
      expect(html).toContain(OPERATOR)
      expect(html).toContain('creativecommons.org/licenses/by-nc/4.0/')
    }
    expect(siteFooterLinks().map(l => l.label)).toEqual(['About', 'Privacy', 'Terms'])
    expect(footerHtml({ year: 2030 })).toContain('© 2030 ')
    expect(headingLevels(footerHtml())).toEqual([])
  })

  it('the home page and the About page do not link GitHub', () => {
    // The repository is going private; only /developers still names it.
    for (const locale of LOCALES) {
      const about = PAGES.find(p => p.id === 'about')
      for (const route of [homeRoute(locale), pageRoute(about, locale), worksheetRoute(WORKSHEETS[0], locale)]) {
        expect(renderStaticContent(route)).not.toContain(GITHUB_URL)
        expect(renderMarkdown(route)).not.toContain(GITHUB_URL)
      }
    }
  })

  it('inline helpers escape HTML and turn [label](url) into links', () => {
    expect(inlineHtml('a <b> & [Docs](/developers) or [X](https://x.test/p)'))
      .toBe('a &lt;b&gt; &amp; <a href="/developers">Docs</a> or <a href="https://x.test/p" rel="noopener">X</a>')
    expect(inlineMarkdown('[Docs](/developers) and [X](https://x.test/p)'))
      .toBe(`[Docs](${SITE_URL}/developers) and [X](https://x.test/p)`)
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
    expect(twice).not.toContain(`${TAGLINE}</h1>`)
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

  it('static page markdown carries the sections, the date and links to the other pages', () => {
    for (const page of PAGES) {
      const md = renderMarkdown(pageRoute(page))
      expect(md.startsWith(`# ${page.title}\n\n> `)).toBe(true)
      expect(md).toMatch(/\*\*Last updated:\*\* [A-Z][a-z]+ \d{1,2}, \d{4}/)
      for (const s of page.sections) expect(md).toContain(`\n## ${s.heading}\n`)
      expect(md).toContain(OPERATOR)
      expect(md).toContain(`mailto:${CONTACT_EMAIL}`)
      expect(md).toContain(`${SITE_URL}/index.md`)
      for (const other of PAGES.filter(p => p !== page)) expect(md).toContain(`](${SITE_URL}/${other.slug}.md)`)
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

  it('carries a generated grade and skill index a model can answer from', () => {
    const preamble = txt.split(/^## /m)[0]
    expect(preamble).toContain('Choosing a worksheet — by grade:')
    expect(preamble).toContain('Choosing a worksheet — by skill:')
    for (const grade of GRADES) expect(preamble).toContain(`- Grade ${grade} (ages `)
    // The query this exists to answer: "2nd grader learning carrying".
    expect(preamble).toContain('carrying / regrouping')
    for (const ws of WORKSHEETS) expect(preamble).toContain(ws.label)
  })

  it('states how AI answers should cite and reuse the site', () => {
    const preamble = txt.split(/^## /m)[0]
    expect(preamble).toContain('CC BY-NC 4.0')
    expect(preamble).toContain('non-commercial use only')
    expect(preamble).toContain('AI crawling and AI answers are explicitly permitted')
    expect(preamble).toMatch(/Last updated: \d{4}-\d{2}-\d{2}/)
  })

  it('each worksheet note carries the grades, skills and an example', () => {
    const section = txt.split(/^## Worksheets/m)[1].split(/^## /m)[0]
    for (const ws of WORKSHEETS) {
      const line = section.split('\n').find(l => l.includes(`](${SITE_URL}/worksheets/${ws.slug}.md)`))
      expect(line).toBeTruthy()
      expect(line).toContain(`(ages ${agesForGrades(ws.grades)})`)
      expect(line).toContain(`teaches ${ws.skills.join(', ')}`)
      expect(line).toContain(`example: ${ws.examples[0]}`)
    }
  })

  it('files the static pages under Optional', () => {
    const optional = txt.split(/^## Optional/m)[1]
    for (const p of PAGES) expect(optional).toContain(`- [${p.title}](${SITE_URL}/${p.slug}.md): `)
  })
})

describe('llms-full.txt', () => {
  it('opens with a headingless preamble naming the site, licence and scope', () => {
    const full = renderLlmsFullTxt()
    const preamble = full.split('\n\n---\n\n')[0]
    expect(preamble.startsWith(`${BRAND} — full site content`)).toBe(true)
    // A `# ` line here would break the one-H1-per-route invariant below.
    expect(preamble).not.toMatch(/^# /m)
    expect(preamble).toContain(`${SITE_URL}/`)
    expect(preamble).toContain('CC BY-NC 4.0')
    expect(preamble).toContain('Choosing a worksheet — by grade:')
    expect(preamble).toContain('English only')
    expect(preamble).toContain(`${SITE_URL}/worksheets.json`)
  })

  it('contains every page in order, separated by horizontal rules', () => {
    const full = renderLlmsFullTxt()
    const h1s = full.match(/^# .+$/gm)
    expect(h1s.length).toBe(routes('en').length)
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
    expect(xml).toMatch(new RegExp(`<loc>${SITE_URL}/privacy</loc>\\s*<lastmod>[^<]+</lastmod>\\s*<changefreq>monthly</changefreq>\\s*<priority>0.3</priority>`))
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
    expect(json.pages).toEqual({ about: `${SITE_URL}/about`, privacy: `${SITE_URL}/privacy`, terms: `${SITE_URL}/terms` })
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
    expect(md).toContain(`[Privacy Policy](${SITE_URL}/privacy)`)
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

describe('i18n routes and surfaces', () => {
  const others = LOCALES.filter(l => l !== 'en')
  const ws = WORKSHEETS.find(w => w.id === 'rounding')

  it('builds locale-prefixed paths and files, English at the root', () => {
    expect(homeRoute('fr')).toMatchObject({ kind: 'home', locale: 'fr', path: '/fr', md: '/fr.md', html: 'fr.html', mdFile: 'fr.md' })
    expect(worksheetRoute(ws, 'de')).toMatchObject({ locale: 'de', path: '/de/worksheets/rounding', md: '/de/worksheets/rounding.md', html: 'de/worksheets/rounding.html', mdFile: 'de/worksheets/rounding.md' })
    expect(pageRoute(PAGES[0], 'zh').path).toBe('/zh/about')
    expect(pageRoute(PAGES[1], 'it')).toMatchObject({ kind: 'page', locale: 'it', path: '/it/privacy', html: 'it/privacy.html' })
    expect(worksheetRoute(ws, 'fr').worksheet).toEqual(localizeWorksheet(ws, 'fr'))
    expect(worksheetRoute(ws, 'fr').worksheet.slug).toBe(ws.slug)
    expect(pageRoute(PAGES[0], 'es').page).toEqual(localizePage(PAGES[0], 'es'))
    expect(new Set(routes().map(r => r.path)).size).toBe(routes().length)
    expect(new Set(routes().map(r => r.html)).size).toBe(routes().length)
  })

  it('findRoute round-trips every route and rejects /en and unknown prefixes', () => {
    for (const r of routes()) {
      expect(findRoute(r.path), r.path).toMatchObject({ kind: r.kind, locale: r.locale, path: r.path })
    }
    expect(findRoute('/fr/').path).toBe('/fr')
    expect(findRoute('/fr/index.html').path).toBe('/fr')
    expect(findRoute('/fr/worksheets/rounding/').worksheet.id).toBe('rounding')
    expect(findRoute('/en')).toBeNull()
    expect(findRoute('/en/about')).toBeNull()
    expect(findRoute('/xx/about')).toBeNull()
    expect(findRoute('/fr/worksheets/nope')).toBeNull()
    expect(findRoute('/fr/nope')).toBeNull()
    expect(sameRouteIn(findRoute('/fr/privacy'), 'en').path).toBe('/privacy')
    expect(sameRouteIn(findRoute('/worksheets/rounding'), 'ru').path).toBe('/ru/worksheets/rounding')
  })

  it('head carries hreflang for every locale plus x-default, og:locale(:alternate), inLanguage and a localized og:image', () => {
    for (const locale of LOCALES) {
      for (const route of [homeRoute(locale), worksheetRoute(ws, locale), pageRoute(PAGES[0], locale)]) {
        const head = renderHead(route)
        const hreflangs = [...head.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)" \/>/g)].map(m => [m[1], m[2]])
        expect(hreflangs.length).toBe(LOCALES.length + 1)
        expect(hreflangs.find(([h]) => h === 'x-default')[1]).toBe(`${SITE_URL}${sameRouteIn(route, 'en').path}`)
        expect(hreflangs.find(([h]) => h === LOCALE_META[locale].hreflang)[1]).toBe(`${SITE_URL}${route.path}`)
        expect(head).toContain(`<link rel="canonical" href="${SITE_URL}${route.path}" />`)
        expect(head).toContain(`<meta property="og:locale" content="${LOCALE_META[locale].og}" />`)
        expect((head.match(/og:locale:alternate/g) || []).length).toBe(LOCALES.length - 1)
        expect(head).toContain(`type="text/markdown" href="${SITE_URL}${route.md}"`)
        const image = ogImagePath(route)
        expect(image).toBe(locale === 'en' ? ogImagePath(sameRouteIn(route, 'en')) : ogImagePath(sameRouteIn(route, 'en')).replace('/og/', `/og/${locale}/`))
        if (route.kind === 'page') expect(image).toBe(ogImagePath(homeRoute(locale)))
        expect(head).toContain(`<meta property="og:image" content="${SITE_URL}${image}" />`)
        expect(head).toContain(`<meta name="twitter:image" content="${SITE_URL}${image}" />`)
        const json = JSON.parse(head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
        const app = json['@graph'].find(n => n['@type'] === 'WebApplication')
        if (app) expect(app.screenshot).toBe(`${SITE_URL}${ogImagePath(homeRoute(locale))}`)
        const langs = json['@graph'].filter(n => n.inLanguage).map(n => n.inLanguage)
        expect(langs.length).toBeGreaterThan(0)
        for (const l of langs) expect(l).toBe(LOCALE_META[locale].lang)
      }
    }
  })

  it('translates titles, keeps German nouns capitalised and never lowercases in de', () => {
    expect(pageTitle(worksheetRoute(ws, 'fr'))).toBe(`Fiches ${localizeWorksheet(ws, 'fr').label} · ${BRAND}`)
    const de = worksheetRoute(ws, 'de')
    const label = localizeWorksheet(ws, 'de').label
    expect(label).not.toBe(ws.label)
    const description = renderHead(de).match(/<meta name="description" content="([^"]*)"/)[1]
    expect(description.startsWith(`Kostenlose ${label}`)).toBe(true)
  })

  it('injectRoute sets <html lang> for the locale (and for a bare <html>)', () => {
    expect(injectRoute(TEMPLATE, homeRoute('fr'))).toContain('<html lang="fr">')
    expect(injectRoute(TEMPLATE, worksheetRoute(ws, 'zh'))).toContain('<html lang="zh-Hans">')
    expect(injectRoute('<html lang="en"><head><!-- seo:head --><!-- /seo:head --></head><body><!-- seo:content --><!-- /seo:content --></body></html>', homeRoute('ru'))).toContain('<html lang="ru">')
    expect(injectRoute(TEMPLATE, homeRoute())).toContain('<html lang="en">')
  })

  it('static content per locale: one H1, sequential headings, localized links, enough text, unprefixed agent files', () => {
    for (const locale of others) {
      const min = locale === 'zh' ? 300 : 500
      for (const route of routes(locale)) {
        const html = renderStaticContent(route)
        expect((html.match(/<h1\b/g) || []).length, route.path).toBe(1)
        assertSequential(headingLevels(html))
        expect(textOf(html).length, route.path).toBeGreaterThanOrEqual(min)
        if (route.kind !== 'home') expect(html).toContain(`href="${homeRoute(locale).path}"`)
        for (const p of PAGES) expect(html).toContain(`href="/${locale}/${p.slug}"`)
        expect(html).not.toContain(`href="/${locale}/llms.txt"`)
      }
      const home = renderStaticContent(homeRoute(locale))
      for (const w of WORKSHEETS) expect(home).toContain(`href="/${locale}/worksheets/${w.slug}"`)
      expect(home).not.toContain('href="/llms.txt"')
      expect(home).toContain(`href="/${locale}/about"`)
      expect(home).not.toContain(homeRoute().path === '/' ? 'href="/worksheets/' : 'x')
      const page = renderStaticContent(pageRoute(PAGES[0], locale))
      expect(page).toContain(`href="/${locale}/privacy"`)
      expect(page).not.toContain('](')
      expect(page).toContain(`href="mailto:${CONTACT_EMAIL}"`)
    }
  })

  it('markdown per locale has one H1, absolute localized links and the translated catalog copy', () => {
    for (const locale of others) {
      for (const route of routes(locale)) {
        const md = renderMarkdown(route)
        expect(md.startsWith('# ')).toBe(true)
        expect((md.match(/^# /gm) || []).length).toBe(1)
        expect(md).not.toContain('](/')
      }
      const md = renderMarkdown(worksheetRoute(ws, locale))
      const lws = localizeWorksheet(ws, locale)
      expect(md).toContain(lws.longDesc)
      for (const s of lws.settings) expect(md).toContain(`- ${s}`)
      expect(md).toContain(`${SITE_URL}/${locale}/worksheets/multiplication.md`)
      expect(renderMarkdown(pageRoute(PAGES[2], locale))).toContain(`](${SITE_URL}/${locale}/privacy)`)
    }
  })

  it('llms.txt stays English but points at the localized home pages; llms-full is English only', () => {
    const txt = renderLlmsTxt()
    const optional = txt.split(/^## Optional/m)[1]
    for (const l of others) expect(optional).toContain(`](${SITE_URL}/${l}.md): Home page in ${LOCALE_META[l].englishName}`)
    expect(renderLlmsFullTxt()).not.toContain(`${SITE_URL}/fr`)
  })

  it('sitemap lists every locale once with xhtml:link alternates; catalog exposes locales and alternates', () => {
    const xml = renderSitemap({ now: new Date('2026-09-04T12:00:00Z') })
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"')
    const urls = xml.split('<url>').slice(1)
    expect(urls.length).toBe(routes().length)
    for (const u of urls) expect((u.match(/<xhtml:link /g) || []).length).toBe(LOCALES.length + 1)
    expect(xml).toContain(`<loc>${SITE_URL}/zh/about</loc>`)
    expect(xml).toContain(`<xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/worksheets/rounding" />`)
    const json = JSON.parse(renderCatalogJson({ now: new Date('2026-09-04T12:00:00Z') }))
    expect(json.locales.map(l => l.code)).toEqual(LOCALES)
    expect(json.worksheets[0].alternates.fr).toBe(`${SITE_URL}/fr/worksheets/multiplication`)
    expect(json.worksheets[0].alternates.en).toBe(`${SITE_URL}/worksheets/multiplication`)
  })

  it('404 bodies follow the locale of the path', () => {
    const md = renderNotFoundMarkdown('/fr/nope', 'fr')
    expect(md).toContain(`${SITE_URL}/fr/worksheets/multiplication`)
    expect(md).toContain(`${SITE_URL}/fr/privacy`)
    expect(md).not.toContain('Page not found')
    const html = renderNotFoundHtml('/fr/nope', 'fr')
    expect(html).toContain('<html lang="fr">')
    expect(html).toContain('href="/fr"')
    expect(renderNotFoundHtml('/x')).toContain('<html lang="en">')
  })

  it('buildSiteFiles writes every locale', () => {
    const names = Object.keys(buildSiteFiles(TEMPLATE, { now: new Date('2026-09-04T12:00:00Z') }))
    expect(names).toEqual(expect.arrayContaining(['fr.html', 'fr.md', 'fr/worksheets/rounding.html', 'fr/worksheets/rounding.md', 'zh/about.md', 'ru/privacy.html']))
    expect(names.length).toBe(2 * routes().length + 7)
  })
})

describe('brand entity', () => {
  const orgOf = route => structuredData(route)['@graph'].find(n => n['@type'] === 'Organization')

  it('names the operator as publisher on every kind of page, with one stable @id', () => {
    for (const route of [homeRoute(), worksheetRoute(WORKSHEETS[0]), pageRoute(PAGES[0])]) {
      const org = orgOf(route)
      expect(org, route.path).toBeTruthy()
      expect(org['@id']).toBe(`${SITE_URL}/#organization`)
      expect(org.name).toBe(OPERATOR)
      expect(org.legalName).toBe(OPERATOR)
      expect(org.url).toBe(`${SITE_URL}/`)
      expect(org.email).toBe(CONTACT_EMAIL)
      expect(org.brand).toMatchObject({ '@type': 'Brand', name: BRAND, alternateName: BRAND_ALT })
      expect(org.logo.url).toMatch(new RegExp(`^${SITE_URL}/`))
      expect(org.founder['@id']).toBe(`${SITE_URL}/#author`)
    }
  })

  it('points the WebSite publisher at the organization and keeps the person as author', () => {
    const graph = structuredData(homeRoute())['@graph']
    const site = graph.find(n => n['@type'] === 'WebSite')
    const person = graph.find(n => n['@type'] === 'Person')
    expect(site.publisher['@id']).toBe(`${SITE_URL}/#organization`)
    expect(site.author['@id']).toBe(person['@id'])
    expect(graph.find(n => n['@type'] === 'WebApplication').publisher['@id']).toBe(`${SITE_URL}/#organization`)
  })

  it('emits the organization exactly once per graph, wherever it is referenced, and never with a language', () => {
    for (const route of routes()) {
      const graph = structuredData(route)['@graph']
      const orgs = graph.filter(n => n['@type'] === 'Organization')
      const references = JSON.stringify(graph).includes(`${SITE_URL}/#organization`)
      expect(orgs.length, route.path).toBe(references ? 1 : 0)
      // The organization is the same in every locale; a stray inLanguage here
      // would contradict the route's own locale.
      for (const org of orgs) expect(org.inLanguage, route.path).toBeUndefined()
    }
  })

  it('publishes the contact address on the brand domain', () => {
    expect(CONTACT_EMAIL.split('@')[1]).toBe(new URL(SITE_URL).hostname)
  })
})

describe('agent guidance', () => {
  const txt = renderAgentsMarkdown()

  it('llms.txt carries when-to-use guidance in the prose region, before the first H2', () => {
    const llms = renderLlmsTxt()
    const preamble = llms.split(/^## /m)[0]
    expect(preamble).toContain('When to use this site:')
    expect(preamble).toContain('When not to use it:')
    expect(preamble).toContain('How to fetch it:')
    for (const line of AGENT_GUIDANCE.whenToUse) expect(preamble).toContain(line)
    for (const line of AGENT_GUIDANCE.whenNotToUse) expect(preamble).toContain(line)
    expect(preamble).toContain(`${SITE_URL}/agents.md`)
    // The guidance must not introduce a heading: llms.txt H2s are file lists,
    // and llms-full.txt counts exactly one H1 per English route. Only the
    // document's own H1 on the first line is allowed above the first H2.
    expect(preamble.split('\n').slice(1).join('\n')).not.toMatch(/^#/m)
  })

  it('links the agent instructions from llms.txt and robots.txt', () => {
    expect(renderLlmsTxt()).toContain(`- [Agent instructions](${SITE_URL}/agents.md):`)
    expect(renderRobots()).toContain('/agents.md')
  })

  it('repeats the guidance in llms-full.txt without adding a heading', () => {
    const preamble = renderLlmsFullTxt().split(/\n---\n/)[0]
    expect(preamble).toContain('When to use this site:')
    expect(preamble).toContain('When not to use it:')
    expect(preamble).not.toMatch(/^# /m)
  })

  it('agents.md is a single-H1 document that says when to use the site and when not to', () => {
    expect((txt.match(/^# /gm) || []).length).toBe(1)
    expect(txt.startsWith(`# Agent instructions — ${BRAND}`)).toBe(true)
    expect(txt).toContain('## When to use this site')
    expect(txt).toContain('## When not to use it')
    expect(txt).toContain('## How to fetch pages')
    expect(txt).toContain('## How to cite')
    for (const key of ['whenToUse', 'whenNotToUse', 'howToFetch', 'citation']) {
      for (const line of AGENT_GUIDANCE[key]) expect(txt, key).toContain(`- ${line}`)
    }
  })

  it('agents.md names the operator, the licence, the contact address and the machine-readable files', () => {
    expect(txt).toContain(OPERATOR)
    expect(txt).toContain(LICENSE_NAME)
    expect(txt).toContain(CONTACT_EMAIL)
    expect(txt).toContain(lastContentUpdate())
    for (const file of ['/llms.txt', '/llms-full.txt', '/worksheets.json', '/sitemap.xml', '/robots.txt']) {
      expect(txt, file).toContain(`](${SITE_URL}${file})`)
    }
    // Reuses the generated catalog index, so it cannot drift from the worksheets.
    for (const ws of WORKSHEETS) expect(txt).toContain(ws.label)
  })

  it('agents.md links absolutely: it is fetched with no base URL and has no localized twin', () => {
    expect(txt).not.toMatch(/\]\(\//)
    expect(routes().map(r => r.path)).not.toContain('/agents.md')
    expect(findRoute('/agents.md')).toBe(null)
    expect(renderSitemap()).not.toContain('agents.md')
    expect(renderLlmsFullTxt()).not.toContain('# Agent instructions')
  })

  it('worksheets.json exposes the same guidance to a machine reader', () => {
    const json = JSON.parse(renderCatalogJson())
    expect(json.agents).toBe(`${SITE_URL}/agents.md`)
    expect(json.usage.instructions).toBe(`${SITE_URL}/agents.md`)
    expect(json.usage.whenToUse).toEqual(AGENT_GUIDANCE.whenToUse)
    expect(json.usage.whenNotToUse).toEqual(AGENT_GUIDANCE.whenNotToUse)
    expect(json.usage.whenToUse.length).toBeGreaterThan(0)
    expect(json.usage.whenNotToUse.length).toBeGreaterThan(0)
    expect(json.pages.about).toBe(`${SITE_URL}/about`)
  })
})

describe('buildSiteFiles', () => {
  it('produces every crawlable file from the template', () => {
    const files = buildSiteFiles(TEMPLATE, { now: new Date('2026-09-04T12:00:00Z') })
    const names = Object.keys(files)
    expect(names).toEqual(expect.arrayContaining([
      'index.html', 'index.md',
      'about.html', 'about.md', 'privacy.html', 'privacy.md', 'terms.html', 'terms.md',
      'llms.txt', 'llms-full.txt', 'sitemap.xml', 'robots.txt', 'worksheets.json', 'agents.md', '404.html',
      ...WORKSHEETS.flatMap(w => [`worksheets/${w.slug}.html`, `worksheets/${w.slug}.md`]),
    ]))
    expect(names.length).toBe(2 * routes().length + 7)
    expect(files['worksheets/rounding.html']).toContain(`<title>Rounding Worksheets · ${BRAND}</title>`)
    expect(files['worksheets/rounding.html']).toContain('/assets/index.js')
  })
})
