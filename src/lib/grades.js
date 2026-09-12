/**
 * The grades the catalog can be narrowed to. `grades` on a worksheet is a band
 * ("3", "4–6"); these are the single values a reader can ask for, plus the
 * "everything" value the catalog opens on.
 *
 * The age bands live here too, beside the grades they belong to, so the catalog
 * filter and the schema.org `typicalAgeRange` in src/seo/render.js cannot drift.
 */
export const ALL_GRADES = 'all'

/** schema.org age ranges, hyphenated as schema.org writes them. */
export const GRADE_AGES = {
  '1': '6-7', '2': '7-8', '3': '8-9', '4': '9-10', '5': '10-11', '6': '11-12',
}

export const GRADES = Object.keys(GRADE_AGES)

/** The whole band the site covers, written as a worksheet writes one: "1–6". */
export const GRADE_BAND = `${GRADES[0]}–${GRADES[GRADES.length - 1]}`

/** Guards a remembered choice: a value from an older build opens the full catalog. */
export const isGrade = value => value === ALL_GRADES || GRADES.includes(value)
