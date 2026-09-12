import { usePersistedState } from '../hooks/usePersistedState'
import { useNotebookGrid } from '../hooks/useNotebookGrid'
import { useT } from '../i18n/context'
import { SettingsPanel, SettingRow, SegmentedControl, CheckboxOption, PanelActions } from './controls/SettingsPanel'
import { NOTATIONS, PRESETS, SHEET_SPACING, generateProblems, sheetShape } from '../lib/longDivision'
import './ColumnAddition.css'
import './ColumnDivision.css'
import WorksheetHeader from './WorksheetHeader'
import { useSheetSet } from '../hooks/useSheetSet'
import SheetCopies from './SheetCopies'
import AnswerKey from './AnswerKey'

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

  const activePreset = PRESETS.find(item => item.value === preset) || PRESETS[0]
  const { dividendDigits, divisorDigits } = activePreset
  const activeNotation = NOTATIONS.includes(notation) ? notation : NOTATIONS[0]
  // The stored column count is kept when a frame is too wide for it, so the
  // option comes back when the frame narrows again.
  const shape = sheetShape({ notation: activeNotation, dividendDigits, divisorDigits, columns })
  const frame = shape.frame.layout
  const presetLabel = (a, b) => t('coldiv.preset', { a, b })

  const { sheets, setSet, regenerate } = useSheetSet(
    rng => generateProblems(shape.count, dividendDigits, divisorDigits, allowRemainder, rng),
    [dividendDigits, divisorDigits, allowRemainder, shape.count],
  )

  const [sheetRef, sheetStyle] = useNotebookGrid({
    columns: shape.columns, cellsWide: shape.frame.cellsWide, rows: shape.frame.rows, ...SHEET_SPACING,
  })

  return (
    <div className="tool-panel">
      <SettingsPanel actions={<PanelActions worksheetId="coldiv" onRegenerate={regenerate} />}>
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
            value={shape.columns}
            onChange={setColumns}
            options={shape.columnOptions.map(c => ({ value: c, label: c }))}
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

      <SheetCopies sheets={sheets}>
        {({ set, data: problems }, primary) => (
          <div
            ref={primary ? sheetRef : undefined}
            className={`worksheet notebook-grid-bg colarith-notebook coldiv-notebook print-area cols-${shape.columns}`}
            style={sheetStyle}
          >
            <WorksheetHeader
              title={t('coldiv.title')}
              meta={t('coldiv.meta', { preset: presetLabel(dividendDigits, divisorDigits) })}
              stamp={String(set)}
              onStampChange={primary ? setSet : undefined}
            />

            <div className="colarith-grid">
              {problems.map((problem, idx) => (
                <div key={idx} className="colarith-item coldiv-item">
                  {renderProblem(problem, frame, t)}
                </div>
              ))}
            </div>
          </div>
        )}
      </SheetCopies>

      {answerKey && sheets.map(({ set, data: problems }, i) => (
        <AnswerKey
          key={i}
          title={t('coldiv.title')}
          stamp={String(set)}
          answers={problems.map(p => (
            p.remainder ? `${p.quotient} r${p.remainder}` : String(p.quotient)
          ))}
        />
      ))}
    </div>
  )
}
