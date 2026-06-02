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

const SIXTY_SEVEN_ANSWER = 67

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getOpList(ops) {
  const opList = []
  if (ops === 'add' || ops === 'both') opList.push('+')
  if (ops === 'sub' || ops === 'both') opList.push('-')
  return opList
}

function chooseOp(ops) {
  const opList = getOpList(ops)
  return opList[Math.floor(Math.random() * opList.length)]
}

function generateProblem(ops, maxVal) {
  const op = chooseOp(ops)

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

function getBlankAnswer(problem) {
  if (problem.blankPos === 0) return problem.a
  if (problem.blankPos === 1) return problem.b
  return problem.result
}

function generateProblemAvoidingAnswer(answer, ops, maxVal) {
  for (let attempt = 0; attempt < 20; attempt++) {
    const problem = generateProblem(ops, maxVal)
    if (getBlankAnswer(problem) !== answer) return problem
  }

  return generateProblemWithAnswer(answer === 2 ? 3 : 2, ops, maxVal)
}

function generateProblemWithAnswer(answer, ops, maxVal) {
  const op = chooseOp(ops)
  const blankPos = Math.floor(Math.random() * 3)
  const reversed = Math.random() < 0.3
  const effectiveMax = Math.max(maxVal, answer + 1)

  let a, b, result

  if (op === '+') {
    if (blankPos === 0) {
      a = answer
      result = randInt(answer + 1, effectiveMax)
      b = result - a
    } else if (blankPos === 1) {
      b = answer
      result = randInt(answer + 1, effectiveMax)
      a = result - b
    } else {
      result = answer
      a = randInt(1, answer - 1)
      b = result - a
    }
  } else {
    if (blankPos === 0) {
      a = answer
      b = randInt(1, answer - 1)
      result = a - b
    } else if (blankPos === 1) {
      b = answer
      a = randInt(answer + 1, effectiveMax)
      result = a - b
    } else {
      result = answer
      a = randInt(answer + 1, effectiveMax)
      b = a - result
    }
  }

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

function renderStackedProblem(p) {
  const aDisplay = p.blankPos === 0 ? <Blank /> : <span className="val">{p.a}</span>
  const bDisplay = p.blankPos === 1 ? <Blank /> : <span className="val">{p.b}</span>
  const resDisplay = p.blankPos === 2 ? <Blank /> : <span className="val">{p.result}</span>

  return (
    <div className="stacked-problem">
      <div className="stacked-row stacked-top">{aDisplay}</div>
      <div className="stacked-row stacked-mid">
        <span className="op">{p.op}</span>{bDisplay}
      </div>
      <div className="stacked-line" />
      <div className="stacked-row stacked-bottom">{resDisplay}</div>
    </div>
  )
}

export default function AddSubtract() {
  const [ops, setOps] = usePersistedState('addsub', 'ops', 'both')
  const [maxVal, setMaxVal] = usePersistedState('addsub', 'maxVal', 100)
  const [columns, setColumns] = usePersistedState('addsub', 'columns', 3)
  const [layout, setLayout] = usePersistedState('addsub', 'layout', 'inline')
  const [sixtySevenMode, setSixtySevenMode] = usePersistedState('addsub', 'sixtySevenMode', true)
  const [seed, setSeed] = useState(0)

  const stackedCounts = { 2: 14, 3: 18, 4: 24 }
  const inlineCounts = { 2: 20, 3: 30, 4: 40 }
  const problemCount = layout === 'stacked'
    ? (stackedCounts[columns] || 18)
    : (inlineCounts[columns] || 30)

  const problems = useMemo(() => {
    void seed // depend on seed for re-randomization
    const useSixtySevenMode = sixtySevenMode && (columns === 2 || columns === 3)
    const items = []
    for (let i = 0; i < problemCount; i++) {
      items.push(
        useSixtySevenMode
          ? generateProblemAvoidingAnswer(SIXTY_SEVEN_ANSWER, ops, maxVal)
          : generateProblem(ops, maxVal)
      )
    }
    if (useSixtySevenMode) {
      const rows = Math.floor(problemCount / columns)
      for (let column = 0; column < columns; column++) {
        const row = randInt(0, rows - 1)
        items[row * columns + column] = generateProblemWithAnswer(SIXTY_SEVEN_ANSWER, ops, maxVal)
      }
    }
    return items
  }, [ops, maxVal, columns, problemCount, seed, sixtySevenMode])

  return (
    <div className="tool-panel">
      <div className="controls no-print">
        <div className="control-row">
          <label className="control-label">
            Operation
            <div className="btn-group" role="group" aria-label="Operation">
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
            <div className="btn-group" role="group" aria-label="Limit">
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
            Layout
            <div className="btn-group">
              {[
                { value: 'inline', label: 'Inline' },
                { value: 'stacked', label: 'Stacked' },
              ].map(l => (
                <button
                  key={l.value}
                  className={`btn-toggle ${layout === l.value ? 'active' : ''}`}
                  onClick={() => setLayout(l.value)}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </label>

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

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={sixtySevenMode}
              onChange={event => setSixtySevenMode(event.target.checked)}
            />
            67 mode
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
            className={`problem-grid ${layout === 'stacked' ? 'stacked-grid' : ''}`}
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {problems.map((p, i) => (
              <div key={i} className={`problem-item ${layout === 'stacked' ? 'problem-item-stacked' : ''}`}>
                {layout === 'stacked'
                  ? renderStackedProblem(p)
                  : <span className="problem-text">{renderProblem(p)}</span>
                }
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
