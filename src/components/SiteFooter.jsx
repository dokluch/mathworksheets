import { IconBrandGithub } from '@tabler/icons-react'
import { siteFooterLinks } from '../seo/render'
import { LICENSE_NAME, LICENSE_URL, OPERATOR } from '../seo/site'
import { useLocale, useT } from '../i18n/context.js'

/**
 * Site footer: About · Privacy · Terms · GitHub and the copyright line, in
 * the current locale. `variant="sidebar"` is the compact form shown under the
 * worksheet list. Never printed (no-print).
 */
export default function SiteFooter({ navigate, variant = 'full' }) {
  const locale = useLocale()
  const t = useT()
  const internal = (path) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    navigate(path)
  }
  return (
    <footer className={`site-footer no-print${variant === 'sidebar' ? ' site-footer--sidebar' : ''}`}>
      <nav className="site-footer-links" aria-label={t('static.footerSite')}>
        {siteFooterLinks(locale).map(l => l.external ? (
          <a key={l.path} href={l.path} target="_blank" rel="noopener noreferrer">
            <IconBrandGithub size={16} stroke={1.5} />
            {l.label}
          </a>
        ) : (
          <a key={l.path} href={l.path} onClick={internal(l.path)}>{l.label}</a>
        ))}
      </nav>
      {variant === 'full' && (
        <p className="site-footer-legal">
          © {new Date().getFullYear()} {OPERATOR} · <a href={LICENSE_URL} target="_blank" rel="license noopener noreferrer">{LICENSE_NAME}</a>
        </p>
      )}
    </footer>
  )
}
