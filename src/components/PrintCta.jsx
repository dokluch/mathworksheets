import { useId } from 'react'
import { IconPrinter } from '@tabler/icons-react'
import { useT } from '../i18n/context'
import { useCopies } from './SheetState'
import { MAX_COPIES, clampCopies } from '../lib/sheetSet'

/**
 * Bottom-of-sheet Print button so printing is obvious after scrolling through
 * a worksheet, with the number of copies beside it: that many *different*
 * sheets — each with its own set number — come out, one per page (see useSheetSet
 * and SheetCopies). It sits here rather than in the settings panel because it
 * is a print option, not a setting of the sheet. Screen only (no-print); the
 * print itself is tracked by the beforeprint listener in App.jsx.
 */
export default function PrintCta() {
  const t = useT()
  const [copies, setCopies] = useCopies()
  const copiesId = useId()
  return (
    <div className="print-cta no-print">
      <label className="copies-field" htmlFor={copiesId}>
        <span>{t('common.copies')}</span>
        <input
          id={copiesId}
          className="num-input"
          type="number"
          inputMode="numeric"
          min={1}
          max={MAX_COPIES}
          value={copies}
          onChange={e => setCopies(clampCopies(e.target.value))}
        />
      </label>
      <button type="button" className="btn btn-primary print-cta-button" onClick={() => window.print()}>
        <IconPrinter size={18} stroke={2} /> {t('common.printWorksheet')}
      </button>
    </div>
  )
}
