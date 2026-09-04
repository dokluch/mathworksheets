// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('../lib/analytics.js', () => ({ trackPageView: vi.fn(), trackEvent: vi.fn() }))
import { trackPageView } from '../lib/analytics.js'
import { useRoute, pathToSheetId, sheetIdToPath, titleForSheet } from './useRoute.js'

function setPath(path) {
  window.history.replaceState(null, '', path)
}

beforeEach(() => {
  setPath('/')
  document.title = ''
  document.head.innerHTML = '<link rel="canonical" href="x" /><link rel="alternate" type="text/markdown" href="y" />'
  trackPageView.mockClear()
})

describe('path helpers', () => {
  it('maps paths to worksheet ids and back', () => {
    expect(pathToSheetId('/worksheets/rounding')).toBe('rounding')
    expect(pathToSheetId('/worksheets/rounding/')).toBe('rounding')
    expect(pathToSheetId('/worksheets/add-subtract')).toBe('addsub')
    expect(pathToSheetId('/worksheets/nope')).toBeNull()
    expect(pathToSheetId('/')).toBeNull()
    expect(sheetIdToPath('multiply')).toBe('/worksheets/multiplication')
    expect(sheetIdToPath(null)).toBe('/')
    expect(sheetIdToPath('bogus')).toBe('/')
    expect(titleForSheet(null)).toBe('MathSheets – Printable Math Worksheets for Grades 1–3')
    expect(titleForSheet('compare')).toBe('Comparison Worksheets · MathSheets')
  })
})

describe('useRoute', () => {
  it('starts on the catalog at / with no remembered sheet', () => {
    const { result } = renderHook(() => useRoute(null))
    expect(result.current[0]).toBeNull()
    expect(window.location.pathname).toBe('/')
    expect(document.title).toContain('MathSheets')
    expect(trackPageView).toHaveBeenCalledWith('/', expect.stringContaining('MathSheets'))
  })

  it('the URL wins over the remembered sheet', () => {
    setPath('/worksheets/patterns')
    const { result } = renderHook(() => useRoute('rounding'))
    expect(result.current[0]).toBe('patterns')
    expect(window.location.pathname).toBe('/worksheets/patterns')
  })

  it('restores the remembered sheet on / and replaces the URL silently', () => {
    const lengthBefore = window.history.length
    const { result } = renderHook(() => useRoute('rounding'))
    expect(result.current[0]).toBe('rounding')
    expect(window.location.pathname).toBe('/worksheets/rounding')
    expect(window.history.length).toBe(lengthBefore)
    expect(document.title).toBe('Rounding Worksheets · MathSheets')
    expect(document.querySelector('link[rel="canonical"]').getAttribute('href')).toMatch(/\/worksheets\/rounding$/)
    expect(document.querySelector('link[rel="alternate"]').getAttribute('href')).toMatch(/\/worksheets\/rounding\.md$/)
  })

  it('shows a static page named in the URL without rewriting it, even with a remembered sheet', () => {
    setPath('/privacy')
    const { result } = renderHook(() => useRoute('rounding'))
    const [sheet, , page] = result.current
    expect(sheet).toBeNull()
    expect(page.kind).toBe('page')
    expect(page.page.slug).toBe('privacy')
    expect(window.location.pathname).toBe('/privacy')
    expect(document.title).toBe('Privacy Policy · MathSheets')
    expect(document.querySelector('link[rel="canonical"]').getAttribute('href')).toMatch(/\/privacy$/)
    expect(document.querySelector('link[rel="alternate"]').getAttribute('href')).toMatch(/\/privacy\.md$/)
    expect(trackPageView).toHaveBeenCalledWith('/privacy', 'Privacy Policy · MathSheets')
  })

  it('treats /developers as a static page too', () => {
    setPath('/developers/')
    const { result } = renderHook(() => useRoute(null))
    expect(result.current[2].kind).toBe('developers')
    expect(window.location.pathname).toBe('/developers/')
    expect(document.title).toBe('Developer Resources · MathSheets')
  })

  it('falls back to the catalog (and rewrites the URL) for an unknown path', () => {
    setPath('/nope')
    const { result } = renderHook(() => useRoute(null))
    expect(result.current[0]).toBeNull()
    expect(result.current[2]).toBeNull()
    expect(window.location.pathname).toBe('/')
  })

  it('navigate accepts page paths, worksheet ids and null, and popstate resolves pages', () => {
    const { result } = renderHook(() => useRoute(null))
    act(() => result.current[1]('/about'))
    expect(result.current[2].page.slug).toBe('about')
    expect(result.current[0]).toBeNull()
    expect(window.location.pathname).toBe('/about')
    expect(trackPageView).toHaveBeenLastCalledWith('/about', 'About MathSheets · MathSheets')

    act(() => result.current[1]('multiply'))
    expect(result.current[0]).toBe('multiply')
    expect(result.current[2]).toBeNull()

    act(() => result.current[1](null))
    expect(result.current[0]).toBeNull()
    expect(window.location.pathname).toBe('/')

    act(() => {
      setPath('/terms')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(result.current[2].page.slug).toBe('terms')

    // Navigating to the current page again is a no-op (no duplicate page view).
    const calls = trackPageView.mock.calls.length
    act(() => result.current[1]('/terms'))
    expect(trackPageView.mock.calls.length).toBe(calls)
  })

  it('ignores an unknown remembered sheet id', () => {
    const { result } = renderHook(() => useRoute('does-not-exist'))
    expect(result.current[0]).toBeNull()
    expect(window.location.pathname).toBe('/')
  })

  it('navigate pushes history, updates title and tracks a page view; back returns to the catalog', () => {
    const { result } = renderHook(() => useRoute(null))
    act(() => result.current[1]('multiply'))
    expect(result.current[0]).toBe('multiply')
    expect(window.location.pathname).toBe('/worksheets/multiplication')
    expect(document.title).toBe('Multiplication Worksheets · MathSheets')
    expect(trackPageView).toHaveBeenLastCalledWith('/worksheets/multiplication', 'Multiplication Worksheets · MathSheets')

    act(() => result.current[1](null))
    expect(result.current[0]).toBeNull()
    expect(window.location.pathname).toBe('/')

    // simulate Back
    act(() => {
      setPath('/worksheets/multiplication')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(result.current[0]).toBe('multiply')
  })
})
