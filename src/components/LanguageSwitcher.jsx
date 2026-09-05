import { useEffect, useRef, useState } from 'react'
import { IconWorld, IconChevronDown } from '@tabler/icons-react'
import { LOCALES, LOCALE_META } from '../i18n/index.js'
import { useT } from '../i18n/context.js'

/**
 * Header language switcher: a globe button that opens a menu of every locale.
 * Items are real links (Cmd/Ctrl-click and hover URLs work); a plain click
 * switches in-app via onSelect(code). Never printed (no-print).
 */
export default function LanguageSwitcher({ locale, hrefFor, onSelect, className = '' }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const select = (code) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    setOpen(false)
    if (code !== locale) onSelect(code)
  }

  return (
    <div className={`lang-switcher no-print ${className}`.trim()} ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="lang-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t('app.language')}: ${LOCALE_META[locale].name}`}
        onClick={() => setOpen(o => !o)}
      >
        <IconWorld size={18} stroke={1.8} />
        <span className="lang-btn-code">{locale.toUpperCase()}</span>
        <IconChevronDown size={14} stroke={2} className="lang-btn-chevron" />
      </button>
      {open && (
        <ul className="lang-menu" role="menu" aria-label={t('app.language')}>
          {LOCALES.map(code => (
            <li key={code} role="none">
              <a
                role="menuitemradio"
                aria-checked={code === locale}
                lang={LOCALE_META[code].lang}
                hrefLang={LOCALE_META[code].hreflang}
                href={hrefFor(code)}
                onClick={select(code)}
              >
                {LOCALE_META[code].name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
