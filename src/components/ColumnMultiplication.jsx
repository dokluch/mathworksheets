import { useMemo, useState } from 'react'
import { IconRefresh, IconPrinter } from '@tabler/icons-react'
import { usePersistedState } from '../hooks/usePersistedState'
import { trackEvent } from '../lib/analytics'
import './ColumnMultiplication.css'

const PRESETS = [
  { value: '3x2', label: '3 x 2 digits', aDigits: 3, bDigits: 2 },
  { value: '4x2', label: '4 x 2 digits', aDigits: 4, bDigits: 2 },
]

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateProblem(aDigits, bDigits) {
  const aMin = 10 ** (aDigits - 1)
  const aMax = 10 ** aDigits - 1
  const bMin = 10 ** (bDigits - 1)
  const bMax = 10 ** bDigits - 1

  const a = randInt(aMin, aMax)
  const b = randInt(bMin, bMax)

  const bDigitsArr = String(b).split('').reverse().map(Number)
  const partialProducts = bDigitsArr.map((digit, shift) => ({
    value: a * digit,
    shift,
  }))

  return {
    a,
    b,
    partialProducts,
    product: a * b,
  }
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

function renderDigitRow({ value, width, shift = 0, blank = false, className = '' }) {
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
  const widestPartial = Math.max(...problem.partialProducts.map(p => String(p.value).length + p.shift))
  const width = Math.max(String(problem.product).length, String(problem.a).length, String(problem.b).length, widestPartial)

  return (
    <div className="colarith-problem" aria-label={`${problem.a} times ${problem.b}`}>
      <div className="colarith-row">
        <span className="colarith-op" aria-hidden="true" />
        {renderDigitRow({ value: problem.a, width })}
      </div>

      <div className="colarith-row">
        <span className="colarith-op" aria-hidden="true">×</span>
        {renderDigitRow({ value: problem.b, width })}
      </div>

      <div className="colarith-line" />

      {problem.partialProducts.map((partial, idx) => (
        <div key={idx} className="colarith-row colarith-partial-row">
          <span className="colarith-op" aria-hidden="true" />
          {renderDigitRow({ value: partial.value, width, shift: partial.shift, blank: true })}
        </div>
      ))}

      <div className="colarith-line colarith-line-final" />

      <div className="colarith-row">
        <span className="colarith-op" aria-hidden="true" />
        {renderDigitRow({ value: problem.product, width, blank: true, className: 'colarith-result-row' })}
      </div>
    </div>
  )
}

export default function ColumnMultiplication() {
  const [preset, setPreset] = usePersistedState('colmul', 'preset', '4x2')
  const [columns, setColumns] = usePersistedState('colmul', 'columns', 3)
  const [seed, setSeed] = useState(0)

  const activePreset = PRESETS.find(item => item.value === preset) || PRESETS[1]
  const problemCount = columns === 2 ? 12 : columns === 3 ? 15 : 18

  const problems = useMemo(() => {
    void seed
    const items = []
    for (let i = 0; i < problemCount; i++) {
      items.push(generateProblem(activePreset.aDigits, activePreset.bDigits))
    }
    return items
  }, [activePreset.aDigits, activePreset.bDigits, problemCount, seed])

  return (
    <div className="tool-panel">
      <div className="controls no-print">
        <div className="control-row">
          <label className="control-label">
            Number size
            <div className="btn-group" role="group" aria-label="Number size">
              {PRESETS.map(option => (
                <button
                  key={option.value}
                  className={`btn-toggle ${preset === option.value ? 'active' : ''}`}
                  onClick={() => setPreset(option.value)}
                >
                  {option.label}
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
        </div>

        <div className="control-actions">
          <button className="btn btn-primary" onClick={() => { trackEvent('regenerate_worksheet', { worksheet_id: 'colmul' }); setSeed(s => s + 1) }}>
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
            Column Multiplication
            <span className="ws-meta">
              long multiplication · {activePreset.label}
            </span>
          </div>
        </div>

        <div
          className="colarith-grid"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {problems.map((problem, idx) => (
            <div key={idx} className="colarith-item colarith-item-tall">
              {renderProblem(problem)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
