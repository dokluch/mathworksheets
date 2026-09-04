/**
 * Site-wide constants shared by the app, the build scripts and the middleware.
 * Keep this file free of browser or Node-only APIs.
 */

const viteEnv = (typeof import.meta !== 'undefined' && import.meta.env) || {}
const nodeEnv = (typeof process !== 'undefined' && process.env) || {}

const rawSiteUrl = viteEnv.VITE_SITE_URL || nodeEnv.VITE_SITE_URL || nodeEnv.SITE_URL || 'https://mathworksheets-eight.vercel.app'

export const SITE_URL = String(rawSiteUrl).replace(/\/+$/, '')
export const BRAND = 'MathSheets'
export const BRAND_ALT = 'Math Worksheets'
export const TAGLINE = 'Printable Math Worksheets for Grades 1–3'
export const DESCRIPTION =
  'MathSheets: free, printable, randomized math worksheets for grades 1–3. Multiplication tables, addition and subtraction, column addition, long multiplication, comparison, rounding, number patterns and an interactive equation explorer.'
export const AUTHOR = { name: 'dokluch', url: 'https://github.com/dokluch' }
export const GITHUB_URL = 'https://github.com/dokluch/mathworksheets'
export const LICENSE_URL = 'https://creativecommons.org/licenses/by-nc/4.0/'
export const LICENSE_NAME = 'CC BY-NC 4.0'
export const OG_IMAGE_PATH = '/og/home.png'
export const THEME_COLOR = '#2563eb'

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//.test(path)) return path
  return SITE_URL + (path.startsWith('/') ? path : `/${path}`)
}
