import { useT } from '../i18n/context'

/**
 * The grown-up's half of the sheet.
 *
 * The About page argues that the value of a printed worksheet is the delayed
 * feedback a grown-up gives afterwards — and the product shipped nothing to
 * make that feedback possible. Marking thirty randomized long divisions by
 * hand is the reason a teacher does not come back, and a parent checking one
 * sheet at the kitchen table has the same problem in miniature.
 *
 * It prints on its own page, after the worksheet, and never appears on screen:
 * a key visible beside the sheet would hand the child exactly the instant
 * feedback the product exists to avoid.
 */
export default function AnswerKey({ title, stamp, answers }) {
  const t = useT()
  if (!answers?.length) return null
  return (
    <section className="answer-key print-only" aria-hidden="true">
      <div className="answer-key-head">
        <span className="answer-key-title">{t('common.answerKey')}</span>
        <span className="answer-key-meta">{title}</span>
        {stamp && <span className="answer-key-stamp">{t('common.fieldSet')} {stamp}</span>}
      </div>
      <ol className="answer-key-list">
        {answers.map((answer, i) => (
          <li key={i} className="answer-key-item">
            <span className="answer-key-num">{i + 1}</span>
            <span className="answer-key-value">{answer}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
