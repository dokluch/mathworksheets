import { useMemo, useState } from 'react'
import { IconRefresh, IconPrinter } from '@tabler/icons-react'
import { usePersistedState } from '../hooks/usePersistedState'
import { useNotebookGrid, problemsPerPage } from '../hooks/useNotebookGrid'
import { trackEvent } from '../lib/analytics'
import { useT } from '../i18n/context'
import './ColumnAddition.css'

const DIGIT_PRESETS = [2, 3, 4]

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function hasCarry(a, b) {
  let x = a
  let y = b
  while (x > 0 || y > 0) {
    if ((x % 10) + (y % 10) >= 10) return true
    x = Math.floor(x / 10)
    y = Math.floor(y / 10)
  }
  return false
}

function generateProblem(digits, preferCarry) {
  const min = 10 ** (digits - 1)
  const max = 10 ** digits - 1

  for (let attempt = 0; attempt < 40; attempt++) {
    const a = randInt(min, max)
    const b = randInt(min, max)
    if (!preferCarry || hasCarry(a, b)) {
      return { a, b, sum: a + b }
    }
  }

  const a = randInt(min, max)
  const b = randInt(min, max)
  return { a, b, sum: a + b }
}

function buildCells(value, width, shift = 0) {
  const text = String(value)
  const cells = Array.from({ length: width }, () => '')
  const start = width - text.length - shift
  for (let i = 0; i < text.length; i++) {
    const pos = start + i
    if (pos >= 0 && pos < width) cells[pos] = text[i]
  }
  return cells
}

function renderDigitRow({ value, width, className = '', shift = 0, blank = false }) {
  const cells = buildCells(value, width, shift)
  return (
    <div className={`colarith-digit-row ${className}`.trim()}>
      {cells.map((cell, idx) => (
        <span key={idx} className={`colarith-cell ${cell ? '' : 'colarith-cell-empty'}`}>
          {cell ? (blank ? <span className="colarith-blank" /> : cell) : ''}
        </span>
      ))}
    </div>
  )
}

// Every problem uses digits + 1 columns (room for a final carry) so columns line up on the grid.
function renderProblem(problem, width) {
  return (
    <div className="colarith-problem" aria-label={`${problem.a} + ${problem.b}`}>
      <div className="colarith-row">
        <span className="colarith-op" aria-hidden="true" />
        {renderDigitRow({ value: problem.a, width })}
      </div>

      <div className="colarith-row">
        <span className="colarith-op" aria-hidden="true">+</span>
        {renderDigitRow({ value: problem.b, width })}
      </div>

      <div className="colarith-line" />

      <div className="colarith-row">
        <span className="colarith-op" aria-hidden="true" />
        {renderDigitRow({ value: problem.sum, width, blank: true, className: 'colarith-result-row' })}
      </div>
    </div>
  )
}

export default function ColumnAddition() {
  const t = useT()
  const [digits, setDigits] = usePersistedState('coladd', 'digits', 3)
  const [columns, setColumns] = usePersistedState('coladd', 'columns', 3)
  const [preferCarry, setPreferCarry] = usePersistedState('coladd', 'preferCarry', true)
  const [seed, setSeed] = useState(0)

  // Rows: two addends and the sum. Problems are short, so they sit one blank
  // row apart (the next problem's carry row) and fill exactly one printed page.
  const rows = 3
  const spacing = { rowGap: 0, headerGap: 0 }
  const problemCount = problemsPerPage({ columns, rows, ...spacing })
  const width = digits + 1
  const [sheetRef, sheetStyle] = useNotebookGrid({ columns, cellsWide: width + 1, rows, ...spacing })

  const problems = useMemo(() => {
    void seed
    const items = []
    for (let i = 0; i < problemCount; i++) {
      // Keep mostly carry practice, but include occasional no-carry problems for variety.
      const requireCarry = preferCarry && randInt(1, 100) <= 75
      items.push(generateProblem(digits, requireCarry))
    }
    return items
  }, [digits, problemCount, seed, preferCarry])

  return (
    <div className="tool-panel">
      <div className="controls no-print">
        <div className="control-row">
          <label className="control-label">
            {t('common.numberSize')}
            <div className="btn-group" role="group" aria-label={t('common.numberSize')}>
              {DIGIT_PRESETS.map(d => (
                <button
                  key={d}
                  className={`btn-toggle ${digits === d ? 'active' : ''}`}
                  onClick={() => setDigits(d)}
                >
                  {t('coladd.digitPreset', { d })}
                </button>
              ))}
            </div>
          </label>

          <label className="control-label">
            {t('common.columns')}
            <div className="btn-group" role="group" aria-label={t('common.columns')}>
              {[2, 3, 4].map(value => (
                <button
                  key={value}
                  className={`btn-toggle ${columns === value ? 'active' : ''}`}
                  onClick={() => setColumns(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={preferCarry}
              onChange={event => setPreferCarry(event.target.checked)}
            />
            {t('coladd.preferCarry')}
          </label>
        </div>

        <div className="control-actions">
          <button className="btn btn-primary" onClick={() => { trackEvent('regenerate_worksheet', { worksheet_id: 'coladd' }); setSeed(s => s + 1) }}>
            <IconRefresh size={16} stroke={2} /> {t('common.regenerate')}
          </button>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <IconPrinter size={16} stroke={2} /> {t('common.print')}
          </button>
        </div>
      </div>

      <div
        ref={sheetRef}
        className={`worksheet notebook-grid-bg colarith-notebook print-area cols-${columns}`}
        style={sheetStyle}
      >
        <div className="worksheet-header">
          <div className="ws-title">
            {t('coladd.title')}
            <span className="ws-meta">
              {t('coladd.meta', { d: digits })}
            </span>
          </div>
        </div>

        <div className="colarith-grid">
          {problems.map((problem, idx) => (
            <div key={idx} className="colarith-item">
              {renderProblem(problem, width)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
