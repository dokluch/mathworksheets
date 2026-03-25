import { useMemo, useState } from 'react'
import { IconRefresh, IconPrinter } from '@tabler/icons-react'
import { usePersistedState } from '../hooks/usePersistedState'
import './AddSubtract.css'

const PRESETS = [
  { label: 'Within 10', max: 10 },
  { label: 'Within 20', max: 20 },
  { label: 'Within 100', max: 100 },
  { label: 'Within 1000', max: 1000 },
]

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateProblem(ops, maxVal) {
  const opList = []
  if (ops === 'add' || ops === 'both') opList.push('+')
  if (ops === 'sub' || ops === 'both') opList.push('-')
  const op = opList[Math.floor(Math.random() * opList.length)]

  let a, b, result
  if (op === '+') {
    result = randInt(2, maxVal)
    a = randInt(1, result - 1)
    b = result - a
  } else {
    a = randInt(2, maxVal)
    b = randInt(1, a - 1)
    result = a - b
  }

  // Randomly choose blank position: left operand, right operand, or result
  const blankPos = Math.floor(Math.random() * 3)

  // Randomly choose format: normal (a op b = result) or reversed (result = a op b)
  const reversed = Math.random() < 0.3

  return { a, b, op, result, blankPos, reversed }
}

const Blank = () => <span className="blank-slot" />

function renderProblem(p) {
  const left = p.blankPos === 0 ? <Blank /> : <span className="val">{p.a}</span>
  const right = p.blankPos === 1 ? <Blank /> : <span className="val">{p.b}</span>
  const res = p.blankPos === 2 ? <Blank /> : <span className="val">{p.result}</span>

  const expr = <>{left} <span className="op">{p.op}</span> {right}</>
  if (p.reversed) {
    return <>{res} <span className="op">=</span> {expr}</>
  }
  return <>{expr} <span className="op">=</span> {res}</>
}

export default function AddSubtract() {
  const [ops, setOps] = usePersistedState('addsub', 'ops', 'both')
  const [maxVal, setMaxVal] = usePersistedState('addsub', 'maxVal', 100)
  const [columns, setColumns] = usePersistedState('addsub', 'columns', 3)
  const [seed, setSeed] = useState(0)

  const problemCount = columns === 2 ? 20 : columns === 3 ? 30 : 40

  const problems = useMemo(() => {
    void seed // depend on seed for re-randomization
    const items = []
    for (let i = 0; i < problemCount; i++) {
      items.push(generateProblem(ops, maxVal))
    }
    return items
  }, [ops, maxVal, problemCount, seed])

  return (
    <div className="tool-panel">
      <div className="controls no-print">
        <div className="control-row">
          <label className="control-label">
            Operation
            <div className="btn-group">
              {[
                { value: 'add', label: '+' },
                { value: 'sub', label: '−' },
                { value: 'both', label: '+ / −' },
              ].map(o => (
                <button
                  key={o.value}
                  className={`btn-toggle ${ops === o.value ? 'active' : ''}`}
                  onClick={() => setOps(o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </label>

          <label className="control-label">
            Limit
            <div className="btn-group">
              {PRESETS.map(p => (
                <button
                  key={p.max}
                  className={`btn-toggle ${maxVal === p.max ? 'active' : ''}`}
                  onClick={() => setMaxVal(p.max)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </label>
        </div>

        <div className="control-row">
          <label className="control-label">
            Columns
            <div className="btn-group">
              {[2, 3, 4].map(c => (
                <button
                  key={c}
                  className={`btn-toggle ${columns === c ? 'active' : ''}`}
                  onClick={() => setColumns(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </label>

        </div>

        <div className="control-actions">
          <button className="btn btn-primary" onClick={() => setSeed(s => s + 1)}>
            <IconRefresh size={16} stroke={2} /> Regenerate
          </button>
          {problems && (
            <button className="btn btn-secondary" onClick={() => window.print()}>
              <IconPrinter size={16} stroke={2} /> Print
            </button>
          )}
        </div>
      </div>

      {problems && (
        <div className={`worksheet print-area cols-${columns}`}>
          <div className="worksheet-header">
            <div className="ws-title">
              Addition & Subtraction
              <span className="ws-meta">
                {ops === 'add' ? '(+)' : ops === 'sub' ? '(−)' : '(+ / −)'}
                {' · '}within {maxVal}
              </span>
            </div>
          </div>

          <div
            className="problem-grid"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {problems.map((p, i) => (
              <div key={i} className="problem-item">
                <span className="problem-text">{renderProblem(p)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
