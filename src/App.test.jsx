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
import { PAGES } from './pages.js'
import { t, localizeWorksheet, localizePage } from './i18n/index.js'
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
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('MathSheets')
    const links = screen.getAllByRole('link')
    for (const ws of WORKSHEETS) {
      const link = links.find(l => l.getAttribute('href') === `/worksheets/${ws.slug}`)
      expect(link, `link for ${ws.slug}`).toBeTruthy()
      expect(link.textContent).toContain(ws.label)
    }
  })

  it('clicking a card opens the worksheet, updates the URL, persists it and tracks the selection', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: /Rounding/ }))
    expect(window.location.pathname).toBe('/worksheets/rounding')
    expect(screen.getByRole('tabpanel', { name: 'Rounding' })).toBeTruthy()
    expect(JSON.parse(localStorage.getItem('mathsheets')).app.activeTab).toBe('rounding')
    expect(trackEvent).toHaveBeenCalledWith('select_worksheet', { worksheet_id: 'rounding' })
  })

  it('restores the remembered worksheet when landing on /', () => {
    localStorage.setItem('mathsheets', JSON.stringify({ app: { activeTab: 'patterns' }, patterns: { level: 2 } }))
    render(<App />)
    expect(screen.getByRole('tabpanel', { name: 'Patterns' })).toBeTruthy()
    expect(window.location.pathname).toBe('/worksheets/patterns')
  })

  it('opens the worksheet named in the URL', () => {
    window.history.replaceState(null, '', '/worksheets/comparison')
    render(<App />)
    expect(screen.getByRole('tabpanel', { name: 'Comparison' })).toBeTruthy()
  })

  it('"All sheets" goes back to the catalog at /', () => {
    window.history.replaceState(null, '', '/worksheets/comparison')
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: /All sheets/ }))
    expect(window.location.pathname).toBe('/')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('MathSheets')
  })

  it('shows a footer with About, Privacy, Terms and GitHub links that is never printed', () => {
    render(<App />)
    const footer = screen.getByRole('contentinfo')
    expect(footer.className).toContain('no-print')
    for (const [name, href] of [['About', '/about'], ['Privacy', '/privacy'], ['Terms', '/terms']]) {
      expect(within(footer).getByRole('link', { name }).getAttribute('href')).toBe(href)
    }
    expect(within(footer).getByRole('link', { name: /GitHub/ }).getAttribute('href')).toContain('github.com/dokluch')
    expect(footer.textContent).toContain('Superposition Labs Inc.')
  })

  it('clicking a footer link opens the static page in-app and keeps the remembered worksheet', () => {
    localStorage.setItem('mathsheets', JSON.stringify({ app: { activeTab: 'patterns' } }))
    window.history.replaceState(null, '', '/worksheets/patterns')
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: 'Privacy' }))
    expect(window.location.pathname).toBe('/privacy')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Privacy Policy')
    expect(screen.queryByRole('tabpanel')).toBeNull()
    expect(screen.getByRole('main').className).toContain('static-page')
    expect(JSON.parse(localStorage.getItem('mathsheets')).app.activeTab).toBe('patterns')
    expect(window.scrollTo).toHaveBeenCalled()
  })

  it('opens the static page named in the URL and routes its internal links in-app', () => {
    localStorage.setItem('mathsheets', JSON.stringify({ app: { activeTab: 'rounding' } }))
    window.history.replaceState(null, '', '/about')
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('About MathSheets')
    expect(window.location.pathname).toBe('/about')
    // In-page link to the Terms page
    fireEvent.click(screen.getByRole('main').querySelector('a[href="/terms"]'))
    expect(window.location.pathname).toBe('/terms')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Terms of Service')
    // Breadcrumb back home restores the remembered worksheet
    fireEvent.click(screen.getByRole('main').querySelector('nav[aria-label="Breadcrumb"] a[href="/"]'))
    expect(window.location.pathname).toBe('/')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('MathSheets')
  })

  it('renders /developers in-app instead of bouncing to the catalog', () => {
    window.history.replaceState(null, '', '/developers')
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('MathSheets Developer Resources')
    expect(window.location.pathname).toBe('/developers')
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
    expect(screen.getByRole('tabpanel', { name: localizeWorksheet(rounding, 'fr').label })).toBeTruthy()
    expect(screen.getByRole('link', { name: new RegExp(t('fr', 'app.allSheets')) }).getAttribute('href')).toBe('/fr')
    expect(JSON.parse(localStorage.getItem('mathsheets')).app.locale).toBe('fr')
    expect(JSON.parse(localStorage.getItem('mathsheets')).app.activeTab).toBe('rounding')
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
    localStorage.setItem('mathsheets', JSON.stringify({ app: { locale: 'de', activeTab: null } }))
    render(<App />)
    expect(window.location.pathname).toBe('/de')
    expect(document.documentElement.lang).toBe('de')
    cleanup()
    localStorage.setItem('mathsheets', JSON.stringify({ app: { locale: 'fr', activeTab: 'patterns' } }))
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

  it('has a site header with the brand as H1 link home, an About link and the language switcher on the catalog', () => {
    render(<App />)
    const header = document.querySelector('header.site-header')
    expect(header.className).toContain('no-print')
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(header.contains(h1)).toBe(true)
    const brand = h1.querySelector('a')
    expect(brand.getAttribute('href')).toBe('/')
    expect(brand.textContent).toBe('MathSheets')
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
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('About MathSheets')

    fireEvent.click(header.querySelector('a.site-brand'))
    expect(window.location.pathname).toBe('/')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('MathSheets')

    fireEvent.click(screen.getByRole('link', { name: /Rounding/ }))
    expect(window.location.pathname).toBe('/worksheets/rounding')
    header = document.querySelector('header.site-header')
    expect(header.contains(screen.getByRole('button', { name: /Language/ }))).toBe(true)
    expect(document.querySelector('.worksheet-topbar button')).toBeNull()

    fireEvent.click(header.querySelector('a.site-brand'))
    expect(window.location.pathname).toBe('/')
    expect(screen.queryByRole('tabpanel')).toBeNull()
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('MathSheets')
  })

  it('the header links follow the locale', () => {
    window.history.replaceState(null, '', '/fr/privacy')
    render(<App />)
    const header = document.querySelector('header.site-header')
    expect(header.querySelector('a.site-brand').getAttribute('href')).toBe('/fr')
    expect(header.querySelector('a.site-nav-link').getAttribute('href')).toBe('/fr/about')
  })

  it('tracks print_worksheet with the sheet id and its settings on beforeprint', () => {
    localStorage.setItem('mathsheets', JSON.stringify({ app: { activeTab: 'addsub' }, addsub: { ops: 'add', maxVal: 20 } }))
    render(<App />)
    window.dispatchEvent(new Event('beforeprint'))
    expect(trackEvent).toHaveBeenCalledWith('print_worksheet', expect.objectContaining({ worksheet_id: 'addsub', setting_ops: 'add', setting_maxVal: 20 }))
  })
})
