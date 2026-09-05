// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('../lib/analytics.js', () => ({ trackPageView: vi.fn(), trackEvent: vi.fn() }))
import { trackPageView } from '../lib/analytics.js'
import { useRoute, pathToSheetId, sheetIdToPath, titleForSheet, localeFromPath } from './useRoute.js'
import { pageTitle, worksheetRoute } from '../seo/render.js'
import { findWorksheetById } from '../worksheets.js'

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
})

describe('locales', () => {
  it('helpers understand locale prefixes and never treat /en as one', () => {
    expect(localeFromPath('/fr')).toBe('fr')
    expect(localeFromPath('/fr/worksheets/rounding/')).toBe('fr')
    expect(localeFromPath('/en')).toBe('en')
    expect(localeFromPath('/')).toBe('en')
    expect(pathToSheetId('/fr/worksheets/rounding')).toBe('rounding')
    expect(pathToSheetId('/en/worksheets/rounding')).toBeNull()
    expect(sheetIdToPath('multiply', 'fr')).toBe('/fr/worksheets/multiplication')
    expect(sheetIdToPath(null, 'fr')).toBe('/fr')
    expect(sheetIdToPath('bogus', 'zh')).toBe('/zh')
    expect(titleForSheet('compare', 'fr')).toBe(pageTitle(worksheetRoute(findWorksheetById('compare'), 'fr')))
    expect(titleForSheet(null, 'de')).not.toBe(titleForSheet(null))
  })

  it('the hook exposes the locale, switches it in place and updates the document', () => {
    document.head.innerHTML += '<link rel="alternate" hreflang="es" href="z" /><link rel="alternate" hreflang="x-default" href="z" />'
    setPath('/fr/worksheets/patterns')
    const { result } = renderHook(() => useRoute(null))
    expect(result.current[0]).toBe('patterns')
    expect(result.current[3]).toBe('fr')
    expect(document.documentElement.lang).toBe('fr')
    expect(document.title).toBe(titleForSheet('patterns', 'fr'))

    act(() => result.current[4]('es'))
    expect(window.location.pathname).toBe('/es/worksheets/patterns')
    expect(result.current[0]).toBe('patterns')
    expect(result.current[3]).toBe('es')
    expect(document.documentElement.lang).toBe('es')
    expect(document.querySelector('link[rel="canonical"]').getAttribute('href')).toMatch(/\/es\/worksheets\/patterns$/)
    expect(document.querySelector('link[rel="alternate"][type="text/markdown"]').getAttribute('href')).toMatch(/\/es\/worksheets\/patterns\.md$/)
    expect(document.querySelector('link[hreflang="es"]').getAttribute('href')).toMatch(/\/es\/worksheets\/patterns$/)
    expect(document.querySelector('link[hreflang="x-default"]').getAttribute('href')).toMatch(/\/worksheets\/patterns$/)
    expect(trackPageView).toHaveBeenLastCalledWith('/es/worksheets/patterns', titleForSheet('patterns', 'es'))
    expect(result.current[5]('ru')).toBe('/ru/worksheets/patterns')
    expect(result.current[5]('en')).toBe('/worksheets/patterns')

    // navigate keeps the locale; an unknown code is ignored
    act(() => result.current[1]('multiply'))
    expect(window.location.pathname).toBe('/es/worksheets/multiplication')
    act(() => result.current[4]('xx'))
    expect(window.location.pathname).toBe('/es/worksheets/multiplication')
    act(() => result.current[1](null))
    expect(window.location.pathname).toBe('/es')

    // Back to an English URL
    act(() => {
      setPath('/worksheets/patterns')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(result.current[3]).toBe('en')
    expect(document.documentElement.lang).toBe('en')
  })

  it('a bare / restores the remembered locale and sheet silently', () => {
    const lengthBefore = window.history.length
    const { result } = renderHook(() => useRoute('rounding', 'de'))
    expect(result.current[0]).toBe('rounding')
    expect(result.current[3]).toBe('de')
    expect(window.location.pathname).toBe('/de/worksheets/rounding')
    expect(window.history.length).toBe(lengthBefore)
  })

  it('the remembered locale applies to any unprefixed URL; a prefixed URL wins; /en and unknown localized paths fall back', () => {
    setPath('/privacy')
    let hook = renderHook(() => useRoute('rounding', 'fr'))
    expect(hook.result.current[3]).toBe('fr')
    expect(hook.result.current[2].page.slug).toBe('privacy')
    expect(window.location.pathname).toBe('/fr/privacy')
    hook.unmount()

    setPath('/worksheets/patterns')
    hook = renderHook(() => useRoute('rounding', 'de'))
    expect(hook.result.current[0]).toBe('patterns')
    expect(window.location.pathname).toBe('/de/worksheets/patterns')
    hook.unmount()

    setPath('/es/worksheets/patterns')
    hook = renderHook(() => useRoute(null, 'de'))
    expect(hook.result.current[3]).toBe('es')
    expect(window.location.pathname).toBe('/es/worksheets/patterns')
    hook.unmount()

    setPath('/fr/nope')
    hook = renderHook(() => useRoute(null))
    expect(hook.result.current[3]).toBe('fr')
    expect(window.location.pathname).toBe('/fr')
    hook.unmount()

    setPath('/en')
    hook = renderHook(() => useRoute(null))
    expect(hook.result.current[3]).toBe('en')
    expect(window.location.pathname).toBe('/')
  })

  it('placeholder to keep the original describe shape', () => {
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
