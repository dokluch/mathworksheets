import { IconPrinter } from '@tabler/icons-react'
import { useT } from '../i18n/context'

/**
 * Bottom-of-sheet Print button so printing is obvious after scrolling through
 * a worksheet. Screen only (no-print); the print itself is tracked by the
 * beforeprint listener in App.jsx.
 */
export default function PrintCta() {
  const t = useT()
  return (
    <div className="print-cta no-print">
      <button type="button" className="btn btn-primary print-cta-button" onClick={() => window.print()}>
        <IconPrinter size={18} stroke={2} /> {t('common.printWorksheet')}
      </button>
    </div>
  )
}
