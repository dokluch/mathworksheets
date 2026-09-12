import { describe, it, expect, afterEach } from 'vitest'
import { MESSAGES, hasMessages, lookup, t } from './index.js'
import { loadLocale } from './load.js'
import fr from './messages/fr.js'

const saved = MESSAGES.fr
afterEach(() => { MESSAGES.fr = saved })

describe('loading a catalog on demand', () => {
  it('falls back to English while a catalog is not registered', () => {
    delete MESSAGES.fr
    expect(hasMessages('fr')).toBe(false)
    expect(t('fr', 'common.print')).toBe(t('en', 'common.print'))
    expect(lookup('xx', 'common.print')).toBe('Print')
  })

  it('registers the catalog it fetches, once', async () => {
    delete MESSAGES.fr
    await loadLocale('fr')
    expect(hasMessages('fr')).toBe(true)
    expect(MESSAGES.fr).toBe(fr)
    const loaded = MESSAGES.fr
    await loadLocale('fr')
    expect(MESSAGES.fr).toBe(loaded)
  })

  it('ignores English and codes it has no catalog for', async () => {
    await loadLocale('en')
    await loadLocale('xx')
    await loadLocale('toString')
    expect(hasMessages('xx')).toBe(false)
    expect(hasMessages('toString')).toBe(false)
  })
})
