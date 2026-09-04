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
