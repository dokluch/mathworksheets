import { usePersistedState } from '../hooks/usePersistedState'
import { useNotebookSheet } from '../hooks/useNotebookSheet'
import { useT } from '../i18n/context'
import { SettingsPanel, SettingRow, SegmentedControl, CheckboxOption, PanelActions } from './controls/SettingsPanel'
import './AddSubtract.css'
import './ColumnAddition.css'
import './Division.css'
import NotebookSheet from './NotebookSheet'
import { LIMITS, generateSheet, sheetShape } from '../lib/division'
import { NOTATIONS, glyph } from '../lib/orderOfOperations'

const Blank = () => <span className="colarith-blank" />

/* Written left to right the way a child writes in a squared exercise book, one
   symbol per square and the quotient as one box per digit. With remainders on,
   every line ends in the mark and a remainder box — exact ones too, because
   0 is an answer the child has to reach rather than a given. */
function renderProblem(p, { sign, mark, allowRemainder, label }) {
  const number = (key, value, blank = false) => [...String(value)].map((digit, i) => (
    <span key={`${key}-${i}`} className="colarith-cell">{blank ? <Blank /> : digit}</span>
  ))
  const symbol = (key, text, extra) => (
    <span key={key} className={extra ? `colarith-op ${extra}` : 'colarith-op'} aria-hidden="true">{text}</span>
  )

  const cells = [
    ...number('dividend', p.dividend), symbol('sign', sign), ...number('divisor', p.divisor),
    symbol('eq', '='), ...number('quotient', p.quotient, true),
  ]
  if (allowRemainder) cells.push(symbol('mark', mark, 'divide-mark'), ...number('remainder', p.remainder, true))

  return (
    <div className="colarith-problem" aria-label={label}>
      <div className="colarith-row">{cells}</div>
    </div>
  )
}

export default function Division() {
  const t = useT()
  const [limit, setLimit] = usePersistedState('divide', 'limit', 100, LIMITS)
  // The locale's division sign is frozen on the first visit, as on Order of
  // Operations: ÷ where schools print it, a colon where they write that.
  const [notation, setNotation] = usePersistedState('divide', 'notation', t('divide.defaultNotation'))
  const [columns, setColumns] = usePersistedState('divide', 'columns', 3)
  const [allowRemainder, setAllowRemainder] = usePersistedState('divide', 'allowRemainder', false)
  const [answerKey, setAnswerKey] = usePersistedState('divide', 'answerKey', false)

  const activeNotation = NOTATIONS.includes(notation) ? notation : NOTATIONS[0]
  const shape = sheetShape({ limit, allowRemainder, columns })
  // Changing the sign only repaints; it never deals a new sheet.
  const { sheets, setSet, regenerate, sheetProps } = useNotebookSheet({
    shape,
    generate: (rng, { count }) => generateSheet({ limit, allowRemainder, count }, rng),
    deps: [limit, allowRemainder],
  })

  const sign = glyph('/', activeNotation)
  const mark = t('divide.remainderMark')
  const meta = allowRemainder
    ? `${t('common.withinMeta', { n: limit })} · ${t('divide.withRemainders')}`
    : t('common.withinMeta', { n: limit })

  return (
    <div className="tool-panel">
      <SettingsPanel actions={<PanelActions worksheetId="divide" onRegenerate={regenerate} />}>
        <SettingRow label={t('common.limit')}>
          <SegmentedControl
            value={limit}
            onChange={setLimit}
            options={LIMITS.map(n => ({ value: n, label: t('common.within', { n }) }))}
          />
        </SettingRow>
        <SettingRow label={t('divide.notation')}>
          <SegmentedControl
            value={activeNotation}
            onChange={setNotation}
            options={[
              { value: 'cross', label: glyph('/', 'cross') },
              { value: 'dot', label: glyph('/', 'dot') },
            ]}
          />
        </SettingRow>
        <SettingRow label={t('common.columns')}>
          <SegmentedControl value={shape.columns} onChange={setColumns} options={shape.columnOptions.map(c => ({ value: c, label: c }))} />
        </SettingRow>
        <SettingRow label={t('common.options')}>
          <CheckboxOption checked={allowRemainder} onChange={setAllowRemainder}>
            {t('divide.allowRemainder')}
          </CheckboxOption>
          <CheckboxOption checked={answerKey} onChange={setAnswerKey}>
            {t('common.answerKeyOption')}
          </CheckboxOption>
        </SettingRow>
      </SettingsPanel>

      <NotebookSheet
        sheets={sheets}
        sheetProps={sheetProps}
        setSet={setSet}
        title={t('divide.title')}
        meta={meta}
        answerKey={answerKey}
        answer={p => (allowRemainder ? t('divide.answer', { q: p.quotient, r: p.remainder }) : String(p.quotient))}
      >
        {p => renderProblem(p, {
          sign,
          mark,
          allowRemainder,
          label: t('divide.problemAria', { dividend: p.dividend, divisor: p.divisor }),
        })}
      </NotebookSheet>
    </div>
  )
}
