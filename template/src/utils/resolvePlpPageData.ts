import type { BrandId } from '../components/nav/NavSearchExposed'
import type { MenuLink } from '../data/mobileMenuData'
import handbagsFixture from '../data/plp-handbags-view-all.json'
import sneakersFixture from '../data/plp-sneakers-women.json'
import type { PlpPageData } from '../types/plp'
import type { NavReturnerStackEntry } from '../store/navReturnerState'
import { matchPlpDemoFlow } from './plpDemoFlows'

const PLP_FIXTURES: Record<string, PlpPageData> = {
  'bags-view-all': handbagsFixture as PlpPageData,
  'women-shoes-sneakers': sneakersFixture as PlpPageData,
}

/** Map a whitelisted demo nav link + drill stack to PLP page data. */
export function resolvePlpPageData(
  link: MenuLink,
  stack: NavReturnerStackEntry[],
  brand: BrandId,
): PlpPageData | null {
  const flow = matchPlpDemoFlow(link, stack, brand)
  if (!flow) return null

  const base = PLP_FIXTURES[flow.id]
  if (!base) return null

  const breadcrumbs = stack.map((entry, index) => ({
    label: entry.title,
    href: index < stack.length - 1 ? '#' : undefined,
  }))
  breadcrumbs.push({ label: link.label, href: undefined })

  return {
    ...base,
    categoryName: flow.plpTitle,
    breadcrumbs,
    totalCount: base.totalCount,
    products: base.products,
  }
}
