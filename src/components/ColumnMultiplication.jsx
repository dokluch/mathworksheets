import { useMemo, useState } from 'react'
import { IconRefresh, IconPrinter } from '@tabler/icons-react'
import { usePersistedState } from '../hooks/usePersistedState'
import { useNotebookGrid } from '../hooks/useNotebookGrid'
import { trackEvent } from '../lib/analytics'
import { useT } from '../i18n/context'
import './ColumnMultiplication.css'

const PRESETS = [
  { value: '2x2', aDigits: 2, bDigits: 2 },
  { value: '3x2', aDigits: 3, bDigits: 2 },
  { value: '4x2', aDigits: 4, bDigits: 2 },
]

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** A number whose digits are all 1–9, so every partial product fills a full row. */
function randNoZeroDigits(digits) {
  let n = 0
  for (let i = 0; i < digits; i++) n = n * 10 + randInt(1, 9)
  return n
}

function generateProblem(aDigits, bDigits) {
  const aMin = 10 ** (aDigits - 1)
  const aMax = 10 ** aDigits - 1

  const a = randInt(aMin, aMax)
  // A zero digit in the multiplier would give a partial product of "0" with a
  // single placeholder in an otherwise blank row, which reads as a mistake.
  const b = randNoZeroDigits(bDigits)

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

// Every problem of a preset is laid out on the same number of digit columns
// (a product of an m-digit by an n-digit number has at most m + n digits, and
// so does the widest shifted partial product), so columns line up on the grid.
function digitColumns(aDigits, bDigits) {
  return aDigits + bDigits
}

function renderProblem(problem, width, t) {
  return (
    <div className="colarith-problem" aria-label={t('colmul.problemAria', { a: problem.a, b: problem.b })}>
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
        <div key={idx} className="colarith-row">
          <span className="colarith-op" aria-hidden="true" />
          {renderDigitRow({ value: partial.value, width, shift: partial.shift, blank: true })}
        </div>
      ))}

      <div className="colarith-line" />

      <div className="colarith-row">
        <span className="colarith-op" aria-hidden="true" />
        {renderDigitRow({ value: problem.product, width, blank: true, className: 'colarith-result-row' })}
      </div>
    </div>
  )
}

export default function ColumnMultiplication() {
  const t = useT()
  const [preset, setPreset] = usePersistedState('colmul', 'preset', '4x2')
  const [columns, setColumns] = usePersistedState('colmul', 'columns', 3)
  const [seed, setSeed] = useState(0)

  const activePreset = PRESETS.find(item => item.value === preset) || PRESETS[PRESETS.length - 1]
  const problemCount = columns === 2 ? 12 : columns === 3 ? 15 : 18
  const { aDigits, bDigits } = activePreset
  const presetLabel = (a, b) => t('colmul.preset', { a, b })

  const problems = useMemo(() => {
    void seed
    const items = []
    for (let i = 0; i < problemCount; i++) {
      items.push(generateProblem(aDigits, bDigits))
    }
    return items
  }, [aDigits, bDigits, problemCount, seed])

  const width = digitColumns(aDigits, bDigits)
  // Rows: multiplicand, multiplier, one partial product per multiplier digit, product.
  const [sheetRef, sheetStyle] = useNotebookGrid({ columns, cellsWide: width + 1, rows: 3 + bDigits })

  return (
    <div className="tool-panel">
      <div className="controls no-print">
        <div className="control-row">
          <label className="control-label">
            {t('common.numberSize')}
            <div className="btn-group" role="group" aria-label={t('common.numberSize')}>
              {PRESETS.map(option => (
                <button
                  key={option.value}
                  className={`btn-toggle ${preset === option.value ? 'active' : ''}`}
                  onClick={() => setPreset(option.value)}
                >
                  {presetLabel(option.aDigits, option.bDigits)}
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
        </div>

        <div className="control-actions">
          <button className="btn btn-primary" onClick={() => { trackEvent('regenerate_worksheet', { worksheet_id: 'colmul' }); setSeed(s => s + 1) }}>
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
            {t('colmul.title')}
            <span className="ws-meta">
              {t('colmul.meta', { preset: presetLabel(aDigits, bDigits) })}
            </span>
          </div>
        </div>

        <div className="colarith-grid">
          {problems.map((problem, idx) => (
            <div key={idx} className="colarith-item">
              {renderProblem(problem, width, t)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
