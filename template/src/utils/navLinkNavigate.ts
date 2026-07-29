import type { BrandId } from '../components/nav/NavSearchExposed'
import type { MenuLink } from '../data/mobileMenuData'
import { resolveV3SubCategory } from '../data/v3CategoryFixtures'
import { isViewAllNavLink } from './navLinkChevron'

/** Any drill row with an id can be selected for returner highlight. */
export function isNavigableMenuLink(link: {
  id?: string
  href?: string
  label: string
}): boolean {
  return Boolean(link.id) || isViewAllNavLink(link.label, link.id)
}

/** Resolve the link for terminal L2 rows (View All, de luxe, Soldes, etc.). */
export function resolveTerminalSubNavLink(
  categoryId: string,
  subId: string,
  brand: BrandId,
): MenuLink | null {
  const sub = resolveV3SubCategory(categoryId, subId, brand)
  if (!sub) return null

  for (const section of sub.sections) {
    const exact = section.links.find((link) => link.id === subId && link.id)
    if (exact) return exact
  }

  for (const section of sub.sections) {
    const withHref = section.links.find((link) => link.href)
    if (withHref) {
      return {
        ...withHref,
        id: subId,
        label: sub.label,
      }
    }
  }

  return { id: subId, label: sub.label }
}
