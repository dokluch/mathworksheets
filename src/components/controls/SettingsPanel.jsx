import { createContext, useContext, useId } from 'react'
import { IconPrinter, IconRefresh } from '@tabler/icons-react'
import { trackEvent } from '../../lib/analytics'
import { useT } from '../../i18n/context'
import './SettingsPanel.css'

// Lets a SegmentedControl pick up the accessible name of the row it sits in.
const RowLabelContext = createContext(null)

/** Card that holds one SettingRow per setting and an optional footer of actions. Never printed. */
export function SettingsPanel({ children, actions, className }) {
  return (
    <div className={`settings-panel no-print${className ? ` ${className}` : ''}`}>
      <div className="settings-body">{children}</div>
      {actions && <div className="settings-footer">{actions}</div>}
    </div>
  )
}

/**
 * One setting: a label and its control. With `htmlFor` the label is a real
 * <label> for a single input (slider, text field); otherwise it is plain text
 * that group controls reference via aria-labelledby.
 */
export function SettingRow({ label, htmlFor, children }) {
  const labelId = useId()
  const Tag = htmlFor ? 'label' : 'span'
  return (
    <div className="setting-row">
      <Tag id={labelId} htmlFor={htmlFor} className="setting-label">{label}</Tag>
      <div className="setting-control">
        <RowLabelContext.Provider value={labelId}>{children}</RowLabelContext.Provider>
      </div>
    </div>
  )
}

/**
 * Joined toggle buttons; exactly one option is pressed. `onChange` receives the option value untouched.
 * An option may carry a `sublabel` — a quieter second line under its label — and `className` selects a
 * layout variant of the group. Options without a sublabel render exactly as before.
 */
export function SegmentedControl({ options, value, onChange, ariaLabel, className }) {
  const rowLabelId = useContext(RowLabelContext)
  return (
    <div
      className={`btn-group${className ? ` ${className}` : ''}`}
      role="group"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabel ? undefined : rowLabelId ?? undefined}
    >
      {options.map(option => {
        const selected = option.value === value
        return (
          <button
            key={String(option.value)}
            type="button"
            className={`btn-toggle${selected ? ' active' : ''}`}
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
          >
            {option.sublabel === undefined ? option.label : (
              <>
                <span className="btn-toggle-label">{option.label}</span>
                <span className="btn-toggle-sub">{option.sublabel}</span>
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function CheckboxOption({ checked, onChange, children }) {
  return (
    <label className="checkbox-option">
      <input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} />
      <span>{children}</span>
    </label>
  )
}

/** Regenerate (tracked) and Print buttons for the panel footer. */
export function PanelActions({ worksheetId, onRegenerate, showPrint = true }) {
  const t = useT()
  return (
    <>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => { trackEvent('regenerate_worksheet', { worksheet_id: worksheetId }); onRegenerate() }}
      >
        <IconRefresh size={16} stroke={2} /> {t('common.regenerate')}
      </button>
      {/* Print is the goal of the visit and carries the primary weight;
          Regenerate is the step you may take on the way there. */}
      {showPrint && (
        <button type="button" className="btn btn-primary" onClick={() => window.print()}>
          <IconPrinter size={16} stroke={2} /> {t('common.print')}
        </button>
      )}
    </>
  )
}
