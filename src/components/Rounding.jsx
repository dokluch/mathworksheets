import { useMemo, useState } from 'react'
import { usePersistedState } from '../hooks/usePersistedState'
import { useT } from '../i18n/context'
import { SettingsPanel, SettingRow, SegmentedControl, CheckboxOption, PanelActions } from './controls/SettingsPanel'
import './Rounding.css'
import WorksheetHeader from './WorksheetHeader'
import { setStamp } from '../lib/setStamp'
import AnswerKey from './AnswerKey'
import { usePreviewScale } from '../hooks/usePreviewScale'

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateRoundingProblem(place) {
  // place: 10, 100, or 1000
  let n
  if (place === 10) {
    // Two-digit numbers: round 12→10, 67→70
    do { n = randInt(1, 99) } while (n % 10 === 0)
  } else if (place === 100) {
    // Three-digit numbers: round 234→200, 678→700
    do { n = randInt(10, 999) } while (n % 100 === 0)
  } else {
    // Four-digit numbers: round 1234→1000, 6789→7000
    do { n = randInt(100, 9999) } while (n % 1000 === 0)
  }

  const rounded = Math.round(n / place) * place
  return { n, place, rounded }
}

const PLACES = [10, 100, 1000]

export default function Rounding() {
  const t = useT()
  const [place, setPlace] = usePersistedState('rounding', 'place', 10)
  const [columns, setColumns] = usePersistedState('rounding', 'columns', 3)
  const [answerKey, setAnswerKey] = usePersistedState('rounding', 'answerKey', false)
  const [seed, setSeed] = useState(0)
  const [fitRef, fitStyle] = usePreviewScale()

  const problemCount = columns === 2 ? 20 : columns === 3 ? 30 : 40

  const problems = useMemo(() => {
    void seed
    const items = []
    for (let i = 0; i < problemCount; i++) {
      items.push(generateRoundingProblem(place))
    }
    return items
  }, [place, problemCount, seed])

  return (
    <div className="tool-panel">
      <SettingsPanel actions={<PanelActions worksheetId="rounding" onRegenerate={() => setSeed(s => s + 1)} />}>
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

      <div className="sheet-fit" ref={fitRef} style={fitStyle}>
        <div className={`worksheet print-area cols-${columns}`}>
          <WorksheetHeader
            title={t('rounding.title')}
            meta={t('rounding.meta', { n: place })}
            stamp={setStamp(problems)}
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

      {answerKey && (
        <AnswerKey
          title={t('rounding.title')}
          stamp={setStamp(problems)}
          answers={problems.map(p => String(p.rounded))}
        />
      )}
    </div>
  )
}
