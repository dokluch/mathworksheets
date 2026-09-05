import { useEffect, useCallback, useMemo } from 'react'
import { IconGrid3x3, IconPlusMinus, IconArrowsLeftRight, IconTargetArrow, IconTrendingUp, IconArrowLeft, IconEqual, IconColumns3, IconCalculator } from '@tabler/icons-react'
import { usePersistedState, getPersistedTab } from './hooks/usePersistedState'
import { useRoute, sheetIdToPath } from './hooks/useRoute'
import { trackEvent, settingsToParams } from './lib/analytics'
import { t as translate, localizedWorksheets, DEFAULT_LOCALE } from './i18n/index.js'
import { LocaleContext } from './i18n/context.js'
import './App.css'
import LanguageSwitcher from './components/LanguageSwitcher'
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'
import PrintCta from './components/PrintCta'
import StaticPage from './components/StaticPage'
import MultiplicationTable from './components/MultiplicationTable'
import AddSubtract from './components/AddSubtract'
import Comparison from './components/Comparison'
import Rounding from './components/Rounding'
import Patterns from './components/Patterns'
import EquationExplorer from './components/EquationExplorer'
import ColumnAddition from './components/ColumnAddition'
import ColumnMultiplication from './components/ColumnMultiplication'

const ICONS = {
  multiply: IconGrid3x3,
  addsub: IconPlusMinus,
  coladd: IconColumns3,
  colmul: IconCalculator,
  compare: IconArrowsLeftRight,
  rounding: IconTargetArrow,
  patterns: IconTrendingUp,
  eqexplore: IconEqual,
}

const COMPONENTS = {
  multiply: MultiplicationTable,
  addsub: AddSubtract,
  coladd: ColumnAddition,
  colmul: ColumnMultiplication,
  compare: Comparison,
  rounding: Rounding,
  patterns: Patterns,
  eqexplore: EquationExplorer,
}

export default function App() {
  const [persistedSheet, setPersistedSheet] = usePersistedState('app', 'activeTab', null)
  const [persistedLocale, setPersistedLocale] = usePersistedState('app', 'locale', DEFAULT_LOCALE)
  const [activeSheet, navigate, activePage, locale, setLocale, pathInLocale] = useRoute(persistedSheet, persistedLocale)

  // Keep "pick up where you left off" working across sessions. Reading a
  // static page (About, Privacy, …) must not forget the remembered sheet.
  useEffect(() => {
    if (!activePage) setPersistedSheet(activeSheet)
  }, [activeSheet, activePage, setPersistedSheet])

  const localeCtx = useMemo(() => ({ locale, t: (key, params) => translate(locale, key, params) }), [locale])
  const t = localeCtx.t

  // Catalog data lives in src/worksheets.js (shared with SEO/build), translated per locale; icons are UI-only.
  const worksheets = useMemo(
    () => localizedWorksheets(locale).map(ws => ({ ...ws, desc: ws.shortDesc, Icon: ICONS[ws.id] })),
    [locale],
  )

  // One listener catches both the Print button and Cmd/Ctrl+P.
  useEffect(() => {
    if (!activeSheet) return undefined
    const onBeforePrint = () => {
      trackEvent('print_worksheet', { worksheet_id: activeSheet, ...settingsToParams(getPersistedTab(activeSheet)) })
    }
    window.addEventListener('beforeprint', onBeforePrint)
    return () => window.removeEventListener('beforeprint', onBeforePrint)
  }, [activeSheet])

  const selectSheet = useCallback((id) => {
    trackEvent('select_worksheet', { worksheet_id: id })
    navigate(id)
  }, [navigate])

  // Only an explicit choice is remembered; it then applies to every unprefixed URL (see useRoute).
  const switchLocale = useCallback((code) => {
    trackEvent('switch_locale', { locale: code })
    setPersistedLocale(code)
    setLocale(code)
  }, [setLocale, setPersistedLocale])

  const ActiveComponent = activeSheet ? COMPONENTS[activeSheet] : null
  const activeInfo = worksheets.find(w => w.id === activeSheet)

  const cardLink = (ws) => ({
    href: sheetIdToPath(ws.id, locale),
    onClick: (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
      e.preventDefault()
      selectSheet(ws.id)
    },
  })

  const switcher = <LanguageSwitcher locale={locale} hrefFor={pathInLocale} onSelect={switchLocale} />

  return (
    <LocaleContext.Provider value={localeCtx}>
      <div className={`app ${activeSheet ? 'has-active' : 'catalog-only'}`}>
        <SiteHeader navigate={navigate} isHome={!activeSheet && !activePage}>
          {switcher}
        </SiteHeader>
        <div className="app-body">

        {/* ── Static page (About, Privacy, Terms, Developers) ── */}
        {activePage ? (
          <>
            <StaticPage route={activePage} navigate={navigate} />
            <SiteFooter navigate={navigate} />
          </>
        ) : activeSheet ? (
          <aside className="catalog no-print catalog--sidebar">
            <header className="catalog-header">
              <a className="back-btn" href={sheetIdToPath(null, locale)} onClick={(e) => { e.preventDefault(); navigate(null) }}>
                <IconArrowLeft size={18} stroke={2} />
                <span className="back-btn-label">{t('app.allSheets')}</span>
              </a>
            </header>

            <nav className="catalog-grid catalog-grid--compact" role="tablist" aria-label={t('app.worksheetTypes')}>
              {worksheets.map(ws => (
                <a
                  key={ws.id}
                  role="tab"
                  aria-selected={activeSheet === ws.id}
                  className={`catalog-card ${activeSheet === ws.id ? 'catalog-card--active' : ''}`}
                  style={{ '--card-color': ws.color }}
                  {...cardLink(ws)}
                >
                  <span className="catalog-card-icon">
                    <ws.Icon size={20} stroke={1.6} />
                  </span>
                  <span className="catalog-card-text">
                    <span className="catalog-card-label">{ws.label}</span>
                  </span>
                </a>
              ))}
            </nav>

            <SiteFooter navigate={navigate} variant="sidebar" />
          </aside>
        ) : (
          <main className="catalog no-print catalog--full">
            <p className="catalog-hero">{t('app.subtitle')}</p>

            <nav className="catalog-grid" aria-label={t('app.worksheetTypes')}>
              {worksheets.map(ws => (
                <a
                  key={ws.id}
                  className="catalog-card"
                  style={{ '--card-color': ws.color }}
                  {...cardLink(ws)}
                >
                  <span className="catalog-card-icon">
                    <ws.Icon size={32} stroke={1.6} />
                  </span>
                  <span className="catalog-card-text">
                    <span className="catalog-card-label">{ws.label}</span>
                    <span className="catalog-card-desc">{ws.desc}</span>
                  </span>
                </a>
              ))}
            </nav>

          </main>
        )}
        {!activeSheet && !activePage && <SiteFooter navigate={navigate} />}

        {/* ── Worksheet Content ── */}
        {ActiveComponent && (
          <main className="worksheet-main" role="tabpanel" aria-label={activeInfo?.label}>
            <div className="worksheet-topbar no-print">
              <h2 className="worksheet-title" style={{ color: activeInfo?.color }}>
                {activeInfo && <activeInfo.Icon size={22} stroke={1.8} />}
                {activeInfo?.label}
              </h2>
            </div>
            <div className="worksheet-content">
              <ActiveComponent />
              {!activeInfo?.interactive && <PrintCta />}
            </div>
          </main>
        )}
        </div>
      </div>
    </LocaleContext.Provider>
  )
}
