// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('../lib/analytics.js', () => ({ trackPageView: vi.fn(), trackEvent: vi.fn() }))
import { trackPageView } from '../lib/analytics.js'
import { useRoute, pathToSheetId, sheetIdToPath, titleForSheet, localeFromPath } from './useRoute.js'
import { pageTitle, worksheetRoute, homeRoute } from '../seo/render.js'
import { BRAND } from '../seo/site.js'
import { findWorksheetById } from '../worksheets.js'

function setPath(path) {
  window.history.replaceState(null, '', path)
}

beforeEach(() => {
  window.scrollTo = vi.fn()   // jsdom has no real implementation
  setPath('/')
  document.title = ''
  document.head.innerHTML = '<link rel="canonical" href="x" /><link rel="alternate" type="text/markdown" href="y" />'
  trackPageView.mockClear()
})

describe('scroll behaviour', () => {
  it('scrolls to the top when navigating to a different page', () => {
    setPath('/worksheets/rounding')
    const { result } = renderHook(() => useRoute())
    window.scrollTo.mockClear()
    act(() => result.current[1]('/about'))
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 })
  })

  it('does not scroll when navigating to the page already shown', () => {
    setPath('/about')
    const { result } = renderHook(() => useRoute())
    window.scrollTo.mockClear()
    act(() => result.current[1]('/about'))
    expect(window.scrollTo).not.toHaveBeenCalled()
  })
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
    expect(titleForSheet(null)).toBe(pageTitle(homeRoute()))
    expect(titleForSheet('compare')).toBe(`Comparison Worksheets · ${BRAND}`)
  })
})

describe('useRoute', () => {
  it('starts on the catalog at / with no remembered sheet', () => {
    const { result } = renderHook(() => useRoute())
    expect(result.current[0]).toBeNull()
    expect(window.location.pathname).toBe('/')
    expect(document.title).toContain(BRAND)
    expect(trackPageView).toHaveBeenCalledWith('/', expect.stringContaining(BRAND))
  })

  it('the URL wins over the remembered sheet', () => {
    setPath('/worksheets/patterns')
    const { result } = renderHook(() => useRoute())
    expect(result.current[0]).toBe('patterns')
    expect(window.location.pathname).toBe('/worksheets/patterns')
  })

  // The catalog is the front door and must stay reachable by typing the
  // domain. It used to be swapped for the remembered sheet via replaceState,
  // which both hid the catalog and made Back leave the site; the remembered
  // sheet is offered as a card on the catalog instead (see App.jsx).
  it('keeps the catalog on / and never rewrites the URL to a remembered sheet', () => {
    const lengthBefore = window.history.length
    const { result } = renderHook(() => useRoute())
    expect(result.current[0]).toBeNull()
    expect(result.current[2]).toBeNull()
    expect(window.location.pathname).toBe('/')
    expect(window.history.length).toBe(lengthBefore)
    expect(document.title).toContain(BRAND)
    expect(document.querySelector('link[rel="canonical"]').getAttribute('href')).toMatch(/\/$/)
  })

  it('shows a static page named in the URL without rewriting it', () => {
    setPath('/privacy')
    const { result } = renderHook(() => useRoute())
    const [sheet, , page] = result.current
    expect(sheet).toBeNull()
    expect(page.kind).toBe('page')
    expect(page.page.slug).toBe('privacy')
    expect(window.location.pathname).toBe('/privacy')
    expect(document.title).toBe(`Privacy Policy · ${BRAND}`)
    expect(document.querySelector('link[rel="canonical"]').getAttribute('href')).toMatch(/\/privacy$/)
    expect(document.querySelector('link[rel="alternate"]').getAttribute('href')).toMatch(/\/privacy\.md$/)
    expect(trackPageView).toHaveBeenCalledWith('/privacy', `Privacy Policy · ${BRAND}`)
  })

  it('falls back to the catalog (and rewrites the URL) for an unknown path', () => {
    setPath('/nope')
    const { result } = renderHook(() => useRoute())
    expect(result.current[0]).toBeNull()
    expect(result.current[2]).toBeNull()
    expect(window.location.pathname).toBe('/')
  })

  it('navigate accepts page paths, worksheet ids and null, and popstate resolves pages', () => {
    const { result } = renderHook(() => useRoute())
    act(() => result.current[1]('/about'))
    expect(result.current[2].page.slug).toBe('about')
    expect(result.current[0]).toBeNull()
    expect(window.location.pathname).toBe('/about')
    expect(trackPageView).toHaveBeenLastCalledWith('/about', `About ${BRAND} · ${BRAND}`)

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
    const { result } = renderHook(() => useRoute())
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
    const { result } = renderHook(() => useRoute())
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

  // The locale is still restored on a bare /; the sheet no longer is.
  it('a bare / restores the remembered locale but stays on the catalog', () => {
    const lengthBefore = window.history.length
    const { result } = renderHook(() => useRoute('de'))
    expect(result.current[0]).toBeNull()
    expect(result.current[3]).toBe('de')
    expect(window.location.pathname).toBe('/de')
    expect(window.history.length).toBe(lengthBefore)
  })

  it('the remembered locale applies to any unprefixed URL; a prefixed URL wins; /en and unknown localized paths fall back', () => {
    setPath('/privacy')
    let hook = renderHook(() => useRoute('fr'))
    expect(hook.result.current[3]).toBe('fr')
    expect(hook.result.current[2].page.slug).toBe('privacy')
    expect(window.location.pathname).toBe('/fr/privacy')
    hook.unmount()

    setPath('/worksheets/patterns')
    hook = renderHook(() => useRoute('de'))
    expect(hook.result.current[0]).toBe('patterns')
    expect(window.location.pathname).toBe('/de/worksheets/patterns')
    hook.unmount()

    setPath('/es/worksheets/patterns')
    hook = renderHook(() => useRoute('de'))
    expect(hook.result.current[3]).toBe('es')
    expect(window.location.pathname).toBe('/es/worksheets/patterns')
    hook.unmount()

    setPath('/fr/nope')
    hook = renderHook(() => useRoute())
    expect(hook.result.current[3]).toBe('fr')
    expect(window.location.pathname).toBe('/fr')
    hook.unmount()

    setPath('/en')
    hook = renderHook(() => useRoute())
    expect(hook.result.current[3]).toBe('en')
    expect(window.location.pathname).toBe('/')
  })

  it('placeholder to keep the original describe shape', () => {
    const { result } = renderHook(() => useRoute())
    expect(result.current[0]).toBeNull()
    expect(window.location.pathname).toBe('/')
  })

  it('navigate pushes history, updates title and tracks a page view; back returns to the catalog', () => {
    const { result } = renderHook(() => useRoute())
    act(() => result.current[1]('multiply'))
    expect(result.current[0]).toBe('multiply')
    expect(window.location.pathname).toBe('/worksheets/multiplication')
    expect(document.title).toBe(`Multiplication Worksheets · ${BRAND}`)
    expect(trackPageView).toHaveBeenLastCalledWith('/worksheets/multiplication', `Multiplication Worksheets · ${BRAND}`)

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

describe('set number query', () => {
  it('survives the remembered-locale rewrite and a language switch on the same sheet, and is dropped for another sheet', () => {
    setPath('/worksheets/rounding?set=5')
    const { result } = renderHook(() => useRoute('fr'))
    expect(window.location.pathname).toBe('/fr/worksheets/rounding')
    expect(window.location.search).toBe('?set=5')

    act(() => result.current[4]('de'))
    expect(window.location.pathname).toBe('/de/worksheets/rounding')
    expect(window.location.search).toBe('?set=5')

    act(() => result.current[1]('compare'))
    expect(window.location.pathname).toBe('/de/worksheets/comparison')
    expect(window.location.search).toBe('')
  })
})
