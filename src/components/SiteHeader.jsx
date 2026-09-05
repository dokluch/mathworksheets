import { IconRuler2 } from '@tabler/icons-react'
import { BRAND } from '../seo/site'
import { pageRoute } from '../seo/render'
import { findPageById } from '../pages'
import { localizePage } from '../i18n/index.js'
import { useLocale, useT } from '../i18n/context.js'
import { sheetIdToPath } from '../hooks/useRoute'

/**
 * Site header on every view: brand (link home) on the left, About and the
 * language switcher (passed as children) on the right. On the catalog the
 * brand is the page's <h1>; static pages and worksheets carry their own.
 * Never printed (no-print).
 */
export default function SiteHeader({ navigate, isHome = false, children }) {
  const locale = useLocale()
  const t = useT()
  const about = localizePage(findPageById('about'), locale)
  const aboutHref = pageRoute(about, locale).path
  const go = (target) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    navigate(target)
  }
  const brand = (
    <a className="site-brand" href={sheetIdToPath(null, locale)} onClick={go(null)}>
      <IconRuler2 size={22} stroke={2} />
      <span>{BRAND}</span>
    </a>
  )
  return (
    <header className="site-header no-print">
      {isHome ? <h1 className="site-brand-title">{brand}</h1> : brand}
      <nav className="site-nav" aria-label={t('static.footerSite')}>
        <a className="site-nav-link" href={aboutHref} onClick={go(aboutHref)}>{about.navLabel}</a>
        {children}
      </nav>
    </header>
  )
}
