// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act, cleanup } from '@testing-library/react'
import { usePersistedState, getPersistedTab } from './usePersistedState.js'

const stored = () => JSON.parse(localStorage.getItem('mathsheets'))
const seed = blob => localStorage.setItem('mathsheets', JSON.stringify(blob))

beforeEach(() => {
  cleanup()
  localStorage.clear()
})

describe('usePersistedState', () => {
  it('returns the stored value and writes a change back, keeping the rest of the blob', () => {
    seed({ divide: { limit: 50, columns: 2 }, app: { locale: 'fr' } })
    const { result } = renderHook(() => usePersistedState('divide', 'limit', 100))
    expect(result.current[0]).toBe(50)
    act(() => result.current[1](20))
    expect(stored()).toEqual({ divide: { limit: 20, columns: 2 }, app: { locale: 'fr' } })
    expect(getPersistedTab('divide')).toEqual({ limit: 20, columns: 2 })
  })

  it('stores the default the first time a setting is used', () => {
    renderHook(() => usePersistedState('solvex', 'level', 'one'))
    expect(stored()).toEqual({ solvex: { level: 'one' } })
  })

  it('replaces a value an older build left with the default, by list or by predicate', () => {
    seed({ divide: { limit: 7, notation: 'dot', preset: 'gone' } })
    const { result } = renderHook(() => [
      usePersistedState('divide', 'limit', 100, [20, 50, 100]),
      usePersistedState('divide', 'notation', 'cross', ['dot', 'cross']),
      usePersistedState('divide', 'preset', '3x1', value => ['3x1', '4x1'].includes(value)),
    ])
    expect(result.current.map(([value]) => value)).toEqual([100, 'dot', '3x1'])
    expect(stored().divide).toEqual({ limit: 100, notation: 'dot', preset: '3x1' })
  })

  it('keeps a stored value when no list is given', () => {
    seed({ coladd: { digits: 5 } })
    const { result } = renderHook(() => usePersistedState('coladd', 'digits', 3))
    expect(result.current[0]).toBe(5)
  })

  it('sees storage written outside the hook after it has read the blob once', () => {
    renderHook(() => usePersistedState('app', 'grade', 'all'))
    cleanup()
    seed({ app: { grade: '3' } })
    const { result } = renderHook(() => usePersistedState('app', 'grade', 'all'))
    expect(result.current[0]).toBe('3')
    localStorage.clear()
    expect(getPersistedTab('app')).toEqual({})
  })
})
