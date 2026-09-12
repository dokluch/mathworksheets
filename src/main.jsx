import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { initAnalytics } from './lib/analytics.js'
import { loadLocale } from './i18n/load.js'
import { initialLocale } from './hooks/useRoute.js'
import { getPersistedTab } from './hooks/usePersistedState.js'

initAnalytics()

function mount() {
  // The crawlable static fallback (injected at build time) stays on screen
  // until the app can replace it, including while a catalog loads.
  document.getElementById('static-content')?.remove()
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
}

// English is bundled; any other language is fetched first so the first render
// is already in it. If the fetch fails the app still mounts, in English.
loadLocale(initialLocale(window.location.pathname, getPersistedTab('app').locale))
  .catch(() => {})
  .then(mount)
