// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import PrintCta from './PrintCta.jsx'
import { SheetStateContext } from './SheetState.js'
import { MAX_COPIES } from '../lib/sheetSet.js'

beforeEach(cleanup)

describe('PrintCta', () => {
  it('prints on click, is never printed, and offers a Copies count clamped to the allowed range', () => {
    window.print = vi.fn()
    const setCopies = vi.fn()
    const { container } = render(
      <SheetStateContext.Provider value={{ empty: false, setEmpty: () => {}, copies: 2, setCopies }}>
        <PrintCta />
      </SheetStateContext.Provider>
    )
    expect(container.querySelector('.print-cta').className).toContain('no-print')
    fireEvent.click(screen.getByRole('button', { name: /Print worksheet/ }))
    expect(window.print).toHaveBeenCalledTimes(1)

    const copies = screen.getByLabelText('Copies')
    expect(copies.value).toBe('2')
    expect(copies.getAttribute('max')).toBe(String(MAX_COPIES))
    fireEvent.change(copies, { target: { value: '5' } })
    expect(setCopies).toHaveBeenLastCalledWith(5)
    fireEvent.change(copies, { target: { value: '50' } })
    expect(setCopies).toHaveBeenLastCalledWith(MAX_COPIES)
    fireEvent.change(copies, { target: { value: '' } })
    expect(setCopies).toHaveBeenLastCalledWith(1)
  })
})
