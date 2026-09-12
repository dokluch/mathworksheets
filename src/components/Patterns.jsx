import { usePersistedState } from '../hooks/usePersistedState'
import { listRowsPerPage } from '../hooks/useNotebookGrid'
import { useT } from '../i18n/context'
import { SettingsPanel, SettingRow, SegmentedControl, PanelActions } from './controls/SettingsPanel'
import './Patterns.css'
import WorksheetHeader from './WorksheetHeader'
import { useSheetSet } from '../hooks/useSheetSet'
import SheetCopies from './SheetCopies'
import { generateSheet } from '../lib/patterns'
import { usePreviewScale } from '../hooks/usePreviewScale'

const LEVELS = [
  { value: 1, key: 'patterns.easy' },
  { value: 2, key: 'patterns.medium' },
  { value: 3, key: 'patterns.hard' },
]

export default function Patterns() {
  const t = useT()
  const [level, setLevel] = usePersistedState('patterns', 'level', 1)
  const [fitRef, fitStyle] = usePreviewScale()

  // Derived, not fixed: the old hard-coded 12 overflowed onto a second page.
  const rowCount = listRowsPerPage()

  const { sheets, setSet, regenerate } = useSheetSet(
    rng => generateSheet(rowCount, level, rng),
    [level, rowCount],
  )

  return (
    <div className="tool-panel">
      <SettingsPanel actions={<PanelActions worksheetId="patterns" onRegenerate={regenerate} />}>
        <SettingRow label={t('common.difficulty')}>
          <SegmentedControl
            value={level}
            onChange={setLevel}
            options={LEVELS.map(l => ({ value: l.value, label: t(l.key) }))}
          />
        </SettingRow>
      </SettingsPanel>

      <SheetCopies sheets={sheets}>
        {({ set, data: rows }, primary) => (
          <div className="sheet-fit" ref={primary ? fitRef : undefined} style={primary ? fitStyle : undefined}>
            <div className="worksheet print-area">
              <WorksheetHeader
                title={t('patterns.title')}
                meta={t(LEVELS.find(l => l.value === level)?.key ?? 'patterns.easy')}
                instructions={t('patterns.instructions')}
                stamp={String(set)}
                onStampChange={primary ? setSet : undefined}
              />

              <div className="pattern-list">
                {rows.map((row, i) => (
                  <div key={i} className="pattern-row">
                    <div className="pattern-seq">
                      {row.seq.map((val, j) => (
                        <span key={j} className="pattern-cell">
                          {row.blanks.includes(j) ? (
                            <span className="blank-slot" />
                          ) : (
                            <span className="pattern-val">{String(val)}</span>
                          )}
                          {j < row.seq.length - 1 && <span className="pattern-comma">,</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </SheetCopies>
    </div>
  )
}
