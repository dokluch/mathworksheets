/**
 * The topics the catalog is grouped under, in the order they are shown.
 *
 * Pure data, like src/lib/grades.js. The React catalog and sidebar, the
 * prerendered home page, llms.txt and worksheets.json all group by it, and
 * src/worksheets.js is kept in this order (src/lib/topics.test.js holds it),
 * so none of them has to sort.
 */
export const TOPICS = [
  { id: 'arithmetic', label: 'Arithmetic' },
  { id: 'numbers', label: 'Number sense' },
  { id: 'fractions', label: 'Fractions & decimals' },
  { id: 'algebra', label: 'Algebra' },
  { id: 'logic', label: 'Patterns & logic' },
]

export const TOPIC_IDS = TOPICS.map(topic => topic.id)
export const TOPIC_BY_ID = Object.fromEntries(TOPICS.map(topic => [topic.id, topic]))

/** Worksheets grouped by topic in TOPICS order, each group in the list's own order; empty topics are left out. */
export function groupByTopic(worksheets) {
  return TOPICS
    .map(topic => ({ ...topic, worksheets: worksheets.filter(ws => ws.topic === topic.id) }))
    .filter(group => group.worksheets.length > 0)
}
