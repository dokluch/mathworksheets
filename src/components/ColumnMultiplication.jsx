import { usePersistedState } from '../hooks/usePersistedState'
import { useNotebookGrid, problemsPerPage } from '../hooks/useNotebookGrid'
import { useT } from '../i18n/context'
import { SettingsPanel, SettingRow, SegmentedControl, CheckboxOption, PanelActions } from './controls/SettingsPanel'
import './ColumnMultiplication.css'
import WorksheetHeader from './WorksheetHeader'
import { useSheetSet } from '../hooks/useSheetSet'
import SheetCopies from './SheetCopies'
import AnswerKey from './AnswerKey'
import { PRESETS, digitColumns, generateSheet, problemRows } from '../lib/columnMultiplication'

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
  const [answerKey, setAnswerKey] = usePersistedState('colmul', 'answerKey', false)

  // 4 × 2 is the default and the fallback: a stored value from an older build,
  // or one we have since dropped, opens the sheet the catalog copy describes
  // rather than whichever preset happens to sit last in the list.
  const activePreset = PRESETS.find(item => item.value === preset) || PRESETS.find(item => item.value === '4x2')
  const { aDigits, bDigits } = activePreset
  const rows = problemRows(bDigits)
  // Exactly one printed page.
  const problemCount = problemsPerPage({ columns, rows })
  const presetLabel = (a, b) => t('colmul.preset', { a, b })

  const { sheets, setSet, regenerate } = useSheetSet(
    rng => generateSheet({ count: problemCount, aDigits, bDigits }, rng),
    [aDigits, bDigits, problemCount],
  )

  const width = digitColumns(aDigits, bDigits)
  const [sheetRef, sheetStyle] = useNotebookGrid({ columns, cellsWide: width + 1, rows })

  return (
    <div className="tool-panel">
      <SettingsPanel actions={<PanelActions worksheetId="colmul" onRegenerate={regenerate} />}>
        <SettingRow label={t('common.numberSize')}>
          <SegmentedControl
            value={preset}
            onChange={setPreset}
            options={PRESETS.map(option => ({ value: option.value, label: presetLabel(option.aDigits, option.bDigits) }))}
          />
        </SettingRow>
        <SettingRow label={t('common.columns')}>
          <SegmentedControl value={columns} onChange={setColumns} options={[2, 3, 4].map(c => ({ value: c, label: c }))} />
        </SettingRow>
        <SettingRow label={t('common.options')}>
          <CheckboxOption checked={answerKey} onChange={setAnswerKey}>
            {t('common.answerKeyOption')}
          </CheckboxOption>
        </SettingRow>
      </SettingsPanel>

      <SheetCopies sheets={sheets}>
        {({ set, data: problems }, primary) => (
          <div
            ref={primary ? sheetRef : undefined}
            className={`worksheet notebook-grid-bg colarith-notebook print-area cols-${columns}`}
            style={sheetStyle}
          >
            <WorksheetHeader
              title={t('colmul.title')}
              meta={t('colmul.meta', { preset: presetLabel(aDigits, bDigits) })}
              stamp={String(set)}
              onStampChange={primary ? setSet : undefined}
            />

            <div className="colarith-grid">
              {problems.map((problem, idx) => (
                <div key={idx} className="colarith-item">
                  {renderProblem(problem, width, t)}
                </div>
              ))}
            </div>
          </div>
        )}
      </SheetCopies>

      {answerKey && sheets.map(({ set, data: problems }, i) => (
        <AnswerKey
          key={i}
          title={t('colmul.title')}
          stamp={String(set)}
          answers={problems.map(p => String(p.product))}
        />
      ))}
    </div>
  )
}
