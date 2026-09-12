import { SegmentedControl } from './controls/SettingsPanel'
import { ALL_GRADES, GRADES, GRADE_BAND } from '../lib/grades'
import { agesForGrades } from '../seo/render'
import { useT } from '../i18n/context'

// agesForGrades speaks schema.org, which hyphenates a range. On the cover a range is an en dash.
const ageRange = grades => agesForGrades(grades).replace('-', '–')

/**
 * Grade filter for the landing catalog: All / Grade 1 … Grade 6, each over its age band,
 * because a parent knows their child's age before they know the grade a sheet is written for.
 * All carries the whole band ("ages 6–12") so the cells are two lines on one baseline rather
 * than one ragged row. Seven cells no longer fit a natural-width bar, so the group lays out as
 * a grid: one row of seven on a wide screen, All over two rows of three on a narrow one.
 */
export default function GradeFilter({ value, onChange, count }) {
  const t = useT()
  const options = [
    { value: ALL_GRADES, label: t('app.allGrades'), sublabel: t('app.ages', { ages: ageRange(GRADE_BAND) }) },
    ...GRADES.map(grade => ({
      value: grade,
      label: t('seo.gradeOne', { grades: grade }),
      sublabel: t('app.ages', { ages: ageRange(grade) }),
    })),
  ]
  return (
    <div className="grade-filter">
      <SegmentedControl
        className="btn-group--stacked"
        ariaLabel={t('app.gradeFilter')}
        options={options}
        value={value}
        onChange={onChange}
      />
      {/* The grid answers "how many" for anyone who can see it; this says the same thing out loud. */}
      <span className="sr-only" role="status">{t('app.sheetCount', { n: count })}</span>
    </div>
  )
}
