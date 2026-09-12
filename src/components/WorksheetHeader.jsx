import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n/context'
import { MAX_SET, parseSet } from '../lib/sheetSet'

/**
 * The set number, and on screen the way to change it.
 *
 * The stamp is a button until it is clicked, then a short numeric field in
 * the very same box: typing 451 and pressing Enter deals set 451, which is
 * how a parent gets the page a friend has. Escape or an empty field puts the
 * old number back. Nothing here changes the box's geometry — the header band
 * on a notebook sheet is exactly three squares tall and stays so.
 */
function StampField({ stamp, onStampChange }) {
  const t = useT()
  const [draft, setDraft] = useState(null) // null while not editing
  const settled = useRef(false) // Enter/Escape already handled it; the blur that follows is noise
  const inputRef = useRef(null)
  const editing = draft !== null

  // Select the old number once, when the field opens, so typing replaces it.
  // (Not on every render: re-selecting after each keystroke would swallow
  // every digit but the last.)
  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  if (!onStampChange) return stamp
  if (!editing) {
    return (
      <button
        type="button"
        className="ws-stamp-btn"
        title={t('common.changeSet')}
        aria-label={`${t('common.changeSet')} (${stamp})`}
        onClick={() => { settled.current = false; setDraft(stamp) }}
      >
        {stamp}
      </button>
    )
  }

  const finish = commit => {
    if (settled.current) return
    settled.current = true
    setDraft(null)
    const next = commit ? parseSet(draft) : null
    if (next != null && String(next) !== stamp) onStampChange(next)
  }

  return (
    <input
      className="ws-stamp-input"
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={String(MAX_SET).length}
      aria-label={t('common.setNumber')}
      value={draft}
      ref={inputRef}
      onChange={e => setDraft(e.target.value.replace(/\D/g, ''))}
      onKeyDown={e => {
        if (e.key === 'Enter') finish(true)
        else if (e.key === 'Escape') finish(false)
      }}
      onBlur={() => finish(true)}
    />
  )
}

/**
 * The head of every printable sheet.
 *
 * The sheet is a document, not a grid of sums: it carries a title, a ruled
 * block the child fills in by hand, and a set number that identifies this
 * particular generated page. A teacher printing thirty copies could not tell
 * them apart before; a parent could not date a child's progress; nobody could
 * say "look at number 7 again".
 *
 * Rendered identically on screen and on paper, so what the parent approves
 * before pressing Print is the thing that comes out of the printer. With
 * `onStampChange` the set number can be edited in place (screen only: the
 * printed copies pass no handler and show plain text).
 */
export default function WorksheetHeader({ title, meta, instructions, stamp, onStampChange }) {
  const t = useT()
  return (
    <div className="worksheet-header">
      <div className="ws-headline">
        <div className="ws-title">
          {title}
          {meta && <span className="ws-meta">{meta}</span>}
        </div>
        <dl className="ws-fields">
          <div className="ws-field ws-field--rule">
            <dt>{t('common.fieldName')}</dt>
            <dd aria-hidden="true" />
          </div>
          <div className="ws-field ws-field--rule">
            <dt>{t('common.fieldDate')}</dt>
            <dd aria-hidden="true" />
          </div>
          {stamp && (
            <div className="ws-field ws-field--stamp">
              <dt>{t('common.fieldSet')}</dt>
              {/* Keyed on the value so React remounts the node and the stamp
                  animation replays only when the sheet actually changed. */}
              <dd key={stamp}>
                <StampField stamp={stamp} onStampChange={onStampChange} />
              </dd>
            </div>
          )}
        </dl>
      </div>
      {instructions && <p className="ws-instructions">{instructions}</p>}
    </div>
  )
}
