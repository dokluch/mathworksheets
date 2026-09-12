import { useState, useEffect } from 'react'

// Legacy key, deliberately kept across the rename to Super Awesome Math: this blob
// holds both worksheet settings and app.locale, and an explicit language choice is
// stored only here — renaming it would silently reset returning users to English.
const STORAGE_KEY = 'mathsheets'

// The blob is parsed once per distinct stored string. A worksheet mounts five
// or six of these hooks, and each used to parse the whole blob again.
let cachedRaw = null
let cachedState = {}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw !== cachedRaw) {
      cachedState = raw ? JSON.parse(raw) : {}
      cachedRaw = raw
    }
    return cachedState
  } catch {
    return {}
  }
}

function saveState(state) {
  try {
    const raw = JSON.stringify(state)
    localStorage.setItem(STORAGE_KEY, raw)
    cachedRaw = raw
    cachedState = state
  } catch { /* quota exceeded - ignore */ }
}

const accepts = (allowed, value) => (
  allowed == null || (typeof allowed === 'function' ? allowed(value) : allowed.includes(value))
)

/**
 * A setting remembered in this browser, per worksheet (`tabId`) and `key`.
 *
 * `allowed`, an array of valid values or a predicate, rejects a value an older
 * build left behind: the default is used instead, and written back. Leave it
 * out where the default is not the fallback, as for the settings whose default
 * follows the language on a first visit.
 */
export function usePersistedState(tabId, key, defaultValue, allowed) {
  const [value, setValue] = useState(() => {
    const tab = loadState()[tabId]
    return tab && key in tab && accepts(allowed, tab[key]) ? tab[key] : defaultValue
  })

  useEffect(() => {
    const all = loadState()
    if (!all[tabId]) all[tabId] = {}
    all[tabId][key] = value
    saveState(all)
  }, [tabId, key, value])

  return [value, setValue]
}

/** Read one tab's persisted settings without subscribing (used for analytics). */
export function getPersistedTab(tabId) {
  const all = loadState()
  return all[tabId] ? { ...all[tabId] } : {}
}
