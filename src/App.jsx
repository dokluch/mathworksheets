import { useEffect, useCallback, useMemo, useState } from 'react'
import { IconGrid3x3, IconPlusMinus, IconArrowsLeftRight, IconTargetArrow, IconTrendingUp, IconArrowLeft, IconEqual, IconColumns3, IconCalculator, IconDivide, IconMathXDivideY, IconMathSymbols, IconPuzzle } from '@tabler/icons-react'
import { usePersistedState, getPersistedTab } from './hooks/usePersistedState'
import { useRoute, sheetIdToPath } from './hooks/useRoute'
import { worksheetRoute, gradeLevelText, gradeNumbers } from './seo/render'
import { findWorksheetById } from './worksheets'
import { trackEvent, settingsToParams } from './lib/analytics'
import { t as translate, localizedWorksheets, DEFAULT_LOCALE } from './i18n/index.js'
import { LocaleContext } from './i18n/context.js'
import './App.css'
import LanguageSwitcher from './components/LanguageSwitcher'
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'
import PrintCta from './components/PrintCta'
import PrintFooter from './components/PrintFooter'
import StaticPage from './components/StaticPage'
import SheetThumb from './components/SheetThumb'
import GradeFilter from './components/GradeFilter'
import { ALL_GRADES, isGrade } from './lib/grades'
import { SheetStateContext } from './components/SheetState'
import WorksheetDetails from './components/WorksheetDetails'
import MultiplicationTable from './components/MultiplicationTable'
import AddSubtract from './components/AddSubtract'
import Comparison from './components/Comparison'
import Rounding from './components/Rounding'
import Patterns from './components/Patterns'
import EquationExplorer from './components/EquationExplorer'
import ColumnAddition from './components/ColumnAddition'
import ColumnMultiplication from './components/ColumnMultiplication'
import Division from './components/Division'
import ColumnDivision from './components/ColumnDivision'
import OrderOfOperations from './components/OrderOfOperations'
import Bongard from './components/Bongard'

/*
 * Icons for the dense contexts — the desktop sidebar and the mobile chip row —
 * where a sheet preview would shrink into mush. They carry the subject colour
 * as a tint, so the colour is a second cue rather than the only one.
 * The full catalog keeps the real sheet previews; an icon there would be the
 * stock-illustration-in-a-tinted-square this redesign exists to remove.
 */
const ICONS = {
  multiply: IconGrid3x3,
  addsub: IconPlusMinus,
  coladd: IconColumns3,
  colmul: IconCalculator,
  divide: IconMathXDivideY,
  coldiv: IconDivide,
  compare: IconArrowsLeftRight,
  rounding: IconTargetArrow,
  patterns: IconTrendingUp,
  order: IconMathSymbols,
  bongard: IconPuzzle,
  eqexplore: IconEqual,
}

const COMPONENTS = {
  multiply: MultiplicationTable,
  addsub: AddSubtract,
  coladd: ColumnAddition,
  colmul: ColumnMultiplication,
  divide: Division,
  coldiv: ColumnDivision,
  compare: Comparison,
  rounding: Rounding,
  patterns: Patterns,
  order: OrderOfOperations,
  bongard: Bongard,
  eqexplore: EquationExplorer,
}

export default function App() {
  const [persistedLocale, setPersistedLocale] = usePersistedState('app', 'locale', DEFAULT_LOCALE)
  const [activeSheet, navigate, activePage, locale, setLocale, pathInLocale] = useRoute(persistedLocale)

  const localeCtx = useMemo(() => ({ locale, t: (key, params) => translate(locale, key, params) }), [locale])
  const t = localeCtx.t

  // A worksheet with impossible settings has nothing to print; the shell hides
  // its Print call to action rather than offering a blank page.
  // Reset is owned by useReportEmpty's cleanup, which fires when the previous
  // worksheet unmounts on a sheet change.
  const [sheetEmpty, setSheetEmpty] = useState(false)
  // How many different sheets one Print deals (the panel's Copies field).
  // Shell state so it survives switching sheets within a visit; never persisted.
  const [copies, setCopies] = useState(1)
  const sheetState = useMemo(
    () => ({ empty: sheetEmpty, setEmpty: setSheetEmpty, copies, setCopies }),
    [sheetEmpty, copies],
  )

  // Catalog data lives in src/worksheets.js (shared with SEO/build), translated per locale; icons are UI-only.
  const worksheets = useMemo(
    () => localizedWorksheets(locale).map(ws => ({ ...ws, desc: ws.shortDesc, Icon: ICONS[ws.id] })),
    [locale],
  )

  // Which grade the landing catalog is narrowed to. Remembered per device like the
  // other settings: a household picks for the same child most visits. A value left
  // by an older build, or a grade that no longer exists, opens the full catalog.
  const [persistedGrade, setGrade] = usePersistedState('app', 'grade', ALL_GRADES)
  const grade = isGrade(persistedGrade) ? persistedGrade : ALL_GRADES
  const selectGrade = useCallback(next => {
    trackEvent('select_grade', { grade: next })
    setGrade(next)
  }, [setGrade])

  // The filter narrows the landing grid only; the sidebar on a worksheet page
  // stays whole, so no sheet is ever unreachable from where a child is working.
  const shownWorksheets = useMemo(
    () => (grade === ALL_GRADES ? worksheets : worksheets.filter(ws => gradeNumbers(ws.grades).includes(Number(grade)))),
    [worksheets, grade],
  )

  // One listener catches both the Print button and Cmd/Ctrl+P.
  useEffect(() => {
    if (!activeSheet) return undefined
    const onBeforePrint = () => {
      trackEvent('print_worksheet', { worksheet_id: activeSheet, copies, ...settingsToParams(getPersistedTab(activeSheet)) })
    }
    window.addEventListener('beforeprint', onBeforePrint)
    return () => window.removeEventListener('beforeprint', onBeforePrint)
  }, [activeSheet, copies])

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

  // On phones the sheet list is a horizontal rail: bring the open sheet into
  // view, or the rail shows Multiplication and Add & Subtract and no
  // indication of which sheet is actually open.
  useEffect(() => {
    if (!activeSheet) return
    const el = document.querySelector('.catalog-grid--compact .catalog-card--active')
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ inline: 'center', block: 'nearest' })
    }
  }, [activeSheet])

  // Same route object the prerender step uses, so WorksheetDetails renders the
  // identical HTML and the crawlable copy survives hydration.
  const activeRoute = useMemo(
    () => (activeSheet ? worksheetRoute(findWorksheetById(activeSheet), locale) : null),
    [activeSheet, locale],
  )

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
        {/* On a worksheet page this skips 12+ header and sidebar stops. */}
        <a className="skip-link no-print" href="#main">{t('app.skipToContent')}</a>
        <SiteHeader navigate={navigate} isHome={!activeSheet && !activePage}>
          {switcher}
        </SiteHeader>
        <div className="app-body">

        {/* ── Static page (About, Privacy, Terms) ── */}
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

            {/* A list of links, described as one. It used to claim
                role="tablist" without the arrow-key behaviour tabs owe. */}
            <nav className="catalog-grid catalog-grid--compact" aria-label={t('app.worksheetTypes')}>
              {worksheets.map(ws => (
                <a
                  key={ws.id}
                  aria-current={activeSheet === ws.id ? 'page' : undefined}
                  className={`catalog-card ${activeSheet === ws.id ? 'catalog-card--active' : ''}`}
                  style={{ '--card-color': ws.color }}
                  {...cardLink(ws)}
                >
                  <span className="catalog-card-icon" aria-hidden="true">
                    <ws.Icon size={19} stroke={1.7} />
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
          <main className="catalog no-print catalog--full" id="main">
            <p className="catalog-hero">{t('app.subtitle')}</p>

            <GradeFilter value={grade} onChange={selectGrade} count={shownWorksheets.length} />

            <nav className="catalog-grid" aria-label={t('app.worksheetTypes')}>
              {shownWorksheets.map(ws => (
                <a
                  key={ws.id}
                  className="catalog-card"
                  style={{ '--card-color': ws.color }}
                  {...cardLink(ws)}
                >
                  <span className="catalog-card-sheet">
                    <SheetThumb id={ws.id} />
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
          <main className="worksheet-main" id="main" aria-label={activeInfo?.label}>
            <div className="worksheet-topbar no-print">
              <h1 className="worksheet-title" style={{ '--card-color': activeInfo?.color }}>
                {activeInfo && (
                  <span className="worksheet-title-icon" aria-hidden="true">
                    <activeInfo.Icon size={22} stroke={1.8} />
                  </span>
                )}
                {activeInfo && t('seo.worksheetHeading', { label: activeInfo.label })}
              </h1>
              {activeInfo && (
                <p className="worksheet-subtitle">
                  {activeInfo.shortDesc} · {gradeLevelText(activeInfo, locale)}
                </p>
              )}
            </div>
            <div className="worksheet-content">
              <SheetStateContext.Provider value={sheetState}>
                <ActiveComponent />
                {!activeInfo?.interactive && !sheetEmpty && <PrintCta />}
                {activeInfo?.interactive && (
                  <p className="eq-print-note print-only">{t('common.screenOnly')}</p>
                )}
              </SheetStateContext.Provider>
            </div>
            <PrintFooter />
            {activeRoute && <WorksheetDetails route={activeRoute} navigate={navigate} />}
          </main>
        )}
        </div>
      </div>
    </LocaleContext.Provider>
  )
}
