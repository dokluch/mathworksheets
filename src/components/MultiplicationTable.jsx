import { useId, useMemo, useState } from 'react'
import { usePersistedState } from '../hooks/usePersistedState'
import { useT } from '../i18n/context'
import { SettingsPanel, SettingRow, CheckboxOption, PanelActions } from './controls/SettingsPanel'
import './MultiplicationTable.css'

function shuffleArray(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function MultiplicationTable() {
  const t = useT()
  const [start, setStart] = usePersistedState('multiply', 'start', 1)
  const [end, setEnd] = usePersistedState('multiply', 'end', 10)
  const [fillDiagonal, setFillDiagonal] = usePersistedState('multiply', 'fillDiagonal', false)
  const [shuffleHeaders, setShuffleHeaders] = usePersistedState('multiply', 'shuffleHeaders', false)
  const [randomPercent, setRandomPercent] = usePersistedState('multiply', 'randomPercent', 50)
  const [seed, setSeed] = useState(0)
  const sliderId = useId()

  const tableData = useMemo(() => {
    if (end <= start) return null
    void seed // depend on seed for re-randomization

    const numbers = []
    for (let i = start; i <= end; i++) numbers.push(i)

    // Rows and columns are shuffled independently so the sheet cannot be filled
    // in by reading a neighbouring cell and adding one.
    const rows = shuffleHeaders ? shuffleArray(numbers) : numbers
    const cols = shuffleHeaders ? shuffleArray(numbers) : numbers

    const cells = {}
    const offDiag = []

    for (const r of rows) {
      for (const c of cols) {
        const key = `${r}-${c}`
        const product = r * c
        if (fillDiagonal && r === c) {
          cells[key] = product
        } else if (r !== c) {
          offDiag.push({ key, product })
        }
      }
    }

    if (randomPercent > 0) {
      const shuffled = shuffleArray(offDiag)
      const count = Math.floor(shuffled.length * (randomPercent / 100))
      for (let i = 0; i < count; i++) {
        cells[shuffled[i].key] = shuffled[i].product
      }
    }

    return { rows, cols, cells }
  }, [start, end, fillDiagonal, shuffleHeaders, randomPercent, seed])

  return (
    <div className="tool-panel">
      <SettingsPanel actions={<PanelActions worksheetId="multiply" onRegenerate={() => setSeed(s => s + 1)} showPrint={Boolean(tableData)} />}>
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

      {tableData && (
        <div className="mult-table-wrap print-area" tabIndex={0} role="region" aria-label={t('multiply.tableAria')}>
          <table className="mult-table">
            <thead>
              <tr>
                <th className="corner-cell">×</th>
                {tableData.cols.map(n => (
                  <th key={n} className="header-cell">{n}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map(r => (
                <tr key={r}>
                  <th className="header-cell">{r}</th>
                  {tableData.cols.map(c => {
                    const key = `${r}-${c}`
                    const val = tableData.cells[key]
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
      )}
    </div>
  )
}
