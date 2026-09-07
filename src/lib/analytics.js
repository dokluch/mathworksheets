/**
 * GA4 via gtag.js with Consent Mode v2 (analytics denied by default, so no
 * cookies are written and no banner is needed; GA receives cookieless pings).
 *
 * The measurement id is resolved at call time: an explicit argument wins, then
 * VITE_GA_MEASUREMENT_ID, then DEFAULT_ID — but only on a production hostname.
 * The id is not a secret (it ships in the bundle and is sent in the clear to
 * googletagmanager.com), and defaulting it means a missing Vercel env var can
 * no longer silently disable analytics. The host guard keeps dev servers,
 * preview deploys and tests out of the production property; set
 * VITE_GA_MEASUREMENT_ID to force it on anywhere, or to a non-G- value to
 * disable it entirely.
 */

const ENV_ID = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GA_MEASUREMENT_ID) || ''
const DEFAULT_ID = 'G-G7HL4RG2GM'
const PROD_HOSTS = ['superawesomemath.com', 'www.superawesomemath.com']

function resolveId(win) {
  if (ENV_ID) return ENV_ID
  return PROD_HOSTS.includes(win?.location?.hostname) ? DEFAULT_ID : ''
}

let state = { enabled: false, id: '', win: null }

function gtag(...args) {
  state.win.dataLayer = state.win.dataLayer || []
  state.win.dataLayer.push(args)
}

export function isAnalyticsEnabled() {
  return state.enabled
}

/**
 * @param {string} [id]  GA4 measurement id (G-XXXXXXX). Omit to resolve it from
 *                       the env var, then the production-host default.
 * @param {{ win?: Window, doc?: Document }} [deps]
 */
export function initAnalytics(id, { win, doc } = {}) {
  const w = win || (typeof window !== 'undefined' ? window : null)
  const d = doc || (typeof document !== 'undefined' ? document : null)
  const measurementId = id === undefined ? resolveId(w) : id
  if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId) || !w || !d) {
    state = { enabled: false, id: '', win: null }
    return false
  }
  state = { enabled: true, id: measurementId, win: w }
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
  gtag('config', measurementId, { send_page_view: false, anonymize_ip: true, allow_google_signals: false })

  if (!d.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`)) {
    const script = d.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
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
