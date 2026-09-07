import { createContext, useContext, useEffect } from 'react'

/**
 * Lets a worksheet tell the shell that it currently has nothing to print.
 *
 * Without it the shell rendered the big Print button for every non-interactive
 * worksheet regardless of content, so an impossible setting (multiplication
 * from 9 to 3) left a fully enabled Print button sitting over a blank sheet —
 * while the settings panel's own Print button correctly hid itself. Two Print
 * affordances disagreeing about whether printing was possible.
 */
export const SheetStateContext = createContext({ empty: false, setEmpty: () => {} })

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
