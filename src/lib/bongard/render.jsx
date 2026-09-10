import { BOX, toPath } from './shapes.js'
import { PANEL, GAP, DIVIDER, PROBLEM_W, PROBLEM_H } from './layout.js'

/**
 * Paints one generated problem as a single SVG: two columns of three panels
 * a side, a rule between the sides, every mark in currentColor so the figure
 * takes the sheet's ink on screen and on paper alike.
 */

function Shape({ shape }) {
  const { d, transform } = toPath(shape)
  return (
    <path
      d={d}
      transform={transform}
      fill={shape.fill === 'solid' ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={shape.jagged ? 1.3 : 2}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  )
}

function PanelBox({ panel, x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={BOX} height={BOX} fill="#fff" stroke="currentColor" strokeWidth="1.2" />
      {panel.shapes.map((shape, i) => <Shape key={i} shape={shape} />)}
    </g>
  )
}

function Side({ panels, x0 }) {
  return panels.map((p, i) => (
    <PanelBox key={i} panel={p} x={x0 + (i % 2) * (PANEL + GAP)} y={Math.floor(i / 2) * (PANEL + GAP)} />
  ))
}

/** Room round the edge for the half of each outer panel's frame stroke that falls outside it. */
const PAD = 1

export function ProblemFigure({ problem, label, className }) {
  const rightX0 = 2 * PANEL + GAP + DIVIDER
  const divX = 2 * PANEL + GAP + DIVIDER / 2
  return (
    <svg
      className={className}
      viewBox={`${-PAD} ${-PAD} ${PROBLEM_W + 2 * PAD} ${PROBLEM_H + 2 * PAD}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={label}
    >
      <Side panels={problem.left} x0={0} />
      <line x1={divX} y1={0} x2={divX} y2={PROBLEM_H} stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <Side panels={problem.right} x0={rightX0} />
    </svg>
  )
}
