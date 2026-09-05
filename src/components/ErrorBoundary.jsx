import { Component } from 'react'
import { t } from '../i18n/index.js'
import { localeFromPath } from '../hooks/useRoute.js'

/** Locale of the current URL: this boundary sits outside the LocaleContext provider. */
function currentLocale() {
  return typeof window === 'undefined' ? 'en' : localeFromPath(window.location.pathname)
}

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      const locale = currentLocale()
      return (
        <div style={{ padding: '48px 20px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{t(locale, 'error.title')}</h1>
          <p style={{ color: '#64748b', marginBottom: 20 }}>{t(locale, 'error.hint')}</p>
          <button
            onClick={() => {
              this.setState({ hasError: false })
              window.location.reload()
            }}
            style={{
              padding: '9px 20px',
              borderRadius: 8,
              border: 'none',
              background: '#2563eb',
              color: 'white',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            {t(locale, 'error.reload')}
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
