// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, cleanup } from '@testing-library/react'
import { useNotebookSheet } from './useNotebookSheet.js'
import { SheetStateContext } from '../components/SheetState.js'
import { makeSheetShape } from '../lib/sheet.js'

const wrapper = ({ children }) => (
  <SheetStateContext.Provider value={{ empty: false, setEmpty: () => {}, copies: 1, setCopies: () => {} }}>
    {children}
  </SheetStateContext.Provider>
)
const sheetShape = makeSheetShape({ sheetFrame: ({ wide }) => ({ rows: 1, cellsWide: wide ? 12 : 5 }) })

beforeEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/worksheets/division?set=321')
})

describe('useNotebookSheet', () => {
  it('gives only the primary copy the measuring ref, and every copy the same class and grid', () => {
    const { result } = renderHook(
      () => useNotebookSheet({ shape: sheetShape({ wide: false, columns: 3 }), generate: () => [], deps: [], className: 'coldiv-notebook' }),
      { wrapper },
    )
    const primary = result.current.sheetProps(true)
    const copy = result.current.sheetProps(false)
    expect(primary.ref).toBeTruthy()
    expect(copy.ref).toBeUndefined()
    expect(primary.className).toBe('worksheet notebook-grid-bg colarith-notebook coldiv-notebook print-area cols-3')
    expect(copy.className).toBe(primary.className)
    expect(copy.style).toBe(primary.style)
  })

  it('names the sheet without a gap when there is no extra class, using the column count that prints', () => {
    const { result } = renderHook(
      () => useNotebookSheet({ shape: sheetShape({ wide: true, columns: 4 }), generate: () => [], deps: [] }),
      { wrapper },
    )
    expect(result.current.sheetProps(true).className).toBe('worksheet notebook-grid-bg colarith-notebook print-area cols-3')
  })

  it('deals a page-sized sheet, and deals again when the shape or a setting changes but not on a repaint', () => {
    let deals = 0
    const generate = (rng, shape) => {
      deals++
      return Array.from({ length: shape.count }, () => rng())
    }
    const { result, rerender } = renderHook(
      ({ columns, setting }) => useNotebookSheet({ shape: sheetShape({ wide: false, columns }), generate, deps: [setting] }),
      { wrapper, initialProps: { columns: 3, setting: 'a', repaint: 1 } },
    )
    expect(result.current.sheets[0].set).toBe(321)
    expect(result.current.sheets[0].data).toHaveLength(sheetShape({ wide: false, columns: 3 }).count)
    const dealt = deals
    rerender({ columns: 3, setting: 'a', repaint: 2 })
    expect(deals).toBe(dealt)
    rerender({ columns: 2, setting: 'a', repaint: 2 })
    expect(deals).toBe(dealt + 1)
    expect(result.current.sheets[0].data).toHaveLength(sheetShape({ wide: false, columns: 2 }).count)
    rerender({ columns: 2, setting: 'b', repaint: 2 })
    expect(deals).toBe(dealt + 2)
  })
})
