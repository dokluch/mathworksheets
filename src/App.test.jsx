// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react'

vi.mock('./lib/analytics.js', () => ({
  trackEvent: vi.fn(),
  trackPageView: vi.fn(),
  settingsToParams: (s) => Object.fromEntries(Object.entries(s || {}).map(([k, v]) => [`setting_${k}`, v])),
}))
import { trackEvent } from './lib/analytics.js'
import { WORKSHEETS } from './worksheets.js'
import { gradeNumbers } from './seo/render.js'
import { PAGES } from './pages.js'
import { t, localizeWorksheet, localizePage } from './i18n/index.js'
import { BRAND, CONTACT_EMAIL, SITE_URL } from './seo/site.js'
import App from './App.jsx'

beforeEach(() => {
  cleanup()
  localStorage.clear()
  window.history.replaceState(null, '', '/')
  window.scrollTo = vi.fn()
  trackEvent.mockClear()
})

describe('App', () => {
  it('renders the catalog with a real link for every worksheet', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(BRAND)
    const links = screen.getAllByRole('link')
    for (const ws of WORKSHEETS) {
      const link = links.find(l => l.getAttribute('href') === `/worksheets/${ws.slug}`)
      expect(link, `link for ${ws.slug}`).toBeTruthy()
      expect(link.textContent).toContain(ws.label)
    }
  })

  it('clicking a card opens the worksheet, updates the URL and tracks the selection', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: /Rounding/ }))
    expect(window.location.pathname).toBe('/worksheets/rounding')
    expect(screen.getByRole('main', { name: 'Rounding' })).toBeTruthy()
    expect(trackEvent).toHaveBeenCalledWith('select_worksheet', { worksheet_id: 'rounding' })
  })

  // / is the catalog and nothing else: no sheet is remembered, so typing the
  // domain never lands a parent inside last week's worksheet.
  it('stays on the catalog at / and remembers no sheet', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: /Rounding/ }))
    expect(JSON.parse(localStorage.getItem('mathsheets')).app.activeTab).toBeUndefined()

    cleanup()
    window.history.replaceState(null, '', '/')
    render(<App />)
    expect(document.querySelector('.worksheet-main')).toBeNull()
    expect(window.location.pathname).toBe('/')
  })

  // The grade filter narrows the landing grid. Default is All, so a first
  // visitor and a crawler both see the whole catalog.
  const catalogHrefs = () => screen.getAllByRole('link')
    .map(l => l.getAttribute('href'))
    .filter(h => h && h.includes('/worksheets/'))

  it('shows every sheet by default and filters the catalog by grade', () => {
    render(<App />)
    const all = screen.getByRole('button', { name: /^All/ })
    expect(all.getAttribute('aria-pressed')).toBe('true')
    expect(new Set(catalogHrefs()).size).toBe(WORKSHEETS.length)

    fireEvent.click(screen.getByRole('button', { name: /^Grade 1/ }))
    const expected = WORKSHEETS.filter(ws => gradeNumbers(ws.grades).includes(1)).map(ws => `/worksheets/${ws.slug}`)
    expect(expected.length).toBeGreaterThan(0)
    expect(expected.length).toBeLessThan(WORKSHEETS.length)
    expect(new Set(catalogHrefs())).toEqual(new Set(expected))
    expect(screen.getByRole('button', { name: /^Grade 1/ }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: /^All/ }).getAttribute('aria-pressed')).toBe('false')
    expect(screen.getByRole('status').textContent).toBe(`${expected.length} sheets`)
    expect(trackEvent).toHaveBeenCalledWith('select_grade', { grade: '1' })

    fireEvent.click(screen.getByRole('button', { name: /^All/ }))
    expect(new Set(catalogHrefs()).size).toBe(WORKSHEETS.length)
  })

  it('names the age band under every grade', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /^All/ }).textContent).toContain('Ages 6–9')
    expect(screen.getByRole('button', { name: /^Grade 1/ }).textContent).toContain('Ages 6–7')
    expect(screen.getByRole('button', { name: /^Grade 3/ }).textContent).toContain('Ages 8–9')
  })

  it('remembers the chosen grade on this device', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /^Grade 2/ }))
    expect(JSON.parse(localStorage.getItem('mathsheets')).app.grade).toBe('2')

    cleanup()
    render(<App />)
    expect(screen.getByRole('button', { name: /^Grade 2/ }).getAttribute('aria-pressed')).toBe('true')
    const shown = WORKSHEETS.filter(ws => gradeNumbers(ws.grades).includes(2))
    expect(new Set(catalogHrefs())).toEqual(new Set(shown.map(ws => `/worksheets/${ws.slug}`)))
  })

  it('opens the whole catalog when the remembered grade is not one we offer', () => {
    localStorage.setItem('mathsheets', JSON.stringify({ app: { grade: '7' } }))
    render(<App />)
    expect(screen.getByRole('button', { name: /^All/ }).getAttribute('aria-pressed')).toBe('true')
    expect(new Set(catalogHrefs()).size).toBe(WORKSHEETS.length)
  })

  it('translates the grade filter and keeps prefixed links under /fr', () => {
    window.history.replaceState(null, '', '/fr')
    render(<App />)
    const grade2 = screen.getByRole('button', { name: new RegExp(`^${t('fr', 'seo.gradeOne', { grades: '2' })}`) })
    expect(grade2.textContent).toContain(t('fr', 'app.ages', { ages: '7–8' }))
    fireEvent.click(grade2)
    for (const href of catalogHrefs()) expect(href).toMatch(/^\/fr\/worksheets\//)
  })

  it('leaves the sidebar catalog on a worksheet page unfiltered', () => {
    localStorage.setItem('mathsheets', JSON.stringify({ app: { grade: '1' } }))
    window.history.replaceState(null, '', '/worksheets/long-division')
    render(<App />)
    expect(document.querySelector('.grade-filter')).toBeNull()
    // long-division is grade 3 only: a filtered sidebar would hide the open sheet.
    const sidebar = document.querySelector('.catalog--sidebar')
    expect(sidebar.querySelectorAll('.catalog-card').length).toBe(WORKSHEETS.length)
  })

  it('opens the worksheet named in the URL', () => {
    window.history.replaceState(null, '', '/worksheets/comparison')
    render(<App />)
    expect(screen.getByRole('main', { name: 'Comparison' })).toBeTruthy()
  })

  it('"All sheets" goes back to the catalog at /', () => {
    window.history.replaceState(null, '', '/worksheets/comparison')
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: /All sheets/ }))
    expect(window.location.pathname).toBe('/')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(BRAND)
  })

  it('keeps the crawlable worksheet prose in the DOM after hydration', () => {
    // src/main.jsx removes the prerendered #static-content before React mounts,
    // so without WorksheetDetails a JS-executing crawler sees no prose at all.
    window.history.replaceState(null, '', '/worksheets/column-addition')
    render(<App />)
    const ws = WORKSHEETS.find(w => w.slug === 'column-addition')

    const h1s = screen.getAllByRole('heading', { level: 1 })
    expect(h1s.length).toBe(1)
    expect(h1s[0].textContent).toBe('Column Addition Worksheets')

    const details = document.querySelector('.worksheet-details')
    expect(details).toBeTruthy()
    expect(details.className).toContain('no-print')
    expect(details.textContent).toContain(ws.longDesc)
    for (const setting of ws.settings) expect(details.textContent).toContain(setting)
    expect(details.querySelector('a[href="/worksheets/rounding"]')).toBeTruthy()
    expect(details.querySelector('a[href="/llms.txt"]')).toBeNull()
    expect(details.querySelector('.worksheet-faq')).toBeTruthy()
  })

  it('a sibling worksheet link inside the details block navigates in-app', () => {
    window.history.replaceState(null, '', '/worksheets/column-addition')
    render(<App />)
    const details = document.querySelector('.worksheet-details')
    fireEvent.click(within(details).getByRole('link', { name: 'Rounding' }))
    expect(window.location.pathname).toBe('/worksheets/rounding')
    expect(screen.getAllByRole('heading', { level: 1 })[0].textContent).toBe('Rounding Worksheets')
  })

  it('the details block is localized with the rest of the page', () => {
    window.history.replaceState(null, '', '/fr/worksheets/column-addition')
    render(<App />)
    const details = document.querySelector('.worksheet-details')
    expect(details.querySelector('a[href="/fr/worksheets/rounding"]')).toBeTruthy()
    expect(details.textContent).toContain(localizeWorksheet(WORKSHEETS.find(w => w.slug === 'column-addition'), 'fr').longDesc)
  })

  it('stamps the brand on printed sheets only', () => {
    window.history.replaceState(null, '', '/fr/worksheets/column-addition')
    render(<App />)
    const stamp = document.querySelector('.print-footer')
    expect(stamp).toBeTruthy()
    expect(stamp.className).toContain('print-only')
    expect(stamp.textContent).toContain('Super Awesome Math (superawesomemath.com)')
    expect(stamp.textContent).toContain(t('fr', 'common.printFooterTagline'))
  })

  it('shows a footer with About, Privacy and Terms links that is never printed', () => {
    render(<App />)
    const footer = screen.getByRole('contentinfo')
    expect(footer.className).toContain('no-print')
    for (const [name, href] of [['About', '/about'], ['Privacy', '/privacy'], ['Terms', '/terms']]) {
      expect(within(footer).getByRole('link', { name }).getAttribute('href')).toBe(href)
    }
    // The repository is going private, so the footer no longer links it.
    expect(within(footer).queryByRole('link', { name: /GitHub/ })).toBeNull()
    expect(footer.textContent).toContain('Superposition Labs Inc.')
  })

  it('clicking a footer link opens the static page in-app', () => {
    window.history.replaceState(null, '', '/worksheets/patterns')
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: 'Privacy' }))
    expect(window.location.pathname).toBe('/privacy')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Privacy Policy')
    expect(document.querySelector('.worksheet-main')).toBeNull()
    expect(screen.getByRole('main').className).toContain('static-page')
    expect(window.scrollTo).toHaveBeenCalled()
  })

  it('opens the static page named in the URL and routes its internal links in-app', () => {
    window.history.replaceState(null, '', '/about')
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(`About ${BRAND}`)
    expect(window.location.pathname).toBe('/about')
    // In-page link to the Terms page
    fireEvent.click(screen.getByRole('main').querySelector('a[href="/terms"]'))
    expect(window.location.pathname).toBe('/terms')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Terms of Service')
    // Breadcrumb back home restores the remembered worksheet
    fireEvent.click(screen.getByRole('main').querySelector('nav[aria-label="Breadcrumb"] a[href="/"]'))
    expect(window.location.pathname).toBe('/')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(BRAND)
  })

  it('the worksheet sidebar carries the compact footer links', () => {
    window.history.replaceState(null, '', '/worksheets/rounding')
    render(<App />)
    const footer = screen.getByRole('contentinfo')
    expect(footer.className).toContain('site-footer--sidebar')
    expect(screen.getByRole('link', { name: 'Privacy' }).getAttribute('href')).toBe('/privacy')
    expect(footer.textContent).not.toContain('Superposition')
  })

  it('renders the French catalog under /fr: translated copy, prefixed links, lang attribute', () => {
    window.history.replaceState(null, '', '/fr')
    render(<App />)
    expect(document.documentElement.lang).toBe('fr')
    expect(screen.getByText(t('fr', 'app.subtitle'))).toBeTruthy()
    const links = screen.getAllByRole('link')
    for (const ws of WORKSHEETS) {
      const link = links.find(l => l.getAttribute('href') === `/fr/worksheets/${ws.slug}`)
      expect(link, `French link for ${ws.slug}`).toBeTruthy()
      expect(link.textContent).toContain(localizeWorksheet(ws, 'fr').label)
    }
    const privacy = localizePage(PAGES[1], 'fr')
    expect(screen.getByRole('link', { name: privacy.navLabel }).getAttribute('href')).toBe('/fr/privacy')
    // Following a French link is not a choice: the stored preference is untouched.
    expect(JSON.parse(localStorage.getItem('mathsheets')).app.locale).toBe('en')
  })

  it('the language switcher moves the current page to another locale, remembers it and tracks it', () => {
    window.history.replaceState(null, '', '/worksheets/rounding')
    render(<App />)
    const button = screen.getByRole('button', { name: /Language/ })
    expect(button.closest('.lang-switcher').className).toContain('no-print')
    // On a worksheet the switcher lives in the worksheet header, not the sidebar.
    expect(button.closest('.site-header')).toBeTruthy()
    expect(document.querySelector('.catalog--sidebar .lang-switcher')).toBeNull()
    expect(document.querySelectorAll('.lang-switcher').length).toBe(1)
    fireEvent.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('true')
    const item = screen.getByRole('menuitemradio', { name: 'Français' })
    expect(item.getAttribute('href')).toBe('/fr/worksheets/rounding')
    expect(screen.getByRole('menuitemradio', { name: 'English' }).getAttribute('aria-checked')).toBe('true')
    fireEvent.click(item)
    expect(window.location.pathname).toBe('/fr/worksheets/rounding')
    expect(document.documentElement.lang).toBe('fr')
    const rounding = WORKSHEETS.find(w => w.id === 'rounding')
    expect(screen.getByRole('main', { name: localizeWorksheet(rounding, 'fr').label })).toBeTruthy()
    expect(screen.getByRole('link', { name: new RegExp(t('fr', 'app.allSheets')) }).getAttribute('href')).toBe('/fr')
    expect(JSON.parse(localStorage.getItem('mathsheets')).app.locale).toBe('fr')
    expect(trackEvent).toHaveBeenCalledWith('switch_locale', { locale: 'fr' })
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('Escape closes the language menu and a static page keeps the switcher', () => {
    window.history.replaceState(null, '', '/about')
    render(<App />)
    const button = screen.getByRole('button', { name: /Language/ })
    fireEvent.click(button)
    expect(screen.getByRole('menu')).toBeTruthy()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('menu')).toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(button)
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Deutsch' }))
    expect(window.location.pathname).toBe('/de/about')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(localizePage(PAGES[0], 'de').title)
  })

  it('the remembered choice applies to / and to any unprefixed URL; a prefixed URL wins without overwriting it', () => {
    localStorage.setItem('mathsheets', JSON.stringify({ app: { locale: 'de' } }))
    render(<App />)
    expect(window.location.pathname).toBe('/de')
    expect(document.documentElement.lang).toBe('de')
    cleanup()
    localStorage.setItem('mathsheets', JSON.stringify({ app: { locale: 'fr' } }))
    window.history.replaceState(null, '', '/worksheets/comparison')
    render(<App />)
    expect(window.location.pathname).toBe('/fr/worksheets/comparison')
    expect(document.documentElement.lang).toBe('fr')
    expect(JSON.parse(localStorage.getItem('mathsheets')).app.locale).toBe('fr')
    cleanup()
    window.history.replaceState(null, '', '/es/worksheets/comparison')
    render(<App />)
    expect(window.location.pathname).toBe('/es/worksheets/comparison')
    expect(JSON.parse(localStorage.getItem('mathsheets')).app.locale).toBe('fr')
    // Choosing English explicitly stores it and stops the redirect.
    fireEvent.click(screen.getByRole('button', { name: /Language|Idioma/ }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'English' }))
    expect(window.location.pathname).toBe('/worksheets/comparison')
    expect(JSON.parse(localStorage.getItem('mathsheets')).app.locale).toBe('en')
  })

  it('shows a bottom Print worksheet button on printable sheets only, which prints on click and is never printed', () => {
    window.print = vi.fn()
    window.history.replaceState(null, '', '/worksheets/column-addition')
    render(<App />)
    const button = screen.getByRole('button', { name: /Print worksheet/ })
    expect(button.closest('.print-cta').className).toContain('no-print')
    fireEvent.click(button)
    expect(window.print).toHaveBeenCalledTimes(1)

    cleanup()
    window.history.replaceState(null, '', '/worksheets/equation-explorer')
    render(<App />)
    expect(screen.queryByRole('button', { name: /Print worksheet/ })).toBeNull()
  })

  // Every worksheet, including the interactive one: its settings used to sit
  // in a bare unlabelled strip floating on the board, so the one surface a
  // child touches was the one that did not look like the rest of the product.
  it('every worksheet renders the shared settings panel, hidden from print', () => {
    for (const ws of WORKSHEETS) {
      cleanup()
      window.history.replaceState(null, '', `/worksheets/${ws.slug}`)
      render(<App />)
      const panel = document.querySelector('.settings-panel')
      expect(panel, ws.slug).toBeTruthy()
      expect(panel.className).toContain('no-print')
      expect(document.querySelector('.controls'), ws.slug).toBeNull()
      // Every setting is labelled, on every worksheet.
      expect(panel.querySelectorAll('.setting-label').length, ws.slug).toBeGreaterThan(0)
      if (panel.querySelector('.btn-group')) {
        expect(within(panel).getAllByRole('button', { pressed: true }).length, ws.slug).toBeGreaterThan(0)
      }
      if (ws.interactive) {
        // The interactive sheet has nothing to print, so it offers a new
        // problem where the others offer Regenerate and Print.
        expect(within(panel).getByRole('button', { name: /New/ })).toBeTruthy()
        expect(within(panel).queryByRole('button', { name: /Print/ }), ws.slug).toBeNull()
        continue
      }
      expect(within(panel).getByRole('button', { name: /Regenerate/ })).toBeTruthy()
      expect(within(panel).getByRole('button', { name: /Print/ })).toBeTruthy()
    }
  })

  it('has a site header with the brand as H1 link home, an About link and the language switcher on the catalog', () => {
    render(<App />)
    const header = document.querySelector('header.site-header')
    expect(header.className).toContain('no-print')
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(header.contains(h1)).toBe(true)
    const brand = h1.querySelector('a')
    expect(brand.getAttribute('href')).toBe('/')
    expect(brand.textContent).toBe(BRAND)
    const about = header.querySelector('a[href="/about"]')
    expect(about.textContent).toBe('About')
    expect(header.contains(screen.getByRole('button', { name: /Language/ }))).toBe(true)
    expect(document.querySelector('.lang-corner')).toBeNull()
  })

  it('the header stays on static pages (without a second H1) and on worksheets, and the brand goes home', () => {
    window.history.replaceState(null, '', '/terms')
    render(<App />)
    let header = document.querySelector('header.site-header')
    expect(screen.getAllByRole('heading', { level: 1 }).length).toBe(1)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Terms of Service')
    expect(header.querySelector('h1')).toBeNull()
    fireEvent.click(header.querySelector('a[href="/about"]'))
    expect(window.location.pathname).toBe('/about')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(`About ${BRAND}`)

    fireEvent.click(header.querySelector('a.site-brand'))
    expect(window.location.pathname).toBe('/')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(BRAND)

    fireEvent.click(screen.getByRole('link', { name: /Rounding/ }))
    expect(window.location.pathname).toBe('/worksheets/rounding')
    header = document.querySelector('header.site-header')
    expect(header.contains(screen.getByRole('button', { name: /Language/ }))).toBe(true)
    expect(document.querySelector('.worksheet-topbar button')).toBeNull()

    fireEvent.click(header.querySelector('a.site-brand'))
    expect(window.location.pathname).toBe('/')
    expect(document.querySelector('.worksheet-main')).toBeNull()
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(BRAND)
  })

  it('the header links follow the locale', () => {
    window.history.replaceState(null, '', '/fr/privacy')
    render(<App />)
    const header = document.querySelector('header.site-header')
    expect(header.querySelector('a.site-brand').getAttribute('href')).toBe('/fr')
    expect(header.querySelector('a.site-nav-link').getAttribute('href')).toBe('/fr/about')
  })

  it('tracks print_worksheet with the sheet id and its settings on beforeprint', () => {
    localStorage.setItem('mathsheets', JSON.stringify({ addsub: { ops: 'add', maxVal: 20 } }))
    // The URL selects the sheet.
    window.history.replaceState(null, '', '/worksheets/add-subtract')
    render(<App />)
    window.dispatchEvent(new Event('beforeprint'))
    expect(trackEvent).toHaveBeenCalledWith('print_worksheet', expect.objectContaining({ worksheet_id: 'addsub', setting_ops: 'add', setting_maxVal: 20 }))
  })
})
