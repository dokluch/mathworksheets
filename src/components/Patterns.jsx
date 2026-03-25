import { useMemo, useState } from 'react'
import { IconRefresh, IconPrinter } from '@tabler/icons-react'
import { usePersistedState } from '../hooks/usePersistedState'
import './Patterns.css'

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Level 1 (Easy): constant step — add or subtract a fixed number
 * e.g. 2, 5, 8, 11, __, __
 */
function generateLevel1() {
  const step = pick([2, 3, 4, 5, 10])
  const direction = Math.random() < 0.8 ? 1 : -1 // mostly ascending
  const start = direction === 1
    ? randInt(1, 20)
    : randInt(step * 6, step * 10)
  const length = 8
  const blanks = 2
  const seq = []
  for (let i = 0; i < length; i++) {
    seq.push(start + direction * step * i)
  }
  // blank out the last `blanks` positions
  const blankPositions = new Set()
  // always blank the last 2
  for (let i = length - blanks; i < length; i++) blankPositions.add(i)
  // also blank 1 random earlier position sometimes
  if (Math.random() < 0.4) {
    blankPositions.add(randInt(2, length - blanks - 1))
  }
  return {
    seq,
    blankPositions,
    rule: `${direction === 1 ? '+' : '−'}${step}`,
  }
}

/**
 * Level 2 (Medium): multiply, or alternating steps
 * e.g. 2, 4, 8, 16, __, __ (×2)
 * e.g. 1, 3, 2, 4, 3, 5, __, __ (alternating +2, −1)
 */
function generateLevel2() {
  const type = pick(['multiply', 'alternating'])

  if (type === 'multiply') {
    const factor = pick([2, 3])
    const start = randInt(1, 4)
    const length = 7
    const seq = [start]
    for (let i = 1; i < length; i++) {
      seq.push(seq[i - 1] * factor)
    }
    if (seq[seq.length - 1] > 100000) return generateLevel1() // safety fallback
    const blankPositions = new Set([length - 2, length - 1])
    if (Math.random() < 0.3) blankPositions.add(randInt(2, length - 3))
    return { seq, blankPositions, rule: `×${factor}` }
  }

  // alternating: two steps that alternate
  const stepA = pick([2, 3, 5])
  const stepB = pick([1, 2])
  const start = randInt(1, 10)
  const length = 8
  const seq = [start]
  for (let i = 1; i < length; i++) {
    if (i % 2 === 1) seq.push(seq[i - 1] + stepA)
    else seq.push(seq[i - 1] - stepB)
  }
  if (seq.some(v => v < 0)) return generateLevel1() // safety
  const blankPositions = new Set([length - 2, length - 1])
  return { seq, blankPositions, rule: `+${stepA}/−${stepB}` }
}

/**
 * Level 3 (Hard): growing step, square numbers, fibonacci-like, or repeat-pattern
 * e.g. 1, 2, 4, 7, 11, 16, __, __ (+1, +2, +3, +4, ...)
 * e.g. 1, 4, 9, 16, __, __ (squares)
 * e.g. 1, 1, 2, 3, 5, 8, __, __ (fib)
 */
function generateLevel3() {
  const type = pick(['growing', 'squares', 'fibonacci'])

  if (type === 'growing') {
    const start = randInt(1, 5)
    const baseStep = randInt(1, 2)
    const length = 8
    const seq = [start]
    let step = baseStep
    for (let i = 1; i < length; i++) {
      seq.push(seq[i - 1] + step)
      step++
    }
    const blankPositions = new Set([length - 2, length - 1])
    if (Math.random() < 0.4) blankPositions.add(randInt(3, length - 3))
    return { seq, blankPositions, rule: '+1,+2,+3…' }
  }

  if (type === 'squares') {
    const offset = pick([0, 1])
    const length = 7
    const seq = []
    for (let i = 0; i < length; i++) {
      seq.push((i + 1 + offset) ** 2)
    }
    const blankPositions = new Set([length - 2, length - 1])
    return { seq, blankPositions, rule: 'n²' }
  }

  // fibonacci-like
  const a = randInt(1, 3)
  const b = randInt(1, 4)
  const length = 8
  const seq = [a, b]
  for (let i = 2; i < length; i++) {
    seq.push(seq[i - 1] + seq[i - 2])
  }
  const blankPositions = new Set([length - 2, length - 1])
  if (Math.random() < 0.3) blankPositions.add(randInt(3, length - 3))
  return { seq, blankPositions, rule: 'a+b=c' }
}

const LEVELS = [
  { value: 1, label: 'Easy' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'Hard' },
]

const generators = { 1: generateLevel1, 2: generateLevel2, 3: generateLevel3 }

export default function Patterns() {
  const [level, setLevel] = usePersistedState('patterns', 'level', 1)
  const [seed, setSeed] = useState(0)

  const rowCount = 12

  const rows = useMemo(() => {
    void seed
    const items = []
    for (let i = 0; i < rowCount; i++) {
      items.push(generators[level]())
    }
    return items
  }, [level, rowCount, seed])

  return (
    <div className="tool-panel">
      <div className="controls no-print">
        <div className="control-row">
          <label className="control-label">
            Difficulty
            <div className="btn-group" role="group" aria-label="Difficulty">
              {LEVELS.map(l => (
                <button
                  key={l.value}
                  className={`btn-toggle ${level === l.value ? 'active' : ''}`}
                  onClick={() => setLevel(l.value)}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </label>
        </div>

        <div className="control-actions">
          <button className="btn btn-primary" onClick={() => setSeed(s => s + 1)}>
            <IconRefresh size={16} stroke={2} /> Regenerate
          </button>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <IconPrinter size={16} stroke={2} /> Print
          </button>
        </div>
      </div>

      <div className="worksheet print-area">
        <div className="worksheet-header">
          <div className="ws-title">
            Number Patterns
            <span className="ws-meta">
              {LEVELS.find(l => l.value === level)?.label}
            </span>
          </div>
          <p className="ws-instructions">Fill in the missing numbers in each sequence.</p>
        </div>

        <div className="pattern-list">
          {rows.map((row, i) => (
            <div key={i} className="pattern-row">
              <span className="pattern-num">{i + 1}.</span>
              <div className="pattern-seq">
                {row.seq.map((val, j) => (
                  <span key={j} className="pattern-cell">
                    {row.blankPositions.has(j) ? (
                      <span className="blank-slot" />
                    ) : (
                      <span className="pattern-val">{val.toLocaleString()}</span>
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
  )
}
