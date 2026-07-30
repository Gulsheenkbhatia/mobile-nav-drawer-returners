import type { MenuLink } from '../data/mobileMenuData'
import handbagsFixture from '../data/plp-handbags-view-all.json'
import type { PlpPageData } from '../types/plp'
import type { NavReturnerStackEntry } from '../store/navReturnerState'

/** Map a terminal nav link + drill stack to PLP page data (handbags fixture + dynamic meta). */
export function resolvePlpPageData(
  link: MenuLink,
  stack: NavReturnerStackEntry[],
): PlpPageData {
  const base = handbagsFixture as PlpPageData

  const breadcrumbs = stack.map((entry, index) => ({
    label: entry.title,
    href: index < stack.length - 1 ? '#' : undefined,
  }))
  breadcrumbs.push({ label: link.label, href: undefined })

  return {
    ...base,
    categoryName: link.label,
    breadcrumbs,
    totalCount: base.totalCount,
    products: base.products,
  }
}
