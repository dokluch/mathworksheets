// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act, cleanup } from '@testing-library/react'
import { useSheetSet } from './useSheetSet.js'
import { SheetStateContext } from '../components/SheetState.js'
import { mulberry32 } from '../lib/rng.js'
import { setSequence } from '../lib/sheetSet.js'

const withCopies = copies => ({ children }) => (
  <SheetStateContext.Provider value={{ empty: false, setEmpty: () => {}, copies, setCopies: () => {} }}>
    {children}
  </SheetStateContext.Provider>
)
const generate = rng => [rng(), rng(), rng()]
const setPath = path => window.history.replaceState(null, '', path)

beforeEach(() => {
  cleanup()
  setPath('/worksheets/rounding')
})

describe('useSheetSet', () => {
  it('reads the set from ?set= and deals one sheet per copy, each from its own set', () => {
    setPath('/worksheets/rounding?set=123')
    const { result } = renderHook(() => useSheetSet(generate, []), { wrapper: withCopies(3) })
    expect(result.current.set).toBe(123)
    const sets = setSequence(123, 3)
    expect(result.current.sheets.map(s => s.set)).toEqual(sets)
    expect(new Set(sets).size).toBe(3)
    expect(result.current.sheets[1].data).toEqual(generate(mulberry32(sets[1])))
    expect(window.location.search).toBe('?set=123')
  })

  it('draws a three-digit set when the URL has none or an invalid one, and writes it to the URL', () => {
    const { result } = renderHook(() => useSheetSet(generate, []), { wrapper: withCopies(1) })
    expect(result.current.set >= 100 && result.current.set <= 999).toBe(true)
    expect(window.location.search).toBe(`?set=${result.current.set}`)
    expect(window.location.pathname).toBe('/worksheets/rounding')

    cleanup()
    setPath('/worksheets/rounding?set=abc')
    const again = renderHook(() => useSheetSet(generate, []), { wrapper: withCopies(1) })
    expect(again.result.current.set >= 100 && again.result.current.set <= 999).toBe(true)
    expect(window.location.search).toBe(`?set=${again.result.current.set}`)
  })

  it('setSet takes a valid number only; regenerate always moves; both update the URL', () => {
    setPath('/worksheets/rounding?set=200')
    const { result } = renderHook(() => useSheetSet(generate, []), { wrapper: withCopies(1) })
    act(() => result.current.setSet('456'))
    expect(result.current.set).toBe(456)
    expect(window.location.search).toBe('?set=456')
    act(() => result.current.setSet('abc'))
    act(() => result.current.setSet('0'))
    expect(result.current.set).toBe(456)

    const before = result.current.sheets[0].data
    act(() => result.current.regenerate())
    expect(result.current.set).not.toBe(456)
    expect(window.location.search).toBe(`?set=${result.current.set}`)
    expect(result.current.sheets[0].data).not.toEqual(before)
  })

  it('re-deals when a dependency changes, keeping the set number', () => {
    setPath('/worksheets/rounding?set=300')
    const { result, rerender } = renderHook(
      ({ n }) => useSheetSet(rng => Array.from({ length: n }, rng), [n]),
      { wrapper: withCopies(1), initialProps: { n: 2 } },
    )
    expect(result.current.sheets[0].data.length).toBe(2)
    rerender({ n: 4 })
    expect(result.current.sheets[0].data.length).toBe(4)
    expect(result.current.set).toBe(300)
    expect(result.current.sheets[0].data.slice(0, 2)).toEqual(Array.from({ length: 2 }, mulberry32(300)))
  })
})
