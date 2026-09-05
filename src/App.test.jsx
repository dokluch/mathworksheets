// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

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
      expect(screen.getByRole('link', { name }).getAttribute('href')).toBe(href)
    }
    expect(screen.getByRole('link', { name: /GitHub/ }).getAttribute('href')).toContain('github.com/dokluch')
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
    expect(JSON.parse(localStorage.getItem('mathsheets')).app.locale).toBe('fr')
  })

  it('the language switcher moves the current page to another locale, remembers it and tracks it', () => {
    window.history.replaceState(null, '', '/worksheets/rounding')
    render(<App />)
    const button = screen.getByRole('button', { name: /Language/ })
    expect(button.closest('.lang-switcher').className).toContain('no-print')
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

  it('a bare / restores the remembered locale; an explicit English URL wins and resets it', () => {
    localStorage.setItem('mathsheets', JSON.stringify({ app: { locale: 'de', activeTab: null } }))
    render(<App />)
    expect(window.location.pathname).toBe('/de')
    expect(document.documentElement.lang).toBe('de')
    cleanup()
    localStorage.setItem('mathsheets', JSON.stringify({ app: { locale: 'fr', activeTab: 'patterns' } }))
    window.history.replaceState(null, '', '/worksheets/comparison')
    render(<App />)
    expect(window.location.pathname).toBe('/worksheets/comparison')
    expect(document.documentElement.lang).toBe('en')
    expect(JSON.parse(localStorage.getItem('mathsheets')).app.locale).toBe('en')
  })

  it('tracks print_worksheet with the sheet id and its settings on beforeprint', () => {
    localStorage.setItem('mathsheets', JSON.stringify({ app: { activeTab: 'addsub' }, addsub: { ops: 'add', maxVal: 20 } }))
    render(<App />)
    window.dispatchEvent(new Event('beforeprint'))
    expect(trackEvent).toHaveBeenCalledWith('print_worksheet', expect.objectContaining({ worksheet_id: 'addsub', setting_ops: 'add', setting_maxVal: 20 }))
  })
})
