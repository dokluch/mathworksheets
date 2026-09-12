import { usePersistedState } from '../hooks/usePersistedState'
import { useNotebookSheet } from '../hooks/useNotebookSheet'
import { useT } from '../i18n/context'
import { SettingsPanel, SettingRow, SegmentedControl, CheckboxOption, PanelActions } from './controls/SettingsPanel'
import './AddSubtract.css'
import './ColumnAddition.css'
import NotebookSheet from './NotebookSheet'
import { FracRow, FracSign, Fraction, MixedNumber } from './Fraction'
import {
  ANSWER_FORMS, LEVELS, LIMITS, OPS, answerOf, generateSheet, sheetShape,
} from '../lib/fracAddSub'

/** U+2212, the minus the rest of the site sets. */
const SIGNS = { add: '+', sub: '−' }
const written = ({ w = 0, n, d }) => (w > 0 ? `${w} ${n}/${d}` : `${n}/${d}`)

function Operand({ value }) {
  return value.w > 0
    ? <MixedNumber w={value.w} n={value.n} d={value.d} />
    : <Fraction n={value.n} d={value.d} />
}

function renderProblem(p, answerForm) {
  const answer = answerOf(p, answerForm)
  return (
    <>
      <Operand value={p.a} />
      <FracSign>{SIGNS[p.op]}</FracSign>
      <Operand value={p.b} />
      <FracSign>=</FracSign>
      {answer.w > 0
        ? <MixedNumber w={answer.w} n={answer.n} d={answer.d} blank />
        : <Fraction n={answer.n} d={answer.d} blankN blankD />}
    </>
  )
}

export default function FractionAddSub() {
  const t = useT()
  const [level, setLevel] = usePersistedState('fracaddsub', 'level', 'like', LEVELS)
  const [op, setOp] = usePersistedState('fracaddsub', 'op', 'both', OPS)
  const [limit, setLimit] = usePersistedState('fracaddsub', 'limit', 12, LIMITS)
  // Frozen on the first visit, like the division sign: a mixed number where the
  // language's schools write one, an improper fraction where they do not.
  const [answerForm, setAnswerForm] = usePersistedState('fracaddsub', 'answerForm', t('fracaddsub.defaultAnswerForm'))
  const [columns, setColumns] = usePersistedState('fracaddsub', 'columns', 3)
  const [answerKey, setAnswerKey] = usePersistedState('fracaddsub', 'answerKey', false)

  const activeForm = ANSWER_FORMS.includes(answerForm) ? answerForm : ANSWER_FORMS[0]
  const shape = sheetShape({ level, limit, answerForm: activeForm, columns })
  // The answer form only repaints the boxes; it deals a new sheet only when it
  // changes how many columns fit, which the shape carries.
  const { sheets, setSet, regenerate, sheetProps } = useNotebookSheet({
    shape,
    generate: (rng, { count }) => generateSheet({ level, op, limit, count }, rng),
    deps: [level, op, limit],
  })

  const title = t('fracaddsub.title')
  const meta = t('fracaddsub.meta', { level: t(`fracaddsub.${level}`), n: limit })
  const label = p => t(p.op === 'add' ? 'fracaddsub.addAria' : 'fracaddsub.subAria', { a: written(p.a), b: written(p.b) })

  return (
    <div className="tool-panel">
      <SettingsPanel actions={<PanelActions worksheetId="fracaddsub" onRegenerate={regenerate} />}>
        <SettingRow label={t('fracaddsub.level')}>
          <SegmentedControl
            value={level}
            onChange={setLevel}
            options={LEVELS.map(value => ({ value, label: t(`fracaddsub.${value}`) }))}
          />
        </SettingRow>
        <SettingRow label={t('common.operation')}>
          <SegmentedControl
            value={op}
            onChange={setOp}
            options={[
              { value: 'add', label: '+' },
              { value: 'sub', label: '−' },
              { value: 'both', label: '+ / −' },
            ]}
          />
        </SettingRow>
        <SettingRow label={t('fractions.denominators')}>
          <SegmentedControl
            value={limit}
            onChange={setLimit}
            options={LIMITS.map(n => ({ value: n, label: t('fractions.upTo', { n }) }))}
          />
        </SettingRow>
        {level === 'mixed' && (
          <SettingRow label={t('fracaddsub.answerForm')}>
            <SegmentedControl
              value={activeForm}
              onChange={setAnswerForm}
              options={ANSWER_FORMS.map(value => ({ value, label: t(`fracaddsub.${value}Form`) }))}
            />
          </SettingRow>
        )}
        <SettingRow label={t('common.columns')}>
          <SegmentedControl value={shape.columns} onChange={setColumns} options={shape.columnOptions.map(c => ({ value: c, label: c }))} />
        </SettingRow>
        <SettingRow label={t('common.options')}>
          <CheckboxOption checked={answerKey} onChange={setAnswerKey}>
            {t('common.answerKeyOption')}
          </CheckboxOption>
        </SettingRow>
      </SettingsPanel>

      <NotebookSheet
        sheets={sheets}
        sheetProps={sheetProps}
        setSet={setSet}
        title={title}
        meta={meta}
        answerKey={answerKey}
        answer={p => written(answerOf(p, activeForm))}
      >
        {p => <FracRow label={label(p)}>{renderProblem(p, activeForm)}</FracRow>}
      </NotebookSheet>
    </div>
  )
}
