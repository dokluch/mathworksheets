import { usePersistedState } from '../hooks/usePersistedState'
import { useNotebookGrid } from '../hooks/useNotebookGrid'
import { useT } from '../i18n/context'
import { SettingsPanel, SettingRow, SegmentedControl, CheckboxOption, PanelActions } from './controls/SettingsPanel'
import './AddSubtract.css'
import './ColumnAddition.css'
import './Decimals.css'
import WorksheetHeader from './WorksheetHeader'
import { useSheetSet } from '../hooks/useSheetSet'
import SheetCopies from './SheetCopies'
import AnswerKey from './AnswerKey'
import { NOTATIONS, glyph } from '../lib/orderOfOperations'
import {
  INT_SQUARES, MARKS, MODES, OPS, PLACES, SHEET_SPACING,
  columnCells, formatDecimal, fracSquares, generateSheet, sheetShape,
} from '../lib/decimals'

/** U+2212, the minus the rest of the site sets. */
const SIGNS = { add: '+', sub: '−' }
const PLACE_KEYS = { one: 'decimals.placesOne', two: 'decimals.placesTwo', mixed: 'decimals.placesMixed' }
const ARIA_KEYS = { add: 'decimals.addAria', sub: 'decimals.subAria', mul: 'decimals.mulAria', div: 'decimals.divAria' }
const isMark = char => char === MARKS.point || char === MARKS.comma

/**
 * One square. The mark is printed on every row, the answer row included:
 * where the point sits is the thing the column is teaching, so it is given
 * rather than asked for. Every other answer square is a box.
 */
function Cell({ char, blank = false }) {
  if (!char) return <span className="colarith-cell colarith-cell-empty" />
  if (isMark(char)) return <span className="colarith-cell decimals-mark" aria-hidden="true">{char}</span>
  return <span className="colarith-cell">{blank ? <span className="colarith-blank" /> : char}</span>
}

function DigitRow({ cells, blank = false, className = '' }) {
  return (
    <div className={`colarith-digit-row ${className}`.trim()}>
      {cells.map((char, idx) => <Cell key={idx} char={char} blank={blank} />)}
    </div>
  )
}

function ColumnProblem({ p, places, mark, label }) {
  const frac = fracSquares(places)
  return (
    <div className="colarith-problem" aria-label={label}>
      <div className="colarith-row">
        <span className="colarith-op" aria-hidden="true" />
        <DigitRow cells={columnCells(p.a, INT_SQUARES, frac, mark)} />
      </div>
      <div className="colarith-row">
        <span className="colarith-op" aria-hidden="true">{SIGNS[p.op]}</span>
        <DigitRow cells={columnCells(p.b, INT_SQUARES, frac, mark)} />
      </div>
      <div className="colarith-line" />
      <div className="colarith-row">
        <span className="colarith-op" aria-hidden="true" />
        <DigitRow cells={columnCells(p.result, INT_SQUARES, frac, mark)} blank className="colarith-result-row" />
      </div>
    </div>
  )
}

/*
 * A powers line, one symbol per square like Division. The answer is one box
 * per character with no mark printed in it: moving the point is the exercise,
 * so where it lands is the child's to write.
 */
function PowersProblem({ p, mark, notation, label }) {
  const answer = formatDecimal(p.result, mark)
  return (
    <div className="colarith-problem" aria-label={label}>
      <div className="colarith-row">
        {[...formatDecimal(p.a, mark)].map((char, i) => <Cell key={`a${i}`} char={char} />)}
        <span className="colarith-op" aria-hidden="true">{glyph(p.op === 'mul' ? '*' : '/', notation)}</span>
        {[...String(p.power)].map((char, i) => <Cell key={`p${i}`} char={char} />)}
        <span className="colarith-op" aria-hidden="true">=</span>
        {[...answer].map((_, i) => (
          <span key={`r${i}`} className="colarith-cell"><span className="colarith-blank" /></span>
        ))}
      </div>
    </div>
  )
}

export default function Decimals() {
  const t = useT()
  const [mode, setMode] = usePersistedState('decimals', 'mode', 'column')
  const [ops, setOps] = usePersistedState('decimals', 'ops', 'both')
  const [places, setPlaces] = usePersistedState('decimals', 'places', 'two')
  // Frozen on the first visit, like the division sign: a comma where the
  // language's schools write one, a point where they do not.
  const [mark, setMark] = usePersistedState('decimals', 'mark', t('decimals.defaultMark'))
  const [columns, setColumns] = usePersistedState('decimals', 'columns', 3)
  const [answerKey, setAnswerKey] = usePersistedState('decimals', 'answerKey', false)

  const activeMode = MODES.includes(mode) ? mode : MODES[0]
  const activeOps = OPS.includes(ops) ? ops : OPS[2]
  const activePlaces = PLACES.includes(places) ? places : PLACES[1]
  const markChar = MARKS[mark] ?? MARKS.point
  // The × and ÷ signs follow the language, as on Order of Operations and Division.
  const defaultNotation = t('divide.defaultNotation')
  const notation = NOTATIONS.includes(defaultNotation) ? defaultNotation : NOTATIONS[0]

  const shape = sheetShape({ mode: activeMode, places: activePlaces, columns })
  const [sheetRef, sheetStyle] = useNotebookGrid({
    columns: shape.columns, cellsWide: shape.frame.cellsWide, rows: shape.frame.rows, ...SHEET_SPACING,
  })

  // The mark only repaints; it never deals a new sheet.
  const { sheets, setSet, regenerate } = useSheetSet(rng => {
    const { count } = sheetShape({ mode: activeMode, places: activePlaces, columns })
    return generateSheet({ mode: activeMode, places: activePlaces, ops: activeOps, count }, rng)
  }, [activeMode, activePlaces, activeOps, shape.columns])

  const title = t('decimals.title')
  const meta = activeMode === 'powers'
    ? t('decimals.metaPowers')
    : t('decimals.metaColumn', { places: t(PLACE_KEYS[activePlaces]) })
  const label = p => t(ARIA_KEYS[p.op], {
    a: formatDecimal(p.a, markChar),
    b: p.b ? formatDecimal(p.b, markChar) : p.power,
  })

  return (
    <div className="tool-panel">
      <SettingsPanel actions={<PanelActions worksheetId="decimals" onRegenerate={regenerate} />}>
        <SettingRow label={t('decimals.mode')}>
          <SegmentedControl
            value={activeMode}
            onChange={setMode}
            options={MODES.map(value => ({ value, label: t(`decimals.${value}`) }))}
          />
        </SettingRow>
        {activeMode === 'column' && (
          <>
            <SettingRow label={t('common.operation')}>
              <SegmentedControl
                value={activeOps}
                onChange={setOps}
                options={[
                  { value: 'add', label: '+' },
                  { value: 'sub', label: '−' },
                  { value: 'both', label: '+ / −' },
                ]}
              />
            </SettingRow>
            <SettingRow label={t('decimals.places')}>
              <SegmentedControl
                value={activePlaces}
                onChange={setPlaces}
                options={PLACES.map(value => ({ value, label: t(PLACE_KEYS[value]) }))}
              />
            </SettingRow>
          </>
        )}
        <SettingRow label={t('decimals.mark')}>
          <SegmentedControl
            value={MARKS[mark] ? mark : 'point'}
            onChange={setMark}
            options={[
              { value: 'point', label: `3${MARKS.point}5` },
              { value: 'comma', label: `3${MARKS.comma}5` },
            ]}
          />
        </SettingRow>
        {/* A powers line is fifteen squares wide and only prints two across; a single choice is no choice. */}
        {shape.columnOptions.length > 1 && (
          <SettingRow label={t('common.columns')}>
            <SegmentedControl value={shape.columns} onChange={setColumns} options={shape.columnOptions.map(c => ({ value: c, label: c }))} />
          </SettingRow>
        )}
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
            className={`worksheet notebook-grid-bg colarith-notebook print-area cols-${shape.columns}`}
            style={sheetStyle}
          >
            <WorksheetHeader title={title} meta={meta} stamp={String(set)} onStampChange={primary ? setSet : undefined} />

            <div className="colarith-grid">
              {problems.map((p, i) => (
                <div key={i} className="colarith-item">
                  {activeMode === 'powers'
                    ? <PowersProblem p={p} mark={markChar} notation={notation} label={label(p)} />
                    : <ColumnProblem p={p} places={activePlaces} mark={markChar} label={label(p)} />}
                </div>
              ))}
            </div>
          </div>
        )}
      </SheetCopies>

      {answerKey && sheets.map(({ set, data: problems }, i) => (
        <AnswerKey key={i} title={title} stamp={String(set)} answers={problems.map(p => formatDecimal(p.result, markChar))} />
      ))}
    </div>
  )
}
