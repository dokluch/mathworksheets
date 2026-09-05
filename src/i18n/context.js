import { createContext, useContext } from 'react'
import { t, DEFAULT_LOCALE } from './index.js'

/**
 * Locale context for the React tree. Only hooks are exported from here so the
 * file stays react-refresh friendly; App.jsx renders the Provider.
 */
export const LocaleContext = createContext({
  locale: DEFAULT_LOCALE,
  t: (key, params) => t(DEFAULT_LOCALE, key, params),
})

export function useLocale() {
  return useContext(LocaleContext).locale
}

export function useT() {
  return useContext(LocaleContext).t
}
