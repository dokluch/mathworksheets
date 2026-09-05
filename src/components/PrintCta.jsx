import { IconPrinter } from '@tabler/icons-react'
import { useT } from '../i18n/context'

/**
 * Bottom-of-sheet call to action so printing is obvious after scrolling
 * through a worksheet. Screen only (no-print); the print itself is tracked
 * by the beforeprint listener in App.jsx.
 */
export default function PrintCta() {
  const t = useT()
  return (
    <aside className="print-cta no-print" aria-label={t('common.printCta.title')}>
      <div className="print-cta-text">
        <strong className="print-cta-title">{t('common.printCta.title')}</strong>
        <span className="print-cta-hint">{t('common.printCta.hint')}</span>
      </div>
      <button type="button" className="btn btn-primary print-cta-button" onClick={() => window.print()}>
        <IconPrinter size={18} stroke={2} /> {t('common.printCta.button')}
      </button>
    </aside>
  )
}
