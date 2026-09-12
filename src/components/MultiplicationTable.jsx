import { useId } from 'react'
import { usePersistedState } from '../hooks/usePersistedState'
import { useT } from '../i18n/context'
import { SettingsPanel, SettingRow, CheckboxOption, PanelActions } from './controls/SettingsPanel'
import { useReportEmpty } from './SheetState'
import WorksheetHeader from './WorksheetHeader'
import { useSheetSet } from '../hooks/useSheetSet'
import SheetCopies from './SheetCopies'
import './MultiplicationTable.css'
import { usePreviewScale } from '../hooks/usePreviewScale'
import { asHelpers } from '../lib/rng'

/** The grid for one setting, or null when the range cannot print (backwards, or wider than a page). */
function buildTable({ start, end, fillDiagonal, shuffleHeaders, randomPercent }, rng) {
  if (end <= start || end - start > 14) return null
  const r = asHelpers(rng)

  const numbers = []
  for (let i = start; i <= end; i++) numbers.push(i)

  // Rows and columns are shuffled independently so the sheet cannot be filled
  // in by reading a neighbouring cell and adding one.
  const rows = shuffleHeaders ? r.shuffle(numbers) : numbers
  const cols = shuffleHeaders ? r.shuffle(numbers) : numbers

  const cells = {}
  const offDiag = []

  for (const row of rows) {
    for (const c of cols) {
      const key = `${row}-${c}`
      const product = row * c
      if (fillDiagonal && row === c) {
        cells[key] = product
      } else if (row !== c) {
        offDiag.push({ key, product })
      }
    }
  }

  if (randomPercent > 0) {
    const shuffled = r.shuffle(offDiag)
    const count = Math.floor(shuffled.length * (randomPercent / 100))
    for (let i = 0; i < count; i++) {
      cells[shuffled[i].key] = shuffled[i].product
    }
  }

  return { rows, cols, cells }
}

export default function MultiplicationTable() {
  const t = useT()
  const [start, setStart] = usePersistedState('multiply', 'start', 1)
  const [end, setEnd] = usePersistedState('multiply', 'end', 10)
  const [fillDiagonal, setFillDiagonal] = usePersistedState('multiply', 'fillDiagonal', false)
  const [shuffleHeaders, setShuffleHeaders] = usePersistedState('multiply', 'shuffleHeaders', false)
  const [randomPercent, setRandomPercent] = usePersistedState('multiply', 'randomPercent', 50)
  const [fitRef, fitStyle] = usePreviewScale()
  const sliderId = useId()
  // A backwards range has nothing to print; a range wider than 15 factors
  // makes a grid that no longer fits one page, which the product promises.
  const backwards = end <= start
  const tooWide = !backwards && end - start > 14
  useReportEmpty(backwards || tooWide)

  const { sheets, setSet, regenerate } = useSheetSet(
    rng => buildTable({ start, end, fillDiagonal, shuffleHeaders, randomPercent }, rng),
    [start, end, fillDiagonal, shuffleHeaders, randomPercent],
  )
  const tableData = sheets[0].data

  return (
    <div className="tool-panel">
      <SettingsPanel actions={<PanelActions worksheetId="multiply" onRegenerate={regenerate} showPrint={Boolean(tableData)} />}>
        <SettingRow label={t('common.range')}>
          <div className="range-inputs">
            <input
              type="number"
              value={start}
              min={1}
              max={20}
              onChange={e => setStart(Math.max(1, parseInt(e.target.value) || 1))}
              className="num-input"
              aria-label={t('multiply.rangeStart')}
            />
            <span className="range-sep">{t('multiply.to')}</span>
            <input
              type="number"
              value={end}
              min={2}
              max={50}
              onChange={e => setEnd(Math.max(2, parseInt(e.target.value) || 2))}
              className="num-input"
              aria-label={t('multiply.rangeEnd')}
            />
          </div>
        </SettingRow>
        <SettingRow label={t('multiply.prefill', { pct: randomPercent })} htmlFor={sliderId}>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={100}
            step={5}
            value={randomPercent}
            onChange={e => setRandomPercent(parseInt(e.target.value))}
            className="slider"
          />
        </SettingRow>
        <SettingRow label={t('common.options')}>
          <CheckboxOption checked={fillDiagonal} onChange={setFillDiagonal}>
            {t('multiply.fillDiagonal')}
          </CheckboxOption>
          <CheckboxOption checked={shuffleHeaders} onChange={setShuffleHeaders}>
            {t('multiply.shuffleHeaders')}
          </CheckboxOption>
        </SettingRow>
      </SettingsPanel>

      {!tableData && (
        <p className="sheet-empty no-print" role="status">
          {t(tooWide ? 'multiply.tooWide' : 'multiply.emptyRange')}
        </p>
      )}

      {tableData && (
        <SheetCopies sheets={sheets}>
          {({ set, data: table }, primary) => (
            <div className="sheet-fit" ref={primary ? fitRef : undefined} style={primary ? fitStyle : undefined}>
              <div className="worksheet mult-sheet print-area">
                <WorksheetHeader
                  title={t('multiply.title')}
                  meta={t('multiply.meta', { start, end })}
                  stamp={String(set)}
                  onStampChange={primary ? setSet : undefined}
                />
                <div className="mult-table-wrap" tabIndex={0} role="region" aria-label={t('multiply.tableAria')}>
                <table className="mult-table">
                  <thead>
                    <tr>
                      <th className="corner-cell">×</th>
                      {table.cols.map(n => (
                        <th key={n} className="header-cell">{n}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map(r => (
                      <tr key={r}>
                        <th className="header-cell">{r}</th>
                        {table.cols.map(c => {
                          const key = `${r}-${c}`
                          const val = table.cells[key]
                          return (
                            <td key={c} className={`table-cell ${val != null ? 'filled' : ''}`}>
                              {val ?? ''}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          )}
        </SheetCopies>
      )}
    </div>
  )
}
