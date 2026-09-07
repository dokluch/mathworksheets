import { useT } from '../i18n/context'

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
 * before pressing Print is the thing that comes out of the printer.
 */
export default function WorksheetHeader({ title, meta, instructions, stamp }) {
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
              <dd key={stamp}>{stamp}</dd>
            </div>
          )}
        </dl>
      </div>
      {instructions && <p className="ws-instructions">{instructions}</p>}
    </div>
  )
}
