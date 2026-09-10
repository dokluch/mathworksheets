import { useMemo, useState } from 'react'
import { usePersistedState } from '../hooks/usePersistedState'
import { useNotebookGrid } from '../hooks/useNotebookGrid'
import { useT } from '../i18n/context'
import { SettingsPanel, SettingRow, SegmentedControl, CheckboxOption, PanelActions } from './controls/SettingsPanel'
import './AddSubtract.css'
import './ColumnAddition.css'
import WorksheetHeader from './WorksheetHeader'
import { setStamp } from '../lib/setStamp'
import AnswerKey from './AnswerKey'
import {
  BLANK_A, BLANK_B, BLANK_RESULT, SHEET_SPACING, generateSheet, getBlankAnswer, sheetShape,
} from '../lib/addSubtract'

const PRESETS = [10, 20, 100, 1000]

/** U+2212, as everywhere on the site: a hyphen is too short to read as minus in a square. */
const glyph = op => (op === '-' ? '−' : op)

function describe(p) {
  const shown = (pos, value) => (p.blankPos === pos ? '?' : value)
  const expr = `${shown(BLANK_A, p.a)} ${glyph(p.op)} ${shown(BLANK_B, p.b)}`
  const res = shown(BLANK_RESULT, p.result)
  return p.reversed ? `${res} = ${expr}` : `${expr} = ${res}`
}

const Blank = () => <span className="colarith-blank" />

/* Stacked: operands right-aligned over a rule so place values share a column,
   and the result drawn as one box per digit. */
function renderDigitRow(value, width, blank) {
  const text = String(value)
  const cells = Array.from({ length: width }, (_, i) => text[i - (width - text.length)] ?? '')
  return (
    <div className="colarith-digit-row">
      {cells.map((cell, idx) => (
        <span key={idx} className={`colarith-cell ${cell ? '' : 'colarith-cell-empty'}`}>
          {cell ? (blank ? <Blank /> : cell) : ''}
        </span>
      ))}
    </div>
  )
}

function renderStackedProblem(p, digits) {
  return (
    <div className="colarith-problem" aria-label={describe({ ...p, reversed: false })}>
      <div className="colarith-row">
        <span className="colarith-op" aria-hidden="true" />
        {renderDigitRow(p.a, digits, p.blankPos === BLANK_A)}
      </div>
      <div className="colarith-row">
        <span className="colarith-op" aria-hidden="true">{glyph(p.op)}</span>
        {renderDigitRow(p.b, digits, p.blankPos === BLANK_B)}
      </div>
      <div className="colarith-line" />
      <div className="colarith-row">
        <span className="colarith-op" aria-hidden="true" />
        {renderDigitRow(p.result, digits, p.blankPos === BLANK_RESULT)}
      </div>
    </div>
  )
}

/* Inline: written left to right the way a child writes in a squared exercise
   book, one symbol per square, the unknown as one box per digit. */
function renderInlineProblem(p) {
  const number = (pos, value) => [...String(value)].map((digit, i) => (
    <span key={`${pos}-${i}`} className="colarith-cell">
      {p.blankPos === pos ? <Blank /> : digit}
    </span>
  ))
  const symbol = (key, text) => <span key={key} className="colarith-op" aria-hidden="true">{text}</span>

  const expr = [...number(BLANK_A, p.a), symbol('op', glyph(p.op)), ...number(BLANK_B, p.b)]
  const res = number(BLANK_RESULT, p.result)
  const cells = p.reversed
    ? [...res, symbol('eq', '='), ...expr]
    : [...expr, symbol('eq', '='), ...res]

  return (
    <div className="colarith-problem" aria-label={describe(p)}>
      <div className="colarith-row">{cells}</div>
    </div>
  )
}

export default function AddSubtract() {
  const t = useT()
  const [ops, setOps] = usePersistedState('addsub', 'ops', 'both')
  const [maxVal, setMaxVal] = usePersistedState('addsub', 'maxVal', 100)
  const [columns, setColumns] = usePersistedState('addsub', 'columns', 3)
  const [layout, setLayout] = usePersistedState('addsub', 'layout', 'inline')
  const [sixtySevenMode, setSixtySevenMode] = usePersistedState('addsub', 'sixtySevenMode', true)
  const [answerKey, setAnswerKey] = usePersistedState('addsub', 'answerKey', false)
  const [seed, setSeed] = useState(0)

  const stacked = layout === 'stacked'
  const shape = sheetShape({ stacked, maxVal, columns, sixtySevenMode })
  const [sheetRef, sheetStyle] = useNotebookGrid({
    columns: shape.columns, cellsWide: shape.frame.cellsWide, rows: shape.frame.rows, ...SHEET_SPACING,
  })

  const problems = useMemo(() => {
    void seed // depend on seed for re-randomization
    // Re-derived from plain state so the memo depends on the settings alone.
    const isStacked = layout === 'stacked'
    const { columns: cols, count, sixtySeven } = sheetShape({ stacked: isStacked, maxVal, columns, sixtySevenMode })
    return generateSheet({ ops, maxVal, columns: cols, count, stacked: isStacked, sixtySeven })
  }, [ops, maxVal, columns, layout, sixtySevenMode, seed])

  return (
    <div className="tool-panel">
      <SettingsPanel actions={<PanelActions worksheetId="addsub" onRegenerate={() => setSeed(s => s + 1)} />}>
        <SettingRow label={t('common.operation')}>
          <SegmentedControl
            value={ops}
            onChange={setOps}
            options={[
              { value: 'add', label: '+' },
              { value: 'sub', label: '−' },
              { value: 'both', label: '+ / −' },
            ]}
          />
        </SettingRow>
        <SettingRow label={t('common.limit')}>
          <SegmentedControl
            value={maxVal}
            onChange={setMaxVal}
            options={PRESETS.map(max => ({ value: max, label: t('common.within', { n: max }) }))}
          />
        </SettingRow>
        <SettingRow label={t('common.layout')}>
          <SegmentedControl
            value={layout}
            onChange={setLayout}
            options={[
              { value: 'inline', label: t('addsub.inline') },
              { value: 'stacked', label: t('addsub.stacked') },
            ]}
          />
        </SettingRow>
        <SettingRow label={t('common.columns')}>
          <SegmentedControl value={shape.columns} onChange={setColumns} options={shape.columnOptions.map(c => ({ value: c, label: c }))} />
        </SettingRow>
        <SettingRow label={t('common.options')}>
          <CheckboxOption checked={sixtySevenMode} onChange={setSixtySevenMode}>
            {t('addsub.sixtySeven')}
          </CheckboxOption>
          <CheckboxOption checked={answerKey} onChange={setAnswerKey}>
            {t('common.answerKeyOption')}
          </CheckboxOption>
        </SettingRow>
      </SettingsPanel>

      <div
        ref={sheetRef}
        className={`worksheet notebook-grid-bg colarith-notebook print-area cols-${shape.columns}`}
        style={sheetStyle}
      >
        <WorksheetHeader
          title={t('addsub.title')}
          meta={`${ops === 'add' ? '(+)' : ops === 'sub' ? '(−)' : '(+ / −)'} · ${t('common.withinMeta', { n: maxVal })}`}
          stamp={setStamp(problems)}
        />

        <div className="colarith-grid">
          {problems.map((p, i) => (
            <div key={i} className="colarith-item">
              {stacked ? renderStackedProblem(p, shape.frame.digits) : renderInlineProblem(p)}
            </div>
          ))}
        </div>
      </div>

      {answerKey && (
        <AnswerKey
          title={t('addsub.title')}
          stamp={setStamp(problems)}
          answers={problems.map(p => String(getBlankAnswer(p)))}
        />
      )}
    </div>
  )
}
