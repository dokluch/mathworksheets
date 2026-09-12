import { usePersistedState } from '../hooks/usePersistedState'
import { useNotebookSheet } from '../hooks/useNotebookSheet'
import { useT } from '../i18n/context'
import { SettingsPanel, SettingRow, SegmentedControl, CheckboxOption, PanelActions } from './controls/SettingsPanel'
import './AddSubtract.css'
import './ColumnAddition.css'
import './Factors.css'
import NotebookSheet from './NotebookSheet'
import { NOTATIONS, glyph } from '../lib/orderOfOperations'
import { PRACTICES, RANGES, generateSheet, sheetShape } from '../lib/factors'

/** One square per digit; an answer is a box per digit, as on every other sheet. */
function cells(value, key, blank = false) {
  return [...String(value)].map((char, i) => (
    <span key={`${key}${i}`} className="colarith-cell">{blank ? <span className="colarith-blank" /> : char}</span>
  ))
}

const op = (key, text, extra = '') => (
  <span key={key} className={`colarith-op ${extra}`.trim()} aria-hidden="true">{text}</span>
)

/* 84 = □ × □ × □ × □: as many boxes as the answer has digits, a sign between factors. */
function FactorizeProblem({ p, sign, label }) {
  return (
    <div className="colarith-problem" aria-label={label}>
      <div className="colarith-row">
        {cells(p.n, 'n')}
        {op('eq', '=')}
        {p.factors.flatMap((factor, i) => [...(i ? [op(`s${i}`, sign)] : []), ...cells(factor, `f${i}-`, true)])}
      </div>
    </div>
  )
}

/*
 * The pair on the first row, then a labelled row each for the GCD and the LCM.
 * An empty square either side of the separator keeps the two numbers apart:
 * packed into adjacent squares, 54,24 reads as one number. The separator is a
 * semicolon wherever a comma is the decimal mark, for the same reason.
 */
function PairProblem({ p, separator, gcdMark, lcmMark, label }) {
  return (
    <div className="colarith-problem factors-pair" aria-label={label}>
      <div className="colarith-row">
        {cells(p.a, 'a')}
        <span className="colarith-cell colarith-cell-empty" />
        {op('sep', separator, 'factors-sep')}
        <span className="colarith-cell colarith-cell-empty" />
        {cells(p.b, 'b')}
      </div>
      <div className="colarith-row">
        {op('gcd', gcdMark, 'factors-label')}
        {cells(p.gcd, 'g', true)}
      </div>
      <div className="colarith-row">
        {op('lcm', lcmMark, 'factors-label')}
        {cells(p.lcm, 'l', true)}
      </div>
    </div>
  )
}

/* The number, a square of air, and a box for the letter the meta line explains. */
function PrimesProblem({ p, label }) {
  return (
    <div className="colarith-problem" aria-label={label}>
      <div className="colarith-row">
        {cells(p.n, 'n')}
        <span className="colarith-cell colarith-cell-empty" />
        <span className="colarith-cell"><span className="colarith-blank" /></span>
      </div>
    </div>
  )
}

export default function Factors() {
  const t = useT()
  const [practice, setPractice] = usePersistedState('factors', 'practice', 'factorize')
  const [range, setRange] = usePersistedState('factors', 'range', RANGES[0])
  // The multiplication sign follows the language on first visit, as on Order of Operations.
  const [notation, setNotation] = usePersistedState('factors', 'notation', t('order.defaultNotation'))
  const [columns, setColumns] = usePersistedState('factors', 'columns', 3)
  const [answerKey, setAnswerKey] = usePersistedState('factors', 'answerKey', false)

  const activePractice = PRACTICES.includes(practice) ? practice : PRACTICES[0]
  const activeRange = RANGES.includes(range) ? range : RANGES[0]
  const activeNotation = NOTATIONS.includes(notation) ? notation : NOTATIONS[0]
  const sign = glyph('*', activeNotation)
  const gcdMark = t('factors.gcdMark')
  const lcmMark = t('factors.lcmMark')
  const primeMark = t('factors.primeMark')
  const compositeMark = t('factors.compositeMark')

  const shape = sheetShape({ practice: activePractice, range: activeRange, columns })
  // The sign only repaints; it never deals a new sheet.
  const { sheets, setSet, regenerate, sheetProps } = useNotebookSheet({
    shape,
    generate: (rng, { count }) => generateSheet({ practice: activePractice, range: activeRange, count }, rng),
    deps: [activePractice, activeRange],
  })

  const title = t('factors.title')
  const within = t('common.withinMeta', { n: activeRange + 1 })
  const meta = activePractice === 'gcdlcm'
    ? t('factors.metaGcdlcm', { gcd: gcdMark, lcm: lcmMark })
    : activePractice === 'primes'
      ? `${within} · ${t('factors.metaPrimes', { prime: primeMark, composite: compositeMark })}`
      : within

  const renderProblem = p => {
    if (p.kind === 'factorize') return <FactorizeProblem p={p} sign={sign} label={t('factors.factorizeAria', { n: p.n })} />
    if (p.kind === 'gcdlcm') {
      return (
        <PairProblem
          p={p}
          separator={t('factors.pairSeparator')}
          gcdMark={gcdMark}
          lcmMark={lcmMark}
          label={t('factors.gcdlcmAria', { a: p.a, b: p.b })}
        />
      )
    }
    return <PrimesProblem p={p} label={t('factors.primesAria', { n: p.n })} />
  }

  const answer = p => {
    if (p.kind === 'factorize') return p.factors.join(` ${sign} `)
    if (p.kind === 'gcdlcm') return `${gcdMark} ${p.gcd} · ${lcmMark} ${p.lcm}`
    return p.prime ? primeMark : compositeMark
  }

  return (
    <div className="tool-panel">
      <SettingsPanel actions={<PanelActions worksheetId="factors" onRegenerate={regenerate} />}>
        <SettingRow label={t('factors.practice')}>
          <SegmentedControl
            value={activePractice}
            onChange={setPractice}
            options={PRACTICES.map(value => ({ value, label: t(`factors.${value}`) }))}
          />
        </SettingRow>
        {/* Pairs are built from a common factor, not drawn from a range. */}
        {activePractice !== 'gcdlcm' && (
          <SettingRow label={t('common.range')}>
            <SegmentedControl
              value={activeRange}
              onChange={setRange}
              options={RANGES.map(value => ({ value, label: t('common.within', { n: value + 1 }) }))}
            />
          </SettingRow>
        )}
        {activePractice === 'factorize' && (
          <SettingRow label={t('divide.notation')}>
            <SegmentedControl
              value={activeNotation}
              onChange={setNotation}
              options={NOTATIONS.map(value => ({ value, label: glyph('*', value) }))}
            />
          </SettingRow>
        )}
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

      <NotebookSheet
        sheets={sheets}
        sheetProps={sheetProps}
        setSet={setSet}
        title={title}
        meta={meta}
        answerKey={answerKey}
        answer={answer}
      >
        {renderProblem}
      </NotebookSheet>
    </div>
  )
}
