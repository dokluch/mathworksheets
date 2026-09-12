import { usePersistedState } from '../hooks/usePersistedState'
import { useT } from '../i18n/context'
import { SettingsPanel, SettingRow, SegmentedControl, CheckboxOption, PanelActions } from './controls/SettingsPanel'
import './Rounding.css'
import WorksheetHeader from './WorksheetHeader'
import { useSheetSet } from '../hooks/useSheetSet'
import SheetCopies from './SheetCopies'
import AnswerKey from './AnswerKey'
import { asHelpers } from '../lib/rng'
import { usePreviewScale } from '../hooks/usePreviewScale'

function generateRoundingProblem(place, r) {
  // place: 10, 100, or 1000
  let n
  if (place === 10) {
    // Two-digit numbers: round 12→10, 67→70
    do { n = r.int(1, 99) } while (n % 10 === 0)
  } else if (place === 100) {
    // Three-digit numbers: round 234→200, 678→700
    do { n = r.int(10, 999) } while (n % 100 === 0)
  } else {
    // Four-digit numbers: round 1234→1000, 6789→7000
    do { n = r.int(100, 9999) } while (n % 1000 === 0)
  }

  const rounded = Math.round(n / place) * place
  return { n, place, rounded }
}

function generateSheet(count, place, rng) {
  const r = asHelpers(rng)
  return Array.from({ length: count }, () => generateRoundingProblem(place, r))
}

const PLACES = [10, 100, 1000]

export default function Rounding() {
  const t = useT()
  const [place, setPlace] = usePersistedState('rounding', 'place', 10)
  const [columns, setColumns] = usePersistedState('rounding', 'columns', 3)
  const [answerKey, setAnswerKey] = usePersistedState('rounding', 'answerKey', false)
  const [fitRef, fitStyle] = usePreviewScale()

  const problemCount = columns === 2 ? 20 : columns === 3 ? 30 : 40

  const { sheets, setSet, regenerate } = useSheetSet(
    rng => generateSheet(problemCount, place, rng),
    [place, problemCount],
  )

  return (
    <div className="tool-panel">
      <SettingsPanel actions={<PanelActions worksheetId="rounding" onRegenerate={regenerate} />}>
        <SettingRow label={t('rounding.roundTo')}>
          <SegmentedControl
            value={place}
            onChange={setPlace}
            options={PLACES.map(p => ({ value: p, label: t('rounding.nearest', { n: p }) }))}
          />
        </SettingRow>
        <SettingRow label={t('common.columns')}>
          <SegmentedControl value={columns} onChange={setColumns} options={[2, 3, 4].map(c => ({ value: c, label: c }))} />
        </SettingRow>
        <SettingRow label={t('common.options')}>
          <CheckboxOption checked={answerKey} onChange={setAnswerKey}>
            {t('common.answerKeyOption')}
          </CheckboxOption>
        </SettingRow>
      </SettingsPanel>

      <SheetCopies sheets={sheets}>
        {({ set, data: problems }, primary) => (
          <div className="sheet-fit" ref={primary ? fitRef : undefined} style={primary ? fitStyle : undefined}>
            <div className={`worksheet print-area cols-${columns}`}>
              <WorksheetHeader
                title={t('rounding.title')}
                meta={t('rounding.meta', { n: place })}
                stamp={String(set)}
                onStampChange={primary ? setSet : undefined}
              />

              <div
                className="rounding-grid"
                style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
              >
                {problems.map((p, i) => (
                  <div key={i} className="rounding-item">
                    <span className="rounding-number">{String(p.n)}</span>
                    <span className="rounding-arrow">≈</span>
                    <span className="blank-slot" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </SheetCopies>

      {answerKey && sheets.map(({ set, data: problems }, i) => (
        <AnswerKey
          key={i}
          title={t('rounding.title')}
          stamp={String(set)}
          answers={problems.map(p => String(p.rounded))}
        />
      ))}
    </div>
  )
}
