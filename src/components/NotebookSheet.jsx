import WorksheetHeader from './WorksheetHeader'
import SheetCopies from './SheetCopies'
import AnswerKey from './AnswerKey'

/**
 * A notebook worksheet as it prints: one squared sheet per copy, each with its
 * header and a grid of problems, then an answer key per copy when asked for.
 *
 * `children(problem, index)` paints one problem inside its grid item;
 * `answer(problem)` is its answer-key text. `sheets`, `sheetProps` and `setSet`
 * come from useNotebookSheet.
 */
export default function NotebookSheet({
  sheets, sheetProps, setSet, title, meta, itemClassName = 'colarith-item', answerKey = false, answer, children,
}) {
  return (
    <>
      <SheetCopies sheets={sheets}>
        {({ set, data: problems }, primary) => (
          <div {...sheetProps(primary)}>
            <WorksheetHeader title={title} meta={meta} stamp={String(set)} onStampChange={primary ? setSet : undefined} />

            <div className="colarith-grid">
              {problems.map((problem, i) => (
                <div key={i} className={itemClassName}>{children(problem, i)}</div>
              ))}
            </div>
          </div>
        )}
      </SheetCopies>

      {answerKey && sheets.map(({ set, data: problems }, i) => (
        <AnswerKey key={i} title={title} stamp={String(set)} answers={problems.map(answer)} />
      ))}
    </>
  )
}
