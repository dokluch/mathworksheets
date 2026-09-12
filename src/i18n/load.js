import { hasMessages, registerMessages } from './index.js'

/*
 * One chunk per language. The map is spelled out rather than built from a
 * template string so the bundler emits exactly these six chunks.
 */
const LOADERS = {
  fr: () => import('./messages/fr.js'),
  es: () => import('./messages/es.js'),
  de: () => import('./messages/de.js'),
  it: () => import('./messages/it.js'),
  ru: () => import('./messages/ru.js'),
  zh: () => import('./messages/zh.js'),
}

/** Fetches and registers a locale's catalog; a no-op for English, an unknown code or one already loaded. */
export async function loadLocale(locale) {
  if (hasMessages(locale) || !Object.hasOwn(LOADERS, locale)) return
  const { default: messages } = await LOADERS[locale]()
  registerMessages(locale, messages)
}
