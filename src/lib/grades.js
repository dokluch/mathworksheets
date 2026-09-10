/**
 * The grades the catalog can be narrowed to. `grades` on a worksheet is a band
 * ("3", "1–3"); these are the single values a reader can ask for, plus the
 * "everything" value the catalog opens on.
 */
export const ALL_GRADES = 'all'
export const GRADES = ['1', '2', '3']

/** Guards a remembered choice: a value from an older build opens the full catalog. */
export const isGrade = value => value === ALL_GRADES || GRADES.includes(value)
