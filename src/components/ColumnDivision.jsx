import { useMemo, useState } from 'react'
import { usePersistedState } from '../hooks/usePersistedState'
import { useNotebookGrid, problemsPerPage, notebookLayout, PRINT_WIDTH, PRINT_SQUARE } from '../hooks/useNotebookGrid'
import { useT } from '../i18n/context'
import { SettingsPanel, SettingRow, SegmentedControl, CheckboxOption, PanelActions } from './controls/SettingsPanel'
import { frameLayout, generateProblems } from '../lib/longDivision'
import './ColumnDivision.css'
import WorksheetHeader from './WorksheetHeader'
import { setStamp } from '../lib/setStamp'
import AnswerKey from './AnswerKey'

const PRESETS = [
  { value: '3x1', dividendDigits: 3, divisorDigits: 1 },
  { value: '4x1', dividendDigits: 4, divisorDigits: 1 },
  { value: '4x2', dividendDigits: 4, divisorDigits: 2 },
]

const NOTATIONS = ['bracket', 'corner']
const COLUMN_OPTIONS = [2, 3, 4]

/** Column of the leftmost digit of a `count`-digit number inside a block. */
function blockStart(block, count) {
  return block.align === 'right' ? block.col + (block.width ?? count) - count : block.col
}

function digitCells(value, block, key) {
  const text = String(value)
  const start = blockStart(block, text.length)
  return text.split('').map((char, idx) => (
    <span
      key={`${key}${idx}`}
      className="colarith-cell"
      style={{ gridColumn: start + idx + 1, gridRow: block.row + 1 }}
    >
      {char}
    </span>
  ))
}

function renderProblem(problem, frame, t) {
  const boxes = String(problem.quotient).length
  const style = {
    '--cd-cols': frame.cols,
    '--cd-rows': frame.rows,
    '--cd-vx': frame.vRule.x,
    '--cd-vy0': frame.vRule.y0,
    '--cd-vy1': frame.vRule.y1,
    '--cd-hy': frame.hRule.y,
    '--cd-hx0': frame.hRule.x0,
    '--cd-hx1': frame.hRule.x1,
  }

  return (
    <div
      className={`coldiv-problem coldiv-${frame.notation}`}
      style={style}
      role="group"
      aria-label={t('coldiv.problemAria', { dividend: problem.dividend, divisor: problem.divisor })}
    >
      {/* Dividend before divisor in the DOM whichever side the grid paints them
          on, so the reading order matches the label. */}
      {digitCells(problem.dividend, frame.dividend, 'a')}
      {digitCells(problem.divisor, frame.divisor, 'b')}

      <span
        className="coldiv-quotient"
        role="group"
        aria-label={t('coldiv.quotientAria', { n: boxes })}
        style={{
          gridRow: frame.quotient.row + 1,
          gridColumn: `${blockStart(frame.quotient, boxes) + 1} / span ${boxes}`,
        }}
      >
        {Array.from({ length: boxes }, (_, idx) => (
          <span key={idx} className="colarith-cell" aria-hidden="true">
            <span className="colarith-blank" />
          </span>
        ))}
      </span>

      <span className="coldiv-rule coldiv-rule-v" aria-hidden="true" />
      <span className="coldiv-rule coldiv-rule-h" aria-hidden="true" />
    </div>
  )
}

/** True when `columns` problems of `cellsWide` squares still fit letter landscape at 1/4in. */
function fitsPrint(columns, cellsWide) {
  return !notebookLayout({
    width: PRINT_WIDTH,
    columns,
    cellsWide,
    square: PRINT_SQUARE,
    minSquare: PRINT_SQUARE,
  }).overflow
}

export default function ColumnDivision() {
  const t = useT()
  const [preset, setPreset] = usePersistedState('coldiv', 'preset', '3x1')
  // usePersistedState reads its default only in the useState initialiser and
  // writes on mount, so the locale's convention is frozen on the first visit
  // and an explicit choice wins from then on.
  const [notation, setNotation] = usePersistedState('coldiv', 'notation', t('coldiv.defaultNotation'))
  const [columns, setColumns] = usePersistedState('coldiv', 'columns', 3)
  const [allowRemainder, setAllowRemainder] = usePersistedState('coldiv', 'allowRemainder', false)
  const [answerKey, setAnswerKey] = usePersistedState('coldiv', 'answerKey', false)
  const [seed, setSeed] = useState(0)

  const activePreset = PRESETS.find(item => item.value === preset) || PRESETS[0]
  const { dividendDigits, divisorDigits } = activePreset
  const activeNotation = NOTATIONS.includes(notation) ? notation : NOTATIONS[0]
  const frame = useMemo(
    () => frameLayout(activeNotation, dividendDigits, divisorDigits),
    [activeNotation, dividendDigits, divisorDigits],
  )

  // Nine squares is the widest a frame can be and still print four to a row.
  // Every preset clears that today, but derive the options from the print
  // layout rather than hard-coding them, so a wider frame narrows the choice
  // instead of silently spilling onto a second page. The stored preference is
  // kept, so a dropped option comes back when the frame narrows again.
  const columnOptions = useMemo(() => COLUMN_OPTIONS.filter(c => fitsPrint(c, frame.cols)), [frame.cols])
  const activeColumns = columnOptions.includes(columns) ? columns : columnOptions[columnOptions.length - 1]

  // Frames are tall, so they sit directly under each other; the spare square
  // each item carries is the only separator. The one square below the header is
  // not decoration: a division frame grows *upward* into its quotient row
  // (.coldiv-item is flex-start, unlike the carry-space above a column sum), so
  // without it the first row's quotient boxes butt against the header rule. It
  // is free — rowsPerPage returns the same count for every preset and notation.
  const spacing = { rowGap: 0, headerGap: 1 }
  const problemCount = problemsPerPage({ columns: activeColumns, rows: frame.rows, ...spacing })
  const presetLabel = (a, b) => t('coldiv.preset', { a, b })

  const problems = useMemo(() => {
    void seed
    return generateProblems(problemCount, dividendDigits, divisorDigits, allowRemainder)
  }, [dividendDigits, divisorDigits, allowRemainder, problemCount, seed])

  const [sheetRef, sheetStyle] = useNotebookGrid({
    columns: activeColumns,
    cellsWide: frame.cols,
    rows: frame.rows,
    ...spacing,
  })

  return (
    <div className="tool-panel">
      <SettingsPanel actions={<PanelActions worksheetId="coldiv" onRegenerate={() => setSeed(s => s + 1)} />}>
        <SettingRow label={t('common.numberSize')}>
          <SegmentedControl
            value={activePreset.value}
            onChange={setPreset}
            options={PRESETS.map(option => ({
              value: option.value,
              label: presetLabel(option.dividendDigits, option.divisorDigits),
            }))}
          />
        </SettingRow>
        <SettingRow label={t('coldiv.notation')}>
          <SegmentedControl
            value={activeNotation}
            onChange={setNotation}
            options={NOTATIONS.map(value => ({ value, label: t(`coldiv.${value}`) }))}
          />
        </SettingRow>
        <SettingRow label={t('common.columns')}>
          <SegmentedControl
            value={activeColumns}
            onChange={setColumns}
            options={columnOptions.map(c => ({ value: c, label: c }))}
          />
        </SettingRow>
        <SettingRow label={t('common.options')}>
          <CheckboxOption checked={answerKey} onChange={setAnswerKey}>
            {t('common.answerKeyOption')}
          </CheckboxOption>
          <CheckboxOption checked={allowRemainder} onChange={setAllowRemainder}>
            {t('coldiv.allowRemainder')}
          </CheckboxOption>
        </SettingRow>
      </SettingsPanel>

      <div
        ref={sheetRef}
        className={`worksheet notebook-grid-bg colarith-notebook coldiv-notebook print-area cols-${activeColumns}`}
        style={sheetStyle}
      >
        <WorksheetHeader
          title={t('coldiv.title')}
          meta={t('coldiv.meta', { preset: presetLabel(dividendDigits, divisorDigits) })}
          stamp={setStamp(problems)}
        />

        <div className="colarith-grid">
          {problems.map((problem, idx) => (
            <div key={idx} className="colarith-item coldiv-item">
              {renderProblem(problem, frame, t)}
            </div>
          ))}
        </div>
      </div>

      {answerKey && (
        <AnswerKey
          title={t('coldiv.title')}
          stamp={setStamp(problems)}
          answers={problems.map(p => (
            p.remainder ? `${p.quotient} r${p.remainder}` : String(p.quotient)
          ))}
        />
      )}
    </div>
  )
}
