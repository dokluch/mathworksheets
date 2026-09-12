import { describe, it, expect } from 'vitest'
import { initialLocale } from './useRoute.js'

describe('initialLocale', () => {
  it('lets a locale prefix win over the remembered choice', () => {
    expect(initialLocale('/fr/about', 'de')).toBe('fr')
    expect(initialLocale('/zh', 'en')).toBe('zh')
  })

  it('gives an unprefixed path the remembered choice, and English otherwise', () => {
    expect(initialLocale('/about', 'de')).toBe('de')
    expect(initialLocale('/worksheets/division', 'ru')).toBe('ru')
    expect(initialLocale('/', undefined)).toBe('en')
    expect(initialLocale('/about', 'xx')).toBe('en')
    expect(initialLocale('/en/about', 'it')).toBe('it')
  })
})
