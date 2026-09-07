import { useLayoutEffect, useRef, useState } from 'react'

/**
 * Scales a sheet down to fit its container instead of letting it crop.
 *
 * "What the parent approves is what prints" was false on a phone: a
 * three-column Add & Subtract sheet is 457px wide in a 294px column, so the
 * preview showed two and a half columns and cut the third through its
 * numbers. Hiding the overflow is a crop; this is a preview.
 *
 * The wrapper measures its child's natural width (layout width is unaffected
 * by `transform`, so scrollWidth stays honest) and scales the child to fit,
 * then takes the child's scaled height so the page flows correctly. Print
 * ignores all of it — see `.sheet-fit` in App.css.
 *
 * @returns {[import('react').RefObject, object]} ref for the wrapper and the
 *   style object for it
 */
export function usePreviewScale() {
  const ref = useRef(null)
  const [state, setState] = useState({ scale: 1, height: null })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined

    const measure = () => {
      const inner = el.firstElementChild
      if (!inner) return
      const natural = inner.scrollWidth
      const avail = el.clientWidth
      const scale = natural > avail && avail > 0 ? avail / natural : 1
      const height = scale < 1 ? inner.offsetHeight * scale : null
      setState(prev => (prev.scale === scale && prev.height === height ? prev : { scale, height }))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    const inner = el.firstElementChild
    if (inner) observer.observe(inner)
    return () => observer.disconnect()
  }, [])

  const style = state.scale < 1
    ? { '--preview-scale': state.scale, height: state.height }
    : { '--preview-scale': 1 }

  return [ref, style]
}
