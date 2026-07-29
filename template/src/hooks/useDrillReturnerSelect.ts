import { useCallback } from 'react'
import type { BrandId } from '../components/nav/NavSearchExposed'
import { useOptionalNavReturner } from '../components/nav/NavReturnerContext'
import type { MenuLink } from '../data/mobileMenuData'
import type { NavReturnerStackEntry } from '../store/navReturnerState'

export function useDrillReturnerSelect(
  brand: BrandId,
  stack: NavReturnerStackEntry[],
  onAfterSelect?: () => void,
) {
  const returner = useOptionalNavReturner()

  const onNavigateLink = useCallback(
    (link: MenuLink) => {
      if (!returner) return
      returner.recordNavLinkVisit({ link, brand, stack })
      onAfterSelect?.()
    },
    [returner, brand, stack, onAfterSelect],
  )

  return {
    returnerLinkId: returner?.returnerLinkId ?? null,
    onNavigateLink: returner ? onNavigateLink : undefined,
  }
}
