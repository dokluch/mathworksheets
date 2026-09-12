import './Fraction.css'

/*
 * Fractions on the notebook grid, written the way a child writes one in a
 * squared exercise book: the numerator in one row of squares, the denominator
 * in the row beneath it, and the bar on the grid line between them. Signs and
 * whole parts of mixed numbers span both rows, so they sit on the bar line.
 *
 * Notebook-only: every size is a whole number of squares (--nb-sq), so these
 * render inside `.worksheet.colarith-notebook` beside the column sheets.
 */

/** One square per digit, right-aligned in a block `width` squares wide. */
function digitCells(value, width, row, blank, key) {
  const text = String(value)
  const start = width - text.length
  return [...text].map((char, idx) => (
    <span
      key={`${key}${idx}`}
      className="colarith-cell"
      style={{ gridColumn: start + idx + 1, gridRow: row }}
    >
      {blank ? <span className="frac-box" /> : char}
    </span>
  ))
}

/**
 * A fraction. `blankN` / `blankD` swap that number's digits for answer boxes,
 * one per digit of the real answer, as on every other sheet.
 */
export function Fraction({ n, d, blankN = false, blankD = false }) {
  const width = Math.max(String(n).length, String(d).length)
  return (
    <span className="frac" style={{ '--frac-w': width }}>
      {digitCells(n, width, 1, blankN, 'n')}
      {digitCells(d, width, 2, blankD, 'd')}
    </span>
  )
}

/** A mixed number: the whole part on the bar line, then its fraction. A zero whole part is left out. */
export function MixedNumber({ w = 0, n, d, blank = false }) {
  return (
    <span className="frac-mixed">
      {w > 0 && [...String(w)].map((char, idx) => (
        <span key={idx} className="frac-tall">{blank ? <span className="frac-box" /> : char}</span>
      ))}
      <Fraction n={n} d={d} blankN={blank} blankD={blank} />
    </span>
  )
}

/** A sign on the bar line, or an empty box there for the child to write one in. */
export function FracSign({ children, box = false }) {
  return (
    <span className="frac-tall frac-sign" aria-hidden="true">
      {box ? <span className="frac-box" /> : children}
    </span>
  )
}

/** One problem: a row two squares tall. The label is what a screen reader hears. */
export function FracRow({ label, children }) {
  return (
    <div className="colarith-problem frac-problem" aria-label={label}>
      <div className="frac-row" aria-hidden="true">{children}</div>
    </div>
  )
}
