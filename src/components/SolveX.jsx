import { usePersistedState } from '../hooks/usePersistedState'
import { useNotebookSheet } from '../hooks/useNotebookSheet'
import { useT } from '../i18n/context'
import { SettingsPanel, SettingRow, SegmentedControl, CheckboxOption, PanelActions } from './controls/SettingsPanel'
import './AddSubtract.css'
import './ColumnAddition.css'
import './SolveX.css'
import NotebookSheet from './NotebookSheet'
import { NOTATIONS, glyph } from '../lib/orderOfOperations'
import { LEVELS, RANGES, WORK_ROWS, generateSheet, sheetShape } from '../lib/solveX'

/** An equation as text, with the language's own signs, for screen readers. */
function spoken(tokens, notation) {
  return tokens.map(tok => {
    if (tok.t === 'n') return String(tok.v)
    if (tok.t === 'x') return tok.c > 1 ? `${tok.c}x` : 'x'
    if (tok.t === 'op') return glyph(tok.v, notation)
    return tok.t
  }).join(' ')
}

/*
 * One symbol per notebook square. The coefficient takes a square per digit and
 * x one more, set in italic as a letter rather than a times sign.
 */
function Equation({ tokens, notation }) {
  return (
    <div className="colarith-row">
      {tokens.flatMap((tok, i) => {
        if (tok.t === 'n') {
          return [...String(tok.v)].map((char, k) => <span key={`${i}-${k}`} className="colarith-cell">{char}</span>)
        }
        if (tok.t === 'x') {
          const coefficient = tok.c > 1
            ? [...String(tok.c)].map((char, k) => <span key={`${i}-${k}`} className="colarith-cell">{char}</span>)
            : []
          return [...coefficient, <span key={`${i}-x`} className="colarith-cell solvex-var">x</span>]
        }
        const text = tok.t === 'op' ? glyph(tok.v, notation) : tok.t
        return [<span key={i} className="colarith-op" aria-hidden="true">{text}</span>]
      })}
    </div>
  )
}

export default function SolveX() {
  const t = useT()
  const [level, setLevel] = usePersistedState('solvex', 'level', 'one', LEVELS)
  const [range, setRange] = usePersistedState('solvex', 'range', 20, RANGES)
  // The × and ÷ signs follow the language on first visit, as on Order of Operations.
  const [notation, setNotation] = usePersistedState('solvex', 'notation', t('order.defaultNotation'))
  const [columns, setColumns] = usePersistedState('solvex', 'columns', 3)
  const [answerKey, setAnswerKey] = usePersistedState('solvex', 'answerKey', false)

  const activeNotation = NOTATIONS.includes(notation) ? notation : NOTATIONS[0]

  const shape = sheetShape({ level, range, columns })
  // The signs only repaint; they never deal a new sheet.
  const { sheets, setSet, regenerate, sheetProps } = useNotebookSheet({
    shape,
    generate: (rng, { count }) => generateSheet({ level, range, count }, rng),
    deps: [level, range],
  })

  const title = t('solvex.title')
  const meta = t('solvex.meta', { level: t(`solvex.${level}`), n: range })

  return (
    <div className="tool-panel">
      <SettingsPanel actions={<PanelActions worksheetId="solvex" onRegenerate={regenerate} />}>
        <SettingRow label={t('solvex.level')}>
          <SegmentedControl
            value={level}
            onChange={setLevel}
            options={LEVELS.map(value => ({ value, label: t(`solvex.${value}`) }))}
          />
        </SettingRow>
        <SettingRow label={t('solvex.answers')}>
          <SegmentedControl
            value={range}
            onChange={setRange}
            options={RANGES.map(n => ({ value: n, label: t('fractions.upTo', { n }) }))}
          />
        </SettingRow>
        <SettingRow label={t('divide.notation')}>
          <SegmentedControl
            value={activeNotation}
            onChange={setNotation}
            options={NOTATIONS.map(value => ({ value, label: `${glyph('*', value)} ${glyph('/', value)}` }))}
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

      <NotebookSheet
        sheets={sheets}
        sheetProps={sheetProps}
        setSet={setSet}
        title={title}
        meta={meta}
        answerKey={answerKey}
        answer={p => t('solvex.answer', { x: p.x })}
      >
        {p => (
          <div
            className="colarith-problem solvex-problem"
            aria-label={t('solvex.problemAria', { equation: spoken(p.tokens, activeNotation) })}
          >
            <Equation tokens={p.tokens} notation={activeNotation} />
            {/* Bare ruling for the working: more rows as the level rises. */}
            <div className="solvex-work" style={{ '--solvex-rows': WORK_ROWS[level] }} aria-hidden="true" />
          </div>
        )}
      </NotebookSheet>
    </div>
  )
}
