import { useEffect, useCallback } from 'react'
import { IconGrid3x3, IconPlusMinus, IconRuler2, IconArrowsLeftRight, IconTargetArrow, IconTrendingUp, IconArrowLeft, IconEqual, IconColumns3, IconCalculator } from '@tabler/icons-react'
import { usePersistedState, getPersistedTab } from './hooks/usePersistedState'
import { useRoute, sheetIdToPath } from './hooks/useRoute'
import { trackEvent, settingsToParams } from './lib/analytics'
import { WORKSHEETS as CATALOG } from './worksheets'
import { BRAND } from './seo/site'
import './App.css'
import SiteFooter from './components/SiteFooter'
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

// Catalog data lives in src/worksheets.js (shared with SEO/build); icons are UI-only.
const WORKSHEETS = CATALOG.map(ws => ({ ...ws, desc: ws.shortDesc, Icon: ICONS[ws.id] }))

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
  const [activeSheet, navigate, activePage] = useRoute(persistedSheet)

  // Keep "pick up where you left off" working across sessions. Reading a
  // static page (About, Privacy, …) must not forget the remembered sheet.
  useEffect(() => {
    if (!activePage) setPersistedSheet(activeSheet)
  }, [activeSheet, activePage, setPersistedSheet])

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

  const ActiveComponent = activeSheet ? COMPONENTS[activeSheet] : null
  const activeInfo = WORKSHEETS.find(w => w.id === activeSheet)

  const cardLink = (ws) => ({
    href: sheetIdToPath(ws.id),
    onClick: (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
      e.preventDefault()
      selectSheet(ws.id)
    },
  })

  return (
    <div className={`app ${activeSheet ? 'has-active' : 'catalog-only'}`}>
      {/* ── Static page (About, Privacy, Terms, Developers) ── */}
      {activePage ? (
        <>
          <StaticPage route={activePage} navigate={navigate} />
          <SiteFooter navigate={navigate} />
        </>
      ) : activeSheet ? (
        <aside className="catalog no-print catalog--sidebar">
          <header className="catalog-header">
            <a className="back-btn" href="/" onClick={(e) => { e.preventDefault(); navigate(null) }}>
              <IconArrowLeft size={18} stroke={2} />
              <span className="back-btn-label">All sheets</span>
            </a>
          </header>

          <nav className="catalog-grid catalog-grid--compact" role="tablist" aria-label="Worksheet types">
            {WORKSHEETS.map(ws => (
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
          <header className="catalog-header">
            <div className="catalog-brand">
              <h1 className="catalog-title">
                <IconRuler2 size={28} stroke={2} />
                {BRAND}
              </h1>
              <p className="catalog-subtitle">Printable math worksheets for grades 1–3</p>
            </div>
          </header>

          <nav className="catalog-grid" aria-label="Worksheet types">
            {WORKSHEETS.map(ws => (
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
          </div>
        </main>
      )}
    </div>
  )
}
