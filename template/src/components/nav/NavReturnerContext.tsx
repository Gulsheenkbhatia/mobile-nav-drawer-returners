import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { BrandId } from './NavSearchExposed'
import type { MenuLink } from '../../data/mobileMenuData'
import {
  clearNavReturner,
  getNavReturnerForBrand,
  readNavReturner,
  readNavReturnerState,
  saveNavDrillPosition,
  saveNavReturner,
  type NavReturnerClickedDepth,
  type NavReturnerSelection,
  type NavReturnerStackEntry,
} from '../../store/navReturnerState'

export type NavLinkNavigatePayload = {
  link: MenuLink
  brand: BrandId
  stack: NavReturnerStackEntry[]
}

export type NavSelectionPayload = {
  linkId: string
  label: string
  href?: string
  brand: BrandId
  stack: NavReturnerStackEntry[]
  clickedDepth: NavReturnerClickedDepth
}

type NavReturnerContextValue = {
  selection: NavReturnerSelection | null
  returnerLinkId: string | null
  isReturner: boolean
  recordNavSelection: (payload: NavSelectionPayload) => void
  recordNavLinkVisit: (payload: NavLinkNavigatePayload) => void
  saveDrillPosition: (brand: BrandId, drillStack: NavReturnerStackEntry[]) => void
  clearReturner: () => void
  getRestoredDrillStack: (brand: BrandId) => NavReturnerStackEntry[] | null
  /** @deprecated Use getRestoredDrillStack */
  getRestoredStack: (brand: BrandId) => NavReturnerStackEntry[] | null
}

const NavReturnerContext = createContext<NavReturnerContextValue | null>(null)

export function NavReturnerProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<NavReturnerSelection | null>(() =>
    readNavReturner(),
  )

  const recordNavSelection = useCallback((payload: NavSelectionPayload) => {
    const next: NavReturnerSelection = {
      linkId: payload.linkId,
      label: payload.label,
      href: payload.href,
      brand: payload.brand,
      stack: payload.stack,
      clickedDepth: payload.clickedDepth,
    }
    saveNavReturner(next)
    setSelection(next)
  }, [])

  const recordNavLinkVisit = useCallback(
    ({ link, brand, stack }: NavLinkNavigatePayload) => {
      if (!link.id) return
      const clickedDepth: NavReturnerClickedDepth =
        stack.length >= 2 ? 2 : 1
      recordNavSelection({
        linkId: link.id,
        label: link.label,
        href: link.href,
        brand,
        stack,
        clickedDepth,
      })
    },
    [recordNavSelection],
  )

  const saveDrillPosition = useCallback(
    (brand: BrandId, drillStack: NavReturnerStackEntry[]) => {
      saveNavDrillPosition(brand, drillStack)
    },
    [],
  )

  const clearReturner = useCallback(() => {
    clearNavReturner()
    setSelection(null)
  }, [])

  const getRestoredDrillStack = useCallback((brand: BrandId) => {
    const state = getNavReturnerForBrand(brand)
    return state?.drillStack.length ? state.drillStack : null
  }, [])

  const getRestoredStack = getRestoredDrillStack

  const value = useMemo<NavReturnerContextValue>(
    () => ({
      selection,
      returnerLinkId: selection?.linkId ?? null,
      isReturner: Boolean(selection),
      recordNavSelection,
      recordNavLinkVisit,
      saveDrillPosition,
      clearReturner,
      getRestoredDrillStack,
      getRestoredStack,
    }),
    [
      selection,
      recordNavSelection,
      recordNavLinkVisit,
      saveDrillPosition,
      clearReturner,
      getRestoredDrillStack,
      getRestoredStack,
    ],
  )

  return (
    <NavReturnerContext.Provider value={value}>{children}</NavReturnerContext.Provider>
  )
}

export function useNavReturner(): NavReturnerContextValue {
  const ctx = useContext(NavReturnerContext)
  if (!ctx) {
    throw new Error('useNavReturner must be used within NavReturnerProvider')
  }
  return ctx
}

export function useOptionalNavReturner(): NavReturnerContextValue | null {
  return useContext(NavReturnerContext)
}

export { readNavReturnerState }
