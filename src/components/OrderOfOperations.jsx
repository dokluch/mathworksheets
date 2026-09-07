import { useMemo, useState } from 'react'
import { usePersistedState } from '../hooks/usePersistedState'
import { listRowsPerPage, PRINT_ORDER_ROW } from '../hooks/useNotebookGrid'
import { useT } from '../i18n/context'
import { SettingsPanel, SettingRow, SegmentedControl, CheckboxOption, PanelActions } from './controls/SettingsPanel'
import './OrderOfOperations.css'
import WorksheetHeader from './WorksheetHeader'
import AnswerKey from './AnswerKey'
import { setStamp } from '../lib/setStamp'
import { usePreviewScale } from '../hooks/usePreviewScale'
import { LEVELS, generateSheet, glyph } from '../lib/orderOfOperations'

/**
 * Header budget for listRowsPerPage: the title, the ruled Name/Date/Set block
 * and the space below them, measured on the printed sheet. 66px in the Latin
 * and Cyrillic locales; 70 is Chinese, whose taller line box sets the budget,
 * because the tallest translation is the one that has to fit.
 */
export const ORDER_HEADER_PX = 70
/** JetBrains Mono advance at the printed figure size, for the width budget. */
export const ORDER_CHAR_PX = 9
/** One answer box and the gap between two, matching OrderOfOperations.css.
    The box is a `.colarith-blank`: the cell size less its 6px inset. */
export const ORDER_BOX_PX = 24 - 6
export const ORDER_BOX_GAP = 4

const COLUMN_OPTIONS = [1, 2]

/**
 * One expression. The tokens carry structure, never glyphs, so changing the
 * notation repaints these spans and regenerates nothing.
 */
function Expression({ tokens, notation }) {
  return (
    <span className="order-expr">
      {tokens.map((tok, i) => {
        if (tok.t === 'n') return <span key={i} className="val">{String(tok.v)}</span>
        if (tok.t === 'op') return <span key={i} className="op">{glyph(tok.v, notation)}</span>
        return <span key={i} className="order-paren">{tok.t}</span>
      })}
      <span className="op">=</span>
    </span>
  )
}

/**
 * One box per digit of the answer, as on the textbook page this is drawn from.
 * The count is a deliberate hint: it tells a child whether they are looking for
 * a number in the tens or the hundreds, which is the first thing to check an
 * answer against. Hidden from assistive tech — it is ruling, not content.
 *
 * The box itself is `.colarith-blank`, the same mark the column sheets use, so
 * a blank to write in looks identical wherever it appears on the site.
 */
function AnswerBoxes({ answer }) {
  return (
    <span className="order-boxes" aria-hidden="true">
      {Array.from({ length: String(answer).length }, (_, i) => (
        <span key={i} className="colarith-blank" />
      ))}
    </span>
  )
}

export default function OrderOfOperations() {
  const t = useT()
  const [level, setLevel] = usePersistedState('order', 'level', 'easy')
  const [columns, setColumns] = usePersistedState('order', 'columns', 2)
  // usePersistedState reads its default only in the useState initialiser and
  // writes on mount, so the locale's convention is frozen on the first visit
  // and an explicit choice wins from then on.
  const [notation, setNotation] = usePersistedState('order', 'notation', t('order.defaultNotation'))
  const [brackets, setBrackets] = usePersistedState('order', 'brackets', true)
  const [answerKey, setAnswerKey] = usePersistedState('order', 'answerKey', false)
  const [seed, setSeed] = useState(0)
  const [fitRef, fitStyle] = usePreviewScale()

  // Derived from the page height rather than a lookup table, because the row
  // holds bordered boxes whose height is the thing that would change the count.
  const problemCount = listRowsPerPage(PRINT_ORDER_ROW, ORDER_HEADER_PX) * columns

  const problems = useMemo(() => {
    void seed // depend on seed for re-randomization
    return generateSheet(problemCount, level, brackets)
  }, [problemCount, level, brackets, seed])

  return (
    <div className="tool-panel">
      <SettingsPanel actions={<PanelActions worksheetId="order" onRegenerate={() => setSeed(s => s + 1)} />}>
        <SettingRow label={t('common.difficulty')}>
          <SegmentedControl
            value={level}
            onChange={setLevel}
            options={LEVELS.map(l => ({ value: l, label: t(`order.${l}`) }))}
          />
        </SettingRow>
        <SettingRow label={t('order.notation')}>
          <SegmentedControl
            value={notation}
            onChange={setNotation}
            options={[
              { value: 'dot', label: '· :' },
              { value: 'cross', label: '× ÷' },
            ]}
          />
        </SettingRow>
        <SettingRow label={t('common.columns')}>
          <SegmentedControl
            value={columns}
            onChange={setColumns}
            options={COLUMN_OPTIONS.map(c => ({ value: c, label: c }))}
          />
        </SettingRow>
        <SettingRow label={t('common.options')}>
          <CheckboxOption checked={brackets} onChange={setBrackets}>
            {t('order.useBrackets')}
          </CheckboxOption>
          <CheckboxOption checked={answerKey} onChange={setAnswerKey}>
            {t('common.answerKeyOption')}
          </CheckboxOption>
        </SettingRow>
      </SettingsPanel>

      <div className="sheet-fit" ref={fitRef} style={fitStyle}>
        <div className={`worksheet print-area cols-${columns}`}>
          <WorksheetHeader
            title={t('order.title')}
            meta={t(`order.${level}`)}
            stamp={setStamp(problems)}
          />

          <div
            className="order-grid"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {problems.map((p, i) => (
              <div key={i} className="order-item">
                <Expression tokens={p.tokens} notation={notation} />
                <AnswerBoxes answer={p.answer} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {answerKey && (
        <AnswerKey
          title={t('order.title')}
          stamp={setStamp(problems)}
          answers={problems.map(p => String(p.answer))}
        />
      )}
    </div>
  )
}
