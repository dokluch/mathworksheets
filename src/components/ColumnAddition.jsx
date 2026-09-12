import { usePersistedState } from '../hooks/usePersistedState'
import { useNotebookGrid, problemsPerPage } from '../hooks/useNotebookGrid'
import { useT } from '../i18n/context'
import { SettingsPanel, SettingRow, SegmentedControl, CheckboxOption, PanelActions } from './controls/SettingsPanel'
import './ColumnAddition.css'
import WorksheetHeader from './WorksheetHeader'
import { useSheetSet } from '../hooks/useSheetSet'
import SheetCopies from './SheetCopies'
import AnswerKey from './AnswerKey'
import {
  DIGIT_PRESETS, OPS, PROBLEM_ROWS, SHEET_SPACING, digitColumns, generateSheet,
} from '../lib/columnArithmetic'

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

/** U+2212, the minus the rest of the site sets; the hyphen is a different glyph. */
const SIGNS = { add: '+', subtract: '−' }

// Every problem uses digits + 1 columns (room for a final carry) so columns line up on the grid.
function renderProblem(problem, width) {
  const sign = SIGNS[problem.op]
  return (
    <div className="colarith-problem" aria-label={`${problem.a} ${sign} ${problem.b}`}>
      <div className="colarith-row">
        <span className="colarith-op" aria-hidden="true" />
        {renderDigitRow({ value: problem.a, width })}
      </div>

      <div className="colarith-row">
        <span className="colarith-op" aria-hidden="true">{sign}</span>
        {renderDigitRow({ value: problem.b, width })}
      </div>

      <div className="colarith-line" />

      <div className="colarith-row">
        <span className="colarith-op" aria-hidden="true" />
        {renderDigitRow({ value: problem.result, width, blank: true, className: 'colarith-result-row' })}
      </div>
    </div>
  )
}

/** The sheet is named for what it is set to do, so the print carries the right head. */
const TITLE_KEY = { add: 'coladd.title', subtract: 'coladd.titleSubtract', mixed: 'coladd.titleMixed' }

export default function ColumnAddition() {
  const t = useT()
  const [digits, setDigits] = usePersistedState('coladd', 'digits', 3)
  // Addition is the default, so a sheet that was set up before subtraction
  // existed opens exactly as it was left.
  const [op, setOp] = usePersistedState('coladd', 'op', 'add')
  const [columns, setColumns] = usePersistedState('coladd', 'columns', 3)
  const [preferCarry, setPreferCarry] = usePersistedState('coladd', 'preferCarry', true)
  const [answerKey, setAnswerKey] = usePersistedState('coladd', 'answerKey', false)

  const activeOp = OPS.includes(op) ? op : OPS[0]
  // Rows: two operands and the result. Problems are short, so they sit one
  // blank row apart (the next problem's carry row) and fill one printed page.
  const rows = PROBLEM_ROWS
  const problemCount = problemsPerPage({ columns, rows, ...SHEET_SPACING })
  const width = digitColumns(digits)
  const [sheetRef, sheetStyle] = useNotebookGrid({ columns, cellsWide: width + 1, rows, ...SHEET_SPACING })
  const title = t(TITLE_KEY[activeOp])

  const { sheets, setSet, regenerate } = useSheetSet(
    rng => generateSheet({ count: problemCount, digits, preferCarry, op: activeOp }, rng),
    [digits, problemCount, preferCarry, activeOp],
  )

  return (
    <div className="tool-panel">
      <SettingsPanel actions={<PanelActions worksheetId="coladd" onRegenerate={regenerate} />}>
        <SettingRow label={t('common.operation')}>
          <SegmentedControl
            value={activeOp}
            onChange={setOp}
            options={[
              { value: 'add', label: '+' },
              { value: 'subtract', label: '−' },
              { value: 'mixed', label: '+ / −' },
            ]}
          />
        </SettingRow>
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
              title={title}
              meta={t('coladd.meta', { d: digits })}
              stamp={String(set)}
              onStampChange={primary ? setSet : undefined}
            />

            <div className="colarith-grid">
              {problems.map((problem, idx) => (
                <div key={idx} className="colarith-item">
                  {renderProblem(problem, width)}
                </div>
              ))}
            </div>
          </div>
        )}
      </SheetCopies>

      {answerKey && sheets.map(({ set, data: problems }, i) => (
        <AnswerKey
          key={i}
          title={title}
          stamp={String(set)}
          answers={problems.map(p => String(p.result))}
        />
      ))}
    </div>
  )
}
