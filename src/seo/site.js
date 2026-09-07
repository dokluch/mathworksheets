/**
 * Site-wide constants shared by the app, the build scripts and the middleware.
 * Keep this file free of browser or Node-only APIs.
 */

const viteEnv = (typeof import.meta !== 'undefined' && import.meta.env) || {}
const nodeEnv = (typeof process !== 'undefined' && process.env) || {}

const rawSiteUrl = viteEnv.VITE_SITE_URL || nodeEnv.VITE_SITE_URL || nodeEnv.SITE_URL || 'https://superawesomemath.com'

export const SITE_URL = String(rawSiteUrl).replace(/\/+$/, '')
export const BRAND = 'Super Awesome Math'
export const BRAND_ALT = 'MathSheets'
export const TAGLINE = 'Printable Math Worksheets for Grades 1–3'
export const DESCRIPTION =
  'Super Awesome Math: free, printable, randomized math worksheets for grades 1–3. Multiplication tables, addition and subtraction, column addition, long multiplication, long division, comparison, rounding, number patterns and an interactive equation explorer.'
export const AUTHOR = { name: 'dokluch', url: 'https://github.com/dokluch' }
/** Legal operator named on the About, Privacy, Terms and Contact pages. */
export const OPERATOR = 'Superposition Labs Inc.'
export const CONTACT_EMAIL = 'hello@superawesomemath.com'
export const GITHUB_URL = 'https://github.com/dokluch/mathworksheets'
export const LICENSE_URL = 'https://creativecommons.org/licenses/by-nc/4.0/'
export const LICENSE_NAME = 'CC BY-NC 4.0'
export const OG_IMAGE_PATH = '/og/home.png'
/**
 * Browser chrome tint. Matches the site header, which is white, so the phone's
 * address bar continues the page rather than announcing a colour the site does
 * not use. (Was Tailwind's #2563eb, then the cream board stock.)
 */
export const THEME_COLOR = '#ffffff'
/** The one warm mark: links and the accent on generated preview cards. */
export const ACCENT_COLOR = '#d0452f'

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//.test(path)) return path
  return SITE_URL + (path.startsWith('/') ? path : `/${path}`)
}
