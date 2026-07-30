import type { BrandId } from '../components/nav/NavSearchExposed'
import type { MenuLink } from '../data/mobileMenuData'
import type { NavReturnerStackEntry } from '../store/navReturnerState'

/** Prototype PLP clickthrough — Coach retail only. */
export type PlpDemoFlowId = 'bags-view-all' | 'women-shoes-sneakers'

const PLP_DEMO_FLOWS: Array<{
  id: PlpDemoFlowId
  categoryId: string
  /** When set, requires stack[1].id to match (L3 terminal links). */
  subCategoryId?: string
  linkId: string
  plpTitle: string
}> = [
  {
    id: 'bags-view-all',
    categoryId: 'bags',
    linkId: 'view-all',
    plpTitle: 'Handbags for Women',
  },
  {
    id: 'women-shoes-sneakers',
    categoryId: 'coach-women',
    subCategoryId: 'coach-women-shoes',
    linkId: 'coach-women-shoes-sneakers',
    plpTitle: 'Sneakers for Women',
  },
]

export function matchPlpDemoFlow(
  link: MenuLink,
  stack: NavReturnerStackEntry[],
  brand: BrandId,
): (typeof PLP_DEMO_FLOWS)[number] | null {
  if (brand !== 'coach') return null

  const categoryId = stack[0]?.id
  if (!categoryId) return null

  return (
    PLP_DEMO_FLOWS.find((flow) => {
      if (flow.categoryId !== categoryId || flow.linkId !== link.id) return false
      if (flow.subCategoryId) {
        return stack[1]?.id === flow.subCategoryId
      }
      return stack.length === 1
    }) ?? null
  )
}

export function isPlpDemoLink(
  link: MenuLink,
  stack: NavReturnerStackEntry[],
  brand: BrandId,
): boolean {
  return matchPlpDemoFlow(link, stack, brand) !== null
}

export function getPlpDemoTitle(
  link: MenuLink,
  stack: NavReturnerStackEntry[],
  brand: BrandId,
): string | null {
  return matchPlpDemoFlow(link, stack, brand)?.plpTitle ?? null
}
