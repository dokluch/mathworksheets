// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import WorksheetHeader from './WorksheetHeader.jsx'

beforeEach(cleanup)

const stampBox = () => document.querySelector('.ws-field--stamp dd')

describe('WorksheetHeader', () => {
  it('shows the title, the ruled fields and a plain stamp when it is not editable', () => {
    const { container } = render(<WorksheetHeader title="Rounding" meta="to the nearest 10" stamp="451" />)
    expect(container.querySelector('.ws-title').textContent).toBe('Roundingto the nearest 10')
    expect(container.querySelectorAll('.ws-field--rule').length).toBe(2)
    expect(stampBox().textContent).toBe('451')
    expect(stampBox().querySelector('button, input')).toBeNull()
  })

  it('omits the stamp field without a stamp', () => {
    const { container } = render(<WorksheetHeader title="T" />)
    expect(container.querySelector('.ws-field--stamp')).toBeNull()
  })

  it('turns the stamp into a numeric field on click and commits a new set on Enter', () => {
    const onStampChange = vi.fn()
    render(<WorksheetHeader title="T" stamp="451" onStampChange={onStampChange} />)
    const button = screen.getByRole('button', { name: /Change set number/ })
    expect(button.textContent).toBe('451')
    fireEvent.click(button)
    const input = screen.getByRole('textbox', { name: 'Set number' })
    expect(input.value).toBe('451')
    expect(stampBox().contains(input)).toBe(true) // same box, so the header keeps its height
    fireEvent.change(input, { target: { value: '7x77' } })
    expect(input.value).toBe('777') // digits only
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onStampChange).toHaveBeenCalledWith(777)
    expect(onStampChange).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('textbox')).toBeNull()
  })

  it('commits on blur, and reverts on Escape, on an empty or an unchanged value', () => {
    const onStampChange = vi.fn()
    render(<WorksheetHeader title="T" stamp="451" onStampChange={onStampChange} />)
    const open = () => { fireEvent.click(screen.getByRole('button')); return screen.getByRole('textbox') }

    let input = open()
    fireEvent.change(input, { target: { value: '12' } })
    fireEvent.blur(input)
    expect(onStampChange).toHaveBeenLastCalledWith(12)

    input = open()
    fireEvent.change(input, { target: { value: '999' } })
    fireEvent.keyDown(input, { key: 'Escape' })
    fireEvent.blur(input) // the blur that follows the field going away is ignored
    expect(onStampChange).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button').textContent).toBe('451')

    input = open()
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onStampChange).toHaveBeenCalledTimes(1)

    input = open()
    fireEvent.keyDown(input, { key: 'Enter' }) // 451 again: no change to report
    expect(onStampChange).toHaveBeenCalledTimes(1)
    expect(document.querySelectorAll('.ws-field--stamp dd').length).toBe(1)
  })
})
