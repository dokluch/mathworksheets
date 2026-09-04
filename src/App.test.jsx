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
import App from './App.jsx'

beforeEach(() => {
  cleanup()
  localStorage.clear()
  window.history.replaceState(null, '', '/')
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

  it('tracks print_worksheet with the sheet id and its settings on beforeprint', () => {
    localStorage.setItem('mathsheets', JSON.stringify({ app: { activeTab: 'addsub' }, addsub: { ops: 'add', maxVal: 20 } }))
    render(<App />)
    window.dispatchEvent(new Event('beforeprint'))
    expect(trackEvent).toHaveBeenCalledWith('print_worksheet', expect.objectContaining({ worksheet_id: 'addsub', setting_ops: 'add', setting_maxVal: 20 }))
  })
})
