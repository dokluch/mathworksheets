import { useMemo, useState } from 'react'
import { IconTable, IconPrinter, IconRefresh } from '@tabler/icons-react'
import { usePersistedState } from '../hooks/usePersistedState'
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
  const [start, setStart] = usePersistedState('multiply', 'start', 1)
  const [end, setEnd] = usePersistedState('multiply', 'end', 10)
  const [fillDiagonal, setFillDiagonal] = usePersistedState('multiply', 'fillDiagonal', false)
  const [randomPercent, setRandomPercent] = usePersistedState('multiply', 'randomPercent', 50)
  const [seed, setSeed] = useState(0)

  const tableData = useMemo(() => {
    if (end <= start) return null
    void seed // depend on seed for re-randomization

    const numbers = []
    for (let i = start; i <= end; i++) numbers.push(i)

    const cells = {}
    const offDiag = []

    for (const r of numbers) {
      for (const c of numbers) {
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

    return { numbers, cells }
  }, [start, end, fillDiagonal, randomPercent, seed])

  return (
    <div className="tool-panel">
      <div className="controls no-print">
        <div className="control-row">
          <label className="control-label">
            Range
            <div className="range-inputs">
              <input
                type="number"
                value={start}
                min={1}
                max={20}
                onChange={e => setStart(Math.max(1, parseInt(e.target.value) || 1))}
                className="num-input"
              />
              <span className="range-sep">to</span>
              <input
                type="number"
                value={end}
                min={2}
                max={50}
                onChange={e => setEnd(Math.max(2, parseInt(e.target.value) || 2))}
                className="num-input"
              />
            </div>
          </label>

          <label className="control-label">
            <span className="checkbox-label">
              <input
                type="checkbox"
                checked={fillDiagonal}
                onChange={e => setFillDiagonal(e.target.checked)}
              />
              Fill diagonal
            </span>
          </label>

          <label className="control-label">
            Pre-fill {randomPercent}%
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={randomPercent}
              onChange={e => setRandomPercent(parseInt(e.target.value))}
              className="slider"
            />
          </label>
        </div>

        <div className="control-actions">
          <button className="btn btn-primary" onClick={() => setSeed(s => s + 1)}>
            <IconRefresh size={16} stroke={2} /> Regenerate
          </button>
          {tableData && (
            <button className="btn btn-secondary" onClick={() => window.print()}>
              <IconPrinter size={16} stroke={2} /> Print
            </button>
          )}
        </div>
      </div>

      {tableData && (
        <div className="mult-table-wrap print-area">
          <table className="mult-table">
            <thead>
              <tr>
                <th className="corner-cell">×</th>
                {tableData.numbers.map(n => (
                  <th key={n} className="header-cell">{n}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.numbers.map(r => (
                <tr key={r}>
                  <th className="header-cell">{r}</th>
                  {tableData.numbers.map(c => {
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
