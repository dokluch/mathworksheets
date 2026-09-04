import { useMemo, useState } from 'react'
import { IconRefresh, IconPrinter } from '@tabler/icons-react'
import { usePersistedState } from '../hooks/usePersistedState'
import { trackEvent } from '../lib/analytics'
import './ColumnAddition.css'

const DIGIT_PRESETS = [
  { digits: 2, label: '2-digit' },
  { digits: 3, label: '3-digit' },
  { digits: 4, label: '4-digit' },
]

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

function renderProblem(problem) {
  const width = String(problem.sum).length

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
  const [digits, setDigits] = usePersistedState('coladd', 'digits', 3)
  const [columns, setColumns] = usePersistedState('coladd', 'columns', 3)
  const [preferCarry, setPreferCarry] = usePersistedState('coladd', 'preferCarry', true)
  const [seed, setSeed] = useState(0)

  const problemCount = columns === 2 ? 16 : columns === 3 ? 21 : 28

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
            Number size
            <div className="btn-group" role="group" aria-label="Number size">
              {DIGIT_PRESETS.map(preset => (
                <button
                  key={preset.digits}
                  className={`btn-toggle ${digits === preset.digits ? 'active' : ''}`}
                  onClick={() => setDigits(preset.digits)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </label>

          <label className="control-label">
            Columns
            <div className="btn-group" role="group" aria-label="Columns">
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
            Prefer carry practice
          </label>
        </div>

        <div className="control-actions">
          <button className="btn btn-primary" onClick={() => { trackEvent('regenerate_worksheet', { worksheet_id: 'coladd' }); setSeed(s => s + 1) }}>
            <IconRefresh size={16} stroke={2} /> Regenerate
          </button>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <IconPrinter size={16} stroke={2} /> Print
          </button>
        </div>
      </div>

      <div
        className={`worksheet notebook-grid-bg print-area cols-${columns}`}
        style={{ '--notebook-grid-size': '26px' }}
      >
        <div className="worksheet-header">
          <div className="ws-title">
            Column Addition
            <span className="ws-meta">
              {digits}-digit numbers
            </span>
          </div>
        </div>

        <div
          className="colarith-grid"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {problems.map((problem, idx) => (
            <div key={idx} className="colarith-item">
              {renderProblem(problem)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
