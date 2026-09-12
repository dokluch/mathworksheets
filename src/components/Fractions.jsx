import { usePersistedState } from '../hooks/usePersistedState'
import { useNotebookGrid } from '../hooks/useNotebookGrid'
import { useT } from '../i18n/context'
import { SettingsPanel, SettingRow, SegmentedControl, CheckboxOption, PanelActions } from './controls/SettingsPanel'
import './AddSubtract.css'
import './ColumnAddition.css'
import WorksheetHeader from './WorksheetHeader'
import { useSheetSet } from '../hooks/useSheetSet'
import SheetCopies from './SheetCopies'
import AnswerKey from './AnswerKey'
import { FracRow, FracSign, Fraction } from './Fraction'
import { LIMITS, PRACTICES, SHEET_SPACING, generateSheet, sheetShape } from '../lib/fractions'

const written = f => `${f.n}/${f.d}`

/* Simplify and equivalent problems are written as an equation with the answer
   boxed on the right; a comparison leaves an empty box between the two
   fractions for >, < or =. */
function renderProblem(p) {
  if (p.kind === 'simplify') {
    return (
      <>
        <Fraction n={p.a.n} d={p.a.d} />
        <FracSign>=</FracSign>
        <Fraction n={p.answer.n} d={p.answer.d} blankN blankD />
      </>
    )
  }
  if (p.kind === 'equivalent') {
    return (
      <>
        <Fraction n={p.a.n} d={p.a.d} />
        <FracSign>=</FracSign>
        <Fraction n={p.b.n} d={p.b.d} blankN={p.blank === 'n'} blankD={p.blank === 'd'} />
      </>
    )
  }
  return (
    <>
      <Fraction n={p.a.n} d={p.a.d} />
      <FracSign box />
      <Fraction n={p.b.n} d={p.b.d} />
    </>
  )
}

function problemLabel(p, t) {
  if (p.kind === 'simplify') return t('fractions.simplifyAria', { a: written(p.a) })
  if (p.kind === 'equivalent') {
    return p.blank === 'n'
      ? t('fractions.equivalentNumAria', { a: written(p.a), d: p.b.d })
      : t('fractions.equivalentDenAria', { a: written(p.a), n: p.b.n })
  }
  return t('fractions.compareAria', { a: written(p.a), b: written(p.b) })
}

function answerText(p) {
  if (p.kind === 'simplify') return written(p.answer)
  if (p.kind === 'equivalent') return written(p.b)
  return p.answer
}

export default function Fractions() {
  const t = useT()
  const [practice, setPractice] = usePersistedState('fractions', 'practice', 'simplify')
  const [limit, setLimit] = usePersistedState('fractions', 'limit', 12)
  const [columns, setColumns] = usePersistedState('fractions', 'columns', 3)
  const [answerKey, setAnswerKey] = usePersistedState('fractions', 'answerKey', false)

  const activePractice = PRACTICES.includes(practice) ? practice : PRACTICES[0]
  const activeLimit = LIMITS.includes(limit) ? limit : LIMITS[1]
  const shape = sheetShape({ limit: activeLimit, columns })
  const [sheetRef, sheetStyle] = useNotebookGrid({
    columns: shape.columns, cellsWide: shape.frame.cellsWide, rows: shape.frame.rows, ...SHEET_SPACING,
  })

  const { sheets, setSet, regenerate } = useSheetSet(rng => {
    const { count } = sheetShape({ limit: activeLimit, columns })
    return generateSheet({ practice: activePractice, limit: activeLimit, count }, rng)
  }, [activePractice, activeLimit, columns])

  const title = t('fractions.title')
  const meta = t('fractions.meta', { practice: t(`fractions.${activePractice}`), n: activeLimit })

  return (
    <div className="tool-panel">
      <SettingsPanel actions={<PanelActions worksheetId="fractions" onRegenerate={regenerate} />}>
        <SettingRow label={t('fractions.practice')}>
          <SegmentedControl
            value={activePractice}
            onChange={setPractice}
            options={PRACTICES.map(value => ({ value, label: t(`fractions.${value}`) }))}
          />
        </SettingRow>
        <SettingRow label={t('fractions.denominators')}>
          <SegmentedControl
            value={activeLimit}
            onChange={setLimit}
            options={LIMITS.map(n => ({ value: n, label: t('fractions.upTo', { n }) }))}
          />
        </SettingRow>
        <SettingRow label={t('common.columns')}>
          <SegmentedControl value={shape.columns} onChange={setColumns} options={shape.columnOptions.map(c => ({ value: c, label: c }))} />
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
            className={`worksheet notebook-grid-bg colarith-notebook print-area cols-${shape.columns}`}
            style={sheetStyle}
          >
            <WorksheetHeader title={title} meta={meta} stamp={String(set)} onStampChange={primary ? setSet : undefined} />

            <div className="colarith-grid">
              {problems.map((p, i) => (
                <div key={i} className="colarith-item">
                  <FracRow label={problemLabel(p, t)}>{renderProblem(p)}</FracRow>
                </div>
              ))}
            </div>
          </div>
        )}
      </SheetCopies>

      {answerKey && sheets.map(({ set, data: problems }, i) => (
        <AnswerKey key={i} title={title} stamp={String(set)} answers={problems.map(answerText)} />
      ))}
    </div>
  )
}
