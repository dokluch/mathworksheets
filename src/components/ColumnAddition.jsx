import { useMemo, useState } from 'react'
import { usePersistedState } from '../hooks/usePersistedState'
import { useNotebookGrid, problemsPerPage } from '../hooks/useNotebookGrid'
import { useT } from '../i18n/context'
import { SettingsPanel, SettingRow, SegmentedControl, CheckboxOption, PanelActions } from './controls/SettingsPanel'
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
      <SettingsPanel actions={<PanelActions worksheetId="coladd" onRegenerate={() => setSeed(s => s + 1)} />}>
        <SettingRow label={t('common.numberSize')}>
          <SegmentedControl
            value={digits}
            onChange={setDigits}
            options={DIGIT_PRESETS.map(d => ({ value: d, label: t('coladd.digitPreset', { d }) }))}
          />
        </SettingRow>
        <SettingRow label={t('common.columns')}>
          <SegmentedControl value={columns} onChange={setColumns} options={[2, 3, 4].map(c => ({ value: c, label: c }))} />
        </SettingRow>
        <SettingRow label={t('common.options')}>
          <CheckboxOption checked={preferCarry} onChange={setPreferCarry}>
            {t('coladd.preferCarry')}
          </CheckboxOption>
        </SettingRow>
      </SettingsPanel>

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
