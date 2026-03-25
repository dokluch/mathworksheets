import { IconGrid3x3, IconPlusMinus, IconRuler2, IconArrowsLeftRight, IconTargetArrow, IconTrendingUp, IconArrowLeft } from '@tabler/icons-react'
import { usePersistedState } from './hooks/usePersistedState'
import './App.css'
import MultiplicationTable from './components/MultiplicationTable'
import AddSubtract from './components/AddSubtract'
import Comparison from './components/Comparison'
import Rounding from './components/Rounding'
import Patterns from './components/Patterns'

const WORKSHEETS = [
  { id: 'multiply', label: 'Multiplication', desc: 'Times tables & grid practice', Icon: IconGrid3x3, color: '#2563eb' },
  { id: 'addsub', label: 'Add & Subtract', desc: 'Addition & subtraction drills', Icon: IconPlusMinus, color: '#059669' },
  { id: 'compare', label: 'Comparison', desc: 'Greater than, less than, equal', Icon: IconArrowsLeftRight, color: '#d97706' },
  { id: 'rounding', label: 'Rounding', desc: 'Round to nearest 10, 100, 1000', Icon: IconTargetArrow, color: '#dc2626' },
  { id: 'patterns', label: 'Patterns', desc: 'Number sequences & series', Icon: IconTrendingUp, color: '#7c3aed' },
]

const COMPONENTS = {
  multiply: MultiplicationTable,
  addsub: AddSubtract,
  compare: Comparison,
  rounding: Rounding,
  patterns: Patterns,
}

export default function App() {
  const [activeSheet, setActiveSheet] = usePersistedState('app', 'activeTab', null)

  const ActiveComponent = activeSheet ? COMPONENTS[activeSheet] : null
  const activeInfo = WORKSHEETS.find(w => w.id === activeSheet)

  return (
    <div className={`app ${activeSheet ? 'has-active' : 'catalog-only'}`}>
      {/* ── Catalog / Sidebar ── */}
      <aside className={`catalog no-print ${activeSheet ? 'catalog--sidebar' : 'catalog--full'}`}>
        <header className="catalog-header">
          {activeSheet && (
            <button className="back-btn" onClick={() => setActiveSheet(null)}>
              <IconArrowLeft size={18} stroke={2} />
              <span className="back-btn-label">All sheets</span>
            </button>
          )}
          {!activeSheet && (
            <div className="catalog-brand">
              <h1 className="catalog-title">
                <IconRuler2 size={28} stroke={2} />
                Math Worksheets
              </h1>
              <p className="catalog-subtitle">Printable practice sheets for grades 1–3</p>
            </div>
          )}
        </header>

        <nav className={`catalog-grid ${activeSheet ? 'catalog-grid--compact' : ''}`}>
          {WORKSHEETS.map(ws => (
            <button
              key={ws.id}
              className={`catalog-card ${activeSheet === ws.id ? 'catalog-card--active' : ''}`}
              onClick={() => setActiveSheet(ws.id)}
              style={{ '--card-color': ws.color }}
            >
              <span className="catalog-card-icon">
                <ws.Icon size={activeSheet ? 20 : 32} stroke={1.6} />
              </span>
              <span className="catalog-card-text">
                <span className="catalog-card-label">{ws.label}</span>
                {!activeSheet && <span className="catalog-card-desc">{ws.desc}</span>}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Worksheet Content ── */}
      {ActiveComponent && (
        <main className="worksheet-main">
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
