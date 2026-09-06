// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

vi.mock('../../lib/analytics.js', () => ({ trackEvent: vi.fn() }))
import { trackEvent } from '../../lib/analytics.js'
import { SettingsPanel, SettingRow, SegmentedControl, CheckboxOption, PanelActions } from './SettingsPanel.jsx'

beforeEach(() => {
  cleanup()
  trackEvent.mockClear()
})

describe('SegmentedControl', () => {
  it('is named by its row label, marks the selected option pressed and reports the untouched value', () => {
    const onChange = vi.fn()
    render(
      <SettingRow label="Columns">
        <SegmentedControl value={2} onChange={onChange} options={[2, 3, 4].map(c => ({ value: c, label: c }))} />
      </SettingRow>
    )
    const group = screen.getByRole('group', { name: 'Columns' })
    const buttons = group.querySelectorAll('button')
    expect(buttons.length).toBe(3)
    const pressed = screen.getAllByRole('button', { pressed: true })
    expect(pressed.length).toBe(1)
    expect(pressed[0].textContent).toBe('2')
    expect(pressed[0].className).toContain('active')
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    expect(onChange).toHaveBeenCalledWith(3)
    expect(typeof onChange.mock.calls[0][0]).toBe('number')
  })

  it('can be named by an explicit aria-label outside a row', () => {
    render(<SegmentedControl ariaLabel="Operation" value="add" onChange={() => {}} options={[{ value: 'add', label: '+' }]} />)
    expect(screen.getByRole('group', { name: 'Operation' })).toBeTruthy()
  })
})

describe('SettingRow and CheckboxOption', () => {
  it('a row with htmlFor is a real label for its input', () => {
    render(
      <SettingRow label="Pre-fill 50%" htmlFor="slider-1">
        <input id="slider-1" type="range" defaultValue={50} />
      </SettingRow>
    )
    expect(screen.getByLabelText('Pre-fill 50%').getAttribute('type')).toBe('range')
  })

  it('a checkbox option is clickable through its text and reports a boolean', () => {
    const onChange = vi.fn()
    render(<CheckboxOption checked={false} onChange={onChange}>67 mode</CheckboxOption>)
    fireEvent.click(screen.getByLabelText('67 mode'))
    expect(onChange).toHaveBeenCalledWith(true)
  })
})

describe('PanelActions', () => {
  it('tracks and regenerates, prints, and can hide the Print button', () => {
    window.print = vi.fn()
    const onRegenerate = vi.fn()
    render(<PanelActions worksheetId="x" onRegenerate={onRegenerate} />)
    fireEvent.click(screen.getByRole('button', { name: /Regenerate/ }))
    expect(trackEvent).toHaveBeenCalledWith('regenerate_worksheet', { worksheet_id: 'x' })
    expect(onRegenerate).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: /Print/ }))
    expect(window.print).toHaveBeenCalledTimes(1)

    cleanup()
    render(<PanelActions worksheetId="x" onRegenerate={onRegenerate} showPrint={false} />)
    expect(screen.queryByRole('button', { name: /Print/ })).toBeNull()
  })
})

describe('SettingsPanel', () => {
  it('is never printed and only has a footer when given actions', () => {
    const { container } = render(<SettingsPanel><SettingRow label="A">x</SettingRow></SettingsPanel>)
    const panel = container.querySelector('.settings-panel')
    expect(panel.className).toContain('no-print')
    expect(container.querySelector('.settings-footer')).toBeNull()

    cleanup()
    const withActions = render(<SettingsPanel actions={<button>Go</button>}><SettingRow label="A">x</SettingRow></SettingsPanel>)
    expect(withActions.container.querySelector('.settings-footer button').textContent).toBe('Go')
  })
})
