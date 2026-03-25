import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'mathsheets'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* quota exceeded - ignore */ }
}

export function usePersistedState(tabId, key, defaultValue) {
  const [value, setValue] = useState(() => {
    const all = loadState()
    const tab = all[tabId]
    if (tab && key in tab) return tab[key]
    return defaultValue
  })

  useEffect(() => {
    const all = loadState()
    if (!all[tabId]) all[tabId] = {}
    all[tabId][key] = value
    saveState(all)
  }, [tabId, key, value])

  return [value, setValue]
}
