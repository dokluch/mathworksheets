import { Component } from 'react'
import { t } from '../i18n/index.js'
import { localeFromPath } from '../hooks/useRoute.js'

/** Locale of the current URL: this boundary sits outside the LocaleContext provider. */
function currentLocale() {
  return typeof window === 'undefined' ? 'en' : localeFromPath(window.location.pathname)
}

/*
 * The crash screen is the one surface that renders when everything else has
 * failed, so it carries no component classes and no imported stylesheet —
 * only the tokens from index.css, which are on the root regardless of what
 * fell over. It used to hard-code the old blue and slate.
 */
const styles = {
  wrap: { padding: '48px 20px', textAlign: 'center', fontFamily: 'var(--font-ui)', color: 'var(--color-text)' },
  title: { fontFamily: 'var(--font-cover)', fontSize: 25, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 },
  hint: { color: 'var(--color-text-muted)', marginBottom: 20 },
  button: {
    minHeight: 44,
    padding: '10px 20px',
    borderRadius: 2,
    border: 'none',
    background: 'var(--mark)',
    color: '#fff',
    fontFamily: 'inherit',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
  },
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
        <div style={styles.wrap}>
          <h1 style={styles.title}>{t(locale, 'error.title')}</h1>
          <p style={styles.hint}>{t(locale, 'error.hint')}</p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false })
              window.location.reload()
            }}
            style={styles.button}
          >
            {t(locale, 'error.reload')}
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
