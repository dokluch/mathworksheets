import { useMemo, useState, useRef, useCallback, useEffect } from 'react'
import { IconRefresh, IconCheck, IconArrowRight, IconPlayerPlay } from '@tabler/icons-react'
import { usePersistedState } from '../hooks/usePersistedState'
import './EquationExplorer.css'

// ── Helpers ──

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateProblem(ops, range = 10) {
  const opList = []
  if (ops === 'add' || ops === 'both') opList.push('+')
  if (ops === 'sub' || ops === 'both') opList.push('-')
  const op = opList[Math.floor(Math.random() * opList.length)]

  let a, b, result
  if (op === '+') {
    result = randInt(2, range)
    a = randInt(1, result - 1)
    b = result - a
  } else {
    a = randInt(2, range)
    b = randInt(1, a - 1)
    result = a - b
  }

  const blankOptions = ['a', 'b', 'result']
  const blankPos = blankOptions[Math.floor(Math.random() * 3)]

  return { a, b, op, result, blankPos, range }
}

/** Get the correct answer for the blank position */
function getAnswer(problem) {
  if (problem.blankPos === 'a') return problem.a
  if (problem.blankPos === 'b') return problem.b
  return problem.result
}

/**
 * Build initial signed-term array from problem.
 * Each term: { id, value, sign: '+'|'-', side: 'left'|'right', isBlank }
 * Equation: a op b = result → left: [+a, ±b], right: [+result]
 */
function buildInitialTerms(problem) {
  const { a, b, op, result, blankPos } = problem
  return [
    { id: 'a', value: a, sign: '+', side: 'left', isBlank: blankPos === 'a' },
    { id: 'b', value: b, sign: op === '+' ? '+' : '-', side: 'left', isBlank: blankPos === 'b' },
    { id: 'result', value: result, sign: '+', side: 'right', isBlank: blankPos === 'result' },
  ]
}

/** Flip a term to the other side (sign inverts) */
function flipTerm(terms, termId) {
  return terms.map(t =>
    t.id === termId
      ? { ...t, side: t.side === 'left' ? 'right' : 'left', sign: t.sign === '+' ? '-' : '+' }
      : t
  )
}

/** Move a term to a different index in the array (reorder within same side) */
function reorderTerm(terms, termId, targetIndex) {
  const currentIndex = terms.findIndex(t => t.id === termId)
  if (currentIndex === -1 || currentIndex === targetIndex) return terms
  const next = [...terms]
  const [moved] = next.splice(currentIndex, 1)
  next.splice(targetIndex > currentIndex ? targetIndex - 1 : targetIndex, 0, moved)
  return next
}

/** Get display arrays from terms */
function getDisplay(terms) {
  const left = terms.filter(t => t.side === 'left')
  const right = terms.filter(t => t.side === 'right')
  return { left, right }
}

/** Render sign for a term at given position in its side */
function displaySign(term, isFirst) {
  if (isFirst) return term.sign === '-' ? '−' : null // hide leading +
  return term.sign === '+' ? '+' : '−'
}

// ── Number Line component ──

function NumberLine({ problem }) {
  const { a, b, op, result, range = 10 } = problem

  // Build jump steps: decompose into place-value jumps for range >= 100
  const color = op === '+' ? 'var(--color-accent-green)' : 'var(--color-accent-red)'
  const colorAlt = op === '+' ? 'var(--color-accent-purple)' : 'var(--color-accent-orange)'
  const arrowId = op === '+' ? 'green' : 'red'
  const arrowIdAlt = op === '+' ? 'purple' : 'orange'

  const jumps = []
  if (range >= 100 && b >= 10) {
    // Split b into hundreds, tens, ones
    const hundreds = Math.floor(b / 100) * 100
    const tens = Math.floor((b % 100) / 10) * 10
    const ones = b % 10
    const parts = []
    if (hundreds > 0) parts.push(hundreds)
    if (tens > 0) parts.push(tens)
    if (ones > 0) parts.push(ones)

    let cursor = a
    const colors = [color, colorAlt, color]
    const arrows = [arrowId, arrowIdAlt, arrowId]
    parts.forEach((part, idx) => {
      const next = op === '+' ? cursor + part : cursor - part
      const sign = op === '+' ? '+' : '−'
      jumps.push({ from: cursor, to: next, label: `${sign}${part}`, color: colors[idx % colors.length], arrowId: arrows[idx % arrows.length], delay: 0.2 + idx * 0.7 })
      cursor = next
    })
  } else {
    const label = op === '+' ? `+${b}` : `−${b}`
    jumps.push({ from: a, to: result, label, color, arrowId, delay: 0.2 })
  }

  // Determine visible window: for range=10 show full 0-10,
  // for larger ranges zoom into the relevant region
  let viewMin, viewMax, tickStep
  if (range <= 10) {
    viewMin = 0
    viewMax = 10
    tickStep = 1
  } else {
    const allVals = [a, result]
    jumps.forEach(j => { allVals.push(j.from, j.to) })
    const lo = Math.min(...allVals)
    const hi = Math.max(...allVals)
    const span = hi - lo
    const padAmt = Math.max(Math.ceil(span * 0.25), range >= 1000 ? 50 : 5)

    if (range >= 1000) {
      viewMin = Math.max(0, Math.floor((lo - padAmt) / 50) * 50)
      viewMax = Math.min(range, Math.ceil((hi + padAmt) / 50) * 50)
      tickStep = viewMax - viewMin > 500 ? 100 : 50
    } else {
      viewMin = Math.max(0, Math.floor((lo - padAmt) / 5) * 5)
      viewMax = Math.min(range, Math.ceil((hi + padAmt) / 5) * 5)
      tickStep = viewMax - viewMin > 50 ? 10 : 5
    }
  }

  const viewSpan = viewMax - viewMin
  const tickCount = Math.floor(viewSpan / tickStep) + 1
  const W = Math.max(400, tickCount * 42)
  const H = jumps.length > 1 ? 115 : 100
  const pad = 34
  const lineY = jumps.length > 1 ? 80 : 66
  const usable = W - pad * 2
  const pxPerUnit = usable / viewSpan

  const fontSize = range >= 1000 ? 10 : 12

  return (
    <div className="eq-numline">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-label={`Number line showing ${a} ${op} ${b} = ${result}`}>
        <line x1={pad} y1={lineY} x2={W - pad} y2={lineY} stroke="var(--color-border-dark)" strokeWidth="2" />
        {Array.from({ length: tickCount }, (_, i) => {
          const val = viewMin + i * tickStep
          const x = pad + (val - viewMin) * pxPerUnit
          return (
            <g key={i}>
              <line x1={x} y1={lineY - 6} x2={x} y2={lineY + 6} stroke="var(--color-border-dark)" strokeWidth="1.5" />
              <text x={x} y={lineY + 20} textAnchor="middle" fontSize={fontSize} fontWeight="600" fill="var(--color-text-muted)" fontFamily="'JetBrains Mono', monospace">
                {val}
              </text>
            </g>
          )
        })}
        {/* Jump arcs — first jump tallest, subsequent ones shorter */}
        {jumps.map((j, idx) => {
          const jx1 = pad + (j.from - viewMin) * pxPerUnit
          const jx2 = pad + (j.to - viewMin) * pxPerUnit
          const jMidX = (jx1 + jx2) / 2
          const span = Math.abs(jx2 - jx1)
          const baseArcH = Math.max(22, Math.min(38, span * 0.35))
          // First jump is tallest; subsequent arcs are shorter so labels don't overlap
          const arcH = baseArcH + (jumps.length - 1 - idx) * 18
          const arcPath = `M ${jx1} ${lineY} Q ${jMidX} ${lineY - arcH - 8} ${jx2} ${lineY}`
          return (
            <g key={idx}>
              <path
                d={arcPath}
                fill="none"
                stroke={j.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                markerEnd={`url(#arrow-${j.arrowId})`}
                strokeDasharray="300"
                strokeDashoffset="300"
                style={{ animation: `drawArc 0.6s ease forwards ${j.delay}s` }}
              />
              <text x={jMidX} y={lineY - arcH - 12} textAnchor="middle" fontSize="14" fontWeight="700" fill={j.color} fontFamily="'JetBrains Mono', monospace"
                style={{ opacity: 0, animation: `fadeIn 0.3s ease forwards ${j.delay + 0.3}s` }}>
                {j.label}
              </text>
              <circle cx={jx1} cy={lineY} r="5" fill={j.color} />
              <circle cx={jx2} cy={lineY} r="5" fill={j.color} />
            </g>
          )
        })}
        <defs>
          <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-accent-green)" />
          </marker>
          <marker id="arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-accent-red)" />
          </marker>
          <marker id="arrow-purple" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-accent-purple)" />
          </marker>
          <marker id="arrow-orange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-accent-orange)" />
          </marker>
        </defs>
        <style>{`
          @keyframes drawArc {
            to { stroke-dashoffset: 0; }
          }
          @keyframes fadeIn {
            to { opacity: 1; }
          }
        `}</style>
      </svg>
    </div>
  )
}

// ── Ten Frame component ──

function TenFrame({ problem, replayKey }) {
  const { a, b, op, result, range = 10 } = problem
  const [animStep, setAnimStep] = useState(0)

  // For range=10 show 10 dots; for 100 show 100 as 10×10; for 1000 show summary bar instead of dots
  const showBar = range >= 1000
  const frameSize = showBar ? 0 : range
  const cols = range <= 10 ? 5 : 10

  // Reset animation on replay
  useEffect(() => {
    setAnimStep(0)
    const count = b
    // For large ranges, animate fewer steps to keep it snappy
    const stepDelay = range >= 100 ? 30 : 120
    const timers = []
    for (let i = 0; i < count; i++) {
      timers.push(setTimeout(() => setAnimStep(i + 1), 200 + i * stepDelay))
    }
    return () => timers.forEach(clearTimeout)
  }, [replayKey, b, range])

  const dots = []
  for (let i = 0; i < frameSize; i++) {
    let cls = 'eq-tenframe-dot'
    if (range >= 100) cls += ' eq-tenframe-dot--sm'
    if (op === '+') {
      if (i < a) {
        cls += ' eq-tenframe-dot--filled'
      } else if (i < a + animStep && i < result) {
        cls += ' eq-tenframe-dot--add'
      }
    } else {
      // Start with 'a' filled, animate removing 'b'
      if (i < a) {
        // From end of filled: remove dots from index (a-1) down
        const removedSoFar = animStep
        const removeStart = a - removedSoFar
        if (i >= removeStart) {
          cls += ' eq-tenframe-dot--removed'
        } else {
          cls += ' eq-tenframe-dot--filled'
        }
      }
    }
    dots.push(<div key={i} className={cls} />)
  }

  const labelText = op === '+'
    ? <>{a} <span style={{ color: 'var(--color-accent-green)' }}>+ {b}</span> = <span>{result}</span></>
    : <>{a} <span style={{ color: 'var(--color-accent-red)' }}>− {b}</span> = <span>{result}</span></>

  if (showBar) {
    // Bar visualization for range=1000
    const barMax = Math.max(a, result)
    const aPct = (a / barMax) * 100
    const animPct = op === '+'
      ? ((a + Math.min(animStep, b)) / barMax) * 100
      : ((Math.max(a - animStep, result)) / barMax) * 100

    return (
      <div className="eq-tenframe">
        <div className="eq-bar">
          <div className="eq-bar-track">
            <div className="eq-bar-fill eq-bar-fill--base" style={{ width: `${aPct}%` }} />
            <div
              className={`eq-bar-fill ${op === '+' ? 'eq-bar-fill--add' : 'eq-bar-fill--sub'}`}
              style={{ width: `${animPct}%`, transition: 'width 0.3s ease' }}
            />
          </div>
          <div className="eq-bar-labels">
            <span>0</span>
            <span>{barMax}</span>
          </div>
        </div>
        <div className="eq-tenframe-label">{labelText}</div>
      </div>
    )
  }

  return (
    <div className="eq-tenframe">
      <div className="eq-tenframe-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {dots}
      </div>
      <div className="eq-tenframe-label">{labelText}</div>
    </div>
  )
}

// ── Confetti component ──

const CONFETTI_COLORS = ['#059669', '#2563eb', '#d97706', '#dc2626', '#7c3aed', '#e67e22']

// Pre-computed particle angles/distances so render stays pure
const CONFETTI_PARTICLES = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2 + (i % 3) * 0.15
  const dist = 45 + (i % 4) * 10
  return {
    cx: `${Math.cos(angle) * dist}px`,
    cy: `${Math.sin(angle) * dist - 20}px`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: `${i * 0.03}s`,
  }
})

function Celebration() {
  const particles = CONFETTI_PARTICLES

  return (
    <div className="eq-celebration">
      {particles.map((p, i) => (
        <span
          key={i}
          className="eq-confetti"
          style={{
            '--cx': p.cx,
            '--cy': p.cy,
            backgroundColor: p.color,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  )
}

// ── Main component ──

export default function EquationExplorer() {
  const [ops, setOps] = usePersistedState('eqexplore', 'ops', 'both')
  const [range, setRange] = usePersistedState('eqexplore', 'range', 10)
  const [seed, setSeed] = useState(0)
  const [isTouchDevice] = useState(() => typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0)
  const [answer, setAnswer] = useState('')
  const [status, setStatus] = useState('solving') // solving | correct | wrong
  const [terms, setTerms] = useState([]) // signed term positions
  const [streak, setStreak] = useState(0)
  const [streakBump, setStreakBump] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [explainTab, setExplainTab] = useState('numline')
  const [replayKey, setReplayKey] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [signAnimId, setSignAnimId] = useState(null) // id of term whose sign is animating

  const inputRef = useRef(null)
  const equalsRef = useRef(null)
  const boardRef = useRef(null)

  // Keep a ref to latest terms so pointer handlers don't go stale
  const termsRef = useRef(terms)
  useEffect(() => { termsRef.current = terms }, [terms])

  // Drag state refs (not in React state to avoid re-renders during drag)
  const dragRef = useRef({
    active: false,
    termId: null,
    startX: 0,
    startY: 0,
    dx: 0,
    dy: 0,
    el: null,
  })

  const problem = useMemo(() => {
    void seed
    return generateProblem(ops, range)
  }, [ops, range, seed])

  // Initialize terms when problem changes
  useEffect(() => {
    setTerms(buildInitialTerms(problem))
  }, [problem])

  const correctAnswer = getAnswer(problem)
  const display = getDisplay(terms)
  const initialTerms = useMemo(() => buildInitialTerms(problem), [problem])
  const isOriginalForm = terms.length === initialTerms.length && terms.every((t, i) =>
    t.id === initialTerms[i].id && t.side === initialTerms[i].side && t.sign === initialTerms[i].sign
  )

  const handleNextProblem = useCallback(() => {
    setSeed(s => s + 1)
    setAnswer('')
    setStatus('solving')
    setShowExplanation(false)
    setShowCelebration(false)
    setSignAnimId(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const handleCheck = useCallback(() => {
    const parsed = parseInt(answer, 10)
    if (isNaN(parsed)) return

    if (parsed === correctAnswer) {
      setStatus('correct')
      setShowCelebration(true)
      setStreak(s => s + 1)
      setStreakBump(true)
      setTimeout(() => setStreakBump(false), 300)
      setTimeout(() => setShowCelebration(false), 800)
    } else {
      setStatus('wrong')
      setStreak(0)
      setShowExplanation(true)
      setReplayKey(k => k + 1)
    }
  }, [answer, correctAnswer])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      if (status === 'correct') {
        handleNextProblem()
      } else if (status === 'solving' || status === 'wrong') {
        handleCheck()
      }
    }
  }, [status, handleCheck, handleNextProblem])

  const handleInputChange = useCallback((e) => {
    // Allow only digits
    const val = e.target.value.replace(/[^0-9]/g, '')
    const maxDigits = range >= 1000 ? 4 : range >= 100 ? 3 : 2
    if (val.length <= maxDigits) {
      setAnswer(val)
      if (status === 'wrong') setStatus('solving')
    }
  }, [status, range])

  const handleNumpadDigit = useCallback((digit) => {
    if (status === 'correct') return
    const maxDigits = range >= 1000 ? 4 : range >= 100 ? 3 : 2
    setAnswer(prev => {
      const next = prev + digit
      return next.length <= maxDigits ? next : prev
    })
    if (status === 'wrong') setStatus('solving')
  }, [status, range])

  const handleNumpadBackspace = useCallback(() => {
    if (status === 'correct') return
    setAnswer(prev => prev.slice(0, -1))
    if (status === 'wrong') setStatus('solving')
  }, [status])

  // ── Drag logic ──

  const handlePointerDown = useCallback((e, termId) => {
    if (status !== 'solving') return

    const el = e.currentTarget
    el.setPointerCapture(e.pointerId)

    dragRef.current = {
      active: true,
      termId,
      startX: e.clientX,
      startY: e.clientY,
      dx: 0,
      dy: 0,
      el,
    }

    // Disable CSS transitions during drag so transform is instant
    el.style.transition = 'none'
    el.classList.add('eq-tile--dragging')
  }, [status])

  const handlePointerMove = useCallback((e) => {
    const d = dragRef.current
    if (!d.active) return
    e.preventDefault()

    d.dx = e.clientX - d.startX
    d.dy = e.clientY - d.startY
    d.el.style.transform = `translate(${d.dx}px, ${d.dy}px) scale(1.06)`

    // Check if crossed equals sign
    if (equalsRef.current && boardRef.current) {
      const eqRect = equalsRef.current.getBoundingClientRect()
      const eqCenter = eqRect.left + eqRect.width / 2
      const termRect = d.el.getBoundingClientRect()
      const termCenter = termRect.left + termRect.width / 2

      // Determine which side the term started on and if it crossed
      const startedLeft = d.startX < eqCenter
      const nowOnOtherSide = startedLeft ? termCenter > eqCenter : termCenter < eqCenter

      // Highlight the target side
      const sides = boardRef.current.querySelectorAll('.eq-side')
      sides.forEach((side, i) => {
        const isTarget = startedLeft ? i === 1 : i === 0
        side.classList.toggle('eq-side--highlight', isTarget && nowOnOtherSide)
      })
    }
  }, [])

  const handlePointerUp = useCallback((e) => {
    const d = dragRef.current
    if (!d.active) return

    d.el.style.transition = ''
    d.el.classList.remove('eq-tile--dragging')
    d.el.style.transform = ''

    // Remove highlights
    if (boardRef.current) {
      boardRef.current.querySelectorAll('.eq-side').forEach(s => {
        s.classList.remove('eq-side--highlight')
      })
    }

    // Check if crossed equals sign
    if (equalsRef.current) {
      const eqRect = equalsRef.current.getBoundingClientRect()
      const eqCenter = eqRect.left + eqRect.width / 2
      const startedLeft = d.startX < eqCenter
      const endedRight = e.clientX > eqCenter
      const crossed = startedLeft ? endedRight : !endedRight

      if (crossed) {
        // Flip this specific term to the other side
        setSignAnimId(d.termId)
        setTimeout(() => setSignAnimId(null), 350)
        setTerms(prev => flipTerm(prev, d.termId))
      } else {
        // Same side — check if we should reorder
        // Find sibling term elements on the same side
        const side = startedLeft ? 0 : 1
        const sideEl = boardRef.current?.querySelectorAll('.eq-side')[side]
        if (sideEl) {
          const siblingEls = Array.from(sideEl.querySelectorAll('[data-term-id]'))
          // Find which sibling the pointer ended up past
          const pointerX = e.clientX
          for (const sibEl of siblingEls) {
            const sibId = sibEl.getAttribute('data-term-id')
            if (sibId === d.termId) continue
            const sibRect = sibEl.getBoundingClientRect()
            const sibCenter = sibRect.left + sibRect.width / 2
            const draggedTermIdx = termsRef.current.findIndex(t => t.id === d.termId)
            const sibIdx = termsRef.current.findIndex(t => t.id === sibId)
            // If dragged left past a sibling that was before, or right past one after
            if (draggedTermIdx > sibIdx && pointerX < sibCenter) {
              setTerms(prev => reorderTerm(prev, d.termId, sibIdx))
              break
            } else if (draggedTermIdx < sibIdx && pointerX > sibCenter) {
              setTerms(prev => reorderTerm(prev, d.termId, sibIdx + 1))
              break
            }
          }
        }
      }
    }

    d.active = false
    d.el = null
  }, [])

  const handleResetForm = useCallback(() => {
    setSignAnimId('__all__')
    setTimeout(() => setSignAnimId(null), 350)
    setTerms(buildInitialTerms(problem))
  }, [problem])

  // Focus input on mount and after problem change
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 100)
    return () => clearTimeout(t)
  }, [seed])

  // ── Render helpers ──

  function renderSide(sideTerms) {
    if (sideTerms.length === 0) {
      return <div className="eq-term eq-tile eq-tile--zero">0</div>
    }
    const elements = []
    sideTerms.forEach((term, idx) => {
      const isFirst = idx === 0
      const sign = displaySign(term, isFirst)
      // Render sign (operator) before the term, except leading +
      if (sign !== null) {
        const isAnimating = signAnimId === term.id || signAnimId === '__all__'
        elements.push(
          <div key={`op-${term.id}`} className="eq-term eq-op">
            <span className={`eq-op-symbol${isAnimating ? ' eq-op-symbol--enter' : ''}`}>{sign}</span>
          </div>
        )
      }
      // Render the term itself
      if (term.isBlank) {
        const sizeClass = range >= 1000 ? ' eq-blank--wide' : range >= 100 ? ' eq-blank--med' : ''
        elements.push(
          <div key={`blank-${term.id}`} className="eq-term eq-blank-wrap" role="presentation" data-term-id={term.id}>
            <input
              ref={inputRef}
              type="text"
              inputMode={isTouchDevice ? 'none' : 'numeric'}
              pattern="[0-9]*"
              className={`eq-blank${sizeClass}${status === 'correct' ? ' eq-blank--correct' : ''}${status === 'wrong' ? ' eq-blank--wrong' : ''}`}
              value={status === 'correct' ? correctAnswer : answer}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              readOnly={isTouchDevice}
              disabled={status === 'correct'}
              aria-label="Your answer"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-1p-ignore="true"
              data-lpignore="true"
              data-form-type="other"
              data-bwignore="true"
              id="eq-math-input"
            />
          </div>
        )
      } else {
        const isDraggable = status === 'solving'
        const sizeClass = range >= 1000 ? ' eq-tile--wide' : range >= 100 ? ' eq-tile--med' : ''
        elements.push(
          <div
            key={`num-${term.id}`}
            data-term-id={term.id}
            className={`eq-term eq-tile${sizeClass}${isDraggable ? ' eq-tile--draggable' : ''}`}
            onPointerDown={isDraggable ? (e) => handlePointerDown(e, term.id) : undefined}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            aria-label={isDraggable ? `Drag ${term.value} to rearrange equation` : undefined}
          >
            {term.value}
          </div>
        )
      }
    })
    return elements
  }

  return (
    <div className="eq-explorer">
      {/* Controls */}
      <div className="eq-controls no-print">
        <div className="btn-group">
          <button className={`btn-toggle${ops === 'add' ? ' active' : ''}`} onClick={() => { setOps('add'); handleNextProblem() }}>+</button>
          <button className={`btn-toggle${ops === 'sub' ? ' active' : ''}`} onClick={() => { setOps('sub'); handleNextProblem() }}>−</button>
          <button className={`btn-toggle${ops === 'both' ? ' active' : ''}`} onClick={() => { setOps('both'); handleNextProblem() }}>+ / −</button>
        </div>
        <div className="btn-group">
          <button className={`btn-toggle${range === 10 ? ' active' : ''}`} onClick={() => { setRange(10); handleNextProblem() }}>10</button>
          <button className={`btn-toggle${range === 100 ? ' active' : ''}`} onClick={() => { setRange(100); handleNextProblem() }}>100</button>
          <button className={`btn-toggle${range === 1000 ? ' active' : ''}`} onClick={() => { setRange(1000); handleNextProblem() }}>1000</button>
        </div>
        <button className="btn btn-secondary" onClick={handleNextProblem}>
          <IconRefresh size={16} />
          New
        </button>
      </div>

      {/* Streak */}
      <div className={`eq-streak${streak > 0 ? ' eq-streak--active' : ''}`} aria-live="polite">
        {streak > 0 && <>🔥 <span className={`eq-streak-num${streakBump ? ' eq-streak-num--bump' : ''}`}>{streak}</span> in a row</>}
      </div>

      {/* Equation board */}
      <div className="eq-board" ref={boardRef} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
        <div className="eq-side">
          {renderSide(display.left)}
        </div>

        <div className="eq-term eq-equals" ref={equalsRef}>=</div>

        <div className="eq-side">
          {renderSide(display.right)}
        </div>

        {showCelebration && <Celebration />}
      </div>

      {/* Drag hint */}
      {status === 'solving' && (
        <p className="eq-hint">Tip: drag a number across the = sign to rearrange</p>
      )}

      {/* Reset rearrangement */}
      {!isOriginalForm && status === 'solving' && (
        <button className="eq-reset-link" onClick={handleResetForm}>Reset equation</button>
      )}

      {/* Actions — hidden when numpad is visible */}
      {!isTouchDevice && (
        <div className="eq-actions">
          {status === 'correct' ? (
            <button className="eq-btn eq-btn--next" onClick={handleNextProblem}>
              Next <IconArrowRight size={18} />
            </button>
          ) : (
            <button className="eq-btn eq-btn--check" onClick={handleCheck} disabled={!answer}>
              <IconCheck size={18} /> Check
            </button>
          )}
        </div>
      )}

      {/* On-screen numeric keypad for touch devices */}
      {isTouchDevice && (
        <div className="eq-numpad" role="group" aria-label="Numeric keypad">
          <div className="eq-numpad-digits">
            {[1,2,3,4,5,6,7,8,9].map(d => (
              <button key={d} className="eq-numpad-key" onClick={() => handleNumpadDigit(String(d))} type="button">{d}</button>
            ))}
            <button className="eq-numpad-key eq-numpad-key--muted" onClick={handleNumpadBackspace} type="button" aria-label="Backspace">⌫</button>
            <button className="eq-numpad-key" onClick={() => handleNumpadDigit('0')} type="button">0</button>
            <button className="eq-numpad-key eq-numpad-key--muted" onClick={() => setAnswer('')} type="button" aria-label="Clear">C</button>
          </div>
          <button
            className={`eq-numpad-action${status === 'correct' ? ' eq-numpad-action--next' : ''}`}
            onClick={status === 'correct' ? handleNextProblem : handleCheck}
            disabled={status !== 'correct' && !answer}
            type="button"
          >
            {status === 'correct' ? <><span>Next</span> <IconArrowRight size={20} /></> : <><IconCheck size={20} /> <span>Check</span></>}
          </button>
        </div>
      )}

      {/* Feedback */}
      <div className="eq-feedback" aria-live="polite">
        {status === 'correct' && (
          <span className="eq-feedback--correct">
            <span className="eq-checkmark"><IconCheck size={18} /></span>{' '}
            Correct!
          </span>
        )}
        {status === 'wrong' && (
          <span className="eq-feedback--wrong">Not quite — try again or see how it works below</span>
        )}
      </div>

      {/* Explanation panel */}
      {showExplanation && (
        <div className="eq-explain">
          <div className="eq-explain-inner">
            <div className="eq-explain-tabs">
              <button className={`eq-explain-tab${explainTab === 'numline' ? ' eq-explain-tab--active' : ''}`} onClick={() => setExplainTab('numline')}>Number Line</button>
              <button className={`eq-explain-tab${explainTab === 'tenframe' ? ' eq-explain-tab--active' : ''}`} onClick={() => setExplainTab('tenframe')}>Ten Frame</button>
            </div>

            <p className="eq-explain-title">
              {problem.a} {problem.op === '+' ? '+' : '−'} {problem.b} = {problem.result}
            </p>

            {explainTab === 'numline' && <NumberLine problem={problem} />}
            {explainTab === 'tenframe' && <TenFrame problem={problem} replayKey={replayKey} />}

            <div className="eq-explain-footer">
              <button className="eq-btn--replay" onClick={() => setReplayKey(k => k + 1)}>
                <IconPlayerPlay size={14} /> Replay
              </button>
              <button className="eq-btn eq-btn--gotit" onClick={() => {
                setShowExplanation(false)
                inputRef.current?.focus()
              }}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
