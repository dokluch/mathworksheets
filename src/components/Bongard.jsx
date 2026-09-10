import { useMemo, useState } from 'react'
import { usePersistedState } from '../hooks/usePersistedState'
import { useT } from '../i18n/context'
import { SettingsPanel, SettingRow, SegmentedControl, CheckboxOption, PanelActions } from './controls/SettingsPanel'
import './Bongard.css'
import WorksheetHeader from './WorksheetHeader'
import AnswerKey from './AnswerKey'
import { setStamp } from '../lib/setStamp'
import { usePreviewScale } from '../hooks/usePreviewScale'
import { BANDS, PER_PAGE, generateSheet } from '../lib/bongard/index.js'
import { ProblemFigure } from '../lib/bongard/render.jsx'

/**
 * Bongard problems: six boxes on the left obey a rule, six on the right break
 * it, and the child says what the rule is. Every problem is
 * generated from its rule at render time, so Regenerate gives the same rules
 * in new drawings — the figures change, the idea does not.
 */
export default function Bongard() {
  const t = useT()
  const [perPage, setPerPage] = usePersistedState('bongard', 'perPage', 4)
  const [band, setBand] = usePersistedState('bongard', 'band', 'all')
  const [answerKey, setAnswerKey] = usePersistedState('bongard', 'answerKey', false)
  const [seed, setSeed] = useState(0)
  const [fitRef, fitStyle] = usePreviewScale()

  const problems = useMemo(() => {
    void seed // depend on seed for re-randomization
    return generateSheet(perPage, band)
  }, [perPage, band, seed])

  const stamp = setStamp(problems)

  return (
    <div className="tool-panel">
      <SettingsPanel actions={<PanelActions worksheetId="bongard" onRegenerate={() => setSeed(s => s + 1)} />}>
        <SettingRow label={t('bongard.perPage')}>
          <SegmentedControl
            value={perPage}
            onChange={setPerPage}
            options={PER_PAGE.map(n => ({ value: n, label: String(n) }))}
          />
        </SettingRow>
        <SettingRow label={t('common.difficulty')}>
          <SegmentedControl
            value={band}
            onChange={setBand}
            options={['all', ...BANDS].map(b => ({ value: b, label: t(`bongard.${b}`) }))}
          />
        </SettingRow>
        <SettingRow label={t('common.options')}>
          <CheckboxOption checked={answerKey} onChange={setAnswerKey}>
            {t('common.answerKeyOption')}
          </CheckboxOption>
        </SettingRow>
      </SettingsPanel>

      <div className="sheet-fit" ref={fitRef} style={fitStyle}>
        <div className={`worksheet print-area bongard-sheet bongard-per-${perPage}`}>
          <WorksheetHeader
            title={t('bongard.title')}
            meta={band === 'all' ? undefined : t(`bongard.${band}`)}
            instructions={t('bongard.instructions')}
            stamp={stamp}
          />

          <div className="bongard-grid">
            {problems.map((p, i) => (
              <div key={`${p.id}-${i}`} className="bongard-item">
                <ProblemFigure
                  className="bongard-figure"
                  problem={p}
                  label={t('bongard.figureLabel', { n: String(i + 1) })}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {answerKey && (
        <AnswerKey
          title={t('bongard.title')}
          stamp={stamp}
          answers={problems.map(p => t(p.rule))}
        />
      )}
    </div>
  )
}
