import { useMemo, useState } from 'react'
import { IconRefresh, IconPrinter } from '@tabler/icons-react'
import { usePersistedState } from '../hooks/usePersistedState'
import './Comparison.css'

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generate tricky comparison pairs where digits are swapped, repeated,
 * or otherwise easy to confuse.
 */
function generateTrickyPair(maxVal) {
  const strategies = []

  // Strategy: swap digits (78 vs 87, 13 vs 31, 123 vs 132)
  strategies.push(() => {
    if (maxVal < 12) return null
    const digits = maxVal <= 99 ? 2 : maxVal <= 999 ? randInt(2, 3) : randInt(2, 4)
    let a
    do {
      a = randInt(10 ** (digits - 1), Math.min(10 ** digits - 1, maxVal))
    } while (a < 10)
    const chars = String(a).split('')
    // find pairs of positions with different digits
    const diffPairs = []
    for (let x = 0; x < chars.length; x++)
      for (let y = x + 1; y < chars.length; y++)
        if (chars[x] !== chars[y]) diffPairs.push([x, y])
    if (diffPairs.length === 0) return null // all digits same (e.g. 11, 333)
    const [pi, pj] = diffPairs[Math.floor(Math.random() * diffPairs.length)]
    const bChars = [...chars];
    [bChars[pi], bChars[pj]] = [bChars[pj], bChars[pi]]
    const b = Number(bChars.join(''))
    if (b === 0 || b > maxVal || b === a || String(b).length !== String(a).length) return null
    return [a, b]
  })

  // Strategy: same digits, different counts (13 vs 33, 12 vs 22, 155 vs 555)
  strategies.push(() => {
    if (maxVal < 11) return null
    const digits = maxVal <= 99 ? 2 : randInt(2, 3)
    const a = randInt(10 ** (digits - 1), Math.min(10 ** digits - 1, maxVal))
    const chars = String(a).split('')
    const pos = randInt(0, chars.length - 1)
    const otherPos = pos === 0 ? 1 : 0
    const bChars = [...chars]
    bChars[pos] = chars[otherPos]
    const b = Number(bChars.join(''))
    if (b === 0 || b > maxVal || b === a || String(b).length !== String(a).length) return null
    return [a, b]
  })

  // Strategy: off-by-one (50 vs 51, 99 vs 100)
  strategies.push(() => {
    const a = randInt(1, maxVal - 1)
    const b = a + 1
    if (b > maxVal) return null
    return [a, b]
  })

  // Strategy: same digit, shifted place value (13 vs 31, 5 vs 50)
  strategies.push(() => {
    if (maxVal < 10) return null
    const a = randInt(1, Math.min(9, Math.floor(maxVal / 10)))
    const b = a * 10 + randInt(0, Math.min(9, maxVal - a * 10))
    if (b > maxVal || b === a) return null
    return [a, b]
  })

  // Strategy: close numbers with repeated digit (33 vs 34, 111 vs 112)
  strategies.push(() => {
    const digit = randInt(1, 9)
    const rep = maxVal >= 100 ? randInt(2, 3) : 2
    const a = Number(String(digit).repeat(rep))
    if (a > maxVal) return null
    const b = a + randInt(1, 3)
    if (b > maxVal) return null
    return [a, b]
  })

  // Try strategies in random order, fall back to plain random
  const order = strategies.sort(() => Math.random() - 0.5)
  for (const fn of order) {
    const pair = fn()
    if (pair) {
      // randomly swap order so answer isn't always the same
      return Math.random() < 0.5 ? pair : [pair[1], pair[0]]
    }
  }

  // fallback: plain random
  const a = randInt(1, maxVal)
  let b
  do { b = randInt(1, maxVal) } while (b === a)
  return [a, b]
}

function generateEqualPair(maxVal) {
  const a = randInt(1, maxVal)
  return [a, a]
}

const PRESETS = [
  { label: 'Within 10', max: 10 },
  { label: 'Within 20', max: 20 },
  { label: 'Within 100', max: 100 },
  { label: 'Within 1000', max: 1000 },
]

export default function Comparison() {
  const [maxVal, setMaxVal] = usePersistedState('compare', 'maxVal', 100)
  const [columns, setColumns] = usePersistedState('compare', 'columns', 3)
  const [seed, setSeed] = useState(0)

  const problemCount = columns === 2 ? 20 : columns === 3 ? 30 : 40

  const problems = useMemo(() => {
    void seed
    const items = []
    for (let i = 0; i < problemCount; i++) {
      // ~15% chance of equal pair to keep kids on their toes
      if (Math.random() < 0.15) {
        const [a, b] = generateEqualPair(maxVal)
        items.push({ a, b, answer: '=' })
      } else {
        const [a, b] = generateTrickyPair(maxVal)
        items.push({ a, b, answer: a > b ? '>' : a < b ? '<' : '=' })
      }
    }
    return items
  }, [maxVal, problemCount, seed])

  return (
    <div className="tool-panel">
      <div className="controls no-print">
        <div className="control-row">
          <label className="control-label">
            Range
            <div className="btn-group" role="group" aria-label="Range">
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

          <label className="control-label">
            Columns
            <div className="btn-group" role="group" aria-label="Columns">
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
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <IconPrinter size={16} stroke={2} /> Print
          </button>
        </div>
      </div>

      <div className={`worksheet print-area cols-${columns}`}>
        <div className="worksheet-header">
          <div className="ws-title">
            Comparison
            <span className="ws-meta">
              {'<  >  ='} · within {maxVal}
            </span>
          </div>
        </div>

        <div
          className="compare-grid"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {problems.map((p, i) => (
            <div key={i} className="compare-item">
              <span className="compare-val">{p.a}</span>
              <span className="blank-slot" />
              <span className="compare-val">{p.b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
