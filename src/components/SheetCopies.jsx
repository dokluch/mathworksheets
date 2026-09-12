import { Fragment } from 'react'

/**
 * Renders a worksheet once per requested copy.
 *
 * `children(sheet, primary)` paints one sheet. The first copy is the page on
 * screen and gets `primary = true`: it is the one that carries the measuring
 * refs and the editable set stamp. The rest exist only for the printer — they
 * are `.print-only` and each starts a new page (see App.css).
 *
 * Copies are keyed by position on purpose. A copy keyed on its set number
 * would remount whenever the number changed, and useNotebookGrid's
 * ResizeObserver, attached once, would be left watching a detached node.
 */
export default function SheetCopies({ sheets, children }) {
  return sheets.map((sheet, i) => (
    i === 0
      ? <Fragment key="primary">{children(sheet, true)}</Fragment>
      : <div key={i} className="sheet-copy print-only" aria-hidden="true">{children(sheet, false)}</div>
  ))
}
