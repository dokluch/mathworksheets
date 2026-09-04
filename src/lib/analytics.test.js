// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { initAnalytics, trackEvent, trackPageView, settingsToParams, isAnalyticsEnabled, _resetAnalytics } from './analytics.js'

beforeEach(() => {
  _resetAnalytics()
  delete window.dataLayer
  delete window.gtag
  document.head.querySelectorAll('script').forEach(s => s.remove())
})
afterEach(() => _resetAnalytics())

describe('initAnalytics', () => {
  it('is a no-op without a measurement id', () => {
    expect(initAnalytics('')).toBe(false)
    expect(initAnalytics(undefined)).toBe(false)
    expect(initAnalytics('UA-123')).toBe(false)
    expect(isAnalyticsEnabled()).toBe(false)
    expect(window.dataLayer).toBeUndefined()
    expect(trackEvent('x')).toBe(false)
    expect(trackPageView('/', 't')).toBe(false)
    expect(document.head.querySelector('script')).toBeNull()
  })

  it('pushes Consent Mode v2 defaults (denied) before config and loads gtag.js once', () => {
    expect(initAnalytics('G-TEST123')).toBe(true)
    expect(isAnalyticsEnabled()).toBe(true)
    const dl = window.dataLayer.map(args => Array.from(args))
    expect(dl[0].slice(0, 2)).toEqual(['consent', 'default'])
    expect(dl[0][2]).toMatchObject({ analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
    expect(dl[1][0]).toBe('js')
    expect(dl[2].slice(0, 2)).toEqual(['config', 'G-TEST123'])
    expect(dl[2][2]).toMatchObject({ send_page_view: false, anonymize_ip: true })
    const scripts = document.head.querySelectorAll('script[src*="googletagmanager.com/gtag/js?id=G-TEST123"]')
    expect(scripts.length).toBe(1)
    expect(scripts[0].async).toBe(true)
    initAnalytics('G-TEST123')
    expect(document.head.querySelectorAll('script').length).toBe(1)
  })
})

describe('events', () => {
  it('trackEvent and trackPageView push gtag event tuples', () => {
    initAnalytics('G-TEST123')
    const before = window.dataLayer.length
    expect(trackEvent('print_worksheet', { worksheet_id: 'addsub' })).toBe(true)
    expect(trackPageView('/worksheets/rounding', 'Rounding')).toBe(true)
    const pushed = window.dataLayer.slice(before).map(a => Array.from(a))
    expect(pushed[0]).toEqual(['event', 'print_worksheet', { worksheet_id: 'addsub' }])
    expect(pushed[1][0]).toBe('event')
    expect(pushed[1][1]).toBe('page_view')
    expect(pushed[1][2]).toMatchObject({ page_path: '/worksheets/rounding', page_title: 'Rounding', page_location: `${window.location.origin}/worksheets/rounding` })
  })

  it('settingsToParams flattens primitives with a setting_ prefix', () => {
    expect(settingsToParams({ ops: 'both', maxVal: 100, sixtySevenMode: true, nested: { a: 1 }, nothing: null })).toEqual({
      setting_ops: 'both',
      setting_maxVal: 100,
      setting_sixtySevenMode: 'true',
    })
    expect(settingsToParams(undefined)).toEqual({})
  })
})
