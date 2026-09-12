import { useCallback, useEffect, useMemo, useState } from 'react'
import { useCopies } from '../components/SheetState'
import { parseSet, randomSet, setSequence, sheetRng } from '../lib/sheetSet'

function setFromUrl() {
  if (typeof window === 'undefined') return null
  return parseSet(new URLSearchParams(window.location.search).get('set'))
}

/**
 * The set number of a worksheet and the sheets it deals.
 *
 * `generate(rng)` builds one sheet's data from a random source; it is called
 * once per copy with a source seeded by that copy's set number, so the page
 * follows from the number rather than the other way round. `deps` are the
 * settings the generator closes over, exactly as for useMemo.
 *
 * The number comes from `?set=` when the URL carries one, so a reload or a
 * link sent to a friend brings back the same page (with the same settings),
 * and is written back there whenever it changes. Regenerate deals a fresh
 * random number; typing one into the header stamp sets it exactly.
 *
 * @returns {{ set: number, setSet: (value: string | number) => void,
 *   regenerate: () => void, sheets: Array<{ set: number, data: unknown }> }}
 */
export function useSheetSet(generate, deps) {
  const [set, setSetState] = useState(() => setFromUrl() ?? randomSet())
  const [copies] = useCopies()

  const sheets = useMemo(
    () => setSequence(set, copies).map(s => ({ set: s, data: generate(sheetRng(s)) })),
    // The generator's own inputs are listed by the caller, as for useMemo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps, set, copies],
  )

  // A draw equal to the current number would leave the stamp still and the
  // page unchanged, which is Regenerate doing nothing.
  const regenerate = useCallback(() => {
    setSetState(prev => {
      let next = randomSet()
      while (next === prev) next = randomSet()
      return next
    })
  }, [])

  const setSet = useCallback(value => {
    const next = parseSet(value)
    if (next != null) setSetState(next)
  }, [])

  useEffect(() => {
    const url = new URL(window.location.href)
    if (url.searchParams.get('set') === String(set)) return
    url.searchParams.set('set', String(set))
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
  }, [set])

  return { set, setSet, regenerate, sheets }
}
