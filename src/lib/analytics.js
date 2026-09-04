/**
 * GA4 via gtag.js with Consent Mode v2 (analytics denied by default, so no
 * cookies are written and no banner is needed; GA receives cookieless pings).
 *
 * Everything is a no-op unless VITE_GA_MEASUREMENT_ID is set at build time.
 */

const MEASUREMENT_ID = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GA_MEASUREMENT_ID) || ''

let state = { enabled: false, id: '', win: null }

function gtag(...args) {
  state.win.dataLayer = state.win.dataLayer || []
  state.win.dataLayer.push(args)
}

export function isAnalyticsEnabled() {
  return state.enabled
}

/**
 * @param {string} [id]  GA4 measurement id (G-XXXXXXX). Defaults to the env var.
 * @param {{ win?: Window, doc?: Document }} [deps]
 */
export function initAnalytics(id = MEASUREMENT_ID, { win, doc } = {}) {
  const w = win || (typeof window !== 'undefined' ? window : null)
  const d = doc || (typeof document !== 'undefined' ? document : null)
  if (!id || !/^G-[A-Z0-9]+$/i.test(id) || !w || !d) {
    state = { enabled: false, id: '', win: null }
    return false
  }
  state = { enabled: true, id, win: w }
  w.dataLayer = w.dataLayer || []
  w.gtag = w.gtag || function () { w.dataLayer.push(arguments) }

  // Consent Mode v2: defaults must be pushed before the tag loads.
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 0,
  })
  gtag('js', new Date())
  gtag('config', id, { send_page_view: false, anonymize_ip: true, allow_google_signals: false })

  if (!d.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${id}"]`)) {
    const script = d.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
    d.head.appendChild(script)
  }
  return true
}

export function trackEvent(name, params = {}) {
  if (!state.enabled) return false
  gtag('event', name, params)
  return true
}

export function trackPageView(path, title) {
  if (!state.enabled) return false
  const origin = state.win.location ? state.win.location.origin : ''
  gtag('event', 'page_view', { page_path: path, page_title: title, page_location: origin + path })
  return true
}

/** Flatten a worksheet's persisted settings into GA-friendly params. */
export function settingsToParams(settings) {
  const out = {}
  for (const [key, value] of Object.entries(settings || {})) {
    if (value === null || value === undefined) continue
    if (typeof value === 'object') continue
    out[`setting_${key}`] = typeof value === 'boolean' ? String(value) : value
  }
  return out
}

/** Test hook: reset module state. */
export function _resetAnalytics() {
  state = { enabled: false, id: '', win: null }
}
