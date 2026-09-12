import { createContext, useContext, useEffect } from 'react'

/**
 * What a worksheet and the shell need to agree on.
 *
 * `empty`: a worksheet tells the shell that it currently has nothing to print.
 * Without it the shell rendered the big Print button for every non-interactive
 * worksheet regardless of content, so an impossible setting (multiplication
 * from 9 to 3) left a fully enabled Print button sitting over a blank sheet —
 * while the settings panel's own Print button correctly hid itself. Two Print
 * affordances disagreeing about whether printing was possible.
 *
 * `copies`: how many different sheets one Print should produce. Set from the
 * panel footer, read by every worksheet's useSheetSet. It lives in the shell
 * rather than a worksheet so it survives switching sheets within a visit.
 */
export const SheetStateContext = createContext({
  empty: false,
  setEmpty: () => {},
  copies: 1,
  setCopies: () => {},
})

/** Publish whether this worksheet currently has a printable sheet. */
export function useReportEmpty(isEmpty) {
  const { setEmpty } = useContext(SheetStateContext)
  useEffect(() => {
    setEmpty(isEmpty)
    return () => setEmpty(false)
  }, [isEmpty, setEmpty])
}

export function useSheetEmpty() {
  return useContext(SheetStateContext).empty
}

/** [copies, setCopies]: the number of different sheets a print run deals. */
export function useCopies() {
  const { copies, setCopies } = useContext(SheetStateContext)
  return [copies, setCopies]
}
