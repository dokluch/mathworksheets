import { BRAND, SITE_URL } from '../seo/site'
import { useT } from '../i18n/context'

/** Bare host, so the printed line stays short: superawesomemath.com */
const DOMAIN = SITE_URL.replace(/^https?:\/\//, '').replace(/\/+$/, '')

/**
 * Brand stamp printed at the foot of every page of a worksheet. Print only —
 * `position: fixed` inside the print stylesheet is what repeats it on each
 * sheet of a multi-page print, and @page reserves the bottom margin for it.
 *
 * The wordmark and domain stay literal; only the tagline is translated.
 */
export default function PrintFooter() {
  const t = useT()
  return (
    <div className="print-footer print-only" aria-hidden="true">
      {BRAND} ({DOMAIN}) – {t('common.printFooterTagline')}
    </div>
  )
}
