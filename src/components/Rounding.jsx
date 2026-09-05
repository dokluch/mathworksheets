import { useMemo, useState } from 'react'
import { IconRefresh, IconPrinter } from '@tabler/icons-react'
import { usePersistedState } from '../hooks/usePersistedState'
import { trackEvent } from '../lib/analytics'
import { useT } from '../i18n/context'
import './Rounding.css'

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateRoundingProblem(place) {
  // place: 10, 100, or 1000
  let n
  if (place === 10) {
    // Two-digit numbers: round 12→10, 67→70
    do { n = randInt(1, 99) } while (n % 10 === 0)
  } else if (place === 100) {
    // Three-digit numbers: round 234→200, 678→700
    do { n = randInt(10, 999) } while (n % 100 === 0)
  } else {
    // Four-digit numbers: round 1234→1000, 6789→7000
    do { n = randInt(100, 9999) } while (n % 1000 === 0)
  }

  const rounded = Math.round(n / place) * place
  return { n, place, rounded }
}

const PLACES = [10, 100, 1000]

export default function Rounding() {
  const t = useT()
  const [place, setPlace] = usePersistedState('rounding', 'place', 10)
  const [columns, setColumns] = usePersistedState('rounding', 'columns', 3)
  const [seed, setSeed] = useState(0)

  const problemCount = columns === 2 ? 20 : columns === 3 ? 30 : 40

  const problems = useMemo(() => {
    void seed
    const items = []
    for (let i = 0; i < problemCount; i++) {
      items.push(generateRoundingProblem(place))
    }
    return items
  }, [place, problemCount, seed])

  return (
    <div className="tool-panel">
      <div className="controls no-print">
        <div className="control-row">
          <label className="control-label">
            {t('rounding.roundTo')}
            <div className="btn-group" role="group" aria-label={t('rounding.roundTo')}>
              {PLACES.map(p => (
                <button
                  key={p}
                  className={`btn-toggle ${place === p ? 'active' : ''}`}
                  onClick={() => setPlace(p)}
                >
                  {t('rounding.nearest', { n: p })}
                </button>
              ))}
            </div>
          </label>

          <label className="control-label">
            {t('common.columns')}
            <div className="btn-group" role="group" aria-label={t('common.columns')}>
              {[2, 3, 4].map(c => (
                <button
                  key={c}
                  className={`btn-toggle ${columns === c ? 'active' : ''}`}
                  onClick={() => setColumns(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </label>
        </div>

        <div className="control-actions">
          <button className="btn btn-primary" onClick={() => { trackEvent('regenerate_worksheet', { worksheet_id: 'rounding' }); setSeed(s => s + 1) }}>
            <IconRefresh size={16} stroke={2} /> {t('common.regenerate')}
          </button>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <IconPrinter size={16} stroke={2} /> {t('common.print')}
          </button>
        </div>
      </div>

      <div className={`worksheet print-area cols-${columns}`}>
        <div className="worksheet-header">
          <div className="ws-title">
            {t('rounding.title')}
            <span className="ws-meta">
              {t('rounding.meta', { n: place })}
            </span>
          </div>
        </div>

        <div
          className="rounding-grid"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {problems.map((p, i) => (
            <div key={i} className="rounding-item">
              <span className="rounding-number">{String(p.n)}</span>
              <span className="rounding-arrow">≈</span>
              <span className="blank-slot" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
