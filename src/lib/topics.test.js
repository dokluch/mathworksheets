import { describe, it, expect } from 'vitest'
import { TOPICS, TOPIC_BY_ID, TOPIC_IDS, groupByTopic } from './topics.js'
import { WORKSHEETS } from '../worksheets.js'
import { LOCALES, MESSAGES, t } from '../i18n/index.js'

describe('topics', () => {
  it('have unique ids, and their English names come from here', () => {
    expect(new Set(TOPIC_IDS).size).toBe(TOPICS.length)
    for (const topic of TOPICS) {
      expect(topic.label.length).toBeGreaterThan(0)
      expect(TOPIC_BY_ID[topic.id]).toBe(topic)
      expect(MESSAGES.en.topics[topic.id]).toBe(topic.label)
    }
  })

  it('are named in every language', () => {
    for (const locale of LOCALES) {
      for (const id of TOPIC_IDS) expect(t(locale, `topics.${id}`), `${locale} ${id}`).not.toBe(`topics.${id}`)
    }
  })

  it('file every worksheet under a known topic and leave no topic empty', () => {
    for (const ws of WORKSHEETS) expect(TOPIC_IDS, ws.id).toContain(ws.topic)
    for (const id of TOPIC_IDS) expect(WORKSHEETS.some(ws => ws.topic === id), id).toBe(true)
  })

  it('keep the catalog grouped in their order, so nothing downstream has to sort', () => {
    const runs = WORKSHEETS.map(ws => ws.topic).filter((topic, i, all) => i === 0 || all[i - 1] !== topic)
    expect(runs).toEqual(TOPIC_IDS)
  })

  it('group a list without reordering it, and drop the topics it has nothing for', () => {
    expect(groupByTopic([])).toEqual([])
    expect(groupByTopic(WORKSHEETS).flatMap(group => group.worksheets)).toEqual(WORKSHEETS)
    const withoutAlgebra = WORKSHEETS.filter(ws => ws.topic !== 'algebra')
    expect(groupByTopic(withoutAlgebra).map(group => group.id)).toEqual(TOPIC_IDS.filter(id => id !== 'algebra'))
  })
})
