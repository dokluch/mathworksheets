import { describe, it, expect } from 'vitest'
import { parseAccept, negotiate, prefersMarkdown } from './negotiate.js'

describe('parseAccept', () => {
  it('treats a missing header as */*', () => {
    expect(parseAccept(undefined)).toEqual([{ type: '*/*', q: 1, specificity: 0, order: 0 }])
    expect(parseAccept('')).toEqual([{ type: '*/*', q: 1, specificity: 0, order: 0 }])
  })

  it('parses q-values, specificity and client order', () => {
    const ranges = parseAccept('text/html;q=0.8, text/*;q=0.5, */*;q=0.1, text/markdown')
    expect(ranges).toEqual([
      { type: 'text/html', q: 0.8, specificity: 2, order: 0 },
      { type: 'text/*', q: 0.5, specificity: 1, order: 1 },
      { type: '*/*', q: 0.1, specificity: 0, order: 2 },
      { type: 'text/markdown', q: 1, specificity: 2, order: 3 },
    ])
  })

  it('ignores non-q parameters and clamps q', () => {
    expect(parseAccept('text/html;level=1;q=7')[0].q).toBe(1)
    expect(parseAccept('text/html;q=abc')[0].q).toBe(0)
    expect(parseAccept('TEXT/Markdown')[0].type).toBe('text/markdown')
  })
})

describe('negotiate', () => {
  it('picks HTML for browsers', () => {
    expect(negotiate('text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')).toBe('text/html')
  })

  it('picks Markdown when explicitly requested', () => {
    expect(negotiate('text/markdown')).toBe('text/markdown')
    expect(prefersMarkdown('text/markdown')).toBe(true)
  })

  it('honours q-values: markdown q=0.9 beats html q=0.5', () => {
    expect(negotiate('text/html;q=0.5, text/markdown;q=0.9')).toBe('text/markdown')
    expect(negotiate('text/markdown;q=0.5, text/html;q=0.9')).toBe('text/html')
  })

  it('breaks ties by client order, then server order', () => {
    expect(negotiate('text/markdown, text/html')).toBe('text/markdown')
    expect(negotiate('text/html, text/markdown')).toBe('text/html')
    expect(negotiate('*/*')).toBe('text/html')
    expect(negotiate(undefined)).toBe('text/html')
    expect(negotiate('*/*', ['text/markdown', 'text/html'])).toBe('text/markdown')
  })

  it('lets an explicit q=0 override a wildcard (most specific range wins)', () => {
    expect(negotiate('text/html;q=0, */*')).toBe('text/markdown')
    expect(negotiate('text/markdown;q=0, text/*')).toBe('text/html')
  })

  it('returns null when nothing is acceptable (406)', () => {
    expect(negotiate('application/json')).toBeNull()
    expect(negotiate('text/html;q=0, text/markdown;q=0')).toBeNull()
    expect(negotiate('image/*')).toBeNull()
  })

  it('handles wildcard subtype', () => {
    expect(negotiate('text/*')).toBe('text/html')
    expect(negotiate('text/*;q=0.1, text/markdown;q=0.2')).toBe('text/markdown')
  })
})
