import { useNotebookGrid } from './useNotebookGrid'
import { useSheetSet } from './useSheetSet'

/**
 * The skeleton every notebook worksheet shares, from a lib's sheetShape.
 *
 * `generate(rng, shape)` deals one sheet. `deps` are the settings it closes
 * over besides the shape; the shape's column count and problem count are added
 * here, so a setting that only repaints (a sign, a decimal mark) never deals a
 * new sheet and one that changes how many problems fit always does.
 *
 * Returns the dealt sheets with their set controls, and `sheetProps(primary)`:
 * the ref, class and grid style of a `.worksheet` element. Only the primary
 * copy carries the measuring ref.
 */
export function useNotebookSheet({ shape, generate, deps, className = '' }) {
  const [sheetRef, sheetStyle] = useNotebookGrid({
    columns: shape.columns, cellsWide: shape.frame.cellsWide, rows: shape.frame.rows, ...shape.spacing,
  })
  const { sheets, set, setSet, regenerate } = useSheetSet(
    rng => generate(rng, shape),
    [...deps, shape.columns, shape.count],
  )
  const classes = ['worksheet notebook-grid-bg colarith-notebook', className, `print-area cols-${shape.columns}`]
    .filter(Boolean).join(' ')
  const sheetProps = primary => ({ ref: primary ? sheetRef : undefined, className: classes, style: sheetStyle })
  return { sheets, set, setSet, regenerate, sheetProps }
}
